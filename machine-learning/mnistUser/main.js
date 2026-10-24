let pTag = document.querySelector('p')
let img = new Matrix(28, 28)
let resolution = 10
let size = 28 * resolution
let offset

resize(width, size)

function init() {
    offset = width - size
    offset /= 2
}
function animate() {
    userInput()
}
function userInput() {
    let inputs = []
    let k = 0
    for (let i = 0; i < img.rows; i++) {
        for (let j = 0; j < img.cols; j++) {
            inputs[k] = img.data[j][i]

            fill(img.data[i][j] * 255)
            square(offset + i * resolution, j * resolution, resolution)

            k++
        }
    }

    let prediction = model.predict(Matrix.fromArray(inputs))
    let guess = findMax(prediction.data)
    pTag.innerHTML = ''
    pTag.innerHTML = 'Guess: ' + guess + ' '
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
setFps(60)


function mouseDragged() {
    if (mouseX > offset && mouseX < offset + img.rows * resolution) {
        if (mouseY < img.cols * resolution) {
            let row = mouseX - offset
            row = floor(row / resolution)
            let col = floor(mouseY / resolution)

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let col2 = col + i
                    let row2 = row + j
                    // img.data[row2][col2] += 0.1
                    img.data[row2][col2] = Math.min(img.data[row2][col2] + 0.1, 1)
                }
            }

            img.data[row][col] = Math.min(img.data[row][col] + 0.5, 1)
        }
    }
}
addEventListener('dblclick', () => {
    img = new Matrix(28, 28)
})