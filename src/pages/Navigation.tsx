import {useEffect} from "react";
import {Service} from "../api";

const Navigation = () => {
    useEffect(() => {
        Service.bookmarkList({})
            .then(res => {
                console.log("result", res);
            }).catch(err => {
            console.log("error", err);
        }).finally(() => {
            console.log("finally")
        })
    }, []);
    return (
        <div>
            这里是导航页
        </div>
    )
}

export default Navigation;
