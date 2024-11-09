function doPost(e) {
  const folderId = "1ArcsNIPy1gXe3-yiZcRPNdK8VxERPlF0";  // Or Folder ID which is used for putting the file instead of "root", if you need.

  const blob = Utilities.newBlob(JSON.parse(e.postData.contents), e.parameter.mimeType, e.parameter.filename);
  const file = DriveApp.getFolderById(folderId).createFile(blob);
  const responseObj = {filename: file.getName(), fileId: file.getId(), fileUrl: file.getUrl()};
  return ContentService.createTextOutput(JSON.stringify(responseObj)).setMimeType(ContentService.MimeType.JSON);
}