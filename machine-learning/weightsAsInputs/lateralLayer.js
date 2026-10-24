let training_inputs = []
let training_outputs = []

for (let i = 0; i < bestBirds.length; i++) {
    training_inputs.push(Matrix.fromArray(addWB(bestBirds[i])))
    training_outputs.push(Matrix.fromArray([1]))
}
for (let i = 0; i < worstBirds.length; i++){
    training_inputs.push(Matrix.fromArray(addWB(worstBirds[i])))
    training_outputs.push(Matrix.fromArray([0]))
}

let training_data = []
for (let i = 0; i < training_inputs.length; i++) {
    training_data[i] = [training_inputs[i], training_outputs[i]]
}


let modelSerialized = [
    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-51.298132277269886, -35.193705940634366, 2.8330916333976814]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[5.323450340530579]] }], "activationFunction": [{}], "learningRate": 0.1 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-328.9089976630621, -175.17572435822956, -284.6444641619699]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-28.779413696912684]] }], "activationFunction": [{}], "learningRate": 0.1 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-3.0305474641701036, 0.5281752904220209, -1.0503246813003075]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-2.293966075133719]] }], "activationFunction": [{}], "learningRate": 0.1 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-2.1077373860205935, 1.806586804031236, 0.1564344462957849]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-2.87703761105114]] }], "activationFunction": [{}], "learningRate": 0.1 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-2.0797552600551135, 1.5957718119677018, 0.3881995068471255]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-2.577925099107485]] }], "activationFunction": [{}], "learningRate": 0.1 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-1.4887720617087106, 0.5170506502118698, -0.262768587309834]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-1.4357144569356626]] }], "activationFunction": [{}], "learningRate": 0.05 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-1.547737022455639, 0.3767882627928399, -0.34788923198633315]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-1.2053219579560173]] }], "activationFunction": [{}], "learningRate": 0.05 },

    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-1.3765947378349888, 1.1626730641340415, -0.45801053141696046]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-1.977357329823459]] }], "activationFunction": [{}], "learningRate": 0.05 }



]
// let modelSerialized2 = [
//     { "inputShapes": [3, 2, 1], "layers": [2, 1], "weights": [{ "rows": 2, "cols": 3, "data": [[-168.97562163647456, -108.73979989601305, 215.25957610473563], [-40.730550367749366, -111.6947157115531, -4.210082466099475]] }, { "rows": 1, "cols": 2, "data": [[10.73123800137691, -5.064834981334138]] }], "bias": [{ "rows": 2, "cols": 1, "data": [[9.16297169234006], [71.23612369624168]] }, { "rows": 1, "cols": 1, "data": [[-5.187235387186671]] }], "activationFunction": [{}, {}], "learningRate": 0.1 }
// ]



let model = new NeuralNetwork(
    { "inputShapes": [3, 1], "layers": [1], "weights": [{ "rows": 1, "cols": 3, "data": [[-1.3765947378349888, 1.1626730641340415, -0.45801053141696046]] }], "bias": [{ "rows": 1, "cols": 1, "data": [[-1.977357329823459]] }], "activationFunction": [{}], "learningRate": 0.05 }
)
model.activationFunction = [sigmoid]



// let model = new NeuralNetwork()
// let layer1 = {
//     inputShape: 3,
//     units: 1,
//     activation: sigmoid
// }
// let layer2 = {
//     units: 1,
//     activation: sigmoid
// }
// model.addLayer(layer1)
// // model.addLayer(layer2)
// model.setLearningRate(0.05)

let tpsInterval
let trainActive = true
const setTps = (tps) => {
    let constrainedTps = constrain(tps, 0, 60)
    if (tps !== 0) {
        tpsInterval = 60 / constrainedTps
        if (trainActive == false) {
            trainActive = true
            trainFunction()
        }
    } else {
        trainActive = false
    }
}

let stopTrain = () => trainActive = false
let tpsCounter = 0

const trainFunction = () => {
    if (trainActive) {
        requestAnimationFrame(trainFunction)
    }

    if (tpsCounter >= tpsInterval) {
        trainNetwork()
        tpsCounter -= tpsInterval
    }
    tpsCounter++
}
setTps(0)
trainFunction()

let tps = 0
function trainNetwork() {

    for (let i = 0; i < 50000; i++) {
        let data = random(training_data)
        model.train(data[0], data[1])
    }
    // console.table(model.weights[0].data);
    // tps++
}
// setInterval(() => {
//     console.log(tps);
//     tps = 0
// }, 1000);
addEventListener('keyup', (event)=>{
    if(event.keyCode == 78){
        console.log(model.serialize())
    }
    
})
trainNetwork()
function addWB(bird) {
    let newArray = bird.getWeights()[0][0]
    newArray.push(bird.getBias()[0][0][0])
    return newArray
}

