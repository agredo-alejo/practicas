// const canvas = document.querySelector('canvas')
// const c2d = canvas.getContext('2d')

// canvas.width = innerWidth
// canvas.height = innerHeight

// let width = canvas.width
// let height = canvas.height


let radio = 50
let x = radio
let velocidad = 1

function animate() {
    // requestAnimationFrame(animate)
    c2d.clearRect(0, 0, width, height)
    
    // c2d.save()
    // c2d.beginPath()
    // c2d.fillStyle = 'blue'
    // c2d.fillRect(x, height / 2, 100, 100)
    // c2d.arc(x, height / 2, radio, 0, Math.PI * 2, false)
    // c2d.fillStyle = 'rgba(200,200,200)'
    // c2d.fill()
    // c2d.closePath()
    // c2d.restore()
    fill(-10,0,2550)
    rect(x, height / 2, 100, 100)
    x += velocidad
    if (x >= width - radio || x < radio) {
        velocidad *= -1
    }
}
animate()