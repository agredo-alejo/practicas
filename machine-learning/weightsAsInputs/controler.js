// Start the game over
function resetGame() {
    counter = 0;
    pipes = [];
}

// Create the next generation
function nextGeneration() {
    resetGame();
    // Generate a new set of birds
    activeBirds = generate(allBirds);
    // Copy those birds to another array
    allBirds = activeBirds.slice();
    // console.log('ya');
    
}

// Generate a new population of birds
function generate(oldBirds) {
    var newBirds = [];
    for (var i = 0; i < totalPopulation; i++) {
        // Select a bird based on fitness
        var bird = poolSelection(oldBirds);
        newBirds[i] = bird;
    }
    return newBirds;
}



// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(birds) {


    let internHighScore = 0
    let internBestBird
    for (let i = 0; i < birds.length; i++) {
        let score = birds[i].score;
        if (score > internHighScore) {
            internHighScore = score;
            internBestBird = birds[i];
        }
    }


    
    return internBestBird.clone();
}