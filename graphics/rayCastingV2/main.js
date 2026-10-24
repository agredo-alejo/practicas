let walls, ray, particle, points, mouse
function init() {
    walls = []

    let diff = smallerCanvasSide / 5
    let center = new Vector(width / 2, height / 2)

    let esquina1 = new Vector(center.x - diff, center.y - diff)
    let esquina2 = new Vector(center.x + diff, center.y - diff)
    let esquina3 = new Vector(center.x - diff, center.y + diff)
    let esquina4 = new Vector(center.x + diff, center.y + diff)

    walls.push(new Boundary(
        esquina1, esquina2
    ))
    walls.push(new Boundary(
        esquina3, esquina1
    ))
    walls.push(new Boundary(
        esquina3, esquina4
    ))
    walls.push(new Boundary(
        esquina4, esquina2
    ))

    for (let i = 0; i < 2; i++) {
        let x1 = random(width)
        let x2 = random(width)
        let y1 = random(height)
        let y2 = random(height)
        walls.push(new Boundary(x1, y1, x2, y2))
    }


    walls.push(new Boundary(0, 0, width, 0))
    walls.push(new Boundary(width, 0, width, height))
    walls.push(new Boundary(width, height, 0, height))
    walls.push(new Boundary(0, height, 0, 0))

    particle = new Particle()
}
addEventListener('dblclick', init)
function animate() {
    background(50)
    mouse = new Vector(mouseX, mouseY)
    for (wall of walls) {
        wall.show()
    }


    if (mouseX !== undefined) {
        particle.update(mouseX, mouseY)
    }
    particle.look(walls)
    particle.show()

    points = points.sort((a, b) => {
        return a.angle - b.angle
    })

    save()
    let gradient = ctx.createRadialGradient(mouse.x, mouse.y, 1, mouse.x, mouse.y, smallerCanvasSide / 2);
    gradient.addColorStop(0, styleColor(255, 1))
    gradient.addColorStop(0, styleColor(255, 0.5))
    gradient.addColorStop(1, styleColor(255, 0))

    fill(gradient)
    // fill(255)
    beginPath()
    moveTo(points[0])
    for (point of points) {
        vertex(point)
    }
    closePath()
    restore()

}
init() 