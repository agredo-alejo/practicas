let model = new NeuralNet()
let input = []
let size
let spacing = 5
let xSpacing = spacing * 2
let imgWidth = 25
let imgHeight = imgWidth
let numChannels = 2
let numFiltersLayer1 = 3
let numFiltersLayer2 = 2
let result
let modelWidth = 0

for (let i = 0; i < numChannels; i++) {
    // input[i] = new Matrix(imgWidth, imgHeight).randomize(-0.2,0.2)
    input[i] = new Matrix(imgWidth, imgHeight)
}
for (let i = 0; i < input[0].rows; i++) {
    let mitad = Math.floor(input[0].rows / 2)

    for (let j = 0; j < input[0].cols; j++) {
        for (let k = -2; k < 2; k++) {
            input[0].data[mitad + k][j] = 1
        }
    }
}
for (let i = 0; i < input[1].rows; i++) {
    let mitad = Math.floor(input[1].cols / 2)

    for (let j = 0; j < input[1].cols; j++) {
        for (let k = -2; k < 2; k++) {
            input[1].data[i][mitad + k] = 1
        }
    }
}
function initializeModel() {

    model = new NeuralNet()
    model.addLayer(Layer.conv2d({
        inputShape: [imgWidth, imgHeight, numChannels],
        filters: numFiltersLayer1,
        kernelSize: 3,
        // padding: 'same'
    }))
    model.addLayer(Layer.maxPooling2d({}))
    model.addLayer(Layer.conv2d({
        filters: numFiltersLayer2,
        kernelSize: 3
    }))
    model.addLayer(Layer.maxPooling2d({}))
    model.addLayer(Layer.flatten())
    model.addLayer(Layer.dense({
        units: 10,
        activation: "sigmoid"
    }))

    for (let i = 0; i < model.layers[0].bias.length; i++) {

        model.layers[0].bias[i].fill(0)
    }
    for (let i = 0; i < model.layers[2].bias.length; i++) {

        model.layers[2].bias[i].fill(0)
    }
}
function calculatemodelWidth() {
    let growingSpacing = 0
    for (let i = 0; i < model.layerOutputs.length; i++) {

        let xDispacement = 0

        for (let j = 0; j < model.layerOutputs[i].length; j++) {

            xDispacement = model.layerOutputs[i][j].cols

        }
        growingSpacing += xDispacement
        if (i > model.layerOutputs.length - 3) {

            growingSpacing++
        }
    }
    return growingSpacing
}
function init() {
    size = (width - xSpacing * model.layerOutputs.length) / calculatemodelWidth()

    initializeModel()
    model.predict(input)
    result = model.predict(input)

}
function animate() {
    init()
    let growingSpacing = 0
    for (let i = 0; i < model.layerOutputs.length; i++) {

        let xDispacement = 0

        for (let j = 0; j < model.layerOutputs[i].length; j++) {

            xDispacement = (model.layerOutputs[i][j].cols * size + xSpacing)

            drawMatrix(model.layerOutputs[i][j].data, size,

                growingSpacing,

                j * (model.layerOutputs[i][j].rows * size + spacing),
                true
            )

        }
        growingSpacing += xDispacement
        if (i > model.layerOutputs.length - 3) {
            drawMatrix(model.layerOutputs[i].data, size, growingSpacing, 0, true)
            growingSpacing += size + xSpacing
        }
    }


}

setFps(2)
init()


    // for (let i = 0; i < model.layers[0].kernels[0].length; i++) {
    //     model.layers[0].kernels[0][i].data = [
    //         [-1, 0, 1], 
    //         [-1, 0, 1],
    //         [-1, 0, 1]
    //     ]

    // }
    // for (let i = 0; i < model.layers[0].kernels[0].length; i++) {
    //     model.layers[0].kernels[1][i].data = [
    //         [-1, -1, -1],
    //         [0, 0, 0],
    //         [1, 1, 1]
    //     ]

    // }
    // for (let i = 0; i < model.layers[0].kernels[0].length; i++) {
    //     model.layers[0].kernels[2][i].data = [
    //         [1, -1, 1],
    //         [0, -1, 0],
    //         [1, 0, 1]
    //     ]

    // }
    // for (let i = 0; i < model.layers[2].kernels[0].length; i++) {
    //     model.layers[2].kernels[0][i].data = [
    //         [-1, 1, -1],
    //         [0, 1, 0],
    //         [-1, 1, -1]
    //     ]

    // }
    // for (let i = 0; i < model.layers[2].kernels[1].length; i++) {
    //     model.layers[2].kernels[1][i].data = [
    //         [1, 0, 1],
    //         [-1, -1, -1],
    //         [1, 0, 1]
    //     ]

    // }