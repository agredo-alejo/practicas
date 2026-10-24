import { ensureTensor } from "./t_utils.js";
import { constrain as util_constrain } from "../util.js";
import { Tensor } from "./tensor.js";
import { forEachReturn } from "./t_elmts.js";
import { sub, div } from "./arithmetic.js";
import { max, min, sumExp } from "./reduction.js";
export const mathOP = (fn) => {
    return (tensor) => {
        let internTensor = ensureTensor(tensor);
        let result = forEachReturn(internTensor.data, x => fn(x));
        return new Tensor(result, internTensor.shape);
    };
};
export const neg = mathOP(x => -x);
export const abs = mathOP(x => Math.abs(x));
export const acos = mathOP(x => Math.acos(x));
export const acosh = mathOP(x => Math.acosh(x));
export const asin = mathOP(x => Math.asin(x));
export const asinh = mathOP(x => Math.asinh(x));
export const atan = mathOP(x => Math.atan(x));
export const cbrt = mathOP(x => Math.cbrt(x));
export const ceil = mathOP(x => Math.ceil(x));
export const cos = mathOP(x => Math.cos(x));
export const cosh = mathOP(x => Math.cosh(x));
export const exp = mathOP(x => Math.exp(x));
export const expm1 = mathOP(x => Math.expm1(x));
export const floor = mathOP(x => Math.floor(x));
export const log = mathOP(x => Math.log(x));
export const log10 = mathOP(x => Math.log10(x));
export const log2 = mathOP(x => Math.log2(x));
export const round = mathOP(x => Math.round(x));
export const sign = mathOP(x => Math.sign(x));
export const sin = mathOP(x => Math.sin(x));
export const sinh = mathOP(x => Math.sinh(x));
export const sqrt = mathOP(x => Math.sqrt(x));
export const square = mathOP(x => x * x);
export const tan = mathOP(x => Math.tan(x));
export const tanh = mathOP(x => Math.tanh(x));
export const trunc = mathOP(x => Math.trunc(x));
export const sigmoid = mathOP(x => 1 / (1 + Math.exp(-x)));
export const relu = mathOP(x => Math.max(0, x));
export const leakyRelu = mathOP(x => Math.max(0.05 * x, x));
export const elu = mathOP(x => x > 0 ? x : 0.05 * (Math.exp(x) - 1));
export const softplus = mathOP(x => Math.log(1 + Math.exp(x)));
export const step = (tensor, alpha = 0) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => x > 0 ? 1 : alpha * x);
    return new Tensor(result, internTensor.shape);
};
export const softmax = (tensor) => {
    let internTensor = ensureTensor(tensor);
    let trick = sub(internTensor, internTensor.max());
    return div(exp(trick), sumExp(trick));
};
export const remap = (tensor, start1, end1, start2, end2) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => (x - start1) / (end1 - start1) * (end2 - start2) + start2);
    return new Tensor(result, internTensor.shape);
};
export const changeRange = (tensor, start = 0, end = 1) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => (x - min(internTensor.data)) / (max(internTensor.data) - min(internTensor.data)) * (end - start) + start);
    return new Tensor(result, internTensor.shape);
};
export const map = (tensor, func) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => func(x));
    return new Tensor(result, internTensor.shape);
};
export const constrain = (tensor, min, max) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => Math.max(Math.min(x, max), min));
    return new Tensor(result, internTensor.shape);
};
export const varianceSquared = (tensor) => {
    let internTensor = ensureTensor(tensor);
    return square(sub(internTensor, internTensor.mean())).mean();
};
export const variance = (tensor) => {
    let internTensor = ensureTensor(tensor);
    return Math.sqrt(square(sub(internTensor, internTensor.mean())).mean());
};
export const expNoInfinity = (tensor, min = -50, max = 50) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => Math.exp(util_constrain(x, min, max)));
    return new Tensor(result, internTensor.shape);
};
export const logNoNan = (tensor, min = 1e-100, max = Infinity) => {
    let internTensor = ensureTensor(tensor);
    let result = forEachReturn(internTensor.data, x => Math.exp(util_constrain(x, min, max)));
    return new Tensor(result, internTensor.shape);
};
