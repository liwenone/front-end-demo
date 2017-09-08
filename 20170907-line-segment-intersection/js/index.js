function Point(x, y) {
    this.x = x;
    this.y = y;

    this._radius = 10;
    this.bIsFill = false;
}

Point.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3
    ctx.strokeStyle = this.bIsFill ? '#639A00' : '#FF4040';
    ctx.fillStyle = '#639A00';
    ctx.arc(this.x, this.y, this._radius, 0, Math.PI * 2, false);
    this.bIsFill ? ctx.fill() : ctx.stroke();
    ctx.restore();
}

Point.prototype.isContain = function(p) {
    return Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2) < Math.pow(this._radius, 2);
}


function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}

Line.prototype.draw = function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3
    ctx.strokeStyle = '#1240AB';
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.restore();

    this.p1.draw(ctx);
    this.p2.draw(ctx);
}

Line.prototype.intersect = function(line) {
    var dx1 = this.p1.x - this.p2.x;
    var dy1 = this.p1.y - this.p2.y;
    var dx2 = line.p1.x - line.p2.x;
    var dy2 = line.p1.y - line.p2.y;

    var d = dx1*dy2 - dy1*dx2;
    if (d == 0) return;

    var x = (this.p1.x*this.p2.y-this.p1.y*this.p2.x)*(line.p1.x-line.p2.x)
            -(this.p1.x-this.p2.x)*(line.p1.x*line.p2.y-line.p1.y*line.p2.x);
    var y = (this.p1.x*this.p2.y-this.p1.y*this.p2.x)*(line.p1.y-line.p2.y)
            -(this.p1.y-this.p2.y)*(line.p1.x*line.p2.y-line.p1.y*line.p2.x);
    x = x/d;
    y = y/d;

    var v1 = (this.p1.x-x)*(this.p2.x-x) + (this.p1.y-y)*(this.p2.y-y);
    var v2 = (line.p1.x-x)*(line.p2.x-x) + (line.p1.y-y)*(line.p2.y-y);
    return v1 < 0 && v2 < 0 ? new Point(x, y) : null;
}


function initLines(num) {
    var r = 200;

    for (var i = 0; i < num; i++) {
        var x1 = r + Math.random()*(canvas.width - 2*r);
        var y1 = r + Math.random()*(canvas.height - 2*r);
        
        var x2 = -r + Math.random()*2*r + x1;
        var y2 = -r + Math.random()*2*r + y1;

        var p1 = new Point(x1, y1);
        var p2 = new Point(x2, y2);

        p1.bIsFill = true;
        p2.bIsFill = true;

        arrLines.push(new Line(p1, p2));
    }
}


function update(dt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < arrLines.length; i++) {
        arrLines[i].draw(ctx);
    }

    for (var i = 0; i < arrLines.length - 1; i++) {
        var line1 = arrLines[i];
        for (var j = i + 1; j < arrLines.length; j++) {
            var line2 = arrLines[j];
            var point = line1.intersect(line2)
            if (point) {
                point.draw(ctx);
            }
        }
    }

    window.requestAnimationFrame(update);
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var dragPoint = null;
var arrLines = [];

window.addEventListener('mousedown', function(event) {
    var tmpPoint = new Point(event.clientX, event.clientY);
    for (var i = 0; i < arrLines.length; i++) {
        var p1 = arrLines[i].p1;
        var p2 = arrLines[i].p2;
        dragPoint = p1.isContain(tmpPoint) ? p1 : (p2.isContain(tmpPoint) ? p2 : null);
        if (dragPoint) break;
    }
})

window.addEventListener('mousemove', function(event) {
    if (dragPoint) {
        dragPoint.x = event.clientX - canvas.getBoundingClientRect().left;
        dragPoint.y = event.clientY - canvas.getBoundingClientRect().top;
    }
})

window.addEventListener('mouseup', function(event) {
    dragPoint = null;
})

initLines(5);
update();