import {useEffect, useMemo, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation} from "react-router-dom";
import {
    Button,
    Card,
    Divider,
    Flex,
    FloatButton,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select, Space,
    Typography
} from "antd";
import styles from './Bookmark.module.css';
import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {setLoading} from "../store";
import {MenuOutlined, PlusOutlined} from "@ant-design/icons";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {closestCorners, DndContext, type DragEndEvent} from "@dnd-kit/core";

import {CSS} from '@dnd-kit/utilities';

// 定义卡片数据类型
interface CardItem {
    id: string | number;
    title: string;
    content: string;
}

// 封装可排序的Card组件
const SortableCard = ({item}: { item: CardItem }) => {
    // 使用dnd-kit的useSortable hook
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id, // 唯一标识（必须）
        data: {
            type: 'card',
            item
        }
    });

    // 拖拽时的样式（半透明+提升层级）
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 16,
        cursor: 'grab',
        // 拖拽时提升z-index，避免被遮挡
        zIndex: isDragging ? 1000 : 1,
        // 防止拖拽时卡片变形
        boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
    };

    return (
        <Card
            ref={setNodeRef} // 绑定拖拽节点
            title={item.title}
            style={style}
            headStyle={{paddingRight: 16}}
            // 拖拽手柄（仅点击图标可拖拽）
            extra={
                <MenuOutlined
                    style={{cursor: 'grab'}}
                    {...attributes} // 绑定拖拽属性
                    {...listeners} // 绑定拖拽事件
                />
            }
        >
            <Typography.Paragraph>{item.content}</Typography.Paragraph>
        </Card>
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

    const [cardItems, setCardItems] = useState<CardItem[]>([
        {id: 1, title: '卡片 1', content: '这是基于dnd-kit的可拖拽卡片 1'},
        {id: 2, title: '卡片 2', content: '这是基于dnd-kit的可拖拽卡片 2'},
        {id: 3, title: '卡片 3', content: '这是基于dnd-kit的可拖拽卡片 3'},
        {id: 4, title: '卡片 4', content: '这是基于dnd-kit的可拖拽卡片 4'},
    ]);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        // 拖拽到自身位置，不处理
        if (active.id === over?.id) return;

        // 更新卡片顺序
        setCardItems(prevItems => {
            const oldIndex = prevItems.findIndex(item => item.id === active.id);
            const newIndex = prevItems.findIndex(item => item.id === over?.id);

            // 数组重排（原生实现，无需额外依赖）
            const newItems = [...prevItems];
            [newItems[oldIndex], newItems[newIndex]] = [newItems[newIndex], newItems[oldIndex]];

            console.log('排序后的卡片:', newItems.map(item => item.id));
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
        Service.bookmarkTree({})
            .then(res => {
                if (200 === res.code) {
                    setBookmarks(res.data);
                    const result = res.data.filter(it => it.name === '收藏');
                    if (result.length == 1) {
                        console.log("result", result[0].children);
                        setCardItems(result[0].children.map(it => {
                            return {
                                id: it.id,
                                title: it.name,
                                content: it.url
                            };
                        }))
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

    useEffect(() => {
        fetchFolder();
        fetchList();
    }, [location.pathname]);

    return (
        <Flex gap="middle" align="flex-start" justify="center" vertical className={styles.container}>
            <div style={{maxWidth: 800, margin: '0 auto', padding: '20px 0'}}>
                <Typography.Title level={3} style={{textAlign: 'center', margin: '24px 0'}}>
                    Antd Card + @dnd-kit 拖拽排序示例
                </Typography.Title>
                <Divider/>

                {/* DndContext 提供拖拽上下文 */}
                <DndContext
                    collisionDetection={closestCorners} // 碰撞检测策略
                    // keyboardCoordinates={sortableKeyboardCoordinates} // 支持键盘操作
                    onDragEnd={handleDragEnd} // 拖拽结束回调
                >
                    {/* SortableContext 管理可排序列表 */}
                    <SortableContext
                        items={cardItems.map(item => item.id)} // 可排序项ID列表
                        strategy={verticalListSortingStrategy} // 垂直排序策略
                    >
                        <div style={{padding: 24}}>
                            {cardItems.map(item => (
                                <SortableCard key={item.id} item={item}/>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* 显示当前排序 */}
                <Space direction="vertical" style={{marginTop: 24, width: '100%', padding: '0 24px'}}>
                    <Typography.Text strong>当前排序ID：</Typography.Text>
                    <Typography.Text>
                        {cardItems.map(item => item.id).join(' → ')}
                    </Typography.Text>
                </Space>
            </div>
            {bookmarks?.map(it => {
                return (<div className={styles.group}>
                    <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                    <div className={styles.list}>
                        {(it.children || []).map(iit => {
                            return <div onClick={() => showModal(iit?.id as number)}
                                        className={styles.listItem}
                                        style={{color: `${iit.color}`}}>
                                <DynamicIcon iconName={iit.icon} size={'1rem'}/>
                                <Typography.Text>{iit.name}</Typography.Text>
                            </div>
                        })}
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
