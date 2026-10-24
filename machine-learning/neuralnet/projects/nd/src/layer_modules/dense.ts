import { Tensor } from "../tensor_modules/tensor.js";
import { zeros } from "../tensor_modules/t_creation.js";
import { dot, transpose } from "../tensor_modules/matrix.js";
import { TrainableLayer } from "./layer.js";
import * as activations from "../activations_modules/activations.js"
import { TensorObject } from "../types.js";
import * as initializer from "../initializer_modules/initializers.js";
export interface DenseLike {
    units: number; inputShape?: number; kernelInitializer?: string | initializer.Initializer; biasInitializer?: string | initializer.Initializer; weightsConstrain?: number[]; biasConstrain?: number[]; activation?: string; weights?: TensorObject; bias?: TensorObject; optimizerWeights?: TensorObject[]; optimizerBias?: TensorObject[]
}
export class DenseClass extends TrainableLayer {
    units: number; outputShape: number; inputShape: number; biasInitializer: initializer.Initializer; kernelInitializer: initializer.Initializer
    constructor(object: DenseLike) {
        super()
        this.type = 'dense'
        if (typeof object.activation == 'string') {
            this.activation = object.activation
            this.activationFunction = activations.handler(this.activation)
        }

        this.isTrainable = true
        this.units = Math.floor(object.units)
        this.outputShape = this.units
        this.kernelInitializer = initializer.xavierNormal()
        if (object.kernelInitializer instanceof initializer.Initializer) {
            this.kernelInitializer = object.kernelInitializer
        } else if (typeof object.kernelInitializer == 'string') {
            this.kernelInitializer = initializer.handler(object.kernelInitializer)()
        }
        this.biasInitializer = initializer.zeros()
        if (object.biasInitializer instanceof initializer.Initializer) {
            this.biasInitializer = object.biasInitializer
        } else if (typeof object.biasInitializer == 'string') {
            this.biasInitializer = initializer.handler(object.biasInitializer)()
        }
        this.inputShape = object.inputShape ? Math.floor(object.inputShape) : 1
        this.weights = this.kernelInitializer.apply([this.units, this.inputShape])
        this.bias = this.biasInitializer.apply([this.units])
        this.weightsConstrain = object.weightsConstrain || [-1e7, 1e7]
        this.biasConstrain = object.biasConstrain || [-1e7, 1e7]

        this.weightsGradient = zeros(this.weights.shape)
        this.biasGradient = zeros(this.bias.shape)
        this.optimizerWeights = [this.weightsGradient, zeros(this.weights.shape), zeros(this.weights.shape)]
        this.optimizerBias = [this.biasGradient, zeros(this.bias.shape), zeros(this.bias.shape)]

        this.parameters = this.units * this.inputShape + this.outputShape
        if (object.weights !== undefined) {
            this.setParameters(object)
        }
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape instanceof Array ? inputShape[0] : inputShape
        this.weights = this.kernelInitializer.apply([this.units, this.inputShape])
        this.bias = this.biasInitializer.apply([this.units])

        this.reshapeOptimizerParameters()
        this.parameters = this.units * this.inputShape + this.outputShape
    }
    forward(input: Tensor) {
        this.input = input
        let output = dot(this.weights, this.input).add(this.bias)
        if (this.activation !== undefined) {
            this.output = this.activationFunction.fn(output)
            return this.output
        }
        return output
    }
    backward(outputGradient: Tensor) {
        let internOutputGradient
        if (this.activation == undefined) {
            internOutputGradient = outputGradient
        } else {
            internOutputGradient = this.activationFunction.updateError(outputGradient, this.activationFunction.fnPrime(this.output))
        }
        let transposedInputs = transpose(this.input)

        let weightsDeltas = dot(internOutputGradient, transposedInputs)
        let biasDelta = internOutputGradient

        this.weightsGradient.add(weightsDeltas)
        this.biasGradient.add(biasDelta)

        let transposedWeightss = transpose(this.weights)
        return dot(transposedWeightss, internOutputGradient)
    }

}
