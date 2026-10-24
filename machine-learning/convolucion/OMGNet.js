class NeuralNetwork {
    constructor(...args) {
        this.layers = []
        this.learningRate = 0.1
        this.layerOutputs = []
        this.trainableLayers = []
        if(args !== undefined){
            for(let i = 0; i < args.length; i++){
                this.addLayer(args[i])
            }
        }
    }

    addLayer(object) {
        if (object.inputShape == undefined) {
            object.inputShape = this.layers[this.layers.length - 1].outputShape
            object.resize(object)
        }
        if(object.isTrainable == true){
            this.trainableLayers.push(object)
        }
        this.layers.push(object)
    }
    predict(input) {
        this.layerOutputs = []
        let output = input
        for (let i = 0; i < this.layers.length; i++) {
            this.layerOutputs.push(output)

            output = this.layers[i].apply(output)
        }

        // this.layerOutputs.push(output)
        // this.layerOutputs doesn't need to include the last output
        return output
    }
    train(input, target) {
        let output = this.predict(input)
        let targets = target
        // Calculate the error
        let errors = Matrix.sub(targets, output)
        for (let i = this.layers.length - 1; i >= 0; i--) {
            // Calculate gradients
            let gradient = Matrix.map(output, this.layers[i].activation.dfunc)
            gradient.multiply(errors)
            gradient.multiply(this.learningRate)

            // Calculate deltas         
            output = this.layerOutputs[i]

            let lastLayerTransposed = Matrix.transpose(output)
            let weightDeltas = Matrix.mult(gradient, lastLayerTransposed)

            // Adjust weights and bias!!!
            this.layers[i].weight.add(weightDeltas)
            this.layers[i].bias.add(gradient)

            // Calculate the error of previous layers
            let transposedWeights = Matrix.transpose(this.layers[i].weight)
            errors = Matrix.mult(transposedWeights, errors)
        }
    }
}
