var filtro = "";
var correo = "";

//funcionaidad de los datepickers
$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY/MM/DD'
    }).keydown(false);
    $('#datetimepicker2').datetimepicker({
        format: 'YYYY/MM/DD',
        useCurrent: false //Important! See issue #1075
    }).keydown(false);
    $("#datetimepicker1").on("dp.change", function (e) {
        $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker2").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });
});

function obtenerDatos() {
    //resetear variables globales
    filtro = "";
    correo = "";
    personas = new Object();
    lmensajes = [];
    fin = false;
    count = 0;
    max = 0;
    //restablecer elementos graficos
    btgrafico.disabled = true;
    $(".tabla-mensaje").addClass("hidden");
    $(".table").addClass("hiden");
    $('.fila').remove();
    //obtiene los datos para e filtro
    var desde = document.forms["filtros"]["desde"].value;
    var hasta = document.forms["filtros"]["hasta"].value;
    correo = document.forms["filtros"]["correo"].value;
    if (correo != "") {
        filtro += correo+" ";
    } if (desde != "") {
        filtro += "after:"+desde+" ";
    } if (hasta != "") {
        filtro += "before:"+hasta;
    }
    waitingDialog.show('leyendo correos...', {
        headerText: 'Obtener datos',
    });
	listMessages("");
}
//funciones para ordenar tabla
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index),
        valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}
function getCellValue(row, index) {
    return $(row).children('td').eq(index).html()
}
function setIcon(element, asc) {
    $("th").each(function(index) {
        $(this).removeClass("sorting");
        $(this).removeClass("asc");
        $(this).removeClass("desc");
    });
    element.addClass("sorting");
    if (asc) element.addClass("asc");
    else element.addClass("desc");
}
function ordenar() {
    var table = $(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc
    if (!this.asc) {
        rows = rows.reverse();
    }
    for (var i = 0; i < rows.length; i++) {
        table.append(rows[i]);
    }
    setIcon($(this), this.asc);
}