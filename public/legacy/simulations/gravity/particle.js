class Particle {
    constructor(position, radio) {
        this.position = position
        this.velocity = Vector.random2D()
        this.velocity.mult(speed)
        this.aceleration = createVector()
        this.radio = radio
        this.mass = this.radio * 2
        this.color = random(colors)
    }
    draw() {
        fill(this.color)
        circle(this.position, this.radio)
    }
    bouncing() {
        if (this.position.x - this.radio <= 0 || this.position.x + this.radio >= width) {
            this.velocity.x = -this.velocity.x * friction

            if (this.position.x + this.radio > width + 1) {
                this.position.x = width - this.radio + 1
            }
            if (this.position.x - this.radio < 0 - 1) {
                this.position.x = 0 + this.radio - 1
            }

        }
        if (this.position.y - this.radio <= 0 || this.position.y + this.radio >= height) {
            this.velocity.y = -this.velocity.y * friction

            if (this.position.y - this.radio < 0 - 1) {
                this.position.y = 0 + this.radio - 1
            }
            if (this.position.y + this.radio > height + 1) {
                this.position.y = height - this.radio + 1
            }
        }
    }
    resolveCollision(particle) {
        let velocityDiff = Vector.sub(this.velocity, particle.velocity)
        let positionDiff = Vector.sub(particle.position, this.position)


        if (velocityDiff.dot(positionDiff) >= 0) {
            let angle = positionDiff.heading()

            const m1 = this.mass;
            const m2 = particle.mass;

            const u1 = Vector.rotate(this.velocity, -angle)
            const u2 = Vector.rotate(particle.velocity, -angle)

            const v1 = createVector(
                u1.x * (m1 - m2) / (m1 + m2) +
                u2.x * 2 * m2 / (m1 + m2),

                u1.y
            )
            const v2 = createVector(
                u1.x * 2 * m1 / (m1 + m2) +
                u2.x * (m2 - m1) / (m1 + m2),

                u2.y
            )

            this.velocity = Vector.rotate(v1, angle)
            particle.velocity = Vector.rotate(v2, angle)

            this.velocity.mult(friction)
            particle.velocity.mult(friction)
        }
    }
    collisions() {
        for (let i = 0; i < particles.length; i++) {
            if (this === particles[i]) continue
            if (this.position.dist(particles[i].position) <=
                this.radio + particles[i].radio) {
                this.resolveCollision(particles[i])
            }
        }
    }
    update() {
        this.bouncing()
        this.collisions()


        this.velocity.add(this.aceleration)
        this.position.add(this.velocity)
        this.aceleration.mult(0)
        this.draw()
    }
    applyForce(force) {
        this.aceleration.add(force)
    }
}