// 绑定对象，使得回调函数中的this指向当前对象
function bind(obj, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return func.bind(obj, ...args);
}


// 绘制结点函数，将所有图片的锚点都设置为图片底边中心，以方便绘制
CanvasRenderingContext2D.prototype.drawNode = function(img, x, y) {
    this.drawImage(img, x - img.width/2, this.canvas.height - (y + img.height));
}


// 自定义事件处理器
var Event = {
    _mapEvents: {},

    on: function(type, callback) {
        this._mapEvents[type] = callback;
    },

    off: function(type) {
        this._mapEvents[type] = null;
    },

    emit: function(type) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (this._mapEvents[type] && typeof this._mapEvents[type] === 'function') {
            this._mapEvents[type].apply(null, args); // 因已经使用bind绑定this，再次使用apply绑定时无效
        }
    }
};


// 图片资源加载器
var ImageLoader = {
    _loadQueue: [], // 资源加载队列，保证资源的有序加载
    _callback: null, // 所有资源加载完成后，执行
    mapImages: {},  // 图片资源

    init: function() {
        this._initEvents();

        this._addResources('stand', ['stand1_0', 'stand1_1', 'stand1_2', 'stand1_3', 'stand1_4']);
        this._addResources('walk', ['walk1_0', 'walk1_1', 'walk1_2', 'walk1_3']);
        this._addResources('jump', ['jump_0']);
        this._addResources('bg', ['map_0', 'map_1']);
        this._loadRes();
    },

    _initEvents: function() {
        Event.on('AddImage', bind(this, function(type, img) {
            if (!this.mapImages[type]) this.mapImages[type] = [];
            this.mapImages[type].push(img);
        }));
    },

    _addResources: function(type, arrURLs) {
        for (var i = 0; i < arrURLs.length; i++) {
            this._loadQueue.push({type: type, url: arrURLs[i]});
        }
    },

    _loadRes: function() {
        var entry = this._loadQueue.shift();
        var img = new Image();
        img.setAttribute('src', 'img/' + entry.url + '.png');
        img.addEventListener('load', bind(this, function() {
            Event.emit('AddImage', entry.type, img);
            if (0 === this._loadQueue.length) {
                this._callback ? this._callback() : void(0);
            } else {
                this._loadRes();
            }
        }));
    },

    setCallBack: function(callback) {
        this._callback = callback;
    }
};


// 动画播放器
var Animation = {
    curRes: null,
    curAnim: null,
    curIndex: 0,
    animations: {},
    
    curName: 'stand',
    lastName: 'stand',

    init: function(interval, res) {
        this.animations['walk'] = this.item(200, ImageLoader.mapImages['walk']);
        this.animations['stand'] = this.item(200, ImageLoader.mapImages['stand']);
        this.animations['jump'] = this.item(200, ImageLoader.mapImages['jump']);
        this.curAnim = this.animations[this.curName];
        this.curRes = this.curAnim.res[this.curIndex];
    },

    item: function(interval, res) {
        return {interval: interval, res: res};
    },

    update: function(player) {
        var resName = 'stand';
        if (player.isLeft || player.isRight) resName = 'walk';
        if (player.isJump || player.isFall) resName = 'jump';
        if (player.isStand) resName = 'stand';
        if (resName != this.curName) {
            this.lastName = this.curName;
            this.curIndex = 0;
        }
        this.curName = resName;
        this.curAnim = this.animations[resName];

        var nowTime = Date.now();
        if (!this.lastTime) this.lastTime = nowTime;

        if (nowTime - this.lastTime > this.curAnim.interval) {
            this.lastTime = nowTime;
            this.curIndex++;
            if (this.curIndex >= this.curAnim.res.length) this.curIndex = 0;
        }
    },

    getRes: function() {
        return this.curAnim.res[this.curIndex];
    }
};


// 玩家
var Player = {
    x: 400,
    y: 105,
    minX: 175,
    maxX: 650,
    speed: 200,
    jumpSpeed: 550,
    maxHeight: 140,
    curHeight: 0,

    isFaceRight: false,  // 用于绘制角色的朝向

    isLeft: false,
    isRight: false,
    isJump: false,
    isFall: false,
    isStand: true,

    init: function() {
        
    },

    moveLeft: function(isLeft) {
        this.isLeft = isLeft;
        if (this.isLeft) this.isFaceRight = false;
    },

    moveRight: function(isRight) {
        this.isRight = isRight;
        if (this.isRight) this.isFaceRight = true;
    },

    jump: function() {
        if (this.isJump || this.isFall) return;
        this.isJump = true;
    },

    update: function(dt) {
        // 站立状态
        if (false === this.isLeft && false === this.isRight && false === this.isJump && false === this.isFall) {
            this.isStand = true;
        } else {
            this.isStand = false;
        }

        // 左右移动状态
        if (this.isLeft) {
            this.x -= dt*this.speed;
            if (this.x < this.minX) this.x = this.minX;
        } else if (this.isRight) {
            this.x += dt*this.speed;
            if (this.x > this.maxX) this.x = this.maxX;
        }

        // 跳跃状态
        if (this.isJump) {
            var temp = this.curHeight;
            this.curHeight += dt*this.jumpSpeed;
            if (this.curHeight >= this.maxHeight) {
                this.curHeight = this.maxHeight;
                this.isJump = false;
                this.isFall = true;
            }
            this.y += this.curHeight - temp;
        } else if (this.isFall) {
            var temp = this.curHeight;
            this.curHeight -= dt*this.jumpSpeed;
            if (this.curHeight < 0) {
                this.curHeight = 0;
                this.isFall = false;
            }
            this.y += this.curHeight - temp; 
        }

        // 更新图片资源
        Animation.update(this);
    },

    draw: function(ctx) {
        ctx.save();
        var curRes = Animation.getRes();

        ctx.translate(this.x, this.y);
        this.isFaceRight ? ctx.scale(-1, 1) : ctx.scale(1, 1);
        ctx.drawNode(curRes, 0, 0);
        ctx.restore();
    },
}


// 游戏
var Game = {
    canvas: document.getElementById('canvas'),
    ctx: canvas.getContext('2d'),

    imgs: null,
    lastTime: 0,

    init: function() {
        ImageLoader.setCallBack(bind(this, this.start));
        ImageLoader.init();
    },

    initKeyEvents: function() {
        window.addEventListener('keydown', function(e) {
            switch(e.keyCode) {
                case 37:
                    Player.moveLeft(true);
                    break;
                case 38:
                    Player.jump();
                    break;
                case 39:
                    Player.moveRight(true);
                    break;
            }
        });
        window.addEventListener('keyup', function(e) {
            switch(e.keyCode) {
                case 37:
                    Player.moveLeft(false);
                    break;
                case 39:
                    Player.moveRight(false);
                    break;
            }
        });
    },

    start: function() {
        Animation.init();
        Player.init();
        this.initKeyEvents();

        this.imgs = ImageLoader.mapImages;
        this.lastTime = Date.now();
        this.loop();
    },

    loop: function() {
        var nowTime = Date.now();
        var dt = nowTime - this.lastTime;
        this.lastTime = nowTime;
        this.update(dt/1000);
        this.draw();
        requestAnimationFrame(bind(this, this.loop));
    },

    update: function(dt) {
        Player.update(dt);
    },

    draw: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawNode(this.imgs['bg'][0], this.canvas.width/2, 0);   // 绘制背景
        this.ctx.drawNode(this.imgs['bg'][1], this.canvas.width/2, 0);   // 绘制背景
        Player.draw(this.ctx);  // 绘制玩家
    },
}

Game.init();