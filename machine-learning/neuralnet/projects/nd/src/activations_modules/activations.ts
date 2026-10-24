import { ones } from "../tensor_modules/t_creation.js"
import { map, exp } from "../tensor_modules/basic_math.js"
import { mult, sub, div } from "../tensor_modules/arithmetic.js"
import { sumExp } from "../tensor_modules/reduction.js"
import { Tensor } from "../tensor_modules/tensor.js"
import { dot } from "../tensor_modules/matrix.js"

export interface ActivationLike {
    name: string; fn: (t: Tensor) => Tensor; fnPrime: (t: Tensor) => Tensor; updateError: (t: Tensor, t2: Tensor) => Tensor;
}

export const linear: ActivationLike = {
    fn: tensor => tensor,
    fnPrime: tensor => ones(tensor.shape),
    updateError: (outputGradient) => outputGradient,
    name: 'linear'
}
export const sigmoid: ActivationLike = {
    fn: tensor => map(tensor, x => 1 / (1 + Math.exp(-x))),
    fnPrime: tensor => map(tensor, x => x * (1 - x)),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'sigmoid'
}
export const relu: ActivationLike = {
    fn: tensor => map(tensor, x => Math.max(0, x)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'relu'
}
export const leakyrelu: ActivationLike = {
    fn: tensor => map(tensor, x => Math.max(0.05 * x, x)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0.05),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'leakyrelu'
}
export const elu: ActivationLike = {
    fn: tensor => map(tensor, x => x > 0 ? x : 0.05 * (Math.exp(x) - 1)),
    fnPrime: tensor => map(tensor, x => x > 0 ? 1 : 0.05 + x),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'elu'
}
export const softplus: ActivationLike = {
    fn: tensor => map(tensor, x => Math.log(1 + Math.exp(x))),
    fnPrime: tensor => map(tensor, x => 1 / (1 + Math.exp(-x))),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'softplus'
}
export const binayStep: ActivationLike = {
    fn: tensor => map(tensor, x => x > 0 ? 1 : 0),
    fnPrime: tensor => map(tensor, () => 0),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'binaryStep'
}
export const tanh: ActivationLike = {
    fn: tensor => map(tensor, x => Math.tanh(x)),
    fnPrime: tensor => map(tensor, x => 1 - x ** 2),
    updateError: (outputGradient, fnDeriv) => mult(outputGradient, fnDeriv),
    name: 'tanh'
}
export const softmax: ActivationLike = {
    fn: tensor => {
        let trick = sub(tensor, tensor.max())
        return div(exp(trick), sumExp(trick))
    },
    fnPrime: tensor => {
        let result: number[][] = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[0]; j++) {
                if (i == j) {
                    result[i][j] = tensor.data[i] * (1 - tensor.data[i])
                } else {
                    result[i][j] = -tensor.data[i] * tensor.data[j]
                }
            }
        }
        return new Tensor(result, [tensor.shape[0], tensor.shape[0]])
    },
    updateError: (outputGradient, fnDeriv) => dot(fnDeriv, outputGradient),
    name: 'softmax'
}
export const handler = (type: string) => {
    switch (type) {
        case 'sigmoid':
            return sigmoid
        case 'relu':
            return relu
        case 'binaryStep':
            return binayStep
        case 'tanh':
            return tanh
        case 'softmax':
            return softmax
        case 'linear':
            return linear

        default:
            return sigmoid
    }
}
