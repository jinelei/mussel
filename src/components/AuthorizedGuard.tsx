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
    if (typeof requireLogin === 'boolean') {
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
    if (isStrictStringArray(roles) && !hasIntersection(store.getState()?.auth?.userInfo?.roles, roles)) {
        return <Navigate to="/403" replace/>;
    }
    if (isStrictStringArray(permissions) && !hasIntersection(store.getState()?.auth?.userInfo?.permissions, permissions)) {
        return <Navigate to="/403" replace/>;
    }
    return children;
};

export default AuthorizedGuard;
