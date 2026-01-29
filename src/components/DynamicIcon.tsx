import React, {useState, useEffect} from 'react';
import {Spin} from 'antd';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type {IconProps} from '@ant-design/icons';


const DynamicIcon = ({iconName, ...props}: { iconName: string } & IconProps) => {
    const [IconComponent, setIconComponent] = useState<React.FC<IconProps> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadIcon = async () => {
            try {
                const module = await import('@ant-design/icons');
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const Icon = module[iconName];
                if (Icon) {
                    setIconComponent(Icon);
                } else {
                    const {QuestionOutlined} = await import('@ant-design/icons');
                    setIconComponent(QuestionOutlined);
                }
            } catch (error) {
                const {QuestionOutlined} = await import('@ant-design/icons');
                setIconComponent(QuestionOutlined);
                console.warn(`图标 ${iconName} 加载失败:`, error);
            } finally {
                setLoading(false);
            }
        };

        loadIcon();
    }, [iconName]);

    if (loading) return <Spin size="small"/>;
    if (!IconComponent) return null;

    console.log(iconName, props)

    return <IconComponent  {...props} />;
};

export default DynamicIcon;