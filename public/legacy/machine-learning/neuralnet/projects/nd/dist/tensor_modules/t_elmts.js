import * as t_create from "./t_creation.js";
export const forEach = (tensor, func) => {
    let recursion = (array) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                recursion(array[index]);
            }
        }
        else {
            for (let index = 0; index < array.length; index++) {
                array[index] = func(array[index]);
            }
        }
    };
    if (tensor instanceof Array) {
        recursion(tensor);
        return tensor;
    }
    return func(tensor);
};
export const forEachReturn = (tensor, func) => {
    let recursion = (array, resultArray) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = [];
                recursion(array[index], resultArray[index]);
            }
        }
        else {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = func(array[index]);
            }
        }
    };
    if (tensor instanceof Array) {
        let result = [];
        recursion(tensor, result);
        return result;
    }
    else {
        return func(tensor);
    }
};
export const forEachOfBoth = (tensor, tensor2, func) => {
    let recursion = (array, array2) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                recursion(array[index], array2[index]);
            }
        }
        else {
            for (let index = 0; index < array.length; index++) {
                array[index] = func(array[index], array2[index]);
            }
        }
    };
    if (tensor instanceof Array) {
        if (tensor2 instanceof Array) {
            recursion(tensor, tensor2);
            return tensor;
        }
        return forEach(tensor, x => func(x, tensor2));
    }
    else if (tensor2 instanceof Array) {
        return t_create.tensor(forEachReturn(tensor2, x => func(x, tensor)));
    }
    return func(tensor, tensor2);
};
export const forEachOfBothReturn = (tensor, tensor2, func) => {
    let recursion = (array, array2, resultArray) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = [];
                recursion(array[index], array2[index], resultArray[index]);
            }
        }
        else {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = func(array[index], array2[index]);
            }
        }
    };
    if (tensor instanceof Array) {
        if (tensor2 instanceof Array) {
            let result = [];
            recursion(tensor, tensor2, result);
            return result;
        }
        return forEachReturn(tensor, x => func(x, tensor2));
    }
    else if (tensor2 instanceof Array) {
        return forEachReturn(tensor2, x => func(x, tensor));
    }
    return func(tensor, tensor2);
};
export const accesLastArray = (tensorArray, func) => {
    let recursion = (array) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                recursion(array[index]);
            }
        }
        else {
            func(array);
        }
    };
    recursion(tensorArray);
    return tensorArray;
};
export const accesLastArrayReturn = (tensorArray, func) => {
    let result = [];
    let recursion = (array, resultArray) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = [];
                recursion(array[index], resultArray[index]);
            }
        }
        else {
            func(array, resultArray);
        }
    };
    recursion(tensorArray, result);
    return result;
};
export const accesLastArrays = (tensorArray, tensorArray2, func) => {
    let recursion = (array, array2) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                recursion(array[index], array2[index]);
            }
        }
        else {
            func(array, array2);
        }
    };
    recursion(tensorArray, tensorArray2);
};
export const accesLastArraysReturn = (tensorArray, tensorArray2, func) => {
    let result = [];
    let recursion = (array, array2, resultArray) => {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = [];
                recursion(array[index], array2[index], resultArray[index]);
            }
        }
        else {
            func(array, array2, resultArray);
        }
    };
    recursion(tensorArray, tensorArray2, result);
    return result;
};
// export const accesAxis = (tensor: any[], func: any, axis = inferRank(tensor)) => {
//     let counter = 0
//     let recursion = (elmt: any) => {
//         if (counter < axis) {
//             for (let index = 0; index < elmt.length; index++) {
//                 recursion(elmt[index])
//             }
//         } else {
//         }
//     }
// }
