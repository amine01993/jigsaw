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
    return { offset: { topRows, rightCols, bottomRows, leftCols }, outsidePositions: positions };
}
