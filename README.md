# Practicas

Browser programming experiments, organized by topic. Original project names and internal project structures are preserved.

Start with [the main gallery](index.html), [first projects](first.html), or [the neural-network gallery](machine-learning/neuralnet/index.html).

## Categories

| Folder | Contents | Projects |
| --- | --- | --- |
| [machine-learning](machine-learning/) | Neural networks, MNIST, regression, convolution, and genetic algorithms | 23 |
| [simulations](simulations/) | Particles, physics, flocking, waves, and cellular automata | 9 |
| [graphics](graphics/) | Canvas drawing, ray casting, ray marching, and 3D/4D graphics | 12 |
| [math](math/) | Coordinates, sequences, complex numbers, distributions, and projections | 5 |
| [games](games/) | Asteroids and roulette | 2 |
| [web-practice](web-practice/) | Web layouts, styling, forms, clocks, and small utilities | 10 |
| [experiments](experiments/) | Scratch projects with broad or unclear scope | 3 |
| [shared](shared/) | Reusable libraries and template assets | 3 |

## Project directory

### machine-learning

- [backprop](machine-learning/backprop/index.html)
- [cnnFeedFordwardVisualization](machine-learning/cnnFeedFordwardVisualization/index.html)
- [convolucion](machine-learning/convolucion/index.html)
- [genetic](machine-learning/genetic/index.html)
- [genetic2](machine-learning/genetic2/index.html)
- [geneticO](machine-learning/geneticO/index.html)
- [juego](machine-learning/juego/index.html)
- [linearRegression](machine-learning/linearRegression/index.html)
- [mnist](machine-learning/mnist/index.html)
- [mnistUser](machine-learning/mnistUser/index.html)
- [neuralnet](machine-learning/neuralnet/index.html)
- [neuralNetwork](machine-learning/neuralNetwork/index.html)
- [newMnist](machine-learning/newMnist/index.html)
- [newMnistUser](machine-learning/newMnistUser/index.html)
- [nn](machine-learning/nn/index.html)
- [nnLayers](machine-learning/nnLayers/index.html)
- [perceptron](machine-learning/perceptron/index.html)
- [polynomialRegression](machine-learning/polynomialRegression/index.html)
- [polynomialRegression3](machine-learning/polynomialRegression3/index.html)
- [repasoVisualizando](machine-learning/repasoVisualizando/index.html)
- [weightsAsInputs](machine-learning/weightsAsInputs/index.html)
- [wightsVisualization](machine-learning/wightsVisualization/index.html)
- [xor](machine-learning/xor/index.html)

### simulations

- [boids](simulations/boids/index.html)
- [circular](simulations/circular/index.html)
- [gameOfLife](simulations/gameOfLife/index.html)
- [gravity](simulations/gravity/index.html)
- [ondas](simulations/ondas/index.html)
- [particulas](simulations/particulas/index.html)
- [solarSystem](simulations/solarSystem/index.html)
- [squareCollision](simulations/squareCollision/index.html)
- [stickyParticles](simulations/stickyParticles/index.html)

### graphics

- [canvas](graphics/canvas/index.html)
- [cube](graphics/cube/index.html)
- [dibujo](graphics/dibujo/index.html)
- [dibujoclick](graphics/dibujoclick/index.html)
- [mapAnimation](graphics/mapAnimation/index.html)
- [random3D](graphics/random3D/index.html)
- [rayCasting](graphics/rayCasting/index.html)
- [rayCastingEjemplo](graphics/rayCastingEjemplo/index.html)
- [rayCastingV2](graphics/rayCastingV2/index.html)
- [rayMarching](graphics/rayMarching/index.html)
- [tesseract](graphics/tesseract/index.html)
- [view](graphics/view/index.html)

### math

- [coordenadas](math/coordenadas/index.html)
- [fibonacci](math/fibonacci/index.html)
- [imaginary](math/imaginary/index.html)
- [normalDistribution](math/normalDistribution/index.html)
- [scalarProyection](math/scalarProyection/index.html)

### games

- [asteroids](games/asteroids/index.html)
- [ruleta](games/ruleta/index.html)

### web-practice

- [cajero](web-practice/cajero/index.html)
- [carga](web-practice/carga/index.html)
- [contra](web-practice/contra/index.html)
- [css-grid](web-practice/css-grid/index.php)
- [hover](web-practice/hover/index.html)
- [logincool](web-practice/logincool/index.html)
- [reloj](web-practice/reloj/index.html)
- [sofia](web-practice/sofia/index.html)
- [tmb](web-practice/tmb/index.html)
- [video](web-practice/video/index.html)

### experiments

- [fuck](experiments/fuck/index.html)
- [joseV](experiments/joseV/index.html)
- [prueba](experiments/prueba/index.html)

### shared

- [libraries](shared/libraries/)
- [neuralnetLib](shared/neuralnetLib/)
- [plantilla](shared/plantilla/)

## Running the projects

Most projects use HTML and JavaScript. To serve this folder locally, run `python -m http.server 8000` here and open http://localhost:8000. The `web-practice/css-grid` project has a PHP entry point and needs a PHP server.

The shared folders stay separate from projects. Relative references in the galleries, demos, and source files were updated after moving the folders. Dataset files and trained models are retained.

## Existing missing references

Some references were already missing before organization. These include references inside commented code; this list is an inventory, not a runtime failure report. The old scalar-projection gallery typo was corrected.

- `graphics/dibujoclick/index.html`: `favicon.ico`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/functions.js`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/matrix.js`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/neuralNetwork.js`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/nnInProcess.js`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/style.css`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../libraries/vectors.js`
- `machine-learning/cnnFeedFordwardVisualization/index.html`: `../../../styles/imagenes/favicon.ico`
- `machine-learning/convolucion/index.html`: `n1n.js`
- `machine-learning/neuralnet/index.html`: `projects/convolution/cnn/index.html`
- `machine-learning/neuralnet/projects/convolution/mnistUser/index.html`: `../../libraries/nd2.js`
- `machine-learning/neuralnet/projects/convolution/mnistUser/index.html`: `../libraries/style.css`
- `machine-learning/neuralnet/projects/convolution/mnistUser/index.html`: `mnist.js`
- `machine-learning/neuralnet/projects/random/xor/index.html`: `nd.js`
- `machine-learning/repasoVisualizando/index.html`: `../../../styles/imagenes/favicon.ico`
- `machine-learning/repasoVisualizando/index.html`: `../../libraries/functions.js`
- `machine-learning/repasoVisualizando/index.html`: `../../libraries/matrix.js`
- `machine-learning/repasoVisualizando/index.html`: `../../libraries/neuralNetwork.js`
- `machine-learning/repasoVisualizando/index.html`: `../../libraries/style.css`
- `machine-learning/repasoVisualizando/index.html`: `../../libraries/vectors.js`
- `math/imaginary/index.html`: `asdfghjkl.js`
- `math/imaginary/index.html`: `p5.js`
- `web-practice/hover/index.html`: `favicon.ico`
- `web-practice/video/index.html`: `gravity.mp4`
