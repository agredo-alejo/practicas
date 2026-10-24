import { Tensor } from "./tensor.js";
import { inferShape, ensureTensor } from "./t_utils.js";
export const fromObject = (tensor) => {
    return new Tensor(tensor.data, tensor.shape);
};
export const fromVector = (array, shape = [array.length]) => {
    let size = 1;
    for (let i = 0; i < shape.length; i++) {
        size *= shape[i];
    }
    if (size !== array.length)
        throw console.error('Based on the provided shape the tensor should have ' + size + ' values but has ' + array.length);
    let tensor = array;
    for (let dimentionNumber = shape.length - 1; dimentionNumber >= 0; dimentionNumber--) {
        let dimentionData = [];
        let element = 0;
        for (let dimentionShape = 0; dimentionShape < tensor.length / shape[dimentionNumber]; dimentionShape++) {
            dimentionData[dimentionShape] = [];
            for (let length = 0; length < shape[dimentionNumber]; length++) {
                dimentionData[dimentionShape][length] = tensor[element];
                element++;
            }
        }
        tensor = dimentionData;
    }
    tensor = tensor[0];
    return new Tensor(tensor, shape);
};
export const fromArray = (array, shape) => {
    shape = shape || inferShape(array);
    return new Tensor(array, shape);
};
export const scalar = (number) => {
    return new Tensor(number, [], 0);
};
export const tensor = (data, shape = inferShape(data)) => {
    if (!(data[0] instanceof Array) && shape.length > 1) {
        return fromVector(data, shape);
    }
    return new Tensor(data, shape);
};
export const create = (data, shape = inferShape(data)) => {
    if (!(data[0] instanceof Array) && shape.length > 1) {
        return fromVector(data, shape);
    }
    return new Tensor(data, shape);
};
export const identity = (shape) => {
    let result = [];
    for (let i = 0; i < shape[0]; i++) {
        result[i] = [];
        for (let j = 0; j < shape[1]; j++) {
            result[i][j] = i == j ? 1 : 0;
        }
    }
    return new Tensor(result, shape);
};
export const fill = (shape, value = 0) => {
    let size = 1;
    for (let index = 0; index < shape.length; index++) {
        size *= shape[index];
    }
    let data = [];
    for (let index = 0; index < size; index++) {
        data[index] = value;
    }
    return fromVector(data, shape);
};
export const zeros = (shape) => {
    let size = 1;
    for (let index = 0; index < shape.length; index++) {
        size *= shape[index];
    }
    let data = [];
    for (let index = 0; index < size; index++) {
        data[index] = 0;
    }
    return fromVector(data, shape);
};
export const zerosLike = (tensor) => {
    let internTensor = ensureTensor(tensor);
    let size = 1;
    for (let index = 0; index < internTensor.rank; index++) {
        size *= internTensor.shape[index];
    }
    let data = [];
    for (let index = 0; index < size; index++) {
        data[index] = 0;
    }
    return fromVector(data, internTensor.shape);
};
export const ones = (shape) => {
    let size = 1;
    for (let index = 0; index < shape.length; index++) {
        size *= shape[index];
    }
    let data = [];
    for (let index = 0; index < size; index++) {
        data[index] = 1;
    }
    return fromVector(data, shape);
};
export const onesLike = (tensor) => {
    let internTensor = ensureTensor(tensor);
    let size = 1;
    for (let index = 0; index < internTensor.rank; index++) {
        size *= internTensor.shape[index];
    }
    let data = [];
    for (let index = 0; index < size; index++) {
        data[index] = 1;
    }
    return fromVector(data, internTensor.shape);
};
export const oneHot = (indices, depth) => {
    if (typeof indices == 'number') {
        let result = zeros([depth]);
        if (result.data instanceof Array && result.data[indices] !== undefined) {
            result.data[indices] = 1;
        }
        return result;
    }
    let internTensor = ensureTensor(indices);
    let shape = internTensor.shape.slice();
    shape.push(depth);
    let result = zeros(shape);
    let indice = 0;
    result.accesLastArray((array) => {
        let index = internTensor.data[indice];
        if (array[index] !== undefined) {
            array[index] = 1;
        }
        indice++;
    });
    return result;
};
export const range = (start, stop, step = 1) => {
    let result = [];
    step = Math.abs(step);
    if (start < stop) {
        while (start < stop) {
            result.push(start);
            start += step;
        }
    }
    else {
        while (start < stop) {
            result.push(start);
            start -= step;
        }
    }
    return new Tensor(result, [result.length]);
};
