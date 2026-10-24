let then, now, acum, steps, counter, blob, lineY
let units = width / 30
let initialSize = 0
let sizeF = 17



let numberLine = (ly) => {
    let spacing = ly

    line(10, spacing, width * 0.9, spacing)
    for (let i = 10; i < width * 0.9; i += units) {
        let lineH = 5
        line(i, spacing - lineH, i, spacing + lineH)
    }
}

let stepCondition = (start, end) => {
    let internStart = start * 60
    let internEnd = end * 60
    return [
        internStart,
        internEnd,
        (counter >= internStart && counter <= internEnd)
    ]
}
let range1, range2
function init() {
    counter = 0
    then = 0
    acum = 0
    steps = 0
    lineY = 40

    range2 = new Blob()
    range1 = new Blob()
    blob = new Blob()

}
let sampleText = (alpha) => {
    font('' + sizeF + 'px Arial')
    fill(0, alpha)
    text('Map(17, 12, 20, 5, 10)', 10, sizeF * 3, width * 0.9)


}
addEventListener('dblclick', init)
function animate() {
    clearCanvas()
    // background(0)

    blob.draw([0, 175, 255])

    numberLine(lineY)

    let step1 = stepCondition(0, Infinity)
    if (step1[2]) {


        font('' + sizeF + 'px Arial')
        fillText('Map(number, start1, end1, start2, end2)', 10, sizeF, width * 0.9)



    }

    let step1_2 = stepCondition(2, 3)
    if (step1_2[2]) {
        let alpha = map(counter, step1_2[0], step1_2[1], 0, 1)
        sampleText(alpha)


    }
    let step1_3 = stepCondition(3, Infinity)
    if (step1_3[2]) {
        let alpha = 1
        sampleText(alpha)

    }

    let step2 = stepCondition(2, 3)
    if (step2[2]) {
        lineY = lerp(40, sizeF * 4, map(counter, step2[0], step2[1], 0, 1))


        let y = lerp(40, sizeF * 4, map(counter, step2[0], step2[1], 0, 1))
        blob.position.set(blob.position.x, y)

        let sizeX = lerp(0, 17, map(counter, step2[0], step2[1], 0, 1))
        blob.size.set(sizeX * units, blob.size.y)

    }

    let step3 = stepCondition(3, 4)
    if (step3[2]) {
        let alpha = map(counter, step3[0], step3[1], 0, 1)
        font('' + sizeF + 'px Arial')
        fill(255, 0, 0, alpha)
        text('Range1 = end1 - start1', 10, sizeF * 9, width * 0.9)
    }

    let step4 = stepCondition(4, Infinity)
    if (step4[2]) {
        // let alpha = map(counter, step4[0], step4[1], 0, 1)
        font('' + sizeF + 'px Arial')
        fill(255, 0, 0)
        text('Range1 = end1 - start1', 10, sizeF * 9, width * 0.9)
    }

    let step5 = stepCondition(4, 5)
    if (step5[2]) {
        range1.position.set(10, sizeF * 12)
        let sizeX = lerp(0, 20, map(counter, step5[0], step5[1], 0, 1))
        range1.size.set(sizeX * units, range1.size.y)
        range1.draw([255, 0, 0])
    }
    let step6 = stepCondition(4, 5)
    if (step6[2]) {

        range1.draw([255, 0, 0])
    }
    let step7 = stepCondition(5, 6)
    if (step7[2]) {
        range1.minVal(12, 10 + 12 * units)

        range1.draw([255, 0, 0])
    }
    let step8 = stepCondition(6, 7)
    if (step8[2]) {
        range1.minVal(12, 10 + 12 * units)

        range1.draw([255, 0, 0])
    }
    let step9 = stepCondition(6, 7)
    if (step9[2]) {
        range1.minVal(12, 10 + 12 * units)

        let sizeX = lerp(20, 8, map(counter, step9[0], step9[1], 0, 1))
        range1.size.set(sizeX * units, range1.size.y)

        let positionX = lerp(0, 12 * units, map(counter, step9[0], step9[1], 0, 1)) + 10
        range1.position.set(positionX, sizeF * 12)

        range1.draw([255, 0, 0])
    }
    let step10 = stepCondition(7, 8)
    if (step10[2]) {



        let positionX = lerp(12 * units, 0, map(counter, step10[0], step10[1], 0, 1)) + 10



        range1.minVal(0, positionX)
        range1.position.set(positionX, sizeF * 12)

        range1.draw([255, 0, 0])
    }
    let step11 = stepCondition(8, Infinity)
    if (step11[2]) {
        range1.draw([255, 0, 0])
    }
    let step5_5 = stepCondition(4, Infinity)
    if (step5_5[2]) {
        numberLine(sizeF * 12)
    }

    // line(mouseX, 0, mouseX, height)

    counter++
}

init()
// let last = 0
// addEventListener('mouseup',(e)=>{
//     console.log(e.x-last);
//     last = e.x
//     // console.log();
//     // line(e.x)
// })