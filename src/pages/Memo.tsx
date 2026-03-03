import React, {useEffect, useState} from 'react';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import 'dayjs/locale/zh-cn';
import styles from './Memo.module.css';
import {Affix, Button, Divider, Flex, Input, message, Typography} from "antd";
import {Calendar} from "react-calendar";
import dayjs from "dayjs";
import {type MemoResponse, type MemoTagResponse, Service} from "../api";
import {useNavigate} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

dayjs.locale('zh-cn');

const Memo: React.FC = () => {
    const [tags, setTags] = useState<MemoTagResponse[] | undefined>([]);
    const [currentTag, setCurrentTag] = useState<MemoTagResponse>();
    const [memos, setMemos] = useState<MemoResponse[] | undefined>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    });
    const navigate = useNavigate();

    const handleDateChange = (value: Value) => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            const normalizedDate = dayjs(value).startOf('day').toDate();
            setSelectedDate(normalizedDate);
            message.success(`当前日期: ${dayjs(normalizedDate).format('YYYY-MM-DD')}`).then(() => {
            });
        } else {
            message.warning('请选择有效的日期').then(() => {
            });
        }
    };

    const handleSelectTag = (value: MemoTagResponse | undefined) => {
        if (currentTag === value) {
            setCurrentTag(undefined);
        } else {
            setCurrentTag(value);
        }
        fetchMemos();
    }

    const handlePreviewMemo = (value: MemoResponse) => {
        if (value?.id) {
            navigate(`/memo/preview/${value?.id}`);
        }
    };

    const handleEditwMemo = (value: MemoResponse) => {
        if (value?.id) {
            navigate(`/memo/edit/${value?.id}`);
        }
    };

    const fetchMemoTags = () => {
        Service.memoTags()
            .then(res => {
                if (200 === res.code) {
                    setTags(res.data);
                } else {
                    message.error({content: res.message}).then();
                }
            })
    }

    const fetchMemos = () => {
        Service.memoPage({query: {tagId: currentTag?.id}})
            .then(res => {
                if (200 === res.code) {
                    setMemos(res.data);
                } else {
                    message.error({content: res.message}).then();
                }
            })
    }

    useEffect(() => {
        fetchMemos();
        fetchMemoTags();
    }, [location.pathname]);

    // @ts-ignore
    return (
        <Flex vertical className={styles.container}>
            <Flex justify="flex-end">
                <Affix offsetBottom={10}>
                    <Button type="primary" onClick={(_) => navigate("/memo/new")}>添加</Button>
                </Affix>
            </Flex>
            <Flex>
                <Flex gap={8} vertical align='center' justify='flex-start' className={styles.leftContainer}>
                    <Input.Search></Input.Search>
                    <Calendar
                        className={styles.calendar}
                        onChange={handleDateChange}
                        showNavigation={false}
                        formatDay={(_, date) => dayjs(date).format('DD')}
                        formatShortWeekday={(_, date) => dayjs(date).format('dd')}
                        value={selectedDate}/>
                    <Divider/>
                    <Flex gap={4} className={styles.tagContainer} align="flex-start" justify="flex-start" wrap={true}>
                        {tags?.map(it => {
                            return <Typography.Text onClick={_ => handleSelectTag(it)} key={`tag_${it.id}`}
                                                    className={`${styles.tag} ${it.id === currentTag?.id ? styles.tagActive : ''}`}
                            >{it.title} </Typography.Text>
                        })}
                    </Flex>
                </Flex>
                <Flex gap={8} vertical flex={1} className={styles.rightContainer}>
                    {memos?.map(it => {
                        return <Flex justify="space-between" className={styles.memoContainer} key={`memo_${it.id}`}>
                            <Flex flex={1} vertical onClick={_ => handlePreviewMemo(it)}>
                                <Flex align="center">
                                    <Typography.Text className={styles.memoTitle}>{it.title}</Typography.Text>
                                    <Typography.Text className={styles.memoSubTitle}>{it.subTitle}</Typography.Text>
                                </Flex>
                                <Flex wrap={true}>
                                    {it.tags?.map(iit => {
                                        return <Typography.Text key={`tag_${it.id}`} className={styles.tag}>{iit.title}</Typography.Text>
                                    })}
                                </Flex>
                                <Flex>
                                    <Typography.Text
                                        className={styles.memoTime}>{it.updateTime ? dayjs(it.updateTime).format("YYYY-MM-DD HH:mm:ss") : ''}</Typography.Text>
                                </Flex>
                            </Flex>
                            <Flex onClick={_ => handleEditwMemo(it)}>
                                <EditOutlined className={styles.editIcon}/>
                            </Flex>
                        </Flex>
                    })}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Memo;