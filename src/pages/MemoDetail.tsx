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
import styles from './MemoDetail.module.css';
import {Flex, message} from "antd";
import dayjs from "dayjs";
import {type MemoResponse, Service} from "../api";
import {useParams} from "react-router-dom";

dayjs.locale('zh-cn');

const MemoDetail: React.FC = () => {
    const params = useParams();
    const [memo, setMemo] = useState<MemoResponse | undefined>();

    const fetchMemo = () => {
        Service.memoGet({id: parseInt(params.id as string)})
            .then(res => {
                if (200 === res.code) {
                    setMemo(res.data);
                } else {
                    message.error({content: res.message}).then();
                }
            })
    }

    useEffect(() => {
        fetchMemo();
    }, [location.pathname]);

    // @ts-ignore
    return (
        <Flex gap={16} className={styles.container}>
            <Flex gap={8} vertical align='center' justify='flex-start' className={styles.leftContainer}>
            </Flex>
            <Flex gap={8} vertical flex={1} className={styles.rightContainer}>
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
    );
};

export default MemoDetail;