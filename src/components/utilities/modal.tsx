import { memo, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {

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
                    className="w-full h-screen fixed top-0 left-0 bg-white/50 backdrop-blur-md z-1"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="w-[500px] max-w-[90%] absolute top-1/2 left-1/2 -translate-1/2 rounded-md shadow-md bg-linear-100 from-[#072083] to-black p-5"
                        onClick={handlePropagation}
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-[#FFD6C1] hover:text-[#b33b00] transition-colors duration-300 cursor-pointer"
                        >
                            <AiOutlineClose />
                        </motion.button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(Modal);
