import { DenseClass } from "./dense.js";
import { ConvClass } from "./conv.js";
import { MaxPoolingClass } from "./mp.js";
import { FlattenCLass } from "./flatten.js";
import { DropoutClass } from "./dropout.js";
import { NormClass } from "./norm.js";
import { ActivationClass } from "./activation.js";
import * as activations from "../activations_modules/activations.js";
export const handler = (type) => {
    switch (type) {
        case 'dense':
            return DenseClass;
        case 'conv':
            return ConvClass;
        case 'maxpooling':
            return MaxPoolingClass;
        case 'flatten':
            return FlattenCLass;
        case 'dropout':
            return DropoutClass;
        case 'norm':
            return NormClass;
        case 'activation':
            return ActivationClass;
        default:
            return DenseClass;
    }
};
export const fromObject = (object) => {
    let layerConstructor = handler(object.type);
    return new layerConstructor(object);
};
export const dense = (object) => {
    return new DenseClass(object);
};
export const conv = (object) => {
    return new ConvClass(object);
};
export const maxPooling = (object) => {
    return new MaxPoolingClass(object);
};
export const norm = (object) => {
    return new NormClass(object);
};
export const flatten = (object) => {
    return new FlattenCLass(object);
};
export const dropout = (object) => {
    return new DropoutClass(object);
};
export const activation = (name) => {
    switch (name) {
        case 'sigmoid':
            return new ActivationClass(activations.sigmoid);
        case 'relu':
            return new ActivationClass(activations.relu);
        case 'binaryStep':
            return new ActivationClass(activations.binayStep);
        case 'tanh':
            return new ActivationClass(activations.tanh);
        case 'softmax':
            return new ActivationClass(activations.softmax);
        default:
            return new ActivationClass(activations.sigmoid);
    }
};
