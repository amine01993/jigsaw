import type { PuzzlePiece } from "@/components/game/puzzle-item";
import {
    getGridDims,
    getGridPadding,
    getIndexFromCoords,
    getOffsetAndOutsidePositions,
    getPlaceholderCount,
    getPuzzleDims,
} from "./helper";
import type { GameData } from "@/contexts/game";

// Convert ImageData to ImageBitmap
export async function imageDataToImageBitmap(
    canvas: OffscreenCanvas,
    imageData: ImageData
): Promise<ImageBitmap> {
    const tempCtx = canvas.getContext("2d")!;

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    tempCtx.putImageData(imageData, 0, 0);

    return await createImageBitmap(canvas);
}

// Convert HtmlImageElement to ImageData
export function htmlImageToImageData(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement
): ImageData | null {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
        alert("Failed to get canvas context!");
        return null;
    }

    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function generateGameData(
    puzzleItemsNumber: number,
    loadedProgress: Record<string, any> | null,
    canvas: HTMLCanvasElement | OffscreenCanvas,
    image: HTMLImageElement | ImageBitmap
): Promise<GameData> {
    let placeholderPositions: { x: number; y: number }[] | null = null;
    
    if (loadedProgress) {
        placeholderPositions = loadedProgress.placeholders || null;
    }

    const pieces: PuzzlePiece[] = [];
    const _puzzleDims = getPuzzleDims(puzzleItemsNumber);
    const data = getOffsetAndOutsidePositions(
        _puzzleDims.rows,
        _puzzleDims.cols
    );

    const _gridPadding = getGridPadding(data.offset);
    const _gridDims = getGridDims(_puzzleDims, _gridPadding);

    if (!canvas) {
        throw new Error("Canvas element is required");
    }

    const ctx = canvas.getContext("2d") as
        | OffscreenCanvasRenderingContext2D
        | CanvasRenderingContext2D
        | null;

    if (ctx) {
        const w = image.width / _puzzleDims.cols;
        const h = image.height / _puzzleDims.rows;
        const pieceSize = Math.min(w, h);

        canvas.width = pieceSize;
        canvas.height = pieceSize;

        // Loop through each cell and extract the puzzle piece
        for (let r = 0; r < _puzzleDims.rows; r++) {
            for (let c = 0; c < _puzzleDims.cols; c++) {
                // Draw the puzzle piece on the canvas
                ctx.drawImage(
                    image,
                    -c * pieceSize,
                    -r * pieceSize,
                    image.width,
                    image.height
                );

                let imageObj: string | Blob = "";
                if (canvas instanceof OffscreenCanvas) {
                    imageObj = await canvas.convertToBlob();
                } else {
                    imageObj = canvas.toDataURL();
                }

                pieces.push({
                    id: r * 10000 + c,
                    image: imageObj,
                    position: null,
                    correctPosition: { x: c, y: r },
                    outsidePosition: { x: -1, y: -1 },
                });
            }
        }
    }

    const _placeholders: { x: number; y: number; image: string | Blob }[] = [];
    const placeholderCount = getPlaceholderCount(puzzleItemsNumber);

    // Shuffle the grid positions
    pieces.sort((_, __) => {
        return Math.random() < 0.5 ? 1 : -1;
    });

    // Set the position of each piece outside the grid
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].outsidePosition = data.outsidePositions[i];
        if (placeholderPositions) {
            const isPlaceholder = placeholderPositions.some(
                (pos) =>
                    pieces[i].correctPosition.x === pos.x &&
                    pieces[i].correctPosition.y === pos.y
            );
            if (isPlaceholder) {
                _placeholders.push({
                    x: pieces[i].correctPosition.x,
                    y: pieces[i].correctPosition.y,
                    image: pieces[i].image,
                });
            }
        }
        else if (i < placeholderCount) {
            _placeholders.push({
                x: pieces[i].correctPosition.x,
                y: pieces[i].correctPosition.y,
                image: pieces[i].image,
            });
        }
    }

    // Set the puzzle pieces in the grid
    const gamePieces: (PuzzlePiece | null)[] = Array.from(
        {
            length: _gridDims.rows * _gridDims.cols,
        },
        () => null
    );

    for (const piece of pieces) {
        const index = getIndexFromCoords(
            piece.outsidePosition.x + _gridPadding.x,
            piece.outsidePosition.y + _gridPadding.y,
            _gridDims.rows,
            _gridDims.cols
        );

        gamePieces[index] = piece;
    }

    if (loadedProgress) {
        for (let i = 0; i < gamePieces.length; i++) {
            const piece = gamePieces[i];
            if (piece && !piece.position) {
                const key = `${piece.correctPosition.x}-${piece.correctPosition.y}`;
                if (loadedProgress[key]) {
                    const newIndex = getIndexFromCoords(
                        loadedProgress[key].x + _gridPadding.x,
                        loadedProgress[key].y + _gridPadding.y,
                        _gridDims.rows,
                        _gridDims.cols
                    );
                    gamePieces[newIndex] = {
                        ...piece,
                        position: {
                            x: loadedProgress[key].x,
                            y: loadedProgress[key].y,
                        },
                    };
                    gamePieces[i] = null;
                }
            }
        }
    }

    return {
        pieces: gamePieces,
        offset: data.offset,
        placeholders: _placeholders,
    };
}
