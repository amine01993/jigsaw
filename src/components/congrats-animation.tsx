import { memo, useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import { useGame } from "@/contexts/game";

interface CongratsAnimationProps {
    itemSize: number;
}

const CongratsAnimation = ({ itemSize }: CongratsAnimationProps) => {
    const congratsCanvas = useRef<HTMLCanvasElement>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const confetti = useRef<ConfettiPiece[]>([]);
    const isAnimating = useRef(false);
    const animationId = useRef(0);
    const levelUpSound = useRef<HTMLAudioElement | null>(null);
    const { isGameComplete, gridDims, settings } = useGame();

    // Initialize particles
    const initParticles = useCallback(() => {
        confetti.current = [];
        for (let i = 0; i < 100; i++) {
            confetti.current.push(
                new ConfettiPiece(congratsCanvas.current!.width)
            );
        }
    }, []);

    // Start animation loop
    const startAnimation = useCallback(() => {
        if (!isAnimating.current) return;

        // Clear canvas
        ctx.current!.clearRect(
            0,
            0,
            congratsCanvas.current!.width,
            congratsCanvas.current!.height
        );

        // Update and draw confetti
        confetti.current.forEach((item) => {
            item.update(
                congratsCanvas.current!.width,
                congratsCanvas.current!.height
            );
            item.draw(ctx.current!);
        });

        animationId.current = requestAnimationFrame(startAnimation);
    }, []);

    useEffect(() => {
        if (isGameComplete) {
            const canvas = congratsCanvas.current;
            if (canvas) {
                ctx.current = canvas.getContext("2d");
                if (ctx.current) {
                    // Start the confetti animation
                    isAnimating.current = true;
                    initParticles();
                    startAnimation();
                    if(levelUpSound.current && settings.playSound) {
                        levelUpSound.current.play().catch((error) => {
                            console.error("Error playing level up sound:", error);
                        });
                    }
                }
            }
        } else {
            isAnimating.current = false;
            cancelAnimationFrame(animationId.current);
        }

        return () => {
            isAnimating.current = false;
            cancelAnimationFrame(animationId.current);
        };
    }, [isGameComplete, settings.playSound]);

    return (
        <>
            <canvas
                ref={congratsCanvas}
                width={gridDims.cols * itemSize}
                className={classNames(
                    "absolute top-12 left-1/2 -translate-x-1/2 pointer-events-none h-[calc(100vh-48px)]",
                    { "hidden": !isGameComplete }
                )}
            />
            <audio ref={levelUpSound} src="./sounds/chipquest.wav" preload="auto" />
        </>
    );
};

export default memo(CongratsAnimation);

// Confetti particle class
class ConfettiPiece {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    size: number;
    gravity: number;

    constructor(canvasWidth: number) {
        this.x = Math.random() * canvasWidth;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = Math.random() * 3 + 2;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.size = Math.random() * 8 + 4;
        this.gravity = 0.1;
    }

    getRandomColor() {
        const colors = [
            "#003049",
            "#d62828",
            "#f77f00",
            "#fcbf49",
            "#eae2b7",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;

        if (this.y > canvasHeight + 10) {
            this.y = -10;
            this.x = Math.random() * canvasWidth;
            this.vy = Math.random() * 3 + 2;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
