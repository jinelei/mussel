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
import styles from './Memo.module.css';
import {Flex, Input, message} from "antd";
import {Calendar} from "react-calendar";
import dayjs from "dayjs";
import {Service} from "../api";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

dayjs.locale('zh-cn');

// 测试用的高级 Markdown 内容
const markdownContent = `
# React Markdown 高级示例

## 1. GFM 扩展语法
- 任务列表：
  - [x] 完成 React 集成
  - [ ] 测试 Mermaid 流程图
- 删除线：~~这是删除的内容~~
- 表格：
| 名称 | 功能 | 星级 |
|------|------|------|
| react-markdown | 基础渲染 | ⭐⭐⭐⭐⭐ |
| marked | 性能高 | ⭐⭐⭐⭐ |

## 2. 代码高亮
\`\`\`javascript
const handleClick = () => {
  console.log('React Markdown');
};
\`\`\`

## 3. LaTex 数学公式
行内公式：$E=mc^2$
块级公式：
$$
\\sum_{i=1}^n i = \\frac{n(n+1)}{2}
$$

## 4. Mermaid 流程图
\`\`\`mermaid
flowchart TD
    A[React] --> B[react-markdown]
    B --> C[remark-gfm]
    B --> D[rehype-highlight]
\`\`\`
`;

const Memo: React.FC = () => {
    const [tags, setTags] = useState([]);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    });

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

    const fetchMemoTags = () => {
        Service.memoTags()
            .then(res => {
                console.log('memo tags', res.data);
            })
    }

    useEffect(() => {
        fetchMemoTags();
    }, [location.pathname]);

    return (
        <Flex gap={48}>
            <Flex gap={8} vertical align='center' justify='flex-start' className={styles.leftContainer}>
                <Input.Search></Input.Search>
                <Calendar
                    className={styles.calendar}
                    onChange={handleDateChange}
                    showNavigation={false}
                    formatDay={(_, date) => dayjs(date).format('DD')}
                    formatShortWeekday={(_, date) => dayjs(date).format('dd')}
                    value={selectedDate}/>
                <Flex gap={16} className={styles.tagContainer}>

                </Flex>
            </Flex>
            <Flex gap={8} vertical flex={1}>
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
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <pre style={{padding: '10px', borderRadius: '8px'}}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {markdownContent}
                </ReactMarkdown>
            </Flex>
        </Flex>
    );
};

export default Memo;