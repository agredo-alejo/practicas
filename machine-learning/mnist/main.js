let div = document.querySelector('div')
let mnist, img, model
let trainIndex = 0
let inputs = []
let targets = []
let total = 0
let loss = 0
// Create de neural network
model = new NeuralNetwork()
model.addLayer({
    inputShape: 784,
    units: 100,
    activation: sigmoid
})
model.addLayer({
    // inputShape: 784,
    units: 16,
    activation: sigmoid
})
model.addLayer({
    units: 10,
    activation: sigmoid
})
model.setLearningRate(0.01)
addEventListener('keyup', event => {
    if (event.keyCode == 32) {
        // console.log(model.serialize());

    }
})

loadMNIST(data => {
    mnist = data
})
let contador = 0
function animate() {
    if (mnist) {
        for (let i = 0; i < 15; i++) {
            train()
        }
        if (contador == 30) {
            // let pguess = model.predict()
            // console.table(loss.data);
            let sumatoria = 0
            for (let i = 0; i < loss.rows; i++) {
                sumatoria += loss.data[i][0]
            }
            let errorFinal = (1 - sumatoria) * 100

            console.log(errorFinal.toFixed(2));

            contador = 0
        }
        contador++
    }
}
// setFps(1)
function train() {
    trainIndex = floor(random(60000))
    let linearImage = 0
    for (let y = 0; y < 28; y++) {

        for (let x = 0; x < 28; x++) {

            let bright = mnist.train_images[linearImage + trainIndex * 784]
            inputs[linearImage] = bright / 255

            ctx.fillStyle = 'rgba( ' + bright + ',' + bright + ',' + bright + ',1)'
            ctx.fillRect(x * 10, y * 10, 10, 10)

            linearImage++
        }
    }
    // Neural Netwrok stuff
    let label = mnist.train_labels[trainIndex]
    targets = Array(10).fill(0)

    targets[label] = 1

    let prediction = model.predict(Matrix.fromArray(inputs))
    loss = Matrix.sub(Matrix.fromArray(targets), prediction)
    loss = Matrix.map(loss, x => x * x)
    // console.log(prediction);


    let guess = findMax(prediction.data)
    total++
    // loss += guess == label ? 1 : 0

    div.innerHTML = ''
    div.innerHTML = 'label: ' + label + ' ' + 'guess: ' + guess + ''

    model.train(Matrix.fromArray(inputs), Matrix.fromArray(targets))
    // trainIndex++


    // if (trainIndex >= 60000) {
    // trainIndex = 0

    // }
}
function findMax(arr) {
    let record = 0
    let index = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > record) {
            index = i
            record = arr[i]
        }
    }

    return index
}
init()
// setFps(2)