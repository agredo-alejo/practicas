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
    training_data[i] = [training_inputs[i], training_outputs[i], i]
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
    model = new NeuralNet()
    model.addLayer(Layer.dense({
        inputShape: 2,
        units: 3,
        activation: 'sigmoid'
    }))
    model.addLayer(Layer.dense({
        units: 1,
        activation: 'sigmoid'
    }))
    model.setLossFunction(meanSquaredError)
    model.setLearningRate(0.3)

}
let ys = []
addEventListener('dblclick', init)
function animate() {
    clearCanvas()
    let batch = 0
    let anterior = 0
    for (let i = 0; i < 100; i++) {
        let data = random(training_data)
        while (data[2] == anterior) {
            
            data = random(training_data)
        }
        anterior = data[2]
        // let data = training_data[batch]
        // if(batch < 3){  
        //     batch++
        // } else{
        //     batch = 0
        // }
        model.train(data[0], data[1])
    }

    ys = []
    for (let i = 0; i < inputs.length; i++) {
        ys[i] = model.predict(inputs[i]).data
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
// setFps(1)



// function dibujar(matrix) {
//     for (let i = 0; i < matrix.length; i++) {
//         for (let j = 0; j < matrix[0].length; j++) {
//             stroke(100)
//             fill(matrix[i][j] / 2 * 255)
//             square(j * resolution, i * resolution, resolution)
//         }
//     }
// }

// let resolution = 20
// let prueba = Matrix.randomize(28,28)
// // let prueba = [
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// // ]

// let prueba2 = prueba.copy()
// // prueba = Matrix.fromArray(prueba)
// // prueba2 = Matrix.fromArray(prueba2)
// // prueba2.transpose()
// prueba2.randomize()

// let model = new NeuralNet()
// model.addLayer(Layer.conv2d({
//     inputShape: [prueba.rows, prueba.cols, 2],
//     kernelSize: 3,
//     filters: 4,
//     // padding: 'same',
//     activation: 'leakyrelu'
// }))
// model.addLayer(Layer.maxPooling2d({
//     // poolSize: 2,
//     // strides: 2,
//     // padding: 'full'
// }))
// model.addLayer(Layer.conv2d({
//     kernelSize: 3,
//     filters: 8,
//     // padding: 'same',
//     activation: 'leakyrelu'
// }))
// model.addLayer(Layer.maxPooling2d({
//     // poolSize: 2,
//     // strides: 2,
//     // padding: 'full'
// }))
// model.addLayer(Layer.flatten())
// model.addLayer(Layer.dense({
//     units: 5,
//     activation: 'leakyrelu'
// }))
// model.addLayer(Layer.dense({
//     units: 3,
//     activation: 'softmax'
// }))

// model.setLossFunction(crossEntropy)
// let inputs = [prueba, prueba2]

// let resultado = model.predict(inputs)


// let target = [0,0,1]
// target = Matrix.fromArray(target)

// let grad = model.train([prueba,prueba2], target)

// console.table(grad[0].data)

// dibujar(model.layerOutputs[2][0].data)
// let perdida
// function animate() {
//     // perdida = model.lossFunction.func(model.predict([prueba, prueba2]), target)
//     for(let i = 0; i < 10; i++){
//         model.train(inputs, target)

//     }
//     // console.log('o');
    
//     // console.log(perdida.data[2]);
    
// }
// setFps(1)
// showFps()

// let prueba = [
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [0, 1, 2, 3, 4, 5, 6, 7],
// ]
// prueba = Matrix.fromArray(prueba)
// let convlayer = Layer.conv2d({
//     inputShape: [prueba.rows, prueba.cols, 1],
//     kernelSize: 3,
//     filters: 1,
//     padding: 'same',
//     activation: 'leakyrelu'
// })

// let result
// function animate() {
//     for(let i = 0; i < 1000; i++){
//         result = convlayer.apply([prueba])

//         convlayer.backprop(result, [prueba], [prueba], 0.1)
//     }
// }
// showFps()4
// stopAnimation()