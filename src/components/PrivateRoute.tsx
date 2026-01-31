import {store} from "../store";
import {Navigate} from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const PrivateRoute = ({children}) => {
    const token = store.getState().auth.token;
    return token ? children : <Navigate to="/login" replace/>;
};

export default PrivateRoute;
