import {useEffect, useMemo, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation} from "react-router-dom";
import {Button, Flex, FloatButton, Form, Input, message, Modal, Popconfirm, Select, Typography} from "antd";
import styles from './Bookmark.module.css';
import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {setLoading} from "../store";
import {PlusOutlined} from "@ant-design/icons";

const Bookmark: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const [bookmarkFolder, setBookmarkFolder] = useState<BookmarkDomain[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [operateType, setOperateType] = useState<('create' | 'update')>('create');
    const [form] = Form.useForm();

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
