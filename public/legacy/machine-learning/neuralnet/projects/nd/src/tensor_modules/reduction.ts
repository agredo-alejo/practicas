import { ensureTensor } from "./t_utils.js";
import { constrain as util_constrain } from "../util.js";
import {Tensor} from "./tensor.js";
import { TensorLike } from "../types.js";
export const mean = (tensor: Tensor | TensorLike) => {
    let sum = 0
    let numValues = 0
    let result = ensureTensor(tensor)
    result.forEach(x => {
        numValues++
        sum += x
        return x
    })
    return sum / numValues
}

export const sumExp = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let result = 0
    internTensor.forEach(x => {
        result += Math.exp(util_constrain(x, -50, 50))
        return x
    })
    return result
}

export const max = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let record = -Infinity
    internTensor.forEach(x => {
        record = x > record ? x : record
        return x
    })
    return record
}
export const min = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let record = Infinity
    internTensor.forEach(x => {
        record = x < record ? x : record
        return x
    })
    return record
}

export const sum = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let result = 0
    internTensor.forEach(x => {
        result += x
        return x
    })
    return result
}