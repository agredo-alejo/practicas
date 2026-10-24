class Layer {
    constructor() {

    }
    static ActivationFunction = class {
        constructor(func, dfunc, apply) {
            this.func = func
            this.dfunc = dfunc
            this.apply = apply
        }
    }
    static binaystep = new Layer.ActivationFunction(
        x => x > 0 ? 1 : 0,
        y => 0,
        z => z.map(x => x > 0 ? 1 : 0)
    )
    static sigmoid = new Layer.ActivationFunction(
        x => 1 / (1 + Math.exp(-x)),
        y => y * (1 - y),
        z => z.map(x => 1 / (1 + Math.exp(-x)))
    )

    static tanh = new Layer.ActivationFunction(
        x => Math.tanh(x),
        y => 1 - (y * y),
        z => z.map(x => Math.tanh(x))
    )
    static softplus = new Layer.ActivationFunction(
        x => Math.log(1 + Math.exp(x)),
        y => 1 / (1 + Math.exp(-y)),
        z => z.map(x => Math.log(1 + Math.exp(x)))
    )
    static relu = new Layer.ActivationFunction(
        x => Math.max(0, x),
        y => y > 0 ? 1 : 0,
        z => z.map(x => Math.max(0, x))
    )
    static leakyrelu = new Layer.ActivationFunction(
        x => Math.max(0.05 * x, x),
        y => y > 0 ? 1 : 0.05,
        z => z.map(x => Math.max(0.05 * x, x))
    )
    static elu = new Layer.ActivationFunction(
        x => x > 0 ? x : 0.05 * (Math.exp(x) - 1),
        y => y > 0 ? 1 : 0.05 + y,
        z => z.map(x => x > 0 ? x : 0.05 * (Math.exp(x) - 1))
    )
    static softmax = new Layer.ActivationFunction(
        1, 2,
        z => {
            let result = []
            let sumatoria = 0
            for (let i = 0; i < z.rows; i++) {
                sumatoria += Math.exp(z.data[i][0])
            }
            for (let i = 0; i < z.rows; i++) {
                result[i] = []
                result[i][0] = Math.exp(z.data[i][0]) / sumatoria
            }
            z.data = result
        }
    )
    static linear = new Layer.ActivationFunction(
        x => x,
        () => 1,
        z => z
    )
    static ActivationHandler(activation) {
        switch (activation) {
            case 'sigmoid':
                return Layer.sigmoid
            case 'tanh':
                return Layer.tanh
            case 'softplus':
                return Layer.softplus
            case 'relu':
                return Layer.relu
            case 'leakyrelu':
                return Layer.leakyrelu
            case 'elu':
                return Layer.elu
            case 'softmax':
                return Layer.softmax    
            case 'linear':
                return Layer.linear
            default:
                return Layer.linear
        }
    }
    static dense(object) {
        return new Layer.denseClass(object)
    }
    static denseClass = class {
        constructor(object) {
            this.inputShape = object.inputShape
            this.units = object.units
            this.outputShape = object.units
            this.isTrainable = true

            if (object.activation !== undefined) {
                this.activationFunction = object.activation
            } else {
                this.activationFunction = 'linear'
            }
            this.activation = Layer.ActivationHandler(this.activationFunction)

            if (object.inputShape !== undefined) {
                this.inputShape = object.inputShape
                this.resize()
            }
        }
        apply(input) {
            let output = Matrix.mult(this.weight, input)
            output.add(this.bias)
            this.activation.apply(output)
            return output
        }
        resize() {
            this.weight = new Matrix(this.units, this.inputShape)
            this.weight.randomize()

            this.bias = new Matrix(this.units, 1)
            this.bias.randomize()
        }
        backprop(output, neuronErrors, learningRate, lastLayerOutput){
            let actFuncDerivative = this.activation.dfunc(output)
            neuronErrors.multiply(actFuncDerivative)

            let gradient = Matrix.multiply(neuronErrors, learningRate)

            output = lastLayerOutput

            let lastLayerTransposed = Matrix.transpose(lastLayerOutput)
            let weightDeltas = Matrix.mult(gradient, lastLayerTransposed)

            this.weight.sub(weightDeltas)
            this.bias.sub(gradient)

            let transposedWeights = Matrix.transpose(this.weight)
            neuronError = Matrix.mult(transposedWeights, neuronError)
            return neuronError
        }
    }

    static conv2d(object) {
        return new Layer.conv2dClass(object)
    }
    static conv2dClass = class extends Layer {
        constructor(object) {
            super()
            this.activationFunction = object.activation
            this.activation = Layer.ActivationHandler(object.activation)
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

            this.dilationAdded = [
                this.dilation[0] - 1,
                this.dilation[1] - 1,
            ]

            // KernelSize
            if (typeof object.kernelSize == 'number') {
                this.kernelSize = [object.kernelSize, object.kernelSize]
            } else {
                this.kernelSize = object.kernelSize
            }

            this.filters = object.filters
            this.padding = object.padding
            if (object.inputShape !== undefined) {
                this.inputShape = object.inputShape
                this.resize(object)
            }
        }
        resize(object) {
            this.amountOfPadding(object.padding)

            // Filters creation
            let maxRangue = 1
            let minRangue = -1

            this.kernels = []
            for (let i = 0; i < this.filters; i++) {
                this.kernels[i] = []
                for (let j = 0; j < this.inputShape[2]; j++) {
                    this.kernels[i][j] = Array(this.kernelSize[0]).fill().map(() => Array(this.kernelSize[1]).fill().map(() => Math.random() * (maxRangue - minRangue) + minRangue))
                }
            }

            this.outputShape = [
                (this.inputShape[0] + this.padWidth - this.dilation[0] * (this.kernelSize[0] - 1) - 1) / this.strides[0] + 1,
                (this.inputShape[1] + this.padHeight - this.dilation[1] * (this.kernelSize[1] - 1) - 1) / this.strides[1] + 1,
                object.filters
            ]
            this.outputShape = [
                Math.max(this.outputShape[0], 1),
                Math.max(this.outputShape[1], 1),
                this.filters
            ]
        }
        amountOfPadding(string) {
            if (string == 'same') {
                this.padWidth = this.dilation[0] * (this.kernelSize[0] - 1) + (this.inputShape[0] - 1) * (this.strides[0] - 1)
                this.padHeight = this.dilation[1] * (this.kernelSize[1] - 1) + (this.inputShape[1] - 1) * (this.strides[1] - 1)

                this.padTop = Math.floor(this.padHeight / 2)
                this.padBottom = this.padHeight - this.padTop

                this.padLeft = Math.floor(this.padWidth / 2)
                this.padRight = this.padWidth - this.padLeft

                this.internPadding = [this.padTop, this.padBottom, this.padLeft, this.padRight]
                this.applyPadding = true
            } else {
                this.applyPadding = false, this.padWidth = 0, this.padHeight = 0, this.padTop = 0, this.padBottom = 0, this.padLeft = 0, this.padRight = 0, this.internPadding = [0, 0, 0, 0]
            }
        }
        apply(input) {
            let internImagenes = []
            if (this.applyPadding) {
                for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
                    internImagenes[imgInChannel] = this.paddingOperation(input[imgInChannel])
                }
            } else {
                internImagenes = input
            }
            let imagenesResultantes = []


            for (let numFilters = 0; numFilters < this.kernels.length; numFilters++) {
                imagenesResultantes[numFilters] = Array(this.outputShape[0]).fill().map(() => Array(this.outputShape[1]).fill(0))

                for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {

                    for (let imgRow = 0; imgRow < this.outputShape[0]; imgRow++) {
                        for (let imgCol = 0; imgCol < this.outputShape[1]; imgCol++) {
                            let sumatoria = 0
                            for (let kernelRow = 0; kernelRow < this.kernelSize[0]; kernelRow++) {
                                for (let kernelCol = 0; kernelCol < this.kernelSize[1]; kernelCol++) {

                                    let row = kernelRow * this.dilation + imgRow * this.strides[0],
                                        col = kernelCol * this.dilation + imgCol * this.strides[1]
                                    sumatoria += internImagenes[imgInChannel][row][col] * this.kernels[numFilters][imgInChannel][kernelRow][kernelCol]
                                }
                            }
                            // sumatoria /= (this.kernelSize[0] * this.kernelSize[1])
                            imagenesResultantes[numFilters][imgRow][imgCol] += this.activation.func(sumatoria)
                        }
                    }
                }
            }
            return imagenesResultantes
        }
    }
    static maxPooling2d(object) {
        return new Layer.maxPooling2dClass(object)

    } 
    static maxPooling2dClass = class extends Layer {
        constructor(object) {
            super()
            // PoolSize
            if (object.poolSize == undefined) {
                this.poolSize = [2, 2]
            }
            else if (typeof object.poolSize == 'number') {
                this.poolSize = [object.poolSize, object.poolSize]
            } else {
                this.poolSize = [
                    Math.max(object.poolSize[0], 1),
                    Math.max(object.poolSize[1], 1)
                ]
            }

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
            this.padding = object.padding
            if (object.inputShape !== undefined) {
                this.inputShape = object.inputShape
                this.resize(object)
            }

        }
        resize(object) {
            this.amountOfPadding(object.padding)
        }
        amountOfPadding(string) {
            if (string == 'full') {
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
            } else {
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
            let internImagenes = []
            if (this.applyPadding) {
                for (let imgInChannel = 0; imgInChannel < this.inputShape[2]; imgInChannel++) {
                    internImagenes[imgInChannel] = this.paddingOperation(input[imgInChannel])
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
                        for (let kernelRow = 0; kernelRow < this.poolSize[0]; kernelRow++) {
                            for (let kernelCol = 0; kernelCol < this.poolSize[1]; kernelCol++) {
                                let row = kernelRow + imgRow * this.strides[0],
                                    col = kernelCol + imgCol * this.strides[1]
                                record = Math.max(internImagenes[imgInChannel][row][col], record)
                            }
                        }

                        imagenesResultantes[imgInChannel][imgRow][imgCol] = record
                    }
                }
            }
            return imagenesResultantes
        }
    }
    static flatten(object) {
        return new Layer.flattenCLass(object)
    }
    static flattenCLass = class {
        constructor(object) {
            if (object != undefined) {
                this.resize(object)
            }
        }
        resize(object) {
            this.inputShape = object.inputShape

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
                        result.push(input[imgInChannel][imgRow][imgCol])
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
            }
            return matrixNeuronErrors

        }
    }
    paddingOperation(imagen) {
        let imagenResultante = []
        for (let i = 0; i < imagen.length; i++) {
            imagenResultante[i] = imagen[i].slice()
            for (let j = 0; j < this.internPadding[0]; j++) {
                imagenResultante[i].unshift(0)
            }
            for (let j = 0; j < this.internPadding[1]; j++) {
                imagenResultante[i].push(0)
            }
        }
        for (let i = 0; i < this.internPadding[2]; i++) {
            imagenResultante.unshift(new Array(imagenResultante[0].length).fill(0))
        }
        for (let i = 0; i < this.internPadding[3]; i++) {
            imagenResultante.push(new Array(imagenResultante[0].length).fill(0))
        }
        return imagenResultante
    }

}

