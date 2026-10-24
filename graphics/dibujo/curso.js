let texto = document.getElementById('inputNumber')
let boton = document.getElementById('Enviar')
let canvas = document.querySelector('canvas')
let c2d = canvas.getContext('2d')
let width = canvas.width

addEventListener('keyup', event => {
	if (event.keyCode == 13) {
		dibujoPorClick()
	}
})
boton.addEventListener('click', dibujoPorClick)

function linea(color, start1, end1, start2, end2) {
	c2d.beginPath()
	c2d.strokeStyle = color
	c2d.moveTo(start1, end1)
	c2d.lineTo(start2, end2)
	c2d.stroke()
	c2d.closePath()
}
function dibujoPorClick() {
	c2d.clearRect(0, 0, canvas.width, canvas.height)
	let lineas = parseFloat(texto.value)
	let space = width / lineas
	for (let i = 0; i < lineas; i++) {
		let op1 = space * i
		let op2 = width - space * (i + 1)
		let op3 = space * (i + 1)
		linea('blue', 0, op1, op3, width)
		linea('blue', op1, 0, width, op3)
		linea('red', 0, op2, op3, 0)
		linea('red', op1, width, width, op2)
	}
	for (let i = 0; i < lineas; i++) {
		let spaceRombo = width / lineas / 2
		let op4 = spaceRombo * i
		linea('green', op4, op4, width / 2 + op4, width / 2 - op4)
		linea('green', width - op4, op4, width / 2 + op4, width / 2 + op4)
		linea('green', op4, width - op4, width / 2 + spaceRombo * (i + 1), width / 2 + spaceRombo * (i + 1))
		linea('green', op4, op4, width / 2 - spaceRombo * (i + 1), width / 2 + spaceRombo * (i + 1))
	}
	bordes()
}
function bordes() {
	linea('green', 0, width, width, 0)
	linea('green', 0, 0, width, width)
	linea('black', 0, 0, width, 0)
	linea('black', 0, 0, 0, width)
	linea('black', width, 0, width, width)
	linea('black', 0, width, width, width)
}
bordes()
