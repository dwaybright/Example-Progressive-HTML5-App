function handleFileUpload(event) {
    var fileList = this.files;

    for(var i = 0; i < fileList.length; i++) {
        var file = fileList[i];

        var fileHolder = {
            file: file
        };

        if(database) {
            database.putObject(DB_OBJECT_STORE_FILES, fileHolder, handleNewFileRecord);
        } else {
            // fallback to maintain reference, have user upload again later?
        }
    }
}

function handleNewFileRecord(fileRecord) {
    console.log(fileRecord.file.name);
}