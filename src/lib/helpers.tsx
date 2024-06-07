const isObject = (item: unknown) =>
    item !== null && typeof item === 'object' && !Array.isArray(item);

export const mergeDeep = (
    target: { [key: string]: any },
    ...sources: { [key: string]: any }[]
): Object => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};

export function pick<T extends object, K extends keyof T>(
    base: T,
    ...keys: K[]
): Pick<T, K> {
    const entries = keys.map((key) => [key, base[key]]);

    return Object.fromEntries(entries);
}

export function omit<T extends object, K extends keyof T>(
    base: T,
    ...keys: K[]
): Omit<T, K> {
    const result = { ...base };

    for (const key of keys) delete result[key];

    return result;
}