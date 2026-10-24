import { Tensor } from "../tensor_modules/tensor.js"
import { Layer } from "./layer.js";
import { ActivationLike } from "../activations_modules/activations.js";


export class ActivationClass extends Layer{
    fn: (t: Tensor) => Tensor; fnPrime: (t: Tensor) => Tensor; updateError: (t: Tensor, t2: Tensor) => Tensor; forwardedInput: Tensor; inputShape: number | number[]; outputShape: number | number[];
    constructor(object: ActivationLike) {
        super()
        this.isTrainable = false
        this.type = 'activation'
        this.name = object.name
        this.fn = object.fn
        this.fnPrime = object.fnPrime
        this.updateError = object.updateError
        this.inputShape = 0
        this.outputShape = this.inputShape
        this.forwardedInput = new Tensor([])
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape
        this.outputShape = this.inputShape
    }
    forward(input: Tensor) {
        this.input = input
        this.forwardedInput = this.fn(input)
        return this.forwardedInput
    }
    backward(outputGradient: Tensor) {
        return this.updateError(outputGradient, this.fnPrime(this.forwardedInput))
    }
    serialize() {
        return JSON.stringify(this)
    }
}

