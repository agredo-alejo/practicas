import { TrainableLayer } from "./layer.js";
import { Tensor } from "../tensor_modules/tensor.js";
import { ones, zeros } from "../tensor_modules/t_creation.js";
import { sub, add, divNoNan, mult } from "../tensor_modules/arithmetic.js";
import {  varianceSquared, neg } from "../tensor_modules/basic_math.js";
import { TensorObject } from "../types.js";
export interface BatchNormLike {
    inputShape?: number | number[]; weights?: TensorObject; bias?: TensorObject; optimizerWeights: TensorObject[]; optimizerBias: TensorObject[]
}
export class BatchNormClass extends TrainableLayer {
    inputShape: number | number[]; internInputShape: number[]; norm: Tensor; xmu: Tensor; variance: number; outputShape: number | number[]
    constructor(object: BatchNormLike) {
        super()
        this.type = 'norm'
        this.isTrainable = true
        this.inputShape = 1
        if (object.inputShape instanceof Array) this.inputShape = object.inputShape.slice().map(x => Math.floor(x))
        if (typeof object.inputShape == 'number') this.inputShape = Math.floor(object.inputShape)
        this.outputShape = this.inputShape
        this.internInputShape = this.inputShape instanceof Array ? this.inputShape.slice().map(x => Math.floor(x)) : [Math.floor(this.inputShape)]
        this.norm = new Tensor([])
        this.xmu = new Tensor([])
        this.variance = 0
        if(object.weights !== undefined){
            this.setParameters(object)
        }
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape instanceof Array ? inputShape.slice().map(x => Math.floor(x)) : Math.floor(inputShape)
        this.outputShape = this.inputShape
        this.internInputShape = inputShape instanceof Array ? inputShape.slice().map(x => Math.floor(x)) : [Math.floor(inputShape)]
        // weights = gamma
        this.weights = ones(this.internInputShape)
        // bias = beta
        this.bias = zeros(this.internInputShape)
        this.reshapeOptimizerParameters()
        this.parameters = this.weights.size() + this.bias.size()
    }
    // self.n_X = X.shape[0]
    // self.X_shape = X.shape

    // self.X_flat = X.ravel().reshape(self.n_X, -1)
    // self.mu = np.mean(self.X_flat, axis = 0)
    // self.var = np.var(self.X_flat, axis = 0)
    // self.X_norm = (self.X_flat - self.mu) / np.sqrt(self.var + 1e-8)
    // out = self.gamma * self.X_norm + self.beta
        
    //     return out.reshape(self.X_shape)
    forwardOp(input: Tensor) {
        this.input = input
        this.xmu = sub(this.input, this.input.mean())
        this.variance = varianceSquared(this.input) + 1e-7
        this.norm = divNoNan(this.xmu, this.variance ** 0.5)
        return mult(this.weights, this.norm).add(this.bias)
    }
    // dout = dout.ravel().reshape(dout.shape[0], -1)
    // X_mu = self.X_flat - self.mu
    // var_inv = 1. / np.sqrt(self.var + 1e-8)

    // dbeta = np.sum(dout, axis = 0)
    // dgamma = dout * self.X_norm

    // dX_norm = dout * self.gamma
    // dvar = np.sum(dX_norm * X_mu, axis = 0) * -0.5 * (self.var + 1e-8) ** (-3 / 2)
    // dmu = np.sum(dX_norm * -var_inv, axis = 0) + dvar * 1 / self.n_X * np.sum(-2. * X_mu, axis = 0)
    // dX = (dX_norm * var_inv) + (dmu / self.n_X) + (dvar * 2 / self.n_X * X_mu)

    // dX = dX.reshape(self.X_shape)
    //     return dX, [dgamma, dbeta]
    calculateGradients( outputGradient: Tensor, batchSize: number) {
        let gammaGradient = mult(outputGradient, this.norm)

        this.weightsGradient.add(gammaGradient)
        this.biasGradient.add(outputGradient)

        // Inputs gradient
        let var_inv = 1 / this.variance ** 0.5
        let inputGradient = mult(outputGradient, this.weights)
        let varianceGradient = mult(inputGradient, this.xmu).mult(-0.5).mult(this.variance ** (-3 / 2))

        let muGradient = mult(inputGradient, -var_inv).add(varianceGradient).mult(divNoNan(1 / batchSize, neg(this.xmu)))
        inputGradient = mult(inputGradient, var_inv).add(add(divNoNan(muGradient, batchSize), divNoNan(mult(varianceGradient, 2 / batchSize), this.xmu)))

        return inputGradient
    }
}