class Layer {
    constructor() {
        this.isTrainable
        this.type
    }
    static typeHandler(object) {
        switch (object.type) {
            case 'dense':
                return Layer.dense(object)
            case 'conv':
                return Layer.conv(object)
            case 'maxpooling':
                return Layer.maxPooling(object)
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
    static conv(object) {
        return new ConvClass(object)
    }
    static maxPooling(object) {
        return new MaxPoolingClass(object)

    }
    static flatten(object) {
        return new FlattenCLass(object)
    }
    static dropout(object) {
        return new DropoutClass(object)
    }
    static activation(string) {
        switch (string) {
            case 'sigmoid':
                return new Activation(sigmoid)
            case 'relu':
                return new Activation(relu)
            case 'binaryStep':
                return new Activation(binayStep)
            case 'tanh':
                return new Activation(tanh)
            case 'softmax':
                return new Activation(softmax)

            default:
                break;
        }
    }
    serialize(){
        return JSON.stringify(this)
    }
    static deserialize(object){
        switch (object.type) {
            case 'activation':
                return Layer.activation(object.name)
            default:
                return Layer.typeHandler(object)
        }
    }
}
class Loss {
    constructor(object) {
        this.fn = object.fn
        this.fnPrime = object.fnPrime
        this.type = object.type
    }
    static handler(string) {
        switch (string) {
            case 'mse':
                return meanSquaredError
            case 'crossEntropy':
                return crossEntropy
            case 'softmaxCrossEntropy':
                return softmaxCrossEntropy
            case 'binaryCrossEntropy':
                return binaryCrossEntropy
            default:
                break;
        }
    }
    serialize(){
        return JSON.stringify(this)
    }
}
const meanSquaredError = new Loss({
    fn: (output, target) => Tensor.sqdVxV(target, output).meanVector(),
    fnPrime: (output, target) => Tensor.subVxV(output, target).multVxS(2).divVxS(output.size()),
    type: 'loss',
    name: 'mse'
})
const crossEntropy = new Loss({
    fn:(output, target) => -Tensor.multVxV(target, Tensor.log(output)).sum(),
    fnPrime: (output, target) => Tensor.multVxV(target, Tensor.divNoNanSxT(-1, output)),
    type: 'loss',
    name: 'crossEntropy'
})
const softmaxCrossEntropy = new Loss({
    fn: (output, target) => {
        let trick = Tensor.subTxS(output, output.max())
        let activation = Tensor.divVxS(Tensor.exp(trick), Tensor.sumExp(trick))
        return -Tensor.multVxV(target, Tensor.log(activation)).sum()
    },
    fnPrime: (output, target) => {
        // console.log(output);
        
        let trick = Tensor.subTxS(output, output.max())
        // console.log(trick);
        
        let activation = Tensor.divNoNanVxS(Tensor.exp(trick), Tensor.sumExp(trick))
        let result = Tensor.subVxV(activation, target)
        // console.log(result);
        
        return result.constrainValues(-1e20, 1e20)
    },
    type: 'loss',
    name: 'softmaxCrossEntropy'
})
const binaryCrossEntropy = new Loss({
    fn: (output, target) => {
        let first = Tensor.multVxV(target, Tensor.log(output))
        let second = Tensor.subSxT(1, target)
        let third = Tensor.log(Tensor.subSxT(1, output))
        let result = Tensor.addVxV(first, Tensor.multVxV(second, third))
        return -result.meanVector()
    },
    fnPrime: (output, target) => {
        let first = Tensor.divNoNanVxV(Tensor.subSxT(1, target), Tensor.subSxT(1, output))
        let second = Tensor.divNoNanVxV(target, output)
        let result = Tensor.subVxV(first, second)
        return Tensor.divNoNanVxS(result, result.size())
    },
    type: 'loss',
    name: 'binaryCrossEntropy'
})

class Activation {
    constructor(object) {
        this.type = object.type
        this.name = object.name
        this.fn = object.fn
        this.fnPrime = object.fnPrime
        this.updateError = object.updateError
        this.parameters = 0
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = object.inputShape
        this.outputShape = this.inputShape
    }
    forward(input) {
        this.input = input.constrainValues(-1e20, 1e20)
        this.forwardedInput = this.fn(input).constrainValues(-1e20, 1e20)
        return this.forwardedInput
    }
    backward(outputGradient) {
        return this.updateError(outputGradient, this.fnPrime(this.forwardedInput))
    }
    serialize(){
        return JSON.stringify(this)
    }
    static deserialize(object){
        let newActLayer = Layer.activation(object.name)

        newActLayer.inputShape = object.inputShape
        newActLayer.outputShape = newActLayer.inputShape

        newActLayer.input = object.input
        newActLayer.forwardedInput = object.forwardedInput

        return newActLayer
    }
}
const sigmoid = new Activation({
    fn: tensor => Tensor.map(tensor, x => 1 / (1 + Math.exp(-x))),
    fnPrime: tensor => Tensor.map(tensor, x => x * (1 - x)),
    updateError: (tensor, fnDeriv) => Tensor.mult(tensor, fnDeriv),
    type: 'activation',
    name: 'sigmoid'
})
const relu = new Activation({
    fn: tensor => Tensor.map(tensor, x => Math.max(0, x)),
    fnPrime: tensor => Tensor.map(tensor, x => x > 0 ? 1 : 0),
    updateError: (tensor, fnDeriv) => Tensor.mult(tensor, fnDeriv),
    type: 'activation',
    name: 'relu'
})
const binayStep = new Activation({
    fn: tensor => Tensor.map(tensor, x => x > 0 ? 1 : 0),
    fnPrime: tensor => Tensor.map(tensor, () => 0),
    updateError: (tensor, fnDeriv) => Tensor.mult(tensor, fnDeriv),
    type: 'activation',
    name: 'binaryStep'
})
const tanh = new Activation({
    fn: tensor => Tensor.map(tensor, x => Math.tanh(x)),
    fnPrime: tensor => Tensor.map(tensor, x => 1 - x ** 2),
    updateError: (tensor, fnDeriv) => Tensor.mult(tensor, fnDeriv),
    type: 'activation',
    name: 'tanh'
})
const softmax = new Activation({
    fn: tensor =>{
        let trick = Tensor.subTxS(tensor, tensor.max())
        return Tensor.divVxS(Tensor.exp(trick), Tensor.sumExp(trick)).constrainValues(-1e20, 1e20)
    },
    fnPrime: tensor => {
        let result = []
        for (let i = 0; i < tensor.shape[0]; i++) {
            result[i] = []
            for (let j = 0; j < tensor.shape[0]; j++) {
                if (i == j) {
                    result[i][j] = tensor.data[i] * (1 - tensor.data[i])
                } else {
                    result[i][j] = -tensor.data[i] * tensor.data[j]
                }
            }
        }
        return new Tensor(result, [tensor.shape[0], tensor.shape[0]]).constrainValues(-1e20, 1e20)
    },
    updateError: (tensor, fnDeriv) => Tensor.dotMxV(fnDeriv, tensor).constrainValues(-1e20, 1e20),
    type: 'activation',
    name: 'softmax'
})

class DenseClass {
    constructor(object) {
        this.type = 'dense'
        this.isTrainable = true
        this.input = object.input
        this.units = Math.floor(object.units)
        this.outputShape = this.units
        this.weightRandom = object.weightRandom
        this.biasRandom = object.biasRandom
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = Math.floor(object.inputShape)
        if (object.weight !== undefined) {
            this.weight = Tensor.fromObject(object.weight)
            this.bias = Tensor.fromObject(object.bias)
        } else {
            this.weight = Tensor.random([this.units, this.inputShape], this.weightRandom)
            this.bias = Tensor.random([this.units], this.biasRandom)
        }
        this.parameters = this.weight.size()
        this.parameters += this.bias.size()
    }
    forward(input) {
        this.input = input
        return Tensor.dotMxV(this.weight, input).addVxV(this.bias).constrainValues(-1e20, 1e20)
    }
    backward(outputGradient, learningRate) {
        let transposedInputs = Tensor.transposeVector(this.input)

        let weightDeltas = Tensor.dotVxM(outputGradient, transposedInputs)
        weightDeltas.multMxS(learningRate)

        let biasDelta = Tensor.multVxS(outputGradient, learningRate)

        this.weight.subMxM(weightDeltas).constrainValues(-1e20, 1e20)
        this.bias.subVxV(biasDelta).constrainValues(-1e20, 1e20)
        let transposedWeights = Tensor.transposeMatrix(this.weight)
        

        return Tensor.dotMxV(transposedWeights, outputGradient).constrainValues(-1e20, 1e20)
    }
    serialize() {
        return JSON.stringify(this)
    }
}
class ConvClass {
    constructor(object) {
        this.input = object.input
        this.type = 'conv'
        this.isTrainable = true
        this.filters = Math.floor(object.filters)
        this.padding = object.padding || 'valid'
        this.kernelRandom = object.kernelRandom
        this.biasRandom = object.biasRandom
        if (typeof object.kernelSize == 'number') {
            this.kernelSize = [
                Math.floor(object.kernelSize),
                Math.floor(object.kernelSize)
            ]
        } else {
            this.kernelSize = [
                Math.floor(object.kernelSize[0]),
                Math.floor(object.kernelSize[1])
            ]
        }
        
        
        // 
        // if (typeof object.stride == 'number') {
        //     this.stride = [
        //         Math.floor(object.stride),
        //         Math.floor(object.stride)
        //     ]
        // } else if (object.stride instanceof Array) {
        //     this.stride = [
        //         Math.floor(object.stride[0]),
        //         Math.floor(object.stride[1])
        //     ]
        // } else {
        //     this.stride = [1, 1]
        // }
        // 
        // if (typeof object.dilation == 'number') {
        //     this.dilation = [
        //         Math.floor(object.dilation),
        //         Math.floor(object.dilation)
        //     ]
        // } else if (object.dilation instanceof Array) {
        //     this.dilation = [
        //         Math.floor(object.dilation[0]),
        //         Math.floor(object.dilation[1])
        //     ]
        // } else {
        //     this.dilation = [1, 1]
        // }
        this.stride = [1, 1]
        this.dilation = [1, 1]
        // TODO: CALCULATE PADDING FOR BACKPROP WITH STRIDE AND DILATION !== 1 
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = [
            Math.floor(object.inputShape[0]),
            Math.floor(object.inputShape[1]),
            Math.floor(object.inputShape[2]),
        ]
        this.kernelShape = [this.filters, this.inputShape[0], this.kernelSize[0], this.kernelSize[1]]

        if (this.padding == 'valid') {
            this.kernelGradientPadding = 'valid'
            this.inputGradientPadding = 'full'
        } else if (this.padding == 'same') {

            this.kernelGradientPadding = [
                this.kernelSize[0] - 1,
                this.kernelSize[1] - 1
            ]
            this.inputGradientPadding = 'same'
        }
        this.paddingAmount = Tensor.paddingAmount(this.inputShape, this.kernelShape, this.padding, this.stride, this.dilation)
        this.outputShape = Tensor.correlateVolumeOutputShape(this.inputShape, this.kernelShape, this.paddingAmount, this.stride, this.dilation)


        if (object.kernels !== undefined) {
            this.kernels = Tensor.fromObject(object.kernels)
            this.bias = Tensor.fromObject(object.bias)
        } else {
            this.kernels = Tensor.random(this.kernelShape, this.kernelRandom)
            this.bias = Tensor.random(this.outputShape, this.biasRandom)
        }
        this.parameters = this.kernels.size()
        this.parameters += this.bias.size()
    }
    forward(input) {
        this.input = input.copy()
        let output = Tensor.correlateVolumeAddBias(input, this.kernels, this.bias, this.padding, this.stride, this.dilation)
        return new Tensor(output, this.outputShape).constrainValues(-1e20, 1e20)
    }
    backward(outputGradient, learningRate) {
        let kernelsGradient = []
        let inputGradient = Tensor.fromShape(this.inputShape)
        
        for (let i = 0; i < this.kernelShape[0]; i++) {
            kernelsGradient[i] = []
            for (let j = 0; j < this.kernelShape[1]; j++) {
                kernelsGradient[i][j] = Tensor.correlate(this.input.data[j], outputGradient.data[i], this.kernelGradientPadding)
                let currentConvolution = Tensor.convolution(outputGradient.data[i], this.kernels.data[i][j], this.inputGradientPadding)
                inputGradient.data[j] = Tensor.addMatrixArray(inputGradient.data[j], currentConvolution)
            }
        }
        kernelsGradient = new Tensor(kernelsGradient, this.kernelShape)
        kernelsGradient.multTxS(learningRate)

        this.kernels.sub(kernelsGradient).constrainValues(-1e20, 1e20)

        this.bias.sub(Tensor.multTxS(outputGradient, learningRate)).constrainValues(-1e20, 1e20)

        return inputGradient
    }
    serialize() {
        return JSON.stringify(this)
    }
}
class MaxPoolingClass {
    constructor(object) {
        // PoolSize
        this.parameters = 0
        this.input = object.input
        this.type = 'maxpooling'
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

        // Stride
        if (object.stride == undefined) {
            this.stride = [
                this.poolSize[0],
                this.poolSize[1]
            ]
        } else if (typeof object.stride == 'number') {
            let num = Math.max(object.stride, 1)
            this.stride = [num, num]
        }
        else {
            this.stride = [
                Math.max(object.stride[0], 1),
                Math.max(object.stride[1], 1)
            ]
        }
        this.stride = [
            Math.floor(this.stride[0]),
            Math.floor(this.stride[1])
        ]
        this.padding = object.padding || false
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = object.inputShape        
        this.padding = Tensor.mpPaddingAmount(this.inputShape, this.padding, this.poolSize, this.stride)
        this.outputShape = Tensor.mpVolumeOutputShape(this.inputShape, this.padding, this.poolSize, this.stride)
        if (object.coords !== undefined) {
            this.coords = object.coords
        } else {
            this.coords = []
        }
    }
    forward(input) {
        this.input = input.copy()
        let result = Tensor.maxPoolingVolume(input, this.padding, this.poolSize, this.stride)
        this.coords = result[1]
        return new Tensor(result[0], this.outputShape)
    }
    backward(outputGradient) {        
        let result = Tensor.fromShape(this.inputShape)
        for (let i = 0; i < this.coords.length; i++) {
            result.data[this.coords[i][0]][this.coords[i][1]][this.coords[i][2]] =
                outputGradient.data[this.coords[i][0]][this.coords[i][3]][this.coords[i][4]]
        }
        return result
    }
    serialize() {
        return JSON.stringify(this)
    }
}
class FlattenCLass {
    constructor(object) {
        this.parameters = 0
        this.type = 'flatten'
        if (object !== undefined) {
            this.input = object.input
            this.resize(object)
        }
    }
    resize(object) {
        if (object.inputShape !== undefined) {
            this.inputShape = object.inputShape
            this.outputShape = 1
            for (let i = 0; i < this.inputShape.length; i++) {
                this.outputShape *= this.inputShape[i]
            }
        }
    }
    forward(input) {
        this.input = input
        let result = []
        for (let depth = 0; depth < this.inputShape[0]; depth++) {
            for (let row = 0; row < this.inputShape[1]; row++) {
                for (let col = 0; col < this.inputShape[2]; col++) {
                    result.push(input.data[depth][row][col])
                }
            }
        }
        return new Tensor(result, [this.outputShape])
    }
    backward(outputGradient) {
        let result = []
        let element = 0
        for (let depth = 0; depth < this.inputShape[0]; depth++) {
            result[depth] = []
            for (let row = 0; row < this.inputShape[1]; row++) {
                result[depth][row] = []
                for (let col = 0; col < this.inputShape[2]; col++) {
                    result[depth][row][col] = outputGradient.data[element]
                    element++
                }
            }
        }
        return new Tensor(result, this.inputShape)
    }
    serialize() {
        return JSON.stringify(this)
    }
}
class DropoutClass {
    constructor(object) {
        this.parameters = 0
        this.input = object.input
        this.type = 'dropout'
        this.rate = object.rate
        if (object.inputShape !== undefined) {
            this.resize(object)
        }
    }
    resize(object) {
        this.inputShape = object.inputShape
        this.outputShape = this.inputShape
    }
    forward(input) {
        this.input = input
        let result = []
        Tensor.accesLastArray(input.data, result, (array, resultArray) => {
            for (let index = 0; index < array.length; index++) {
                resultArray[index] = Math.random() < this.rate ? 0 : array[index]
            }
        })
        return new Tensor(result, this.outputShape)
    }
    backward(outputGradient) {
        return outputGradient
    }
    serialize() {
        return JSON.stringify(this)
    }
}
class NeuralNet {
    constructor(object) {
        this.layers = []
        if (object !== undefined) {
            this.numLayers = 0
            this.error = object.error
            this.setLearningRate(object.learningRate)
            this.setLossFunction(object.loss)
            for (let index = 0; index < object.numLayers; index++) {
                this.addLayer(Layer.deserialize(object.layers[index]))
            }
        } else {
            this.parameters = 0
            this.learningRate = 0.1
            this.numLayers = 0
            this.error = 0
        }
    }
    setLearningRate(learningRate) {
        this.learningRate = learningRate
    }
    setLossFunction(lossFunction) {
        this.loss = lossFunction
        this.lossFunction = Loss.handler(this.loss)
    }
    addLayer(layer) {
        if (layer.inputShape == undefined) {
            layer.inputShape = this.layers[this.numLayers - 1].outputShape
            layer.resize(layer)
        }
        this.layers.push(layer)
        this.parameters += layer.parameters
        this.numLayers++
    }
    predict(input) {
        let output = input
        for (let i = 0; i < this.numLayers; i++) {
            output = this.layers[i].forward(output)
        }
        
        return output
    }
    train(input, target) {
        let output = this.predict(input)

        this.error = this.lossFunction.fn(output, target)
        let neuronErrors = this.lossFunction.fnPrime(output, target)
        // console.log(neuronErrors);
        

        for (let i = this.numLayers - 1; i >= 0; i--) {
            neuronErrors = this.layers[i].backward(neuronErrors, this.learningRate)
        }
    }
    serialize() {
        return JSON.stringify(this)
    }
    static deserialize(serialized) {
        if(typeof serialized == 'string'){
            return new NeuralNet(JSON.parse(serialized))
        } else {
            return new NeuralNet(serialized)
        }
    }
} 