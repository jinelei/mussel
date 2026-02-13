import {CSS} from '@dnd-kit/utilities';
import React from "react";
import type {BookmarkDomain} from "../api";
import {useSortable} from "@dnd-kit/sortable";
import {Flex, Typography} from "antd";
import {EditOutlined} from "@ant-design/icons";
import DynamicIcon from "./DynamicIcon.tsx";

interface SortableBookmarkProps {
    item: BookmarkDomain,
    classNameContainer: string,
    classNameContainerDrag: string,
    classNameIcon: string,
    classNameTitle: string,
    classNameEdit: string,
    onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    onEdit: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const SortableBookmark: React.FC<SortableBookmarkProps> = ({
                                                               item,
                                                               classNameContainer,
                                                               classNameContainerDrag,
                                                               classNameIcon,
                                                               classNameTitle,
                                                               classNameEdit,
                                                               onEdit,
                                                               onClick
                                                           }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: item.id as number,
        data: {
            type: 'custom-div',
            item
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Flex gap={16} align='center' justify='center'
              onClick={onClick}
              ref={setNodeRef}
              style={style}
              className={isDragging ? classNameContainerDrag : classNameContainer}
              {...attributes}
              {...listeners}
        >
            <Flex gap={8}>
                <DynamicIcon className={classNameIcon} iconName={item.icon}/>
                <Typography.Text className={classNameTitle}>{item.name}</Typography.Text>
            </Flex>
            <EditOutlined className={classNameEdit} onClick={onEdit}> </EditOutlined>
        </Flex>
    );
};

export default SortableBookmark;