let bestBirdsCoordinates
let worstBirdsCoordinates
let center, vi, vj, vk, vector, changedVector
let scaleV 
let angle = rad(0.25)
let aum = 0.01

function init() {
    
    bestBirdsCoordinates = []
    for (let i = 0; i < bestBirds.length; i++) {
        bestBirdsCoordinates.push(
            new Vector(addWB(bestBirds[i]))
        )
    }
    worstBirdsCoordinates = []
    for (let i = 0; i < bestBirds.length; i++) {
        worstBirdsCoordinates.push(
            new Vector(addWB(worstBirds[i]))
        )
    }
    vi = Vector.right
    vj = Vector.up
    vk = Vector.forward

    vector = createVector(1, 0, 0)
    changedVector = new Vector()

    center = new Vector(width / 2, height / 2)
    scaleV = smallerCanvasSide*0.4
    rotateXT(rad(40))
    rotateYT(rad(30))
    // rotateZT(rad(35))
}
// addEventListener('dblclick', init)

function animate() {
    clearCanvas()
    // background(255, 0.01)

    vector.rotate(aum)
    changedVector = Vector.changeOfBasis(vector, vi, vj, vk)




    if (mouseDragged) {
        let mouse = createVector(mouseX, mouseY)
        mouse.sub(center)


        rotateXT(-mouse.y / 10000);
        rotateYT(mouse.x / 10000);
    }
    if (!mouseDragged) {
        rotateXT(angle)
        rotateYT(angle)
        rotateZT(angle)
    }



    save()
    translate(halfWidth, halfHeight)

    for (let i = 0; i < bestBirdsCoordinates.length; i++) {
        fill(0,255,0)
        circle(Vector.mult(bestBirdsCoordinates[i], scaleV/4), 1)
    }

    for (let i = 0; i < worstBirdsCoordinates.length; i++) {
        fill(255, 0, 0)
        circle(Vector.mult(worstBirdsCoordinates[i], scaleV / 4), 1)
    }

    save()
    lineWidth(3)

    // line(
    //     Vector.zero,
    //     Vector.mult(changedVector, scaleV / 2),
    //     [255, 0, 0]
    // )

    restore()

    line(
        Vector.mult(vi, scaleV),
        Vector.mult(Vector.inverseOf(vi), scaleV)
    )
    line(
        Vector.mult(vj, scaleV),
        Vector.mult(Vector.inverseOf(vj), scaleV)
    )
    line(
        Vector.mult(vk, scaleV),
        Vector.mult(Vector.inverseOf(vk), scaleV)
    )

    let triangleScale = scaleV * 0.15
    let triangleColor = [0, 0, 255, 0.5]
    fill(triangleColor)
    triangle(
        Vector.zero,
        Vector.mult(vi, triangleScale),
        Vector.mult(vj, triangleScale)
    )

    fill(triangleColor)
    triangle(
        Vector.zero,
        Vector.mult(Vector.inverseOf(vi), triangleScale),
        Vector.mult(vk, triangleScale)
    )


    restore()
}
init()

function rotateXT(angle) {
    vi.rotateX(angle)
    vj.rotateX(angle)
    vk.rotateX(angle)
    for (let i = 0; i < bestBirdsCoordinates.length; i++) {
        bestBirdsCoordinates[i].rotateX(angle)
    }
    for(let i = 0; i < worstBirdsCoordinates.length; i++){
        worstBirdsCoordinates[i].rotateX(angle)
    }
}
function rotateYT(angle) {
    vi.rotateY(angle)
    vj.rotateY(angle)
    vk.rotateY(angle)
    for (let i = 0; i < bestBirdsCoordinates.length; i++) {
        bestBirdsCoordinates[i].rotateY(angle)
    }
    for (let i = 0; i < worstBirdsCoordinates.length; i++) {
        worstBirdsCoordinates[i].rotateY(angle)
    }
}

function rotateZT(angle) {
    vi.rotate(angle)
    vj.rotate(angle)
    vk.rotate(angle)
    for (let i = 0; i < bestBirdsCoordinates.length; i++) {
        bestBirdsCoordinates[i].rotate(angle)
    }
    for (let i = 0; i < worstBirdsCoordinates.length; i++) {
        worstBirdsCoordinates[i].rotate(angle)
    }
}
function addWB(bird) {
    let newArray = bird.getWeights()[0][0]
    newArray.push(bird.getBias()[0][0][0])
    return newArray
}