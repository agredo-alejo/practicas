let pTag = document.querySelector('p')
let img = new Matrix(28, 28)
let resolution = 10
let size = 28 * resolution
let offset, prediction, guess


resize(width, size)

function init() {
    offset = width - size
    offset /= 2
}
function animate() {
    // userInput()
    
}
function userInput() {


    for (let i = 0; i < img.cols; i++) {
        for (let j = 0; j < img.rows; j++) {

            fill(img.data[j][i] * 255)
            square(offset + i * resolution, j * resolution, resolution)

        }
    }

    prediction = model.predict([img])
    guess = findMaxIndex(matrixToVectorArray(prediction))
    pTag.innerHTML = ''
    pTag.innerHTML = 'Guess: ' + guess + ' '
}


init()
setFps(60)


function mouseDragged() {
    
    if (mouseX > offset && mouseX < offset + img.cols * resolution) {
        if (mouseY < img.rows * resolution) {
            let col = floor((mouseX - offset) / resolution)
            let row = floor(mouseY / resolution)


            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let col2 = col + i
                    let row2 = row + j

                    if (row2 < img.data.length && row2 > -1 &&
                        col2 < img.data[0].length && col2 > -1) {

                        img.data[row2][col2] = Math.min(img.data[row2][col2] + 0.1, 1)
                    }
                }
            }
            if (row > -1 && row < img.data.length &&
                col > -1 && col < img.data[0].length) {

                img.data[row][col] = Math.min(img.data[row][col] + 0.5, 1)
            }
        }
    }
    userInput()
}
addEventListener('dblclick', () => {
    img = new Matrix(28, 28)
})


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