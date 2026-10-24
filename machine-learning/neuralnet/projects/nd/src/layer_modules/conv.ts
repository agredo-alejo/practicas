import { Tensor } from "../tensor_modules/tensor.js"
import { TensorLike4D, TensorObject } from "../types.js"
import { c_c_paddAmount, cc_manyFilters_outputShape, correlate, convolution, corr_manyFilters_addB } from "../tensor_modules/c_c_p.js";
import { zeros } from "../tensor_modules/t_creation.js";
import { add } from "../tensor_modules/arithmetic.js";
import { TrainableLayer } from "./layer.js";
import * as activations from "../activations_modules/activations.js";
import * as initializer from "../initializer_modules/initializers.js"

export interface ConvLike {
    filters: number; padding?: string; kernelInitializer?: string | initializer.Initializer; biasInitializer?: string | initializer.Initializer; kernelSize: number | number[]; inputShape?: number[]; stride?: number | number[]; dilation?: number | number[]; weightsConstrain?: number[]; biasConstrain?: number[]; activation?: string; weights?: TensorObject; bias?: TensorObject; optimizerWeights?: TensorObject[]; optimizerBias?: TensorObject[]
}
export class ConvClass extends TrainableLayer {
    filters: number; padding: string; kernelSize: number[]; inputShape: number[]; stride: number[]; dilation: number[]; kernelShape: number[]; padAmt: number[]; kernelGradientPad: string | number[]; inputGradientPad: string | number[]; outputShape: number[]; kernelInitializer: initializer.Initializer; biasInitializer: initializer.Initializer
    constructor(object: ConvLike) {
        super()
        if (typeof object.activation == 'string') {
            this.activation = object.activation
            this.activationFunction = activations.handler(this.activation)
        }
        this.type = 'conv'
        this.name = this.type
        this.isTrainable = true
        this.filters = Math.floor(object.filters)
        this.padding = object.padding || 'valid'
        if (object.weightsConstrain) this.weightsConstrain = object.weightsConstrain
        if (object.biasConstrain) this.biasConstrain = object.biasConstrain

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
        this.kernelSize = typeof object.kernelSize == 'number' ? this.kernelSize = [object.kernelSize, object.kernelSize] : [object.kernelSize[0], object.kernelSize[1]]
        this.kernelSize.map(x => Math.floor(x))

        this.stride = [1, 1]
        if (object.stride) {
            this.stride = object.stride instanceof Array ? object.stride : [object.stride, object.stride]
            this.stride.map(x => Math.floor(x))
        }

        this.dilation = [1, 1]
        if (object.dilation) {
            this.dilation = object.dilation instanceof Array ? object.dilation : [object.dilation, object.dilation]
            this.dilation.map(x => Math.floor(x))
        }

        this.kernelGradientPad = 'valid'
        this.inputGradientPad = 'full'
        if (this.padding == 'same') {
            this.kernelGradientPad = [
                this.kernelSize[0] - 1,
                this.kernelSize[1] - 1
            ]
            this.inputGradientPad = 'same'
        }
        this.inputShape = object.inputShape ? object.inputShape.slice() : [1, 1, 1]
        this.inputShape.map(x => Math.floor(x))

        this.kernelShape = [this.filters, this.inputShape[0], this.kernelSize[0], this.kernelSize[1]]
        this.padAmt = c_c_paddAmount(this.inputShape, this.kernelShape, this.padding, this.stride, this.dilation)
        this.outputShape = cc_manyFilters_outputShape(this.inputShape, this.kernelShape, this.padAmt, this.stride, this.dilation)


        this.weights = this.kernelInitializer.apply(this.kernelShape)
        this.bias = this.biasInitializer.apply(this.outputShape)

        this.weightsGradient = zeros(this.weights.shape)
        this.biasGradient = zeros(this.bias.shape)
        this.optimizerWeights = [this.weightsGradient, zeros(this.weights.shape), zeros(this.weights.shape)]
        this.optimizerBias = [this.biasGradient, zeros(this.bias.shape), zeros(this.bias.shape)]
        this.parameters = this.weights.size() + this.bias.size()
        if (object.weights !== undefined) {
            this.setParameters(object)
        }

        // TODO: CALCULATE PADDING FOR BACKPROP WITH STRIDE AND DILATION !== 1 
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape instanceof Array ? inputShape : [1, 1, 1]
        this.inputShape.map(x => Math.floor(x))

        this.kernelShape = [this.filters, this.inputShape[0], this.kernelSize[0], this.kernelSize[1]]
        this.padAmt = c_c_paddAmount(this.inputShape, this.kernelShape, this.padding, this.stride, this.dilation)
        this.outputShape = cc_manyFilters_outputShape(this.inputShape, this.kernelShape, this.padAmt, this.stride, this.dilation)

        this.weights = this.kernelInitializer.apply(this.kernelShape)
        this.bias = this.biasInitializer.apply(this.outputShape)
        this.weightsGradient = zeros(this.weights.shape)
        this.biasGradient = zeros(this.bias.shape)
        this.optimizerWeights = [this.weightsGradient, zeros(this.weights.shape), zeros(this.weights.shape)]
        this.optimizerBias = [this.biasGradient, zeros(this.bias.shape), zeros(this.bias.shape)]
        this.parameters = this.weights.size() + this.bias.size()
    }
    forward(input: Tensor) {
        this.input = input
        let output = corr_manyFilters_addB(this.input, this.weights, this.bias, this.padding, this.stride, this.dilation)
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
        let kernelsGradient: Tensor | TensorLike4D = []
        let inputGradient = zeros(this.inputShape)

        for (let i = 0; i < this.kernelShape[0]; i++) {
            kernelsGradient[i] = []
            for (let j = 0; j < this.kernelShape[1]; j++) {
                kernelsGradient[i][j] = correlate(this.input.data[j], internOutputGradient.data[i], this.kernelGradientPad).data
                let currentConvolution = convolution(internOutputGradient.data[i], this.weights.data[i][j], this.inputGradientPad)
                inputGradient.data[j] = add(inputGradient.data[j], currentConvolution).data
            }
        }

        kernelsGradient = new Tensor(kernelsGradient, this.kernelShape)
        this.weightsGradient.add(kernelsGradient)
        this.biasGradient.add(internOutputGradient)

        return inputGradient
    }
}