function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
        var x = Math.random()*canvas.width;
        var y = -canvas.height/2;
        var width = Math.random()*50+10;
        var height = Math.random()*300+100;
        arr.push(new Rectangle(x, y, width, height));
    }
}

var arr = []
quickSortFunc(arr, 0, arr.length-1)