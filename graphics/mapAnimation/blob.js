class Blob {
    constructor() {
        this.position = createVector(
            10,
            40
        )
        this.size = createVector(
            initialSize * units,
            25
        )
    }
    minVal(val,x){
        fillText('' + val + '', x, this.position.y - 5)
    }
    draw(color) {

        let fadeIterations = 5
        let rg = 255
        for (let i = fadeIterations; i > 0; i--) {
            let color1 = lerpColor(color, [color[0], color[1], color[2], 0], i / fadeIterations)
            let it = createVector(i,i)
            fill(color1)
            rect(Vector.sub(this.position, it), Vector.add(this.size, Vector.mult(it,2)))

        }
        // line(this.size.x, this.position.y + this.size.y - 10, this.size.x, this.size.y + this.size.y+10)
        fillText('' + floor(this.size.x / units) + '', this.position.x + this.size.x, this.position.y - 5)
    }
    update() {
        this.position.add(createVector(0.1, 0))
    }
}