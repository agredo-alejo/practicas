import { DenseClass, DenseLike } from "./dense.js"
import { ConvClass, ConvLike } from "./conv.js"
import { MaxPoolingClass, MpLike } from "./mp.js"
import { FlattenCLass, FlattenLike } from "./flatten.js"
import { DropoutClass, DropoutLike } from "./dropout.js"

import { NormClass, NormLike } from "./norm.js"
import { ActivationClass } from "./activation.js"
import * as activations from "../activations_modules/activations.js"

export const handler = (type: string | undefined) => {

    switch (type) {
        case 'dense':
            return DenseClass
        case 'conv':
            return ConvClass
        case 'maxpooling':
            return MaxPoolingClass
        case 'flatten':
            return FlattenCLass
        case 'dropout':
            return DropoutClass
        case 'norm':
            return NormClass
        case 'activation':
            return ActivationClass
        default:
            return DenseClass
    }
}
export const fromObject = (object: any) => {
    let layerConstructor = handler(object.type)
    return new layerConstructor(object)
}


export const dense = (object: DenseLike) => {
    return new DenseClass(object)
}
export const conv = (object: ConvLike) => {
    return new ConvClass(object)
}
export const maxPooling = (object: MpLike) => {
    return new MaxPoolingClass(object)

}
export const norm = (object:NormLike) => {
    return new NormClass(object)
}
export const flatten = (object: FlattenLike) => {
    return new FlattenCLass(object)
}
export const dropout = (object: DropoutLike) => {
    return new DropoutClass(object)
}
export const activation = (name: string | undefined) => {
    switch (name) {
        case 'sigmoid':
            return new ActivationClass(activations.sigmoid)
        case 'relu':
            return new ActivationClass(activations.relu)
        case 'binaryStep':
            return new ActivationClass(activations.binayStep)
        case 'tanh':
            return new ActivationClass(activations.tanh)
        case 'softmax':
            return new ActivationClass(activations.softmax)

        default:
            return new ActivationClass(activations.sigmoid)
    }
}
