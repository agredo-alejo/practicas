class Point {
    constructor() {
        this.x = random(smallerCanvasSide)
        this.y = random(smallerCanvasSide)
        this.label
    }
    init() {
        if (this.x > this.y) {
            this.label = 1
        } else {
            this.label = -1
        }
    }
}