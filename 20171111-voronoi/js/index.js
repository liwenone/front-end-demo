function ImageLoader(url, callback) {
    var img = new Image();
    img.src = url;
    img.addEventListener('load', callback.bind(this, img));
}

function createCanvas(w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
}