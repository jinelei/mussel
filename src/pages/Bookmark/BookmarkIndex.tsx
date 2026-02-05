import {useEffect, useState} from "react";
import {BookmarkDomain, Service} from "../../api";
import {useLocation} from "react-router-dom";
import {Flex, Form, Input, message, Modal, Select, Typography} from "antd";
import styles from './BookmarkIndex.module.css';
import DynamicIcon from "../../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {setLoading} from "../../store";

const BookmarkIndex: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const init = () => {
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
    const showModal = (id: number) => {
        Service.bookmarkGet({id}).then(res => {
            if (200 === res.code) {
                form.setFieldsValue({...res.data});
                setIsModalOpen(true);
            } else {
                message.error("获取书签详情失败");
            }
        })
    };

    const handleOk = () => {
        if (form.getFieldValue('id')) {
            Service.bookmarkUpdate({...form.getFieldsValue()})
                .then(res => {
                    message.open({
                        content: res.code === 200 ? '更新成功' : '更新失败',
                        type: res.code === 200 ? 'success' : 'error'
                    });
                }).finally(() => {
                setIsModalOpen(false);
                init();
            })
        } else {
            Service.bookmarkCreate({...form.getFieldsValue()})
                .then(res => {
                    message.open({
                        content: res.code === 200 ? '添加成功' : '添加失败',
                        type: res.code === 200 ? 'success' : 'error'
                    });
                }).finally(() => {
                setIsModalOpen(false);
                init();
            })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        init();
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
                maskClosable={false}
                title={form.getFieldValue('id') ? '修改书签' : "添加书签"}
                okText={form.getFieldValue('id') ? '更新' : "添加"}
                cancelText={'取消'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    style={{maxWidth: 600}}
                >
                    <Form.Item name="id" label="ID" rules={[{required: true}]}
                               style={{display: form.getFieldValue('id') ? 'none' : 'block'}}
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
                </Form>
            </Modal>
        </Flex>
    )
}

export default BookmarkIndex;
