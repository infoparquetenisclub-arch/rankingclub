const API_URL = "https://script.google.com/macros/s/AKfycby4G4OYsmHwj0FZ-PiG7LyYlM2iqiSgaAx87QhmmNDrzghC3ifOZS95GdBNGlYTA2xT/exec";

let datosRanking = {};

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        datosRanking = data;
        console.log("Datos cargados:", datosRanking);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });

function mostrarCategoria(cat) {

    const nombreHoja = "CAT " + cat;

    const datos = datosRanking[nombreHoja];

    const ranking = document.getElementById("ranking");

    if (!datos) {
        ranking.innerHTML = "<h2>No hay datos para esta categoría.</h2>";
        return;
    }

    let html = `
        <h2>${nombreHoja}</h2>

        <table>

        <tr>
            <th>Pos.</th>
            <th>Jugador</th>
            <th>Puntos</th>
        </tr>
    `;

    // Empieza en 1 para ignorar la fila de encabezados
    for (let i = 1; i < datos.length; i++) {

        const fila = datos[i];

        let medalla = "";

        if (i === 1) medalla = "🥇";
        if (i === 2) medalla = "🥈";
        if (i === 3) medalla = "🥉";

        html += `
        <tr>
            <td>${fila[0]} ${medalla}</td>
            <td>${fila[1]}</td>
            <td>${fila[2]}</td>
        </tr>
        `;
    }

    html += "</table>";

    ranking.innerHTML = html;
}