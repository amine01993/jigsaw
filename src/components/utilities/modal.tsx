import { memo, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/contexts/app";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {

    const { userTheme } = useApp();
    const handlePropagation = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-screen fixed top-0 left-0 bg-black/50 dark:bg-white/50 backdrop-blur-md z-1"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="w-[500px] max-w-[90%] max-h-[calc(100vh-2rem)] overflow-y-auto absolute top-1/2 left-1/2 -translate-1/2 rounded-md shadow-md bg-linear-100 from-white to-[#caf0f8] dark:from-[#072083] dark:to-black p-5"
                        onClick={handlePropagation}
                        style={{
                            scrollbarColor: userTheme === "dark" ? "#FFD6C1 black" : "#072083 #caf0f8",
                            scrollbarWidth: "thin",
                        }}
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={onClose}
                            aria-label="Close modal"
                            className="absolute top-4 right-4 p-2 text-[#072083] hover:text-[#030c30] dark:text-[#FFD6C1] dark:hover:text-[#b33b00] transition-colors duration-300 cursor-pointer"
                        >
                            <AiOutlineClose size={25} />
                            <span className="absolute size-12 top-1/2 left-1/2 -translate-1/2 hidden pointer-coarse:inline-block" />
                        </motion.button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(Modal);
