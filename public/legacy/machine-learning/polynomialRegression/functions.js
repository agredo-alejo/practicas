const canvas = document.querySelector('canvas')
const c2d = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

let width = canvas.width
let height = canvas.height

const mouse = {
    x: undefined,
    y: undefined
}
const colors = [
    'green',
    'blue',
    '#F2E527',
    '#F2AB27',
    '#F2522E'
]
const pi = Math.PI
const random = (min, max) => {
    if (max != undefined) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    else if (min instanceof Array) {
        return min[Math.floor(Math.random() * min.length)]
    }
    else if (typeof min == 'number') {
        return Math.round(Math.random() * min)
    }
    else {
        return Math.random()
    }
}

addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})
addEventListener('touchmove', event => {
    mouse.x = event.targetTouches[0].pageX
    mouse.y = event.targetTouches[0].pageY
})
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    width = canvas.width
    height = canvas.height
    init()
})

// addEventListener('dblclick', () => init())

let frameC = 0

const fps = () => {
    setInterval(() => {
        console.log(frameC);
        frameC = 0
    }, 1000);
}

const map = (number, begin1, end1, begin2, end2) => {
    let newval = (number - begin1) / (end1 - begin1) * (end2 - begin2) + begin2;
    if (begin2 < end2) {
        return constrain(newval, begin2, end2);
    } else {
        return constrain(newval, end2, begin2);
    }

}
const constrain = (number, min, max) => {
    return Math.max(Math.min(number, max), min);
}


const line = (startX, startY, endX, endY) => {
    c2d.beginPath()
    c2d.moveTo(startX, startY)
    c2d.lineTo(endX, endY)
    c2d.closePath()
}
const circle = (x, y, radio = '5', startAngle = 0, endAngle = pi * 2, anticlockwise = true) => {
    c2d.beginPath()
    c2d.arc(x, y, radio, startAngle, endAngle, anticlockwise)
    c2d.closePath()
}
const rect = (x, y, w, h) => {
    c2d.beginPath()
    c2d.rect(x, y, w, h)
    c2d.closePath()
}
const color = (var1 = 0, var2 = 1, var3, alpha = 1) => {
    let intco_lor = var1
    if (var3 !== undefined) {
        intco_lor = 'rgba(' + var1 + ',' + var2 + ',' + var3 + ',' + alpha + ')'
    }
    else if (typeof var1 == 'number' && var3 == undefined) {
        intco_lor = 'rgba(' + var1 + ',' + var1 + ',' + var1 + ',' + var2 + ')'
    }
    strokeStyle(intco_lor)
    fillStyle(intco_lor)
}
const arc = () => c2d.arc()

const fill = () => c2d.fill()

const stroke = () => c2d.stroke()

const lineWidth = (number) => c2d.lineWidth = number

const strokeStyle = (color) => c2d.strokeStyle = color

const fillStyle = (color) => c2d.fillStyle = color

const save = () => c2d.save()

const restore = () => c2d.restore()

const clearCanvas = () => c2d.clearRect(0, 0, width, height)

const beginPath = () => c2d.beginPath()

const closePath = () => c2d.closePath()

const moveTo = (x, y) => c2d.moveTo(x, y)

const vertex = (x, y) => c2d.lineTo(x, y)

const translate = (x, y) => c2d.translate(x, y)

const rotate = (x, y) => c2d.rotate(x, y)
