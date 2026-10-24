class Matrix {
    constructor(rows, cols) {
        if (rows !== undefined) {
            this.rows = rows
            this.cols = cols
            this.data = []
            for (let i = 0; i < this.rows; i++) {
                this.data[i] = []
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] = 0
                }
            }
        }
    }
    setData(array) {
        this.rows = array.length
        this.cols = array[0].length
        this.data = array
        return this
    }
    static fromArray(array) {
        if (array[0].length == undefined) {
            let result = []
            for (let i = 0; i < array.length; i++) {
                result.push([array[i]])
            }
            return new Matrix().setData(result)
        }
        return new Matrix().setData(array)
    }
    toArray() {
        let result = []
        for (let i = 0; i < this.rows; i++) {
            result[i] = []
            for (let j = 0; j < this.cols; j++) {
                result[i][j] = this.data[i][j]
            }
        }
        return result
    }

    static add(array, addend) {
        let result = []
        for (let i = 0; i < array.rows; i++) {
            result[i] = []
            for (let j = 0; j < array.cols; j++) {
                result[i][j] = array.data[i][j] + addend.data[i][j]
            }
        }
        return new Matrix().setData(result)
    }
    add(addend) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] += addend.data[i][j]
            }
        }
        return this
    }
    static sub(array, term) {
        let result = []
        for (let i = 0; i < array.rows; i++) {
            result[i] = []
            for (let j = 0; j < array.cols; j++) {
                result[i][j] = array.data[i][j] - term.data[i][j]
            }
        }
        return new Matrix().setData(result)
    }
    sub(term) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] -= term.data[i][j]
            }
        }
        return this
    }
    mult(factor) {
        if (factor instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] *= factor.data[i][j]
                }
            }
            return this
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] *= factor
            }
        }
        return this
    }
    static mult(matrix, factor) {
        if (factor instanceof Matrix) {
            let result = []
            for (let i = 0; i < matrix.rows; i++) {
                result[i] = []
                for (let j = 0; j < matrix.cols; j++) {
                    result[i][j] = matrix.data[i][j] * factor.data[i][j]
                }
            }
            return new Matrix().setData(result)
        }
        let result = []
        for (let i = 0; i < matrix.rows; i++) {
            result[i] = []
            for (let j = 0; j < matrix.cols; j++) {
                result[i][j] = matrix.data[i][j] * factor
            }
        }
        return new Matrix().setData(result)
    }
    div(divisor) {
        if (divisor instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.data[i][j] /= divisor.data[i][j]
                }
            }
            return this
        }
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] /= factor
            }
        }
        return this
    }
    static div(matrix, divisor) {
        if (divisor instanceof Matrix) {
            let result = []
            for (let i = 0; i < matrix.rows; i++) {
                result[i] = []
                for (let j = 0; j < matrix.cols; j++) {
                    result[i][j] = matrix.data[i][j] / factor.data[i][j]
                }
            }
            return new Matrix().setData(result)
        }
        let result = []
        for (let i = 0; i < matrix.rows; i++) {
            result[i] = []
            for (let j = 0; j < matrix.cols; j++) {
                result[i][j] = matrix.data[i][j] / factor
            }
        }
        return new Matrix().setData(result)
    }
    dot(factor) {
        if (this.cols !== factor.rows) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < this.rows; i++) {
            result[i] = []
            for (let j = 0; j < factor.cols; j++) {
                let sum = 0
                for (let k = 0; k < this.cols; k++) {
                    sum += this.data[i][k] * factor.data[k][j]
                }
                result[i][j] = sum
            }
        }
        return this.setData(result)
    }
    static dot(matrix, factor) {
        if (matrix.cols !== factor.rows) {
            console.error('Colums of A must match rows of B')
            return
        }
        let result = []
        for (let i = 0; i < matrix.rows; i++) {
            result[i] = []
            for (let j = 0; j < factor.cols; j++) {
                let sum = 0
                for (let k = 0; k < matrix.cols; k++) {
                    sum += matrix.data[i][k] * factor.data[k][j]
                }
                result[i][j] = sum
            }
        }
        return new Matrix().setData(result)
    }
    map(func) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = func(this.data[i][j])
            }
        }
        return this
    }
    static map(matrix, func) {
        let result = []
        for (let i = 0; i < matrix.rows; i++) {
            result[i] = []
            for (let j = 0; j < matrix.cols; j++) {
                result[i][j] = func(matrix.data[i][j])
            }
        }
        return new Matrix().setData(result)
    }
    randomize(min = -1, max = 1) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * (max - min) + min
            }
        }
        return this
    }
    static randomize(rows, cols, min = -1, max = 1) {
        let result = []
        for (let i = 0; i < rows; i++) {
            result[i] = []
            for (let j = 0; j < cols; j++) {
                result[i][j] = Math.random() * (max - min) + min
            }
        }
        return new Matrix().setData(result)
    }
    transpose() {
        let result = []
        for (let i = 0; i < this.cols; i++) {
            result[i] = []
            for (let j = 0; j < this.rows; j++) {
                result[i][j] = this.data[j][i]
            }
        }
        return this.setData(result)
    }
    static transpose(matrix) {
        let result = []
        for (let i = 0; i < matrix.cols; i++) {
            result[i] = []
            for (let j = 0; j < matrix.rows; j++) {
                result[i][j] = matrix.data[j][i]
            }
        }
        return new Matrix().setData(result)
    }
    copy() {
        let result = []
        for (let i = 0; i < this.rows; i++) {
            result[i] = []
            for (let j = 0; j < this.cols; j++) {
                result[i][j] = this.data[i][j]
            }
        }
        return new Matrix().setData(result)
    }
    print() {
        console.table(this.data)
    }
    static print(matrix) {
        console.table(matrix.data)
    }
    serialize() {
        return JSON.stringify(this)
    }
    static serialize(matrix) {
        return JSON.stringify(matrix)
    }
    static deserialize(object) {
        if (typeof object == 'string') {
            object = JSON.parse(object)
        }
        return new Matrix().setData(object.data)
    }
}