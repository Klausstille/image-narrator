import ImageComponent from "./ImageComponent";
import { AssistantRes, ProjectData } from "../../types";
import FullScreenAnimation from "./FullScreenAnimation";
import { DraggableWindow } from "./DraggableWindow";
import { useProjectDetail } from "../utils/useProjectDetail";

interface ImageGallery {
    projectData: ProjectData[];
    handleFetchTextAndAudio: (index: number) => void;
    handleSubmitAudio: (index: number) => void;
    handleListenStoredAudio: (
        isListenAgain?: boolean | undefined,
        index?: number | undefined
    ) => void;
    setActiveIndex: (index: number) => void;
    activeIndex: number;
    assistantResponse: AssistantRes[];
    submittingAudio: boolean;
    loadingSpeech: boolean;
    handleStopAudio: () => void;
    startingSpeech: boolean;
    audioElRef: React.RefObject<HTMLAudioElement>;
    showPlayButton: boolean;
    isMute: boolean;
    toggleMute: () => void;
    setStartingSpeech: (starting: boolean) => void;
    setShowPlayButton: (show: boolean) => void;
    setShowImageGallery: (show: boolean) => void;
    showImageGallery: boolean;
    setShowInfo: (show: boolean) => void;
    showInfo: boolean;
    activeAudioIndex: number | null;
}

const ImageGallery = ({
    projectData,
    handleFetchTextAndAudio,
    handleSubmitAudio,
    submittingAudio,
    activeAudioIndex,
    setActiveIndex,
    activeIndex,
    assistantResponse,
    handleListenStoredAudio,
    loadingSpeech,
    handleStopAudio,
    startingSpeech,
    audioElRef,
    showPlayButton,
    isMute,
    toggleMute,
    setStartingSpeech,
    setShowPlayButton,
    setShowImageGallery,
    showImageGallery,
    setShowInfo,
    showInfo,
}: ImageGallery) => {
    const {
        openProjects,
        bringToFront,
        closeProjectDetail,
        onMinimizeProject,
        setMinimizedWindowsCount,
        minimizedWindowsCount,
        openProjectDetail,
        offset,
    } = useProjectDetail({
        projectData,
        activeIndex,
        handleStopAudio,
        setShowImageGallery,
        setShowInfo,
    });

    const highestOrderProject = openProjects.sort(
        (a, b) => b.zIndex - a.zIndex
    )[0]?.id;

    return (
        <>
            {showInfo && (
                <DraggableWindow
                    onClose={() => closeProjectDetail("infoWindow")}
                    onClick={() => bringToFront("infoWindow")}
                    onMinimize={() => onMinimizeProject()}
                    zIndex={
                        openProjects.find(
                            (project) => project.id === "infoWindow"
                        )?.zIndex
                    }
                    title="⚠️"
                    selectedProject={highestOrderProject === "infoWindow"}
                >
                    <div
                        style={{ width: "100%", height: "100%" }}
                        className="p-2 text-2xl gap-4 text-black overflow-auto leading-tight text-center"
                    >
                        This project showcases genuine moments captured by Loïc
                        Sutter integrating cutting-edge AI technologies.
                        Leveraging the power of OpenAI
                        {"'"}s vision model, each image is analyzed to generate
                        descriptive text that captures the essence of the
                        photograph. <br></br> <br></br>
                        These descriptions are then given voice through
                        ElevenLabs
                        {"'"} text-to-speech synthesis, creating an immersive
                        audio-visual experience. Behind the scenes, the
                        generated text and audio data are seamlessly submitted,
                        where they
                        {"'"}re curated and published.
                    </div>
                </DraggableWindow>
            )}
            {showImageGallery && (
                <>
                    <DraggableWindow
                        onClose={() => closeProjectDetail("imageGallery")}
                        onMinimize={() => onMinimizeProject()}
                        setMinimizedWindowsCount={setMinimizedWindowsCount}
                        title="Tap an image to listen to its story"
                        minimizedWindowsCount={minimizedWindowsCount}
                        zIndex={
                            openProjects.find(
                                (project) => project.id === "imageGallery"
                            )?.zIndex
                        }
                        onClick={() => bringToFront("imageGallery")}
                        selectedProject={highestOrderProject === "imageGallery"}
                        isImageModal
                    >
                        <div
                            className="p-2 grid gap-2 place-content-start overflow-auto"
                            style={{
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(100px, 1fr))",
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            {projectData.map(
                                (item: ProjectData, index: number) => (
                                    <ImageComponent
                                        key={index}
                                        src={item.image.url}
                                        index={index}
                                        setActiveIndex={setActiveIndex}
                                        openProjectDetail={openProjectDetail}
                                        handleListenStoredAudio={
                                            handleListenStoredAudio
                                        }
                                        projectData={projectData}
                                    />
                                )
                            )}
                        </div>
                    </DraggableWindow>
                    {openProjects.map((openProject) => {
                        const projectIndex = projectData.findIndex(
                            (project) => project.sys.id === openProject.id
                        );
                        const selectedProject =
                            highestOrderProject === openProject.id;

                        if (openProject.isOpen && projectIndex !== -1) {
                            return (
                                <DraggableWindow
                                    key={openProject.id}
                                    onClose={() =>
                                        closeProjectDetail(openProject.id)
                                    }
                                    onMinimize={() => onMinimizeProject()}
                                    setMinimizedWindowsCount={
                                        setMinimizedWindowsCount
                                    }
                                    title={`${(
                                        projectIndex + 1
                                    ).toString()}.jpg`}
                                    minimizedWindowsCount={
                                        minimizedWindowsCount
                                    }
                                    zIndex={
                                        openProjects.find(
                                            (project) =>
                                                project.id === openProject.id
                                        )?.zIndex
                                    }
                                    onClick={() => bringToFront(openProject.id)}
                                    offset={offset}
                                    index={projectIndex}
                                    projectData={projectData}
                                    selectedProject={selectedProject}
                                >
                                    <FullScreenAnimation
                                        activeIndex={activeIndex}
                                        projectIndex={projectIndex}
                                        projectData={projectData}
                                        startingSpeech={startingSpeech}
                                        audioElRef={audioElRef}
                                        showPlayButton={showPlayButton}
                                        isMute={isMute}
                                        toggleMute={toggleMute}
                                        setStartingSpeech={setStartingSpeech}
                                        setShowPlayButton={setShowPlayButton}
                                        loadingSpeech={loadingSpeech}
                                        assistantResponse={assistantResponse}
                                        submittingAudio={submittingAudio}
                                        activeAudioIndex={activeAudioIndex}
                                        handleFetchTextAndAudio={
                                            handleFetchTextAndAudio
                                        }
                                        handleSubmitAudio={handleSubmitAudio}
                                        handleListenStoredAudio={
                                            handleListenStoredAudio
                                        }
                                    />
                                </DraggableWindow>
                            );
                        }
                        return null;
                    })}
                </>
            )}
        </>
    );
};

export default ImageGallery;
