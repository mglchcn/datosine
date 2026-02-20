// El enlace CSV publicado de tu Google Sheets
const urlCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxGNSQUhbeWqoxuO76_iulTvRB-wRJoCvUsgXeM8rI_SiZdvukqAYwF9GjVW3RDjIRkzFRMJrD6sSt/pub?gid=710178678&single=true&output=csv';

function cargarDatos() {
    // Usamos PapaParse para leer el CSV directamente desde la URL
    Papa.parse(urlCSV, {
        download: true,
        header: true, // Usa la primera fila como nombres de variables
        dynamicTyping: true, // Convierte los textos a números automáticamente
        complete: function(resultados) {
            const datos = resultados.data;
            
            // Filtramos filas vacías al final del documento (comunes en Sheets)
            const datosLimpios = datos.filter(fila => fila.IPC !== null && fila.IPC !== undefined);

            // Obtenemos el nombre de la primera columna para usarla en el eje X (Ej: "Año", "Fecha", "Periodo")
            const columnaTiempo = Object.keys(datosLimpios[0])[0]; 

            // Extraemos las series de datos
            const categorias = datosLimpios.map(fila => fila[columnaTiempo]);
            const serieIPC = datosLimpios.map(fila => fila['IPC']);
            const serieEmpleo = datosLimpios.map(fila => fila['EMPLEO']);
            const serieBalanza = datosLimpios.map(fila => fila['BALANZA']);

            // Llamamos a las funciones que dibujan los gráficos
            dibujarGraficoIPC(categorias, serieIPC);
            dibujarGraficoEmpleo(categorias, serieEmpleo);
            dibujarGraficoBalanza(categorias, serieBalanza);
        },
        error: function(error) {
            console.error("Error al leer el CSV:", error);
        }
    });
}

function dibujarGraficoIPC(categorias, datosIPC) {
    const opciones = {
        series: [{ name: 'IPC', data: datosIPC }],
        chart: { type: 'line', height: 300, fontFamily: 'Segoe UI, sans-serif' },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#f59e0b'], // Naranja
        xaxis: { categories: categorias },
        tooltip: { theme: 'light' }
    };
    new ApexCharts(document.querySelector("#grafico-ipc"), opciones).render();
}

function dibujarGraficoEmpleo(categorias, datosEmpleo) {
    const opciones = {
        series: [{ name: 'Empleo', data: datosEmpleo }],
        chart: { type: 'bar', height: 300, fontFamily: 'Segoe UI, sans-serif' },
        colors: ['#3b82f6'], // Azul
        plotOptions: {
            bar: { borderRadius: 4, dataLabels: { position: 'top' } }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: categorias },
        tooltip: { theme: 'light' }
    };
    new ApexCharts(document.querySelector("#grafico-empleo"), opciones).render();
}

function dibujarGraficoBalanza(categorias, datosBalanza) {
    const opciones = {
        series: [{ name: 'Balanza', data: datosBalanza }],
        chart: { type: 'area', height: 300, fontFamily: 'Segoe UI, sans-serif' },
        colors: ['#10b981'], // Verde (ApexCharts maneja bien valores negativos si hay déficit)
        stroke: { curve: 'straight', width: 2 },
        dataLabels: { enabled: false },
        xaxis: { categories: categorias },
        fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 100] }
        },
        tooltip: { theme: 'light' }
    };
    new ApexCharts(document.querySelector("#grafico-balanza"), opciones).render();
}

// Iniciar la sincronización al cargar
cargarDatos();
