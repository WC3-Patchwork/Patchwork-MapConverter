
export function roundTo(v: number, precision: number){
    const pow = 10 ** precision;

    const scaled = v * pow;
    const precise = Number.parseFloat(scaled.toPrecision(15));

    if (precise < 0){
        return -Math.round(Math.abs(precise)) / pow;
    } else {
        return Math.round(precise) / pow;
    }
}