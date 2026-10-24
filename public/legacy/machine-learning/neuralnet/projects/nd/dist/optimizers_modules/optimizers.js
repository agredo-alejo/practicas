import { mult, divNoNan, add } from "../tensor_modules/arithmetic.js";
import { square } from "../tensor_modules/basic_math.js";
export class Optimizer {
    constructor(apply, name, optParams) {
        this.apply = apply;
        this.name = name;
        this.optParams = optParams;
    }
}
export const sgd = (learningRate = 0.1) => {
    let apply = (varUpdate, gradientParams) => {
        varUpdate.sub(mult(gradientParams[0], learningRate));
    };
    return new Optimizer(apply, 'sgd', [learningRate]);
};
export const momentum = (learningRate = 0.1, momentum = 0.9) => {
    let apply = (varUpdate, gradientParams) => {
        // 0 = g,  1 = vd, 
        if (gradientParams[1] == undefined) {
            varUpdate.sub(mult(mult(gradientParams[0], 1 - momentum), learningRate));
        }
        gradientParams[1] = mult(gradientParams[1], momentum).add(mult(gradientParams[0], 1 - momentum));
        varUpdate.sub(mult(gradientParams[1], learningRate));
    };
    return new Optimizer(apply, 'momentum', [learningRate, momentum]);
};
export const rmsprop = (learningRate = 0.01, momentum = 0.9, epsilon = 1e-7) => {
    let apply = (varUpdate, gradientParams) => {
        // 0 = g,  1 = sd, 
        if (gradientParams[1] == undefined) {
            let sd = mult(square(gradientParams[0]), 1 - momentum);
            varUpdate.sub(mult(divNoNan(gradientParams[0], add(sd, epsilon).sqrt()), learningRate));
        }
        else {
            gradientParams[1] = mult(gradientParams[1], momentum).add(mult(square(gradientParams[0]), 1 - momentum));
            varUpdate.sub(mult(divNoNan(gradientParams[0], add(gradientParams[1], epsilon).sqrt()), learningRate));
        }
    };
    return new Optimizer(apply, 'rmsprop', [learningRate, momentum, epsilon]);
};
export const adam = (learningRate = 0.1, beta1 = 0.9, beta2 = 0.999, epsilon = 1e-7) => {
    let apply = (varUpdate, gradientParams, index = 0) => {
        // 0 = g, 1 = vd,  2 = sd, 
        if (gradientParams[1] == undefined) {
            let vd = mult(gradientParams[0], 1 - beta1);
            let sd = mult(square(gradientParams[0]), 1 - beta2);
            let vdcorrected = divNoNan(vd, 1 - beta1);
            let sdcorrected = divNoNan(sd, 1 - beta2);
            varUpdate.sub(mult(divNoNan(vdcorrected, add(sdcorrected, epsilon).sqrt()), learningRate));
        }
        else {
            gradientParams[1] = mult(gradientParams[1], beta1).add(mult(gradientParams[0], 1 - beta1));
            gradientParams[2] = mult(gradientParams[2], beta2).add(mult(square(gradientParams[0]), 1 - beta2));
            let vdcorrected = divNoNan(gradientParams[1], 1 - beta1 ** index);
            let sdcorrected = divNoNan(gradientParams[2], 1 - beta2 ** index);
            varUpdate.sub(mult(divNoNan(vdcorrected, add(sdcorrected, epsilon).sqrt()), learningRate));
        }
    };
    return new Optimizer(apply, 'adam', [learningRate, beta1, beta2, epsilon]);
};
export const fromObject = (object) => {
    switch (object.name) {
        case 'sgd':
            return sgd(object.optParams[0]);
        case 'momentum':
            return momentum(object.optParams[0], object.optParams[1]);
        case 'rmsprop':
            return rmsprop(object.optParams[0], object.optParams[1], object.optParams[2]);
        case 'adam':
            return adam(object.optParams[0], object.optParams[1], object.optParams[2], object.optParams[3]);
        default:
            return sgd();
    }
};
