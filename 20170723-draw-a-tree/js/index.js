(function() {
    "use strict";

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function TreeNode(parent, level, x, y) {
        this.parent = parent;
        this.children = []

        this.p0 = parent ? parent.p1 : new Point(x, y);
        this.p1 = new Point(x, y);

        this.level = level;
        this.life = 20;

        this.angle = 0;
        this.vx = 0;
        this.vy = 0;
    }

    TreeNode.prototype.grow = function() {
        if (this.life > 1) {
            this.p1.x += this.vx;
            this.p1.y += this.vy;

            ctx.beginPath();
            ctx.lineCap = "round";
           
            if (this.level > 0) {
                ctx.lineWidth = this.level * 6 - 5;
                ctx.strokeStyle = "#000";

                if (this.parent) {
                    ctx.moveTo(this.parent.p0.x, this.parent.p0.y);
                    ctx.quadraticCurveTo(this.parent.p1.x, this.parent.p1.y, this.p1.x, this.p1.y);
                }
            } else {
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#f40";
                ctx.moveTo(this.p0.x, this.p0.y);
                ctx.lineTo(this.p1.x, this.p1.y);
            }
            ctx.stroke();
        }

        if (this.life === 1 && this.level > 0) {
            this.children.push(BuildTreeNode(this));
            this.children.push(BuildTreeNode(this));
        }

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].grow()
        }

        this.life--;
    }

    function BuildTreeNode(parent) {
        var tree_node = new TreeNode(parent, parent.level-1, parent.p1.x, parent.p1.y);

        tree_node.angle = (parent.level === max_level) ? 
            -Math.PI/2 : 
            (Math.atan2(parent.p1.y - parent.p0.y, parent.p1.x - parent.p0.x) + Math.random()*Math.PI/2 - Math.PI/4);

        tree_node.vx = 10 * Math.cos(tree_node.angle);
        tree_node.vy = 10 * Math.sin(tree_node.angle);

        tree_node.life = tree_node.level === 1 ? 5 : Math.round(Math.random()*(tree_node.level*2)) + 2;
        return tree_node;
    }


    function loop() {
        root.grow();
        window.requestAnimationFrame(loop);
    }

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    var ctx = canvas.getContext("2d");

    var max_level = 7;
    var root = new TreeNode(null, max_level, canvas.width/2, canvas.height);

    loop();
})()