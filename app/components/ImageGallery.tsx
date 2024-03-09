import ImageComponent from "./ImageComponent";
import { AssistantRes, ProjectData } from "../../types";
import FullScreenAnimation from "./FullScreenAnimation";
import { DraggableWindow } from "./DraggableWindow";
import { useProjectDetail } from "../utils/useProjectDetail";
import { Button } from "./Button";
import { useSession } from "next-auth/react";

interface ImageGallery {
    projectData: ProjectData[];
    handleFetchTextAndAudio: () => void;
    handleSubmitAudio: () => void;
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
}

const ImageGallery = ({
    projectData,
    handleFetchTextAndAudio,
    handleSubmitAudio,
    setActiveIndex,
    activeIndex,
    assistantResponse,
    handleListenStoredAudio,
    submittingAudio,
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
        zIndexMap,
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

    const { data: session } = useSession();

    return (
        <>
            {showInfo && (
                <DraggableWindow
                    onClose={() => closeProjectDetail("infoWindow")}
                    onClick={() => bringToFront("infoWindow")}
                    onMinimize={() => onMinimizeProject()}
                    zIndex={zIndexMap["infoWindow"]}
                    title="⚠️"
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
                        zIndex={zIndexMap["firstWindow"]}
                        onClick={() => bringToFront("firstWindow")}
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
                        const foundAssistantItem =
                            assistantResponse?.find(
                                (item) =>
                                    item._id ===
                                    projectData[projectIndex].sys.id
                            )?.audioUrl !== undefined;

                        const foundSubmittedItem =
                            projectData?.find(
                                (item) =>
                                    item.sys.id ===
                                    projectData[projectIndex]?.sys.id
                            )?.audioFile == null;

                        const alreadySubmittedItem =
                            assistantResponse?.find(
                                (item) =>
                                    item._id ===
                                    projectData[projectIndex]?.sys.id
                            )?.text !== undefined &&
                            assistantResponse?.find(
                                (item) =>
                                    item._id ===
                                    projectData[projectIndex]?.sys.id
                            )?.text ===
                                projectData[projectIndex]?.audioFile
                                    ?.description;

                        const disabledButtonCondition =
                            !foundAssistantItem ||
                            (foundAssistantItem && alreadySubmittedItem);

                        const transitionClasses = `transition-all duration-300 ease-in-out`;

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
                                    zIndex={zIndexMap[openProject.id]}
                                    onClick={() => bringToFront(openProject.id)}
                                    offset={offset}
                                    index={projectIndex}
                                    projectData={projectData}
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
                                    />
                                    {session && (
                                        <article className="absolute top-[50%] right-[50%] -translate-y-[40%] translate-x-2/4 min-w-52 max-tablet:scale-[0.9]">
                                            <section className="flex flex-col gap-2 max-tablet:gap-2 bg-black p-2 drop-shadow-form">
                                                <Button
                                                    className={`${transitionClasses} h-[30px] bg-[#222] hover:bg-[#333] text-white border-none drop-shadow-button`}
                                                    onClick={() =>
                                                        handleListenStoredAudio(
                                                            false,
                                                            projectIndex
                                                        )
                                                    }
                                                    disabled={
                                                        foundSubmittedItem
                                                    }
                                                >
                                                    Listen to Published Audio
                                                </Button>
                                                <Button
                                                    className={`${transitionClasses} h-[30px] text-white ${
                                                        loadingSpeech
                                                            ? "submitAudioAnimation"
                                                            : "bg-[#222] hover:bg-[#333] text-white border-none"
                                                    } drop-shadow-button`}
                                                    onClick={() =>
                                                        handleFetchTextAndAudio()
                                                    }
                                                >
                                                    {loadingSpeech
                                                        ? "Generating..."
                                                        : "Generate New Audio"}
                                                </Button>
                                                <Button
                                                    className={`${transitionClasses} h-[30px] ${
                                                        foundAssistantItem ==
                                                        undefined
                                                            ? "bg-[#555] text-[#aaa] border-[#666] opacity-50 border-none"
                                                            : `bg-[#222] text-white border-none ${
                                                                  !disabledButtonCondition &&
                                                                  "hover:bg-[#333]"
                                                              }`
                                                    } drop-shadow-button`}
                                                    disabled={
                                                        disabledButtonCondition
                                                    }
                                                    onClick={() =>
                                                        handleListenStoredAudio(
                                                            true,
                                                            projectIndex
                                                        )
                                                    }
                                                >
                                                    Listen Again
                                                </Button>
                                                <Button
                                                    className={`${transitionClasses} h-[30px] text-white ${
                                                        submittingAudio
                                                            ? "submitAudioAnimation"
                                                            : !alreadySubmittedItem &&
                                                              foundAssistantItem
                                                            ? "bg-[#0078d4;] hover:bg-[#000080] border-[#0078d4] border-none "
                                                            : `bg-[#222] text-[#fff] border-none ${
                                                                  !disabledButtonCondition &&
                                                                  "hover:bg-[#333]"
                                                              }`
                                                    } drop-shadow-button`}
                                                    onClick={() =>
                                                        handleSubmitAudio()
                                                    }
                                                    disabled={
                                                        disabledButtonCondition
                                                    }
                                                >
                                                    {submittingAudio
                                                        ? "Submitting..."
                                                        : "Submit New Audio"}
                                                </Button>
                                            </section>
                                        </article>
                                    )}
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
