import * as t_create from "./t_creation.js"
import { Tensor } from "./tensor.js";
import { TensorLike } from "../types.js";
import { ensureTensor } from "./t_utils.js";
export const flatten = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let vector: number[] = []
    internTensor.forEach((x: number) => {
        vector.push(x)
        return x
    })
    return new Tensor(vector, [vector.length])
}

export const reshape = (tensor: Tensor | TensorLike, shape: number[]): Tensor => {
    return flatten(tensor).vectorToTensor(shape)
}

export const vectorToTensor = (tensor: Tensor | number[], shape: number[]): Tensor => {
    let size = 1
    for (let i = 0; i < shape.length; i++) {
        size *= shape[i]
    }
    let internTensor = ensureTensor(tensor)
    if (size == internTensor.data.length) {
        let tensor = internTensor.data
        for (let dimentionNumber = shape.length - 1; dimentionNumber >= 0; dimentionNumber--) {
            let dimentionData: any[] = []
            let element = 0
            for (let dimentionShape = 0; dimentionShape < tensor.length / shape[dimentionNumber]; dimentionShape++) {
                dimentionData[dimentionShape] = []
                for (let length = 0; length < shape[dimentionNumber]; length++) {
                    dimentionData[dimentionShape][length] = tensor[element]
                    element++
                }
            }
            tensor = dimentionData
        }
        tensor = tensor[0]
        return new Tensor(tensor, shape)

    } else {
        throw console.error('Based on the provided shape the tensor should have ' + size + ' values but has ' + internTensor.data.length)
    }
}

export const tile = (tensor: Tensor|TensorLike, reps: number[]) => {
    let internTensor = ensureTensor(tensor)
    if (reps.length !== internTensor.rank) {
        throw console.error('Dimentions in reps ' + reps + ' does not match with the number of dimentions from tensor ' + internTensor.shape)
    }
    let newShape: number[] = []
    for (let i = 0; i < internTensor.rank; i++) {
        newShape[i] = reps[i] * internTensor.shape[i]
    }
    let newData: any[] = []
    let recursion = (array: any[], array2: any[], currentDimention: number) => {
        if (array[0] instanceof Array) {
            for (let i = 0; i < newShape[currentDimention]; i++) {
                array2[i] = []
                recursion(array[i % internTensor.shape[currentDimention]], array2[i], currentDimention + 1)
            }
        }
        else {
            for (let i = 0; i < newShape[newShape.length - 1]; i++) {
                array2[i] = array[i % internTensor.shape[internTensor.rank - 1]]
            }
        }
    }
    recursion(internTensor.data, newData, 0)
    return t_create.fromArray(newData, newShape)
}

export const broadcastTo = (tensor: Tensor | TensorLike, shape: number[]) => {
    let internTensor = ensureTensor(tensor)
    let oldShape = internTensor.shape.slice()
    if (shape.length < internTensor.rank) {
        throw console.error('Rank from shape ' + shape.length + ' is minor than tensor rank ' + internTensor.rank)
    }
    let result = internTensor
    if (shape.length > internTensor.rank) {
        let newShape = oldShape.slice();
        while (newShape.length < shape.length) {
            newShape.unshift(1)
        }
        result = reshape(internTensor, newShape)
    }
    let reps = shape.slice()
    for (let index = 0; index < shape.length; index++) {
        if (result.shape[index] === shape[index]) {
            reps[index] = 1;
        } else if (result.shape[index] !== 1) {
            throw console.error(oldShape + ' cannot be broadcast to ' + shape)
        }
    }
    return tile(result, reps)
}

export const broadcastArgs = (shape: number[], shape2: number[]) => {
    let oldShape = shape.slice(), oldShape2 = shape2.slice()
    if (oldShape.length > oldShape2.length) {
        while (oldShape2.length < oldShape.length) {
            oldShape2.unshift(1)
        }
    } else {
        while (oldShape.length < oldShape2.length) {
            oldShape.unshift(1)
        }
    }
    let resultShape = []
    for (let index = 0; index < oldShape.length; index++) {
        resultShape[index] = Math.max(oldShape[index], oldShape2[index])
    }
    return resultShape
}
export const stack = (listOfTensors: Tensor[]) => {
    let result = []
    let shape = listOfTensors[0].shape
    for (let index = 0; index < listOfTensors.length; index++) {
        for (let j = 0; j < listOfTensors[index].rank; j++) {
            if (listOfTensors[index].shape[j] !== shape[j]) {
                console.error('Tensors must have the same shape')
                return
            }
        }
        result[index] = listOfTensors[index].data
    }
    shape.unshift(listOfTensors.length)
    return new Tensor(result, shape)
}
export const unstack = (tensor: Tensor | TensorLike) => {
    let internTensor = ensureTensor(tensor)
    let shape = internTensor.shape.slice()
    shape.shift()
    let result = []
    for (let index = 0; index < internTensor.data.length; index++) {
        result[index] = new Tensor(internTensor.data[index], shape)
    }
    return result
}
