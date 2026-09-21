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

    document.getElementById("caraACara").style.display = "none";

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

function buscarCaraACara(letra){

    const inputId = letra === "A"
        ? "jugadorCaraA"
        : "jugadorCaraB";

    const resultadoId = letra === "A"
        ? "resultadoCaraACaraA"
        : "resultadoCaraACaraB";

    const texto = document
        .getElementById(inputId)
        .value
        .toUpperCase();

    const lista = document.getElementById(resultadoId);

    lista.innerHTML = "";

    if(texto.length < 2){
        return;
    }

    const jugadores = datosRanking["JUGADORES"];

    if(!jugadores){
        return;
    }

    for(let i = 1; i < jugadores.length; i++){

        const jugador = jugadores[i];

        if(
            String(jugador[1])
                .toUpperCase()
                .includes(texto)
        ){

            lista.innerHTML += `
                <div
                    class="itemBusqueda"
                    onclick="seleccionarCaraACara('${letra}', '${jugador[1].replace(/'/g, "\\'")}')"
                >
                    ${jugador[1]}
                </div>
            `;
        }
    }
}

function seleccionarCaraACara(letra, nombre){

    const inputId = letra === "A"
        ? "jugadorCaraA"
        : "jugadorCaraB";

    const resultadoId = letra === "A"
        ? "resultadoCaraACaraA"
        : "resultadoCaraACaraB";

    document.getElementById(inputId).value = nombre;

    document.getElementById(resultadoId).innerHTML = "";
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

        // FORMATEAR FECHA SIN USAR new Date()
        const fecha = String(partido[0]);

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

function mostrarTorneos(){

    const torneos = datosRanking["TORNEOS"];
    const ranking = document.getElementById("ranking");

    if(!torneos || torneos.length <= 1){
        ranking.innerHTML = `
            <h2>🏆 Torneos</h2>
            <p>No hay torneos disponibles.</p>
        `;
        return;
    }

    let html = `<h2>🏆 Torneos</h2>`;

    for(let i=1; i<torneos.length; i++){

        html += `
            <div class="torneo">
                <h3>${torneos[i][0]}</h3>

                <button class="categoria"
                    onclick="abrirPDF('${torneos[i][1]}')">

                    📄 VER CUADRO

                </button>

            </div>
        `;
    }

    ranking.innerHTML = html;
}

function abrirPDF(link){

    const id = link.match(/\/d\/(.*?)\//)[1];

    document.getElementById("visorPDF").src =
        `https://drive.google.com/file/d/${id}/preview`;

    document.getElementById("modalPDF").style.display = "block";
}

function cerrarPDF(){

    document.getElementById("modalPDF").style.display = "none";
    document.getElementById("visorPDF").src = "";

}

function compararJugadores(){

    const nombreA = document
        .getElementById("jugadorCaraA")
        .value
        .trim()
        .toUpperCase();

    const nombreB = document
        .getElementById("jugadorCaraB")
        .value
        .trim()
        .toUpperCase();

    const resultado = document.getElementById("resultadoCaraACara");

    if(!nombreA || !nombreB){

        resultado.innerHTML = `
            <p>⚠️ Escribí los nombres de los dos jugadores.</p>
        `;

        return;
    }

    const jugadores = datosRanking["JUGADORES"];
    const partidos = datosRanking["PARTIDOS"];

    if(!jugadores || !partidos){

        resultado.innerHTML = `
            <p>⚠️ No se pudieron cargar los datos de jugadores y partidos.</p>
        `;

        return;
    }

    // Buscar jugador 1
    let jugadorA = null;

    for(let i = 1; i < jugadores.length; i++){

        if(
            String(jugadores[i][1]).trim().toUpperCase() === nombreA
        ){

            jugadorA = jugadores[i];
            break;
        }
    }

    // Buscar jugador 2
    let jugadorB = null;

    for(let i = 1; i < jugadores.length; i++){

        if(
            String(jugadores[i][1]).trim().toUpperCase() === nombreB
        ){

            jugadorB = jugadores[i];
            break;
        }
    }

    // Verificar jugadores
    if(!jugadorA || !jugadorB){

        resultado.innerHTML = `
            <p>⚠️ No encontramos uno o ambos jugadores.</p>
            <p>Revisá que los nombres estén escritos exactamente como aparecen en la app.</p>
        `;

        return;
    }

    // Evitar comparar al jugador consigo mismo
    if(Number(jugadorA[0]) === Number(jugadorB[0])){

        resultado.innerHTML = `
            <p>⚠️ Seleccioná dos jugadores diferentes.</p>
        `;

        return;
    }

    const idA = Number(jugadorA[0]);
    const idB = Number(jugadorB[0]);

    // Contadores
    let victoriasA = 0;
    let victoriasB = 0;
    let enfrentamientos = 0;

    let ultimoPartido = null;

    // Buscar enfrentamientos entre ambos
    for(let i = partidos.length - 1; i >= 1; i--){

        const partido = partidos[i];

        const jugador1 = Number(partido[2]);
        const jugador2 = Number(partido[3]);
        const ganador = Number(partido[4]);

        const esEnfrentamiento =
            (jugador1 === idA && jugador2 === idB) ||
            (jugador1 === idB && jugador2 === idA);

        if(!esEnfrentamiento){
            continue;
        }

        enfrentamientos++;

        // Contar victorias
        if(ganador === idA){
            victoriasA++;
        }

        if(ganador === idB){
            victoriasB++;
        }

        // Como recorremos desde el más reciente,
        // el primero encontrado es el último partido
        if(!ultimoPartido){

            ultimoPartido = partido;

        }

    }

    // Fotos
    const fotoA = `fotos/${jugadorA[0]}.jpg`;
    const fotoB = `fotos/${jugadorB[0]}.jpg`;

    // Último partido
    let ultimoHTML = "";

    if(ultimoPartido){

        const ganadorUltimo = Number(ultimoPartido[4]);

        let ganadorNombre = "Sin resultado";

        if(ganadorUltimo === idA){
            ganadorNombre = jugadorA[1];
        }

        if(ganadorUltimo === idB){
            ganadorNombre = jugadorB[1];
        }

        ultimoHTML = `
            <div class="cara-a-cara-ultimo">

                <h3>🎾 Último enfrentamiento</h3>

                <p>
                    <strong>${ultimoPartido[5]}</strong>
                </p>

                <p>
                    🏆 Ganador:
                    <strong>${ganadorNombre}</strong>
                </p>

                <p>
                    <strong>Resultado:</strong>
                    ${ultimoPartido[5]}
                </p>

            </div>
        `;

    }else{

        ultimoHTML = `
            <div class="cara-a-cara-ultimo">

                <h3>🎾 Último enfrentamiento</h3>

                <p>No hay partidos registrados entre estos jugadores.</p>

            </div>
        `;

    }

    // Resultado final
    resultado.innerHTML = `

        <div class="cara-a-cara-resultado">

            <h2>⚔️ CARA A CARA</h2>

            <div class="cara-a-cara-jugadores">

                <div class="cara-a-cara-jugador">

                    <img
                        src="${fotoA}"
                        alt="${jugadorA[1]}"
                        onerror="this.src='fotos/sinfoto.jpg'"
                    >

                    <h3>${jugadorA[1]}</h3>

                    <p>
                        Categoría ${jugadorA[6]}
                    </p>

                    <div class="cara-a-cara-victorias">
                        <strong>${victoriasA}</strong>
                        <span>victorias</span>
                    </div>

                </div>


                <div class="cara-a-cara-vs">

                    <strong>VS</strong>

                </div>


                <div class="cara-a-cara-jugador">

                    <img
                        src="${fotoB}"
                        alt="${jugadorB[1]}"
                        onerror="this.src='fotos/sinfoto.jpg'"
                    >

                    <h3>${jugadorB[1]}</h3>

                    <p>
                        Categoría ${jugadorB[6]}
                    </p>

                    <div class="cara-a-cara-victorias">
                        <strong>${victoriasB}</strong>
                        <span>victorias</span>
                    </div>

                </div>

            </div>


            <div class="cara-a-cara-resumen">

                <h3>📊 Resumen</h3>

                <p>
                    <strong>${enfrentamientos}</strong>
                    enfrentamiento${enfrentamientos !== 1 ? "s" : ""}
                </p>

            </div>


            <div class="cara-a-cara-estadisticas">

                <div>

                    <h3>${jugadorA[1]}</h3>

                    <p>🎾 Partidos: ${jugadorA[8]}</p>
                    <p>🟢 Ganados: ${jugadorA[9]}</p>
                    <p>🔴 Perdidos: ${jugadorA[10]}</p>
                    <p>🎯 Efectividad: ${jugadorA[11]}%</p>

                </div>


                <div>

                    <h3>${jugadorB[1]}</h3>

                    <p>🎾 Partidos: ${jugadorB[8]}</p>
                    <p>🟢 Ganados: ${jugadorB[9]}</p>
                    <p>🔴 Perdidos: ${jugadorB[10]}</p>
                    <p>🎯 Efectividad: ${jugadorB[11]}%</p>

                </div>

            </div>


            ${ultimoHTML}

        </div>

    `;

}

function mostrarCaraACara(){

    const seccion = document.getElementById("caraACara");
    const ranking = document.getElementById("ranking");

    if(!seccion){
        console.error("No se encontró la sección caraACara");
        return;
    }

    // Ocultar completamente el ranking actual
    if(ranking){
        ranking.hidden = true;
        ranking.style.setProperty("display", "none", "important");
    }

    // Mostrar solamente Cara a Cara
    seccion.hidden = false;
    seccion.style.setProperty("display", "block", "important");

    seccion.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Cerrar Cara a Cara al cambiar de sección
document.addEventListener("click", function(event) {

    const botonMenu = event.target.closest(".menu > .categoria");

    if (!botonMenu) return;

    const caraACara = document.getElementById("caraACara");

    if (caraACara) {
        caraACara.style.display = "none";
    }

}, true);