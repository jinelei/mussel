import styles from './BookmarkEdit.module.css';
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {Service} from "../../api";
import {message} from "antd";

const BookmarkEdit: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        Service.bookmarkGet({
            id: 10002
        }).then(res => {
            message.success(JSON.stringify(res))
        })
    }, [location.pathname]);

    return (
        <div className={styles.container}> 这里是编辑 </div>
    );
}

export default BookmarkEdit;
