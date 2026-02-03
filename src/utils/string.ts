const isStrictStringArray = (value: unknown): value is string[] => {
    // 第一层校验：排除 null/undefined，且必须是数组类型
    if (value === null || value === undefined || !Array.isArray(value)) {
        return false;
    }

    // 第二层校验：数组中每一个元素都必须是字符串类型（排除数字、对象、布尔值等）
    // every() 会遍历所有元素，全部满足才返回true
    return value.every((item) => {
        // 严格判断类型：typeof item === 'string'
        // 排除类似 new String('xxx') 这种字符串对象（可选，根据你的需求）
        return typeof item === 'string' && item !== ''; // 如需允许空字符串，去掉 && item !== ''
    });
};

const hasIntersection = (arr1: string[] | string | undefined, arr2: string[] | string | undefined): boolean => {
    if (typeof arr1 === 'string') {
        arr1 = JSON.parse(arr1) || [];
    }
    if (typeof arr2 === 'string') {
        arr2 = [arr2];
    }
    if (!isStrictStringArray(arr1) || !isStrictStringArray(arr2)) {
        console.error('入参必须是纯字符串数组', arr1, arr2)
        throw new Error('入参必须是纯字符串数组');
    }

    // 优化：遍历较短的数组，减少循环次数
    const [shortArr, longArr] = arr1.length <= arr2.length ? [arr1, arr2] : [arr2, arr1];

    // some() 找到第一个匹配项就会终止遍历，性能最优
    return shortArr.some(item => longArr.includes(item));
};

export {isStrictStringArray, hasIntersection};
