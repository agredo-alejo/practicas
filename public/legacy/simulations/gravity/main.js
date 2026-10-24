let position, velocity, gravity, particles, speed
let friction = 0.99
speed = 3
let valorRadio = {
    min: undefined,
    max: undefined
}
let numBalls = 30

const colors = [
    'green',
    'blue',
    '#F2E527',
    '#F2AB27',
    '#F2522E'
]

function init() {
    particles = []
    valorRadio.min = smallerCanvasSide / 50
    valorRadio.max = valorRadio.min * 3

    for (let i = 0; i < numBalls; i++) {

        let radio = random(valorRadio.min, valorRadio.max)
        let position = createVector(
            random(radio, width - radio),
            random(radio, height - radio)
        )

        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (position.dist(particles[j].position) <= radio + particles[j].radio) {
                    position.x = random(radio, width - radio)
                    position.y = random(radio, height - radio)

                    j = -1;
                }
            }
        }
        particles.push(new Particle(position, radio))
    }
}

gravity = createVector(0, 0.7)

function animate() {
    clearCanvas()

    for (particle of particles) {
        particle.applyForce(gravity)
        particle.update()
    }
}
init()

