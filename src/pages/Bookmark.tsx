import {useEffect, useState} from "react";
import {BookmarkDomain, Service} from "../api";
import {useLocation} from "react-router-dom";
import {Typography} from "antd";
import styles from './Bookmark.module.css';
import DynamicIcon from "../components/DynamicIcon.tsx";

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
        <div className={styles.container}>
            {bookmarks?.map(it => {
                return (<div className={styles.group}>
                    <Typography.Text className={styles.groupTitle}>{it.name}</Typography.Text>
                    <div className={styles.list}>
                        {(it.children || []).map(iit => {
                            return <div className={styles.listItem}
                                        style={{color: `${iit.color}`}}
                                        onClick={() => window.open(iit.url, '_blank')}>
                                <DynamicIcon iconName={iit.icon} size={'1rem'}/>
                                <Typography.Text>{iit.name}</Typography.Text>
                            </div>
                        })}
                    </div>
                </div>)
            })}
        </div>
    )
}

export default Bookmark;
