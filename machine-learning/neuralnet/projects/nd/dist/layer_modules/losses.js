import { sqd, sub, mult, divNoNan, add, div } from "../tensor_modules/arithmetic.js";
import { sumExp, max } from "../tensor_modules/reduction.js";
import { exp, log } from "../tensor_modules/basic_math.js";
import { size } from "../tensor_modules/t_utils.js";
export class Loss {
    constructor(object) {
        this.fn = object.fn;
        this.fnPrime = object.fnPrime;
        this.type = object.type;
        this.name = object.name;
    }
    static handler(string) {
        switch (string) {
            case 'mse':
                return meanSquaredError;
            case 'crossEntropy':
                return crossEntropy;
            case 'softmaxCrossEntropy':
                return softmaxCrossEntropy;
            case 'binaryCrossEntropy':
                return binaryCrossEntropy;
            default:
                return meanSquaredError;
        }
    }
    serialize() {
        return JSON.stringify(this);
    }
}
export const meanSquaredError = new Loss({
    fn: (output, target) => sqd(target, output).mean(),
    fnPrime: (output, target) => sub(output, target).mult(2).div(size(output)),
    type: 'loss',
    name: 'mse'
});
export const crossEntropy = new Loss({
    fn: (output, target) => -mult(target, log(output)).sum(),
    fnPrime: (output, target) => mult(target, divNoNan(-1, output)),
    type: 'loss',
    name: 'crossEntropy'
});
export const softmaxCrossEntropy = new Loss({
    fn: (output, target) => {
        let trick = sub(output, max(output));
        let activation = div(exp(trick), sumExp(trick));
        // let activation = softmax.fn(output)
        return -mult(target, log(activation)).sum();
    },
    fnPrime: (output, target) => {
        // console.log(output);
        let trick = sub(output, max(output));
        // console.log(trick);
        let activation = divNoNan(exp(trick), sumExp(trick));
        let result = sub(activation, target);
        // console.log(result);
        return result;
    },
    type: 'loss',
    name: 'softmaxCrossEntropy'
});
export const binaryCrossEntropy = new Loss({
    fn: (output, target) => {
        let first = mult(target, log(output));
        let second = sub(1, target);
        let third = log(sub(1, output));
        let result = add(first, mult(second, third));
        return -result.mean();
    },
    fnPrime: (output, target) => {
        let first = divNoNan(sub(1, target), sub(1, output));
        let second = divNoNan(target, output);
        let result = sub(first, second);
        return divNoNan(result, size(result));
    },
    type: 'loss',
    name: 'binaryCrossEntropy'
});
