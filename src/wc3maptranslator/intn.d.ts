declare module 'intn' {
    export default class IntN {
        constructor(size: number)
        
        public fromInt(number: number): {bytes: number[]};
    }
}