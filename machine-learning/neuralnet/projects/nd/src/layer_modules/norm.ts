import { TrainableLayer } from "./layer.js";
import { Tensor } from "../tensor_modules/tensor.js";
import { sub, add, divNoNan, mult } from "../tensor_modules/arithmetic.js";
import { varianceSquared } from "../tensor_modules/basic_math.js";
import { TensorObject } from "../types.js";
import * as initializer from "../initializer_modules/initializers.js";
import * as activation from "../activations_modules/activations.js";
export interface NormLike {
    inputShape?: number | number[]; weights?: TensorObject; bias?: TensorObject; kernelInitializer?: string | initializer.Initializer; biasInitializer?: string | initializer.Initializer; activation?: string
}
export class NormClass extends TrainableLayer {
    inputShape: number | number[]; internInputShape: number[]; norm: Tensor; xmu: Tensor; variance: number; outputShape: number | number[]; kernelInitializer: initializer.Initializer; biasInitializer: initializer.Initializer
    constructor(object: NormLike = {}) {
        super()

        this.type = 'norm'
        this.isTrainable = true
        this.inputShape = 1
        if (object.inputShape instanceof Array) this.inputShape = object.inputShape.slice().map(x => Math.floor(x))
        if (typeof object.inputShape == 'number') this.inputShape = Math.floor(object.inputShape)
        this.outputShape = this.inputShape
        this.internInputShape = this.inputShape instanceof Array ? this.inputShape.slice().map(x => Math.floor(x)) : [Math.floor(this.inputShape)]
        this.kernelInitializer = initializer.ones()
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
        // weights = gamma
        this.weights = this.kernelInitializer.apply(this.internInputShape)
        // bias = beta
        this.bias = this.biasInitializer.apply(this.internInputShape)
        this.reshapeOptimizerParameters()
        this.norm = new Tensor([])
        this.xmu = new Tensor([])
        this.variance = 0
        this.activation = 'linear'
        if (typeof object.activation == 'string') {
            this.activation = object.activation
            this.activationFunction = activation.handler(this.activation)
        }
        if (object.weights !== undefined) {
            this.setParameters(object)
        }
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape instanceof Array ? inputShape.slice().map(x => Math.floor(x)) : Math.floor(inputShape)
        this.outputShape = this.inputShape
        this.internInputShape = inputShape instanceof Array ? inputShape.slice().map(x => Math.floor(x)) : [Math.floor(inputShape)]
        // weights = gamma
        this.weights = this.kernelInitializer.apply(this.internInputShape)
        // bias = beta
        this.bias = this.biasInitializer.apply(this.internInputShape)
        this.reshapeOptimizerParameters()
        this.parameters = this.weights.size() + this.bias.size()
    }
    forward(input: Tensor) {
        this.input = input
        this.xmu = sub(this.input, this.input.mean())
        this.variance = varianceSquared(this.input) + 1e-7
        this.norm = divNoNan(this.xmu, this.variance ** 0.5)
        let output = mult(this.weights, this.norm).add(this.bias)
        this.output = this.activationFunction.fn(output)
        return this.output
    }
    // backward(outputGradient: Tensor, batchSize?: number) {
    //     let gammaGradient = mult(outputGradient, this.norm)

    //     this.weightsGradient.add(gammaGradient)
    //     this.biasGradient.add(outputGradient)

    //     // Inputs gradient
    //     let var_inv = 1 / this.variance ** 0.5
    //     let inputGradient = mult(outputGradient, this.weights)
    //     let varianceGradient = mult(inputGradient, this.xmu).mult(-0.5).mult(this.variance ** (-3 / 2))

    //     let muGradient = mult(inputGradient, -var_inv).add(mult(varianceGradient, divNoNan(1 , mult(this.xmu, -2))))

    //     inputGradient = mult(inputGradient, var_inv).add(add(muGradient, divNoNan(mult(varianceGradient, 2 ), this.xmu)))

    //     return inputGradient
    // }
    backward(outputGradient: Tensor, batchSize: number) {
        let internOutputGradient = this.activationFunction.updateError(outputGradient, this.activationFunction.fnPrime(this.output))

        let gammaGradient = mult(internOutputGradient, this.norm)

        this.weightsGradient.add(gammaGradient)
        this.biasGradient.add(internOutputGradient)

        // Inputs gradient
        let var_inv = 1 / this.variance ** 0.5
        let inputGradient = mult(internOutputGradient, this.weights)
        let varianceGradient = mult(inputGradient, this.xmu).mult(-0.5).mult(this.variance ** (-3 / 2))

        let muGradient = mult(inputGradient, -var_inv).add(mult(varianceGradient, divNoNan(1 / batchSize, mult(this.xmu, -2))))

        inputGradient = mult(inputGradient, var_inv).add(add(divNoNan(muGradient, batchSize), divNoNan(mult(varianceGradient, 2 / batchSize), this.xmu)))

        return inputGradient
    }
}