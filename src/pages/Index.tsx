import React, {useEffect, useRef, useState} from "react";
import {Flex, Input, message, Typography} from 'antd';
import dayjs from 'dayjs';
import type {GetProps} from 'antd';
import {type BookmarkDomain, Service} from "../api";
import Footer from "./Footer.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import styles from './Index.module.css';

import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {clearToken} from "../store";

const {Search} = Input;

type SearchProps = GetProps<typeof Input.Search>;

const Index: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [value, setValue] = useState<string>();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const formattedTime = currentTime.format('HH:mm:ss');
    const formattedDate = currentTime.format('YYYY年MM月DD日');
    const searchInputRef = useRef<React.ElementRef<typeof Input>>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

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

    const onNavItemClick = (item: BookmarkDomain) => {
        if (!item.url) {
            message.error("敬请期待").then(_ => {
            });
        } else if (item.url.startsWith('http')) {
            window.open(item.url, '_blank');
        } else if (item.url.startsWith('/')) {
            navigate(item.url);
        } else {
            message.error("敬请期待").then(_ => {
            });
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTime]);

    useEffect(() => {
        Service.bookmarkTree()
            .then(res => {
                if (401 === res.code) {
                    dispatch(clearToken());
                    navigate('/login', {replace: true});
                } else if (200 === res.code) {
                    setBookmarks(res.data);
                }
            }).catch(_ => {
        })
    }, [location.pathname]);

    return (
        <Flex vertical align='center' justify='flex-start' className={styles.container}>
            {/*<div*/}
            {/*    className={`${styles.containerBackground} ${isSearchFocused ? styles.containerBackgroundBlur : styles.containerBackground}`}></div>*/}
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
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
            />
            <Flex vertical>
                {bookmarks?.map(it => {
                    return (
                        <Flex vertical className={`${styles.group} ${isSearchFocused ? styles.groupBlur : ''}`}>
                            <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                            <Flex className={styles.list}>
                                {(it.children || []).map(iit => {
                                    return <Flex className={styles.listItem} align='center' justify='flex-start'
                                                 style={{
                                                     color: `${iit.color}`,
                                                     pointerEvents: `${isSearchFocused ? 'none' : 'auto'}`
                                                 }}
                                                 onClick={() => onNavItemClick(iit)}>
                                        <DynamicIcon iconName={iit.icon} size={'1rem'}/>
                                        <Typography.Text>{iit.name}</Typography.Text>
                                    </Flex>
                                })}
                            </Flex>
                        </Flex>)
                })}
            </Flex>
        </Flex>
    )
}

export default Index;
