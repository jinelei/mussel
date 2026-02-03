import {store} from "../store";
import {Navigate, useMatches} from "react-router-dom";
import {hasIntersection, isStrictStringArray} from "../utils/string.ts";
import type {AuthRouteHandle} from "../router";

// @ts-ignore
const AuthorizedGuard = ({children}) => {
    const matches = useMatches();
    const currentMatch = matches[matches.length - 1];
    const routeHandle: AuthRouteHandle = currentMatch.handle as AuthRouteHandle || {};
    const {requireLogin, roles, permissions} = routeHandle;
    console.log(requireLogin, roles, permissions)
    if (typeof requireLogin === 'boolean') {
        console.log('require login', requireLogin);
        if (requireLogin) {
            if (!store.getState()?.auth?.token) {
                return <Navigate to="/login" replace/>;
            }
        } else {
            if (store.getState()?.auth?.token) {
                return <Navigate to="/" replace/>;
            }
        }
    }
    if (isStrictStringArray(roles) && roles.length > 0 && !hasIntersection(store.getState()?.auth?.userInfo?.roles, roles)) {
        return <Navigate to="/403" replace/>;
    }
    if (isStrictStringArray(permissions) && permissions.length > 0 && !hasIntersection(store.getState()?.auth?.userInfo?.permissions, permissions)) {
        return <Navigate to="/403" replace/>;
    }
    return children;
};

export default AuthorizedGuard;
