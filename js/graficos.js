function drawChart() {
	graficoRecibidos();
	graficoEnviados();
}
function crearLista(key) {
	var lista = []
	var keys = Object.keys(personas);
	lista[0] = [keys[0], personas[keys[0]][key].length];
	for (i=1; i<keys.length; i++) {
		var k = keys[i];
		for (j=lista.length-1; j>=0; j--) {
			if (personas[k][key].length > lista[j][1]) {
				lista[j+1] = lista[j]
				if (j==0) lista[0] = [k, personas[k][key].length];
			} else {
				lista [j+1] = [k, personas[k][key].length];
				break;
			}
		}
	}
	lista.unshift(['Correo', key]);
	return lista;
}
function graficoRecibidos() {
	var lista = crearLista("recibidos");
	var data = google.visualization.arrayToDataTable(lista.slice(0,10));
	var chart = new google.visualization.ColumnChart(document.getElementById('grafRec'));
	chart.draw(data, null);
}
function graficoEnviados() {
	var lista = crearLista("enviados");
	var data = google.visualization.arrayToDataTable(lista.slice(0,10));
	var chart = new google.visualization.ColumnChart(document.getElementById('grafEnv'));
	chart.draw(data, null);
}