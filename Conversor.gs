function getRecords(xml) {
  // xml = xmlM + '</mas>';
  // xml += '</mas>';
  xml = xml.replace(/(\r\n|\n|\r)/gm, "");
  var document = XmlService.parse(xml);
  var xmlDoc = XmlService.getRawFormat()
    .setEncoding('ISO-8859-1')
    .format(document);

  var response = document.getRootElement();
  // var infoItems = response.getChild('Cab').getChildren();
  var docInfo = {};
  // infoItems.forEach(child => docInfo[child.getName()] = child.getText());
  var recordList = response.getChildren();

  var attributes = findAllAttributes(recordList);

  var output = [attributes];
  for (var i = 0, record; record = recordList[i]; i++) {
    let row = [];
    for(let attr of attributes){
      var recordAttr = record.getAttribute(attr);
      if(!recordAttr)
        var cell = '';
      else
        var cell = record.getAttribute(attr).getValue();
      row.push(cell);
    }
    output.push(row);
  }
  return [output, docInfo];
}

function findAllAttributes(recordList){
  if(recordList.length == 0) return [];
  var attributes = recordList[0].getAttributes().map(attr => attr.getName());

  for (var i = 0, record; record = recordList[i]; i++) {
    let newAttributes = record.getAttributes().map(attr => attr.getName());
    for(let attr of newAttributes)
      if(!attributes.includes(attr))
        attributes.push(attr);
  }

  return attributes;
}