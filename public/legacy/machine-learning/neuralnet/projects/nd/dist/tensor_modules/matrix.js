// Matries
import { Tensor } from "./tensor.js";
import { ensureTensor } from "./t_utils.js";
export const dotMxM = (tensor, tensor2) => {
    if (tensor.shape[1] !== tensor2.shape[0])
        throw console.error('Colums of A must match rows of B');
    let result = [];
    for (let i = 0; i < tensor.shape[0]; i++) {
        result[i] = [];
        for (let j = 0; j < tensor2.shape[1]; j++) {
            let sum = 0;
            for (let k = 0; k < tensor.shape[1]; k++) {
                sum += tensor.data[i][k] * tensor2.data[k][j];
            }
            result[i][j] = sum;
        }
    }
    return new Tensor(result, [tensor.shape[0], tensor2.shape[1]]);
};
export const dotMxV = (tensor, tensor2) => {
    if (tensor.shape[1] !== tensor2.shape[0])
        throw console.error('Colums of A must match rows of B');
    let result = [];
    for (let i = 0; i < tensor.shape[0]; i++) {
        let sum = 0;
        for (let k = 0; k < tensor.shape[1]; k++) {
            sum += tensor.data[i][k] * tensor2.data[k];
        }
        result[i] = sum;
    }
    return new Tensor(result, [tensor.shape[0]]);
};
export const dotVxM = (tensor, tensor2) => {
    if (tensor2.shape[0] !== 1)
        throw console.error('Colums of A must match rows of B');
    let result = [];
    for (let i = 0; i < tensor.shape[0]; i++) {
        result[i] = [];
        for (let j = 0; j < tensor2.shape[1]; j++) {
            result[i][j] = tensor.data[i] * tensor2.data[0][j];
        }
    }
    return new Tensor(result, [tensor.shape[0], tensor2.shape[1]]);
};
export const dotVxV = (tensor, tensor2) => {
    if (tensor.shape[0] !== tensor2.shape[0])
        throw console.error('Colums of A must match rows of B');
    let sum = 0;
    for (let k = 0; k < tensor.shape[0]; k++) {
        sum += tensor.data[k] * tensor2.data[k];
    }
    return new Tensor(sum, []);
};
export const dot = (tensor, tensor2) => {
    if (tensor.rank == 2) {
        if (tensor2.rank == 2) {
            return dotMxM(tensor, tensor2);
        }
        return dotMxV(tensor, tensor2);
    }
    if (tensor2.rank == 2) {
        return dotVxM(tensor, tensor2);
    }
    return dotVxV(tensor, tensor2);
};
export const transpose = (tensor) => {
    let internTensor = ensureTensor(tensor);
    if (internTensor.rank == 2) {
        let result = [];
        for (let i = 0; i < internTensor.shape[1]; i++) {
            result[i] = [];
            for (let j = 0; j < internTensor.shape[0]; j++) {
                result[i][j] = internTensor.data[j][i];
            }
        }
        return new Tensor(result, [internTensor.shape[1], internTensor.shape[0]]);
    }
    else {
        let result = [[]];
        for (let i = 0; i < internTensor.shape[0]; i++) {
            result[0][i] = internTensor.data[i];
        }
        return new Tensor(result, [1, internTensor.shape[0]]);
    }
};
export const mirrorHorizontally = (matrix) => {
    let internTensor = ensureTensor(matrix);
    let result = [];
    for (let i = 0; i < internTensor.shape[0]; i++) {
        result[i] = [];
        for (let j = 0, k = internTensor.shape[1] - 1; j < k; j++, k--) {
            result[i][j] = internTensor.data[i][k];
            result[i][k] = internTensor.data[i][j];
        }
    }
    return new Tensor(result, internTensor.shape);
};
export const mirrorVertically = (matrix) => {
    let internTensor = ensureTensor(matrix);
    let result = [];
    for (let i = 0; i < internTensor.shape[1]; i++) {
        result[i] = [];
    }
    for (let j = 0; j < internTensor.shape[1]; j++) {
        for (let i = 0, k = internTensor.shape[0] - 1; i < k; i++, k--) {
            result[i][j] = internTensor.data[k][j];
            result[k][j] = internTensor.data[i][j];
        }
    }
    return new Tensor(result, internTensor.shape);
};
export const rotate180 = (matrix) => {
    let internTensor = ensureTensor(matrix);
    let result = [];
    for (let i = 0; i < internTensor.shape[0]; i++) {
        result[i] = internTensor.data[i].slice();
        for (let j = 0, k = internTensor.shape[1] - 1; j < k; j++, k--) {
            result[i][j] = internTensor.data[i][k];
            result[i][k] = internTensor.data[i][j];
        }
    }
    for (let j = 0; j < internTensor.shape[1]; j++) {
        for (let i = 0, k = internTensor.shape[0] - 1; i < k; i++, k--) {
            result[i][j] = internTensor.data[k][j];
            result[k][j] = internTensor.data[i][j];
        }
    }
    return new Tensor(result, internTensor.shape);
};
export const rotate90 = (matrix) => {
    let internTensor = ensureTensor(matrix);
    let result = [];
    let newCol = 0, newRow = 0;
    for (let i = 0; i < internTensor.shape[1]; i++) {
        result[newRow] = [];
        newCol = 0;
        for (let j = internTensor.shape[0] - 1; j >= 0; j--) {
            result[newRow][newCol] = internTensor.data[j][i];
            newCol++;
        }
        newRow++;
    }
    return new Tensor(result, [internTensor.shape[1], internTensor.shape[0]]);
};
export const rotate270 = (matrix) => {
    let internTensor = ensureTensor(matrix);
    let result = [];
    let newCol, newRow = 0;
    for (let i = internTensor.shape[1] - 1; i >= 0; i--) {
        result[newRow] = [];
        newCol = 0;
        for (let j = 0; j < internTensor.shape[0]; j++) {
            result[newRow][newCol] = internTensor.data[j][i];
            newCol++;
        }
        newRow++;
    }
    return new Tensor(result, [internTensor.shape[1], internTensor.shape[0]]);
};
export const padding = (input, paddAmt) => {
    let internInput = ensureTensor(input);
    if (paddAmt[0] == 0 && paddAmt[1] == 0)
        return internInput;
    let padHeight = paddAmt[0], padWidth = paddAmt[1];
    let topPad = Math.floor(paddAmt[0] / 2);
    let bottomPad = paddAmt[0] - topPad;
    let leftPad = Math.floor(paddAmt[1] / 2);
    let rightPad = paddAmt[1] - leftPad;
    let result = [];
    for (let i = 0; i < internInput.shape[1]; i++) {
        result[i] = internInput.data[i].slice();
        for (let j = 0; j < leftPad; j++) {
            result[i].unshift(0);
        }
        for (let j = 0; j < rightPad; j++) {
            result[i].push(0);
        }
    }
    for (let i = 0; i < topPad; i++) {
        result.unshift(new Array(result[0].length).fill(0));
    }
    for (let i = 0; i < bottomPad; i++) {
        result.push(new Array(result[0].length).fill(0));
    }
    return new Tensor(result, [internInput.shape[0] + padHeight, internInput.shape[1] + padWidth]);
};
