import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const GameFPS = () => {
    const { t } = useTranslation();
    const lastTime = useRef(performance.now());
    const fpsRef = useRef(0);
    const [fps, setFps] = useState(60);
    const [counter, setCounter] = useState(0);

    // Update the FPS every 100 milliseconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCounter((prev) => prev + 1);
        }, 100);

        setFps(fpsRef.current);

        return () => {
            clearTimeout(timeout);
        };
    }, [counter]);

    // Calculate FPS on component mount
    useEffect(() => {
        let animationId = requestAnimationFrame(render);

        function render(time: DOMHighResTimeStamp) {
            const delta = time - lastTime.current;
            const fps = 1000 / delta;
            fpsRef.current = Math.round(fps);

            lastTime.current = time;
            animationId = requestAnimationFrame(render);
        }

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <p className="text-md">{t("FPS")}: {fps}</p>;
};

export default GameFPS;
