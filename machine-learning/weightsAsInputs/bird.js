class Bird {
    constructor(brain) {
        this.positionY = height / 2
        this.velocity = 0
        this.score = 0
        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy()
            let mutation = 0.5
            this.brain.mutate(0.45, random(-mutation, mutation))
        } else {
            this.brain = new NeuralNetwork()
            let layer1 = {
                inputShape: 2,
                units: 1,
                activation: tanh
            }
            this.brain.addLayer(layer1)
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
            
            inputs[0] = map(closest.centery, pipesMin, pipesMax, -1, 1)

            inputs[1] = map(this.positionY, 0, height, -1, 1)


            // Get the outputs from the network
            let decision = this.brain.predict(Matrix.fromArray(inputs));
            // Decide to jump or not!
            if (decision.data[0] > 0) {
                this.jump()
            }
        }
    }
    draw() {
        let weights = this.brain.getWeights()[0][0]
        weights[2] = this.brain.getBias()[0][0]
        let prediction = model.predict(Matrix.fromArray(weights)).data[0][0]
        
        // let color = prediction
        fill(255,255 * prediction,0)
        circle(birdXPosition, this.positionY, size)
    }
    isDead() {
        if (this.positionY + size >= height) {
            // this.positionY = height - size
            // this.velocity = 0
            return true
        }
        else if (this.positionY - size <= 0) {
            // this.positionY = size
            // this.velocity = 0
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
        if(this.score >= 150){
            console.log(this.save());
            cycles = 0
        }
        this.velocity += gravity
        this.positionY += this.velocity

        this.score += 0.001
        this.isDead()
        this.draw()
    }

}