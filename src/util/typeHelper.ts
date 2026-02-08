

export type Maybe<T> = T | null | undefined;
export type Act<TResult = void> = () => TResult;
export type Fn<TArgs extends readonly any[],TResult = void> = (...args: TArgs) => TResult;
export type ValueOf<T> = T[keyof T];

export type Spread<T1, T2> = T2 & Omit<T1, keyof T2>;

export type StrictOmit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P]; };

export type ExtractArray<T extends any[]> = (T)[number];