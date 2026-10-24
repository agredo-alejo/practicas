const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let width, height, smallerCanvasSide, biggerCanvasSide, halfWidth, halfHeight

const resize = (ctxWidth = innerWidth, ctxHeight = innerHeight) => {
    canvas.width = ctxWidth
    canvas.height = ctxHeight

    width = canvas.width
    height = canvas.height

    smallerCanvasSide = Math.min(width, height)
    biggerCanvasSide = Math.max(width, height)

    halfWidth = width / 2
    halfHeight = height / 2
}
resize()

const Pi = Math.PI
const HalfPi = Math.PI / 2
const Tau = Math.PI * 2
const Phi = (Math.sqrt(5) + 1) / 2
const Euler = Math.E

const SQRT2 = Math.SQRT2
const SQRT1_2 = Math.SQRT1_2
const LN2 = Math.LN2
const LN10 = Math.LN10
const LOG2E = Math.LOG2E
const LOG10E = Math.LOG10E


// Functions
const random = (x, y) => {
    if (y !== undefined) {
        return (Math.random() * (y - x)) + x
    }
    else if (x instanceof Array) {
        return x[Math.floor(Math.random() * x.length)]
    }
    else if (typeof x == 'number') {
        return Math.random() * x
    }
    return Math.random()
}

const randomRange = (num1, num2) => {
    return Math.random() * (num2 - num1) + num1
}

const randomIndex = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const randomNormal = (mean = 0, sd = 1) => {
    // TODO: change from polar box-muller to ziggurat method
    let rand, rand2, radius
    do {
        rand = Math.random() * 2 - 1
        rand2 = Math.random() * 2 - 1
        radius = rand * rand + rand2 * rand2
    } while (radius >= 1 || radius == 0)
    let stdNorm = rand * Math.sqrt(-2 * Math.log(radius) / radius)
    return sd * stdNorm + mean
}

const degToRad = Math.PI / 180

const rad = angle => angle * degToRad

const radToDeg = 180 / Math.PI

const deg = angle => angle * radToDeg

const normalize = (number, start, end) => {
    return (number - start) / (end - start)
}

const map = (number, start1, end1, start2, end2) => {
    return (number - start1) / (end1 - start1) * (end2 - start2) + start2
}

const constrain = (num, min, max) => Math.max(Math.min(num, max), min)

const lerp = (start = 1, end = 1, alpha = 1) => {
    return (end - start) * alpha + start
}

const lerpColor = (color1, color2, alpha) => {
    return [
        (color2[0] - color1[0]) * alpha + color1[0],
        (color2[1] - color1[1]) * alpha + color1[1],
        (color2[2] - color1[2]) * alpha + color1[2],
        (color2[3] - color1[3]) * alpha + color1[3]
    ]

    // return [
    //         lerp(color1[0], color2[0], alpha),
    //         lerp(color1[1], color2[1], alpha),
    //         lerp(color1[2], color2[2], alpha),
    //         lerp(color1[3], color2[3], alpha)
    //     ]
}

const cartToSph = (x = 0, y = 0, z = 0) => {
    let radius, polar, azimuth = 0
    if (x instanceof Array) {
        radius = Math.hypot(x[0], x[1], x[2])
        azimuth = Math.acos(x[2] / radius)
        polar = Math.atan2(x[1], x[0])
        return [radius, polar, azimuth]
    }
    radius = Math.hypot(x, y, z)
    azimuth = Math.atan2(Math.hypot(x, y), z)
    polar = Math.atan2(y, x)
    return [radius, polar, azimuth]
}

const cartToPolar = (x = 0, y = 0, z = 0) => {
    let radius, angle, polarZ = 0
    if (x instanceof Array) {
        radius = Math.hypot(x[0], x[1])
        angle = Math.atan2(x[1], x[0])
        polarZ = x[2]
        return [radius, angle, polarZ]
    }
    radius = Math.hypot(x, y)
    angle = Math.atan2(y, x)
    polarZ = z
    return [radius, angle, polarZ]
}

const sphToCart = (radius = 1, polar = 0, azimuth = 0) => {
    let x, y, z = 0
    if (radius instanceof Array) {
        x = radius[0] * Math.sin(radius[2]) * Math.cos(radius[1])
        y = radius[0] * Math.sin(radius[2]) * Math.sin(radius[1])
        z = radius[0] * Math.cos(radius[2])
        return [x, y, z]
    }
    x = radius * Math.sin(azimuth) * Math.cos(polar)
    y = radius * Math.sin(azimuth) * Math.sin(polar)
    z = radius * Math.cos(azimuth)
    return [x, y, z]
}

const polarToCart = (radius = 1, angle = 0, zPolar = 0) => {
    let x, y, z = 0
    if (radius instanceof Array) {
        x = radius[0] * Math.cos(radius[1])
        y = radius[0] * Math.sin(radius[1])
        z = radius[2]
        return [x, y, z]
    }
    x = radius * Math.cos(angle)
    y = radius * Math.sin(angle)
    z = zPolar
    return [x, y, z]
}

const polarToSph = (radius = 1, angle = 0, z = 0) => {
    let radio, polar, azimuth = 0
    if (radius instanceof Array) {
        radio = Math.hypot(radius[0], radius[2])
        polar = radius[1]
        azimuth = Math.atan2(radius[0], radius[2])
        return [radio, polar, azimuth]
    }
    radio = Math.hypot(radius, z)
    polar = angle
    azimuth = Math.atan2(radius, z)
    return [radio, polar, azimuth]
}

const sphToPolar = (radius = 1, polar = 0, azimuth = 0) => {
    let radio, angle, z
    if (radius instanceof Array) {
        radio = radius[0] * Math.sin(radius[2])
        angle = radius[1]
        z = radius[0] * Math.cos(radius[2])
        return [radio, angle, z]
    }
    radio = radius * Math.sin(azimuth)
    angle = polar
    z = radius * Math.cos(azimuth)
    return [radio, angle, z]
}

const tan = x => Math.tan(x)

const atan = x => Math.atan(x)

const atan2 = (n1, n2) => Math.atan2(n1, n2)

const cos = x => Math.cos(x)

const acos = x => Math.acos(x)

const sin = x => Math.sin(x)

const asin = x => Math.asin(x)

const round = x => Math.round(x)

const floor = x => Math.floor(x)

const ceil = x => Math.ceil(x)

const trunc = x => Math.trunc(x)

const pow = (num, exp = 2) => Math.pow(num, exp)

const sqrt = x => Math.sqrt(x)

const log = x => Math.log(x)

const min = x => Math.min(x)

const max = x => Math.max(x)

const sign = x => Math.sign(x)

const abs = x => Math.abs(x)

const hypot = (...arguments) => {
    let result = 0
    if (arguments[0] instanceof Array) {
        for (let i = 0; i < arguments[0].length; i++) {
            result += arguments[0][i] ** 2
        }
        return Math.sqrt(result)
    }
    for (let i = 0; i < arguments.length; i++) {
        result += arguments[i] ** 2
    }
    return Math.sqrt(result)
}

const array2d = (rows, cols, content = 0) => {
    return Array(rows).fill().map(() => Array(cols).fill(content))
}


// Canvas 2D
const rgba = (r, g, b, alpha = 1) => {
    if (r instanceof Array) {
        let a = r[3] || alpha
        return 'rgba(' + r[0] + ',' + r[1] + ',' + r[2] + ',' + a + ')'
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}
const grayScale = (num, alpa = 1) => {
    if (num instanceof Array) {
        let a = num[1] || alpha
        return 'rgba(' + num[0] + ',' + num[0] + ',' + num[0] + ',' + a + ')'
    }
    return 'rgba(' + num + ',' + num + ',' + num + ',' + alpa + ')'
}

let fillAllowed = false
let strokeAllowed = false
const line = (num1, num2, num3) => {
    ctx.beginPath()
    ctx.moveTo(num1.x, num1.y)
    ctx.lineTo(num2.x, num2.y)
    if (num3 !== undefined) {
        ctx.save()
        ctx.strokeStyle = styleColor(num3)
        ctx.stroke()
        ctx.restore()
        ctx.closePath()
        return
    }
    ctx.stroke()
    ctx.closePath()
}
const lineCoords = (num1, num2, num3, num4, num5) => {
    ctx.beginPath()
    ctx.moveTo(num1, num2)
    ctx.lineTo(num3, num4)
    if (num5 !== undefined) {
        ctx.save()
        ctx.strokeStyle = styleColor(num5)
        ctx.stroke()
        ctx.restore()
        ctx.closePath()
        return
    }
    ctx.stroke()
    ctx.closePath()
}
const triangleCoords = (p1, p2, p3, p4, p5, p6) => {
    ctx.beginPath()
    ctx.moveTo(p1, p2)
    ctx.lineTo(p3, p4)
    ctx.lineTo(p5, p6)
    ctx.lineTo(p1, p2)

    if (fillAllowed) {
        ctx.fill()
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.stroke()
        ctx.restore()
        strokeAllowed = false
    }
    ctx.closePath()
}
const trianglePolar = (p1, p2, p3) => {
    ctx.beginPath()
    ctx.moveTo(p1[0] * Math.cos(p1[1]), p1[0] * Math.sin(p1[1]))
    ctx.lineTo(p2[0] * Math.cos(p2[1]), p2[0] * Math.sin(p2[1]))
    ctx.lineTo(p3[0] * Math.cos(p3[1]), p3[0] * Math.sin(p3[1]))
    ctx.lineTo(p1[0] * Math.cos(p1[1]), p1[0] * Math.sin(p1[1]))

    if (fillAllowed) {
        ctx.fill()
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.stroke()
        ctx.restore()
        strokeAllowed = false
    }
    ctx.closePath()
}
const triangle = (p1, p2, p3) => {
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.lineTo(p1.x, p1.y)

    if (fillAllowed) {
        ctx.fill()
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.stroke()
        ctx.restore()
        strokeAllowed = false
    }
    ctx.closePath()
}

const circle = (p1, p2, p3, p4, p5, p6) => {
    if (p1 instanceof Object) {
        arc(p1.x, p1.y, p2, p3, p4, p5)
        return
    }
    arc(p1, p2, p3, p4, p5, p6)
}
const arc = (x, y, radius = 5, startAngle = 0, endAngle = Tau, anticlockwise = true) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    if (fillAllowed) {
        ctx.fill()
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.stroke()
        ctx.restore()
        strokeAllowed = false
    }
    ctx.closePath()
}
const square = (num1, num2, num3) => {
    if (num1 instanceof Object) {
        if (fillAllowed) {
            ctx.fillRect(num1.x, num1.y, num2, num2)
            ctx.restore()
            fillAllowed = false
        }
        if (strokeAllowed) {
            ctx.strokeRect(num1.x, num1.y, num2, num2)
            ctx.restore()
            strokeAllowed = false
        }
        return
    }
    if (fillAllowed) {
        ctx.fillRect(num1, num2, num3, num3)
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.strokeRect(num1, num2, num3, num3)
        ctx.restore()
        strokeAllowed = false
    }
}
const rect = (num1, num2, num3, num4) => {
    if (num1 instanceof Object) {
        if (fillAllowed) {
            ctx.fillRect(num1.x, num1.y, num2, num3)
            ctx.restore()
            fillAllowed = false
        }
        if (strokeAllowed) {
            ctx.strokeRect(num1.x, num1.y, num2, num3)
            ctx.restore()
            strokeAllowed = false
        }
        return
    }
    if (fillAllowed) {
        ctx.fillRect(num1, num2, num3, num4)
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.strokeRect(num1, num2, num3, num4)
        ctx.restore()
        strokeAllowed = false
    }
}
const fillRect = (x, y, w, h) => ctx.fillRect(x, y, w, h)
const strokeRect = (x, y, w, h) => ctx.strokeRect(x, y, w, h)

const styleColor = (var1, var2 = 1, var3, alpha = 1) => {
    if (typeof var1 == 'number') {
        if (var3 == undefined) {
            return 'rgba(' + var1 + ',' + var1 + ',' + var1 + ',' + var2 + ')'
        }
        return 'rgba(' + var1 + ',' + var2 + ',' + var3 + ',' + alpha + ')'
    }
    else if (var1 instanceof Array) {
        if (var1[2] == undefined) {
            let a = var1[1] || var2
            return 'rgba(' + var1[0] + ',' + var1[0] + ',' + var1[0] + ',' + a + ')'
        }
        let a = var1[3] || var2
        return 'rgba(' + var1[0] + ',' + var1[1] + ',' + var1[2] + ',' + a + ')'
    }
    return var1
}
const fill = (p1, p2, p3, p4) => {
    ctx.save()
    ctx.fillStyle = styleColor(p1, p2, p3, p4)
    fillAllowed = true
}
const stroke = (p1, p2, p3, p4) => {
    ctx.save()
    ctx.strokeStyle = styleColor(p1, p2, p3, p4)
    strokeAllowed = true
}

const background = (p1, p2, p3, p4) => {
    if (p1 !== undefined) {
        ctx.save()
        ctx.fillStyle = styleColor(p1, p2, p3, p4)
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
        return
    }
    ctx.fillRect(0, 0, width, height)
}



const lineWidth = (number) => ctx.lineWidth = number

const save = () => ctx.save()

const restore = () => ctx.restore()

const clearCanvas = () => ctx.clearRect(0, 0, width, height)

const clearRect = (x, y, w, h) => ctx.clearRect(x, y, w, h)

const beginPath = () => ctx.beginPath()

const scale = (x, y) => {
    if (y == undefined) {
        ctx.scale(x, x)
    } else {
        ctx.scale(x, y)
    }
}

const closePath = () => {
    if (fillAllowed) {
        ctx.fill()
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.stroke()
        ctx.restore()
        strokeAllowed = false
    }
    ctx.closePath()
}

const text = (text, x, y, maxWidth) => {
    let positionX = x
    let positionY = y
    let internMaxWidth = maxWidth
    if (x instanceof Array) {
        positionX = x[0]
        positionY = x[1]
        internMaxWidth = y
    } else if (x instanceof Object) {
        positionX = x.x
        positionY = x.y
        internMaxWidth = y
    }
    if (fillAllowed) {
        ctx.fillText('' + text + '', positionX, positionY, internMaxWidth)
        ctx.restore()
        fillAllowed = false
    }
    if (strokeAllowed) {
        ctx.strokeText('' + text + '', positionX, positionY, internMaxWidth)
        ctx.restore()
        strokeAllowed = false
    }
}

const fillText = (text, x, y, maxWidth) => {
    ctx.fillText('' + text + '', x, y, maxWidth)
}

const font = (string) => {
    ctx.font = string
}

const moveTo = (x, y) => {
    if (x instanceof Object) {
        ctx.moveTo(x.x, x.y)
        return
    }
    ctx.moveTo(x, y)
}

const vertex = (x, y) => {
    if (x instanceof Object) {
        ctx.lineTo(x.x, x.y)
        return
    }
    ctx.lineTo(x, y)
}

const translate = (x, y) => {
    if (x instanceof Object) {
        ctx.translate(x.x, x.y)
        return
    }
    ctx.translate(x, y)
}

const rotate = angle => ctx.rotate(angle)

// Event listeners
let mouseX
let mouseY
addEventListener('mousemove', event => {
    mouseX = event.clientX
    mouseY = event.clientY
    if (mouseIsDragged) {
        mouseDragged()
    }
})
addEventListener('touchmove', event => {
    mouseX = event.targetTouches[0].pageX
    mouseY = event.targetTouches[0].pageY
    if (mouseIsDragged) {
        mouseDragged()
    }
})

addEventListener('resize', () => {
    resize()
    init()
})
let mouseIsDragged = false
addEventListener('mousedown', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
    mouseIsDragged = true
})
addEventListener('touchstart', (event) => {
    mouseX = event.targetTouches[0].pageX
    mouseY = event.targetTouches[0].pageY
    mouseIsDragged = true
})
addEventListener('mouseup', () => {
    mouseIsDragged = false
})
addEventListener('touchend', () => {
    mouseIsDragged = false
})
function mouseDragged() {

}
let fpsInterval
let animationActive = true

const setFps = (fps) => {
    let constrainedFps = constrain(fps, 0, 60)
    if (fps !== 0) {
        fpsInterval = 60 / constrainedFps
        if (animationActive == false) {
            animationActive = true
            animationFunction()
        }
    } else {
        animationActive = false
    }
}

let fps = 0
let framesPerSecond = 0
let fpsBool = false

const showFps = () => {
    fpsBool = true
}
const hideFps = () => {
    fpsBool = false
}
setInterval(() => {
    fps = framesPerSecond
    if (fpsBool) {
        console.log(fps);
    }
    framesPerSecond = 0
}, 1000);

let stopAnimation = () => animationActive = false
let fpsCounter = 0

const animationFunction = () => {
    if (animationActive) {
        requestAnimationFrame(animationFunction)
    }

    if (fpsCounter >= fpsInterval) {
        framesPerSecond++
        animate()
        fpsCounter -= fpsInterval
    }
    fpsCounter++
}
setFps(60)
animationFunction()

function init() {

}
function animate() {

}
function mousemove(event) {

}
addEventListener('mousemove', event => mousemove(event))

function keydown(event) {
    
}
addEventListener('keydown', event => keydown(event))