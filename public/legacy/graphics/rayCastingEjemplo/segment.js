class Segment{
    constructor(a, b){
        this.a = a
        this.b = b 
    }
    draw(){
        line(this.a, this.b, [200])
    }
}