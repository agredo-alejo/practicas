let x_vals, y_vals = []
let x, y
let a, b, c, d

const learningRate = 0.5
const optimizer = tf.train.adam(learningRate)

addEventListener('click', () => {
    x = map(mouseX, 0, width, 0, 1)
    y = map(mouseY, 0, height, 0, 1)
    x_vals.push(x)
    y_vals.push(y)
})
function predict(inputs) {
    const tfxs = tf.tensor1d(inputs)
    // y = ax^3 + bx^2 + cx + d 
    // const tfys = tfxs.pow(tf.scalar(3)).mul(a).add(tfxs.square().mul(b)).add(tfxs.mul(c)).add(d)

    const tfys = tfxs.square().mul(a).add(tfxs.mul(b)).add(c)
    return tfys
}
function loss(pred, label) {
    return pred.sub(label).square().mean()
}
function init() {
    x_vals = []
    y_vals = []
    a = tf.variable(tf.scalar(random(-1, 1)))
    b = tf.variable(tf.scalar(random(-1, 1)))
    c = tf.variable(tf.scalar(random(-1, 1)))
    d = tf.variable(tf.scalar(random(-1, 1)))
}
function animate() {
    clearCanvas()

        // for (let i = 0; i < 2; i++) {
        tf.tidy(() => {
            if (x_vals.length > 0) {
                const ys = tf.tensor1d(y_vals)
                optimizer.minimize(() => loss(predict(x_vals), ys))
            }
        })
    // }

    for (let i = 0; i < x_vals.length; i++) {
        let px = map(x_vals[i], 0, 1, 0, width)
        let py = map(y_vals[i], 0, 1, 0, height)
        // save()
        fill(150)
        circle(px, py)
        // color(255 / 2)
        // restore()
    }

    const curveX = []
    for (let i = 0; i <= 1; i += 0.1) {
        curveX.push(i)
    }
    const ys = tf.tidy(() => predict(curveX))
    let curveY = ys.dataSync()
    ys.dispose()
    stroke()
    beginPath()
    for (let i = 0; i < curveX.length+1; i++) {
        let x = curveX[i] * width
        let y = curveY[i] * height
        vertex(x, y)
    }
    lineWidth(2)
    closePath()

}
init()
