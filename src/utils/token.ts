const getLocalToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('未检测到token，请先登录');
        return '';
    }
    return token;
};

export {getLocalToken};
