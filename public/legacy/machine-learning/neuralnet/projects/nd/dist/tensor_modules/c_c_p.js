// Correlate, Convolution and Pooling operations 
import { Tensor } from "./tensor.js";
import { ensureTensor, inferShape } from "./t_utils.js";
import { padding as t_padding, rotate180 } from "./matrix.js";
import { tensor, zeros } from "./t_creation.js";
export const c_c_outputShape = (inputShape, filterShape, paddingAmount, stride, dilation) => {
    let outputShape = [
        (inputShape[0] + paddingAmount[0] - dilation[0] * (filterShape[0] - 1) - 1) / stride[0] + 1,
        (inputShape[1] + paddingAmount[1] - dilation[1] * (filterShape[1] - 1) - 1) / stride[1] + 1,
    ];
    outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1])];
    return outputShape;
};
export const ccv_outputShape = (inputShape, filterShape, paddingAmount, stride, dilation) => {
    let outputShape = [
        inputShape[0],
        (inputShape[1] + paddingAmount[0] - dilation[0] * (filterShape[1] - 1) - 1) / stride[0] + 1,
        (inputShape[2] + paddingAmount[1] - dilation[1] * (filterShape[2] - 1) - 1) / stride[1] + 1,
    ];
    outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1]), Math.floor(outputShape[2])];
    return outputShape;
};
export const cc_reuseFilter_outputShape = (inputShape, filterShape, paddingAmount, stride, dilation) => {
    let outputShape = [
        inputShape[0],
        (inputShape[1] + paddingAmount[0] - dilation[0] * (filterShape[0] - 1) - 1) / stride[0] + 1,
        (inputShape[2] + paddingAmount[1] - dilation[1] * (filterShape[1] - 1) - 1) / stride[1] + 1,
    ];
    outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1]), Math.floor(outputShape[2])];
    return outputShape;
};
export const cc_manyFilters_outputShape = (inputShape, filterShape, paddingAmount, stride, dilation) => {
    let outputShape = [
        filterShape[0],
        (inputShape[1] + paddingAmount[0] - dilation[0] * (filterShape[2] - 1) - 1) / stride[0] + 1,
        (inputShape[2] + paddingAmount[1] - dilation[1] * (filterShape[3] - 1) - 1) / stride[1] + 1,
    ];
    outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1]), Math.floor(outputShape[2])];
    return outputShape;
};
export const mp_outputShape = (inputShape, paddingAmount, poolSize, stride) => {
    let outputShape = [
        Math.floor(((inputShape[0] + paddingAmount[0]) - poolSize[0]) / stride[0] + 1),
        Math.floor(((inputShape[1] + paddingAmount[1]) - poolSize[1]) / stride[1] + 1),
    ];
    return outputShape;
};
export const mp_v_outputShape = (inputShape, paddingAmount, poolSize, stride) => {
    let outputShape = [
        inputShape[0],
        Math.floor(((inputShape[1] + paddingAmount[0]) - poolSize[0]) / stride[0] + 1),
        Math.floor(((inputShape[2] + paddingAmount[1]) - poolSize[1]) / stride[1] + 1),
    ];
    return outputShape;
};
export const c_c_paddAmount = (inputShape, filterShape, padding, stride = [1, 1], dilation = [1, 1]) => {
    if (padding == 'valid')
        return [0, 0];
    let padHeight, padWidth;
    let inputImgSize = [inputShape[inputShape.length - 2], inputShape[inputShape.length - 1]], filterSize = [filterShape[filterShape.length - 2], filterShape[filterShape.length - 1]];
    // 
    if (padding == 'same') {
        padHeight = Math.floor(dilation[0] * (filterSize[0] - 1) + (inputImgSize[0] - 1) * (stride[0] - 1));
        padWidth = Math.floor(dilation[1] * (filterSize[1] - 1) + (inputImgSize[1] - 1) * (stride[1] - 1));
        return [padHeight, padWidth];
    }
    else if (padding == 'full') {
        padHeight = (filterSize[0] - 1) * 2;
        padWidth = (filterSize[1] - 1) * 2;
        return [padHeight, padWidth];
    }
    return [0, 0];
};
export const mp_paddAmount = (inputShape, padding, poolSize, stride) => {
    if (padding) {
        let outputShape = [
            Math.floor((inputShape[inputShape.length - 2] - poolSize[0]) / stride[0]) + 1,
            Math.floor((inputShape[inputShape.length - 1] - poolSize[1]) / stride[1]) + 1
        ];
        let inputShape2 = [
            poolSize[0] + (outputShape[0] - 1) * stride[0],
            poolSize[1] + (outputShape[1] - 1) * stride[1],
        ];
        let diference = [
            inputShape[inputShape.length - 2] - inputShape2[0],
            inputShape[inputShape.length - 1] - inputShape2[1]
        ];
        let paddingAmount = [
            diference[0] > 0 ? poolSize[0] - diference[0] : 0,
            diference[1] > 0 ? poolSize[1] - diference[1] : 0
        ];
        return paddingAmount;
    }
    else {
        return [0, 0];
    }
};
export const correlate = (input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // input tensor 2d / 3d, filter tensor 2d / 3d
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filter);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    if (internInput.rank == 2) {
        let outputShape = c_c_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
        let inputData = t_padding(internInput, paddAmt);
        let result = [];
        for (let imgRow = 0; imgRow < outputShape[0]; imgRow++) {
            result[imgRow] = [];
            for (let imgCol = 0; imgCol < outputShape[1]; imgCol++) {
                let sum = 0;
                for (let kernelRow = 0; kernelRow < internFilter.shape[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < internFilter.shape[1]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0];
                        let col = kernelCol * dilation[1] + imgCol * stride[1];
                        sum += inputData.data[row][col] * internFilter.data[kernelRow][kernelCol];
                    }
                }
                result[imgRow][imgCol] = sum;
            }
        }
        return new Tensor(result, outputShape);
    }
    else {
        let outputShape = ccv_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
        // console.log(outputShape);
        let inputData = [];
        for (let index = 0; index < internInput.shape[0]; index++) {
            inputData[index] = t_padding(internInput.data[index], paddAmt).data;
        }
        inputData = new Tensor(inputData, inferShape(inputData));
        let result = zeros(outputShape);
        for (let depth = 0; depth < inputData.shape[0]; depth++) {
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let sum = 0;
                    for (let kernelRow = 0; kernelRow < internFilter.shape[1]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < internFilter.shape[2]; kernelCol++) {
                            let row = kernelRow * dilation[0] + imgRow * stride[0];
                            let col = kernelCol * dilation[1] + imgCol * stride[1];
                            sum += inputData.data[depth][row][col] * internFilter.data[depth][kernelRow][kernelCol];
                        }
                    }
                    result.data[depth][imgRow][imgCol] += sum;
                }
            }
        }
        return result;
    }
};
export const corr_reuseFilter = (input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // input tensor 3d, filter tensor 2d 
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filter);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    let internFilterShape = internFilter.shape.slice();
    internFilterShape.shift();
    let outputShape = cc_reuseFilter_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
    let inputData = [];
    for (let index = 0; index < internInput.shape[0]; index++) {
        inputData[index] = t_padding(internInput.data[index], paddAmt).data;
    }
    inputData = new Tensor(inputData, inferShape(inputData));
    let result = zeros(outputShape);
    for (let depth = 0; depth < inputData.shape[0]; depth++) {
        for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
            for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                let sum = 0;
                for (let kernelRow = 0; kernelRow < internFilter.shape[2]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < internFilter.shape[3]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0];
                        let col = kernelCol * dilation[1] + imgCol * stride[1];
                        sum += inputData.data[depth][row][col] * internFilter.data[kernelRow][kernelCol];
                    }
                }
                result.data[depth][imgRow][imgCol] += sum;
            }
        }
    }
    return result;
};
export const corr_manyFilters = (input, filters, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // Input tensor3d, filters tensor4d
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filters);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    let inputData = [];
    for (let index = 0; index < internInput.shape[0]; index++) {
        inputData[index] = t_padding(internInput.data[index], paddAmt).data;
    }
    inputData = new Tensor(inputData, inferShape(inputData));
    let outputShape = cc_manyFilters_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
    let result = zeros(outputShape);
    for (let numFilters = 0; numFilters < internFilter.shape[0]; numFilters++) {
        for (let depth = 0; depth < internInput.shape[0]; depth++) {
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let sum = 0;
                    for (let kernelRow = 0; kernelRow < internFilter.shape[2]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < internFilter.shape[3]; kernelCol++) {
                            let row = kernelRow * dilation[0] + imgRow * stride[0];
                            let col = kernelCol * dilation[1] + imgCol * stride[1];
                            sum += inputData.data[depth][row][col] * internFilter.data[numFilters][depth][kernelRow][kernelCol];
                        }
                    }
                    result.data[numFilters][imgRow][imgCol] += sum;
                }
            }
        }
    }
    return result;
};
export const corr_manyFilters_addB = (input, filters, bias, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // Input tensor3d, filters tensor4d
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filters);
    let internBias = ensureTensor(bias);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    let inputData = [];
    for (let index = 0; index < internInput.shape[0]; index++) {
        inputData[index] = t_padding(internInput.data[index], paddAmt).data;
    }
    inputData = new Tensor(inputData, inferShape(inputData));
    let outputShape = cc_manyFilters_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
    let result = zeros(outputShape);
    for (let numFilters = 0; numFilters < internFilter.shape[0]; numFilters++) {
        for (let depth = 0; depth < internInput.shape[0]; depth++) {
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let sum = 0;
                    for (let kernelRow = 0; kernelRow < internFilter.shape[2]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < internFilter.shape[3]; kernelCol++) {
                            let row = kernelRow * dilation[0] + imgRow * stride[0];
                            let col = kernelCol * dilation[1] + imgCol * stride[1];
                            sum += inputData.data[depth][row][col] * internFilter.data[numFilters][depth][kernelRow][kernelCol];
                        }
                    }
                    result.data[numFilters][imgRow][imgCol] += sum + internBias.data[numFilters][imgRow][imgCol] / outputShape[0];
                }
            }
        }
    }
    return result;
};
export const convolution = (input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // input tensor 2d / 3d, filter tensor 2d / 3d
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filter);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    if (internInput.rank == 2) {
        let rotatedFilter = rotate180(internFilter);
        let outputShape = c_c_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
        let inputData = t_padding(internInput, paddAmt);
        let result = [];
        for (let imgRow = 0; imgRow < outputShape[0]; imgRow++) {
            result[imgRow] = [];
            for (let imgCol = 0; imgCol < outputShape[1]; imgCol++) {
                let sum = 0;
                for (let kernelRow = 0; kernelRow < rotatedFilter.shape[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < rotatedFilter.shape[1]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0];
                        let col = kernelCol * dilation[1] + imgCol * stride[1];
                        sum += inputData.data[row][col] * rotatedFilter.data[kernelRow][kernelCol];
                    }
                }
                result[imgRow][imgCol] = sum;
            }
        }
        // console.log(result);
        return new Tensor(result, outputShape);
    }
    else {
        let outputShape = ccv_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
        let inputData = [];
        let rotatedFilter = [];
        for (let index = 0; index < internInput.shape[0]; index++) {
            inputData[index] = t_padding(internInput.data[index], paddAmt).data;
            rotatedFilter[index] = rotate180(internFilter.data[index]).data;
        }
        inputData = new Tensor(inputData, inferShape(inputData));
        rotatedFilter = new Tensor(rotatedFilter, internFilter.shape);
        let result = zeros(outputShape);
        for (let depth = 0; depth < inputData.shape[0]; depth++) {
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let sum = 0;
                    for (let kernelRow = 0; kernelRow < rotatedFilter.shape[1]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < rotatedFilter.shape[2]; kernelCol++) {
                            let row = kernelRow * dilation[0] + imgRow * stride[0];
                            let col = kernelCol * dilation[1] + imgCol * stride[1];
                            sum += inputData.data[depth][row][col] * rotatedFilter.data[depth][kernelRow][kernelCol];
                        }
                    }
                    result.data[depth][imgRow][imgCol] += sum;
                }
            }
        }
        // console.log(result);
        return result;
    }
};
export const conv_reuseFilter = (input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // input tensor  3d, filter tensor 2d 
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filter);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    let internFilterShape = internFilter.shape.slice();
    internFilterShape.shift();
    let outputShape = cc_reuseFilter_outputShape(internInput.shape, internFilter.shape, paddAmt, stride, dilation);
    let inputData = [];
    for (let index = 0; index < internInput.shape[0]; index++) {
        inputData[index] = t_padding(internInput.data[index], paddAmt).data;
    }
    inputData = new Tensor(inputData, inferShape(inputData));
    let rotatedFilter = rotate180(internFilter);
    let result = zeros(outputShape);
    for (let depth = 0; depth < inputData.shape[0]; depth++) {
        for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
            for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                let sum = 0;
                for (let kernelRow = 0; kernelRow < rotatedFilter.shape[2]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < rotatedFilter.shape[3]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0];
                        let col = kernelCol * dilation[1] + imgCol * stride[1];
                        sum += inputData.data[depth][row][col] * rotatedFilter.data[kernelRow][kernelCol];
                    }
                }
                result.data[depth][imgRow][imgCol] += sum;
            }
        }
    }
    return result;
};
export const conv_manyFilters = (input, filters, padding = 'valid', stride = [1, 1], dilation = [1, 1]) => {
    // Input tensor3d, filters tensor4d
    let internInput = ensureTensor(input);
    let internFilter = ensureTensor(filters);
    let paddAmt = padding instanceof Array ? padding : c_c_paddAmount(internInput.shape, internFilter.shape, padding, stride, dilation);
    let inputData = [];
    for (let index = 0; index < internInput.shape[0]; index++) {
        inputData[index] = t_padding(internInput.data, paddAmt).data;
    }
    inputData = new Tensor(inputData, inferShape(inputData));
    let rotatedFilter = [];
    for (let nFilters = 0; nFilters < internFilter.shape[0]; nFilters++) {
        rotatedFilter[nFilters] = [];
        for (let depth = 0; depth < internFilter.shape[1]; depth++) {
            rotatedFilter[nFilters][depth] = rotate180(internFilter.data[nFilters][depth]).data;
        }
    }
    rotatedFilter = new Tensor(rotatedFilter, internFilter.shape);
    let outputShape = cc_manyFilters_outputShape(internInput.shape, rotatedFilter.shape, paddAmt, stride, dilation);
    let result = zeros(outputShape);
    for (let numFilters = 0; numFilters < rotatedFilter.shape[0]; numFilters++) {
        for (let depth = 0; depth < internInput.shape[0]; depth++) {
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let sum = 0;
                    for (let kernelRow = 0; kernelRow < rotatedFilter.shape[2]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < rotatedFilter.shape[3]; kernelCol++) {
                            let row = kernelRow * dilation[0] + imgRow * stride[0];
                            let col = kernelCol * dilation[1] + imgCol * stride[1];
                            sum += inputData.data[depth][row][col] * rotatedFilter.data[numFilters][depth][kernelRow][kernelCol];
                        }
                    }
                    result.data[numFilters][imgRow][imgCol] += sum;
                }
            }
        }
    }
    return result;
};
export const maxPooling = (input, padding, poolSize = [2, 2], stride = poolSize, coords) => {
    coords = [];
    let internInput = ensureTensor(input);
    let paddAmt = padding instanceof Array ? padding.slice() : mp_paddAmount(internInput.shape, padding, poolSize, stride);
    let inputData = t_padding(internInput.data, paddAmt);
    let outputShape = mp_outputShape(internInput.shape, paddAmt, poolSize, stride);
    let result = zeros(outputShape);
    for (let imgRow = 0; imgRow < outputShape[0]; imgRow++) {
        for (let imgCol = 0; imgCol < outputShape[1]; imgCol++) {
            let record = -Infinity;
            let tempCoords = [];
            for (let kernelRow = 0; kernelRow < poolSize[0]; kernelRow++) {
                for (let kernelCol = 0; kernelCol < poolSize[1]; kernelCol++) {
                    let row = kernelRow + imgRow * stride[0], col = kernelCol + imgCol * stride[1];
                    if (inputData.data[row][col] > record) {
                        record = inputData.data[row][col];
                        tempCoords = [row, col, imgRow, imgCol];
                    }
                }
            }
            coords.push(tempCoords);
            result.data[imgRow][imgCol] = record;
        }
    }
    return result;
};
export const maxPoolingVolume = (input, padding, poolSize = [2, 2], stride = poolSize, coords = []) => {
    coords = [];
    // input tensor3d
    let internInput = ensureTensor(input);
    let paddAmt = padding instanceof Array ? padding.slice() : mp_paddAmount(internInput.shape, padding, poolSize, stride);
    let inputData = [];
    for (let depth = 0; depth < internInput.shape[0]; depth++) {
        inputData[depth] = t_padding(internInput.data[depth], paddAmt).data;
    }
    inputData = tensor(inputData);
    let outputShape = mp_v_outputShape(internInput.shape, paddAmt, poolSize, stride);
    // let result: TensorLike3D = []
    let result = zeros(outputShape);
    for (let depth = 0; depth < inputData.shape[0]; depth++) {
        // result[depth] = []
        for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
            // result[depth][imgRow] = []
            for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                let record = -Infinity;
                let tempCoords = [];
                for (let kernelRow = 0; kernelRow < poolSize[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < poolSize[1]; kernelCol++) {
                        let row = kernelRow + imgRow * stride[0], col = kernelCol + imgCol * stride[1];
                        if (inputData.data[depth][row][col] > record) {
                            record = inputData.data[depth][row][col];
                            tempCoords = [depth, row, col, imgRow, imgCol];
                        }
                    }
                }
                coords.push(tempCoords);
                result.data[depth][imgRow][imgCol] = record;
            }
        }
    }
    return result;
};
