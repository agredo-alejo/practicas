let div = document.querySelector('div')
let mnist, img, prediction, label, guess
let inputs = [], targets = []
let total = 0, loss = 0, trainIndex = 0

// Create de neural network
model = new NeuralNet()
model.addLayer(Layer.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 5,
    activation: 'leakyrelu'
}))
model.addLayer(Layer.maxPooling2d({
    poolSize: 2,
    strides: 2,
    padding: 'valid'
}))
model.addLayer(Layer.dropout({
    rate: 0.85
}))
model.addLayer(Layer.conv2d({
    kernelSize: 5,
    filters: 10,
    activation: 'leakyrelu'
}))
model.addLayer(Layer.maxPooling2d({
    poolSize: 2,
    strides: 2,
    padding: 'valid'
}))
model.addLayer(Layer.dropout({
    rate: 0.85
}))
model.addLayer(Layer.flatten())
model.addLayer(Layer.dense({
    units: 120,
    activation: 'sigmoid'
}))
model.addLayer(Layer.dropout({
    rate: 0.8
}))
model.addLayer(Layer.dense({
    units: 10,
    activation: 'softmax'
}))
model.setLossFunction('crossEntropy')
model.setLearningRate(0.005)


// setFps(1)

addEventListener('keyup', event => {
    if (event.keyCode == 32) {
        // console.log(model.serialize());
        download('brain.js', 'let trainedModel = ' + model.serialize() + '\n let model = new NeuralNet(trainedModel)')
    }
})

loadMNIST(data => {
    mnist = data
})
let contador = 0
let hola = 0
let lastT
let sospecha = []
let iterations = 1
function animate() {
    if (mnist) {
        
        train()
        dibujar(inputs[0])


        prediction = model.predict(inputs)


        loss = model.lossFunction.func(prediction, targets)

        guess = findMaxIndex(matrixToVectorArray(prediction))
        sospecha.push(guess)

        div.innerHTML = ''
        div.innerHTML = 'label: ' + label + ' ' + 'guess: ' + guess + ''

        for (let i = 0; i < iterations; i++) {
            // sospecha = [findMaxIndex(matrixToVectorArray(targets))]
            train()
            model.train(inputs, targets)
        }
        // if (hola < 20) {

        // for(let i = 0; i < 10 ; i++){
            // train()
            // lastT = targets
            // model.train(inputs, targets)
        // }
            // hola++
        // }


        if (contador == 200) {

            let sumatoria = 0
            for (let i = 0; i < loss.rows; i++) {
                sumatoria += loss.data[i][0]
            }

            console.log(sumatoria);

            contador = 0
        }
        contador++
    }
}
function train() {
    trainIndex = Math.floor(Math.random() * 60000)
    // trainIndex = 0
    let linearImage = 0

    inputs = []
    for (let imgRow = 0; imgRow < 28; imgRow++) {
        inputs[imgRow] = []
        for (let imgCol = 0; imgCol < 28; imgCol++) {
            let bright = mnist.train_images[linearImage + trainIndex * 784]
            inputs[imgRow][imgCol] = bright / 255

            linearImage++
        }
    }
    inputs = [Matrix.fromArray(inputs)]

    // Neural Netwrok stuff
    label = mnist.train_labels[trainIndex]
    targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    targets[label] = 1
    targets = Matrix.fromArray(targets)

    

}

function findMaxIndex(arr) {
    let record = 0, index = 0
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > record) {
            index = i
            record = arr[i]
        }
    }
    return index
}
function matrixToVectorArray(matrix) {
    let result = []
    for (let i = 0; i < matrix.rows; i++) {
        result[i] = matrix.data[i][0]
    }
    return result
}
function dibujar(matrix) {
    for (let i = 0; i < matrix.cols; i++) {
        for (let j = 0; j < matrix.rows; j++) {
            let bright = matrix.data[j][i] * 255
            ctx.fillStyle = 'rgba( ' + bright + ',' + bright + ',' + bright + ',1)'
            ctx.fillRect(i * 10, j * 10, 10, 10)
        }
    }
}
setInterval(() => {
    console.clear()
}, 60000 * 5);
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

