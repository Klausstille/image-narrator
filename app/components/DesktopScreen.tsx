import { motion, AnimatePresence } from "framer-motion";
import { fullscreenVariant } from "./FullScreenAnimation";
import { useSession } from "next-auth/react";
import UserSessionInfo from "./UserSessionInfo";
import Image from "next/image";
import Draggable from "react-draggable";

interface DesktopScreen {
    setShowImageGallery: (show: boolean) => void;
    setShowInfo: (show: boolean) => void;
}

export default function DesktopScreen({
    setShowImageGallery,
    setShowInfo,
}: DesktopScreen) {
    const { data: session } = useSession();

    return (
        <AnimatePresence>
            <motion.div
                variants={fullscreenVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed bg-[#c8c8c8] top-0 left-0 w-full h-full flex justify-center items-center"
            >
                {/* <Image
                    src="/wallpaper.jpg"
                    alt="Desktop Background"
                    loading="eager"
                    priority
                    fill
                /> */}
                {session && <UserSessionInfo session={session} />}
                <div className="font-light absolute top-8 right-8 text-white cursor-pointer z-50 drop-shadow-2xl flex flex-col gap-4 grayscale">
                    <Draggable>
                        <aside className="flex justify-center flex-col text-center">
                            <span
                                onDoubleClick={() => setShowImageGallery(true)}
                                className="text-[60px] leading-none"
                            >
                                🌁
                            </span>
                            <small className="ml-1">Images</small>
                        </aside>
                    </Draggable>
                    <Draggable>
                        <aside className="flex justify-center flex-col text-center">
                            <span
                                onDoubleClick={() => setShowInfo(true)}
                                className="text-[60px] leading-none"
                            >
                                ⚠️
                            </span>
                            <small className="ml-1">Info</small>
                        </aside>
                    </Draggable>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
