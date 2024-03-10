import { ProjectData } from "@/types";
import { useState } from "react";
interface useProjectDetailProps {
    projectData: ProjectData[];
    activeIndex: number;
    handleStopAudio: () => void;
    setShowImageGallery: (show: boolean) => void;
    setShowInfo: (show: boolean) => void;
}

export const useProjectDetail = ({
    projectData,
    activeIndex,
    handleStopAudio,
    setShowImageGallery,
    setShowInfo,
}: useProjectDetailProps) => {
    const [openProjects, setOpenProjects] = useState<
        { id: string; isOpen: boolean; zIndex: number }[]
    >([]);
    const [nextZIndex, setNextZIndex] = useState<number>(1);
    const [minimizedWindowsCount, setMinimizedWindowsCount] = useState(0);
    const [offset, setOffset] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const openProjectDetail = (projectId: string) => {
        let newOffset = {
            x: offset.x + 30,
            y: offset.y - 30,
        };
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const thresholdX = windowWidth / 4;
        const thresholdY = windowHeight / 4;
        if (
            Math.abs(newOffset.x) > windowWidth / 2 - thresholdX ||
            Math.abs(newOffset.y) > windowHeight / 2 - thresholdY
        ) {
            newOffset = {
                x: 0,
                y: 0,
            };
        }
        setOffset(newOffset);
        if (!openProjects.find((project) => project.id === projectId)) {
            setOpenProjects((prevState) => [
                ...prevState,
                { id: projectId, isOpen: true, zIndex: nextZIndex },
            ]);
            setNextZIndex((prevIndex) => prevIndex + 1);
        } else {
            setOpenProjects((prevState) =>
                prevState
                    .map((project) =>
                        project.id === projectId
                            ? { ...project, isOpen: true, zIndex: nextZIndex }
                            : project
                    )
                    .sort((a, b) => a.zIndex - b.zIndex)
            );
            setNextZIndex((prevIndex) => prevIndex + 1);
        }
    };
    const closeProjectDetail = (projectId: string) => {
        if (projectId === "imageGallery") {
            setShowImageGallery(false);
            setOpenProjects([]);
            handleStopAudio();
        }
        if (projectId === "infoWindow") {
            setShowInfo(false);
        }
        const projectItem = projectData.findIndex(
            (project) => project?.sys.id === projectId
        );
        if (projectItem === activeIndex) {
            handleStopAudio();
        }
        let newOffset = {
            x: offset.x - 30,
            y: offset.y + 30,
        };
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const thresholdX = windowWidth / 4;
        const thresholdY = windowHeight / 4;
        if (
            Math.abs(newOffset.x) > windowWidth / 2 - thresholdX ||
            Math.abs(newOffset.y) > windowHeight / 2 - thresholdY
        ) {
            newOffset = {
                x: 0,
                y: 0,
            };
        }
        setOffset(newOffset);
        setOpenProjects((prevState) =>
            prevState.filter((project) => project.id !== projectId)
        );
    };

    const bringToFront = (projectId: string) => {
        if (openProjects.find((project) => project.id === projectId)) {
            setOpenProjects((prevState) =>
                prevState
                    .map((project) =>
                        project.id === projectId
                            ? { ...project, zIndex: nextZIndex }
                            : project
                    )
                    .sort((a, b) => a.zIndex - b.zIndex)
            );
        } else {
            setOpenProjects((prevState) => [
                { id: projectId, isOpen: true, zIndex: nextZIndex },
                ...prevState,
            ]);
        }
        setNextZIndex((prevIndex) => prevIndex + 1);
    };

    const onMinimizeProject = () => {
        setMinimizedWindowsCount(minimizedWindowsCount + 1);
    };

    return {
        openProjects,
        nextZIndex,
        offset,
        openProjectDetail,
        closeProjectDetail,
        onMinimizeProject,
        setMinimizedWindowsCount,
        minimizedWindowsCount,
        bringToFront,
    };
};
