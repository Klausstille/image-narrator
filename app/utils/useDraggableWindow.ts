import { ProjectData } from "@/types";
import { useState, useEffect, useRef } from "react";
import GetWindowDimensions from "../utils/helper";

interface useDraggableWindowProps {
    projectData?: ProjectData[] | null;
    offset?: { x: number; y: number };
    index?: number;
    onClick?: () => void;
    isImageModal?: boolean;
    setMinimizedWindowsCount?: (
        value: number | ((prevState: number) => number)
    ) => void;
    minimizedWindowsCount?: number;
}

export const useDraggableWindow = ({
    projectData,
    offset = { x: 0, y: 0 },
    index,
    onClick,
    isImageModal,
    setMinimizedWindowsCount,
    minimizedWindowsCount,
}: useDraggableWindowProps) => {
    const imageRatio =
        (projectData && index !== undefined
            ? (projectData as ProjectData[])[index].image.width /
              (projectData as ProjectData[])[index].image.height
            : 650 / 400) || 1;

    const [imageSize, setImageSize] = useState({
        width: 650,
        height: 400,
    });

    useEffect(() => {
        projectData &&
            index !== undefined &&
            setImageSize({
                width: 350,
                height: 350 / imageRatio,
            });
    }, [imageRatio]);

    const [isResizing, setIsResizing] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { windowWidth, windowHeight } = GetWindowDimensions();
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [lastPositionBeforeMaximize, setLastPositionBeforeMaximize] =
        useState({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const newX = (windowWidth - imageSize.width) / 2 + offset.x;
        const newY = (windowHeight - imageSize.height) / 2 + offset.y;
        setInitialPosition({ x: newX, y: newY });
        handleDragStop({ x: newX, y: newY });
    }, [windowWidth]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleDragStop = (
        data: { x: number; y: number },
        e?: React.MouseEvent
    ) => {
        if (currentPosition.current.y === window.innerHeight - 30) {
            if (setMinimizedWindowsCount) {
                setMinimizedWindowsCount((prevCount) =>
                    Math.max(0, prevCount - 1)
                );
                setIsMinimized(false);
            }
        }
        currentPosition.current = { x: data.x, y: data.y };
    };

    const handleResize = (e: React.MouseEvent) => {
        if (!isResizing) return;
        const widthOffset = currentPosition.current.x;
        const heightOffset = currentPosition.current.y;
        const newWidth = e.clientX - widthOffset;
        const newHeight = e.clientY - heightOffset;
        setImageSize({
            width: newWidth,
            height: newHeight,
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) =>
            handleResize(e as unknown as React.MouseEvent<HTMLDivElement>);
        const handleMouseUp = () => setIsResizing(false);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (onClick) onClick();
    };

    const toggleMaximize = () => {
        if (isMaximized) {
            setIsMaximized(false);
            projectData && isImageModal
                ? setImageSize({
                      width: 650,
                      height: 400,
                  })
                : setImageSize({
                      width: 350,
                      height: 350 / imageRatio,
                  });
            currentPosition.current = lastPositionBeforeMaximize;
        } else {
            setLastPositionBeforeMaximize(currentPosition.current);
            setIsMaximized(true);
            setImageSize({ width: windowWidth, height: windowHeight });
        }
    };

    const handleMinimize = () => {
        if (setMinimizedWindowsCount && minimizedWindowsCount !== undefined) {
            const viewportHeight = window.innerHeight;
            const newYPosition = viewportHeight - 30;
            const xOffset = 100 * minimizedWindowsCount;
            currentPosition.current = {
                x: xOffset,
                y: newYPosition,
            };
            setIsMinimized(true);
            setMinimizedWindowsCount(minimizedWindowsCount + 1);
        }
    };

    return {
        imageSize,
        isMaximized,
        isMinimized,
        handleMouseDown,
        handleDragStop,
        handleClick,
        toggleMaximize,
        handleMinimize,
        initialPosition,
        currentPosition,
    };
};
