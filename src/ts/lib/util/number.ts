function createUidFunction() {
    let uid = 0;

    return (): number => {
        return uid++;
    }
}

export const uid = createUidFunction();