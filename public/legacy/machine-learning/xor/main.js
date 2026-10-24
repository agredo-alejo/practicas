let model, rows, cols, resolution

let x1, x2, xs, inputs, data

const train_xs = tf.tensor2d([
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1]
])

const train_ys = tf.tensor2d([
    [0],
    [1],
    [1],
    [0]
])


function init() {

    resolution = 30
    cols = width / resolution
    rows = height / resolution

    let inputs = []
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            x1 = i / cols
            x2 = j / rows
            // x1=round(x1)
            // x2=round(x2)
            inputs.push([x1, x2])

        }
    }
    xs = tf.tensor2d(inputs)


    model = tf.sequential()
    let hidden = tf.layers.dense({
        inputShape: [2],
        units: 3,
        activation: 'sigmoid'
    })
    let output = tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
    })

    model.add(hidden)
    model.add(output)

    const learningRate = 0.1
    const optimizer = tf.train.adam(learningRate)
    model.compile({
        optimizer: optimizer,
        loss: 'meanSquaredError'
    })
}
addEventListener('dblclick', () => init())
function animate() {
    clearCanvas()

    model.fit(train_xs, train_ys, {
        shuffle: true,
        epochs: 1
    })

    tf.tidy(() => {
        ys = model.predict(xs).dataSync()
    })

    let index = 0
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            let color = ys[index] * 255
            // ctx.beginPath()
            ctx.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')'
            ctx.fillRect(i * resolution, j * resolution, resolution, resolution)
            // ctx.closePath()

            // fill(ys[index] * 255)
            // rect(i * resolution, j * resolution, resolution, resolution)

            index++
        }
    }

}
init()


setInterval(() => {
    console.log(tf.memory().numTensors);

}, 2000);
