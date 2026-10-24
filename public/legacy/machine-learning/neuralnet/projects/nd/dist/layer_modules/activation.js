import { Tensor } from "../tensor_modules/tensor.js";
import { Layer } from "./layer.js";
export class ActivationClass extends Layer {
    constructor(object) {
        super();
        this.isTrainable = false;
        this.type = 'activation';
        this.name = object.name;
        this.fn = object.fn;
        this.fnPrime = object.fnPrime;
        this.updateError = object.updateError;
        this.inputShape = 0;
        this.outputShape = this.inputShape;
        this.forwardedInput = new Tensor([]);
    }
    resize(inputShape) {
        this.inputShape = inputShape;
        this.outputShape = this.inputShape;
    }
    forward(input) {
        this.input = input;
        this.forwardedInput = this.fn(input);
        return this.forwardedInput;
    }
    backward(outputGradient) {
        return this.updateError(outputGradient, this.fnPrime(this.forwardedInput));
    }
    serialize() {
        return JSON.stringify(this);
    }
}
