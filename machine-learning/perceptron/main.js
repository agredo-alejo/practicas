let points, numPoints, perceptron, diagonalVector
function init() {

    numPoints = 75
    diagonalVector = createVector(smallerCanvasSide, smallerCanvasSide)
    perceptron = new Perceptron(2, 0.1)

    points = []
    for (let i = 0; i < numPoints; i++) {
        points[i] = new Point()
    }

}
addEventListener('dblclick', init)


setInterval(()=>{
    
    for (point of points) {
        // console.log('i');

        let inputs = [point.x, point.y]
        perceptron.train(inputs, point.label)

    }
}, 1000)


function animate() {
    // console.log('i');
    
    clearCanvas()

    
    save()
    lineWidth(2)
    line(Vector.zero, diagonalVector)
    restore()

    for (point of points) {
        point.init()

        let inputs = [point.x, point.y]
        let guess = perceptron.predict(inputs)
        if (guess == point.label) {
            fill(0, 0, 255)
            circle(point, smallerCanvasSide / 100)
        } else {
            fill(255, 0, 0)
            circle(point, smallerCanvasSide / 100)
        }
    }
}
init()
