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
        { id: string; isOpen: boolean }[]
    >([]);
    const [zIndexMap, setZIndexMap] = useState<{ [key: string]: number }>({});
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
                { id: projectId, isOpen: true },
                ...prevState,
            ]);
            setZIndexMap((prevMap) => ({
                ...prevMap,
                [projectId]: nextZIndex,
            }));
            setNextZIndex((prevIndex) => prevIndex + 1);
        } else {
            setOpenProjects((prevState) =>
                prevState.map((project) =>
                    project.id === projectId
                        ? { ...project, isOpen: true }
                        : project
                )
            );
            setZIndexMap((prevMap) => ({
                ...prevMap,
                [projectId]: nextZIndex,
            }));
            setNextZIndex((prevIndex) => prevIndex + 1);
        }
    };

    const closeProjectDetail = (projectId: string) => {
        if (projectId === "imageGallery") {
            setShowImageGallery(false);
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
        setZIndexMap((prevMap) => {
            const { [projectId]: _, ...rest } = prevMap;
            return rest;
        });
    };

    const bringToFront = (projectId: string) => {
        setZIndexMap((prevMap) => ({
            ...prevMap,
            [projectId]: nextZIndex,
        }));
        setNextZIndex((prevIndex) => prevIndex + 1);
    };

    const onMinimizeProject = () => {
        setMinimizedWindowsCount(minimizedWindowsCount + 1);
    };

    return {
        openProjects,
        zIndexMap,
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
