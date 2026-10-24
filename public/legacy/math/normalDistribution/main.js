let results, camp, var1, iterations

function init() {
    results = []
    var1 = 150
    iterations = 100000

    for (let i = 0; i < iterations; i++) {
        let randomGenerated = randomNormal(var1, var1/4)
        results[i] = floor(randomGenerated)
    }
    camp = Array(var1 * 2).fill().map(() => Array().fill(0))

    for (let i = 0; i < results.length; i++) {
        camp[results[i]]++
    }



    background(255)
    save()
    translate(halfWidth - var1, height / 2)

    for (let i = 0; i < camp.length; i++) {
        fill(150)
        rect(i, 0, 1, -camp[i] / 10)
    }

    fill(255)
    circle(var1, -3, 3)



    restore()

}
let minTest = Infinity
let maxTest = -Infinity
let standarD = 0
function checkminmax() {
    let sum = 0
    let nums = []
    for (let index = 0; index < 100000; index++) {
        nums[index] = randomNormal(0, 1)
        minTest = nums[index] < minTest ? nums[index] : minTest
        maxTest = nums[index] > maxTest ? nums[index] : maxTest
        sum += nums[index]
    }
    let mean = sum / nums.length
    sum = 0
    for (let index = 0; index < nums.length; index++) {
        sum += (nums[index] - mean) ** 2
    }
    standarD = (sum / nums.length) ** 0.5
    // return 
    show()

}
function show() {
    console.log(minTest, maxTest, standarD)
}
checkminmax()
addEventListener('dblclick', init)
function animate() {

}
// setFps(2)
init()



// export default p5;