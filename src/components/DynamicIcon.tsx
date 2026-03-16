import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {CSSProperties} from 'react';
import * as AntdIcons from '@ant-design/icons';

interface DynamicIconProps {
    icon?: string | undefined;
    className?: string | undefined;
    size?: number | string;
    style?: CSSProperties;
    onClick?: () => void;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({icon, className, size = 16, style, onClick}) => {
    const isRawIcon = typeof icon === 'string' && (icon.startsWith('data:') || icon.startsWith('http'));
    const getIconComponentName = (name: string | undefined) => {
        if (!name) {
            return undefined;
        }
        if (name.startsWith('-')) {
            return name.split('-')
                .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                .join("") + 'Outlined';
        }
        if (name === name.toLocaleUpperCase() && !name.includes('Outlined')) {
            return name.charAt(0).toUpperCase() + name.slice(1) + 'Outlined';
        }
        return name;
    }
    const componentName = getIconComponentName(icon);
    const IconComponent = componentName ? AntdIcons[componentName as keyof typeof AntdIcons] || AntdIcons.QuestionCircleFilled : AntdIcons.QuestionCircleFilled;
    const mergedStyle: CSSProperties = {
        fontSize: typeof size === 'number' ? `${size}px` : size,
        cursor: onClick ? 'pointer' : 'default',
        ...style
    }

    return isRawIcon
        ? <img className={className} style={mergedStyle} onClick={onClick} src={icon} alt="icon"/>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        : <IconComponent className={className} style={mergedStyle} onClick={onClick}></IconComponent>;
};

export default DynamicIcon;