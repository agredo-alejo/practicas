let training_inputs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
]
let training_outputs = [
    [0],
    [1],
    [1],
    [0]
]
for (let i = 0; i < training_inputs.length; i++) {
    training_inputs[i] = Matrix.fromArray(training_inputs[i])
}
for (let i = 0; i < training_outputs.length; i++) {
    training_outputs[i] = Matrix.fromArray(training_outputs[i])
}
let training_data = []
for (let i = 0; i < training_inputs.length; i++) {
    training_data[i] = [training_inputs[i], training_outputs[i]]
}


let model
let cols
let rows
let resolution

let inputs
addEventListener('dblclick', () => init())
function init() {
    resolution = 15
    cols = width / resolution
    rows = height / resolution

    inputs = []
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x1 = i / cols
            let x2 = j / rows
            // x1 = round(x1)
            // x2 = round(x2)
            inputs.push([x1, x2])

        }
    }
    for (let i = 0; i < inputs.length; i++) {
        inputs[i] = Matrix.fromArray(inputs[i])
    }
    model = new NeuralNetwork()
    let layer1 = {
        inputShape: 2,
        units: 3,
        activation: sigmoid
    }
    let layer2 = {
        units: 1,
        activation: sigmoid
    }
    let layer3 = {
        units: 1,
        activation: sigmoid
    }
    model.addLayer(layer1)
    model.addLayer(layer2)
    // model.addLayer(layer3)
    model.setLearningRate(0.1)

}
let ys = []
addEventListener('dblclick', init)
function animate() {
    clearCanvas()

    for (let i = 0; i < 250; i++) {
        let data = random(training_data)
        model.train(data[0], data[1])
    }

    ys = []
    for (let i = 0; i < inputs.length; i++) {
        ys[i] = model.predict(inputs[i]).toArray()
    }

    let index = 0
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            let color = ys[index] * 255
            // ctx.save()
            ctx.fillStyle = 'rgba(' + color + ',' + color + ',' + color + ', 1)'
            ctx.fillRect(i * resolution, j * resolution, resolution, resolution)
            // ctx.closePath()

            // fill(ys[index] * 255)
            // rect(i * resolution, j * resolution, resolution, resolution)


            index++
        }
    }
}

init()
// showFps()
// setFps(0)