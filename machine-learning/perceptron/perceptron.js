class Perceptron {
    constructor(inputNodes, learningRate) {
        this.weights = []
        for (let i = 0; i < inputNodes; i++) {
            this.weights[i] = random(-1, 1)
        }

        this.learningRate = learningRate
    }
    predict(inputs) {

        let sum = 0
        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i]
        }

        return sum
        // return actFunc(sum)
    }

    train(inputs, target) {

        let prediction = this.predict(inputs)
        let error = target - prediction
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * this.learningRate
        }

    }
}

//Activation function
function actFunc(n) {
    if (n >= 0) {
        return 1
    } else {
        return -1
    }
}