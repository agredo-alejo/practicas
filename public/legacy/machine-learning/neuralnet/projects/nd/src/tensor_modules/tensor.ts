import { TensorLike, TensorArray, TensorLike2D, } from "../types.js";
import { ensureTensor, inferShape } from "./t_utils.js";
import { constrain } from "../util.js";
import { broadcastTo } from "./t_transform.js";
export class Tensor {
    data: any; shape: number[]; rank: number;
    constructor(data: TensorLike, shape: number[] = [], rank = shape.length) {
        this.data = data
        this.shape = shape
        this.rank = rank
    }
    // Aritmethic
    add(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => x + tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => x + y), newShape)
    }
    sub(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => x - tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => x - y), newShape)
    }

    mult(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => x * tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => x * y), newShape)
    }

    div(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => x / tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => x / y), newShape)
    }

    divNoNan(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => tensor == 0 ? 0 : x / tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => y == 0 ? 0 : x / y), newShape)
    }

    floorDiv(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => Math.floor(x / tensor)), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => Math.floor(x / y)), newShape)
    }

    floorDivNoNan(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => Math.floor(tensor == 0 ? 0 : x / tensor)), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => Math.floor(y == 0 ? 0 : x / y)), newShape)
    }

    pow(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => x ** tensor), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => x ** y), newShape)
    }

    sqd(tensor: Tensor | TensorLike): Tensor {
        if (typeof tensor == 'number') {
            return this.setData(this.forEach((x: number) => (x - tensor) ** 2), this.shape)
        }
        let internTensor = ensureTensor(tensor)
        let newShape = this.shape
        if (!this.shapesEqual(internTensor.shape)) {
            newShape = this.broadcastArgs(internTensor.shape)
            this.broadcastTo(newShape)
            internTensor = broadcastTo(internTensor, newShape)
        }
        return this.setData(this.forEachOfBoth(internTensor.data, (x: number, y: number) => (x - y) ** 2), newShape)
    }
    // Math
    square(): Tensor {
        this.forEach((x: number) => x ** 2)
        return this
    }

    sqrt(): Tensor {
        this.forEach((x: number) => x ** 0.5)
        return this
    }

    remap(start1: number, end1: number, start2: number, end2: number): Tensor {
        this.forEach((x: number) => (x - start1) / (end1 - start1) * (end2 - start2) + start2)
        return this
    }

    map(func: (n: number) => number): Tensor {
        this.forEach((x: number) => func(x))
        return this
    }

    neg(): Tensor {
        this.forEach((x: number) => -x)
        return this
    }

    log(): Tensor {
        this.forEach((x: number) => x == 0 ? -1000 : Math.log(x))
        return this
    }

    constrain(arg: number | number[], max = 1): Tensor {
        let min: number, internMax: number
        if (arg instanceof Array) {
            min = arg[0]
            internMax = arg[1]
        } else {
            min = arg
            internMax = max
        }
        this.forEach((x: number) => Math.max(Math.min(x, internMax), min))
        return this
    }

    exp(): Tensor {
        this.forEach((x: number) => Math.exp(constrain(x, -50, 50)))
        return this
    }
    // Matrix
    dot(tensor: Tensor | TensorLike2D): Tensor {
        let internTensor = ensureTensor(tensor)
        if (this.rank == 2) {
            if (internTensor.rank == 2) {
                return this.dotMxM(internTensor)
            }
            return this.dotMxV(internTensor)
        }
        if (internTensor.rank == 2) {
            return this.dotVxM(internTensor)
        }
        return this.dotVxV(internTensor)
    }
    dotMxM(tensor: Tensor): Tensor {
        if (this.shape[1] !== tensor.shape[0]) throw console.error('Colums of A must match rows of B')
        let result: number[][] = []
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
        this.rank = this.shape.length
        return this
    }
    dotMxV(tensor: Tensor): Tensor {
        if (this.shape[1] !== tensor.shape[0]) throw console.error('Colums of A must match rows of B')
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
        this.rank = this.shape.length
        return this
    }
    dotVxM(tensor: Tensor): Tensor {
        if (tensor.shape[0] !== 1) throw console.error('Colums of A must match rows of B')
        let result: number[][] = []
        for (let i = 0; i < this.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[1]; j++) {
                result[i][j] = this.data[i] * tensor.data[0][j]
            }
        }
        this.data = result
        this.shape = [this.shape[0], tensor.shape[1]]
        this.rank = this.shape.length
        return this
    }
    dotVxV(tensor: Tensor): Tensor {
        if (this.shape[0] !== tensor.shape[0]) throw console.error('Colums of A must match rows of B')
        let sum = 0
        for (let k = 0; k < this.shape[0]; k++) {
            sum += this.data[k] * tensor.data[k]
        }
        this.data = sum
        this.shape = []
        this.rank = 0
        return this
    }
    transpose(): Tensor {
        if (this.rank == 2) {
            let result: number[][] = []
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
        let result: number[][] = [[]]
        for (let i = 0; i < this.shape[0]; i++) {
            result[0][i] = this.data[i]
        }
        this.data = result
        this.shape = [1, this.shape[0]]
        this.rank = 2
        return this
    }
    mirrorHorizontally(): Tensor {
        for (let i = 0; i < this.shape[0]; i++) {
            for (let j = 0, k = this.shape[1] - 1; j < k; j++, k--) {
                let temp = this.data[i][j]
                this.data[i][j] = this.data[i][k]
                this.data[i][k] = temp
            }
        }
        return this
    }
    mirrorVertically(): Tensor {
        for (let j = 0; j < this.shape[1]; j++) {
            for (let i = 0, k = this.shape[0] - 1; i < k; i++, k--) {
                let temp = this.data[i][j]
                this.data[i][j] = this.data[k][j]
                this.data[k][j] = temp
            }
        }
        return this
    }
    rotate180(): Tensor {
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
    rotate90(): Tensor {
        let result: number[][] = []
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
    rotate270(): Tensor {
        let result: number[][] = []
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
    // Util
    shuffle(): Tensor {
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
    fill(number = 0): Tensor {
        this.forEach(() => number)
        return this
    }
    size(): number {
        let size = 1
        for (let i = 0; i < this.rank; i++) {
            size *= this.shape[i]
        }
        return size
    }
    rangeOfValues(): number[] {
        let max = -Infinity
        let min = Infinity
        this.forEach((x: number) => {
            max = x > max ? x : max
            min = x < min ? x : min
            return x
        })
        return [min, max]
    }

    setData(data: TensorLike, shape?: number[], rank?: number): Tensor {
        this.data = data
        this.shape = shape || inferShape(data)
        this.rank = rank || this.shape.length
        return this
    }

    shapesEqual(shape: number[]): boolean {
        if (this.rank !== shape.length) return false
        for (let i = 0; i < this.rank; i++) {
            if (this.shape[i] !== shape[i]) return false
        }
        return true
    }
    inferShape(): number[] {
        let inferredShape = []
        let checkingArray = this.data
        while (checkingArray instanceof Array) {
            inferredShape.push(checkingArray.length)
            checkingArray = checkingArray[0]
        }
        return inferredShape
    }
    inferRank(): number {
        let rank = 0
        let checkingArray = this.data
        while (checkingArray instanceof Array) {
            rank += 1
            checkingArray = checkingArray[0]
        }
        return rank
    }
    copy(): Tensor {
        let recursion = (copy: any[], data: any[]) => {
            if (data[0] instanceof Array) {
                for (let i = 0; i < data.length; i++) {
                    copy[i] = []
                    recursion(copy[i], data[i])
                }
            } else {
                for (let i = 0; i < this.shape[this.rank - 1]; i++) {
                    copy[i] = data[i]
                }
            }
        }
        if (this.data instanceof Array) {
            let result: TensorLike = []
            recursion(result, this.data)
            return new Tensor(result, this.shape)
        } else {
            return new Tensor(this.data, this.shape)
        }
    }
    // Random
    randomize(options: any[] = []): Tensor {
        let min = options[0] == undefined ? -1 : options[0]
        let max = options[1] == undefined ? 1 : options[1]
        let floor = options[2]
        if (floor == undefined) {
            this.forEach(() => Math.random() * (max - min) + min)
        } else {
            this.forEach(() => Math.floor(Math.random() * (max + 1 - min) + min))
        }
        return this
    }
    // Reduction
    mean(): number {
        let sum = 0
        let numValues = 0
        this.forEach((x: number) => {
            numValues++
            sum += x
            return x
        })
        return sum / numValues
    }
    sumExp(): number {
        let result = 0
        this.forEach((x: number) => {
            result += Math.exp(constrain(x, -50, 50))
            return x
        })
        return result
    }
    max(): number {
        let record = -Infinity
        this.forEach((x: number) => {
            record = x > record ? x : record
            return x
        })
        return record
    }
    sum(): number {
        let result = 0
        this.forEach((x: number) => {
            result += x
            return x
        })
        return result
    }
    // Transformations
    flatten(): Tensor {
        let vector: number[] = []
        this.forEach((x: number) => {
            vector.push(x)
            return x
        })
        return this.setData(vector)
    }
    reshape(shape: number[]): Tensor {
        return this.flatten().vectorToTensor(shape)
    }
    vectorToTensor(shape: number[]): Tensor {
        let size = 1
        for (let i = 0; i < shape.length; i++) {
            size *= shape[i]
        }
        if (this.data.length !== size) throw console.error('Based on the provided shape the tensor should have ' + size + ' values but has ' + this.data.length)
        let tensor = this.data.slice()
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
        return this.setData(tensor[0], shape)
    }
    tile(reps: number[]): Tensor {
        if (reps.length !== this.rank) throw console.error('Dimentions in reps: ' + reps + ', does not match with the number of dimentions from tensor: ' + this.shape)
        let newShape: number[] = []
        for (let i = 0; i < this.rank; i++) {
            newShape[i] = reps[i] * this.shape[i]
        }
        let newData: TensorArray = []
        let recursion = (array: any, array2: any, currentDimention: number) => {
            if (array[0] instanceof Array) {
                for (let i = 0; i < newShape[currentDimention]; i++) {
                    array2[i] = []
                    recursion(array[i % this.shape[currentDimention]], array2[i], currentDimention + 1)
                }
            } else {
                for (let i = 0; i < newShape[newShape.length - 1]; i++) {
                    array2[i] = array[i % this.shape[this.rank - 1]]
                }
            }
        }
        recursion(this.data, newData, 0)
        return this.setData(newData, newShape)
    }
    broadcastTo(shape: number[]): Tensor {
        let oldShape = this.shape.slice()
        if (shape.length < this.rank) {
            throw console.error('Rank from shape ' + shape.length + ' is minor than tensor rank ' + this.rank)
        }
        if (shape.length > this.rank) {
            let newShape = this.shape.slice();
            while (newShape.length < shape.length) {
                newShape.unshift(1)
            }
            this.reshape(newShape)
        }
        let reps = shape.slice()
        for (let index = 0; index < shape.length; index++) {
            if (this.shape[index] === shape[index]) {
                reps[index] = 1;
            } else if (this.shape[index] !== 1) {
                throw console.error(oldShape + ' cannot be broadcast to ' + shape)
            }
        }
        return this.tile(reps)
    }
    broadcastArgs(shape: number[]): number[] {
        let oldShape = this.shape.slice(), oldShape2 = shape.slice()
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

    // Navigate through tensor
    forEach(func: (x: number) => number): TensorLike {
        let recursion = (array: any[]) => {
            if (array[0] instanceof Array) {
                for (let index = 0; index < array.length; index++) {
                    recursion(array[index])
                }
            } else {
                for (let index = 0; index < array.length; index++) {
                    array[index] = func(array[index])
                }
            }
        }
        if (this.data instanceof Array) {
            recursion(this.data)
        } else {
            this.data = func(this.data)
        }
        return this.data
    }
    forEachOfBoth(tensor: TensorLike, func: (n: number, n2: number) => number): TensorLike {
        let recursion = (array: any[], array2: any[]) => {
            if (array[0] instanceof Array) {
                for (let index = 0; index < array.length; index++) {
                    recursion(array[index], array2[index])
                }
            } else {
                for (let index = 0; index < array.length; index++) {
                    array[index] = func(array[index], array2[index])
                }
            }
        }
        if (this.data instanceof Array && tensor instanceof Array) {
            recursion(this.data, tensor)
            return this.data
        } else if (typeof this.data == 'number' && typeof tensor == "number") {
            this.data = func(this.data, tensor)
        }
        return this.data
    }
    accesLastArray(func: (array: number[]) => void): TensorLike {
        let recursion = (array: any) => {
            if (array[0] instanceof Array) {
                for (let index = 0; index < array.length; index++) {
                    recursion(array[index])
                }
            } else {
                func(array)
            }
        }
        recursion(this.data)
        return this.data
    }
    accesLastArrays(tensorArray: TensorArray, func: (array: number[], array2: number[]) => void): TensorLike {
        let recursion = (array: any, array2: any) => {
            if (array[0] instanceof Array) {
                for (let index = 0; index < array.length; index++) {
                    recursion(array[index], array2[index])
                }
            } else {
                func(array, array2)
            }
        }
        recursion(this.data, tensorArray)
        return this.data
    }
    static serialize(tensor: Tensor) {
        return JSON.stringify(tensor)
    }
    static deserialize(object: Tensor) {
        if (typeof object == 'string') {
            object = JSON.parse(object)
        }
        return new Tensor(object.data, object.shape)
    }
}
