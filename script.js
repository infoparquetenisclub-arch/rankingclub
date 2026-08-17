const API_URL = "https://script.google.com/macros/s/AKfycby4G4OYsmHwj0FZ-PiG7LyYlM2iqiSgaAx87QhmmNDrzghC3ifOZS95GdBNGlYTA2xT/exec";

let datosRanking = {};

fetch(API_URL + "?t=" + Date.now())
    .then(response => response.json())
    .then(data => {

        datosRanking = data;

        console.log("DATOS RECIBIDOS:", datosRanking);
        console.log("NOTICIAS RECIBIDAS:", datosRanking["NOTICIAS"]);

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

console.log(jugador);

// Buscar la posición actual del jugador en su categoría

const categoriaJugador = jugador[6];

const rankingCategoria = datosRanking["CAT " + categoriaJugador];

let posicionJugador = "";

if (rankingCategoria) {

    for (let i = 1; i < rankingCategoria.length; i++) {

        if (Number(rankingCategoria[i][1]) === Number(jugador[0])) {

            posicionJugador = rankingCategoria[i][0];
            break;

        }

    }

}





ficha.innerHTML = `


<div class="ficha">

    <div class="ficha-header">

       <div class="avatar">

    <img
        src="fotos/${jugador[0]}.jpg"
        alt="${jugador[1]}"
        onerror="this.src='fotos/sinfoto.jpg'"
    >

</div>

        <h2>${jugador[1]}</h2>

<p>Categoría ${jugador[6]}</p>

<div class="posicion-ranking">
    🏆 Posición actual: <strong>#${posicionJugador}</strong>
</div>

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

            <div class="efectividad">

    <div class="efectividad-titulo">
        <strong>🎯 Efectividad</strong>
        <span>${jugador[11]}%</span>
    </div>

    <div class="barra-efectividad">

        <div 
            class="progreso-efectividad"
            style="width: ${jugador[11]}%">
        </div>

    </div>

</div>

        </div>

    </div>

    ${mostrarProximoPartido(jugador[0])}

${calcularRacha(jugador[0])}

${mostrarPartidos(jugador[0])}

</div>

`;

mostrarPartidos(jugador[0]);

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

function mostrarPartidos(idJugador){

    const partidos = datosRanking["PARTIDOS"];
    const jugadores = datosRanking["JUGADORES"];

    let html = "<h3>🎾 Últimos 5 partidos</h3>";

    let cantidadPartidos = 0;

    for(let i = partidos.length - 1; i >= 1; i--){

        if(cantidadPartidos >= 5){
            break;
        }

        const partido = partidos[i];

        if(
            Number(partido[2]) === Number(idJugador) ||
            Number(partido[3]) === Number(idJugador)
        ){

            const rivalId =
                Number(partido[2]) === Number(idJugador)
                ? partido[3]
                : partido[2];

            let rival = "Desconocido";

            for(let j = 1; j < jugadores.length; j++){

                if(Number(jugadores[j][0]) === Number(rivalId)){

                    rival = jugadores[j][1];
                    break;

                }

            }

            const gano = Number(partido[4]) === Number(idJugador);

            html += `
                <div class="partido ${gano ? "gano" : "perdio"}">

                    <strong>${gano ? "🟢 Ganó" : "🔴 Perdió"}</strong><br>

                    <strong>Rival:</strong> ${rival}<br>

                    <strong>Resultado:</strong> ${partido[5]}

                </div>
            `;

            cantidadPartidos++;

        }

    }

    return html;

}

function calcularRacha(idJugador){

    const partidos = datosRanking["PARTIDOS"];

    let tipoRacha = null;
    let cantidad = 0;

    // Recorremos desde el partido más reciente
    for(let i = partidos.length - 1; i >= 1; i--){

        const partido = partidos[i];

        const participa =
            Number(partido[2]) === Number(idJugador) ||
            Number(partido[3]) === Number(idJugador);

        if(participa){

            const gano =
                Number(partido[4]) === Number(idJugador);

                console.log(
    "RACHA:",
    "Jugador:", idJugador,
    "Partido:", partido,
    "Ganador:", partido[4],
    "¿Ganó?:", gano
);

            // Primer partido encontrado
            if(tipoRacha === null){

                tipoRacha = gano;
                cantidad++;

            } else if(tipoRacha === gano){

                // Sigue la misma racha
                cantidad++;

            } else {

                // La racha terminó
                break;

            }

        }

    }

    if(cantidad === 0){
        return "";
    }

    if(tipoRacha){

        return `
            <div class="racha racha-ganadora">
                🔥 Racha actual: <strong>${cantidad} victoria${cantidad > 1 ? "s" : ""}</strong>
            </div>
        `;

    } else {

        return `
            <div class="racha racha-perdedora">
                🔴 Racha actual: <strong>${cantidad} derrota${cantidad > 1 ? "s" : ""}</strong>
            </div>
        `;

    }

}

function mostrarProximoPartido(idJugador){

    const partidos = datosRanking["PROXIMOS PARTIDOS"];

    console.log(partidos);

    if(!partidos) return "";

    let html = "";

    for(let i = 1; i < partidos.length; i++){

        const partido = partidos[i];

        console.log(partido);

        if(
            Number(partido[2]) === Number(idJugador) ||
            Number(partido[3]) === Number(idJugador)
        ){

            const rivalId =
                Number(partido[2]) === Number(idJugador)
                ? partido[3]
                : partido[2];

            let rival = "Desconocido";

            const jugadores = datosRanking["JUGADORES"];

            for(let j = 1; j < jugadores.length; j++){

                if(Number(jugadores[j][0]) === Number(rivalId)){

                    rival = jugadores[j][1];
                    break;

                }

            }

            const fecha = new Date(partido[0]);

const fechaOriginal = new Date(partido[0]);

const dia = String(fechaOriginal.getDate()).padStart(2, "0");
const mes = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
const año = fechaOriginal.getFullYear();

const fechaFormateada = `${dia}/${mes}/${año}`;

const hora = partido[1];

html = `
<div class="proximoPartido">

    <h3>📅 Próximo Partido</h3>

    <p><strong>Rival:</strong> ${rival}</p>

    <p><strong>Fecha:</strong> ${fechaFormateada}</p>

    <p><strong>Hora:</strong> ${hora}</p>

    <p><strong>Cancha:</strong> ${partido[4]}</p>

    <p><strong>Estado:</strong> ${partido[5]}</p>

</div>
`;

            break;

        }

    }

    return html;

}

function mostrarProximaFecha(){

    const partidos = datosRanking["PROXIMOS PARTIDOS"];
    const jugadores = datosRanking["JUGADORES"];

    let html = `
        <h2>📅 Próxima Fecha</h2>
    `;

    for(let i = 1; i < partidos.length; i++){

        const partido = partidos[i];

        let jugador1 = "";
        let jugador2 = "";

        for(let j = 1; j < jugadores.length; j++){

            if(Number(jugadores[j][0]) === Number(partido[2])){
                jugador1 = jugadores[j][1];
            }

            if(Number(jugadores[j][0]) === Number(partido[3])){
                jugador2 = jugadores[j][1];
            }

        }

        const fechaOriginal = new Date(partido[0]);

const dia = String(fechaOriginal.getDate()).padStart(2, "0");
const mes = String(fechaOriginal.getMonth() + 1).padStart(2, "0");
const año = fechaOriginal.getFullYear();

const fecha = `${dia}/${mes}/${año}`;

        const hora = partido[1];

        html += `

        <div class="proximoPartido">

            <h3>🎾 ${jugador1}</h3>

            <strong>vs</strong>

            <h3>${jugador2}</h3>

            <p>📅 ${fecha}</p>

            <p>🕒 ${hora}</p>

            <p>🏟 Cancha ${partido[4]}</p>

        </div>

        `;

    }

    document.getElementById("ranking").innerHTML = html;

}

function mostrarNoticias() {

    const noticias = datosRanking["NOTICIAS"];
    const ranking = document.getElementById("ranking");

    if (!noticias || noticias.length <= 1) {

        ranking.innerHTML = `
            <h2>📰 Noticias</h2>
            <p>No hay noticias disponibles.</p>
        `;

        return;
    }

    let html = `
        <h2>📰 Noticias</h2>
    `;

    for (let i = noticias.length - 1; i >= 1; i--) {

        const noticia = noticias[i];

        const fecha = noticia[0];
        const titulo = noticia[1];
        const texto = noticia[2];
        const idImagen = noticia[3];

        let imagenHTML = "";

        if (idImagen && idImagen.trim() !== "") {

            imagenHTML = `
                <img
                    src="noticias/${idImagen.trim()}.jpg"
                    class="imagen-noticia"
                    alt="${titulo}"
                >
            `;
        }

        html += `
            <div class="noticia">

                <h3>${titulo}</h3>

                <p class="fecha-noticia">
                    ${fecha}
                </p>

                ${imagenHTML}

                <p>
                    ${texto}
                </p>

            </div>
        `;
    }

    ranking.innerHTML = html;
}