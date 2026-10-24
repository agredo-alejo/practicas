export const constrain = (num, min, max) => {
    return Math.max(Math.min(num, max), min);
};
export const map = (num, start1, end1, start2, end2) => {
    return (num - start1) / (end1 - start1) * (end2 - start2) + start2;
};
export const randomInt = (min, max = 1) => {
    if (typeof min == 'number')
        return Math.floor(Math.random() * (max - min) + min);
    return Math.floor(Math.random() * (min[1] - min[0]) + min[0]);
};
export const randomRange = (min, max = 1) => {
    if (typeof min == 'number')
        return Math.random() * (max - min) + min;
    return Math.random() * (min[1] - min[0]) + min[0];
};
export const randomNormal = (mean = 0, sd = 1) => {
    // TODO: change from polar box-muller to ziggurat method
    let rand, rand2, radius;
    do {
        rand = Math.random() * 2 - 1;
        rand2 = Math.random() * 2 - 1;
        radius = rand * rand + rand2 * rand2;
    } while (radius >= 1 || radius == 0);
    let stdNorm = rand * Math.sqrt(-2 * Math.log(radius) / radius);
    return sd * stdNorm + mean;
};
export const randomStdNorm = () => {
    // TODO: change from polar box-muller to ziggurat method
    let rand, rand2, radius;
    do {
        rand = Math.random() * 2 - 1;
        rand2 = Math.random() * 2 - 1;
        radius = rand * rand + rand2 * rand2;
    } while (radius >= 1 || radius == 0);
    return rand * Math.sqrt(-2 * Math.log(radius) / radius);
};
