import { zeros } from "../tensor_modules/t_creation.js";
import { maxPoolingVolume, mp_paddAmount, mp_v_outputShape } from "../tensor_modules/c_c_p.js";
import { Layer } from "./layer.js";
export class MaxPoolingClass extends Layer {
    constructor(object = {}) {
        super();
        this.type = 'maxpooling';
        this.poolSize = [2, 2];
        if (object.poolSize) {
            this.poolSize = object.poolSize instanceof Array ? object.poolSize : [object.poolSize, object.poolSize];
            this.poolSize.map(x => Math.floor(x));
        }
        this.stride = this.poolSize;
        if (object.stride) {
            this.stride = object.stride instanceof Array ? object.stride : [object.stride, object.stride];
            this.stride.map(x => Math.floor(x));
        }
        this.padding = object.padding || false;
        this.inputShape = object.inputShape ? object.inputShape.slice() : [1, 1, 1];
        this.inputShape.map(x => Math.floor(x));
        this.padAmt = mp_paddAmount(this.inputShape, this.padding, this.poolSize, this.stride);
        this.outputShape = mp_v_outputShape(this.inputShape, this.padAmt, this.poolSize, this.stride);
        this.coords = object.coords ? object.coords.slice() : [];
    }
    resize(inputShape) {
        this.inputShape = inputShape instanceof Array ? inputShape.slice() : [1, 1, 1];
        this.inputShape.map(x => Math.floor(x));
        this.padAmt = mp_paddAmount(this.inputShape, this.padding, this.poolSize, this.stride);
        this.outputShape = mp_v_outputShape(this.inputShape, this.padAmt, this.poolSize, this.stride);
    }
    forward(input) {
        this.input = input;
        let result = maxPoolingVolume(this.input, this.padding, this.poolSize, this.stride, this.coords);
        return result;
    }
    backward(outputGradient) {
        let result = zeros(this.inputShape);
        for (let i = 0; i < this.coords.length; i++) {
            result.data[this.coords[i][0]][this.coords[i][1]][this.coords[i][2]] =
                outputGradient.data[this.coords[i][0]][this.coords[i][3]][this.coords[i][4]];
        }
        return result;
    }
}
