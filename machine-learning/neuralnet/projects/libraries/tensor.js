const Tensor = class {
    constructor(data, shape) {
        this.data = data
        this.shape = shape
        this.numDimentions = this.shape.length
    }
    // Operations between tensors
    arithmeticTemplate(tensor, func, specialCase) {
        if (specialCase !== undefined) {
            switch (specialCase) {
                case 'MxM':
                    for (let i = 0; i < this.shape[0]; i++) {
                        for (let j = 0; j < this.shape[1]; j++) {
                            this.data[i][j] = func(this.data[i][j], tensor.data[i][j])
                        }
                    }
                    return this
                case 'MxV':
                    for (let i = 0; i < this.shape[0]; i++) {
                        for (let j = 0; j < this.shape[1]; j++) {
                            this.data[i][j] = func(this.data[i][j], tensor.data[j])
                        }
                    }
                    return this
                case 'VxM':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        for (let j = 0; j < tensor.shape[1]; j++) {
                            this.data[j] = func(this.data[j], tensor.data[i][j])
                        }
                    }
                    return this
                case 'VxV':
                    for (let i = 0; i < this.data.length; i++) {
                        this.data[i] = func(this.data[i], tensor.data[i])
                    }
                    return this
                case 'MxS':
                    for (let i = 0; i < this.shape[0]; i++) {
                        for (let j = 0; j < this.shape[1]; j++) {
                            this.data[i][j] = func(this.data[i][j], tensor)
                        }
                    }
                    return this
                case 'VxS':
                    for (let i = 0; i < this.shape[0]; i++) {
                        this.data[i] = func(this.data[i], tensor)
                    }
                    return this
                case 'TxS':
                    return this.accesLastArray(this.data, (array) => {
                        for (let index = 0; index < array.length; index++) {
                            array[index] = func(array[index], tensor)
                        }
                    })
                default:
                    break;
            }
        } else {
            if (this.numDimentions == tensor.numDimentions) {
                this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                    for (let index = 0; index < array.length; index++) {
                        array[index] = func(array[index], array2[index])
                    }
                })
                return this
            }
            else {
                let tempTensor = this.broadcast(tensor)
                this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                    for (let index = 0; index < array.length; index++) {
                        array[index] = func(array[index], array2[index])
                    }
                })
                return this
            }
        }
    }
    static arithmeticTemplate(tensor, tensor2, func, specialCase) {
        if (specialCase !== undefined) {
            let result = []
            switch (specialCase) {
                case 'MxM':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        result[i] = []
                        for (let j = 0; j < tensor.shape[1]; j++) {
                            result[i][j] = func(tensor.data[i][j], matrix2.data[i][j])
                        }
                    }
                    return new Tensor(result, tensor.shape)
                case 'MxV':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        result[i] = []
                        for (let j = 0; j < tensor.shape[1]; j++) {
                            result[i][j] = func(tensor.data[i][j], tensor2.data[j])
                        }
                    }
                    return new Vector(result, tensor.shape)
                case 'VxM':
                    for (let i = 0; i < tensor2.shape[0]; i++) {
                        for (let j = 0; j < tensor2.shape[1]; j++) {
                            result[j] = func(tensor.data[j], tensor2.data[i][j])
                        }
                    }
                    return new Tensor(result, tensor.shape)
                case 'VxV':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        result[i] = func(tensor.data[i], tensor2.data[i])
                    }
                    return new Tensor(result, tensor.shape)
                case 'MxS':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        result[i] = []
                        for (let j = 0; j < tensor.shape[1]; j++) {
                            result[i][j] = func(tensor.data[i][j] + tensor2)
                        }
                    }
                    return new Tensor(result, tensor.shape)
                case 'VxS':
                    for (let i = 0; i < tensor.shape[0]; i++) {
                        result[i] = tensor.data[i] + number
                    }
                    return new Tensor(result, tensor.shape)
                case 'TxS':
                    Tensor.accesLastArray(tensor.data, result, (array, resultArray) => {
                        for (let index = 0; index < array.length; index++) {
                            resultArray[index] = func(array[index], tensor2)
                        }
                    })
                    return new Tensor(result, tensor.shape)
                default:
                    break;
            }
        } else {
            if (tensor.numDimentions == tensor2.numDimentions) {
                let result = []
                Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                    for (let index = 0; index < array.length; index++) {
                        resultArray[index] = func(array[index], array2[index])
                    }
                })
                return new Tensor(result, tensor.shape)
            }
            else {
                let tempTensor = Tensor.broadcast(tensor, tensor2)
                let result = []
                Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                    for (let index = 0; index < array.length; index++) {
                        resultArray[index] = func(array[index], array2[index])
                    }
                })
                return new Tensor(result, tempTensor[0].shape)
            }
        }
    }
    add(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] += array2[index]
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] += array2[index]
                }
            })
            return this
        }
    }
    static add(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] + array2[index]
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] + array2[index]
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    addMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] += tensor.data[i][j]
            }
        }
        return this
    }
    static addMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = tensor.data[i][j] + tensor2.data[i][j]
            }
        }
        return new Tensor(result, tensor.shape)
    }
    addVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] += vector.data[i]
        }
        return this
    }
    static addVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] + vector2.data[i]
        }
        return new Tensor(result, vector.shape)
    }
    addTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] += number
            }
        })
        return this
    }
    static addTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray) => {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = array[index] + number
            }
        })
        return new Tensor(result, tensor.shape)
    }
    addMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] += number
            }
        }
        return this
    }
    static addMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] + number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    addVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] += number
        }
        return this
    }
    static addVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] + number
        }
        return new Tensor(result, vector.shape)
    }
    addN(tensors) {
        for (let i = 0; i < tensors.length; i++) {
            this.accesLastArrays(this.data, tensors[i].data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] += array2[index]
                }
            })
        }
        return this
    }
    static addN(tensors) {
        let result = tensors[0].copy()
        tensors.shift()
        return result.addN(tensors)
    }
    static addMatrixArray(matrix, matrix2){
        let result = []
        for (let i = 0; i < matrix.length; i++) {
            result[i] = []
            for (let j = 0; j < matrix[0].length; j++) {
                result[i][j] = matrix[i][j] + matrix2[i][j]
            }
        }
        return result
    }
    sub(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] -= array2[index]
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] -= array2[index]
                }
            })
            return this
        }
    }
    static sub(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] - array2[index]
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] - array2[index]
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    subMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] -= tensor.data[i][j]
            }
        }
        return this
    }
    static subMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = tensor.data[i][j] - tensor2.data[i][j]
            }
        }
        return new Tensor(result, tensor.shape)
    }
    subVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] -= vector.data[i]
        }
        return this
    }
    static subVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] - vector2.data[i]
        }
        return new Tensor(result, vector.shape)
    }
    subTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] -= number
            }
        })
        return this
    }
    static subTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = array[index] - number
            }
        })
        return new Tensor(result, tensor.shape)
    }
    subMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] -= number
            }
        }
        return this
    }
    static subMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] - number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    subVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] -= number
        }
        return this
    }
    static subVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] - number
        }
        return new Tensor(result, vector.shape)
    }
    static subSxT(scalar, tensor){
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray)=>{
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = scalar - array[index]
            }
        })
        return new Tensor(result, tensor.shape)
    }
    mult(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] *= array2[index]
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] *= array2[index]
                }
            })
            return this
        }
    }
    static mult(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] * array2[index]
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] * array2[index]
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    multMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] *= tensor.data[i][j]
            }
        }
        return this
    }
    static multMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = tensor.data[i][j] * tensor2.data[i][j]
            }
        }
        return new Tensor(result, tensor.shape)
    }
    multVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] *= vector.data[i]
        }
        return this
    }
    static multVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] * vector2.data[i]
        }
        return new Tensor(result, vector.shape)
    }
    multTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] *= number
            }
        })
        return this
    }
    static multTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray) => {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = array[index] * number
            }
        })
        return new Tensor(result, tensor.shape)
    }
    multMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] *= number
            }
        }
        return this
    }
    static multMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] * number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    multVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] *= number
        }
        return this
    }
    static multVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] * number
        }
        return new Tensor(result, vector.shape)
    }
    div(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] /= array2[index]
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] /= array2[index]
                }
            })
            return this
        }
    }
    static div(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] / array2[index]
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] / array2[index]
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    divMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] /= tensor.data[i][j]
            }
        }
        return this
    }
    static divMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = tensor.data[i][j] / tensor2.data[i][j]
            }
        }
        return new Tensor(result, tensor.shape)
    }
    divVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] /= vector.data[i]
        }
        return this
    }
    static divVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] / vector2.data[i]
        }
        return new Tensor(result, vector.shape)
    }
    divTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] /= number
            }
        })
        return this
    }
    static divTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = array[index] / number
            }
        })
        return new Tensor(result, tensor.shape)
    }
    divMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] /= number
            }
        }
        return this
    }
    static divMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] / number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    divVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] /= number
        }
        return this
    }
    static divVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] / number
        }
        return new Tensor(result, vector.shape)
    }
    divNoNan(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    if (array2[index] == 0) {
                        array[index] = 0
                    } else {
                        array[index] /= array2[index]
                    }
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    if (array2[index] == 0) {
                        array[index] = 0
                    } else {
                        array[index] /= array2[index]
                    }
                }
            })
            return this
        }
    }
    static divNoNan(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    if (array2[index] == 0) {
                        resultArray[index] = 0
                    } else {
                        resultArray[index] = array[index] / array2[index]
                    }
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    if (array2[index] == 0) {
                        resultArray[index] = 0
                    } else {
                        resultArray[index] = array[index] / array2[index]
                    }
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    divNoNanMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                if (tensor.data[i][j] == 0) {
                    this.data[i][j] = 0
                } else {
                    this.data[i][j] /= tensor.data[i][j]
                }
            }
        }
        return this
    }
    static divNoNanMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                if (tensor2.data[i][j] == 0) {
                    result[i][j] = 0
                } else {
                    result[i][j] = tensor.data[i][j] / tensor2.data[i][j]
                }
            }
        }
        return new Tensor(result, tensor.shape)
    }
    divNoNanVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            if (vector.data[i] == 0) {
                this.data[i] = 0
            } else {
                this.data[i] /= vector.data[i]
            }
        }
        return this
    }
    static divNoNanVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            if (vector2.data[i] == 0) {
                result[i] = 0
            } else {
                result[i] = vector.data[i] / vector2.data[i]
            }
        }
        return new Tensor(result, vector.shape)
    }
    divNoNanTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                if (number == 0) {
                    array[index] = 0
                } else {
                    array[index] /= number
                }
            }
        })
        return this
    }
    static divNoNanTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray) => {
            for (let index = 0; index < array.length; index++) {
                if (number == 0) {
                    resultArray[index] = 0
                } else {
                    resultArray[index] = array[index] / number
                }
            }
        })
        return new Tensor(result, tensor.shape)
    }
    divNoNanMxS(number) {
        if (number == 0) {
            number = Infinity
        }
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] /= number
            }
        }
        return this
    }
    static divNoNanMxS(matrix, number) {
        if (number == 0) {
            number = Infinity
        }
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] / number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    divNoNanVxS(number) {
        if (number == 0) {
            number = Infinity
        }
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] /= number
        }
        return this
    }
    static divNoNanVxS(vector, number) {
        if (number == 0) {
            number = Infinity
        }
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] / number
        }
        return new Tensor(result, vector.shape)
    }
    divNoNanSxT(scalar){
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                if(array[index] == 0){
                    array[index] == Infinity
                }
                array[index] = scalar / array[index]
            }
        })
    }
    static divNoNanSxT(scalar, tensor){
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray)=>{
            for (let index = 0; index < array.length; index++) {
                let num = array[index] == 0 ? Infinity : array[index]
                resultArray[index] = scalar / num
            }
        })
        return new Tensor(result, tensor.shape)
    }
    floorDiv(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = Math.floor(array[index] / array2[index])
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = Math.floor(array[index] / array2[index])
                }
            })
            return this
        }
    }
    static floorDiv(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = Math.floor(array[index] / array2[index])
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = Math.floor(array[index] / array2[index])
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    floorDivMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] = Math.floor(this.data[i][j] / tensor.data[i][j])
            }
        }
        return this
    }
    static floorDivMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = Math.floor(tensor.data[i][j] / tensor2.data[i][j])
            }
        }
        return new Tensor(result, tensor.shape)
    }
    floorDivVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = Math.floor(this.data[i] / vector.data[i])
        }
        return this
    }
    static floorDivVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = Math.floor(vector.data[i] / vector2.data[i])
        }
        return new Tensor(result, vector.shape)
    }
    floorDivTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] = Math.floor(array[index] / number)
            }
        })
        return this
    }
    static floorDivTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = Math.floor(array[index] / number)
            }
        })
        return new Tensor(result, tensor.shape)
    }
    floorDivMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] = Math.floor(this.data[i][j] / number)
            }
        }
        return this
    }
    static floorDivMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = Math.floor(matrix.data[i][j] / number)
            }
        }
        return new Tensor(result, matrix.shape)
    }
    floorDivVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] = Math.floor(this.data[i] / number)
        }
        return this
    }
    static floorDivVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = Math.floor(vector.data[i] / number)
        }
        return new Tensor(result, vector.shape)
    }
    pow(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] **= array2[index]
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] **= array2[index]
                }
            })
            return this
        }
    }
    static pow(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] ** array2[index]
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = array[index] ** array2[index]
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    powMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] **= tensor.data[i][j]
            }
        }
        return this
    }
    static powMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = tensor.data[i][j] ** tensor2.data[i][j]
            }
        }
        return new Tensor(result, tensor.shape)
    }
    powVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] **= vector.data[i]
        }
        return this
    }
    static powVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] ** vector2.data[i]
        }
        return new Tensor(result, vector.shape)
    }
    powTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] **= number
            }
        })
        return this
    }
    static powTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = array[index] ** number
            }
        })
        return new Tensor(result, tensor.shape)
    }
    powMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] **= number
            }
        }
        return this
    }
    static powMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = matrix.data[i][j] ** number
            }
        }
        return new Tensor(result, matrix.shape)
    }
    powVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] **= number
        }
        return this
    }
    static powVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = vector.data[i] ** number
        }
        return new Tensor(result, vector.shape)
    }
    sqd(tensor, NoBroadcast = true) {
        if (NoBroadcast) {
            this.accesLastArrays(this.data, tensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = (array[index] - array2[index]) ** 2
                }
            })
            return this
        } else {
            let tempTensor = this.broadcast(tensor)
            this.accesLastArrays(this.data, tempTensor.data, (array, array2) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = (array[index] - array2[index]) ** 2
                }
            })
            return this
        }
    }
    static sqd(tensor, tensor2, NoBroadcast = true) {
        if (NoBroadcast) {
            let result = []
            Tensor.accesLastArrays(tensor.data, tensor2.data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = (array[index] - array2[index]) ** 2
                }
            })
            return new Tensor(result, tensor.shape)
        } else {
            let tempTensor = Tensor.broadcast(tensor, tensor2)
            let result = []
            Tensor.accesLastArrays(tempTensor[0].data, tempTensor[1].data, result, (array, array2, resultArray) => {
                for (let index = 0; index < array.length; index++) {
                    resultArray[index] = (array[index] - array2[index]) ** 2
                }
            })
            return new Tensor(result, tempTensor[0].shape)
        }
    }
    sqdMxM(tensor) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] = (this.data[i][j] - tensor.data[i][j]) ** 2
            }
        }
        return this
    }
    static sqdMxM(tensor, tensor2) {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = (tensor.data[i][j] - tensor2.data[i][j]) ** 2
            }
        }
        return new Tensor(result, tensor.shape)
    }
    sqdVxV(vector) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = (this.data[i] - vector.data[i]) ** 2
        }
        return this
    }
    static sqdVxV(vector, vector2) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = (vector.data[i] - vector2.data[i]) ** 2
        }
        return new Tensor(result, vector.shape)
    }
    sqdTxS(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] = (array[index] - number) ** 2
            }
        })
        return this
    }
    static sqdTxS(tensor, number) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = (array[index] - number) ** 2
            }
        })
        return new Tensor(result, tensor.shape)
    }
    sqdMxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] = (this.data[i][j] - number) ** 2
            }
        }
        return this
    }
    static sqdMxS(matrix, number) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = (matrix.data[i][j] - number) ** 2
            }
        }
        return new Tensor(result, matrix.shape)
    }
    sqdVxS(number) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] = (this.data[i] - number) ** 2
        }
        return this
    }
    static sqdVxS(vector, number) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = (vector.data[i] - number) ** 2
        }
        return new Tensor(result, vector.shape)
    }

    // Operations with just 1 tensor
    square() {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] **= 2
            }
        })
        return this
    }
    static square(tensor) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, array2) => {
            for (let index = 0; index < array.length; index++) {
                array2[index] = array[index] ** 2
            }
        })
        return new Tensor(result, tensor.shape)
    }
    sqrt() {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] **= 0.5
            }
        })
        return this
    }
    static sqrt(tensor) {
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, array2) => {
            for (let index = 0; index < array.length; index++) {
                array2[index] = array[index] ** 0.5
            }
        })
        return new Tensor(result, tensor.shape)
    }
    mean(){
        let sum = 0
        let numValues = 0
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                numValues++
                sum += array[index]
            }
        })
        return sum / numValues
    }
    static mean(tensor) {
        let sum = 0
        let numValues = 0
        tensor.accesLastArray(tensor.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                numValues++
                sum += array[index]
            }
        })
        return sum / numValues
    }
    meanTensors(tensors) {
        for (let tensor = 0; tensor < tensors.length; tensor++) {
            this.accesLastArrays(this.data, tensors[tensor].data, (array, tensorArray) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] += tensorArray[index]
                }
            })
        }
        return this.divNoNanTxS(tensors.length + 1)
    }
    static meanTensors(tensors) {
        let result = []
        Tensor.accesLastArrays(tensors[0].data, tensors[1].data, result, (array, array2, resultArray) => {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = array[index] + array2[index]
            }
        })
        result = new Tensor(result, tensors[0].shape)
        for (let tensor = 2; tensor < tensors.length; tensor++) {
            result.accesLastArrays(result.data, tensors[tensor].data, (array, tensorArray) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] += tensorArray[index]
                }
            })
        }
        return result.divNoNanTxS(tensors.length)
    }
    meanMatrix() {
        let sum = 0
        let numValues = this.shape[0] * this.shape[1]
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                sum += this.data[i][j]
            }
        }
        return sum / numValues
    }
    static meanMatrix(matrix) {
        let sum = 0
        let numValues = matrix.shape[0] * matrix.shape[1]
        for (let i = 0; i < matrix.shape[0]; i++) {
            for (let j = 0; j < matrix.shape[1]; j++) {
                sum += matrix.data[i][j]
            }
        }
        return sum / numValues
    }
    meanVector() {
        let sum = 0
        let numValues = this.shape[0]
        for (let i = 0; i < this.shape[0]; i++) {
            sum += this.data[i]
        }
        return sum / numValues
    }
    static meanVector(vector) {
        let sum = 0
        let numValues = vector.shape[0]
        for (let i = 0; i < vector.shape[0]; i++) {
            sum += vector.data[i]
        }
        return sum / numValues
    }
    shuffle(){
        let lastIndex = this.shape[0] - 1
        while (lastIndex > 0) {
            let randomIndex = Math.floor(Math.random() * lastIndex + 1)
            let temp = this.data[lastIndex]
            this.data[lastIndex] = this.data[randomIndex]
            this.data[randomIndex] = temp
            lastIndex -= 1
        }
        return this
    }
    static shuffle(array) {
        let lastIndex = array.length - 1
        while (lastIndex > 0) {
            let randomIndex = Math.floor(Math.random() * lastIndex + 1)
            let temp = array[lastIndex]
            array[lastIndex] = array[randomIndex]
            array[randomIndex] = temp

            lastIndex -= 1
        }
        return array
    }
    static shuffleMatch(array, array2) {
        let lastIndex = array.length - 1
        while (lastIndex > 0) {
            let randomIndex = Math.floor(Math.random() * lastIndex + 1)
            let temp = array[lastIndex]
            let temp2 = array2[lastIndex]
            array[lastIndex] = array[randomIndex]
            array2[lastIndex] = array2[randomIndex]
            array[randomIndex] = temp
            array2[randomIndex] = temp2

            lastIndex -= 1
        }
        return [array, array2]
    }
    // Matrices
    dot(tensor) {
        if (this.numDimentions > 2 || tensor.numDimentions > 2) {
            console.error('The number of dimentions for each tensor must be 1 or 2 but got ' + this.numDimentions + ' and ' + tensor.numDimentions)
            return
        } else {
            if (this.numDimentions == 2) {
                if (tensor.numDimentions == 2) {
                    return this.dotMxM(tensor)
                }
                else if (tensor.numDimentions == 1) {
                    return this.dotMxV(tensor)
                }
                else {
                    return console.error('Colums of A must match rows of B')
                }
            }
            else if (this.numDimentions == 1) {
                if (tensor.numDimentions == 2) {
                    return this.dotVxM(tensor)
                }
                else if (tensor.numDimentions == 1) {
                    return this.dotVxV(tensor)
                }
                else {
                    return console.error('Colums of A must match rows of B')
                }
            }
            else {
                return console.error('Colums of A must match rows of B')
            }
        }
    }
    static dot(tensor, tensor2) {
        if (tensor.numDimentions > 2 || tensor2.numDimentions > 2) {
            console.error('The number of dimentions for each tensor must be 1 or 2 but got ' + tensor.numDimentions + ' and ' + tensor2.numDimentions)
            return
        } else {
            if (tensor.numDimentions == 2) {
                if (tensor2.numDimentions == 2) {
                    return Tensor.dotMxM(tensor, tensor2)
                }
                else if (tensor2.numDimentions == 1) {
                    return Tensor.dotMxV(tensor, tensor2)
                }
                else {
                    return console.error('Colums of A must match rows of B')
                }
            }
            else if (tensor.numDimentions == 1) {
                if (tensor2.numDimentions == 2) {
                    return Tensor.dotVxM(tensor, tensor2)
                }
                else if (tensor2.numDimentions == 1) {
                    return Tensor.dotVxV(tensor, tensor2)
                }
                else {
                    return console.error('Colums of A must match rows of B')
                }
            }
            else {
                return console.error('Colums of A must match rows of B')
            }
        }
    }
    dotMxM(tensor) {
        if (this.shape[1] !== tensor.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < this.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                let sum = 0
                for (let k = 0; k < this.shape[1]; k++) {
                    sum += this.data[i][k] * tensor.data[k][j]
                }
                result[i][j] = sum
            }
        }
        this.data = result
        this.shape = [this.shape[0], tensor.shape[1]]
        this.numDimentions = this.shape.length
        return this
    }
    static dotMxM(tensor, tensor2) {
        if (tensor.shape[1] !== tensor2.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor2.shape[1]; j++) {
                let sum = 0
                for (let k = 0; k < tensor.shape[1]; k++) {
                    sum += tensor.data[i][k] * tensor2.data[k][j]
                }
                result[i][j] = sum
            }
        }
        return new Tensor(result, [tensor.shape[0], tensor2.shape[1]])
    }
    dotMxV(tensor) {
        if (this.shape[1] !== tensor.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < this.shape[0]; i++) {
            let sum = 0
            for (let k = 0; k < this.shape[1]; k++) {
                sum += this.data[i][k] * tensor.data[k]
            }
            result[i] = sum
        }
        this.data = result
        this.shape = [this.shape[0]]
        this.numDimentions = this.shape.length
        return this
    }
    static dotMxV(tensor, tensor2) {
        if (tensor.shape[1] !== tensor2.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            let sum = 0
            for (let k = 0; k < tensor.shape[1]; k++) {
                sum += tensor.data[i][k] * tensor2.data[k]
            }
            result[i] = sum
        }
        return new Tensor(result, [tensor.shape[0]])
    }
    dotVxM(tensor) {
        if (tensor.shape[0] !== 1) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < this.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = this.data[i] * tensor.data[0][j]
            }
        }
        this.data = result
        this.shape = [this.shape[0], tensor.shape[1]]
        this.numDimentions = this.shape.length
        return this
    }
    static dotVxM(tensor, tensor2) {
        if (tensor2.shape[0] !== 1) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor2.shape[1]; j++) {
                result[i][j] = tensor.data[i] * tensor2.data[0][j]
            }
        }
        return new Tensor(result, [tensor.shape[0], tensor2.shape[1]])
    }
    dotVxV(tensor) {
        if (this.shape[0] !== tensor.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let sum = 0
        for (let k = 0; k < this.shape[0]; k++) {
            sum += this.data[k] * tensor.data[k]
        }
        this.data = [sum]
        this.shape = [1]
        this.numDimentions = 1
        return this
    }
    static dotVxV(tensor, tensor2) {
        if (tensor.shape[0] !== tensor2.shape[0]) {
            console.error('Colums of A must match rows of B')
            return
        }
        let sum = 0
        for (let k = 0; k < tensor.shape[0]; k++) {
            sum += tensor.data[k] * tensor2.data[k]
        }
        return new Tensor([sum], [1])
    }
    transpose() {
        if (this.numDimentions == 2) {
            let result = []
            for (let i = 0; i < this.shape[1]; i++) {
                result[i] = []
                for (let j = 0; j < this.shape[0]; j++) {
                    result[i][j] = this.data[j][i]
                }
            }
            this.data = result
            this.shape = [this.shape[1], this.shape[0]]
            return this
        }
        else {
            let result = [[]]
            for (let i = 0; i < this.shape[0]; i++) {
                result[0][i] = this.data[i]
            }
            this.data = result
            this.shape = [1, this.shape[0]]
            this.numDimentions = 2
            return this
        }
    }
    static transpose(tensor) {
        if (tensor.numDimentions == 2) {
            let result = []
            for (let i = 0; i < tensor.shape[1]; i++) {
                result[i] = []
                for (let j = 0; j < tensor.shape[0]; j++) {
                    result[i][j] = tensor.data[j][i]
                }
            }
            return new Tensor(result, [tensor.shape[1], tensor.shape[0]])
        } else {
            let result = [[]]
            for (let i = 0; i < tensor.shape[0]; i++) {
                result[0][i] = tensor.data[i]
            }
            return new Tensor(result, [1, tensor.shape[0]])
        }
    }
    transposeMatrix() {
        let result = []
        for (let i = 0; i < this.shape[1]; i++) {
            result[i] = []
            for (let j = 0; j < this.shape[0]; j++) {
                result[i][j] = this.data[j][i]
            }
        }
        this.data = result
        this.shape = [this.shape[1], this.shape[0]]
        return this
    }
    static transposeMatrix(matrix) {
        let result = []
        for (let i = 0; i < matrix.shape[1]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[0]; j++) {
                result[i][j] = matrix.data[j][i]
            }
        }
        return new Tensor(result, [matrix.shape[1], matrix.shape[0]])
    }
    transposeVector() {
        let result = [[]]
        for (let i = 0; i < this.shape[0]; i++) {
            result[0][i] = this.data[i]
        }
        this.data = result
        this.shape = [1, this.shape[0]]
        this.numDimentions = 2
        return this
    }
    static transposeVector(vector) {
        let result = [[]]
        for (let i = 0; i < vector.shape[0]; i++) {
            result[0][i] = vector.data[i]
        }
        return new Tensor(result, [1, vector.shape[0]])
    }
    mirrorHorizontally() {
        if (this.numDimentions == 2) {
            for (let i = 0; i < this.shape[0]; i++) {
                for (let j = 0, k = this.shape[1] - 1; j < k; j++, k--) {
                    let temp = this.data[i][j]
                    this.data[i][j] = this.data[i][k]
                    this.data[i][k] = temp
                }
            }
            return this
        } else {
            console.error('Tensor must have 2 dimentions')
            return
        }
    }
    static mirrorHorizontally(matrix) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0, k = matrix.shape[1] - 1; j < k; j++, k--) {
                result[i][j] = matrix.data[i][k]
                result[i][k] = matrix.data[i][j]
            }
        }
        return new Tensor(result, matrix.shape)
    }
    mirrorVertically() {
        for (let j = 0; j < this.shape[1]; j++) {
            for (let i = 0, k = this.shape[0] - 1; i < k; i++, k--) {
                let temp = this.data[i][j]
                this.data[i][j] = this.data[k][j]
                this.data[k][j] = temp
            }
        }
        return this
    }
    static mirrorVertically(matrix) {
        let result = []
        for (let i = 0; i < matrix.shape[1]; i++) {
            result[i] = []
        }
        for (let j = 0; j < matrix.shape[1]; j++) {
            for (let i = 0, k = matrix.shape[0] - 1; i < k; i++, k--) {
                result[i][j] = matrix.data[k][j]
                result[k][j] = matrix.data[i][j]
            }
        }
        return new Tensor(result, matrix.shape)
    }
    rotate180() {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0, k = this.shape[1] - 1; j < k; j++, k--) {
                let temp = this.data[i][j]
                this.data[i][j] = this.data[i][k]
                this.data[i][k] = temp
            }
        }
        for (let j = 0; j < this.shape[1]; j++) {
            for (let i = 0, k = this.shape[0] - 1; i < k; i++, k--) {
                let temp = this.data[i][j]
                this.data[i][j] = this.data[k][j]
                this.data[k][j] = temp
            }
        }
        return this
    }
    static rotate180(matrix) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = matrix.data[i].slice()
            for (let j = 0, k = matrix.shape[1] - 1; j < k; j++, k--) {
                result[i][j] = matrix.data[i][k]
                result[i][k] = matrix.data[i][j]
            }
        }
        for (let j = 0; j < matrix.shape[1]; j++) {
            for (let i = 0, k = matrix.shape[0] - 1; i < k; i++, k--) {
                result[i][j] = matrix.data[k][j]
                result[k][j] = matrix.data[i][j]
            }
        }
        return new Tensor(result, matrix.shape)
    }
    static rotate180Array(matrix) {
        let result = []
        for (let i = 0; i < matrix.length; i++) {
            result[i] = matrix[i].slice()
            for (let j = 0, k = matrix[0].length - 1; j < k; j++, k--) {
                result[i][j] = matrix[i][k]
                result[i][k] = matrix[i][j]
            }
        }
        for (let j = 0; j < matrix[0].length; j++) {
            for (let i = 0, k = matrix[0].length - 1; i < k; i++, k--) {
                result[i][j] = matrix[k][j]
                result[k][j] = matrix[i][j]
            }
        }
        return result
    }
    rotate90() {
        let result = []
        let newCol = 0, newRow = 0
        for (let i = 0; i < this.shape[1]; i++) {
            result[newRow] = []
            newCol = 0
            for (let j = this.shape[0] - 1; j >= 0; j--) {
                result[newRow][newCol] = this.data[j][i]
                newCol++
            }
            newRow++
        }
        this.data = result
        this.shape = [this.shape[1], this.shape[0]]
        return this
    }
    static rotate90(matrix) {
        let result = []
        let newCol = 0, newRow = 0
        for (let i = 0; i < matrix.shape[1]; i++) {
            result[newRow] = []
            newCol = 0
            for (let j = matrix.shape[0] - 1; j >= 0; j--) {
                result[newRow][newCol] = matrix.data[j][i]
                newCol++
            }
            newRow++
        }
        return new Tensor(result, [matrix.shape[1], matrix.shape[0]])
    }
    rotate270() {
        let result = []
        let newCol, newRow = 0
        for (let i = this.shape[1] - 1; i >= 0; i--) {
            result[newRow] = []
            newCol = 0
            for (let j = 0; j < this.shape[0]; j++) {
                result[newRow][newCol] = this.data[j][i]
                newCol++
            }
            newRow++
        }
        this.data = result
        this.shape = [this.shape[1], this.shape[0]]
        return this
    }
    static rotate270(matrix) {
        let result = []
        let newCol, newRow = 0
        for (let i = matrix.shape[1] - 1; i >= 0; i--) {
            result[newRow] = []
            newCol = 0
            for (let j = 0; j < matrix.shape[0]; j++) {
                result[newRow][newCol] = matrix.data[j][i]
                newCol++
            }
            newRow++
        }
        return new Tensor(result, [matrix.shape[1], matrix.shape[0]])
    }
    static identity(rows, cols, toTensor = true) {
        let result = []
        for (let i = 0; i < rows; i++) {
            result[i] = []
            for (let j = 0; j < cols; j++) {
                if (i == j) {
                    result[i][j] = 1
                } else {
                    result[i][j] = 0
                }
            }
        }
        if (toTensor) {
            return new Tensor(result, [rows, cols])
        }
        return result
    }
    static correlate(input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) {
        let inputData
        let paddingAmount, filterShape, inputShape
        if (input instanceof Tensor) {
            inputShape = input.shape
            filterShape = filter.shape
            input = input.data
            filter = filter.data
        } else {
            inputShape = [input.length, input[0].length]
            filterShape = [filter.length, filter[0].length]
        }
        if (typeof padding == 'string') {
            if (padding == 'valid') {
                paddingAmount = [0, 0]
                inputData = input
            } else {
                paddingAmount = Tensor.paddingAmount(inputShape, filterShape, padding, stride, dilation)
                inputData = Tensor.padding(input, paddingAmount)
            }
        } else if (padding instanceof Array) {
            paddingAmount = padding
            inputData = Tensor.padding(input, paddingAmount)
        }
        let outputShape = Tensor.correlateOutputShape(inputShape, filterShape, paddingAmount, stride, dilation)

        let result = []
        for (let imgRow = 0; imgRow < outputShape[0]; imgRow++) {
            result[imgRow] = []
            for (let imgCol = 0; imgCol < outputShape[1]; imgCol++) {
                let sum = 0
                for (let kernelRow = 0; kernelRow < filterShape[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < filterShape[1]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0]
                        let col = kernelCol * dilation[1] + imgCol * stride[1]

                        sum += inputData[row][col] * filter[kernelRow][kernelCol]
                    }
                }
                result[imgRow][imgCol] = sum
            }
        }
        return result
    }
    static correlateVolume(input, filters, padding = 'valid', stride = [1, 1], dilation = [1, 1]) {
        // Input tensor3d, filters tensor4d
        let inputData = []
        let inputShape, filterShape
        let paddingAmount
        if (input instanceof Tensor) {
            inputShape = input.shape
            filterShape = filters.shape
            input = input.data
            filters = filters.data
        } else {
            inputShape = [input.length, input[0].length, input[0][0].length]
            filterShape = [filters.length, filters[0].length, filters[0][0].length, filters[0][0][0].length]
        }

        if (typeof padding == 'string') {
            if (padding == 'valid') {
                paddingAmount = [0, 0]
                inputData = input
            } else {
                paddingAmount = Tensor.paddingAmount(inputShape, filterShape, padding, stride, dilation)
                for (let depth = 0; depth < inputShape[0]; depth++) {
                    inputData[depth] = Tensor.padding(input[depth], paddingAmount)
                }
            }
        } else if (padding instanceof Array) {
            paddingAmount = padding
            for (let depth = 0; depth < inputShape[0]; depth++) {
                inputData[depth] = Tensor.padding(input[depth], paddingAmount)
            }
        }
        let outputShape = Tensor.correlateVolumeOutputShape(inputShape, filterShape, paddingAmount, stride, dilation)


        let result = []
        for (let numFilters = 0; numFilters < filterShape[0]; numFilters++) {
            result[numFilters] = []
            for (let row = 0; row < outputShape[1]; row++) {
                result[numFilters][row] = []
                for (let col = 0; col < outputShape[2]; col++) {
                    result[numFilters][row][col] = 0
                }
            }
            for (let depth = 0; depth < inputShape[0]; depth++) {
                for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                    for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                        let sum = 0
                        for (let kernelRow = 0; kernelRow < filterShape[2]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < filterShape[3]; kernelCol++) {
                                let row = kernelRow * dilation[0] + imgRow * stride[0]
                                let col = kernelCol * dilation[1] + imgCol * stride[1]

                                sum += inputData[depth][row][col] * filters[numFilters][depth][kernelRow][kernelCol]
                            }
                        }
                        result[numFilters][imgRow][imgCol] += sum
                    }
                }
            }
        }

        return result
    }
    static correlateVolumeAddBias(input, filters, bias, padding = 'valid', stride = [1, 1], dilation = [1, 1]) {
        // Input tensor3d, Filters tensor4d, Bias tensor3d
        let inputData = []
        let inputShape, filterShape
        let paddingAmount
        if (input instanceof Tensor) {
            inputShape = input.shape
            filterShape = filters.shape
            input = input.data
            filters = filters.data
            bias = bias.data
        } else {
            inputShape = [input.length, input[0].length, input[0][0].length]
            filterShape = [filters.length, filters[0].length, filters[0][0].length, filters[0][0][0].length]
        }

        if (typeof padding == 'string') {
            if (padding == 'valid') {
                paddingAmount = [0, 0]
                inputData = input
            } else {
                paddingAmount = Tensor.paddingAmount(inputShape, filterShape, padding, stride, dilation)
                for (let depth = 0; depth < inputShape[0]; depth++) {
                    inputData[depth] = Tensor.padding(input[depth], paddingAmount)
                }
            }
        } else if (padding instanceof Array) {
            paddingAmount = padding
            for (let depth = 0; depth < inputShape[0]; depth++) {
                inputData[depth] = Tensor.padding(input[depth], paddingAmount)
            }
        }
        let outputShape = Tensor.correlateVolumeOutputShape(inputShape, filterShape, paddingAmount, stride, dilation)

        let result = []
        for (let numFilters = 0; numFilters < filterShape[0]; numFilters++) {
            result[numFilters] = []
            for (let row = 0; row < outputShape[1]; row++) {
                result[numFilters][row] = []
                for (let col = 0; col < outputShape[2]; col++) {
                    result[numFilters][row][col] = 0
                }
            }
            for (let depth = 0; depth < inputShape[0]; depth++) {
                for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                    for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                        let sum = 0
                        for (let kernelRow = 0; kernelRow < filterShape[2]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < filterShape[3]; kernelCol++) {
                                let row = kernelRow * dilation[0] + imgRow * stride[0]
                                let col = kernelCol * dilation[1] + imgCol * stride[1]

                                sum += inputData[depth][row][col] * filters[numFilters][depth][kernelRow][kernelCol]
                            }
                        }
                        result[numFilters][imgRow][imgCol] += sum + bias[numFilters][imgRow][imgCol]
                    }
                }
            }
        }
        return result
    }
    static convolution(input, filter, padding = 'valid', stride = [1, 1], dilation = [1, 1]) {
        let inputData
        let paddingAmount, filterShape, inputShape

        if (input instanceof Tensor) {
            if (filter instanceof Tensor) {
                inputShape = input.shape
                filterShape = filter.shape
                input = input.data
                filter = filter.data
            } else {
                inputShape = input.shape
                input = input.data
                filterShape = [filter.length, filter[0].length]
            }
        } else {
            inputShape = [input.length, input[0].length]
            filterShape = [filter.length, filter[0].length]
        }

        if (typeof padding == 'string') {
            if (padding == 'valid') {
                paddingAmount = [0, 0]
                inputData = input
            } else {
                paddingAmount = Tensor.paddingAmount(inputShape, filterShape, padding, stride, dilation)
                inputData = Tensor.padding(input, paddingAmount)
            }
        } else if (padding instanceof Array) {
            paddingAmount = padding
            inputData = Tensor.padding(input, paddingAmount)
        }
        let outputShape = Tensor.correlateOutputShape(inputShape, filterShape, paddingAmount, stride, dilation)
        // console.log(outputShape);
        

        let rotatedFilter = Tensor.rotate180Array(filter)

        let result = []
        for (let imgRow = 0; imgRow < outputShape[0]; imgRow++) {
            result[imgRow] = []
            for (let imgCol = 0; imgCol < outputShape[1]; imgCol++) {
                let sum = 0
                for (let kernelRow = 0; kernelRow < filterShape[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < filterShape[1]; kernelCol++) {
                        let row = kernelRow * dilation[0] + imgRow * stride[0]
                        let col = kernelCol * dilation[1] + imgCol * stride[1]

                        sum += inputData[row][col] * rotatedFilter[kernelRow][kernelCol]
                    }
                }
                result[imgRow][imgCol] = sum
            }
        }
        return result
    }
    static convolveVolume(input, filters, padding = 'valid', stride = [1, 1], dilation = [1, 1]) {
        // Input tensor3d, filters tensor4d
        let inputData = []
        let inputShape, filterShape
        let paddingAmount
        let rotatedFilters = []
        if (input instanceof Tensor) {
            inputShape = input.shape
            filterShape = filters.shape
            input = input.data
            filters = filters.data
        } else {
            inputShape = [input.length, input[0].length, input[0][0].length]
            filterShape = [filters.length, filters[0].length, filters[0][0].length, filters[0][0][0].length]
        }
        if (typeof padding == 'string') {
            if (padding == 'valid') {
                paddingAmount = [0, 0]
                inputData = input
            } else {
                paddingAmount = Tensor.paddingAmount(inputShape, filterShape, padding, stride, dilation)
                for (let depth = 0; depth < inputShape[0]; depth++) {
                    inputData[depth] = Tensor.padding(input[depth], paddingAmount)
                }
            }
        } else if (padding instanceof Array) {
            paddingAmount = padding
            for (let depth = 0; depth < inputShape[0]; depth++) {
                inputData[depth] = Tensor.padding(input[depth], paddingAmount)
            }
        }
        let outputShape = Tensor.correlateVolumeOutputShape(inputShape, filterShape, paddingAmount, stride, dilation)

        for (let numFilters = 0; numFilters < filterShape[0]; numFilters++) {
            rotatedFilters[numFilters] = []
            for (let depth = 0; depth < inputShape[0]; depth++) {
                rotatedFilters[numFilters][depth] = Tensor.rotate180Array(filters[numFilters][depth])
            }
        }

        let result = []
        for (let numFilters = 0; numFilters < filterShape[0]; numFilters++) {
            result[numFilters] = []
            for (let row = 0; row < outputShape[1]; row++) {
                result[numFilters][row] = []
                for (let col = 0; col < outputShape[2]; col++) {
                    result[numFilters][row][col] = 0
                }
            }
            for (let depth = 0; depth < filterShape[1]; depth++) {

                for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                    for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                        let sum = 0
                        for (let kernelRow = 0; kernelRow < filterShape[2]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < filterShape[3]; kernelCol++) {
                                let row = kernelRow * dilation[0] + imgRow * stride[0]
                                let col = kernelCol * dilation[1] + imgCol * stride[1]

                                sum += inputData[depth][row][col] * rotatedFilters[numFilters][depth][kernelRow][kernelCol]
                            }
                        }
                        result[numFilters][imgRow][imgCol] += sum
                    }
                }
            }
        }
        return result
    }
    static correlateOutputShape(inputShape, filterShape, paddingAmount, stride, dilation) {
        let outputShape = [
            (inputShape[0] + paddingAmount[0] - dilation[0] * (filterShape[0] - 1) - 1) / stride[0] + 1,
            (inputShape[1] + paddingAmount[1] - dilation[1] * (filterShape[1] - 1) - 1) / stride[1] + 1,
        ]
        outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1])]
        return outputShape
    }
    static correlateVolumeOutputShape(inputShape, filterShape, paddingAmount, stride, dilation) {
        let outputShape = [
            filterShape[0],
            (inputShape[1] + paddingAmount[0] - dilation[0] * (filterShape[2] - 1) - 1) / stride[0] + 1,
            (inputShape[2] + paddingAmount[1] - dilation[1] * (filterShape[3] - 1) - 1) / stride[1] + 1,
        ]
        outputShape = [Math.floor(outputShape[0]), Math.floor(outputShape[1]), Math.floor(outputShape[2])]
        return outputShape
    }
    static mpOutputShape(inputShape, paddingAmount, poolSize, stride){
        let outputShape = [
            Math.floor(((inputShape[0] + paddingAmount[0]) - poolSize[0]) / stride[0] + 1),
            Math.floor(((inputShape[1] + paddingAmount[1]) - poolSize[1]) / stride[1] + 1),
        ]
        return outputShape
    }
    static mpVolumeOutputShape(inputShape, paddingAmount, poolSize, stride){
        let outputShape = [
            inputShape[0],
            Math.floor(((inputShape[1] + paddingAmount[0]) - poolSize[0]) / stride[0] + 1),
            Math.floor(((inputShape[2] + paddingAmount[1]) - poolSize[1]) / stride[1] + 1),
        ]
        return outputShape
    }
    static maxPooling2d(){

    }
    static maxPoolingVolume(input, padding, poolSize =[2,2], stride=[2,2]){
        // input tensor3d
        let inputShape
        if (input instanceof Tensor) {
            inputShape = input.shape
            input = input.data
        } else {
            inputShape = [input.length, input[0].length, input[0][0].length]
            // input = input
        }
        if (padding instanceof Array) {
            for (let depth = 0; depth < inputShape[0]; depth++) {
                input[depth] = Tensor.padding(input[depth], padding)
            }           
        } else if (padding) {
            padding = Tensor.mpPaddingAmount(inputShape, padding, poolSize, stride)
            for (let depth = 0; depth < inputShape[0]; depth++) {
                input[depth] = Tensor.padding(input[depth], padding)
            }
        } else {
            padding = [0, 0]
        }
        let outputShape = Tensor.mpVolumeOutputShape(inputShape, padding, poolSize, stride)

        let result = []
        let coords = []

        for (let depth = 0; depth < inputShape[0]; depth++) {
            result[depth] = []
            for (let imgRow = 0; imgRow < outputShape[1]; imgRow++) {
                result[depth][imgRow] = []
                for (let imgCol = 0; imgCol < outputShape[2]; imgCol++) {
                    let record = -Infinity
                    let tempCoords = []
                    for (let kernelRow = 0; kernelRow < poolSize[0]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < poolSize[1]; kernelCol++) {
                            let row = kernelRow + imgRow * stride[0],
                                col = kernelCol + imgCol * stride[1]
                            if (input[depth][row][col] > record) {
                                record = input[depth][row][col]
                                tempCoords = [depth, row, col, imgRow, imgCol]
                            }
                        }
                    }
                    coords.push(tempCoords)
                    result[depth][imgRow][imgCol] = record
                }
            }
        }
        return [result, coords]
    }
    // 
    static padding(input, paddingAmount) {
        if(input instanceof Tensor){
            input = input.data
        }
        let padHeight = paddingAmount[0]
        let padWidth = paddingAmount[1]
        if (padHeight == 0 && padWidth == 0) {
            return input
        } else {
            let padTop = Math.floor(padHeight / 2)
            let padBottom = padHeight - padTop

            let padLeft = Math.floor(padWidth / 2)
            let padRight = padWidth - padLeft
            // 
            let result = []
            for (let i = 0; i < input.length; i++) {
                result[i] = input[i].slice()
                for (let j = 0; j < padLeft; j++) {
                    result[i].unshift(0)
                }
                for (let j = 0; j < padRight; j++) {
                    result[i].push(0)
                }
            }
            for (let i = 0; i < padTop; i++) {
                result.unshift(new Array(result[0].length).fill(0))
            }
            for (let i = 0; i < padBottom; i++) {
                result.push(new Array(result[0].length).fill(0))
            }
            return result
        }
    }
    static paddingAmount(inputShape, filterShape, padding, stride, dilation) {
        let padHeight, padWidth
        let inputImgSize = [inputShape[inputShape.length - 2], inputShape[inputShape.length - 1]],
            filterSize = [filterShape[filterShape.length - 2], filterShape[filterShape.length - 1]]
        // 
        if (padding == 'same') {
            padHeight = Math.floor(
                dilation[0] * (filterSize[0] - 1) + (inputImgSize[0] - 1) * (stride[0] - 1)
            )
            padWidth = Math.floor(
                dilation[1] * (filterSize[1] - 1) + (inputImgSize[1] - 1) * (stride[1] - 1)
            )
        } else if (padding == 'full') {
            padHeight = (filterSize[0] - 1) * 2
            padWidth = (filterSize[1] - 1) * 2
        } else {
            padHeight = 0, padWidth = 0
        }
        return [padHeight, padWidth]
    }
    static mpPaddingAmount(inputShape, padding, poolSize, stride) {
        if (padding) {
            let outputShape = [
                Math.floor((inputShape[inputShape.length - 2] - poolSize[0]) / stride[0]) + 1,
                Math.floor((inputShape[inputShape.length - 1] - poolSize[1]) / stride[1]) + 1
            ]
            let inputShape2 = [
                poolSize[0] + (outputShape[0] - 1) * stride[0],
                poolSize[1] + (outputShape[1] - 1) * stride[1],
            ]
            let diference = [
                inputShape[inputShape.length - 2] - inputShape2[0],
                inputShape[inputShape.length - 1] - inputShape2[1]
            ]
            let paddingAmount = [
                diference[0] > 0 ? poolSize[0] - diference[0] : 0,
                diference[1] > 0 ? poolSize[1] - diference[1] : 0
            ]
            return paddingAmount
        } else {
            return [0, 0]
        }
    }

    //
    map(func) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] = func(array[index])
            }
        })
        return this
    }
    static map(tensor, func) {
        let newTensor = []
        Tensor.accesLastArray(tensor.data, newTensor, (array, result) => {
            for (let index = 0; index < array.length; index++) {
                result[index] = func(array[index])
            }
        })
        return new Tensor(newTensor, tensor.shape)
    }
    mapMatrix() {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0; j < this.shape[1]; j++) {
                this.data[i][j] = func(this.data[i][j])
            }
        }
        return this
    }
    static mapMatrix(matrix) {
        let result = []
        for (let i = 0; i < matrix.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < matrix.shape[1]; j++) {
                result[i][j] = func(matrix.data[i][j])
            }
        }
        return new Tensor(result, matrix.shape)
    }
    mapVector(func) {
        for (let i = 0; i < this.shape[0]; i++) {
            this.data[i] = func(this.data[i])
        }
        return this
    }
    static mapVector(vector, func) {
        let result = []
        for (let i = 0; i < vector.shape[0]; i++) {
            result[i] = func(vector.data[i])
        }
        return new Tensor(result, vector.shape)
    }
    neg(){
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                array[index] = -array[index]
            }
        })
        return this
    }
    static neg(tensor){
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray)=>{
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = -array[index]
            }
        })
        return new Tensor(result, tensor.shape)
    }
    log() {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                if (array[index] == 0) {
                    array[index] = -1000
                } else {
                    array[index] = Math.log(array[index])
                }
            }
        })
        return this
    }
    static log(tensor){
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray)=>{
            for (let index = 0; index < array.length; index++) {
                if(array[index] == 0){
                    resultArray[index] = -1000
                } else {
                    resultArray[index] = Math.log(array[index])
                }
            }
        })
        return new Tensor(result, tensor.shape)
    }
    static constrain(num, min, max){
        return Math.max(Math.min(num, max), min)
    }
    // static constrainValues(tensor, min, max){
        
    // }
    constrainValues(min, max){
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                array[index] = Math.max(Math.min(array[index], max), min)
            }
        })
        return this
    }
    exp() {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] = Math.exp(Tensor.constrain(array[index], -10, 10))
            }
        })
        return this
    }
    static exp(tensor){
        let result = []
        Tensor.accesLastArray(tensor.data, result, (array, resultArray)=>{
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = Math.exp(Tensor.constrain(array[index], -10, 10))
            }
        })
        return new Tensor(result, tensor.shape)
    }
    sumExp(){
        let result = 0
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                result += Math.exp(Tensor.constrain(array[index], -10, 10))
            }
        })
        return result
    }
    static sumExp(tensor) {
        let result = 0
        tensor.accesLastArray(tensor.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                result += Math.exp(Tensor.constrain(array[index], -10, 10))
            }
        })
        return result
    }
    max(){
        let record = -Infinity
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                record = array[index] > record ? array[index] : record
            }
        })
        return record
    }
    static max(tensor){
        let record = -Infinity
        tensor.accesLastArray(tensor.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                record = array[index] > record ? array[index] : record
            }
        })
        return record
    }
    sum() {
        let result = 0
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                result += array[index]
            }
        })
        return result
    }
    static sum(tensor) {
        let result = 0
        tensor.accesLastArray(tensor.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                result += array[index]
            }
        })
        return result
    }
    randomize(options = []) {
        let min = options[0] == undefined ? -1 : options[0]
        let max = options[1] == undefined ? 1 : options[1]
        let floor = options[2]
        if (floor == undefined) {
            this.accesLastArray(this.data, (array) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = Math.random() * (max - min) + min
                }
            })
        } else {
            this.accesLastArray(this.data, (array) => {
                for (let index = 0; index < array.length; index++) {
                    array[index] = Math.floor(Math.random() * (max + 1 - min) + min)
                }
            })
        }
        return this
    }
    static randomize(tensor, options = []) {
        let min = options[0] == undefined ? -1 : options[0]
        let max = options[1] == undefined ? 1 : options[1]
        let floor = options[2]
        return tensor.copy().randomize(min, max, floor)
    }
    static random(shape, options = []) {
        let min = options[0] == undefined ? -1 : options[0]
        let max = options[1] == undefined ? 1 : options[1]
        let floor = options[2]
        let numValues = 1
        for (let i = 0; i < shape.length; i++) {
            numValues *= shape[i]
        }
        let data = []
        if (floor == undefined) {
            for (let i = 0; i < numValues; i++) {
                data[i] = Math.random() * (max - min) + min
            }
        } else {
            for (let i = 0; i < numValues; i++) {
                data[i] = Math.floor(Math.random() * (max - min) + min)
            }
        }
        return Tensor.fromFlatArray(data, shape)
    }
    
    fill(number) {
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                array[index] = number
            }
        })
        return this
    }
    tile(reps) {
        if (reps.length !== this.numDimentions) {
            console.error('Dimentions in reps ' + reps + ' does not match with the number of dimentions from tensor ' + this.shape)
            return
        }
        let newShape = []
        for (let i = 0; i < this.numDimentions; i++) {
            newShape[i] = reps[i] * this.shape[i]
        }
        let newData = []
        let recursion = (array, array2, currentDimention) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < newShape[currentDimention]; i++) {
                    array2[i] = []
                    recursion(array[i % this.shape[currentDimention]], array2[i], currentDimention + 1)
                }
            }
            else {
                for (let i = 0; i < newShape[newShape.length - 1]; i++) {
                    array2[i] = array[i % this.shape[this.numDimentions - 1]]
                }
            }
        }
        recursion(this.data, newData, 0)
        this.data = newData
        this.shape = newShape
        this.numDimentions = this.shape.length
        return this
    }
    static tile(tensor, reps) {
        if (reps.length !== tensor.numDimentions) {
            console.error('Dimentions in reps ' + reps + ' does not match with the number of dimentions from tensor ' + tensor.shape)
            return
        }
        let newShape = []
        for (let i = 0; i < tensor.numDimentions; i++) {
            newShape[i] = reps[i] * tensor.shape[i]
        }
        let newData = []
        let recursion = (array, array2, currentDimention) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < newShape[currentDimention]; i++) {
                    array2[i] = []
                    recursion(array[i % tensor.shape[currentDimention]], array2[i], currentDimention + 1)
                }
            }
            else {
                for (let i = 0; i < newShape[newShape.length - 1]; i++) {
                    array2[i] = array[i % tensor.shape[tensor.numDimentions - 1]]
                }
            }
        }
        recursion(tensor.data, newData, 0)
        return Tensor.fromNestedArray(newData, newShape)
    }
    unshiftDimentions(shape) {
        let diference = shape.length - this.numDimentions
        let newData = []
        let data = Tensor.copyArray(this.data)
        for (let i = diference - 1; i >= 0; i--) {
            for (let j = 0; j < shape[i]; j++) {
                newData[j] = Tensor.copyArray(data)
            }
            data = Tensor.copyArray(newData)
        }
        this.data = data
        this.shape = shape
        this.numDimentions = this.shape.length
        return this
    }
    static unshiftDimentions(tensor, shape) {
        let diference = shape.length - tensor.numDimentions
        let newData = []
        let data = Tensor.copyArray(tensor.data)
        for (let i = diference - 1; i >= 0; i--) {
            for (let j = 0; j < shape[i]; j++) {
                newData[j] = Tensor.copyArray(data)
            }
            data = Tensor.copyArray(newData)
        }
        return new Tensor(data, shape)
    }
    
    static broadcastArgs(tensor, tensor2) {
        let newShape = []
        let oldShapes = Tensor.matchNumDimentions(tensor, tensor2)
        for (let i = 0; i < oldShapes[0].length; i++) {
            newShape[i] = Math.max(oldShapes[0][i], oldShapes[1][i])
        }
        return newShape
    }
    static repsForBroadcast(tensor, tensor2, broadcastShape) {
        let reps = [[], []]
        let oldShapes = Tensor.matchNumDimentions(tensor, tensor2)
        for (let i = 0; i < broadcastShape.length; i++) {
            if (broadcastShape[i] % oldShapes[0][i] == 0) {
                let rep = broadcastShape[i] / oldShapes[0][i]
                reps[0][i] = rep
            } else {
                reps[0][i] = 1
            }
        }
        for (let i = 0; i < broadcastShape.length; i++) {
            if (broadcastShape[i] % oldShapes[1][i] == 0) {
                let rep = broadcastShape[i] / oldShapes[1][i]
                reps[1][i] = rep
            } else {
                reps[1][i] = 1
            }
        }

        return reps
    }
    broadcast(tensor) {
        let resultShape = Tensor.broadcastArgs(this, tensor)
        let reps = Tensor.repsForBroadcast(this, tensor, resultShape)
        let tileReps = [reps[0].slice(), reps[1].slice()]
        for (let i = 0; i < resultShape.length - this.numDimentions; i++) {
            tileReps[0].shift()
        }
        for (let i = 0; i < resultShape.length - tensor.numDimentions; i++) {
            tileReps[1].shift()
        }
        this.tile(tileReps[0])
        let tempTensor = Tensor.tile(tensor, tileReps[1])
        this.unshiftDimentions(resultShape)
        tempTensor.unshiftDimentions(resultShape)
        return tempTensor
    }
    static broadcast(tensor, tensor2) {
        let resultShape = Tensor.broadcastArgs(tensor, tensor2)
        let reps = Tensor.repsForBroadcast(tensor, tensor2, resultShape)
        let tileReps = [reps[0].slice(), reps[1].slice()]
        for (let i = 0; i < resultShape.length - tensor.numDimentions; i++) {
            tileReps[0].shift()
        }
        for (let i = 0; i < resultShape.length - tensor2.numDimentions; i++) {
            tileReps[1].shift()
        }
        let firstTensor = tensor.copy()
        firstTensor.tile(tileReps[0])
        let secondTensor = Tensor.tile(tensor2, tileReps[1])
        firstTensor.unshiftDimentions(resultShape)
        secondTensor.unshiftDimentions(resultShape)
        return [firstTensor, secondTensor]
    }
    static matchNumDimentions(tensor, tensor2) {
        let numDimentions = Math.max(tensor.numDimentions, tensor2.numDimentions)
        let oldShape = tensor.shape.slice()
        let tensorOldShape = tensor2.shape.slice()
        if (numDimentions > tensor.numDimentions) {
            for (let i = 0; i < numDimentions - tensor.numDimentions; i++) {
                oldShape.unshift(1)
            }
        } else {
            for (let i = 0; i < numDimentions - tensor2.numDimentions; i++) {
                tensorOldShape.unshift(1)
            }
        }
        return [oldShape, tensorOldShape]
    }
    static oneHot(indices, depth) {
        if (indices instanceof Tensor) {
            let shape = indices.shape.slice()
            shape.push(depth)
            let result = Tensor.fromShape(shape)
            let vectorIndices = Tensor.toVectorArray(indices)
            let indice = 0
            result.accesLastArray(result.data, (array) => {
                let index = vectorIndices[indice]
                if (array[index] !== undefined) {
                    array[index] = 1
                }
                indice++
            })
            return result
        } else if (indices instanceof Array) {
            let shape = Tensor.inferShape(indices)
            shape.push(depth)
            let result = Tensor.fromShape(shape)
            let vectorIndices = Tensor.flatten(indices, false)
            let indice = 0
            result.accesLastArray(result.data, (array) => {
                let index = vectorIndices[indice]
                if (array[index] !== undefined) {
                    array[index] = 1
                }
                indice++
            })
            return result
        } else {
            let result = Tensor.fromShape([depth])
            if (result.data[indices] !== undefined) {
                result.data[indices] = 1
            }
            return result
        }
    }
    toVectorArray() {
        let vector = []
        let recursion = (array) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < array.length; i++) {
                    recursion(array[i])
                }
            } else {
                for (let i = 0; i < array.length; i++) {
                    vector.push(array[i])
                }
            }
        }
        recursion(this.data)
        return vector
    }
    static toVectorArray(tensor) {
        let vector = []
        let recursion = (array) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < array.length; i++) {
                    recursion(array[i])
                }
            } else {
                for (let i = 0; i < array.length; i++) {
                    vector.push(array[i])
                }
            }
        }
        recursion(tensor.data)
        return vector
    }
    flatten() {
        let vector = []
        this.accesLastArray(this.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                vector.push(array[index])
            }
        })
        return this.setData(vector)
    }
    static flatten(tensor, toTensor = true) {
        let vector = []
        if (tensor instanceof Tensor) {
            tensor.accesLastArray(tensor.data, (array) => {
                for (let index = 0; index < array.length; index++) {
                    vector.push(array[index])
                }
            })
        } else {
            Tensor.lastArrayNoClone(tensor, (array) => {
                for (let index = 0; index < array.length; index++) {
                    vector.push(array[index])
                }
            })
        }
        if (toTensor) {
            return new Tensor(tensor, [tensor.length])
        }
        return tensor
    }
    reshape(shape) {
        return this.flatten().vectorToTensor(shape)
    }
    static reshape(tensor, shape, toTensor = true) {
        let result = Tensor.flatten(tensor, false)
        return Tensor.fromFlatArray(result, shape, toTensor)
    }
    static inferShape(array) {
        let inferredShape = []
        let checkingArray = array
        let dimentionNumber = 0
        while (checkingArray instanceof Array) {
            inferredShape[dimentionNumber] = 0
            for (let index = 0; index < checkingArray.length; index++) {
                inferredShape[dimentionNumber]++
            }
            checkingArray = checkingArray[0]
            dimentionNumber++
        }
        return inferredShape
    }
    static flatArray(array, shape = [array.length]) {
        // Slower but easier to read
        let numValues = 1
        for (let i = 0; i < shape.length; i++) {
            numValues *= shape[i]
        }
        if (numValues == array.length) {
            let tensor = []
            let element = 0
            let recursion = (data, currentDimention) => {
                if (currentDimention < shape.length - 1) {
                    for (let i = 0; i < shape[currentDimention]; i++) {
                        data[i] = []
                        recursion(data[i], currentDimention + 1)
                    }
                } else {
                    for (let i = 0; i < shape[shape.length - 1]; i++) {
                        data[i] = array[element]
                        element++
                    }
                }
            }
            recursion(tensor, 0)
            return new Tensor(tensor, shape)
        }
        else {
            console.error('Based on the provided shape the tensor should have ' + numValues + ' values but has ' + array.length)
            return
        }
    }
    static fromFlatArray(array, shape = [array.length], toTensor = true) {
        let check = 1
        for (let i = 0; i < shape.length; i++) {
            check *= shape[i]
        }
        if (check == array.length) {
            let tensor = array
            for (let dimentionNumber = shape.length - 1; dimentionNumber >= 0; dimentionNumber--) {
                let dimentionData = []
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
            if(toTensor){
                return new Tensor(tensor, shape)
            }
            return tensor
        } else {
            console.error('Based on the provided shape the tensor should have ' + check + ' values but has ' + array.length)
            return
        }
    }
    vectorToTensor(shape){
        let check = 1
        for (let i = 0; i < shape.length; i++) {
            check *= shape[i]
        }
        if (this.numDimentions == 1) {
            if (this.data.length == check) {
                let tensor = this.data.slice()
                for (let dimentionNumber = shape.length - 1; dimentionNumber >= 0; dimentionNumber--) {
                    let dimentionData = []
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
                return this.setData(tensor[0], shape)
            } else {
                console.error('Based on the provided shape the tensor should have ' + check + ' values but has ' + this.data.length)
                return
            }
        } else {
            console.error('Tensor must have only one dimention but has ' + this.numDimentions)
            return
        }
    }
    static vectorToTensor(){

    }
    static fromNestedArray(array, shape) {
        let inferredShape = Tensor.inferShape(array)
        if (shape == undefined) {
            shape = inferredShape
        } else {
            for (let index = 0; index < shape.length; index++) {
                if (shape[index] !== inferredShape[index]) {
                    console.error('Inferred shape ' + inferredShape + ' does not match the provided shape ' + shape)
                    return
                }
            }
        }
        return new Tensor(array, shape)
    }
    static fromScalar(number) {
        return new Tensor([number], [1])
    }
    static fromShape(shape, fill = 0, start = 0) {
        let numValues = 1
        let data = []
        for (let i = 0; i < shape.length; i++) {
            numValues *= shape[i]
        }
        if (fill == 'increasing') {
            for (let i = 0; i < numValues; i++) {
                data.push(start + i)
            }
        }
        else if (fill == 'decreasing') {
            for (let i = numValues; i >= 0; i--) {
                data.push(start - i)
            }
        }
        else if (typeof fill == 'number') {
            data = new Array(numValues).fill(fill)
        }
        return Tensor.fromFlatArray(data, shape)
    }
    static fromObject(object){
        let data = Tensor.copyArray(object.data)
        let shape = object.shape.slice()
        return new Tensor(data, shape)
    }
    static randomTensor(shape, min = -1, max = 1, floor) {
        let numValues = 1
        let tensor = []
        for (let i = 0; i < shape.length; i++) {
            numValues *= shape[i]
        }
        if (floor == undefined) {
            for (let i = 0; i < numValues; i++) {
                tensor[i] = Math.random() * (max - min) + min
            }
        } else {
            for (let i = 0; i < numValues; i++) {
                tensor[i] = Math.floor(Math.random() * (max + 1 - min) + min)
            }
        }
        return Tensor.fromFlatArray(tensor, shape)
    }
    setData(data, shape) {
        this.data = data
        if (shape !== undefined) {
            this.shape = shape
        } else {
            this.shape = Tensor.inferShape(data)
        }
        this.numDimentions = this.shape.length
        return this
    }
    size() {
        let size = 1
        for (let i = 0; i < this.numDimentions; i++) {
            size *= this.shape[i]
        }
        return size
    }
    static size(tensor) {
        let size = 1
        for (let i = 0; i < tensor.numDimentions; i++) {
            size *= tensor.shape[i]
        }
        return size
    }
    rangeOfValues(){
        let max = -Infinity
        let min = Infinity
        this.accesLastArray(this.data, (array)=>{
            for (let index = 0; index < array.length; index++) {
                if(array[index] > max){
                    max = array[index]
                }
                if(array[index] < min){
                    min = array[index]
                }
            }
        })
        return [min, max]
    }
    static rangeOfValues(tensor) {
        let max = -Infinity
        let min = Infinity
        tensor.accesLastArray(tensor.data, (array) => {
            for (let index = 0; index < array.length; index++) {
                if (array[index] > max) {
                    max = array[index]
                }
                if (array[index] < min) {
                    min = array[index]
                }
            }
        })
        return [min, max]
    }
    accesLastArray(array, func) {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                this.accesLastArray(array[index], func)
            }
        } else {
            func(array)
        }
    }
    static accesLastArray(array, result, func) {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                result[index] = []
                Tensor.accesLastArray(array[index], result[index], func)
            }
        } else {
            func(array, result)
        }
    }
    static lastArrayNoClone(array, func){
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                Tensor.lastArrayNoClone(array[index], func)
            }
        } else {
            func(array)
        }
    }
    accesLastArrays(array, array2, func) {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                this.accesLastArrays(array[index], array2[index], func)
            }
        } else {
            func(array, array2)
        }
    }
    static accesLastArrays(array, array2, result, func) {
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                result[index] = []
                Tensor.accesLastArrays(array[index], array2[index], result[index], func)
            }
        } else {
            func(array, array2, result)
        }
    }
    static lastArraysNoClone(array, array2, func){
        if (array[0] instanceof Array) {
            for (let index = 0; index < array.length; index++) {
                Tensor.accesLastArrays(array[index], array2[index], func)
            }
        } else {
            func(array, array2)
        }
    }
    pseudoCopy() {
        return new Tensor(this.data, this.shape)
    }
    static pseudoCopy(tensor) {
        return new Tensor(tensor.data, tensor.shape)
    }
    copy() {
        let newTensor = []
        let recursion = (copy, data) => {
            if (data[0] instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                    copy[i] = []
                    recursion(copy[i], data[i])
                }
            } else {
                for (let i = 0; i < this.shape[this.numDimentions - 1]; i++) {
                    copy[i] = data[i]
                }
            }
        }
        recursion(newTensor, this.data)
        return new Tensor(newTensor, this.shape)
    }
    static copy(tensor, toTensor = true) {
        let result = []
        let recursion = (copy, array) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < array.length; i++) {
                    copy[i] = []
                    recursion(copy[i], array[i])
                }
            } else {
                for (let i = 0; i < array.length; i++) {
                    copy[i] = array[i]
                }
            }
        }
        if (tensor instanceof Tensor) {
            recursion(result, tensor.data)
            if (toTensor) {
                return new Tensor(result, tensor.shape)
            }
            return result
        }
        else {
            recursion(result, tensor)
            if (toTensor) {
                return new Tensor(result, Tensor.inferShape(tensor))
            }
            return result
        }
    }
    static copyArray(array) {
        let newTensor = []
        let recursion = (copy, data) => {
            if (data[0] instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                    copy[i] = []
                    recursion(copy[i], data[i])
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    copy[i] = data[i]
                }
            }
        }
        recursion(newTensor, array)
        return newTensor
    }
    static create(data, shape) {
        if (data[0] instanceof Array) {
            return Tensor.fromNestedArray(data, shape)
        } else if (data instanceof Array) {
            return Tensor.fromFlatArray(data, shape)
        } else {
            return Tensor.fromScalar(data)
        }
    }
    print() {
        console.table(this.data)
    }
    log() {
        console.log(this.data)
    }
    serialize() {
        return JSON.stringify(this)
    }
    static serialize(tensor) {
        return JSON.stringify(tensor)
    }
    static deserialize(object) {
        if (typeof object == 'string') {
            object = JSON.parse(object)
        }
        return new Tensor(object.data, object.shape)
    }
}

const createTensor = (data, shape) => {
    if (data[0] instanceof Array) {
        return Tensor.fromNestedArray(data, shape)
    } else if (data instanceof Array) {
        return Tensor.fromFlatArray(data, shape)
    } else {
        return Tensor.fromScalar(data)
    }
}
 