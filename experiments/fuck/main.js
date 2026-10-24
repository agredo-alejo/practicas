let a,b
addEventListener('dblclick', setup)
function setup() {
    angleMode(DEGREES)
    a = new p5.Vector(1,2)
    // console.log(degrees(acos(a.z/Math.hypot(a.x,a.y))));
    console.log(a);
    p5.Vector = 1
    b = new p5.Vector(3,4)
    console.log(b);
    
    
    
}