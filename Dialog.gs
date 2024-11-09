function editar() {

  var html = HtmlService.createTemplateFromFile('document');

  var arregloSeccion = ['xmlString{'];
  var obj = { 'xmlString{': '' };
  arregloSeccion.map(
    item =>  html[item] = ''
  )  

  var page = html.evaluate();
  // page.append('<form class="text-center" id="infoForm">'); // onsubmit="return validarForm(this)"
  // page.append('<input type="hidden" id="tipo" name="tipo"  value="editar">');
  // // page.append(getInputForm('xmlString{', obj, 'TEXTO XML', true));
  // page.append(getInputForm('file;', obj, '', true));
  // page.append('<button type="submit" class="btn btn-primary my-2">Actualizar informacion de empleado</button>');
  // page.append('</form>');
  
  page.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  page.setWidth(500).setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(page, 'CONVERSOR');
  // SpreadsheetApp.getUi().showSidebar(page);
}

function validarForm(formObject){
  switch(formObject.tipo){
    case 'editar':
      if('id#' in formObject) validarCedulaRepetida(formObject['id#']); // si el form tiene el input id#
      formEditar(formObject);
      break;

    case 'insertar':
      validarCedulaRepetida(formObject['id#']);
      formInsertar(formObject);
      break;

    case 'editar-extras':
      formExtras(formObject);
      break;

    case 'select-mes-cuentas':
      formCuentas(formObject);
      break;


    default:
      return;
  }
}

function leerXml(fileId){
  // {
  // "filename": "### inputted filename ###",
  // "fileId": "###",
  // "fileUrl": "https://drive.google.com/file/d/###/view?usp=drivesdk"
  // }
  convertirXml(fileId);
}

function convertirXml(fileId){
  showLoadingDialog();
  
  try{
    // var url = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media&access_token=" + ScriptApp.getOAuthToken(); // Added
    // var res = UrlFetchApp.fetch(url).getContentText(); 
    var file = DriveApp.getFileById(fileId);
    var fileName = file.getName();
    var xmlBlob = file.getBlob().getDataAsString();
    // var xml = XmlService.parse(xmlBlob);
    var [records, formatInfo] = getRecords(xmlBlob);
    writeRecords(fileName, records, formatInfo);
    closeLoadingDialog('Conversión');
  } catch(error){ 
    showErrorDialog(error.stack); 
    console.error(error);
  }
}

function formEditar(formObject){
  showLoadingDialog();
  
  try{
    var form = JSON.parse(JSON.stringify(formObject));
    var xml = DriveApp.getFileById()
    var fileName = xml.getName();
    var [records, formatInfo] = getRecords(xml);
    writeRecords(fileName, records, formatInfo);
    closeLoadingDialog('Conversión');
  } catch(error){ 
    showErrorDialog(error.stack); 
    console.error(error);
  }
}

function writeRecords(fileName, records, formatInfo){
  let sheet = ss.getSheetByName(fileName);
  if(!sheet) {sheet = ss.insertSheet(); sheet.setName(fileName); }
  sheet.clear();

  // var info = [[],[]];
  // // for(let key in formatInfo)
  // for(const key of Object.keys(formatInfo)){
  //   info[0].push(key);
  //   info[1].push(formatInfo[key]);
  // }
  // sheet.getRange('1:1').setBackground('#45818e').setFontColor('white');
  // sheet.getRange('5:5').setBackground('#a2c4c9').setFontColor('white');
  // let rangeInfo = sheet.getRange(1,1,2,info[0].length);
  // rangeInfo.setValues(info);

  let rangeRecords = sheet.getRange(5,1,records.length,records[0].length);
  rangeRecords.setValues(records);
}

//------------------------------------- showDialog -----------------------------------------
function showLoadingDialog() {
  var htmlOutput = HtmlService
    .createHtmlOutput()
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Cargando...');
}
function closeLoadingDialog(action){
  var htmlOutput = HtmlService
    .createHtmlOutput('<script>google.script.host.close();</script>')
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, action);
}
function showErrorDialog(errorMessage){
  var htmlOutput = HtmlService
    .createHtmlOutput(`<div style="text-align: center; font-family: monospace;">${errorMessage}</div>`)
    .setWidth(300)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Error');
  // console.error(errorMessage.stack);
}