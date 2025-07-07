// Generate a random integer between min and max (inclusive)
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param index
 * index = 0..3
 *
 *   0  |  1
 * _____|_____
 *      |
 *   2  |  3
 *
 * for index = 0 => x,y range from 0 to 50
 * for index = 1 => x=50..100 and y=0..50
 * for index = 2 => x=0..50 and y=50..100
 * for index = 3 => x=50..100 and y=50..100
 */
export function getRandomCoords(
    index: number,
    width: number,
    innerWidth: number,
    innerHeight: number
) {
    const height = Math.round((30 * innerWidth) / innerHeight);
    const xPadding = width / 2;
    const yPadding = Math.floor(height / 2);
    const xNegativeGap = -Math.floor(width / 3);
    const yNegativeGap = -Math.floor(height / 3);
    const x =
        index === 0 || index === 2
            ? getRandomInt(xPadding, 50 - xPadding - xNegativeGap)
            : getRandomInt(50 + xPadding + xNegativeGap, 100 - xPadding);
    const y =
        index === 0 || index === 1
            ? getRandomInt(yPadding, 50 - yPadding - yNegativeGap)
            : getRandomInt(50 + yPadding + yNegativeGap, 100 - yPadding);
    return { x, y };
}

export function rotateRight(list: any[], n: number) {
    const newList = Array.from({ length: list.length });
    for (let i = 0; i < list.length; i++) {
        newList[(i + n) % list.length] = list[i];
    }
    return newList;
}

export function rotateLeft(list: any[], n: number) {
    const newList = Array.from({ length: list.length });
    for (let i = 0; i < list.length; i++) {
        newList[(i - n + list.length) % list.length] = list[i];
    }
    return newList;
}

/**
 * Generates a range of numbers from start to end with N steps.
 * @param N - Number of steps
 * @param start - Start of the range (default is 0)
 * @param end - End of the range (default is 1)
 * @returns An array containing the range of numbers
 */
export function getRange(N: number, start = 0, end = 1) {
    const range = [],
        diff = (end - start) / (N - 1);
    let k = 0,
        i = 0;
    while (i < N) {
        range.push(Math.round(k * 100) / 100);
        k += diff;
        i++;
    }
    return range;
}

/**
 * Maps a list of numbers from one range to another.
 * @param list - The list of numbers to map
 * @param to - The range to map to, as a tuple [start, end]
 * @returns A new list with the mapped values
 */
export function mapRange(list: number[], to: [number, number]) {
    return list.map((value) => {
        return to[0] * (1 - value) + to[1] * value;
    });
}


export function duplicateArray(list: number[], multiplier: number) {
    const tmp = list.slice();
    for(let i = 0; i < multiplier - 1; i++) {
        list = list.concat(tmp);
    }
    return list;
}