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
                    isMute={isMute}
                    toggleMute={toggleMute}
                    setStartingSpeech={setStartingSpeech}
                    setShowPlayButton={setShowPlayButton}
                    projectData={projectData}
                    loadingSpeech={loadingSpeech}
                    assistantResponse={assistantResponse}
                />
            )}
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
