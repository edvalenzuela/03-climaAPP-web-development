
const container = document.querySelector('.container'),
			resultado = document.querySelector('#resultado'),
			formulario = document.querySelector('#formulario');

/* 
	TODO: https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
	*Agrego el evento a la ventana window para que este todo el DOM cargado y no se generen posibles problemas
	* capturo el evento de tipo submit del Boton de verClima 
*/ 
window.addEventListener('load', () => {

	formulario.addEventListener('submit', getClima);

})

/*
	TODO: https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	*Ocupo el preventDefault para evitar el flujo de eventos click
	*Capturo el valor de los elementos de HTML y válido que tenga algún valor
	*Luego, realizo el llamado a la API mediante una función
*/
const getClima = e => {
	e.preventDefault();

	const ciudad = document.querySelector('#ciudad').value;
	const pais = document.querySelector('#pais').value;

	if(!ciudad || !pais){

		showErrorDetected('Campos obligatorios !!!');
		return;
	}

	getAPIClima(ciudad, pais);

}

// * Capturo los errores de validación y evito que se vuelva a repetir el mensaje
const showErrorDetected = (error) => {

	const alertDetected = document.querySelector('.fs-1');

	if(!alertDetected){
		const divAlerta = document.createElement('div');
		divAlerta.classList.add('fs-1', 'error-txt', 'text-center');
	
		divAlerta.innerHTML = `
			<span>${error}</span>
		`;
	
		container.appendChild(divAlerta);
	
		setTimeout(() => {
			divAlerta.remove();
		}, 2000);
	}
	
}

//* Capturo la data de la API junto con su apiKey en un Then
const getAPIClima = (ciudad, pais) => {

	const appID = 'd16761427c6b58805bbc393d57704d98';
	const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

	console.log({URL});

	fetch(URL)
		.then( resp => resp.json() )
		.then( data => {
			console.log({data})
			cleanHTML();
			if(data.cod === "404"){
				showErrorDetected('Ciudad not found');
				return;
			}
			showClima(data);
		})
		.catch( error => console.log(error))

}

//* Capturo la información para ser mostrado en el HTML
const showClima = (data) => {
	const { main: {temp} } = data;

	const celsius = calCelsius(temp);

	const tempActual = document.createElement('p');
	tempActual.innerHTML = `${celsius} Celsius`;
	tempActual.classList.add('font-bold');

	const divResultado = document.createElement('div');
	divResultado.appendChild(tempActual);

	resultado.appendChild(divResultado);

}

// * Función con un return implícito que retorna la temperatura en grados Celsius
const calCelsius = (grados) => parseInt(grados - 273.15);

// * Función utilizada para limpiar el contenido siempre y cuando exista un resultado en su primer hijo
const cleanHTML = () => {
	while(resultado.firstChild){
		resultado.removeChild(resultado.firstChild);
	}
}