import { fromVector } from "../tensor_modules/t_creation.js";
import * as util from "../util.js";
export const calculateFans = (shape) => {
    shape.map(x => Math.floor(x));
    let fanIn = 1, fanOut = 1;
    if (shape.length == 2) {
        fanIn = shape[1];
        fanOut = shape[0];
    }
    else if (shape.length == 4) {
        // Shape = #Filters, #Channels, kernelRows, kernelCols
        let receptiveField = shape[2] * shape[3];
        fanIn = receptiveField * shape[1];
        fanOut = receptiveField * shape[0];
    }
    return [fanIn, fanOut];
};
export class Initializer {
    constructor(func, name, args) {
        this.func = func;
        this.name = name;
        this.args = args;
    }
    apply(shape) {
        let size = 1;
        let result = [];
        this.args.InOutfans = calculateFans(shape);
        for (let index = 0; index < shape.length; index++) {
            size *= shape[index];
        }
        for (let index = 0; index < size; index++) {
            result[index] = this.func(this.args);
        }
        return fromVector(result, shape);
    }
    copy() {
        return JSON.parse(JSON.stringify(this));
    }
}
export const constant = (args = {}) => {
    let apply = (args = {}) => {
        let value = args.value || 0;
        return value;
    };
    return new Initializer(apply, 'constant', args);
};
export const ones = (args = {}) => {
    return new Initializer(() => 1, 'ones', args);
};
export const zeros = (args = {}) => {
    return new Initializer(() => 0, 'zeros', args);
};
export const randomUniform = (args = {}) => {
    let apply = (args = {}) => {
        let limit = args.InOutfans[0] || 1;
        limit = 1 / Math.sqrt(limit);
        let min = args.min || -limit;
        let max = args.max || limit;
        return util.randomRange(min, max);
    };
    return new Initializer(apply, 'randomUniform', args);
};
export const randomNormal = (args = {}) => {
    let apply = (args = {}) => {
        let mean = args.mean || 0;
        let stddev = args.stddev || 1;
        return util.randomNormal(mean, stddev);
    };
    return new Initializer(apply, 'randomNormal', args);
};
export const xavierUniform = (args = {}) => {
    let apply = (args = {}) => {
        let fanIn = args.InOutfans[0] || 1;
        let fanOut = args.InOutfans[1] || 1;
        let limit = Math.sqrt(6) / Math.sqrt(fanIn + fanOut);
        return util.randomRange(-limit, limit);
    };
    return new Initializer(apply, 'xavierUniform', args);
};
export const xavierNormal = (args = {}) => {
    let apply = (args = {}) => {
        let fanIn = args.InOutfans[0] || 1;
        let fanOut = args.InOutfans[1] || 1;
        let stddev = Math.sqrt(2 / (fanIn + fanOut));
        return util.randomNormal(0, stddev);
    };
    return new Initializer(apply, 'xavierNormal', args);
};
export const heUniform = (args = {}) => {
    let apply = (args = {}) => {
        let fanIn = args.InOutfans[0] || 1;
        let limit = Math.sqrt(6 / fanIn);
        return util.randomRange(-limit, limit);
    };
    return new Initializer(apply, 'heUniform', args);
};
export const heNormal = (args = {}) => {
    let apply = (args = {}) => {
        let fanIn = args.InOutfans[0] || 1;
        let stddev = Math.sqrt(2 / fanIn);
        return util.randomNormal(0, stddev);
    };
    return new Initializer(apply, 'heNormal', args);
};
export const varianceScaling = (args = {}) => {
    let apply = (args = {}) => {
        let fanIn = args.InOutfans[0] || 1;
        let fanOut = args.InOutfans[1] || 1;
        let scale = args.scale || 1;
        let n = fanIn;
        if (args.mode == 'fan_out') {
            n = fanOut;
        }
        else if (args.mode == 'avg') {
            n = (fanIn + fanOut) / 2;
        }
        if (args.distribution == 'uniform') {
            let limit = Math.sqrt(3 * scale / n);
            return util.randomRange(-limit, limit);
        }
        else {
            let stddev = Math.sqrt(scale / n);
            return util.randomNormal(0, stddev);
        }
    };
    return new Initializer(apply, 'varianceScaling', args);
};
export const handler = (name) => {
    switch (name) {
        case 'constant':
            return constant;
        case 'ones':
            return ones;
        case 'zeros':
            return zeros;
        case 'randomUniform':
            return randomUniform;
        case 'randomNormal':
            return randomNormal;
        case "xavierUniform":
            return xavierUniform;
        case "xavierNormal":
            return xavierNormal;
        case "heUniform":
            return heUniform;
        case "heNormal":
            return heNormal;
        case "varianceScaling":
            return varianceScaling;
        default:
            return randomUniform;
    }
};
export const fromObject = (object) => {
    switch (object.name) {
        case 'constant':
            return constant(object.args);
        case 'ones':
            return ones(object.args);
        case 'zeros':
            return zeros(object.args);
        case 'randomUniform':
            return randomUniform(object.args);
        case 'randomNormal':
            return randomNormal(object.args);
        case "xavierUniform":
            return xavierUniform(object.args);
        case "xavierNormal":
            return xavierNormal(object.args);
        case "heUniform":
            return heUniform(object.args);
        case "heNormal":
            return heNormal(object.args);
        case "varianceScaling":
            return varianceScaling(object.args);
        default:
            return randomUniform();
    }
};
