function convolution(matrix, filter) {
    let newMatrix = []
    for (let i = 0; i < matrix.length - filter.length + 1; i++) {
        newMatrix[i] = []
        for (let j = 0; j < matrix[0].length - filter[0].length + 1; j++) {
            let sum = 0
            for (let k = 0; k < filter.length; k++) {
                for (let m = 0; m < filter[0].length; m++) {
                    sum += matrix[i + k][j + m] * filter[k][m]

                }
            }
            newMatrix[i][j] = sum
        }
    }
    return newMatrix
}
function matrixSum(matrix, matrix2) {
    let newMatrix = []
    for (let i = 0; i < matrix.length; i++) {
        newMatrix[i] = []
        for (let j = 0; j < matrix[0].length; j++) {
            newMatrix[i][j] = matrix[i][j] + matrix2[i][j]
        }

    }
    return newMatrix
}
function chanels(matrixArray, filterArray) {
    let newMatrixArray = []
    for (let i = 0; i < filterArray.length; i++) {
        newMatrixArray[i] = array2d(
            matrixArray[0].length - filterArray[0].length + 1,
            matrixArray[0][0].length - filterArray[0][0].length + 1
        )

        for (let j = 0; j < matrixArray.length; j++) {
            newMatrixArray[i] = matrixSum(newMatrixArray[i], convolution(matrixArray[j], filterArray[i]))
        }
    }
    return newMatrixArray
}
