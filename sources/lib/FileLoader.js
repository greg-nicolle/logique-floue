
var FileLoader = function (url, onLoaded) {
    this.url = url;
    this.onLoaded = onLoaded;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = _.bind( this.onDownloadDone, this, xhr );
    xhr.open("GET", this.url, true);
    xhr.send(null);
};

FileLoader.prototype.onDownloadDone = function(xhr) {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200 || xhr.status === 0) {
            if (xhr.responseText) {
                this.onLoaded(xhr.responseText);
            } else {
                console.warn("Loader[" + this.url + "]got empty response");
            }
        } else {
            console.error("Loader[" + this.url + "][" + xhr.status + "]");
        }
    }
};
