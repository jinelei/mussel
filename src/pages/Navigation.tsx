import {useEffect, useState} from "react";
import {Input, message} from 'antd';
import dayjs from 'dayjs';
import type {GetProps} from 'antd';

const {Search} = Input;

type SearchProps = GetProps<typeof Input.Search>;

const Navigation: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const formattedTime = currentTime.format('HH:mm:ss');
    const formattedDate = currentTime.format('YYYY年MM月DD日');

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                message.success("复制成功")
            } else {
                // 兼容低版本浏览器/非HTTPS环境
                const textArea = document.createElement('textarea');
                textArea.value = text;
                // 隐藏textarea（避免页面闪烁）
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
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            overflowY: 'hidden',
            backgroundImage: 'url(/images/background.jpg)',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            backgroundClip: 'content-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }}>
            <p style={{
                margin: '5rem 0 1rem 0',
                fontSize: '3rem',
                color: '#3bf1be',
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
        </div>
    )
}

export default Navigation;
