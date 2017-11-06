function ImageLoader(url, callback) {
    var img = new Image();
    img.src = url;
    img.addEventListener('load', callback.bind(this, img));
}