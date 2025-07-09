import { generateGameData, imageDataToImageBitmap } from "@/helpers/image";

self.onmessage = async function (e: MessageEvent) {
    const { puzzleItemsNumber, loadedData, canvas, image } = e.data as {
        puzzleItemsNumber: number;
        loadedData: Record<string, any> | null;
        canvas: OffscreenCanvas;
        image: ImageData;
    };

    const imageBitmap = await imageDataToImageBitmap(canvas, image);

    const result = await generateGameData(puzzleItemsNumber, loadedData, canvas, imageBitmap);

    // Send result back to main thread
    self.postMessage({ result });
};

export {};