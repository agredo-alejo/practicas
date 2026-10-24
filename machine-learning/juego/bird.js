class Bird {
    constructor(brain) {
        this.positionY = height / 2
        this.velocity = 0
        this.score = 0
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy()
            let mutation = 0.5
            this.brain.mutate(0.25, random(-mutation, mutation))
        } else {
            this.brain = new NeuralNetwork()
            this.brain.addLayer({
                inputShape: 1,
                units: 1,
                activation: tanh
            })
        }
    }
    think(pipes) {
        // First find the closest pipe
        let closest = null;
        let record = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            let diff = pipes[i].x - birdXPosition;
            if (diff + diferenceAdjust > 0 && diff < record) {
                record = diff;
                closest = pipes[i];
            }
        }
        if (closest != null) {
            let inputs = []
            // console.log(inputs);
            
            inputs[0] = map(this.positionY - closest.centery, input1.min, input1.max, -1, 1)
            // console.log(map(this.positionY - closest.centery, input1.min, input1.max, -1, 1));
            

            // inputs[1] = map(this.velocity, up, maxVelocity, -1, 1)

            // inputs[2] = map(this.positionY - closest.top, input0.min, input0.max, -1, 1)

            // inputs[3] = map(this.positionY - (height - closest.bottom), input1.min, input1.max, -1, 1)

            // inputs[4] = map(birdXPosition - closest.x, input3.min, pipesWidth, -1, 1)

            // Get the outputs from the network
            let decision = this.brain.predict(Matrix.fromArray(inputs));
            // Decide to jump or not!
            // console.log(inputs[0]);
            
            if (decision.data[0] > 0) {
                this.jump()

            }
        }
    }
    draw() {
        fill(255,255,0)
        circle(birdXPosition, this.positionY, size)
    }
    isDead() {
        if (this.positionY + size >= height) {
            this.positionY = height - size
            this.velocity = 0
            return true
        }
        else if (this.positionY - size <= 0) {
            this.positionY = size
            this.velocity = 0
            return true
        }
        else {
            return false
        }
    }
    clone() {
        return new Bird(this.brain)
    }
    jump() {
        this.velocity = up
    }
    save() {
        return this.brain.serialize()
    }
    update() {
        this.velocity += gravity
        this.positionY += this.velocity

        this.score += 0.001
        this.isDead()
        this.draw()
    }

}