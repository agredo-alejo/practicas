function convolucion(imagen, filtro, strides, paddingP = 'same', dilation = [1, 1]) {
    strides[0] = Math.max(strides[0], 1)
    strides[1] = Math.max(strides[1], 1)

    dilation = [
        Math.max(dilation[0], 1),
        Math.max(dilation[1], 1)
    ]
 
    let internImagen
    let padWidth, padHeight, padTop, padBottom, padLeft, padRight
    if (paddingP == 'same') {
        padWidth = dilation[0] * (filtro.length - 1) + (imagen.length - 1) * (strides[0] - 1)
        padHeight = dilation[1] * (filtro[0].length - 1) + (imagen[0].length - 1) * (strides[1] - 1)


        padTop = Math.floor(padHeight / 2)
        padBottom = padHeight - padTop

        padLeft = Math.floor(padWidth / 2)
        let padRight = padWidth - padLeft

        console.log(padWidth, padHeight);

        internImagen = padding(imagen, [padTop, padBottom, padLeft, padRight])
    } else if (paddingP == 'valid') {
        internImagen = imagen
        padWidth = 0, padHeight = 0
    }

    let imagenResultante = []

    let kernelSize = [filtro.length, filtro[0].length]
    let inputShape = [imagen.length, imagen[0].length]
    // console.log(kernelSize);
    // console.log(inputShape);
    // console.log(dilation);
    // console.log(strides);
    // console.log(padWidth);
    
    
    console.log(padTop);
    
    
    console.table(internImagen);
    
    let outputShape = [
        (inputShape[0] + padWidth - dilation[0] * (kernelSize[0] - 1) - 1) / strides[0] + 1,
        (inputShape[1] + padHeight - dilation[1] * (kernelSize[1] - 1) - 1) / strides[1] + 1,
    ]
    console.log(outputShape);
    

    // let num1 = internImagen.length
    // num1 -= filtro.length + (dilation[0] - 1)
    // num1 /= strides[0]
    // num1 += 1

    // let num2 = internImagen[0].length
    // num2 -= filtro[0].length + (dilation[1] - 1)
    // num2 /= strides[1]
    // num2 += 1



    for (let i = 0; i < outputShape[0]; i++) {
        imagenResultante[i] = []
        for (let j = 0; j < outputShape[1]; j++) {
            let sumatoria = 0
            for (let k = 0; k < filtro.length; k++) {
                for (let w = 0; w < filtro[0].length; w++) {

                    let row = k * dilation[0] + i * strides[0],
                        col = w * dilation[1] + j * strides[1]


                    sumatoria += internImagen[row][col] * filtro[k][w]
                }
            }
            imagenResultante[i][j] = sumatoria
            // imagenResultante[i][j] /= (filtro.length * filtro[0].length)
        }
    }
    return imagenResultante
}


function maxPooling(imagen, filtro, strides, paddingP = 'full') {
    strides[0] = Math.max(strides[0], 1)
    strides[1] = Math.max(strides[1], 1)

    let imagenResultante = []
    if (paddingP == 'full') {
        for (let i = 0; i * strides[0] < imagen.length; i++) {
            imagenResultante[i] = []
            for (let j = 0; j * strides[1] < imagen[0].length; j++) {
                let record = -Infinity
                for (let k = 0; k < filtro[0]; k++) {
                    for (let w = 0; w < filtro[1]; w++) {
                        let row = k + i * strides[0], col = w + j * strides[1]
                        if (row < imagen.length && col < imagen[0].length) {
                            record = Math.max(imagen[row][col], record)
                        }
                    }
                }
                imagenResultante[i][j] = record
            }
        }
    } else if (paddingP == 'valid') {
        for (let i = 0; i * strides[0] + filtro[0] < imagen.length; i++) {
            imagenResultante[i] = []
            for (let j = 0; j * strides[1] + filtro[1] < imagen[0].length; j++) {
                let record = -Infinity
                for (let k = 0; k < filtro[0]; k++) {
                    for (let w = 0; w < filtro[1]; w++) {
                        let row = k + i * strides[0], col = w + j * strides[1]
                        record = Math.max(imagen[row][col], record)
                    }
                }
                imagenResultante[i][j] = record
            }
        }
    }
    return imagenResultante
}

function padding(imagen, size) {
    let imagenResultante = []
    for (let i = 0; i < imagen.length; i++) {
        imagenResultante[i] = imagen[i].slice()
        for (let j = 0; j < size[0]; j++) {
            imagenResultante[i].unshift(0)
        }
        for (let j = 0; j < size[1]; j++) {
            imagenResultante[i].push(0)
        }
    }
    for (let i = 0; i < size[2]; i++) {
        imagenResultante.unshift(new Array(imagenResultante[0].length).fill(0))
    }
    for (let i = 0; i < size[3]; i++) {
        imagenResultante.push(new Array(imagenResultante[0].length).fill(0))
    }
    return imagenResultante
}


function dibujar(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            stroke(100)
            fill(matrix[i][j] / 2 * 255)
            square(j * resolution, i * resolution, resolution)
        }
    }
}

