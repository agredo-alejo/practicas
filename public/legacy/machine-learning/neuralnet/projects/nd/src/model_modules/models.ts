import * as loss from "../losses_modules/losses.js"
import { Tensor } from "../tensor_modules/tensor.js";
import { TensorLike, TrainableLayers, LayerClasses } from "../types.js";
import { ensureTensor, shuffleMatch } from "../tensor_modules/t_utils.js";
import * as optimizers from "../optimizers_modules/optimizers.js";
import { DenseClass } from "../layer_modules/dense.js";
import { ConvClass } from "../layer_modules/conv.js";
import * as layer from "../layer_modules/layer_utils.js";
import { NormClass } from "../layer_modules/norm.js";

// interface NeuralNetLike {
//     layers: LayerClasses[]; numLayers: number; trainableLayers: TrainableLayers[]; error: number; loss: string; lossFunction: Loss; optimizer: Optimizer; parameters: number; batch: number; trainDataSize: number; batchSize: number
// }
interface CompileLike {
    loss: string | loss.Loss; optimizer: optimizers.Optimizer; trainDataSize?: number; batchSize?: number
}

export class NeuralNet {
    layers: LayerClasses[]; numLayers: number; trainableLayers: TrainableLayers[]; error: number; loss: string; lossFunction: loss.Loss; optimizer: optimizers.Optimizer; parameters: number; batch: number; trainDataSize: number; batchSize: number
    constructor() {
        this.trainDataSize = 0
        this.batch = 0
        this.parameters = 0
        this.layers = []
        this.numLayers = 0
        this.loss = 'mse'
        this.lossFunction = loss.handler(this.loss)
        this.trainableLayers = []
        this.error = 1
        this.optimizer = optimizers.sgd(0.1)
        this.batchSize = 0
    }
    setLossFunction(lossName: string) {
        this.loss = lossName
        this.lossFunction = loss.handler(this.loss)
    }
    compile(object: CompileLike) {
        this.optimizer = object.optimizer || optimizers.sgd(0.1)

        if (typeof object.loss == 'string') {
            this.loss = object.loss
            this.lossFunction = loss.handler(this.loss)
        } else {
            this.lossFunction = object.loss || loss.meanSquaredError
            this.loss = this.lossFunction.name
        }
    }
    add(object: LayerClasses, fromSerialized: boolean = false) {
        if (this.numLayers > 0 && fromSerialized == false) {
            let inputShape = this.layers[this.numLayers - 1].outputShape
            object.resize(inputShape)
        }
        if (object instanceof DenseClass || object instanceof ConvClass || object instanceof NormClass) {
            this.trainableLayers.push(object)
            this.parameters += object.parameters
        }
        this.layers.push(object)
        this.numLayers++
    }
    predict(input: Tensor | TensorLike) {
        let output = ensureTensor(input)
        for (let i = 0; i < this.numLayers; i++) {
            output = this.layers[i].forward(output)
        }
        return output
    }
    train(inputs: Tensor[], targets: Tensor[], args = { epochs: 1, batchSize: 1, shuffle: false, trainDataSize: 1 }) {
        let epochs = args.epochs || 1
        let shuffle = args.shuffle || false
        this.batchSize = args.batchSize || 1
        this.trainDataSize = args.trainDataSize || inputs.length
        // if (this.batchSize == 0) this.batchSize = inputs.length
        // if (this.trainDataSize == 0) this.trainDataSize = inputs.length



        for (let epoch = 0; epoch < epochs; epoch++) {
            for (let batch = 0; batch < inputs.length / this.batchSize; batch++) {
                this.error = 0
                let internInputs = inputs.slice(batch, batch + this.batchSize)
                let internTargets = targets.slice(batch, batch + this.batchSize)
                if (shuffle) {
                    shuffleMatch(internInputs, internTargets)
                }

                for (let index = 0; index < this.batchSize; index++) {
                    let output = this.predict(internInputs[index])
                    this.error += this.lossFunction.fn(output, internTargets[index])
                    let neuronErrors = this.lossFunction.fnPrime(output, internTargets[index])

                    for (let i = this.numLayers - 1; i >= 0; i--) {
                        neuronErrors = this.layers[i].backward(neuronErrors, this.batchSize)
                    }
                }
                // Update error, weights and biases for the current batch
                this.batch++
                this.error /= this.batchSize
                this.update(this.batch)
            }
            // console.log(this.error);

        }
        if (this.batch > this.trainDataSize / this.batchSize) {
            this.batch = 0
        }

    }
    update(index: number) {
        for (let i = 0; i < this.trainableLayers.length; i++) {
            this.trainableLayers[i].update(this.optimizer, this.batchSize, index)
        }
    }
    static fromObject(modelSerialized: any) {
        let newModel = new NeuralNet()
        for (let index = 0; index < modelSerialized.layers.length; index++) {
            let newLayer: LayerClasses
            if (modelSerialized.layers[index].type == 'activation') {
                newLayer = layer.activation(modelSerialized.layers[index].name)
                newModel.add(newLayer)
            } else {
                newLayer = layer.fromObject(modelSerialized.layers[index])
                newModel.add(newLayer, true)
            }
        }
        newModel.trainDataSize = modelSerialized.trainDataSize
        newModel.batch = newModel.batch

        newModel.loss = modelSerialized.loss
        newModel.lossFunction = loss.handler(newModel.loss)

        newModel.error = modelSerialized.error
        newModel.optimizer = optimizers.fromObject(modelSerialized.optimizer)
        return newModel
    }
    copy() {
        return NeuralNet.fromObject(JSON.parse(JSON.stringify(this)))
    }
    static copy(model: NeuralNet) {
        return NeuralNet.fromObject(JSON.parse(JSON.stringify(model)))
    }
    mutateRandomLayer(mutateBias: boolean = false, mutationRate: number = 0.1, mutation: number = 0.1) {
        let index = Math.floor(Math.random() * this.trainableLayers.length)
        this.trainableLayers[index].weights.forEach(x => Math.random() < mutationRate ? x + (2 * Math.random() * mutation - mutation) : x)
        if (mutateBias == false) return
        this.trainableLayers[index].bias.forEach(x => Math.random() < mutationRate ? x + (2 * Math.random() * mutation - mutation) : x)
    }
    mutate(mutateBias: boolean = false, mutationRate: number = 0.1, mutation: number = 0.5) {
        for (let index = 0; index < this.trainableLayers.length; index++) {
            this.trainableLayers[index].weights.forEach(x => Math.random() < mutationRate ? x + (2 * Math.random() * mutation - mutation) : x)
            if (mutateBias == false) continue
            this.trainableLayers[index].bias.forEach(x => Math.random() < mutationRate ? x + (2 * Math.random() * mutation - mutation) : x)
        }
    }
    serialize() {
        return JSON.stringify(this)
    }
}
