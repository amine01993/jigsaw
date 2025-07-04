import { useGame } from "@/contexts/game";
import { AnimatePresence, motion } from "motion/react";

interface LoadingProps {
    text?: string;
}

const Loading = ({ text }: LoadingProps) => {
    const { userTheme } = useGame();

    return (
        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-5">
            <motion.svg width="192" height="161" viewBox="0 0 192 161">
                <motion.path
                    d="M35.8,38.2c11,1.8,35.8,5.7,44.1-1.8c-4.8-16.1-6.3-26.6,3.6-32.1c4.9-2.7,10.7-3.1,15.9-1.2
            c17.9,6.3,13,16.8,9.7,32.4c10.7,6.9,35.2,3,44.4,1.5c-1.9,11-2.8,33.6,0.5,43.5c1,2.9,4.4,4.1,7,2.5c14.6-9,30.2-5.9,28.8,12.1
            c-0.5,23.2-17,16.8-28.8,13.7c-2.2-0.6-4.6,0.7-5.2,2.9c-4.3,13.9-3.6,26,1.9,42.7c-17.9,4.8-43.8,6.3-47.7,0
            c9.2-20,3-32.2-13.1-32.5c-17,2.1-24.1,8.9-12.5,35.2c-22.4,2.4-25.6,1.8-45.9-2.4c6.2-17.9,4.7-29.3,1.3-36.1
            c-1.9-3.9-1.8-4.5-6.7-2.5c-23,9.6-31.6,0.7-31.6-15.1c1.5-13.7,11-19.1,33.7-11.3C42.9,86.5,35.8,38.2,35.8,38.2z"
                    stroke={userTheme === "dark" ? "#b33b00" : "#caf0f8"}
                    fill="none"
                    strokeWidth="3"
                    initial={{
                        pathLength: 0,
                    }}
                    animate={{
                        pathLength: 1,
                        transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "loop",
                        },
                    }}
                />
            </motion.svg>

            <AnimatePresence mode="wait">
                {text && (
                    <motion.p
                        key={text}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="text-[#caf0f8] dark:text-[#b33b00] transition-colors duration-300"
                    >
                        {text}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Loading;
