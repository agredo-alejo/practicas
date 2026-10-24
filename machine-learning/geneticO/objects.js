class Boid {
    constructor(position, dna) {
        this.position = position || createVector(random(width), random(height))
        this.velocity = Vector.random2D()
        this.acceleration = createVector()
        this.size = diagonalVectorMag / 200
        if(width == smallerCanvasSide){
            this.size = diagonalVectorMag / 150
        }
        this.color = [0, 255, 0]
        let maxSpeed = diagonalVectorMag / 200
        let maxForce = maxSpeed / 20

        this.health = 1
        this.isDead = false
        this.dna = []

        if (dna == undefined) {
            let perception = diagonalVectorMag / 10
            let force = 5
            this.dna = [
                // Food force [0]
                random(force),
                // Poison force [1]
                random(-force),
                // Others force [2]
                random(force),
                // Food perception [3]
                random(perception),
                // Poison perception [4]
                random(perception),
                // Others perception [5]
                random(perception/3),
                // Reproduction rate [6]
                random(0.5,1),
                // Mutation amount [7]
                random(),
                // Mutation rate [8]
                random(0.5,1),
                // Max speed [9]
                random(maxSpeed/2, maxSpeed),
                // Max force [10]
                random(maxForce/2, maxForce),
                // Color [11]
                random(colors.slice())
            ]
        } else {
            for (let i = 0; i < dna.length; i++) {
                if (i !== 11) {
                    this.dna[i] = dna[i]
                }
                else {
                    this.dna[i] = dna[i].slice()
                }
            }
            // this.dna = dna.slice()

            // Mutate
            if (random() < mutationRate) {
                let index = floor(random(this.dna.length))
                if (index !== 11) {
                    
                    let dnaToMutate = this.dna[index]
                    // console.log(this.dna[index])
                    this.dna[index] += random(-dnaToMutate, dnaToMutate) * this.dna[7]
                    // console.log(this.dna[index]);

                    this.dna[6] = constrain(this.dna[6], 0.1, 1)
                    this.dna[7] = constrain(this.dna[7], 0.1, 1)
                    this.dna[8] = constrain(this.dna[8], 0.5, 1)



                    let index2 = floor(random(this.dna[11].length))


                    let cambio = 255
                    this.dna[11][index2] += random(-cambio, cambio)

                    this.dna[11][index2] = constrain(this.dna[11][index2], 0, 255)
                }
            }
            let sum = this.dna[11].reduce((acc, val) => acc += val)
            let suma = (x) => x += 100
            if (sum < 255) {
                this.dna[11] = this.dna[11].map(suma)
            }

        }

        


    }
    avoidEdges() {
        let distance = 15
        let desired = null;
        if (this.position.x < distance) {
            desired = createVector(this.dna[9], this.velocity.y);
        } else if (this.position.x > width - distance) {
            desired = createVector(-this.dna[9], this.velocity.y);
        }

        if (this.position.y < distance) {
            desired = createVector(this.velocity.x, this.dna[9]);
        } else if (this.position.y > height - distance) {
            desired = createVector(this.velocity.x, this.dna[9]);
        }

        if (desired !== null) {
            desired.setMag(this.dna[9]);
            let steer = Vector.sub(desired, this.velocity);
            steer.maxMag(this.dna[10] * 5);
            this.applyForce(steer);
        }
    }
    edges(){
        if(this.position.x > width){
            // this.position.x = 0
            this.health -= 100
        }else if(this.position.x < 0){
            // this.position.x = width
            this.health -= 100
        }
        if (this.position.y > height) {
            // this.position.y = 0
            this.health -= 100
        } else if (this.position.y < 0) {
            // this.position.y = height
            this.health -= 100
        }
    }
    seek(target) {
        let desired = Vector.sub(target, this.position)
        desired.setMag(this.dna[9])
        let steer = Vector.sub(desired, this.velocity)
        steer.maxMag(this.dna[10])
        return steer
    }
    eat(array, nutricion, perception) {
        let record = Infinity
        let closest = null
        for (let i = array.length - 1; i >= 0; i--) {
            let distance = this.position.dist(array[i])

            if (distance < this.dna[9]) {
                array.splice(i, 1)
                this.health += nutricion
            }
            else {
                if (distance < record && distance < perception) {
                    record = distance
                    closest = array[i]
                }
            }
        }
        if (closest !== null) {
            return this.seek(closest)
        }
        return createVector()
    }
    separation(boidsArray) {
        let steering = new Vector()
        let total = 0
        for (let other of boidsArray) {
            let distance = this.position.dist(other.position)

            if (other != this && distance < this.dna[5]) {
                let diff = this.position.copy()
                diff.sub(other.position)

                diff.div(distance)

                steering.add(diff)
                total++
            }
        }
        if (total > 0) {
            steering.div(total)
            steering.setMag(this.dna[9])
            steering.sub(this.velocity)
            steering.maxMag(this.dna[10])
        }
        return steering
    }
    behaviors(good, bad) {
        let steerG = this.eat(good, 0.2, this.dna[3])
        let steerB = this.eat(bad, -500, this.dna[4])
        let separation = this.separation(boids)


        steerG.mult(this.dna[0])
        steerB.mult(this.dna[1])
        separation.mult(this.dna[2])

        this.applyForce(steerG)
        this.applyForce(steerB)
        this.applyForce(separation)
    }
    dead() {
        this.isDead = this.health < 0
        return this.isDead
    }
    clone() {
        if (random() < this.dna[6] && this.health > 3) {
            let positionSon = this.position.copy()
            let diferencia = Vector.random2D()
            diferencia.mult(10)
            positionSon.add(diferencia)

            // this.health /= 2

            return new Boid(positionSon, this.dna.slice())
        }
        else {
            return null
        }

    }
    draw() {
        save()
        translate(this.position)
        rotate(this.velocity.heading())


        let red = [255, 0, 0]
        let green = [0, 255, 0]
        this.color = lerpColor(red, green, this.health)



        // triangle(this.position, this.size * 1.75, this.size, this.size, 0, rad(120))
        // fill(this.color)

        circle(Vector.zero, 4)
        fill(this.dna[11])

        // // Food Perception
        // circle(Vector.zero, this.dna[3])
        // stroke(0,255,0)

        // //Poison Perception 
        // circle(Vector.zero, this.dna[4])
        // stroke(255,0,0)

        // //Others Perception 
        // circle(Vector.zero, this.dna[5])
        // stroke(255)

        // // Food force
        // line(Vector.zero, Vector.mult(Vector.right, this.dna[0]*10), [0,255,0])

        // // Poison force
        // line(Vector.zero, Vector.mult(Vector.right, this.dna[1] * 10), [255, 0, 0])

        // // Others force
        // line(Vector.zero, Vector.mult(Vector.right, this.dna[2] * 10), 255)



        restore()
    }
    update() {
        this.avoidEdges()
        this.edges()
        this.health -= 0.005

        for (let i = 0; i < boids.length; i++) {
            if (this === boids[i]) continue
            if (this.position.dist(boids[i].position) < 3) {
                this.health -= 0.5
            }
        }

        this.velocity.add(this.acceleration)
        this.velocity.maxMag(this.dna[9])
        this.position.add(this.velocity)
        this.acceleration.mult(0)
        this.draw()
    }
    applyForce(force) {
        this.acceleration.add(force)
    }
}