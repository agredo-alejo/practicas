class Point{
    constructor(){
        this.x = random(0, canvas.width)
        this.y = random(0, canvas.height)
        this.label
        this.color
    }
    labelCondition(){
        if(this.x > this.y){
            this.label = 1
        }
        else{
            this.label = -1
        }
    }
    init(){
        this.labelCondition()
    }
}