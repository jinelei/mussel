import {useEffect, useMemo, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation} from "react-router-dom";
import {
    Button,
    Flex,
    FloatButton,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select, Typography
} from "antd";
import styles from './Bookmark.module.css';
import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {setLoading} from "../store";
import {CheckOutlined, CloseOutlined, DragOutlined, PlusOutlined} from "@ant-design/icons";
import {
    horizontalListSortingStrategy,
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";
import {closestCorners, DndContext, type DragEndEvent} from "@dnd-kit/core";

import {CSS} from '@dnd-kit/utilities';

const SortableCard = ({item, className}: { item: BookmarkDomain, className: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id as number,
        data: {
            type: 'custom-div',
            item
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.08)',
        backgroundColor: 'rgba(37,128,38,0.5)',
        cursor: 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={className}
            {...attributes}
            {...listeners}
        >
            <DynamicIcon iconName={item.icon} size={'1rem'}/>
            <Typography.Text>{item.name}</Typography.Text>
        </div>
    );
};

const Bookmark: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const [bookmarkFolder, setBookmarkFolder] = useState<BookmarkDomain[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operateType, setOperateType] = useState<('create' | 'update')>('create');
    const [form] = Form.useForm();

    const [sortBookmark, setSortBookmark] = useState<number>();
    const [cardItems, setCardItems] = useState<BookmarkDomain[]>([]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        if (active.id === over?.id) return;
        setCardItems(prevItems => {
            const oldIndex = prevItems.findIndex(item => item.id === active.id);
            const newIndex = prevItems.findIndex(item => item.id === over?.id);

            const newItems = [...prevItems];
            [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];
            return newItems;
        });
    };

    const folderList = useMemo(() => {
        return (bookmarkFolder || [])
            .filter(i => i.name)
            .filter(i => i.id)
            .map(item => ({value: item.id, label: item.name}));
    }, [bookmarkFolder]);

    const fetchFolder = () => {
        Service.bookmarkList({type: BookmarkDomain.type.FOLDER})
            .then(res => {
                if (200 === res.code) {
                    setBookmarkFolder(res.data);
                }
            }).catch(reason => {
            console.warn(reason)
        });
    };

    const fetchList = () => {
        dispatch(setLoading(true));
        Service.bookmarkTree()
            .then(res => {
                if (200 === res.code) {
                    setBookmarks(res.data);
                    const result = res.data.filter((it: BookmarkDomain) => it.name === '收藏');
                    if (result.length == 1) {
                        console.log("result", result[0].children);
                        setCardItems(result[0].children);
                    }
                }
            }).catch(reason => {
            console.warn(reason)
        }).finally(() => dispatch(setLoading(false)));
    };

    const showModal = (id: number | undefined) => {
        setOperateType(!!id ? 'update' : 'create');
        if (id) {
            Service.bookmarkGet({id}).then(res => {
                if (200 === res.code) {
                    form.setFieldsValue({...res.data});
                    setIsModalOpen(true);
                } else {
                    message.error("获取书签详情失败");
                }
            })
        } else {
            form.resetFields();
            setIsModalOpen(true);
        }
    };

    const handleDelete = () => {
        Service.bookmarkDelete({...form.getFieldsValue()})
            .then(res => {
                message.open({
                    content: res.code === 200 ? '删除成功' : '删除失败',
                    type: res.code === 200 ? 'success' : 'error'
                });
            }).finally(() => {
            setIsModalOpen(false);
            fetchList();
        })
    }

    const handleOk = () => {
        if (operateType === 'update') {
            Service.bookmarkUpdate({...form.getFieldsValue()})
                .then(res => {
                    message.open({
                        content: res.code === 200 ? '更新成功' : '更新失败',
                        type: res.code === 200 ? 'success' : 'error'
                    });
                }).finally(() => {
                setIsModalOpen(false);
                fetchList();
            })
        } else {
            Service.bookmarkCreate({...form.getFieldsValue()})
                .then(res => {
                    message.open({
                        content: res.code === 200 ? '添加成功' : '添加失败',
                        type: res.code === 200 ? 'success' : 'error'
                    }).then(_ => {
                    });
                }).finally(() => {
                setIsModalOpen(false);
                fetchList();
            })
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onSortStart = (id: number | undefined, children: BookmarkDomain[] | undefined) => {
        setSortBookmark(id as number);
        setCardItems(children || []);
    }

    const onSortEnd = (type: 'ok' | 'cancel') => {
        if (type === 'ok') {
            Service.bookmarkSort(cardItems.map(it => it.id as number))
                .then(res => {
                    message.open({
                        type: res.code === 200 ? 'success' : 'error',
                        content: res.message
                    })
                }).finally(() => {
                setSortBookmark(undefined);
                setCardItems([]);
                fetchList();
            })
        } else {
            setSortBookmark(undefined);
            setCardItems([]);
        }
    }

    useEffect(() => {
        // Service.bookmarkSort(cardItems.map(i => i.id as number))
        //     .then(res => {
        //         message.open({
        //             type: res.code === 200 ? 'success' : 'error',
        //             content: res.code === 200 ? "排序成功" : "排序失败"
        //         })
        //     })
    }, [cardItems]);

    useEffect(() => {
        fetchFolder();
        fetchList();
    }, [location.pathname]);

    return (
        <Flex gap="middle" align="flex-start" justify="center" vertical className={styles.container}>
            {bookmarks?.map(it => {
                return (<div className={styles.group}>
                    <Flex align="center" justify="space-between">
                        <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                        {
                            sortBookmark === it.id
                                ?
                                <div>
                                    <CloseOutlined onClick={() => onSortEnd("cancel")}
                                                   className={styles.groupOperateSortCancel}/>
                                    <CheckOutlined onClick={() => onSortEnd("ok")}
                                                   className={styles.groupOperateSortOk}/>
                                </div>
                                :
                                <DragOutlined onClick={() => onSortStart(it.id, it.children)}
                                              className={styles.groupOperateSort}/>
                        }
                    </Flex>
                    <div className={styles.list}>
                        {sortBookmark === it.id
                            ?
                            <DndContext
                                collisionDetection={closestCorners}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={cardItems.map(item => item.id as number)}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    {cardItems.map(item => (
                                        <SortableCard className={styles.listItem} key={item.id} item={item}/>
                                    ))}
                                </SortableContext>
                            </DndContext>
                            :
                            (it.children || []).map(iit => {
                                return <div onClick={() => showModal(iit?.id as number)}
                                            className={styles.listItem}
                                            style={{color: `${iit.color}`}}>
                                    <DynamicIcon iconName={iit.icon} size={'1rem'}/>
                                    <Typography.Text>{iit.name}</Typography.Text>
                                </div>
                            })
                        }
                    </div>
                </div>)
            })}
            <Modal
                className={styles.modalContainer}
                maskClosable={false}
                title={operateType === 'update' ? '修改书签' : "添加书签"}
                okText={operateType === 'update' ? '更新' : "添加"}
                cancelText={'取消'}
                open={isModalOpen}
                footer={
                    <>
                        <Popconfirm
                            title="确认删除"
                            description="删除后将不可恢复!"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={handleDelete}
                        >
                            <Button type={"primary"}
                                    style={{
                                        display: operateType === 'update' ? 'inline-flex' : 'none',
                                    }} danger>删除</Button>
                        </Popconfirm>
                        <Button onClick={handleCancel}>取消</Button>
                        <Button onClick={handleOk}
                                type={"primary"}>{operateType === 'update' ? '更新' : "添加"}</Button>
                    </>
                }
            >
                <Form
                    form={form}
                    className={styles.modalForm}
                >
                    <Form.Item name="id" label="ID" rules={[{required: operateType === 'create'}]}
                               style={{display: 'none'}}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="url" label="地址" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="icon" label="图标" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="color" label="颜色" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="type" label="类型" rules={[{required: true}]}>
                        <Select placeholder="请选择书签类型"
                                options={[
                                    {label: '文件夹', value: 'FOLDER'},
                                    {label: '书签', value: 'ITEM'},
                                ]}
                        />
                    </Form.Item>
                    <Form.Item name="parentId" label="所属上级" rules={[{required: false}]}>
                        <Select placeholder="请选择上级" options={folderList}/>
                    </Form.Item>
                </Form>
            </Modal>
            <FloatButton
                onClick={() => showModal(undefined)}
                shape="circle"
                type="primary"
                icon={<PlusOutlined/>}
            />
        </Flex>
    )
}

export default Bookmark;
