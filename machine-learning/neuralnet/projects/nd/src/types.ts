import { DenseLike, DenseClass } from "./layer_modules/dense.js"
import { ConvLike, ConvClass } from "./layer_modules/conv.js"
import { MpLike, MaxPoolingClass } from "./layer_modules/mp.js"
import { FlattenLike, FlattenCLass } from "./layer_modules/flatten.js"
import { DropoutLike, DropoutClass } from "./layer_modules/dropout.js"
import { ActivationClass } from "./layer_modules/activation.js"
import { NormLike, NormClass } from "./layer_modules/norm.js"
import { ActivationLike } from "./activations_modules/activations.js"

export type ScalarLike = number
export type TensorLike1D = number[]
export type TensorLike2D = number[][]
export type TensorLike3D = number[][][]
export type TensorLike4D = number[][][][]
export type TensorLike5D = number[][][][][]
export type TensorLike6D = number[][][][][][]
export type TensorLike7D = number[][][][][][][]

// export type TensorLike = number | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | number[][][][][][] | number[][][][][][][] 
export type TensorLike = ScalarLike|TensorLike1D|TensorLike2D|TensorLike3D|TensorLike4D|TensorLike5D|TensorLike6D|TensorLike7D
export type TensorArray = TensorLike1D | TensorLike2D | TensorLike3D | TensorLike4D | TensorLike5D | TensorLike6D | TensorLike7D
export type TensorObject = {
    data: TensorLike
    shape: number[]
    rank: number
} 
export type LayerLike = DenseLike | ConvLike | MpLike | FlattenLike | DropoutLike | ActivationLike | NormLike
export type LayerClasses = DenseClass | ConvClass | MaxPoolingClass | FlattenCLass | DropoutClass | ActivationClass | NormClass
export type TrainableLayers = DenseClass | ConvClass | NormClass

