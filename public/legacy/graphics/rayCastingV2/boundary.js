class Boundary {
    constructor(x1, y1, x2, y2) {
        if (x1 instanceof Vector) {
            this.a = x1
            this.b = y1
        } else {
            this.a = createVector(x1, y1)
            this.b = createVector(x2, y2)
        }

    }
    show() {
        save()
        lineWidth(3)
        line(this.a, this.b, [200])
        restore()
    }
} 