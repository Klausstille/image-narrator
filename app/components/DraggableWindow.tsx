import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { DraggableData, DraggableEvent } from "react-draggable";
import { Gruppo } from "next/font/google";
import { ProjectData } from "@/types";
import { useDraggableWindow } from "../utils/useDraggableWindow";
const gruppo = Gruppo({ subsets: ["latin"], weight: "400" });

interface DraggableWindowProps {
    children: React.ReactNode;
    onClose: () => void;
    onMinimize: () => void;
    title: string;
    onClick?: () => void;
    className?: string;
    zIndex?: number;
    offset?: { x: number; y: number };
    index?: number;
    projectData?: ProjectData[] | null;
    isImageModal?: boolean;
    setMinimizedWindowsCount?: (
        value: number | ((prevState: number) => number)
    ) => void;
    minimizedWindowsCount?: number;
    selectedProject?: boolean;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    children,
    onClose,
    title,
    onClick,
    className = "",
    zIndex = 1,
    offset = { x: 0, y: 0 },
    index,
    projectData = [],
    isImageModal,
    onMinimize,
    setMinimizedWindowsCount,
    minimizedWindowsCount,
    selectedProject,
}) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const {
        imageSize,
        isMaximized,
        isMinimized,
        initialPosition,
        handleMouseDown,
        handleDragStop,
        handleClick,
        toggleMaximize,
        currentPosition,
        handleMinimize,
    } = useDraggableWindow({
        projectData,
        offset,
        index,
        onClick,
        isImageModal,
        setMinimizedWindowsCount,
        minimizedWindowsCount,
    });

    useEffect(() => {
        setHasLoaded(true);
    }, []);

    const toolbar = (
        <div
            className={`toolbar absolute w-full`}
            style={{
                top: 0,
                left: 0,
            }}
        >
            <small
                className="absolute left-3 text-white font-light text-sm"
                style={{
                    maxWidth: imageSize.width - 100,
                    minWidth: "200px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
            >
                {title}
            </small>
            {title !== "⚠️" && (
                <>
                    <div
                        className={`${gruppo.className} toolbar-button minimize`}
                        onClick={() => {
                            handleMinimize();
                            onMinimize();
                        }}
                    ></div>
                    <div
                        className={`${gruppo.className} toolbar-button ${
                            isMaximized ? "restore" : "maximize"
                        }`}
                        onClick={toggleMaximize}
                    ></div>
                </>
            )}
            <div
                className={`${gruppo.className} toolbar-button close`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            ></div>
        </div>
    );

    return (
        hasLoaded && (
            <Draggable
                handle=".image-container"
                defaultPosition={
                    initialPosition.x !== 0 ? initialPosition : undefined
                }
                position={
                    isMaximized && !isMinimized
                        ? { x: 0, y: 0 }
                        : currentPosition.current
                }
                onStop={(e: DraggableEvent, data: DraggableData) =>
                    handleDragStop(data, e as any)
                }
            >
                <div
                    className={`${className} absolute rounded-b-sm window ${
                        selectedProject ? "drop-shadow-4xl" : "drop-shadow-3xl"
                    }`}
                    style={{
                        zIndex: zIndex,
                    }}
                >
                    <article
                        className="image-container pt-8 p-1"
                        onClick={handleClick}
                        style={{
                            minWidth: "300px",
                            minHeight: "200px",
                            width: imageSize.width,
                            height: imageSize.height,
                            overflow: "hidden",
                        }}
                    >
                        {toolbar}
                        {children}
                    </article>
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4"
                        onMouseDown={handleMouseDown}
                        style={{
                            resize: "both",
                            overflow: "auto",
                        }}
                    />
                </div>
            </Draggable>
        )
    );
};
