import { generateGameData, imageDataToImageBitmap } from "@/helpers/image";

self.onmessage = async function (e: MessageEvent) {
    const { puzzleItemsNumber, loadedProgress, canvas, image } = e.data as {
        puzzleItemsNumber: number;
        loadedProgress: Record<string, any> | null;
        canvas: OffscreenCanvas;
        image: ImageData;
    };

    const imageBitmap = await imageDataToImageBitmap(canvas, image);

    const result = await generateGameData(puzzleItemsNumber, loadedProgress, canvas, imageBitmap);

    // Send result back to main thread
    self.postMessage({ result });
};

export {};