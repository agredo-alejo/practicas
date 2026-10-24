import { Tensor } from "./tensor.js";
import { fromVector } from "./t_creation.js";
export const inferShape = (array) => {
    let inferredShape = [];
    let checkingArray = array;
    while (checkingArray instanceof Array) {
        inferredShape.push(checkingArray.length);
        checkingArray = checkingArray[0];
    }
    return inferredShape;
};
export const inferRank = (array) => {
    let rank = 0;
    let checkingArray = array;
    while (checkingArray instanceof Array) {
        rank += 1;
        checkingArray = checkingArray[0];
    }
    return rank;
};
export const ensureTensor = (tensor) => {
    if (tensor instanceof Tensor) {
        return tensor;
    }
    return new Tensor(tensor, inferShape(tensor));
};
export const shuffle = (array) => {
    let lastIndex = array.length - 1;
    while (lastIndex > 0) {
        let randomIndex = Math.floor(Math.random() * lastIndex + 1);
        let temp = array[lastIndex];
        array[lastIndex] = array[randomIndex];
        array[randomIndex] = temp;
        lastIndex -= 1;
    }
    return array;
};
export const shuffleMatch = (array, array2) => {
    let lastIndex = array.length - 1;
    while (lastIndex > 0) {
        let randomIndex = Math.floor(Math.random() * lastIndex + 1);
        let temp = array[lastIndex];
        let temp2 = array2[lastIndex];
        array[lastIndex] = array[randomIndex];
        array2[lastIndex] = array2[randomIndex];
        array[randomIndex] = temp;
        array2[randomIndex] = temp2;
        lastIndex -= 1;
    }
    return [array, array2];
};
export const size = (tensor) => {
    let internTensor = ensureTensor(tensor);
    let size = 1;
    for (let i = 0; i < internTensor.shape.length; i++) {
        size *= internTensor.shape[i];
    }
    return size;
};
export const shapesEqual = (shape, shape2) => {
    if (shape.length !== shape2.length)
        return false;
    for (let i = 0; i < shape.length; i++) {
        if (shape[i] !== shape2[i])
            return false;
    }
    return true;
};
export const arraysEqual = (array, array2) => {
    if (array.length !== array2.length)
        return false;
    for (let i = 0; i < array.length; i++) {
        if (array[i] !== array2[i])
            return false;
    }
    return true;
};
export const rangeOfValues = (tensor) => {
    let max = -Infinity;
    let min = Infinity;
    let internTensor = ensureTensor(tensor);
    internTensor.forEach((x) => {
        max = x > max ? x : max;
        min = x < min ? x : min;
        return x;
    });
    return [min, max];
};
export const copy = (tensor) => {
    let recursion = (copy, array) => {
        if (array[0] instanceof Array) {
            for (let i = 0; i < array.length; i++) {
                copy[i] = [];
                recursion(copy[i], array[i]);
            }
        }
        else {
            for (let i = 0; i < array.length; i++) {
                copy[i] = array[i];
            }
        }
    };
    let internTensor = ensureTensor(tensor);
    if (internTensor.data instanceof Array) {
        let newTensor = [];
        recursion(newTensor, internTensor.data);
        return new Tensor(newTensor, internTensor.shape);
    }
    else {
        return new Tensor(internTensor.data, internTensor.shape);
    }
};
export const random = (shape, options = []) => {
    if (shape instanceof Tensor) {
        shape = shape.shape;
    }
    let min = options[0] == undefined ? -1 : options[0];
    let max = options[1] == undefined ? 1 : options[1];
    let floor = options[2];
    let size = 1;
    for (let i = 0; i < shape.length; i++) {
        size *= shape[i];
    }
    let data = [];
    if (floor == undefined) {
        for (let i = 0; i < size; i++) {
            data[i] = Math.random() * (max - min) + min;
        }
    }
    else {
        for (let i = 0; i < size; i++) {
            data[i] = Math.floor(Math.random() * (max - min) + min);
        }
    }
    return fromVector(data, shape);
};
