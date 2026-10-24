import { ones } from "../tensor_modules/t_creation.js";
import { map, exp } from "../tensor_modules/basic_math.js";
import { mult, sub, div } from "../tensor_modules/arithmetic.js";
import { sumExp } from "../tensor_modules/reduction.js";
import { Tensor } from "../tensor_modules/tensor.js";
import { dot } from "../tensor_modules/matrix.js";
export const linear = {
    fn: tensor => tensor,
    fnPrime: tensor => ones(tensor.shape),
    updateError: (outputGradient) => outputGradient,
    name: 'linear'
};
export const sigmoid = {
    fn: tensor => map(tensor, x => 1 / (1 + Math.exp(-x))),
    fnPrime: tensor => map(tensor, x => x * (1 - x)),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'sigmoid'
};
export const relu = {
    fn: tensor => map(tensor, x => Math.max(0, x)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'relu'
};
export const leakyrelu = {
    fn: tensor => map(tensor, x => Math.max(0.05 * x, x)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0.05),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'leakyrelu'
};
export const elu = {
    fn: tensor => map(tensor, x => x > 0 ? x : 0.05 * (Math.exp(x) - 1)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0.05 + x),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'elu'
};
export const softplus = {
    fn: tensor => map(tensor, x => Math.log(1 + Math.exp(x))),
    fnPrime: tensor => map(tensor, x => 1 / (1 + Math.exp(-x))),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'softplus'
};
export const binayStep = {
    fn: tensor => map(tensor, x => x > 0 ? 1 : 0),
    fnPrime: tensor => map(tensor, () => 0),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'binaryStep'
};
export const tanh = {
    fn: tensor => map(tensor, x => Math.tanh(x)),
    fnPrime: tensor => map(tensor, x => 1 - x ** 2),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'tanh'
};
export const softmax = {
    fn: tensor => {
        let trick = sub(tensor, tensor.max());
        return div(exp(trick), sumExp(trick));
    },
    fnPrime: tensor => {
        let result = [];
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = [];
            for (let j = 0; j < tensor.shape[0]; j++) {
                if (i == j) {
                    result[i][j] = tensor.data[i] * (1 - tensor.data[i]);
                }
                else {
                    result[i][j] = -tensor.data[i] * tensor.data[j];
                }
            }
        }
        return new Tensor(result, [tensor.shape[0], tensor.shape[0]]);
    },
    updateError: (outputGradient, fnDeriv) => dot(fnDeriv, outputGradient),
    name: 'softmax'
};
export const handler = (type) => {
    switch (type) {
        case 'sigmoid':
            return sigmoid;
        case 'relu':
            return relu;
        case 'binaryStep':
            return binayStep;
        case 'tanh':
            return tanh;
        case 'softmax':
            return softmax;
        case 'linear':
            return linear;
        default:
            return sigmoid;
    }
};
