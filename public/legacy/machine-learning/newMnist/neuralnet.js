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
    fill(num) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = num
            }
        }
        return this
    }
    static fill(matrix, num) {
        let result = []
        for (let i = 0; i < matrix.rows; i++) {
            result[i] = []
            for (let j = 0; j < matrix.cols; j++) {
                result[i][j] = num
            }
        }
        return new Matrix.setData(result)
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
class Loss {
    constructor(func, dfunc) {
        this.func = func
        this.dfunc = dfunc
    }
}
let meanSquaredError = new Loss(
    (output, target) => Matrix.sub(target, output).map(x => x * x),
    (output, target) => Matrix.sub(output, target).mult(2)
)

let crossEntropy = new Loss(
    (output, target) => Matrix.map(output, x => x > 0 ? -Math.log(x) : -Math.log(1e-10)).mult(target),
    (output, target) => Matrix.map(output, x => x > 0 ? -1 / x : -1e+10).mult(target)
)

class ActFunc {
    constructor(func, dfunc, updateError) {
        this.func = func
        this.dfunc = dfunc
        this.updateError = updateError
    }
}
let binaystep = new ActFunc(
    x => Matrix.map(x, y => y > 0 ? 1 : 0),
    x => Matrix.map(x, () => 0),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let lineatAct = new ActFunc(
    x => Matrix.map(x, y => y),
    x => Matrix.map(x, () => 1),
    neuronError => neuronError
)
let sigmoid = new ActFunc(
    x => Matrix.map(x, y => 1 / (1 + Math.exp(-y))),
    x => Matrix.map(x, y => y * (1 - y)),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let tanh = new ActFunc(
    x => Matrix.map(x, y => Math.tanh(y)),
    x => Matrix.map(x, y => 1 - (y * y)),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let relu = new ActFunc(
    x => Matrix.map(x, y => Math.max(0, y)),
    x => Matrix.map(x, y => y > 0 ? 1 : 0),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let leakyrelu = new ActFunc(
    x => Matrix.map(x, y => Math.max(0.05 * y, y)),
    x => Matrix.map(x, y => y > 0 ? 1 : 0.05),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let elu = new ActFunc(
    x => Matrix.map(x, y => y > 0 ? x : 0.05 * (Math.exp(y) - 1)),
    x => Matrix.map(x, y => y > 0 ? 1 : 0.05 + y),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let softplus = new ActFunc(
    x => Matrix.map(x, y => Math.log(1 + Math.exp(y))),
    x => Matrix.map(x, y => 1 / (1 + Math.exp(-y))),
    (neuronError, dActFunc) => neuronError.mult(dActFunc)
)
let softmax = new ActFunc(
    weightedSum => {
        // console.log(weightedSum);

        let sumatoria = 0
        let result = []
        for (let i = 0; i < weightedSum.rows; i++) {
            let num = Math.exp(weightedSum.data[i][0])
            result[i] = [num]
            sumatoria += num
        }
        // console.log(result);
        // console.log(sumatoria);


        return new Matrix().setData(result).map(x => x / sumatoria)
    },

    output => {
        let result = []
        for (let i = 0; i < output.rows; i++) {
            result[i] = []
            for (let j = 0; j < output.rows; j++) {
                if (i == j) {
                    result[i][j] = output.data[i][0] * (1 - output.data[i][0])
                } else {
                    result[i][j] = -output.data[i][0] * output.data[j][0]
                }
            }
        }
        return new Matrix().setData(result)
    },

    (dActFunc, neuronError) => dActFunc.dot(neuronError)
)

class Layer {
    constructor() {

    }
    static activationHandler(string) {
        switch (string) {
            case 'sigmoid':
                return sigmoid
            case 'leakyrelu':
                return leakyrelu
            case 'softmax':
                return softmax
            case 'binarystep':
                return binaystep
            case 'relu':
                return relu
            case 'softplus':
                return softplus
            case 'tanh':
                return tanh
            case 'elu':
                return elu
            case 'linear':
                return lineatAct
            default:
                return lineatAct
        }
    }
    static typeHandler(object){
        switch (object.type) {
            case 'dense':
                return Layer.dense(object)
            case 'conv2d':
                return Layer.conv2d(object)
            case 'maxpooling2d':
                return Layer.maxPooling2d(object)
            case 'flatten':
                return Layer.flatten(object)
            case 'dropout':
                return Layer.dropout(object)
            default:
                break;
        }
    }
    static dense(object) {
        return new DenseClass(object)
    }

    static conv2d(object) {
        return new Conv2dClass(object)
    }

    static maxPooling2d(object) {
        return new MaxPooling2dClass(object)

    }

    static flatten(object) {
        return new FlattenCLass(object)
    }

    static dropout(object){
        return new DropoutClass(object)
    } 

    paddingOperation(input, padArray) {
        let imagenResultante = []
        for (let i = 0; i < input.rows; i++) {
            imagenResultante[i] = input.data[i].slice()
            for (let j = 0; j < padArray[0]; j++) {
                imagenResultante[i].unshift(0)
            }
            for (let j = 0; j < padArray[1]; j++) {
                imagenResultante[i].push(0)
            }
        }
        for (let i = 0; i < padArray[2]; i++) {
            imagenResultante.unshift(new Array(imagenResultante[0].length).fill(0))
        }
        for (let i = 0; i < padArray[3]; i++) {
            imagenResultante.push(new Array(imagenResultante[0].length).fill(0))
        }
        return new Matrix().setData(imagenResultante)
    }
}



class DenseClass {
    constructor(object) {
        this.type = 'dense'
        this.isTrainable = true
        this.activation = object.activation
        this.activationFunction = Layer.activationHandler(this.activation)
        this.units = Math.floor(object.units)
        this.outputShape = this.units
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = Math.floor(object.inputShape)

        if (object.weight !== undefined) {
            this.weight = []
            for (let i = 0; i < object.weight.rows; i++) {
                this.weight[i] = []
                for (let j = 0; j < object.weight.cols; j++) {
                    this.weight[i][j] = object.weight.data[i][j]
                }
            }
            this.weight = Matrix.fromArray(this.weight)

            this.bias = []
            for (let i = 0; i < object.bias.rows; i++) {
                this.bias[i] = []
                for (let j = 0; j < object.bias.cols; j++) {
                    this.bias[i][j] = object.bias.data[i][j]
                }
            }
            this.bias = Matrix.fromArray(this.bias)
        } else {
            this.weight = Matrix.randomize(this.units, this.inputShape)
            this.bias = Matrix.randomize(this.units, 1)
        }


    }
    apply(input) {
        let output = Matrix.dot(this.weight, input).add(this.bias)
        return this.activationFunction.func(output)
    }
    backprop(neuronErrors, output, lastLayerOutput, learningRate) {

        let updatedError = this.activationFunction.updateError(this.activationFunction.dfunc(output), neuronErrors)

        // Calculate the gradients
        let gradient = Matrix.mult(updatedError, learningRate)

        let lastLayerTransposed = Matrix.transpose(lastLayerOutput)
        let weightDeltas = Matrix.dot(gradient, lastLayerTransposed)


        // Calculate the error of the last layer neurons
        let transposedWeights = Matrix.transpose(this.weight)
        updatedError = Matrix.dot(transposedWeights, updatedError)

        // Gradient descend
        this.weight.sub(weightDeltas)
        this.bias.sub(gradient)

        return updatedError
    }
    serialize(){
        return JSON.stringify(this)
    }
}

class Conv2dClass extends Layer {
    constructor(object) {
        super()
        this.type = 'conv2d'
        this.activation = object.activation
        this.activationFunction = Layer.activationHandler(this.activation)
        this.isTrainable = true

        // Strides
        if (object.strides == undefined) {
            this.strides = [1, 1]
        } else if (typeof object.strides == 'number') {
            let num = Math.max(object.strides, 1)
            this.strides = [num, num]

        } else {
            this.strides = [
                Math.max(object.strides[0], 1),
                Math.max(object.strides[1], 1)
            ]
        }
        this.strides = [
            Math.floor(this.strides[0]),
            Math.floor(this.strides[1])
        ]
        // Dilation
        if (object.dilation == undefined) {
            this.dilation = [1, 1]
        } else if (typeof object.dilation == 'number') {
            let num = Math.max(object.dilation, 1)
            this.dilation = [num, num]

        } else {
            this.dilation = [
                Math.max(object.dilation[0], 1),
                Math.max(object.dilation[1], 1)
            ]
        }
        this.dilation = [
            Math.floor(this.dilation[0]),
            Math.floor(this.dilation[1])
        ]


        // KernelSize
        if (typeof object.kernelSize == 'number') {
            this.kernelSize = [object.kernelSize, object.kernelSize]
        } else {
            this.kernelSize = object.kernelSize
        }
        this.kernelSize = [
            Math.floor(this.kernelSize[0]),
            Math.floor(this.kernelSize[1])
        ]

        this.filters = Math.floor(object.filters)
        this.padding = object.padding
        if (object.inputShape !== undefined) {
            this.inputShape = object.inputShape
            this.inputShape = [
                Math.floor(this.inputShape[0]),
                Math.floor(this.inputShape[1]),
                Math.floor(this.inputShape[2])
            ]
            this.resize(object)
        }

    }
    resize(object) {
        this.amountOfPadding(this.padding)



        this.outputShape = [
            (this.inputShape[0] + this.padWidth - this.dilation[0] * (this.kernelSize[0] - 1) - 1) / this.strides[0] + 1,
            (this.inputShape[1] + this.padHeight - this.dilation[1] * (this.kernelSize[1] - 1) - 1) / this.strides[1] + 1,
            object.filters
        ]
        this.outputShape = [
            Math.floor(Math.max(this.outputShape[0], 1)),
            Math.floor(Math.max(this.outputShape[1], 1)),
            this.filters
        ]

        // Filters creation
        if (object.kernels !== undefined) {
            // console.log('i');
            
            this.kernels = []
            for (let filters = 0; filters < object.kernels.length; filters++) {
                this.kernels[filters] = []
                for (let channel = 0; channel < object.kernels[0].length; channel++) {
                    this.kernels[filters][channel] = []
                    for (let kernelRow = 0; kernelRow < object.kernels[filters][channel].rows; kernelRow++) {
                        this.kernels[filters][channel][kernelRow] = []
                        for (let kernelCol = 0; kernelCol < object.kernels[filters][channel].cols; kernelCol++) {
                            this.kernels[filters][channel][kernelRow][kernelCol] = object.kernels[filters][channel].data[kernelRow][kernelCol]
                        }
                    }
                    this.kernels[filters][channel] = Matrix.fromArray(this.kernels[filters][channel])
                }

            }

            this.bias = []
            for (let filter = 0; filter < object.bias.length; filter++) {
                this.bias[filter] = []
                for (let row = 0; row < object.bias[filter].rows; row++) {
                    this.bias[filter][row] = []
                    for (let col = 0; col < object.bias[filter].cols; col++) {
                        this.bias[filter][row][col] = object.bias[filter].data[row][col]
                    }
                }
                this.bias[filter] = Matrix.fromArray(this.bias[filter])
            }
        } else {

            // let maxRangue = 1
            // let minRangue = -1
            // console.log('i');
            
            this.kernels = []
            for (let i = 0; i < this.filters; i++) {
                
                this.kernels[i] = []
                for (let j = 0; j < this.inputShape[2]; j++) {
                    this.kernels[i][j] = Matrix.randomize(
                        this.kernelSize[0],
                        this.kernelSize[1],
                    )
                }
            }

            this.bias = []
            for (let i = 0; i < this.filters; i++) {
                this.bias[i] = Matrix.randomize(
                    this.outputShape[0],
                    this.outputShape[1]
                )
            }
        }

        this.paddingForBackprop()

    }
    amountOfPadding(string) {
        if (string == 'same') {
            this.padWidth = Math.floor(this.dilation[0] * (this.kernelSize[0] - 1) + (this.inputShape[0] - 1) * (this.strides[0] - 1))
            this.padHeight = Math.floor(this.dilation[1] * (this.kernelSize[1] - 1) + (this.inputShape[1] - 1) * (this.strides[1] - 1))

            this.padTop = Math.floor(this.padHeight / 2)
            this.padBottom = this.padHeight - this.padTop

            this.padLeft = Math.floor(this.padWidth / 2)
            this.padRight = this.padWidth - this.padLeft

            this.internPadding = [this.padTop, this.padBottom, this.padLeft, this.padRight]
            this.applyPadding = true
        } else{
            this.applyPadding = false, this.padWidth = 0, this.padHeight = 0, this.padTop = 0, this.padBottom = 0, this.padLeft = 0, this.padRight = 0, this.internPadding = [0, 0, 0, 0]
        }
    }
    paddingForBackprop() {
        if (this.applyPadding) {
            this.padWidthBack = Math.floor(this.kernelSize[0] - 1)
            this.padHeightBack = Math.floor(this.kernelSize[1] - 1)

            this.padTopBack = Math.floor(this.padHeightBack / 2)
            this.padBottomBack = this.padHeightBack - this.padTopBack

            this.padLeftBack = Math.floor(this.padWidthBack / 2)
            this.padRightBack = this.padWidthBack - this.padLeftBack

            this.paddForBackprop = [this.padTopBack, this.padBottomBack, this.padLeftBack, this.padRightBack]
            this.paddForWeights = [this.padTopBack, this.padBottomBack, this.padLeftBack, this.padRightBack]

        } else {
            this.padWidthBack = Math.floor(this.kernelSize[0] - this.outputShape[0] - (1 - this.inputShape[0]))
            this.padHeightBack = Math.floor(this.kernelSize[1] - this.outputShape[1] - (1 - this.inputShape[1]))

            this.padTopBack = Math.floor(this.padHeightBack / 2)
            this.padBottomBack = this.padHeightBack - this.padTopBack

            this.padLeftBack = Math.floor(this.padWidthBack / 2)
            this.padRightBack = this.padWidthBack - this.padLeftBack

            this.paddForBackprop = [this.padTopBack, this.padBottomBack, this.padLeftBack, this.padRightBack]
            this.paddForWeights = [0, 0, 0, 0]
        }

        this.outputForBackprop = [
            Math.floor(this.outputShape[0] + this.padWidthBack - this.kernelSize[0] + 1),
            Math.floor(this.outputShape[1] + this.padHeightBack - this.kernelSize[1] + 1)
        ]
        this.outputForBackprop = [
            Math.max(this.outputForBackprop[0], 1),
            Math.max(this.outputForBackprop[1], 1)
        ]

    }
    apply(input) {
        let internImagenes = []
        if (this.applyPadding) {
            for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
                internImagenes[imgInChannel] = this.paddingOperation(input[imgInChannel], this.internPadding)
            }
        } else {
            internImagenes = input
        }

        let imagenesResultantes = []


        for (let numFilters = 0; numFilters < this.filters; numFilters++) {
            imagenesResultantes[numFilters] = new Matrix(this.outputShape[0], this.outputShape[1])


            for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {

                for (let imgRow = 0; imgRow < this.outputShape[0]; imgRow++) {
                    for (let imgCol = 0; imgCol < this.outputShape[1]; imgCol++) {
                        let sumatoria = 0
                        for (let kernelRow = 0; kernelRow < this.kernelSize[0]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < this.kernelSize[1]; kernelCol++) {

                                let row = kernelRow * this.dilation[0] + imgRow * this.strides[0],
                                    col = kernelCol * this.dilation[1] + imgCol * this.strides[1]
                                sumatoria += internImagenes[imgInChannel].data[row][col] * this.kernels[numFilters][imgInChannel].data[kernelRow][kernelCol]
                            }
                        }
                        sumatoria /= this.kernelSize[0] * this.kernelSize[1] * this.filters
                        // sumatoria += this.bias[numFilters].data[imgRow][imgCol]
                        imagenesResultantes[numFilters].data[imgRow][imgCol] += sumatoria + this.bias[numFilters].data[imgRow][imgCol]
                    }
                }
            }
            imagenesResultantes[numFilters] = this.activationFunction.func(imagenesResultantes[numFilters])
        }
        return imagenesResultantes
    }
    backprop(neuronErrors, output, lastLayerOutput, learningRate) {
        let internImagenes = [], internLastLayerOutput = [], gradients = [], updatedError

        for (let numFilters = 0; numFilters < this.filters; numFilters++) {
            updatedError = this.activationFunction.updateError(this.activationFunction.dfunc(output[numFilters]), neuronErrors[numFilters])

            gradients[numFilters] = Matrix.mult(updatedError, learningRate)
            this.bias[numFilters].sub(gradients[numFilters])

            internImagenes[numFilters] = this.paddingOperation(neuronErrors[numFilters], this.paddForBackprop)
        }


        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            internLastLayerOutput[imgInChannel] = this.paddingOperation(lastLayerOutput[imgInChannel], this.paddForWeights)
        }


        // Calculate the error from the last Layer
        let backpropError = []
        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            backpropError[imgInChannel] = new Matrix(this.inputShape[0], this.inputShape[1])

            for (let numFilters = 0; numFilters < this.kernels.length; numFilters++) {

                for (let imgRow = 0; imgRow < this.inputShape[0]; imgRow++) {
                    for (let imgCol = 0; imgCol < this.inputShape[1]; imgCol++) {

                        let sumatoria = 0
                        for (let kernelRow = 0; kernelRow < this.kernelSize[0]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < this.kernelSize[1]; kernelCol++) {

                                sumatoria += internImagenes[numFilters].data[kernelRow + imgRow][kernelCol + imgCol] * this.kernels[numFilters][imgInChannel].data[kernelRow][kernelCol]
                            }
                        }
                        sumatoria /= this.kernelSize[0] * this.kernelSize[1] * this.inputShape[2]
                        backpropError[imgInChannel].data[imgRow][imgCol] += sumatoria
                    }
                }
            }
        }

        // Calculate the gradients
        for (let numFilters = 0; numFilters < this.filters; numFilters++) {
            for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {

                for (let kernelRow = 0; kernelRow < this.kernelSize[0]; kernelRow++) {
                    for (let kernelCol = 0; kernelCol < this.kernelSize[1]; kernelCol++) {

                        let sumatoria = 0
                        for (let imgRow = 0; imgRow < this.outputShape[0]; imgRow++) {
                            for (let imgCol = 0; imgCol < this.outputShape[1]; imgCol++) {
                                sumatoria += internLastLayerOutput[imgInChannel].data[kernelRow + imgRow][kernelCol + imgCol] * gradients[numFilters].data[imgRow][imgCol]
                            }
                        }
                        sumatoria /= this.outputShape[0] * this.outputShape[1] * this.inputShape[2]
                        this.kernels[numFilters][imgInChannel].data[kernelRow][kernelCol] -= sumatoria
                    }
                }
            }
        }

        return backpropError
    }
    serialize(){
        return JSON.stringify(this)
    }
}

class MaxPooling2dClass extends Layer {
    constructor(object) {
        super()
        // PoolSize
        this.type = 'maxpooling2d'
        if (object.poolSize == undefined) {
            this.poolSize = [2, 2]
        }
        else if (typeof object.poolSize == 'number') {
            let num = Math.max(object.poolSize, 1)
            this.poolSize = [num, num]
        } else {
            this.poolSize = [
                Math.max(object.poolSize[0], 1),
                Math.max(object.poolSize[1], 1)
            ]
        }
        this.poolSize = [
            Math.floor(this.poolSize[0]),
            Math.floor(this.poolSize[1])
        ]

        // Strides
        if (object.strides == undefined) {
            this.strides = [
                this.poolSize[0],
                this.poolSize[1]
            ]
        } else if (typeof object.strides == 'number') {
            let num = Math.max(object.strides, 1)
            this.strides = [num, num]
        }
        else {
            this.strides = [
                Math.max(object.strides[0], 1),
                Math.max(object.strides[1], 1)
            ]
        }
        this.strides = [
            Math.floor(this.strides[0]),
            Math.floor(this.strides[1])
        ]
        this.padding = object.padding
        if (object.inputShape !== undefined) {
            this.inputShape = object.inputShape
            this.resize(object)
        }

        this.coords = []

    }
    resize() {
        this.amountOfPadding(this.padding)
    }
    amountOfPadding(string) {
        if (string == 'same') {
            this.applyPadding = true
            this.outputShape = [
                Math.ceil(this.inputShape[0] / this.strides[0]),
                Math.ceil(this.inputShape[1] / this.strides[1]),
                this.inputShape[2]
            ]

            this.padWidth = Math.max((this.outputShape[0] - 1) * this.strides[0] + this.poolSize[0] - this.inputShape[0], 0)
            this.padHeight = Math.max((this.outputShape[1] - 1) * this.strides[1] + this.poolSize[1] - this.inputShape[1], 0)

            this.padTop = Math.floor(this.padWidth / 2)
            this.padBottom = this.padHeight - this.padTop
            this.padLeft = Math.floor(this.padHeight / 2)
            this.padRight = this.padWidth - this.padLeft

            this.internPadding = [this.padTop, this.padBottom, this.padLeft, this.padRight]
        } else{
            this.applyPadding = false
            this.outputShape = [
                Math.floor(this.inputShape[0] / this.strides[0]),
                Math.floor(this.inputShape[1] / this.strides[1]),
                this.inputShape[2]
            ]
            this.padWidth = 0, this.padHeight = 0, this.padTop = 0, this.padBottom = 0, this.padLeft = 0, this.padRight = 0, this.internPadding = [0, 0, 0, 0]
        }
    }
    apply(input) {
        this.coords = []
        let internImagenes = []
        if (this.applyPadding) {
            for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
                internImagenes[imgInChannel] = this.paddingOperation(input[imgInChannel], this.internPadding)
            }
        } else {
            internImagenes = input
        }
        let imagenesResultantes = []

        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            imagenesResultantes[imgInChannel] = []

            for (let imgRow = 0; imgRow < this.outputShape[0]; imgRow++) {
                imagenesResultantes[imgInChannel][imgRow] = []
                for (let imgCol = 0; imgCol < this.outputShape[1]; imgCol++) {
                    let record = -Infinity
                    let coords = []
                    for (let kernelRow = 0; kernelRow < this.poolSize[0]; kernelRow++) {
                        for (let kernelCol = 0; kernelCol < this.poolSize[1]; kernelCol++) {
                            let row = kernelRow + imgRow * this.strides[0],
                                col = kernelCol + imgCol * this.strides[1]
                            // record = Math.max(internImagenes[imgInChannel][row][col], record)

                            if (internImagenes[imgInChannel].data[row][col] > record) {
                                record = internImagenes[imgInChannel].data[row][col]
                                coords = [imgInChannel, row, col, imgRow, imgCol]
                            }
                        }
                    }
                    this.coords.push(coords)
                    imagenesResultantes[imgInChannel][imgRow][imgCol] = record
                }
            }
            imagenesResultantes[imgInChannel] = Matrix.fromArray(imagenesResultantes[imgInChannel])
        }
        return imagenesResultantes
    }
    backprop(neuronErrors) {
        let result = []
        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            result[imgInChannel] = new Matrix(this.inputShape[0], this.inputShape[1])

        }
        for (let i = 0; i < this.coords.length; i++) {
            result[this.coords[i][0]].data[this.coords[i][1]][this.coords[i][2]] = neuronErrors[this.coords[i][0]].data[this.coords[i][3]][this.coords[i][4]]
        }
        return result
    }
    serialize(){
        return JSON.stringify(this)
    }
}

class FlattenCLass {
    constructor(object) {
        this.type = 'flatten'
        if (object != undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = object.inputShape
        this.inputShape = [
            Math.floor(this.inputShape[0]),
            Math.floor(this.inputShape[1]),
            Math.floor(this.inputShape[2])
        ]

        this.outputShape = 1
        for (let i = 0; i < this.inputShape.length; i++) {
            this.outputShape *= this.inputShape[i]
        }
    }
    apply(input) {
        let result = []
        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            for (let imgRow = 0; imgRow < this.inputShape[0]; imgRow++) {
                for (let imgCol = 0; imgCol < this.inputShape[1]; imgCol++) {
                    result.push(input[imgInChannel].data[imgRow][imgCol])
                }
            }
        }
        return Matrix.fromArray(result)
    }
    backprop(vectorNeuronErrors) {
        let matrixNeuronErrors = []
        let vectorImg = 0
        for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
            matrixNeuronErrors[imgInChannel] = []
            for (let imgRow = 0; imgRow < this.inputShape[0]; imgRow++) {
                matrixNeuronErrors[imgInChannel][imgRow] = []
                for (let imgCol = 0; imgCol < this.inputShape[1]; imgCol++) {
                    matrixNeuronErrors[imgInChannel][imgRow][imgCol] = vectorNeuronErrors.data[vectorImg][0]
                    vectorImg++
                }
            }
            matrixNeuronErrors[imgInChannel] = Matrix.fromArray(matrixNeuronErrors[imgInChannel])
        }
        return matrixNeuronErrors

    }
    serialize(){
        return JSON.stringify(this)
    }
}
class DropoutClass {
    constructor(object) {
        this.type = 'dropout'
        this.rate = object.rate
        if(object.inputShape !== undefined){
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = object.inputShape
        if (this.inputShape instanceof Array) {
            this.inputShape = [
                Math.floor(this.inputShape[0]),
                Math.floor(this.inputShape[1]),
                Math.floor(this.inputShape[2])
            ]
            this.apply = this.applyFor3DInput
        } else {
            this.inputShape = Math.floor(this.inputShape)
            this.apply = this.applyFor2DInput
        }
        this.outputShape = this.inputShape
    }
    apply(input) {

    }
    backprop(output) {
        return output
    }
    applyFor2DInput(input) {
        let result = []
        for (let i = 0; i < input.rows; i++) {
            result[i] = []
            for (let j = 0; j < input.cols; j++) {
                if (Math.random() > this.rate) {
                    result[i][j] = 0
                } else {
                    result[i][j] = input.data[i][j]
                }
            }
        }
        return Matrix.fromArray(result)
    }
    applyFor3DInput(input) {
        let result = []
        for (let i = 0; i < input.length; i++) {
            result[i] = []
            for (let j = 0; j < input[0].rows; j++) {
                result[i][j] = []
                for (let k = 0; k < input[0].cols; k++) {
                    if (Math.random() > this.rate) {
                        result[i][j][k] = 0
                    } else {
                        result[i][j][k] = input[i].data[j][k]
                    }
                }
            }
            result[i] = Matrix.fromArray(result[i])
        }
        return result
    }
}

class NeuralNet {
    constructor(object) {
        this.layers = []
        this.layerOutputs = []
        this.learningRate = 0.1
        this.lossFunction
        this.trainableLayers = []
        this.neuronError
        this.iteration = 0


        if(object instanceof NeuralNet || object instanceof Object){
            this.learningRate = object.learningRate
            this.loss = object.loss
            this.lossFunction = NeuralNet.lossHandler(this.loss)
            for(let i = 0; i < object.layers.length; i++){
                this.addLayer(Layer.typeHandler(object.layers[i]))
            }

        }
    }
    static lossHandler(string) {
        switch (string) {
            case 'meanSquaredError':
                return meanSquaredError
            case 'crossEntropy':
                return crossEntropy
            default:
                return meanSquaredError
        }
    }
    setLearningRate(learningRate) {
        this.learningRate = learningRate
    }
    setLossFunction(lossFunction) {
        this.loss = lossFunction
        this.lossFunction = NeuralNet.lossHandler(this.loss)
    }
    addLayer(object) {
        if (object.inputShape == undefined) {
            object.inputShape = this.layers[this.layers.length - 1].outputShape
            object.resize(object)
        }
        if (object.isTrainable == true) {
            this.trainableLayers.push(object)
        }
        this.layers.push(object)
    }
    predict(input) {
        this.layerOutputs = null
        this.layerOutputs = []
        let output = input
        for (let i = 0; i < this.layers.length; i++) {
            this.layerOutputs.push(output)

            output = this.layers[i].apply(output)
        }
        // this.layerOutputs doesn't need to include the last output
        this.layerOutputs.push(output)
        return output
    }
    train(input, target) {
        let output = this.predict(input)
        let targets = target
        // console.log(output.data);

        // The error of the neurons of the last layer 

        if (this.iteration == 0) {
            // console.log('k');

            this.neuronError = this.lossFunction.dfunc(output, targets)
        }
        else {
            // console.log("i");
            
            this.neuronError.add(this.lossFunction.dfunc(output, targets))
        }
        let neuronErrors = this.neuronError
        // console.table(neuronErrors.data);
        
        this.iteration++
        // let neuronErrors = this.lossFunction.dfunc(output, targets)
        // console.log(neuronErrors);

        // Loss function derivative * derivative of the last layer activation function
        if (this.iteration == 1) {
            // console.log('h');
            
            this.iteration = 0
            for (let i = this.layers.length - 1; i >= 0; i--) {
                // console.log(neuronErrors);

                neuronErrors = this.layers[i].backprop(
                    neuronErrors,
                    output,
                    this.layerOutputs[i],
                    this.learningRate
                )
                output = this.layerOutputs[i]
            }
        }
    }
    serialize() {
        return JSON.stringify(this)
    }
}
