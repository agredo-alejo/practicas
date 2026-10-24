let ball1, ball2

class Square {
    constructor(position, size, color) {
        this.position = position
        this.size = createVector(size, size)
        this.color = color
    }
    draw() {
        fill(this.color)
        rect(this.position, this.size)
    }
}

function colide(a, b) {
    if (a.position.x + a.size.x >= b.position.x && a.position.x <= b.position.x + b.size.x) {
        
        if (a.position.y + a.size.y >= b.position.y && a.position.y <= b.position.y + b.size.y) {
            return true
        }
    }

}


function init() {
    let position = createVector(width / 3, height / 3)
    ball2 = new Square(position, 100, [255, 0, 0])

}

function animate() {
    clearCanvas()

    let mouse = createVector(mouseX, mouseY)
    ball1 = new Square(mouse, 30, 0)
    ball2.draw()

    if (colide(ball1, ball2)) {
        ball1.color = [0, 0, 255]
    } else {
        ball1.color = 0
    }
    ball1.draw()

}

init()