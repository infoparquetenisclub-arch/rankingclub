const API_URL = "https://script.google.com/macros/s/AKfycby4G4OYsmHwj0FZ-PiG7LyYlM2iqiSgaAx87QhmmNDrzghC3ifOZS95GdBNGlYTA2xT/exec";

let datosRanking = {};

fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        datosRanking = data;
        console.log(Object.keys(datosRanking));
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

    <td class="jugador" onclick="verJugador(${fila[1]})">
        ${fila[2]}
    </td>

    <td>${fila[3]}</td>
</tr>
`;
    }

    html += "</table>";

    ranking.innerHTML = html;
}
function verJugador(id){

    const jugadores = datosRanking["JUGADORES"];

    const ficha = document.getElementById("fichaJugador");

    // Buscar el jugador por ID
    let jugador = null;

    for(let i = 1; i < jugadores.length; i++){

        if(Number(jugadores[i][0]) === Number(id)){

            jugador = jugadores[i];
            break;

        }

    }

    if(!jugador){

        ficha.innerHTML = "<h2>Jugador no encontrado</h2>";
        return;

    }

   ficha.innerHTML = `


<div class="ficha">

    <div class="ficha-header">

        <div class="avatar">🎾</div>

        <h2>${jugador[1]}</h2>

        <p>Categoría ${jugador[6]}</p>

    </div>

    <div class="ficha-body">

        <div>

            <div class="dato"><strong>🎂 Edad:</strong> ${jugador[2]} años</div>

            <div class="dato"><strong>📏 Altura:</strong> ${jugador[3]} m</div>

            <div class="dato"><strong>✋ Mano:</strong> ${jugador[4]}</div>

            <div class="dato"><strong>🎾 Revés:</strong> ${jugador[5]}</div>

        </div>

        <div class="estadisticas">

            <h3>📊 Estadísticas</h3>

            <div class="dato"><strong>Partidos:</strong> ${jugador[8]}</div>

            <div class="dato"><strong>Ganados:</strong> ${jugador[9]}</div>

            <div class="dato"><strong>Perdidos:</strong> ${jugador[10]}</div>

            <div class="dato"><strong>Efectividad:</strong> ${jugador[11]}%</div>

        </div>

    </div>

</div>

`;

document.getElementById("modalJugador").style.display = "block";

}

function buscarJugador(){

    const texto = document
        .getElementById("buscarJugador")
        .value
        .toUpperCase();

    const lista = document.getElementById("resultadoBusqueda");

    lista.innerHTML = "";

    if(texto.length < 2){

        return;

    }

    const jugadores = datosRanking["JUGADORES"];

    for(let i=1;i<jugadores.length;i++){

        const jugador = jugadores[i];

        if(jugador[1].toUpperCase().includes(texto)){

            lista.innerHTML += `
                <div class="itemBusqueda"
                    onclick="verJugador(${jugador[0]})">

                    ${jugador[1]}

                </div>
            `;

        }

    }

}

function cerrarModal(){

    document.getElementById("modalJugador").style.display = "none";

}