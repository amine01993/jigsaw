import type { PuzzlePiece } from "@/components/puzzle-item";
import type { DifficultyLevel, OffsetType } from "@/contexts/game";

export function getOffsetAndOutsidePositions(rows: number, cols: number) {
    const positions: { x: number; y: number }[] = [];
    let pieceIndex = 0,
        piecesLength = rows * cols,
        c,
        r;
    let rowStart = -1,
        colStart = 0,
        rowEnd = rows,
        colEnd = cols;
    let leftCols = 0,
        rightCols = 0,
        topRows = 1,
        bottomRows = 0;

    while (pieceIndex < piecesLength) {
        c = colStart;
        r = rowStart;
        // console.log(
        //     `rowStart=${rowStart}, colStart=${colStart}, rowEnd=${rowEnd}, colEnd=${colEnd}`
        // );
        while (pieceIndex < piecesLength && c <= colEnd) {
            positions.push({ x: c, y: r });
            // console.log(
            //     `Setting piece ${pieceIndex} outside position to (${c}, ${r})`
            // );
            pieceIndex++;
            c++;
        }

        c = Math.min(c, colEnd);
        rightCols = Math.max(rightCols, c - (cols - 1));
        r = pieceIndex < piecesLength && r <= rowEnd ? r + 1 : r;
        while (pieceIndex < piecesLength && r <= rowEnd) {
            positions.push({ x: c, y: r });
            // console.log(
            //     `Setting piece ${pieceIndex} outside position to (${c}, ${r})`
            // );
            pieceIndex++;
            r++;
        }

        r = Math.min(r, rowEnd);
        bottomRows = Math.max(bottomRows, r - (rows - 1));
        c = pieceIndex < piecesLength && c >= colStart ? c - 1 : c;
        colStart =
            pieceIndex < piecesLength && c >= colStart
                ? colStart - 1
                : colStart;
        while (pieceIndex < piecesLength && c >= colStart) {
            positions.push({ x: c, y: r });
            // console.log(
            //     `Setting piece ${pieceIndex} outside position to (${c}, ${r})`
            // );
            pieceIndex++;
            c--;
        }

        c = Math.max(c, colStart);
        leftCols = Math.max(leftCols, -c);
        r = pieceIndex < piecesLength && r >= rowStart ? r - 1 : r;
        rowStart =
            pieceIndex < piecesLength && r >= rowStart
                ? rowStart - 1
                : rowStart;
        while (pieceIndex < piecesLength && r >= rowStart) {
            positions.push({ x: c, y: r });
            // console.log(
            //     `Setting piece ${pieceIndex} outside position to (${c}, ${r})`
            // );
            pieceIndex++;
            r--;
        }

        r = Math.max(r, rowStart);
        topRows = Math.max(topRows, -r);

        // console.log(
        //     `Updated topRows=${topRows}, rightCols=${rightCols}, bottomRows=${bottomRows}, leftCols=${leftCols}`
        // );

        rowEnd++;
        colEnd++;
    }
    return {
        offset: {
            top: topRows,
            right: rightCols,
            bottom: bottomRows,
            left: leftCols,
        },
        outsidePositions: positions,
    };
}

export function getPuzzleDims(difficulty: DifficultyLevel) {
    switch (difficulty) {
        case "medium":
            return { cols: 5, rows: 5 };
        case "hard":
            return { cols: 7, rows: 7 };
        default:
            return { cols: 3, rows: 3 };
    }
}

export function getGridPadding(offset: OffsetType) {
    return {
        y: Math.max(offset.top, offset.bottom),
        x: Math.max(offset.left, offset.right),
    };
}

export function getGridDims(
    puzzleDims: { cols: number; rows: number },
    gridPadding: { x: number; y: number }
) {
    return {
        cols: puzzleDims.cols + 2 * gridPadding.x,
        rows: puzzleDims.rows + 2 * gridPadding.y,
    };
}

export function getCoordsFromIndex(
    index: number,
    cols: number
): { x: number; y: number } {
    const x = index % cols;
    const y = Math.floor(index / cols);
    return { x, y };
}

export function getIndexFromCoords(
    x: number,
    y: number,
    rows: number,
    cols: number
): number {
    if (x < 0 || x >= cols || y < 0 || y >= rows) {
        throw new Error("Coordinates out of bounds");
    }
    return y * cols + x;
}

export function isInsideTheGrid(
    col: number,
    row: number,
    gridPadding: {
        x: number;
        y: number;
    },
    puzzleDims: {
        cols: number;
        rows: number;
    }
): boolean {
    const { x, y } = gridPadding;
    const { cols, rows } = puzzleDims;

    return col >= x && col < cols + x && row >= y && row < rows + y;
}

export function clonePieces(
    pieces: (PuzzlePiece | null)[]
): (PuzzlePiece | null)[] {
    return pieces.map((piece) => {
        if (!piece) return null;
        return {
            ...piece,
            position: piece.position ? { ...piece.position } : null,
            correctPosition: { ...piece.correctPosition },
            outsidePosition: { ...piece.outsidePosition },
        };
    });
}

export function getDurationFromSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        hours > 0 ? String(hours).padStart(2, "0") : null,
        String(minutes).padStart(2, "0"),
        String(secs).padStart(2, "0"),
    ]
        .filter(Boolean)
        .join(":");
}
