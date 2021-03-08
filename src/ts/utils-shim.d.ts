export {}

declare global {
    type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

    type NoUndefined<T> = T extends undefined ? never : T;
}