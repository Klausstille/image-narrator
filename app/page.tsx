"use client";
import { useState, useRef } from "react";
import { fetchText } from "./utils/fetchText";
import { fetchSpeech } from "./utils/fetchSpeech";
import { uploadAudioToContentful } from "./utils/contentful/uploadAudioToContentful";
import { updateProjectItemWithAudio } from "./utils/contentful/updateProjectItemWithAudio";
import ImageGallery from "./components/ImageGallery";
import { AssistantRes } from "../types";
import { useProjectData } from "./utils/useProjectData";
import { usePromptData } from "./utils/usePromptData";
import { useAudioManager } from "./utils/useAudioManager";
import DesktopScreen from "./components/DesktopScreen";

export default function Home() {
    const [assistantResponse, setAssistantResponse] = useState<AssistantRes[]>(
        []
    );
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(true);
    const audioElRef = useRef<HTMLAudioElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const { projectData, isLoading, mutate } = useProjectData();
    const { promptData } = usePromptData();
    const {
        isMute,
        toggleMute,
        loadingSpeech,
        setLoadingSpeech,
        startingSpeech,
        setStartingSpeech,
        showPlayButton,
        setShowPlayButton,
        setIsMute,
        submittingAudio,
        setSubmittingAudio,
    } = useAudioManager(audioElRef);

    // Fetching new text and audio
    const handleFetchTextAndAudio = async () => {
        // console.log("Fetching new text and audio...");
        if (!abortControllerRef.current) {
            abortControllerRef.current = new AbortController();
        }
        const { signal } = abortControllerRef.current;
        setIsMute(false);
        setLoadingSpeech(true);
        const description = await fetchText(
            signal,
            projectData[activeIndex].image.url,
            projectData[activeIndex].sys.id,
            setAssistantResponse,
            setLoadingSpeech,
            promptData,
            assistantResponse
        );
        if (!description) return;

        await fetchSpeech(
            signal,
            description,
            audioElRef,
            setLoadingSpeech,
            setStartingSpeech,
            setShowPlayButton,
            setAssistantResponse,
            projectData[activeIndex].sys.id,
            promptData
        );
    };

    // Submitting audio to Contentful
    const handleSubmitAudio = async () => {
        // console.log("Submitting audio to contentful.....");
        setSubmittingAudio(true);
        const audioFile = assistantResponse.find(
            (item) => item._id === projectData[activeIndex].sys.id
        )?.audioFormData;
        const description = assistantResponse.find(
            (item) => item._id === projectData[activeIndex].sys.id
        )?.text;

        if (!audioFile || !description) return;
        uploadAudioToContentful(audioFile, description)
            .then((assetId) =>
                updateProjectItemWithAudio(
                    assetId,
                    projectData[activeIndex].sys.id
                )
            )
            .then(() => {
                // console.log(
                //     "Project item updated and published successfully with the new audio!!! 🎉🎉🎉"
                // );
                setSubmittingAudio(false);
                mutate();
            })
            .catch((error) =>
                console.error("Error updating project item:", error)
            );
    };

    // Listening to stored audio
    const handleListenStoredAudio = async (
        isListenAgain: boolean | undefined,
        index: number | undefined
    ) => {
        setIsMute(false);
        let audioUrl;
        if (index !== undefined) {
            setActiveIndex(index);
            if (isListenAgain) {
                console.log("listening again to local audio...", isListenAgain);
                audioUrl = assistantResponse.find(
                    (item) => item._id === projectData[index].sys.id
                )?.audioUrl;
            } else {
                console.log(
                    "listening again to project audio...",
                    isListenAgain
                );
                audioUrl = projectData.find(
                    (item) => item.sys.id === projectData[index].sys.id
                )?.audioFile?.url;
            }
        }

        console.log("audioUrl...", audioUrl);
        if (!audioUrl) {
            handleStopAudio();
            return;
        }
        setStartingSpeech(true);
        if (audioElRef.current) {
            audioElRef.current.src = audioUrl;
            audioElRef.current.muted = true;
            try {
                await audioElRef.current.play();
                audioElRef.current.muted = false;
            } catch (err) {
                console.error("Error playing the audio", err);
                setShowPlayButton(true);
            }
            audioElRef.current.onended = () => {
                setStartingSpeech(false);
            };
        }
    };

    // Resetting audio and aborting fetchSpeech when activeIndex changes
    const handleStopAudio = () => {
        if (audioElRef.current) {
            audioElRef.current.pause();
            audioElRef.current.currentTime = 0;
        }
        setLoadingSpeech(false);
        setStartingSpeech(false);
        return () => {
            abortControllerRef.current?.abort();
            abortControllerRef.current = null;
        };
    };

    return (
        <>
            <audio autoPlay ref={audioElRef}></audio>
            {isLoading && (
                <div className="typing-animation w-[screen] h-screen max-tablet:translate-y-[-6%] flex justify-center items-center">
                    <div className="dot dot-col-red"></div>
                    <div className="dot dot-col-red"></div>
                    <div className="dot dot-col-red"></div>
                </div>
            )}
            <main>
                <DesktopScreen
                    setShowImageGallery={setShowImageGallery}
                    setShowInfo={setShowInfo}
                />
                {/* {showImageGallery && ( */}
                <ImageGallery
                    projectData={projectData}
                    handleFetchTextAndAudio={handleFetchTextAndAudio}
                    handleSubmitAudio={handleSubmitAudio}
                    setActiveIndex={setActiveIndex}
                    activeIndex={activeIndex}
                    assistantResponse={assistantResponse}
                    handleListenStoredAudio={handleListenStoredAudio}
                    submittingAudio={submittingAudio}
                    loadingSpeech={loadingSpeech}
                    handleStopAudio={handleStopAudio}
                    startingSpeech={startingSpeech}
                    audioElRef={audioElRef}
                    showPlayButton={showPlayButton}
                    isMute={isMute}
                    toggleMute={toggleMute}
                    setStartingSpeech={setStartingSpeech}
                    setShowPlayButton={setShowPlayButton}
                    showImageGallery={showImageGallery}
                    setShowImageGallery={setShowImageGallery}
                    showInfo={showInfo}
                    setShowInfo={setShowInfo}
                />
                {/* )} */}
            </main>
        </>
    );
}
