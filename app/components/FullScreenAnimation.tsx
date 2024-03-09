import { AssistantRes, ProjectData } from "@/types";
import Image from "next/image";
import FooterNav from "./FooterNav";

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
}: {
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
}) {
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
        </>
    );
}
