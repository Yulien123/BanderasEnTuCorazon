/* Se pide:
-Lista de paises y su ciudad capital
-Banderas de esos paises
- Paises limitrofes(cantidad de un pais)
- Inventar alguna pregunta(?) como en que continente esta cierto pais*/

const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,borders,flags,continents,translations"
const URL_PAISES = "https://restcountries.com/v3.1/all?fields=name"
const URL_CAPITALES = "https://restcountries.com/v3.1/all?fields=name,capital"
const URL_LIMITROFES = "https://restcountries.com/v3.1/all?fields=name,borders"
const URL_BANDERAS = "https://restcountries.com/v3.1/all?fields=name,flags"
const URL_CONTINENTES = "https://restcountries.com/v3.1/all?fields=name,continents"

//funcion de prueba: Fetch a la API de los paises y mostrar en consola el nombre de los paises
async function cargarPaises() {
    console.log('Cargando países...');

    try {
        // Fetch a la API
        const response = await fetch(URL_ALL);
        const data = await response.json();

        // Obtener un país aleatorio
        const paises = data[Math.floor(Math.random() * data.length)];
        console.log(paises);
        // Validaciones seguras antes de acceder a propiedades
        const pais = paises.name?.common ?? "Desconocido";
        //const paisTranslate = paises.translations.spa.common ?? pais   // conviene traducir la api.
        const capital = paises.capital?.[0] ?? "Desconocida";
        const bandera = paises.flags?.png ?? "";
        const limitrofes = paises.borders?.length > 0 ? paises.borders.join(", ") : "Ninguno";
        const cant_limitrofes = paises.borders?.length > 0 ? paises.borders.length : 0;
        const continente = paises.continents?.[0] ?? "Desconocido";

        // Traducir los datos del país.
        const paisTraducido = await traducirTexto(pais);
        const capitalTraducida = await traducirTexto(capital);
        const continenteTraducido = await traducirTexto(continente);

        
        // Crear elemento y mostrar los datos
        const contenedor = document.getElementById("resultados");
        const divPaises = document.createElement("div");
        divPaises.classList.add("paises");
        divPaises.innerHTML = `
        <img src="${bandera}" alt="Bandera de ${pais}">
        <div>
            <h3><strong>${paisTraducido}</strong></h3><br>
            <h4>Capital: ${capitalTraducida}</h4>
            <h4>Continente: ${continenteTraducido}</h4>
            <h4>Países limítrofes (${cant_limitrofes}): ${limitrofes}</h4>
        </div>`;
        contenedor.appendChild(divPaises);

    } catch (error) {
        console.error("Error al cargar los países:", error);
    }
}

// Función para traducir texto de la API
async function traducirTexto(texto) {
    try {
        const response = await fetch('/traducir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ texto }) 
        });

        if (!response.ok) {
            throw new Error('Error en la traducción');
        }

        const data = await response.json();
        return data.traduccion; 
    } catch (error) {
        console.error("Error al traducir el texto:", error);
        return texto; 
    }
}

console.log('Script cargado...')