import { Tensor } from "../tensor_modules/tensor.js";
import { forEachReturn } from "../tensor_modules/t_elmts.js";
import { Layer } from "./layer.js";
export interface DropoutLike {
    rate?: number; inputShape?: number | number[];
}
export class DropoutClass extends Layer {
    rate: number; inputShape: number | number[]; outputShape: number | number[];
    constructor(object: DropoutLike = {}) {
        super()
        this.type = 'dropout'
        this.rate = object.rate || 0.1
        this.inputShape = object.inputShape ? object.inputShape : 1
        this.outputShape = this.inputShape
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape
        this.outputShape = this.inputShape
    }
    forward(input: Tensor) {
        this.input = input
        let result = forEachReturn(this.input.data, x => Math.random() < this.rate ? 0 : x)
        return new Tensor(result, this.input.shape)
    }
    backward(outputGradient: Tensor) {
        return outputGradient
    }
    serialize() {
        return JSON.stringify(this)
    }
}