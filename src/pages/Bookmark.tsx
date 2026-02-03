import {useEffect, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation} from "react-router-dom";
import {Typography} from "antd";

const Bookmark: React.FC = () => {
    const location = useLocation();
    const [bookmarks, setBookmarks] = useState<BookmarkDomain[]>();

    useEffect(() => {
        Service.bookmarkTree({})
            .then(res => {
                if (200 === res.code) {
                    setBookmarks(res.data);
                }
            }).catch(reason => {
            console.warn(reason)
        })
    }, [location.pathname]);
    return (
        <div>
            {bookmarks?.map(it => {
                return (
                    <div style={{
                        backgroundColor: 'gray',
                        margin: '1rem',
                        padding: '1rem',
                    }}>
                        <Typography.Text>{it.name}</Typography.Text>
                        <hr/>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {(it.children || []).map(iit => {
                                return <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    margin: '1rem',
                                    padding: '1rem',
                                }}
                                >
                                    <Typography.Text type={'success'}>{iit.name}</Typography.Text>
                                    <Typography.Text type={'secondary'}>{iit.url}</Typography.Text>
                                    <Typography.Text type={'secondary'}>{iit.icon}</Typography.Text>
                                    <br/>
                                </div>
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Bookmark;
