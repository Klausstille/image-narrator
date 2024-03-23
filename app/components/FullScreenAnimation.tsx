import { AssistantRes, ProjectData } from "@/types";
import { Button } from "./Button";
import Image from "next/image";
import FooterNav from "./FooterNav";
import { useSession } from "next-auth/react";

export const fullscreenVariant = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1, ease: "easeIn" },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
};

interface FullScreenAnimationProps {
    activeIndex: number;
    projectIndex: number;
    projectData: ProjectData[];
    startingSpeech: boolean;
    audioElRef: React.RefObject<HTMLAudioElement>;
    showPlayButton: boolean;
    isMute: boolean;
    toggleMute: () => void;
    setStartingSpeech: (starting: boolean) => void;
    setShowPlayButton: (show: boolean) => void;
    loadingSpeech: boolean;
    assistantResponse: AssistantRes[];
    submittingAudio: boolean;
    activeAudioIndex: number | null;
    handleFetchTextAndAudio: (index: number) => void;
    handleSubmitAudio: (index: number) => void;
    handleListenStoredAudio: (isListenAgain?: boolean, index?: number) => void;
    handleStopAudio: () => void;
}

type ButtonConfig = {
    text: string;
    action: () => void;
    condition: boolean;
    classes: string;
};

export default function FullScreenAnimation({
    activeIndex,
    projectIndex,
    projectData,
    startingSpeech,
    audioElRef,
    showPlayButton,
    isMute,
    toggleMute,
    setStartingSpeech,
    setShowPlayButton,
    loadingSpeech,
    assistantResponse,
    submittingAudio,
    activeAudioIndex,
    handleFetchTextAndAudio,
    handleSubmitAudio,
    handleListenStoredAudio,
    handleStopAudio,
}: FullScreenAnimationProps) {
    const { data: session } = useSession();
    const project = projectData[projectIndex];
    const assistantItem = assistantResponse.find(
        (item) => item._id === project?.sys.id
    );
    const foundAssistantItem = assistantItem?.audioUrl !== undefined;
    const foundSubmittedItem = project?.audioFile !== null;
    const alreadySubmittedItem =
        assistantItem?.text === project?.audioFile?.description;
    const disabledButtonCondition = alreadySubmittedItem || !foundAssistantItem;
    const transitionClasses = `transition-all duration-300 ease-in-out`;

    const buttonConfigs: ButtonConfig[] = [
        {
            text: "Listen to Published Audio",
            action: () => handleListenStoredAudio(false, projectIndex),
            condition: !foundSubmittedItem,
            classes: "bg-[#222] hover:bg-[#333]",
        },
        {
            text:
                loadingSpeech && activeAudioIndex === projectIndex
                    ? "Generating..."
                    : "Generate New Audio",
            action: () => handleFetchTextAndAudio(projectIndex),
            condition: loadingSpeech && activeAudioIndex === projectIndex,
            classes:
                loadingSpeech && activeAudioIndex === projectIndex
                    ? "submitAudioAnimation"
                    : "bg-[#222] hover:bg-[#333]",
        },
        {
            text: "Listen Again",
            action: () => handleListenStoredAudio(true, projectIndex),
            condition: disabledButtonCondition,
            classes:
                foundAssistantItem === undefined
                    ? "bg-[#555] text-[#aaa] opacity-50"
                    : "bg-[#222] hover:bg-[#333]",
        },
        {
            text:
                submittingAudio && activeAudioIndex === projectIndex
                    ? "Submitting..."
                    : "Submit New Audio",
            action: () => handleSubmitAudio(projectIndex),
            condition: disabledButtonCondition,
            classes:
                submittingAudio && activeAudioIndex === projectIndex
                    ? "submitAudioAnimation"
                    : !alreadySubmittedItem && foundAssistantItem
                    ? "bg-[#0078d4] hover:bg-[#000080]"
                    : "bg-[#222] hover:bg-[#333]",
        },
    ];
    return (
        <>
            <Image
                src={projectData[projectIndex].image.url || ""}
                alt={
                    projectData[projectIndex].audioFile?.description ||
                    "Project Image"
                }
                width={projectData[projectIndex].image.width || 0}
                height={projectData[projectIndex].image.height || 0}
                loading="eager"
                style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    width: "100%",
                    height: "100%",
                }}
                draggable="false"
            />
            {projectIndex === activeIndex && (
                <FooterNav
                    activeIndex={activeIndex}
                    startingSpeech={startingSpeech}
                    audioElRef={audioElRef}
                    showPlayButton={showPlayButton}
                    setStartingSpeech={setStartingSpeech}
                    setShowPlayButton={setShowPlayButton}
                    projectData={projectData}
                    loadingSpeech={loadingSpeech}
                    assistantResponse={assistantResponse}
                />
            )}
            <span
                className={`absolute right-[70px] top-[1px] pt-[7px] pb-[3px] flex flex-row`}
            >
                {startingSpeech && projectIndex === activeIndex && (
                    <svg
                        onClick={toggleMute}
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 35 30.5"
                        x="0px"
                        y="0px"
                        className="toolbar-button pl-[3px]"
                        style={{ fill: isMute ? "gray" : "black" }}
                    >
                        <path d="M13.5,7.135a1,1,0,0,0-1,0L5.734,11H2a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1H5.734l6.77,3.868A1,1,0,0,0,14,22V8A1,1,0,0,0,13.5,7.135Z" />
                        <path d="M16.374,11.221a1,1,0,0,0-.153,1.406,4.018,4.018,0,0,1,0,4.746,1,1,0,1,0,1.558,1.254,5.974,5.974,0,0,0,0-7.254A1,1,0,0,0,16.374,11.221Z" />
                        <path d="M20.374,8.221a1,1,0,0,0-.153,1.406,8.973,8.973,0,0,1,0,10.746,1,1,0,1,0,1.558,1.254,11.067,11.067,0,0,0,0-13.254A1,1,0,0,0,20.374,8.221Z" />
                        <path d="M25.779,5.373a1,1,0,0,0-1.558,1.254,13.983,13.983,0,0,1,0,16.746,1,1,0,1,0,1.558,1.254A16.077,16.077,0,0,0,25.779,5.373Z" />
                    </svg>
                )}
                <div
                    className={` toolbar-button ${
                        startingSpeech && projectIndex === activeIndex
                            ? "stop"
                            : "play"
                    }`}
                    onClick={() => {
                        if (startingSpeech) {
                            handleStopAudio();
                            return;
                        }
                        handleListenStoredAudio(false, projectIndex);
                    }}
                ></div>
            </span>
            {session && (
                <article className="absolute top-[50%] right-[50%] -translate-y-[40%] translate-x-2/4 min-w-52 max-tablet:scale-[0.9]">
                    <section className="flex flex-col gap-2 max-tablet:gap-2 bg-black p-2 drop-shadow-form">
                        {buttonConfigs.map(
                            ({ text, action, condition, classes }, index) => (
                                <Button
                                    key={index}
                                    className={`${transitionClasses} h-[30px] text-white border-none drop-shadow-button ${classes}`}
                                    onClick={action}
                                    disabled={condition}
                                >
                                    {text}
                                </Button>
                            )
                        )}
                    </section>
                </article>
            )}
        </>
    );
}
