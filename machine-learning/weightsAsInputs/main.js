let totalPopulation = 70
let activeBirds = []
let allBirds = []
let pipes = []
let size, diferenceAdjust
let counter = 0
let birdArray = []

let cycles = 1
let spacing, pipesWidth
let highScore = 0

let runBest = false
let runBestButton, bestBird, input0, input1, input2, input3, input4, minBottom, maxBottom, maxVelocity, birdXPosition, gravity, up, pipesMin, pipesMax



function init() {
    resize(743, 582)
    spacing = height / 7
    pipesWidth = spacing / 1.5
    size = spacing / 7
    diferenceAdjust = pipesWidth + (size / 2)
    minBottom = height - (height - (spacing + spacing / 2))
    maxBottom = height - (height - ((height - spacing) + spacing / 2))
    birdXPosition = width / 10

    pipesMin = spacing
    pipesMax = height - spacing


    up = -spacing / 12
    gravity = -up / 10


    maxVelocity = Math.sqrt(gravity * (height - size) * 2)



    // Input ranges
    input0 = {
        min: -height + size + spacing * 1.5,
        max: height - size - spacing / 2
    }
    input4 = {
        min: -height + size + spacing / 2,
        max: height - size - minBottom
    }
    input3 = {
        min: -width + birdXPosition,
        max: pipesWidth
    }
    input1 = {
        min: -height + spacing + size,
        max: height - (height - spacing) - size
    }
    resetGame()

    for (let i = 0; i < totalPopulation; i++) {
        let bird = new Bird()
        activeBirds[i] = bird
        allBirds[i] = bird
    }

    
}

addEventListener('keydown', (event) => {
    // console.log(event.keyCode);
    if (event.keyCode == 82) {
        cycles = 0
    }
    if (event.keyCode == 32) {
        allBirds[0].jump()
    }
    if (event.keyCode == 37) {
        cycles -= 2
    }
    if (event.keyCode == 39) {
        cycles += 2
    }
    if (event.keyCode == 80) {
        console.log(bestBird.save());
    }
    cycles = constrain(cycles, 0, 70)
})

let pressingR = false
let pressingL = false
addEventListener('touchstart', (event) => {
    if (event.targetTouches[0].pageX > innerWidth / 2) {
        pressingR = true
    } else {
        pressingL = true
    }
})
addEventListener('touchend', () => {
    if (pressingR) {
        pressingR = false
    }
    if (pressingL) {
        pressingL = false
    }
})

let pressCounter = 0
function animate() {

    background(125, 255, 255)


    if (pressCounter % 2 == 0) {
        if (pressingR) {
            cycles ++
        }
        if (pressingL) {
            cycles -= 3
        }
        cycles = constrain(cycles, 0, 150)
        pressCounter = 0
    }
    pressCounter++

    for (let i = 0; i < cycles; i++) {
        for (let j = pipes.length - 1; j >= 0; j--) {
            pipes[j].update()
            if (pipes[j].offscreen()) {
                pipes.splice(j, 1)
            }
        }

        for (let j = activeBirds.length - 1; j >= 0; j--) {
            let bird = activeBirds[j]

            bird.think(pipes)
            bird.update()

            for (let k = 0; k < pipes.length; k++) {
                if (pipes[k].hits(activeBirds[j])) {

                    let weights = activeBirds[j].brain.getWeights()[0][0]
                    weights[2] = activeBirds[j].brain.getBias()[0][0]
                    let prediction = model.predict(Matrix.fromArray(weights)).data[0][0]

                    if(prediction < 0.25){
                        // console.log(activeBirds[j].save());
                        
                    }

                    // console.log(activeBirds[j].save());
                    
                    
                    activeBirds.splice(j, 1)
                    break
                }
            }
            if (bird.isDead()) {
                // console.log(activeBirds[j].save());
                
                activeBirds.splice(j, 1)
            }
        }

        if (counter % 72 == 0) {
            pipes.push(new Pipe());
            counter = 0
        }

        counter++;

    }
    let tempHighScore = 0
    if (!runBest) {
        // Which is the best bird?
        let tempBestBird = null
        for (let i = 0; i < activeBirds.length; i++) {
            let score = activeBirds[i].score
            if (score > tempHighScore) {
                tempHighScore = score
                tempBestBird = activeBirds[i]
            }
        }
        if (tempHighScore > highScore) {
            highScore = tempHighScore
            bestBird = tempBestBird
        }
    }

    // Draw everything
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].draw();
    }

    if (runBest) {
        bestBird.draw();
    } else {
        for (let i = 0; i < activeBirds.length; i++) {
            activeBirds[i].draw();
        }
        // If we're out of birds go to the next generation
        if (activeBirds.length == 0) {
            nextGeneration();
        }
    }




}
init()
setFps(60)

// addEventListener('keyup', (event) => {
//     if(event.keyCode == 32){
//     activeBirds[0].jump()
//     }
// })



// input0 = {
    //     min: -height + size + spacing * 1.5,
    //     max: height - size - spacing / 2
    // }
    // input4 = {
    //     min: -height + size + spacing / 2,
    //     max: height - size - minBottom
    // }
    // input3 = {
    //     min: -width + birdXPosition,
    //     max: pipesWidth
    // }