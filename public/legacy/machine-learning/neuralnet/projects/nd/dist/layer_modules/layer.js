// import { ActivationLike } from "./activation.js"
import * as activations from "../activations_modules/activations.js";
import { Tensor } from "../tensor_modules/tensor.js";
import { ensureTensor, copy, shapesEqual } from "../tensor_modules/t_utils.js";
import { zeros, fromObject } from "../tensor_modules/t_creation.js";
import { randomRange } from "../util.js";
import * as initializer from "../initializer_modules/initializers.js";
// Layer must be a namespace!!!
export class Layer {
    constructor() {
        this.input = new Tensor([]);
        this.type = '';
        this.name = '';
        this.isTrainable = false;
    }
    forward(input) {
        return ensureTensor(input);
    }
    backward(outputGradient, batchSize = 1) {
        return outputGradient.mult(batchSize);
    }
    serialize() {
        return JSON.stringify(this);
    }
}
export class TrainableLayer extends Layer {
    constructor() {
        super();
        this.output = new Tensor([]);
        this.name = this.type;
        this.activation = undefined;
        this.activationFunction = activations.linear;
        this.weights = new Tensor([]);
        this.bias = new Tensor([]);
        this.weightsConstrain = [-1e7, 1e7];
        this.biasConstrain = [-1e7, 1e7];
        this.weightsGradient = new Tensor([]);
        this.biasGradient = new Tensor([]);
        this.optimizerWeights = [this.weightsGradient];
        this.optimizerBias = [this.weightsGradient];
        this.kernelInitializer = initializer.randomUniform();
        this.biasInitializer = initializer.zeros();
        this.parameters = 0;
    }
    reshapeOptimizerParameters() {
        this.weightsGradient = zeros(this.weights.shape);
        this.biasGradient = zeros(this.bias.shape);
        this.optimizerWeights = [this.weightsGradient, zeros(this.weights.shape), zeros(this.weights.shape)];
        this.optimizerBias = [this.biasGradient, zeros(this.bias.shape), zeros(this.bias.shape)];
    }
    update(optimizer, batchSize = 1, index = 0) {
        this.weightsGradient.divNoNan(batchSize);
        this.biasGradient.divNoNan(batchSize);
        optimizer.apply(this.weights, this.optimizerWeights, index);
        optimizer.apply(this.bias, this.optimizerBias, index);
        this.weights.constrain(this.weightsConstrain);
        this.bias.constrain(this.biasConstrain);
        this.weightsGradient.mult(0);
        this.biasGradient.mult(0);
    }
    setParameters(object) {
        this.setWeights(fromObject(object.weights));
        this.setBias(fromObject(object.bias));
        this.kernelInitializer = initializer.fromObject(object.kernelInitializer);
        this.biasInitializer = initializer.fromObject(object.biasInitializer);
        for (let index = 1; index < object.optimizerWeights.length; index++) {
            this.optimizerWeights[index] = copy(fromObject(object.optimizerWeights[index]));
            this.optimizerBias[index] = copy(fromObject(object.optimizerBias[index]));
        }
    }
    setWeights(weights) {
        let newWeights = copy(weights);
        if (!shapesEqual(newWeights.shape, this.weights.shape))
            throw "Weights shapes don't match";
        this.weights = newWeights;
    }
    getWeights() {
        return this.weights.copy();
    }
    setBias(bias) {
        let newBias = copy(bias);
        if (!shapesEqual(newBias.shape, this.bias.shape))
            throw "Bias shapes don't match";
        this.bias = newBias;
    }
    getBias() {
        return this.bias.copy();
    }
    mutate(rate = 0.1, range) {
        this.weights.map(x => Math.random() < rate ? randomRange(range) : x);
        this.bias.map(x => Math.random() < rate ? randomRange(range) : x);
    }
    mutateWeights(rate, range) {
        this.weights.map(x => Math.random() < rate ? randomRange(range) : x);
    }
    mutateBias(rate, range) {
        this.bias.map(x => Math.random() < rate ? randomRange(range) : x);
    }
}
