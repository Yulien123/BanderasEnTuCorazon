/* Se pide:
-Lista de paises y su ciudad capital
-Banderas de esos paises
- Paises limitrofes(cantidad de un pais)
- Inventar alguna pregunta(?) como en que continente esta cierto pais*/

const URL_ALL = "https://restcountries.com/v3.1/all?fields=name,capital,flags,borders"
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
        // console.log(data)

        // Obtener un país aleatorio
        const paises = data[Math.floor(Math.random() * data.length)];

        // Validaciones seguras antes de acceder a propiedades
        const pais = paises.name?.common ?? "Desconocido";
        const capital = paises.capital?.[0] ?? "Desconocida";
        const bandera = paises.flags?.png ?? "";
        const limitrofes = paises.borders?.length > 0 ? paises.borders.join(", ") : "Ninguno";
        const continente = paises.continents?.[0] ?? "Desconocido";

        const contenedor = document.getElementById("resultados");

        // Crear elemento y mostrar los datos
        const divPaises = document.createElement("div");
        divPaises.classList.add("paises");

        divPaises.innerHTML = `
        <img src="${bandera}" alt="Bandera de ${pais}">
        <div>
            <h3><strong>${pais}</strong></h3><br>
            <h4>Capital: ${capital}</h4>
            <h4>Continente: ${continente}</h4>
            <h4>Limítrofes: ${limitrofes}</h4>
        </div>`;

        contenedor.appendChild(divPaises);

    } catch (error) {
        console.error("Error al cargar los países:", error);
    }
}
console.log('Script cargado...')