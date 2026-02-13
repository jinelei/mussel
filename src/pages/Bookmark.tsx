import React, {useEffect, useMemo, useRef, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation, useNavigate} from "react-router-dom";
import {
    Button,
    Flex,
    FloatButton,
    Form, type GetProps,
    Input,
    message,
    Modal,
    Popconfirm,
    Select, Typography
} from "antd";
import styles from './Bookmark.module.css';
import {useDispatch} from "react-redux";
import {setLoading} from "../store";
import {PlusOutlined} from "@ant-design/icons";
import {
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import {closestCorners, DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import dayjs from "dayjs";
import SortableBookmark from "../components/SortableBookmark.tsx";

const {Search} = Input;

type SearchProps = GetProps<typeof Input.Search>;

enum OperateType {
    CREATE,
    UPDATE
}

const Bookmark: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const [bookmarkFolder, setBookmarkFolder] = useState<BookmarkDomain[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operateType, setOperateType] = useState<OperateType>(OperateType.CREATE);
    const [form] = Form.useForm();

    const [value, setValue] = useState<string>();
    const [currentTime, setCurrentTime] = useState(dayjs());
    const formattedTime = currentTime.format('HH:mm:ss');
    const formattedDate = currentTime.format('YYYY年MM月DD日');
    const searchInputRef = useRef<React.ElementRef<typeof Input>>(null);

    const navigate = useNavigate();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // 移动端常用配置：长按 200ms 激活拖拽，防止滚动误触
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;
        if (active.id === over?.id) return;
        const parentId = active?.data?.current?.item?.parentId;
        if (parentId !== over?.data?.current?.item?.parentId) {
            return;
        }
        const find = bookmarks?.filter(it => it?.id === parentId).find(() => true);
        const children = find?.children || [];
        const oldIndex = children?.findIndex(item => item.id === active.id);
        const newIndex = children?.findIndex(item => item.id === over?.id);
        if (
            oldIndex < 0 ||
            newIndex < 0 ||
            oldIndex >= children.length ||
            newIndex >= children.length ||
            oldIndex === newIndex
        ) {
            return;
        }
        const newArray = [...children];
        const [movedItem] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, movedItem);
        const map = bookmarks?.map(it => {
            if (it.id === parentId) {
                return {...find, children: newArray}
            } else {
                return it;
            }
        });
        setBookmarks(map);
        setTimeout(() => {
            // 这里仅仅更新排序,不做重新刷新
            Service.bookmarkSort(newArray.map(it => it.id as number))
                .then(res => {
                    message.open({
                        type: res.code === 200 ? 'success' : 'error',
                        content: res.message
                    })
                }).finally(() => {
            })
        }, 500);
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
                }
            }).catch(reason => {
            console.warn(reason)
        }).finally(() => dispatch(setLoading(false)));
    };

    const showModal = (e: React.MouseEvent<HTMLElement>, id: number | undefined) => {
        e.stopPropagation();
        setOperateType(!!id ? OperateType.UPDATE : OperateType.CREATE);
        if (id) {
            Service.bookmarkGet({id}).then(res => {
                if (200 === res.code) {
                    form.setFieldsValue({...res.data});
                    setIsModalOpen(true);
                } else {
                    message.error("获取书签详情失败").then(() => {
                    });
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
                }).then(() => {
                });
            }).finally(() => {
            setIsModalOpen(false);
            fetchList();
        })
    }

    const handleOk = () => {
        if (operateType === OperateType.UPDATE) {
            Service.bookmarkUpdate({...form.getFieldsValue()})
                .then(res => {
                    message.open({
                        content: res.code === 200 ? '更新成功' : '更新失败',
                        type: res.code === 200 ? 'success' : 'error'
                    }).then(() => {
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

    const onSearch: SearchProps['onSearch'] = (value) => {
        const keyword = encodeURIComponent(value.trim());
        if (keyword) {
            const encodedAction = encodeURIComponent(JSON.stringify({
                pluginId: "Send_Message",
                payload: {text: decodeURIComponent(keyword)}
            }));
            const url = `https://www.doubao.com/chat/url-action?action=${encodedAction}`;
            try {
                setTimeout(() => {
                    searchInputRef.current?.blur();
                    setValue('');
                }, 100);
            } catch (error) {
                console.error('失焦操作失败:', error);
            }
            window.open(url, '_blank');
        }
    }

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            message.success("复制成功")
        } catch (err) {
            console.error('复制失败：', err);
            message.error('❌ 复制失败，请手动复制');
        }
    };

    const onNavItemClick = (_: React.MouseEvent<HTMLElement>, item: BookmarkDomain) => {
        if (!item.url) {
            message.error("敬请期待").then(_ => {
            });
        } else if (item.url.startsWith('http')) {
            window.open(item.url, '_blank');
        } else if (item.url.startsWith('/')) {
            navigate(item.url)
        } else {
            message.error("敬请期待").then(_ => {
            });
        }
    }

    useEffect(() => {
        fetchFolder();
        fetchList();
    }, [location.pathname]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTime]);

    return (
        <Flex align="flex-start" justify="center" vertical className={styles.container}>
            <Flex vertical align='center' justify='center' className={styles.searchContainer}>
                <Typography.Text className={styles.time}
                                 onClick={() => copyToClipboard(formattedTime)}
                >{formattedTime}</Typography.Text>
                <Typography.Text className={styles.date}
                                 onClick={() => copyToClipboard(formattedDate)}
                >{formattedDate}</Typography.Text>
                <Search
                    ref={searchInputRef}
                    placeholder="请输入"
                    allowClear
                    enterButton
                    size="large"
                    className={styles.search}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onSearch={onSearch}
                    // onFocus={() => setIsSearchFocused(true)}
                    // onBlur={() => setIsSearchFocused(false)}
                />
            </Flex>
            {bookmarks?.map(it => {
                return (<Flex vertical align='center' className={styles.group} key={'category_' + it.id}>
                    <Flex align="center" justify="space-between" key={'category_item_' + it.id}>
                        <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                    </Flex>
                    <Flex gap={16} wrap="wrap" justify='center' align='center' className={styles.list}
                          key={'category_list_' + it.id}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={(it.children || []).map(item => item.id as number)}
                                strategy={horizontalListSortingStrategy}
                            >
                                {(it.children || []).map(item => (
                                    <SortableBookmark
                                        onEdit={(e: React.MouseEvent<HTMLElement, MouseEvent>) => showModal(e, item?.id as number)}
                                        onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => onNavItemClick(e, item)}
                                        key={item.id} item={item}
                                        classNameContainer={styles.dragContainer}
                                        classNameContainerDrag={styles.dragContainerDrag}
                                        classNameIcon={styles.dragIcon}
                                        classNameTitle={styles.dragTitle}
                                        classNameDrag={styles.dragDrag}
                                        classNameEdit={styles.dragEdit}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </Flex>
                </Flex>)
            })}
            <Modal
                className={styles.modalContainer}
                maskClosable={false}
                title={operateType === OperateType.UPDATE ? '修改书签' : "添加书签"}
                okText={operateType === OperateType.CREATE ? '更新' : "添加"}
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
                                        display: operateType === OperateType.UPDATE ? 'inline-flex' : 'none',
                                    }} danger>删除</Button>
                        </Popconfirm>
                        <Button onClick={handleCancel}>取消</Button>
                        <Button onClick={handleOk}
                                type={"primary"}>{operateType === OperateType.UPDATE ? '更新' : "添加"}</Button>
                    </>
                }
            >
                <Form
                    form={form}
                    className={styles.modalForm}
                >
                    <Form.Item name="id" label="ID" rules={[{required: operateType === OperateType.CREATE}]}
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
                onClick={(e) => showModal(e, undefined)}
                shape="circle"
                type="primary"
                icon={<PlusOutlined/>}
            />
        </Flex>
    )
}

export default Bookmark;
