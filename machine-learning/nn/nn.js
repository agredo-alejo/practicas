class ActivationFunction {
    constructor(func, dfunc) {
        this.func = func;
        this.dfunc = dfunc;
    }
}

let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
);

let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
);
let relu = new ActivationFunction(
    x => (a,b)=>
    y => y * (1 - y)
)
 

class NeuralNetwork {
    /*
    * if first argument is a NeuralNetwork the constructor clones it
    * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
    */
    constructor(in_nodes, hid_nodes, out_nodes) {
        if (in_nodes instanceof NeuralNetwork) {
            let a = in_nodes;
            this.input_nodes = a.input_nodes;
            this.hidden_nodes = a.hidden_nodes;
            this.output_nodes = a.output_nodes;

            this.weights_ih = a.weights_ih.copy();
            this.weights_ho = a.weights_ho.copy();

            this.bias_h = a.bias_h.copy();
            this.bias_o = a.bias_o.copy();
        } else {
            this.input_nodes = in_nodes;
            this.hidden_nodes = hid_nodes;
            this.output_nodes = out_nodes;

            this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
            this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();

            this.bias_h = new Matrix(this.hidden_nodes, 1);
            this.bias_o = new Matrix(this.output_nodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();
        }

        // TODO: copy these as well
        this.setLearningRate();
        this.setActivationFunction();


    }

    predict(input_array) {

        // Generating the Hidden Outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function!
        hidden.map(this.activation_function.func);

        // Generating the output's output!
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.map(this.activation_function.func);

        // Sending back to the caller!
        return output.toArray();
    }

    setLearningRate(learning_rate = 0.1) {
        this.learning_rate = learning_rate;
    }

    setActivationFunction(func = sigmoid) {
        this.activation_function = func;
    }

    train(input_array, target_array) {
        // Generating the Hidden Outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // activation function!
        hidden.map(this.activation_function.func);

        // Generating the output's output!
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        outputs.map(this.activation_function.func);

        // Convert array to matrix object
        let targets = Matrix.fromArray(target_array);

        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);

        // let gradient = outputs * (1 - outputs);
        // Calculate gradient
        let gradients = Matrix.map(outputs, this.activation_function.dfunc);
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);


        // Calculate deltas
        let hidden_T = Matrix.transpose(hidden);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

        // Adjust the weights by deltas
        this.weights_ho.add(weight_ho_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_o.add(gradients);

        // Calculate the hidden layer errors
        let who_t = Matrix.transpose(this.weights_ho);
        let hidden_errors = Matrix.multiply(who_t, output_errors);

        // Calculate hidden gradient
        let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
        hidden_gradient.multiply(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);

        // Calcuate input->hidden deltas
        let inputs_T = Matrix.transpose(inputs);
        let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

        this.weights_ih.add(weight_ih_deltas);
        // Adjust the bias by its deltas (which is just the gradients)
        this.bias_h.add(hidden_gradient);

        // outputs.print();
        // targets.print();
        // error.print();
    }

    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
        nn.weights_ih = Matrix.deserialize(data.weights_ih);
        nn.weights_ho = Matrix.deserialize(data.weights_ho);
        nn.bias_h = Matrix.deserialize(data.bias_h);
        nn.bias_o = Matrix.deserialize(data.bias_o);
        nn.learning_rate = data.learning_rate;
        return nn;
    }


    // Adding function for neuro-evolution
    copy() {
        return new NeuralNetwork(this);
    }

    // Accept an arbitrary function for mutation
    mutate(func) {
        this.weights_ih.map(func);
        this.weights_ho.map(func);
        this.bias_h.map(func);
        this.bias_o.map(func);
    }



}












class Perceptron {
    constructor() {
        //initialize the weights randomly
        this.weights = new Array(2)
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = random(-1, 1)
        }
        this.learningRate = 1
    }
    guess(inputs) {
        //Weighted sum
        let sum = 0
        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i]
        }
        let output = actSIGN(sum)
        return output
    }

    train(inputs, target) {
        //Correction
        let guess = this.guess(inputs)
        let error = target - guess
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * this.learningRate
        }
    }
}

//Activation function
function actSIGN(n) {
    if (n >= 0) {
        return 1
    }
    else {
        return -1
    }
}










class NeuralNetwork {
    constructor(input) {
        this.layers = []
        this.weights = [0]
        this.bias = [0]
        this.actFun = [0]
        this.learningRate = 0.1

        if (input instanceof NeuralNetwork) {
            this.layers = input.layers.slice()
            this.weights = []
            for (let i = 0; i < input.weights.length; i++) {
                this.weights[i] = input.weights[i].copy()
            }
            this.bias = []
            for (let i = 0; i < input.bias.length; i++) {
                this.bias[i] = input.bias[i].copy()
            }
        }
    }
    setLearningRate(learningRate) {
        this.learningRate = learningRate
    }

    // NO TE OLVIDES DE ARREGLAR LA FUNCION SERIALIZE SEGUN MODIFIQUES LOS COMPONENTES DEL CONSTRUCTOR


    addLayer(object) {
        if (this.layers[0] == undefined) {
            this.layers.push(object.inputShape)
        }
        this.layers.push(object.units)
        this.actFun.push(object.activation)


        for (let i = 0; i < this.layers.length - 1; i++) {
            this.weights[i + 1] = new Matrix(this.layers[i + 1], this.layers[i])
            this.weights[i + 1].randomize()
        }
        for (let i = 0; i < this.layers.length - 1; i++) {
            this.bias[i + 1] = new Matrix(this.layers[i + 1], 1)
            this.bias[i + 1].randomize()
        }
    }
    predict(input) {
        //    let inputs
        //     if(input instanceof Array){
        //         inputs = Matrix.fromVectorArray(input)
        //     } 
        //     else{
        //         inputs = input
        //     }
        //     let output 
        //     for(let i = 0; i < this.weights.length; i++){
        //         output = Matrix.mult(this.weights[i], inputs)
        //         output.add(this.bias[i])
        //         output.map(this.actFun[i].func)
        //         inputs = output.copy()
        //     }
        //     return output
        return this.internPredict(input, this.weights.length)
    }
    internPredict(input, iterations) {
        let inputs
        if (input instanceof Array) {
            inputs = Matrix.fromVectorArray(input)
        }
        else {
            inputs = input
        }
        let output
        for (let i = 1; i < iterations; i++) {
            output = Matrix.mult(this.weights[i], inputs)
            output.add(this.bias[i])
            output.map(this.actFun[i].func)
            inputs = output.copy()
        }
        return output
    }
    train(input, target) {
        // let inputs
        // if (input instanceof Array) {
        //     inputs = Matrix.fromVectorArray(input)
        // }
        // else {
        //     inputs = input
        // }
        // let output
        // for (let i = 0; i < this.weights.length; i++) {
        //     output = Matrix.mult(this.weights[i], inputs)
        //     output.add(this.bias[i])
        //     output.map(this.actFun[i].func)
        //     inputs = output.copy()
        // }






        let output = this.predict(input)
        let targets
        if (target instanceof Array) {
            targets = Matrix.fromVectorArray(target)
        }
        else {
            targets = target
        }
        // Calculate the error
        let errors = Matrix.sub(targets, output)


        for (let i = this.weights.length - 1; i > 1; i--) {
            // Calculate the error of previous layers
            let transposedWeights = Matrix.transpose(this.weights[i])
            let hiddenErrors = Matrix.mult(transposedWeights, errors)

            // Calculate gradients
            let gradient = Matrix.map(output, this.actFun[i].dfunc)
            gradient.multiply(errors)
            gradient.multiply(this.learningRate)

            // Calculate deltas 
            let preLayerTransposed = this.internPredict(input, i)
            let LayerTransposed = this.internPredict(input, i + 1)

            console.log(preLayerTransposed.data);
            console.log(LayerTransposed.data);












            errors = hiddenErrors
        }

    }




    serialize() {
        return JSON.stringify(this);
    }

    static deserialize(data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        let nn = new NeuralNetwork();

        nn.layers = data.layers.slice()
        nn.weights = []
        for (let i = 0; i < data.weights.length; i++) {
            nn.weights[i] = Matrix.fromMatrixArray(data.weights[i].data)
        }
        nn.bias = []
        for (let i = 0; i < data.bias.length; i++) {
            nn.bias[i] = Matrix.fromMatrixArray(data.bias[i].data)
        }
        nn.learning_rate = data.learning_rate
        nn.activation_function = data.activation_function


        return nn;
    }
    copy() {
        return new NeuralNetwork(this)
    }
}




