import { Button } from "./Button";
import { AssistantRes, ProjectData } from "../../types";

interface FooterNavEntryProps {
    activeIndex: number;
    loadingSpeech: boolean;
    startingSpeech: boolean;
    showPlayButton: boolean;
    assistantResponse: AssistantRes[];
    projectData: ProjectData[];
    audioElRef: React.RefObject<HTMLAudioElement>;
    setShowPlayButton: (show: boolean) => void;
    setStartingSpeech: (start: boolean) => void;
}

const FooterNav = ({
    activeIndex,
    loadingSpeech,
    startingSpeech,
    showPlayButton,
    assistantResponse,
    projectData,
    setShowPlayButton,
    setStartingSpeech,
    audioElRef,
}: FooterNavEntryProps) => {
    const buttonClasses = `absolute max-tablet:scale-[0.8] bottom-0 z-40 text-[red] z-50 bg-black border-black h-[30px]`;
    return (
        <>
            {showPlayButton &&
                assistantResponse[assistantResponse.length - 1]?._id ===
                    projectData[activeIndex]?.sys.id && (
                    <Button
                        onClick={async () => {
                            setShowPlayButton(false);
                            setStartingSpeech(true);
                            if (audioElRef?.current) {
                                try {
                                    await audioElRef.current.play();
                                    audioElRef.current.muted = false;
                                    audioElRef.current.onended = () => {
                                        setStartingSpeech(false);
                                    };
                                } catch (error) {
                                    console.error(
                                        "User-initiated playback failed",
                                        error
                                    );
                                }
                            }
                        }}
                        className={`${buttonClasses} origin-right bottom-1 right-1`}
                    >
                        Play Audio
                    </Button>
                )}
            {loadingSpeech ||
                (startingSpeech && (
                    <Button
                        className={`${buttonClasses} origin-left left-1 bottom-1 flex items-center gap-1`}
                    >
                        {(loadingSpeech && "Weaving Words") ||
                            (startingSpeech && "Narrating")}
                        {(loadingSpeech || startingSpeech) && (
                            <div className="typing-animation">
                                <div className="dot dot-col-red"></div>
                                <div className="dot dot-col-red"></div>
                                <div className="dot dot-col-red"></div>
                            </div>
                        )}
                    </Button>
                ))}
        </>
    );
};

export default FooterNav;
