let escala
let spacing
let matrices = []
let nMatrices = 3
let nFilters = 3
let nFilters2 = 1
let matricesSize = [35,35]
let filters = []
let filterSize = [3,3]
let resultados = []
let resultados2 = []

let filters2 = []
let distanciamiento

for (let i = 0; i < nFilters; i++) {
    filters[i] = randomizeMatrix(
        array2d(filterSize[0], filterSize[1]),
        [-1, 1]
    )

}
function init() {
    escala = 3
    // spacing = escala / 10
    spacing = 5
    for (let i = 0; i < nMatrices; i++) {
        matrices[i] = randomizeMatrix(
            array2d(matricesSize[0], matricesSize[1]),
            [-1, 1]
        )

    }
    // let mitadEnAltura = Math.floor(matrices[0].length / 2)
    for (let i = 0; i < matrices[0][0].length; i++) {
        let mitad = Math.floor(matrices[0].length / 2)
        // if (i > mitad) {
            for (let j = 0; j < matrices[0][i].length; j++) {
                matrices[0][mitad-1][j] = 1
                matrices[0][mitad][j] = 1
                matrices[0][mitad+1][j] = 1
            }
        // }
    }
    for (let i = 0; i < matrices[0].length; i++) {
        let mitad2 = Math.floor(matrices[0][0].length / 2)
        for (let j = 0; j < matrices[0][0].length; j++) {
            // if (j > mitad2) {
            matrices[1][i][mitad2-1] = 1    
            matrices[1][i][mitad2] = 1
            matrices[1][i][mitad2+1] = 1
            // }
        }

    }

    
    for (let i = 0; i < nFilters2; i++) {
        filters2[i] = randomizeMatrix(
            array2d(3,3),
            [-1, 1]
        )

    }

    if (nFilters[0] == 5) {

        filters[0] = [
            [0, -1, 0, 1, 0],
            [0, -1, 0, 1, 0],
            [0, -1, 0, 1, 0],
            [0, -1, 0, 1, 0],
            [0, -1, 0, 1, 0],
        ]
        filters[1] = [
            [0, 0, 0, 0, 0],
            [-1, -1, -1, -1, -1],
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0]
        ]
    }
    else {
        filters[0] = [
            [-1, -1, -1],
            [0, 0, 0],
            [1, 1, 1]
        ]
        filters[1] = [
            [-1, 0, 1],
            [-1, 0, 1],
            [-1, 0, 1],
        ]
    }

    filters2[0] = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
    ]
    filters2[1] = [
        [-1, 0, -1],
        [0, -1, 0],
        [-1, 0, -1],
    ]

    // filters2[0] = [
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    // ]
    // resultados = convolution(matrices[0], filters[0])
    resultados = chanels(matrices, filters)
    resultados2 = chanels(resultados, filters2)
    // escala = smallerCanvasSide / (nMatrices * matricesSize[0])

    distanciamiento = escala + spacing

}
function animate() {
    init()
    for (let i = 0; i < matrices.length; i++) {
        drawMatrix(matrices[i], escala, 0, i * (matrices[i].length * escala + spacing))

    }
    for (let i = 0; i < filters.length; i++) {
        drawMatrix(filters[i], escala, (matrices[0].length * escala + spacing), i * (filters[i].length * escala + spacing))

    }
    for (let i = 0; i < resultados.length; i++) {
        drawMatrix(resultados[i], escala,
            (matrices[0].length * escala + spacing) + (filters[0].length * escala + spacing),

            i * (resultados[i].length * escala + spacing)
        )
    }
    for (let i = 0; i < filters2.length; i++) {
        drawMatrix(filters2[i], escala,

            (matrices[0].length * escala + spacing) +
            (filters[0].length * escala + spacing) +
            (resultados[0].length * escala + spacing),


            i * (filters2[i].length * escala + spacing))

    }
    for (let i = 0; i < resultados2.length; i++) {
        drawMatrix(resultados2[i], escala,

            (matrices[0].length * escala + spacing) +
            (filters[0].length * escala + spacing) +
            (resultados[0].length * escala + spacing) +
            (filters2[0].length * escala + spacing),


            i * (resultados2[i].length * escala + spacing))

    }


}
init()
setFps(10)
