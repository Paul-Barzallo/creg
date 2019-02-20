var CLIENT_ID = '488919627112-g1vt68lfmfg9r54rt514v24pdpaknbi8.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var btgrafico = document.getElementById('grafico-button');
var tabla = document.getElementById('tabla');
var personas = new Object();
var lmensajes = [];
var fin = false;
var count = 0;
var max = 0;

//Carga la API
function handleClientLoad() {
	gapi.load('client:auth2', initClient);
}
//Inicia la API
function initClient() {
	//Credenciales
	gapi.client.init({
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
	}).then(function () { //funciones iniciales
		//escucha cambios en la sesion
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
		//realza los cambios de sesion al inicio
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		//funciones para los botones
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
	});
}
//Funcion de inicio de sesion
function handleAuthClick(event) {
	gapi.auth2.getAuthInstance().signIn();
}
//Funcion de cerrar sesion
function handleSignoutClick(event) {
	gapi.auth2.getAuthInstance().disconnect();
	location.reload();
}
//Cambios en a sesion
function updateSigninStatus(isSignedIn) {
	if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		btgrafico.setAttribute("disabled","disabled");
		$('.datos').removeClass("hidden");	
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
	}
}
//obtiene lista de mensajes
function listMessages(nextToken) {
	var request;
	if (nextToken == "") {
		request = gapi.client.gmail.users.messages.list({
			'userId': 'me',
			'q': filtro
		});
	} else {
		request = gapi.client.gmail.users.messages.list({
			'userId': 'me',
			'pageToken': nextToken,
			'q': filtro
		});
	}
	request.execute(revisarListaMensajes);
}
//obtiene daos d la lista de mensajes
function revisarListaMensajes(response) {
	var mensajes = response.messages;
	var token = response.nextPageToken;
	if (mensajes != undefined) {
		max += mensajes.length;
		for (i=0; i<mensajes.length; i++) {
			var messageRequest = gapi.client.gmail.users.messages.get({
				'userId': 'me',
				'id': mensajes[i].id
			});
			messageRequest.execute(revisarMensaje);
		}
	}
	else if (max == 0) {
		waitingDialog.hide();
		$(".tabla-mensaje").removeClass("hidden");
	}
	if (token != undefined) listMessages(token);
	else fin = true;
}
//obtiene datos de cada mensaje
function revisarMensaje(response){
	var idate = Number(response.internalDate);
	var fecha = new Date(idate);
	var headers = getHeaders(response.payload.headers);
	var mensaje = {'de': headers['From'], 'para': headers['To'], 'titulo': headers['Subject'], 'fecha': fecha, 'cc': headers['Cc'], 'cco': headers['Bcc']}
	var nuevo = true;
	for (m in lmensajes) {
		if (m['titulo'] == mensaje['titulo'] && m['fecha'] == mensaje['fecha']) nuevo = false;
	}
	if (nuevo) {
		if (headers['From'] != undefined) {
			var de = obtenerCorreo(headers['From']);
			if (de == correo || correo == "") {
				if (de in personas) {
					personas[de].enviados.push(mensaje);
				} else {
					personas[de] = {'enviados': [mensaje], 'recibidos': []};
				} 
			}
		} if (headers['To'] != undefined) {
			var para = obtenerCorreo(headers['To']);
			if (para == correo || correo == "") {
				if (para in personas) {
					personas[para].recibidos.push(mensaje);
				} else {
					personas[para] = {'enviados': [], 'recibidos': [mensaje]};
				}
			}
		}  
		for (i in headers['Cc']){
			cc = obtenerCorreo(headers['Cc'][i]);
			if (cc == correo || correo == "") {
				if (cc in personas) {
					personas[cc].recibidos.push(mensaje);

				} else {
					personas[cc] = {'enviados': [], 'recibidos': [mensaje]};
				}
			}
		}
		for (i in headers['Bcc']){
			cco = obtenerCorreo(headers['Bcc'][i]);
			if (cco == correo || correo == "") {
				if (cco in personas) {
					personas[cco].recibidos.push(mensaje);
				} else {
					personas[cco] = {'enviados': [], 'recibidos': [mensaje]};
				}
			}
		}
	}
	count += 1;
	if (count == max && fin) {
		if (Object.keys(personas).length>0) {
			setTable();
			waitingDialog.hide();
			$('.table').removeClass("hidden");
			if (correo == "") btgrafico.removeAttribute("disabled");
		} else {
			waitingDialog.hide();
			$(".tabla-mensaje").removeClass("hidden");
		}	
	}
}
//llena la tabla con las direcciones de correo y sus correos enviados y recibido
function setTable(){
	for (c in personas){
		var enviados = personas[c]['enviados'].length;
		var recibidos = personas[c]['recibidos'].length;
		appendRow(c, enviados, recibidos);
	}
	$('th').click(function() {
    	var table = $(this).parents('table').eq(0)
    	var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    	this.asc = !this.asc
    	if (!this.asc) {
      		rows = rows.reverse()
    	}
    	for (i=0; i<rows.length; i++) {
      		table.append(rows[i])
    	}
    	setIcon($(this), this.asc);
  	})

}
//obtiene la direccion de correo a partir del string de header
function obtenerCorreo(correo){
	var l = correo.split("<")
	if (l.length == 1) return l[0];
	return l[1].slice(0,-1);
}
//obtiene object con los headers necesarios
function getHeaders(headers) {
	objHeaders = new Object();
	objHeaders['Bcc'] = [];
	objHeaders['Cc'] = [];
	for (i=0; i<headers.length; i++){
		if (["From", "To", "Subject"].indexOf(headers[i].name) != -1) {
			objHeaders[headers[i].name] = headers[i].value;
		} else if (headers[i].name == "Bcc") {
			objHeaders['Bcc'] = headers[i].value.split(',');
		} else if (headers[i].name == "Cc") {
			objHeaders['Cc'] = headers[i].value.split(',');
		}
	}
	return objHeaders;
}
//añade filas a la tabla
function appendRow(correo, enviados, recibidos){
	$('.table').append(
		'<tr class="fila">\
			<td>'+correo+'</td>\
			<td>'+recibidos+'</td>\
			<td>'+enviados+'</td>\
		</tr>'
    );
}