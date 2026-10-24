import { Tensor } from "../tensor_modules/tensor.js"
import { TensorLike3D } from "../types.js"

import { Layer } from "./layer.js";
export interface FlattenLike {
    inputShape?: number[]; outputShape?: number;
}
export class FlattenCLass extends Layer {
    inputShape: number[]; outputShape: number;
    constructor(object: FlattenLike = {}) {
        super()
        this.type = 'flatten'
        this.inputShape = object.inputShape instanceof Array ? object.inputShape.slice() : [1, 1, 1]
        this.inputShape.map(x => Math.floor(x))
        this.outputShape = 1
        for (let i = 0; i < this.inputShape.length; i++) {
            this.outputShape *= this.inputShape[i]
        }
    }
    resize(inputShape: number | number[]) {
        this.inputShape = inputShape instanceof Array ? inputShape.slice() : [1, 1, 1]
        this.inputShape.map(x => Math.floor(x))
        this.outputShape = 1
        for (let i = 0; i < this.inputShape.length; i++) {
            this.outputShape *= this.inputShape[i]
        }
    }
    forward(input: Tensor) {
        this.input = input
        let vector: number[] = []
        this.input.forEach(x => {
            vector.push(x)
            return x
        })
        return new Tensor(vector, [this.outputShape])
    }
    backward(outputGradient: Tensor) {
        let result: TensorLike3D = []
        let element = 0
        for (let depth = 0; depth < this.inputShape[0]; depth++) {
            result[depth] = []
            for (let row = 0; row < this.inputShape[1]; row++) {
                result[depth][row] = []
                for (let col = 0; col < this.inputShape[2]; col++) {
                    result[depth][row][col] = outputGradient.data[element]
                    element++
                }
            }
        }
        return new Tensor(result, this.inputShape)
    }
    serialize() {
        return JSON.stringify(this)
    }
}
