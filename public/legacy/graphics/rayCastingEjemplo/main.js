
let mouse  = new Vector()

 // LINE SEGMENTS

let segments = [

    // Border
    new Segment(new Vector(0, 0), new Vector(640, 0) ),
    new Segment(new Vector(640, 0), new Vector(640, 360) ),
    new Segment(new Vector(640, 360), new Vector(0, 360) ),
    new Segment(new Vector(0, 360), new Vector(0, 0) ),

    // Polygon #1
    new Segment(new Vector(100, 150), new Vector(120, 50) ),
    new Segment(new Vector(120, 50), new Vector(200, 80) ),
    new Segment(new Vector(200, 80), new Vector(140, 210) ),
    new Segment(new Vector(140, 210), new Vector(100, 150) ),

    // Polygon #2
    new Segment(new Vector(100, 200), new Vector(120, 250) ),
    new Segment(new Vector(120, 250), new Vector(60, 300) ),
    new Segment(new Vector(60, 300), new Vector(100, 200) ),

    // Polygon #3
    new Segment(new Vector(200, 260), new Vector(220, 150) ),
    new Segment(new Vector(220, 150), new Vector(300, 200) ),
    new Segment(new Vector(300, 200), new Vector(350, 320) ),
    new Segment(new Vector(350, 320), new Vector(200, 260) ),

    // Polygon #4
    new Segment(new Vector(340, 60), new Vector(360, 40) ),
    new Segment(new Vector(360, 40), new Vector(370, 70) ),
    new Segment(new Vector(370, 70), new Vector(340, 60) ),

    // Polygon #5
    new Segment(new Vector(450, 190), new Vector(560, 170) ),
    new Segment(new Vector(560, 170), new Vector(540, 270) ),
    new Segment(new Vector(540, 270), new Vector(430, 290) ),
    new Segment(new Vector(430, 290), new Vector(450, 190) ),

    // Polygon #6
    new Segment(new Vector(400, 95), new Vector(580, 50) ),
    new Segment(new Vector(580, 50), new Vector(480, 150) ),
    new Segment(new Vector(480, 150), new Vector(400, 95) ),

];

let uniquePoints
let points

function animate() {
    background()
    // clearCanvas()
    mouse.set(mouseX, mouseY)

    // animate segments
    for(let seg of segments){
        seg.draw()
    }


    // Get all unique points
    points = []
    for (seg of segments) {
        points.push(seg.a, seg.b)
    }


    uniquePoints = (points => {
        let set = {}
        return points.filter(p => {
            let key = p.x + ',' + p.y
            if(!(key in set)){
                set[key] = true
                return true
            }
        })
    })(points)


    // Get all angles
    let angles = [];
    for (let j = 0; j < uniquePoints.length; j++) {
        let angle = Vector.sub(uniquePoints[j], mouse).heading()
        angles.push(angle - 0.00001, angle, angle + 0.00001)
    }

    // RAYS IN ALL DIRECTIONS
    let intersects = [];
    for (let j = 0; j < angles.length; j++) {
        let angle = angles[j]

        // Calculate dirX & dirY from angle
        let dirX = cos(angle);
        let dirY = sin(angle);

        // Ray from center of screen to mouse
        let ray = new Ray(
            mouse,
            new Vector(mouseX + dirX, mouseY + dirY)
        )


        // Find CLOSEST intersection
        let closestIntersect = null
        for (let i = 0; i < segments.length; i++) {
            let intersect = ray.cast(segments[i])
            if (!intersect) continue
            if (!closestIntersect || intersect.param < closestIntersect.param) {
                closestIntersect = intersect
            }
        }

        // Intersect angle
        if (!closestIntersect) continue
        closestIntersect.angle = angle

        // Add to list of intersects
        intersects.push(closestIntersect)

    }

    // Sort intersects by angle
    intersects = intersects.sort((a, b)=> {
        return a.angle - b.angle
    })

    // animate AS A GIANT POLYGON
    // fill("#dd3838")
    fill(240)
    beginPath()
    moveTo(intersects[0])
    for(intersect of intersects){
        vertex(intersect)
    }
    closePath()

    // animate DEBUG LINES
    for(intersect of intersects){
        // line(mouse, intersect, '#f55')
        line(mouse, intersect, 200)
    }

}
// setFps(0.5)