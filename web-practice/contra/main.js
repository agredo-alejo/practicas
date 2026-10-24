(function () {
    let app = document.getElementById('app');
    let inputCaracteres = document.getElementById('numero-caracteres');
    let configuracion = {
        caracteres: parseInt(inputCaracteres.value),
        simbolos: true,
        numeros: true,
        mayusculas: true,
        minusculas: true
    }
    let caracteres = {
        numeros: '0 1 2 3 4 5 6 7 8 9',
        simbolos: '! @ # $ % ^ & * ( ) _ - + = { [ } ] ; : < , > . ? /',
        mayusculas: 'A B C D E F G H I J K L M N O P Q R S T U V X Y Z',
        minusculas: 'a b c d e f g h i j k l m n o p q r s t u v x y z'
    }
    app.addEventListener('submit', event => event.preventDefault())

    app.elements.namedItem('btn-sumar').addEventListener('click', ()=> {
        configuracion.caracteres++;
        inputCaracteres.value = configuracion.caracteres;
    })
    app.elements.namedItem('btn-restar').addEventListener('click', ()=> {
        if (configuracion.caracteres > 1) {
            configuracion.caracteres--;
            inputCaracteres.value = configuracion.caracteres;
        }

    })
    app.elements.namedItem('simbolos').addEventListener('click', function () {
        btnToggle(this);
        configuracion.simbolos = !configuracion.simbolos;
        if (configuracion.simbolos == false) {
            simbolos.innerHTML = 'No';
        }
        else {
            simbolos.innerHTML = 'Si';
        }

    })
    app.elements.namedItem('numeros').addEventListener('click', function () {
        btnToggle(this);
        configuracion.numeros = !configuracion.numeros;
        if (configuracion.numeros == false) {
            numeros.innerHTML = 'No';
        }
        else {
            numeros.innerHTML = 'Si';
        }

    });
    app.elements.namedItem('mayusculas').addEventListener('click', function () {
        btnToggle(this);
        configuracion.mayusculas = !configuracion.mayusculas;
        if (configuracion.mayusculas == false) {
            mayusculas.innerHTML = 'No';
        }
        else {
            mayusculas.innerHTML = 'Si';
        }

    })
    app.elements.namedItem('generar').addEventListener('click', function () {
        generarPassword();
    })
    app.elements.namedItem('input-password').addEventListener('click', seleccionar)

    function seleccionar() {
        app.elements.namedItem('input-password').select();
    }



    function generarPassword() {
        let caracteresFinales = '';
        let password = '';

        for (propiedad in configuracion) {
            if (configuracion[propiedad] == true) {
                caracteresFinales += caracteres[propiedad] + ' ';
            }
        }

        caracteresFinales = caracteresFinales.trim();

        caracteresFinales = caracteresFinales.split(' ');

        for (let i = 0; i < configuracion.caracteres; i++) {
            password += caracteresFinales[Math.floor(Math.random() * caracteresFinales.length)];

        }
        app.elements.namedItem('input-password').value = password;
    }

    function btnToggle(elemento) {
        elemento.classList.toggle('false');

    }
    generarPassword();
}())