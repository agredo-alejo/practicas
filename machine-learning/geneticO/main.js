let boids, food, poison, numPoison, numFood
const colors = [
    // [255, 255, 255],
    [255, 255, 0],
    // [0, 255, 0],
    // [100,100,100]
    // [255,0,255],
    [0, 255, 255],
    // [255,0,0],
    // [0, 150, 255]
    // [0, 0, 0]
]
// Controladores
let numboids = 75
let reproductionSpeed = 0.5
let mutationRate = 0.1
let mutation = 0.5

let diagonalVector 
let diagonalVectorMag 


const createFood = () => {
    let x = random(width)
    let y = random(height)
    food.push(createVector(x, y))
}
const createPoison = () => {
    let x = random(width)
    let y = random(height)
    poison.push(createVector(x, y))
}

function init() {
    diagonalVector = createVector(width, height)
    diagonalVectorMag = diagonalVector.mag()

    numPoison = width * height / 8000
    numFood = numPoison * 2
    if(width == smallerCanvasSide){
        numFood = numPoison * 3
    }
    boids = []
    food = []
    poison = []
    for (let i = 0; i < numboids; i++) {
        boids.push(new Boid())
    }

    for (let i = 0; i < numFood; i++) {
        createFood()
    }
    for (let i = 0; i < numPoison; i++) {
        createPoison()
    }
}
addEventListener('dblclick', init)
function animate() {
    background(50)

    for (let i = 0; i < 50; i++) {
        if (food.length < numFood) {
            createFood()
        }
 
        if (poison.length < numPoison) {
            createPoison()
        }
    }


    if (boids.length == 0) {
        for (let i = 0; i < numboids; i++) {
            boids.push(new Boid())
        }
    }


    food.forEach((food) => {
        circle(food, 2.5)
        fill(0,255,0)
    })
    poison.forEach((poison) => {
        circle(poison, 2.5)
        fill(255,0,0)
    })

    for (let i = boids.length - 1; i >= 0; i--) {
        boids[i].behaviors(food, poison)
        boids[i].update()

        let newBoid = boids[i].clone()
        if (newBoid !== null) {
            boids.unshift(newBoid)
        }


        if (boids[i].dead()) {
            // food.push(createVector(
            //     boids[i].position.x,
            //     boids[i].position.y
            // ))
            boids.splice(i, 1)
        }
    }
}
init()
animate()