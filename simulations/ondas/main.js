let offset = 0
let amplitude = 50
let waveLength = 25
let frecuency = 0.1
let vel = 0.5
function init() {

}
function animate() {
    clearCanvas()
    stroke()
    beginPath()
    moveTo(0, calc(0) + height / 2)
    for (let i = 0; i < Tau; i += frecuency) {
        let x = map(i, 0, Tau, 0, width)
        vertex(x, calc(x) + height / 2)
    }
    closePath()

    offset -= vel * waveLength
}
init()
function calc(x) {
    return Math.sin((x + offset) / waveLength) * amplitude
}