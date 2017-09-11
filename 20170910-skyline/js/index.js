String.prototype.format = function() {
    var args = arguments;
    var i = 0;
    return this.replace(/%s/g, x=>args[i++]);
}


function Rectangle(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
}

Rectangle.prototype.draw = function(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
}


function quickSortFunc(arr, left, right) {
    if (left >= right) return;
    var key = arr[left];
    var l = left;
    var r = right;

    while (l < r) {
        while (arr[r].x >= key.x && l < r) r--;
        while (arr[l].x <= key.x && l < r) l++;
        if (l < r) {
            var tmp = arr[l];
            arr[l] = arr[r];
            arr[r] = tmp;
        }
    }
    arr[left] = arr[l];
    arr[l] = key;

    quickSortFunc(arr, left, l-1);
    quickSortFunc(arr, l+1, right);
}


function createRectangles(arr, num) {
    for (var i = 0; i < num; i++) {
        var x = Math.random()*(canvas.width - 200) + 20;
        var y = 0;
        var width = Math.random()*100+50;
        var height = Math.random()*200+50;
        var color = "rgb(%s, %s, %s)".format(Math.random()*256^0, Math.random()*256^0, Math.random()*256^0);
        arr.push(new Rectangle(x, y, width, height, color));
    }
}

function createSkyLines(arr, skylines) {
    var height = 0;
    for (var i = 0; i < arr.length; i++) {
        var rect = arr[i];
        if (rect.height > height) {

        }
    }
}



function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < arr.length; i++) {
        arr[i].draw(ctx);
    }

    window.requestAnimationFrame(update);
}


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var arr = []; 
var skylines = [];
createRectangles(arr, 10);
quickSortFunc(arr, 0, arr.length-1);
createSkyLines(arr, skylines);

update();
