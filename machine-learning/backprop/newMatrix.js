class Layer {
    constructor() {

    }
    static activationHandler(string) {
        switch (string) {
            case 'sigmoid':
                return sigmoid
            case 'leakyrelu':
                return leakyrelu
            case 'linear':
                return lineatAct

            default:
                return lineatAct
        }
    }
    static dense = class {
        constructor(object) {
            this.activation = Layer.activationHandler(object.activation)
            this.units = object.units
            this.outputShape = object.units
            if (object.inputShape !== undefined) {
                this.resize(object)
            }

        }
        resize(object) {
            this.inputShape = object.inputShape
            // this.weight = new Matrix(this.units, this.inputShape)
            // this.weight.randomize()

            // this.bias = new Matrix(this.units, 1)
            // this.bias.randomize()

            this.weight = Matrix.randomize(this.units, this.inputShape)
            this.bias = Matrix.randomize(this.units, 1)
        }
        apply(input) {
            let output = Matrix.mult(this.weight, input)
            output = Matrix.add(output, this.bias)
            return this.activation.func(output)

        }
        backprop(neuronErrors, lastLayerOutput, learningRate) {
            // Calculate the gradients
            let gradient = Matrix.multiply(neuronErrors, learningRate)

            let lastLayerTransposed = Matrix.transpose(lastLayerOutput)
            let weightDeltas = Matrix.mult(gradient, lastLayerTransposed)

            this.weight = Matrix.sub(this.weight, weightDeltas)
            this.bias = Matrix.sub(this.bias, gradient)

            // Calculate the error of the last layer neurons
            let transposedWeights = Matrix.transpose(this.weight)
            return Matrix.mult(transposedWeights, neuronErrors)
        }
    }
}
class ActFunc {
    constructor() {

    }
}
let sigmoid = new ActFunc()
// sigmoid.func = x => 1 / (1 + Math.exp(-x))
sigmoid.func = x => Matrix.map(x, y => 1 / (1 + Math.exp(-y)))
// sigmoid.dfunc = y => y * (1 - y)
sigmoid.applyFunc = z => z.map(x => 1 / (1 + Math.exp(-x)))
sigmoid.dfunc = w => Matrix.map(w, y => y * (1 - y))

let leakyrelu = new ActFunc()
// leakyrelu.func = x => Math.max(0.05 * x, x)
leakyrelu.func = x => Matrix.map(x, y => Math.max(0.05 * y, y))
leakyrelu.dfunc = x => Matrix.map(x, y => y > 0 ? 1 : 0.05)
// leakyrelu.dfunc = y => y > 0 ? 1 : 0.05
leakyrelu.applyFunc = z => z.map(x => Math.max(0.05 * x, x))
leakyrelu.applyDfunc = w => z.map(y => y > 0 ? 1 : 0.05)

let lineatAct = new ActFunc()
lineatAct.func = x => x
lineatAct.dfunc = () => 1
lineatAct.applyFunc = z => z
lineatAct.applyDfunc = w => w.map(() => 1)


class Loss {
    constructor() {

    }
}
let meanSquaredError = new Loss()
meanSquaredError.func = (output, target) => {
    let error = Matrix.sub(target, output)
    error = Matrix.map(error, x => x * x)
    return error
}
meanSquaredError.dfunc = (output, target) => {
    let result = Matrix.sub(output, target)
    result = Matrix.multiply(result, 2)
    return result
}

class NeuralNet {
    constructor() {
        this.layers = []
        this.layerOutputs = []
        this.learningRate = 0.1
        this.lossFunction
    }
    setLearningRate(learningRate) {
        this.learningRate = learningRate
    }
    setLossFunction(lossFunction) {
        this.lossFunction = lossFunction
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
        this.layerOutputs = []
        let output = input
        for (let i = 0; i < this.layers.length; i++) {
            this.layerOutputs.push(output)

            output = this.layers[i].apply(output)
        }

        this.layerOutputs.push(output)
        // this.layerOutputs doesn't need to include the last output
        return output
    }
    train(input, target) {
        let output = this.predict(input)
        let targets = target

        let lossFuncDerivative = this.lossFunction.dfunc(output, targets)
        // The error of the neurons of the last layer 
        // Loss function derivative * derivative of the last layer activation function
        let neuronErrors = lossFuncDerivative

        for (let i = this.layers.length - 1; i >= 0; i--) {

            let actFuncDerivative = this.layers[i].activation.dfunc(output)
            neuronErrors = Matrix.multiply(neuronErrors, actFuncDerivative)

            output = this.layerOutputs[i]

            neuronErrors = this.layers[i].backprop(neuronErrors, output, this.learningRate)

        }
    }

}












let training_inputs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
]
let training_outputs = [
    [0],
    [1],
    [1],
    [0]
]
for (let i = 0; i < training_inputs.length; i++) {
    training_inputs[i] = Matrix.fromArray(training_inputs[i])
}
for (let i = 0; i < training_outputs.length; i++) {
    training_outputs[i] = Matrix.fromArray(training_outputs[i])
}
let training_data = []
for (let i = 0; i < training_inputs.length; i++) {
    training_data[i] = [training_inputs[i], training_outputs[i]]
}


let model
let cols
let rows
let resolution

let inputs
addEventListener('dblclick', () => init())
function init() {
    resolution = 15
    cols = width / resolution
    rows = height / resolution

    inputs = []
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x1 = i / cols
            let x2 = j / rows
            // x1 = round(x1)
            // x2 = round(x2)
            inputs.push([x1, x2])

        }
    }
    for (let i = 0; i < inputs.length; i++) {
        inputs[i] = Matrix.fromArray(inputs[i])
    }
    model = new NeuralNet()
    model.lossFunction = meanSquaredError

    model.addLayer(new Layer.dense({
        inputShape: 2,
        units: 3,
        activation: 'sigmoid'
    }))

    model.addLayer(new Layer.dense({
        units: 1,
        activation: 'sigmoid'
    }))
    model.setLearningRate(0.3)

}
let ys = []
addEventListener('dblclick', init)
function animate() {
    clearCanvas()

    for (let i = 0; i < 10000; i++) {
        let data = random(training_data)
        model.train(data[0], data[1])
    }

    ys = []
    for (let i = 0; i < inputs.length; i++) {
        ys[i] = model.predict(inputs[i])
    }

    let index = 0
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            let color = ys[index] * 255
            // ctx.save()
            ctx.fillStyle = 'rgba(' + color + ',' + color + ',' + color + ', 1)'
            ctx.fillRect(i * resolution, j * resolution, resolution, resolution)
            // ctx.closePath()

            // fill(ys[index] * 255)
            // rect(i * resolution, j * resolution, resolution, resolution)


            index++
        }
    }
}

init()
showFps()
// setFps(1)