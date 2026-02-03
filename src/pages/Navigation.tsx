import React, {useEffect, useState} from "react";
import {Input, message, Space, Tooltip, Typography} from 'antd';
import dayjs from 'dayjs';
import type {GetProps} from 'antd';
import {type BookmarkDomain, Service} from "../api";
import Footer from "./Footer.tsx";
import {useLocation, useNavigate} from "react-router-dom";

const {Text} = Typography;
import DynamicIcon from "../components/DynamicIcon.tsx";
import {useDispatch} from "react-redux";
import {clearToken} from "../store";

const {Search} = Input;

type SearchProps = GetProps<typeof Input.Search>;

const Navigation: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[] | string>([]);
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTime]);

    useEffect(() => {
        Service.myFavoriteBookmarks()
            .then(res => {
                if (401 === res.code) {
                    dispatch(clearToken());
                    navigate('/login', {replace: true});
                } else if (200 === res.code) {
                    setBookmarks(res?.data as BookmarkDomain[] || []);
                }
            })
            .catch(err => {
                console.error("获取收藏书签失败", err);
                message.error("获取收藏书签失败");
            });
    }, [location.pathname]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflowY: 'hidden',
            backgroundImage: 'url(/images/background.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundClip: 'content-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }}>
            <p style={{
                margin: '5rem 0 1rem 0',
                fontSize: '3rem',
                color: '#ffffff',
                fontWeight: 'bold'
            }}
               onClick={() => copyToClipboard(formattedTime)}
            >{formattedTime}</p>
            <p style={{
                margin: '0 0 2rem 0',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1rem'
            }}
               onClick={() => copyToClipboard(formattedDate)}
            >{formattedDate}</p>
            <Search
                placeholder="请输入"
                allowClear
                enterButton
                size="large"
                onSearch={onSearch}
                styles={{
                    root: {
                        minWidth: 'max(20rem,40vw)',
                        maxWidth: 'min(40rem,40vw)',
                    },
                    input: {
                        color: '#4DA8DA',
                        backgroundColor: 'transparent',
                    },
                    button: {}
                }}
            />
            <Space style={{position: 'fixed', bottom: '6rem'}}>
                {(bookmarks as BookmarkDomain[])?.map((item: BookmarkDomain, index: number) => {
                    return (<a key={index}
                               onClick={() => {
                                   if (!item.url) {
                                       message.error("敬请期待");
                                   } else if (item.url.startsWith('http')) {
                                       window.open(item.url, '_blank');
                                   } else if (item.url.startsWith('/')) {
                                       navigate(item.url);
                                   } else {
                                       message.error("敬请期待");
                                   }
                               }}
                        >
                            <Space style={{
                                margin: '0 5px',
                                background: 'rgba(17, 24, 39, 0.6',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(75, 85, 99, 0.2)',
                                borderRadius: '5px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15',
                                textAlign: 'center',
                                width: '3rem',
                                height: '3rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Tooltip title={<Text>{item.name}</Text>} color={'orange'}>
                                    <DynamicIcon iconName={item.icon} size={'1.5rem'}
                                                 style={{color: 'white'}}/>
                                </Tooltip>
                            </Space>
                        </a>
                    );
                })}
            </Space>
            <Footer
                styles={{
                    color: '#cccccc',
                    position: 'fixed',
                    bottom: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}></Footer>
        </div>
    )
}

export default Navigation;
