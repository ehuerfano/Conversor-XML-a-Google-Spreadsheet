function getInputForm(indexWithType, objetoEmpleado, tablaTitle, validaForm){
  var event = '';
  var patternAttr = '', titleAttr = '', invalidFeedback = '', requiredAttr = '';
  var index = indexWithType.split('-')[0];
  var esSelect = false, esTextarea = false, esCheckbox = false; esFile = true;
  if( indexWithType.includes('^') ){
    var type = 'date';
    event = '';
    objetoEmpleado[index] = objetoEmpleado[index].split('T')[0].toString();
  }else if( indexWithType.includes('#') ){
    event = 'puntos(this);toggleInvalid(this)';
    if(index=='id#'){
      patternAttr  = 'pattern="^[0-9.]{5,}$"';
      titleAttr = 'title="Al menos 4 números y con puntos"';
      requiredAttr = 'required';
      // si en validacion client-side ya existe la cedula:
      invalidFeedback = `<div class="invalid-tooltip">Cédula ya existe</div>`;
    }
    var type = 'text';
    objetoEmpleado[index] = setDotSeparator(objetoEmpleado[index]);
  }else if( indexWithType.includes('~') ){
    event = '';
    if(index=='nombre~'){
      patternAttr  = 'pattern="^[A-Za-z\\s]+$"';
      titleAttr = 'title="Solo letras o espacios sin caracteres especiales"';
    }
    var type = 'text';
  }else if( indexWithType.includes('*') ){
    event = '';
    var type = 'text';
    esSelect = true;
    var key = indexWithType.split('*')[0];
    var opciones = getPropiedadesDocumento([key])[0];
  }else if( indexWithType.includes('%') ){
    event = 'porcentaje(this)';
    var type = 'text';
    objetoEmpleado[index] *= 100;
    objetoEmpleado[index] += '%';
  }else if( indexWithType.includes('{') ){
    event = '';
    esTextarea = true;
  }else if( indexWithType.includes(';') ){
    event = '';
    esFile = true;
  }else if( indexWithType.includes('?') ){
    event = 'changeCheckbox(this)';
    esCheckbox = true;
    var type = 'checkbox';
  }

  if ( esSelect ){
    var listaOpciones = '<option value="" selected>Selecciona una opción</option>';
    for(i=0; i < opciones.length; i++){
      if(opciones[i] != ''){
        if(objetoEmpleado[index] == opciones[i])
          listaOpciones += `<option value="${opciones[i]}" selected>${opciones[i]}</option>`;
        else
          listaOpciones += `<option value="${opciones[i]}">${opciones[i]}</option>`;
      }
    }

    return `<div class="form-floating m-2">
              <select 
                class="form-control" 
                onkeyup="${event}" 
                id="${index}" 
                name="${index}">`
                  +listaOpciones+
              `</select>
              <label for="floatingInput">${tablaTitle}</label>
            </div>`;
  } else if( esTextarea ){
    return `<div class="form-floating m-2">
              <textarea class="form-control" onkeyup="${event}" placeholder="${tablaTitle}" id="${index}" name="${index}" style="height: 500px">${objetoEmpleado[index]}</textarea>
              <label for="${index}">${tablaTitle}</label>
            </div>`;
  } else if( esCheckbox ){
    return `<div class="d-flex justify-content-center">
            <div class="form-check">
              <input 
                type="${type}" 
                class="form-check-input" 
                onclick="${event}" 
                id="${index}" 
                name="${index}"
                value="${objetoEmpleado[index]}" 
                ${objetoEmpleado[index] ? 'checked' : ''}>
              <label class="form-check-label" for="${index}">${tablaTitle}</label>
            </div>
            </div>
            `;
  } else if( esFile ){
    return `<div class="m-2 requires-validation" novalidate>
              <input 
                type="file" 
                class="form-control" 
                onkeyup="${event}" 
                placeholder="${tablaTitle}" 
                id="${index}" 
                name="${index}" 
                value="${objetoEmpleado[index]}"
                ${patternAttr}
                ${titleAttr}
                ${requiredAttr}>
              <label for="floatingInput">${tablaTitle}</label>
              ${invalidFeedback}
            </div>`;
  } else // es input
    return `<div class="form-floating m-2 requires-validation" novalidate>
              <input 
                type="${type}" 
                class="form-control" 
                onkeyup="${event}" 
                placeholder="${tablaTitle}" 
                id="${index}" 
                name="${index}" 
                value="${objetoEmpleado[index]}"
                ${patternAttr}
                ${titleAttr}
                ${requiredAttr}>
              <label for="floatingInput">${tablaTitle}</label>
              ${invalidFeedback}
            </div>`;
}

function getInputFilaForm(indexesWithType, objetoFila, tablaTitles, colTamanos,j){
  let ret = `<div class="form-floating m-2 requires-validation" novalidate style="margin:1">
              <div class="row">`;

  indexesWithType.forEach((index, i) => {
      var event = '';
      var patternAttr = '', titleAttr = '', invalidFeedback = '', requiredAttr = '';
      // index = index + i;
      index = index + j

      if( index.includes('^') ){
        var type = 'date';
        event = '';
        // objetoFila[index] = objetoFila[index].split('T')[0].toString();
        let x= '';
      }else if( index.includes('#') ){
        event = 'puntos(this);toggleInvalid(this)';
        var type = 'text';
        // objetoFila[index] = setDotSeparator(objetoFila[index]);
      }else if( index.includes('~') ){
        event = '';
        if(index=='nombre~'){
          patternAttr  = 'pattern="^[A-Za-z\\s]+$"';
          titleAttr = 'title="Solo letras o espacios sin caracteres especiales"';
        }
        var type = 'text';
      }else if( index.includes('%') ){
        event = 'porcentaje(this)';
        var type = 'text';
        objetoFila[index] *= 100;
        objetoFila[index] += '%';
      }else if( index.includes('&') ){
        event = '';
        requiredAttr = 'disabled';
        var type = 'text';
      }
      ret +=    `<div class="col-${colTamanos[i]}">
                  <input 
                    type="${type}" 
                    class="form-control" 
                    onkeyup="${event}" 
                    placeholder="${tablaTitles[i]}" 
                    id="${index}" 
                    name="${index}" 
                    value="${objetoFila[index]}"
                    ${patternAttr}
                    ${titleAttr}
                    ${requiredAttr}
                    aria-label="${tablaTitles[i]}">
                  ${invalidFeedback}
                </div>`;
    });
      ret +=  `</div>
            </div>`;
  return ret;
}

function setDotSeparator(number){
  return number.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ".");
}

function setFormatoPesos(input) {
  if(!input) input = '0';
  input = input.toString();
  if(input.includes('#')) return input;
  var input = Math.ceil(input).toString();
  var newValue = '$ ' + input //.replace(/\D/g, ",") // coma decimal
                                       .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, "."); // puntos de miles
  return newValue;
}

function escribirTablaHTML(miTabla) {
  var output = `<table class="table table-hover table-sm">`;
  for(fila in miTabla){
      var celda = '';
      if(fila == 'header_row')
      {
        output += `<thead class='table-dark'>`;
        output += `<tr>`;
        for(var j=0; j<miTabla[fila].length; j++){
          celda = miTabla[fila][j];
          output += `<th class='text-end'>${celda}</th>`;
        }
        output += `</tr>`;
        output += `</thead>`;
        output += `<tbody>`;
      } 
      else if(fila == 'foot_row')
      {
        output += `<tfoot>`;
        output += `<tr>`;
        for(var j=0; j<miTabla[fila].length; j++){
          celda = miTabla[fila][j];
          if(j==0) 
            output += `<td>${typeof celda === 'string' ? celda.toUpperCase() : celda}</td>`;
          else
            output += `<td class='text-end'>${celda}</td>`;
        }
        output += `</tr>`;
        output += `</tfoot>`;
      } 
      else 
      {
        output += `<tr>`;
        for(var j=0; j<miTabla[fila].length; j++){
          celda = miTabla[fila][j];
          if(j==0) 
            output += `<td>${typeof celda === 'string' ? celda.toUpperCase() : celda}</td>`;
          else
            output += `<td class='text-end'>${celda}</td>`;
        }
        output += `</tr>`;
      }
  }
  output += `</tbody>`;
  output += "</table>";

  return output;
}

// function setFormatoNumero(input) {
//   if (!input) input = '0';
//   var newValue = input.toString();
//   return newValue;
// }

//------------------------------------- HORAS -----------------------------------------
function calcularHoras(empleado){

  var diurnas = 0, nocturnas = 0, diurnasDom = 0, nocturnasDom = 0, diasDesplazamientos = 0;

  for (let dia of diasSemana) {
    if (empleado[dia] != '') {
      diasDesplazamientos++;
      var jornada = empleado[dia];
      var intervalos = jornada.split(';');
      for (var key in intervalos) {
        var horas = intervalos[key];
        var array = horas.split('-');
        array[0] = parseTimeTwelve(array[0]);
        array[1] = parseTimeTwelve(array[1]);
        if(dia == 'domingo'){
          diurnasDom += calcularDiurnas(array);
          nocturnasDom += calcularNocturnas(array);
        } else {
          diurnas += calcularDiurnas(array);
          nocturnas += calcularNocturnas(array);
        }
      }
    }
  }
  empleado['horasHorarioOrdinarioDia'] = diurnas;
  empleado['horasHorarioOrdinarioNoche'] = nocturnas;
  empleado['horasHorarioDominicalDia'] = diurnasDom;
  empleado['horasHorarioDominicalNoche'] = nocturnasDom;
  empleado['diasDesplazamientos#'] = diasDesplazamientos;
  empleado['horasHorarioTotal'] = diurnas + nocturnas + diurnasDom + nocturnasDom;
  return empleado;
}

function calcularHorasSEDE(empleado){

  var diurnas = 0, nocturnas = 0, diurnasDom = 0, nocturnasDom = 0, diasDesplazamientos = 0;

  for (let dia of diasSemana) {
    if (empleado[dia] != '') {
      diasDesplazamientos++;
      var jornada = empleado[dia];
      var intervalos = jornada.split(';');
      for (var key in intervalos) {
        var horas = intervalos[key];
        var array = horas.split('-');
        array[0] = parseTimeTwelve(array[0]);
        array[1] = parseTimeTwelve(array[1]);
        if(dia == 'domingo'){
          diurnasDom += calcularDiurnas(array);
          nocturnasDom += calcularNocturnas(array);
        } else {
          diurnas += calcularDiurnas(array);
          nocturnas += calcularNocturnas(array);
        }
      }
    }
  }
  empleado['horasHorarioOrdinarioDiaSEDE'] = diurnas;
  empleado['horasHorarioOrdinarioNocheSEDE'] = nocturnas;
  empleado['horasHorarioDominicalDiaSEDE'] = diurnasDom;
  empleado['horasHorarioDominicalNocheSEDE'] = nocturnasDom;
  empleado['diasDesplazamientos#SEDE'] = diasDesplazamientos;
  return empleado;
}

function calcularHorasPropuestas(empleado){ 
  let horario = {};
  if(empleado['horarioPropuesto'])
    var horarioPropuesto = empleado['horarioPropuesto'].split('||');
  else
    return calcularHorasSEDE(empleado);

  diasSemana.forEach((dia, index) => {
    horario[dia] = empleado[dia];
    empleado[dia] = horarioPropuesto[index];
  });

  empleado = calcularHorasSEDE(empleado);
  diasSemana.forEach((dia) => { empleado[dia] = horario[dia]; });

  return empleado;
}

function filtrarHoraInicio(dia){
  var diaHorario = dia.toLowerCase();
  arregloEmpleados = [];
  activo = {
    fila : ss.getActiveCell().getRow(),
    columna : ss.getActiveCell().getColumn(),
    nombreHoja : 'NOMINA'
  }
  arregloHoja = ss.getSheetByName(activo.nombreHoja).getRange('1:200').getValues();
  leerHoja();

  var cargosH = ["BARR", "MESA"] //AQUI ESTAN LOS CARGOS QUE SE TIENEN EN CUENTA PARA LA FUNCION
  var turnos = {};
  var turnosCompletos = {};

  for(i in cargosH){
    let empleadosCargo = arregloEmpleados.filter(emp => (cargosH[i] == emp['cargo*'].split(' - ')[0] && emp[diaHorario] != ''));
    if(empleadosCargo[0]){
      let cargo = empleadosCargo[0]['cargo*'];
      let turnosCargo = {}; 

      empleadosCargo.forEach( emp => {
          let turno = emp[diaHorario].split(";")[0];
          let starttime = parseTimeTwelve(turno.split("-")[0]);
          if (starttime in turnosCargo)
            turnosCargo[starttime].push(emp['nombre~']); 
          else
            turnosCargo[starttime] = [emp['nombre~']];

          //SE TOMA EL TURNO COMPLETO PARA MOSTRARLO EN LA HOJA HORARIOS:
          turnosCompletos[emp['nombre~']] = emp[diaHorario]; 
      });

      turnos[cargo] = turnosCargo;
    }
  }
  
  return [turnos, turnosCompletos]; 
}

/////////////////////////SECCION//QUE//NO//DEBE//TOCARSE//NUNCA/////////////////////////

//convierte cualquier fecha en dd/mm/yyyy
function fechaExistente(stringFecha) {
   let d = new Date(stringFecha.toString().slice(4, 15));//se crea d como un elemento de tipo fecha cortando la fecha de formato largo a formato simple 
  let dia= stringFecha.getDate(); // asignamos el valor del dia existente en la fecha a la variable dia para que no haya ningun error de ejecucion
  if(dia<10){// si el dia es menor a 10
    if (d.getMonth() < 10) {//si el mes es menor a 10
    d = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-0" + dia;//tanto dia como mes se separan con - y agregamos un 0 antes del digito del mes, esto para que el input reciba el formato de forma correcta
  } else {
    d = d.getFullYear() + "-" + (d.getMonth() + 1) + "-0" + dia;// caso contrario solo se separan con -
  }
  }else if (d.getMonth() < 10) {// si el dia es mayo que 10 pero el mes es menor que 10 
    d = d.getFullYear() + "-0" + (d.getMonth() + 1) + "-" + dia; // se agrega un 0 antes del digito del mes
  } else {
    d = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + dia;// solo separa con -
  }
  return d;
}

//Las 12:00 PM son las 12 del mediodia. Las 12:00 AM son las 00:00 de la media noche
//Convierte de HH:MM AA a HH:MM
function parseTime24(s) {
  var c = s.split(':');
  var units = c[1].split(' ');
  var hours = parseInt(c[0]) % 12;
  if (units[1] == "PM") hours += 12;
  var st = "";
  if (hours < 10) st += "0";
  st += hours.toString() + ":" + units[0];
  return st;
}

//Convierte HH:MM a MM (int)
function parseTime(s) {
  var c = s.split(':');
  return parseInt(c[0] * 60 + parseInt(c[1]));
}

//Convierte HH:MM AA a MM (int). CREO QUE EN VEZ DE ESTO MEJOR USAR parseTime24 Y parseTime
function parseTimeTwelve(s) {

  var c = s.split(':');
  var units = c[1].split(' ');
  var time = 0;
  if (c[0] == 12 && (units[1] == "AM" || units[1] == "am")) { //Si son las 12:MM AM (medianoche)
    time += 1440; //24 h en minutos
  } else {
    time += parseInt(c[0] * 60);
  }

  if (units[1] == "PM" || units[1] == "pm") {
    if (c[0] != 12) time += 720; //12 h
  }
  time += parseInt(units[0]);
  return time;
}

function test() {
  return "ok";
}

//Convertir de MM (int) a "HH:MM AA"
function convertToTwelve(number) {
  var newtime = "";
  var timez = " AM"; //inicializar final de la hora
  if ((number / (12 * 60)) >= 1) { //si number se pasa del medio dia
    timez = " PM"; //estamos en PM
    number = number % (12 * 60); //conseguir minutos de esa parte del dia
  }
  var tenths = parseInt(number / 60); //parte entera de la hora HH

  if (tenths < 10) {
    if (tenths == 0) newtime += "12"; //concatenar "12"
    else newtime += "0" + tenths.toString(); //concatenar el 0 antes para que HH sea 0H (<10)
  }
  else newtime += tenths.toString();

  var units = number % 60; //Parte de la hora MM
  if (units == 0) newtime += ":00";
  else {
    if (units < 10) newtime += ":0" + units.toString(); //tiene un solo digito
    else newtime += ":" + units.toString();             //tiene dos digitos
  }

  newtime += timez; //concatenaos la parte AA
  return newtime;
}

function checkEvery(array, value, dir) {
  for (key in array) {
    var value = array[key];
    if (dir) {
      if (val < value) return false;
    } else {
      if (val > value) return false;
    }
  }
  return true;
}

function calcularDiurnas(array) {
  var inicio = parseInt(array[0]);
  var final = parseInt(array[1]);
  var horas = 0;
  if (inicio == 1440 & final > 360) inicio = 360;
  if ((inicio < 360 || inicio > 1260) && (final < 360 || final > 1260) && (final < inicio)) return 0;
  if (inicio >= 1260 && inicio < final) return 0;
  if (inicio > 1260 || inicio < 360) inicio = 360;
  if (final > 1260 || final < 360) final = 1260;

  return Math.abs((final - inicio) / 60);
}

function calcularNocturnas(array) {
  var inicio = parseInt(array[0]);
  var final = parseInt(array[1]);
  var horas = 0;
  if ((360 <= inicio && inicio <= 1260) && (final >= 360 && final <= 1260)) {
    var v = 360 <= final <= 1260;
    return 0;
  }
  var otras = 0;
  if (array[0] < 360) otras = 360 - array[0];
  if (array[0] < 1260) inicio = 1260;
  if (array[1] < 360) final += 1440;
  return Math.abs((final - inicio + otras) / 60);
}

/*************************************************************/
// NumeroALetras
// The MIT License (MIT)
// 
// Copyright (c) 2015 Luis Alfredo Chee 
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 
// @author Rodolfo Carmona
// @contributor Jean (jpbadoino@gmail.com)
/*************************************************************/
// Retrieved from @rgcl comment on Aug 6, 2017 • https://gist.github.com/alfchee/e563340276f89b22042a, 
/*************************************************************/
var numeroALetras = (function() {

// Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
    function Unidades(num){

        switch(num)
        {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    function Decenas(num){

        let decena = Math.floor(num/10);
        let unidad = num - (decena * 10);

        switch(decena)
        {
            case 1:
                switch(unidad)
                {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch(unidad)
                {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad);
            case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad);
            case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad);
            case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch(centenas)
        {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
            case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if(strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = Miles(resto);

        if(strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: 0, // (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
            letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO'
        };

        if (data.centavos > 0) {
            data.letrasCentavos = 'CON ' + (function () {
                    if (data.centavos == 1)
                        return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                    else
                        return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
                })();
        };

        if(data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };

})();

