const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxGNSQUhbeWqoxuO76_iulTvRB-wRJoCvUsgXeM8rI_SiZdvukqAYwF9GjVW3RDjIRkzFRMJrD6sSt/pub?gid=710178678&single=true&output=csv';

// Variable global para guardar los 5 registros y usarlos al cambiar el selector
let datosGlobales = [];
let columnaTiempoGlobal = "";

function cargarDatos() {
    Papa.parse(urlCSV, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(resultados) {
            // 1. Limpiar filas vacías
            const datosLimpios = resultados.data.filter(fila => fila.IPC !== null && fila.IPC !== undefined);
            
            // 2. OBTENER SOLO LAS PRIMERAS 5 FILAS
            datosGlobales = datosLimpios.slice(0, 5);

            // Detectar la primera columna (Ej: "Año", "Mes")
            columnaTiempoGlobal = Object.keys(datosGlobales[0])[0]; 

            // Extraer series para los gráficos
            const categorias = datosGlobales.map(fila => fila[columnaTiempoGlobal]);
            const serieIPC = datosGlobales.map(fila => fila['IPC']);
            const serieEmpleo = datosGlobales.map(fila => fila['EMPLEO']);
            const serieBalanza = datosGlobales.map(fila => fila['BALANZA']);

            // Dibujar Gráficos
            dibujarGraficoIPC(categorias, serieIPC);
            dibujarGraficoEmpleo(categorias, serieEmpleo);
            dibujarGraficoBalanza(categorias, serieBalanza);

            // 3. Configurar el Selector y las Tarjetas
            configurarSelector(categorias);
        }
    });
}

function configurarSelector(categorias) {
    const selector = document.getElementById('selector-periodo');
    selector.innerHTML = ''; // Limpiar opciones por defecto

    // Llenar el <select> con los 5 periodos
    categorias.forEach((categoria, index) => {
        const opcion = document.createElement('option');
        opcion.value = index; // Guardamos el índice (0 al 4)
        opcion.textContent = categoria;
        selector.appendChild(opcion);
    });

    // Mostrar los datos de la primera opción por defecto
    actualizarTarjetas(0);

    // Escuchar cuando el usuario cambie la opción seleccionada
    selector.addEventListener('change', function(evento) {
        const indiceSeleccionado = evento.target.value;
        actualizarTarjetas(indiceSeleccionado);
    });
}

function actualizarTarjetas(indice) {
    const filaSeleccionada = datosGlobales[indice];
    
    // Inyectar el valor de la celda específica en el HTML
    document.getElementById('valor-ipc').textContent = filaSeleccionada['IPC'];
    document.getElementById('valor-empleo').textContent = filaSeleccionada['EMPLEO'];
    document.getElementById('valor-balanza').textContent = filaSeleccionada['BALANZA'];
}

// Funciones de gráficos (Iguales a la versión anterior)
function dibujarGraficoIPC(cat, datos) {
    new ApexCharts(document.querySelector("#grafico-ipc"), {
        series: [{ name: 'IPC', data: datos }],
        chart: { type: 'line', height: 300, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#f59e0b'],
        xaxis: { categories: cat }
    }).render();
}

function dibujarGraficoEmpleo(cat, datos) {
    new ApexCharts(document.querySelector("#grafico-empleo"), {
        series: [{ name: 'Empleo', data: datos }],
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        colors: ['#3b82f6'],
        xaxis: { categories: cat }
    }).render();
}

function dibujarGraficoBalanza(cat, datos) {
    new ApexCharts(document.querySelector("#grafico-balanza"), {
        series: [{ name: 'Balanza', data: datos }],
        chart: { type: 'area', height: 300, toolbar: { show: false } },
        colors: ['#10b981'],
        xaxis: { categories: cat }
    }).render();
}

cargarDatos();
