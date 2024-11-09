const ss = SpreadsheetApp.getActiveSpreadsheet();

function onOpen(){
  
   var ui = SpreadsheetApp.getUi();
        
    ui.createMenu('CONVERSOR')
        .addItem('ABRIR', 'editar')
        .addToUi();     
}