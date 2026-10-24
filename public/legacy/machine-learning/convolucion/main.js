// let resolution = 10
// let model
// let counter = 0
// let logRes
// let test = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
//     [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// ]
// let vertical = [
//     [-1, 0, 1],
//     [-2, 0, 2],
//     [-1, 0, 1]
// ]

// let horizontal = [
//     [-1, -2, -1],
//     [0, 0, 0],
//     [1, 2, 1]
// ]

// let imgRows = test.length
// let imgCols = test[0].length
// function animate() {
//     save()
//     clearCanvas()






//     model = new NeuralNetwork()
//     model.addLayer(Layer.conv2d({
//         inputShape: [imgRows, imgCols, 1],
//         filters: 8,
//         kernelSize: 5,
//         strides: 1,
//         // padding: 'same',
//         activation: 'leakyrelu'
//     }))
//     model.addLayer(
//         Layer.maxPooling2d({ poolSize: 2, padding: 'same' })
//     )
//     model.addLayer(Layer.conv2d({
//         filters: 16,
//         kernelSize: 3,
//         strides: 1,
//         // padding: 'same',
//         activation: 'leakyrelu'
//     }))
//     model.addLayer(
//         Layer.maxPooling2d({ poolSize: 2, padding: 'same' })
//     )
//     model.addLayer(
//         Layer.flatten()
//     )
//     model.addLayer(
//         Layer.dense({ units: 75, activation: 'leakyrelu' })
//     )
//     model.addLayer(
//         Layer.dense({ units: 10, activation: 'softmax' })
//     )

//     // model.layers[0].kernels[0][0] = vertical
//     logRes = model.predict([test])

//     let result = model.layerOutputs[4][0]
//     let casiResult = model.layerOutputs[3][0]




//     dibujar(test)
//     translate(resolution * test[0].length + 10, 0)


//     dibujar(casiResult)
//     translate(resolution * casiResult[0].length + 10, 0)

//     dibujar(result)


//     restore()
//     // counter++
// }
// setFps(10)
// // showFps()

let prueba = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
]
let filtro = [
    [0, 0],
    [0, 1],
    // [0, 0, 1],
]

let test = convolucion(prueba, filtro, [1,1], 'valid', [3,3])
console.table(test)