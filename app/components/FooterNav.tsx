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
    isMute: boolean;
    setShowPlayButton: (show: boolean) => void;
    setStartingSpeech: (start: boolean) => void;
    toggleMute: () => void;
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
    toggleMute,
    isMute,
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
                        className={`${buttonClasses} origin-right right-[50%] translate-x-[50%]`}
                    >
                        Play Audio
                    </Button>
                )}
            {startingSpeech && (
                <span
                    onClick={toggleMute}
                    className={`absolute right-[70px] toolbar-button top-[8px] pt-[7px] pb-[3px]`}
                >
                    {isMute ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            data-name="Layer 1"
                            viewBox="0 0 24 34.5"
                            x="0px"
                            y="0px"
                            className="w-[12px]"
                        >
                            <path d="M13.5,7.135a1,1,0,0,0-1,0L5.734,11H2a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1H5.734l6.77,3.868A1,1,0,0,0,14,22V8A1,1,0,0,0,13.5,7.135Z" />
                            <path d="M16.374,11.221a1,1,0,0,0-.153,1.406,4.018,4.018,0,0,1,0,4.746,1,1,0,1,0,1.558,1.254,5.974,5.974,0,0,0,0-7.254A1,1,0,0,0,16.374,11.221Z" />
                            <path d="M20.374,8.221a1,1,0,0,0-.153,1.406,8.973,8.973,0,0,1,0,10.746,1,1,0,1,0,1.558,1.254,11.067,11.067,0,0,0,0-13.254A1,1,0,0,0,20.374,8.221Z" />
                            <path d="M25.779,5.373a1,1,0,0,0-1.558,1.254,13.983,13.983,0,0,1,0,16.746,1,1,0,1,0,1.558,1.254A16.077,16.077,0,0,0,25.779,5.373Z" />
                        </svg>
                    ) : (
                        <svg
                            className="w-[18px] pl-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 34.5"
                            x="0px"
                            y="0px"
                        >
                            <path d="M13.5,7.135a1,1,0,0,0-1,0L5.734,11H2a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1H5.734l6.77,3.868A1,1,0,0,0,14,22V8A1,1,0,0,0,13.5,7.135Z" />
                        </svg>
                    )}
                </span>
            )}
            {loadingSpeech ||
                (startingSpeech && (
                    <Button
                        className={`${buttonClasses} origin-left left-0 flex items-center gap-1`}
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
