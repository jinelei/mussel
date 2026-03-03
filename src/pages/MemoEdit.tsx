import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeMermaidjs from 'rehype-mermaidjs';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import 'dayjs/locale/zh-cn';
import styles from './MemoEdit.module.css';
import {Flex, message, Typography, Input, Button, Affix, Space} from "antd";
import dayjs from "dayjs";
import {type MemoResponse, Service} from "../api";
import {useNavigate, useParams} from "react-router-dom";

dayjs.locale('zh-cn');

const MemoEdit: React.FC = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [memo, setMemo] = useState<MemoResponse | undefined>();

    const fetchMemo = () => {
        console.log(`params.id: ${params.id}`)
        if (params.id !== "new") {
            Service.memoGet({id: parseInt(params.id as string)})
                .then(res => {
                    if (200 === res.code) {
                        setMemo(res.data);
                    } else {
                        message.error({content: res.message}).then();
                    }
                })
        } else {
            setMemo({})
        }
    }

    const handleEditMemo = () => {
        if (memo?.id) {
            Service.memoUpdate({
                id: memo.id,
                title: memo.title as string,
                subTitle: memo.subTitle as string,
                content: memo.content as string,
                orderNumber: 0,
            })
                .then(res => {
                    if (200 === res.code) {
                        message.success({content: res.message}).then();
                    } else {
                        message.error({content: res.message}).then();
                    }
                })
        } else {
            Service.memoCreate({
                title: memo?.title as string,
                subTitle: memo?.subTitle as string,
                content: memo?.content as string,
                orderNumber: 0,
            })
                .then(res => {
                    if (200 === res.code) {
                        message.success({content: res.message}).then();
                    } else {
                        message.error({content: res.message}).then();
                    }
                })
        }
    }

    useEffect(() => {
        console.log('memo edit')
        fetchMemo();
    }, [location.pathname]);

    // @ts-ignore
    return (
        <Flex vertical className={styles.container}>
            <Flex justify='flex-end'>
                <Affix offsetTop={10}>
                    <Space>
                        <Button onClick={(_) => navigate("/memo")}>
                            取消
                        </Button>
                        <Button type="primary" onClick={(_) => handleEditMemo()}>
                            保存
                        </Button>
                    </Space>
                </Affix>
            </Flex>
            <Flex gap={16}>
                <Flex gap={8} vertical flex={1} align='center' justify='flex-start' className={styles.leftContainer}>
                    <Input className={styles.title} placeholder="请输入标题"
                           value={memo?.title} onChange={(e) => setMemo({...memo, title: e.target.value})}></Input>
                    <Input className={styles.subTitle} placeholder="请输入副标题"
                           value={memo?.subTitle}
                           onChange={(e) => setMemo({...memo, subTitle: e.target.value})}></Input>
                    <Input.TextArea classNames={styles.content}
                                    value={memo?.content}
                                    onChange={(e) => setMemo({...memo, content: e.target.value})}
                                    placeholder="请输入内容"
                                    autoSize={true}
                    />
                </Flex>
                <Flex gap={8} vertical flex={1} className={styles.rightContainer}>
                    <Typography.Text className={styles.title}>{memo?.title}</Typography.Text>
                    <Typography.Text className={styles.subTitle}>{memo?.subTitle}</Typography.Text>
                    <Typography.Text
                        className={styles.time}>{memo?.updateTime ? dayjs(memo?.updateTime).format("YYYY-MM-DD HH:mm:ss") : ''}</Typography.Text>
                    <Flex gap={8}>
                        {memo?.tags?.map(it => {
                            return <Typography.Text className={styles.tag}> {it.title}</Typography.Text>
                        })}
                    </Flex>
                    <ReactMarkdown
                        remarkPlugins={[
                            remarkGfm,
                            remarkMath,
                            [rehypeMermaidjs, {
                                mermaid: {theme: 'light'},
                                strategy: 'inline-svg'
                            }]
                        ]}
                        rehypePlugins={[
                            rehypeKatex,
                            rehypeHighlight
                        ]}
                        components={{
                            // @ts-ignore
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <pre style={{padding: '10px', borderRadius: '8px'}}></pre>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {memo?.content}
                    </ReactMarkdown>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MemoEdit;