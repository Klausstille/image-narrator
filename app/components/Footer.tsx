import { motion, AnimatePresence } from "framer-motion";
import { fullscreenVariant } from "./FullScreenAnimation";

export default function Footer() {
    return (
        <AnimatePresence>
            <motion.div
                variants={fullscreenVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="footer fixed bottom-0 w-full pointer-events-none z-[99999]"
            >
                <footer className="text-center py-1 text-black text-[13px]">
                    © 2024, Design and Development{" "}
                    <a
                        className="text-[13px]"
                        href="http://www.stillestudio.com"
                        target="blank"
                        style={{ textDecoration: "none" }}
                    >
                        Stille Studio
                    </a>{" "}
                    💫
                </footer>
            </motion.div>{" "}
        </AnimatePresence>
    );
}
