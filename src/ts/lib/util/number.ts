function createUidFunction() {
    let uid = 0;

    return (): number => {
        return uid++;
    }
}

export const uid = createUidFunction();

export function roundToMultiple(val: number, mul: number) {
    return Math.round(val * mul) / mul;
}

export function roundToTolerance(val: number, tol: number) {
    return roundToMultiple(val, 1 / tol);
}

export function msToLength(ms: number, sampleRate: number): number {
	return Math.round(sampleRate / 1000 * ms);
}