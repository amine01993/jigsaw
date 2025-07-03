import { generateGameData, imageDataToImageBitmap } from "@/helpers/image";

self.onmessage = async function (e: MessageEvent) {
    const { puzzleItemsNumber, canvas, image } = e.data as {
        puzzleItemsNumber: number;
        canvas: OffscreenCanvas;
        image: ImageData;
    };

    const imageBitmap = await imageDataToImageBitmap(canvas, image);

    const result = await generateGameData(puzzleItemsNumber, canvas, imageBitmap);

    // Send result back to main thread
    self.postMessage({ result });
};

export {};