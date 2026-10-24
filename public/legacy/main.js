let menuBar = document.getElementById('barraMenu'),
	menuNav = document.getElementById('navegacion'),
	fondo = document.getElementById('contenido');
const clickPosition = {
	x: undefined,
	y: undefined
}
const currentPosition = {
	x: undefined,
	y: undefined
}
let isPressing = false

const hide = () => {
	menuNav.className = 'oculto'
}
const show = () => {
	menuNav.className = 'show'
}
const swipe = () => {
	let xDiference = currentPosition.x - clickPosition.x

	let differenceThreshold = 100
	if (xDiference >= differenceThreshold) {
		// Has swipe to the right
		show()
	}
	if (xDiference <= -differenceThreshold) {
		// Has swipe to the left
		hide()
	}
}

fondo.addEventListener('click', hide)

menuBar.addEventListener('click', () => {
	if (menuNav.className == 'show') {
		hide()
	}
	else {
		show()
	}
})

addEventListener('mousedown', (event) => {
	clickPosition.x = event.clientX
	clickPosition.y = event.clientY
	isPressing = !isPressing
})
addEventListener('mouseup', () => isPressing = !isPressing)

addEventListener('mousemove', (event) => {
	currentPosition.x = event.clientX
	currentPosition.y = event.clientY
	if (isPressing) {
		swipe()
	}
})

addEventListener('touchstart', (event) => {
	clickPosition.x = event.targetTouches[0].pageX
	clickPosition.y = event.targetTouches[0].pageY
})

addEventListener('touchmove', (event) => {
	currentPosition.x = event.targetTouches[0].pageX
	currentPosition.y = event.targetTouches[0].pageY
	swipe()
})

// Handle the loading animation 
window.onload = () => {
	let contenedor = document.getElementById('fondoCarga');
	contenedor.style.visibility = 'hidden';
	contenedor.style.opacity = '0';
}