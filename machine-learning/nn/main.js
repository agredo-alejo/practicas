let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight


let training_data = [
    {
        inputs: [0, 0],
        outputs: [0]
    },

    {
        inputs: [1, 1],
        outputs: [0]
    },

    {
        inputs: [1, 0],
        outputs: [1]
    },

    {
        inputs: [0, 1],
        outputs: [1]
    }
]

let nn
let cols
let rows
let resolution
function init() {
    nn = new NeuralNetwork(2, 5, 1)
    nn.setLearningRate(0.3)

    resolution = 10
    cols = canvas.width / resolution
    rows = canvas.height / resolution



}
let color
let y
let inputs


let data


let x1
let x2


function animate() {
    clearCanvas()


    for (let i = 0; i < 400; i++) {
        data = random(training_data)
        nn.train(data.inputs, data.outputs)
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            x1 = i / cols
            x2 = j / rows
            inputs = [x1, x2]
            y = nn.predict(inputs)



            color = y * 255
            c.beginPath()
            c.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')'
            c.fillRect(i * resolution, j * resolution, resolution, resolution)
            c.closePath()

        }
    }

}


init()
