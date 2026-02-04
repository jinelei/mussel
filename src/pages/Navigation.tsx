import React, {useEffect, useState} from "react";
import {Input, message, Typography} from 'antd';
import dayjs from 'dayjs';
import type {GetProps} from 'antd';
import {type BookmarkDomain, Service} from "../api";
import Footer from "./Footer.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import styles from './Navigation.module.css';

import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {clearToken} from "../store";

const {Search} = Input;

type SearchProps = GetProps<typeof Input.Search>;

const Navigation: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();
    const formattedTime = currentTime.format('HH:mm:ss');
    const formattedDate = currentTime.format('YYYY年MM月DD日');

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

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (info?.source === 'input') {
            const keyword = encodeURIComponent(value.trim());
            if (keyword) {
                const actionJson = JSON.stringify({
                    pluginId: "Send_Message",
                    payload: {text: decodeURIComponent(keyword)}
                });
                const encodedAction = encodeURIComponent(actionJson);
                const url = `https://www.doubao.com/chat/url-action?action=${encodedAction}`;
                console.log("url", url);
                window.open(url, '_blank');
            }
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
        Service.bookmarkTree({})
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
        <div className={styles.container}>
            <div
                className={`${styles.containerBackground} ${isSearchFocused ? styles.containerBackgroundFocus : styles.containerBackground}`}></div>
            <p className={styles.time}
               onClick={() => copyToClipboard(formattedTime)}
            >{formattedTime}</p>
            <p className={styles.date}
               onClick={() => copyToClipboard(formattedDate)}
            >{formattedDate}</p>
            <Search
                placeholder="请输入"
                allowClear
                enterButton
                size="large"
                onSearch={onSearch}
                className={styles.search}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
            />
            <div className={styles.container}>
                {bookmarks?.map(it => {
                    return (<div className={styles.group}>
                        <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                        <div className={styles.list}>
                            {(it.children || []).map(iit => {
                                return <div className={styles.listItem}
                                            style={{color: `${iit.color}`}}
                                            onClick={() => onNavItemClick(iit)}>
                                    <DynamicIcon iconName={iit.icon} size={'1rem'}/>
                                    <Typography.Text>{iit.name}</Typography.Text>
                                </div>
                            })}
                        </div>
                    </div>)
                })}
            </div>
            <Footer className={styles.footer}></Footer>
        </div>
    )
}

export default Navigation;
