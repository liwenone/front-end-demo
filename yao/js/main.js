function Heart(x, y, index, alpha, delay, vx, vy, vr) {
  this.x = x
  this.y = y
  this.r = 0

  this.index = index
  this.alpha = alpha || 1
  this.delay = delay || 0
  this.showAlpha = 0

  this.vx = vx || 0
  this.vy = vy || 0
  this.vr = vr || 0
}


function inheart(x, y, r) {
  var z = ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) * ((x / r) * (x / r) + (y / r) * (y / r) - 1) - (x / r) * (x / r) * (y / r) * (y / r) * (y / r);
  return z < 0;
}


var STATIC_HEART = 400
var DYNAMIC_HEART = 5
var MAX_Y = 1548 + 1459 - 90


var Index = {
  init: function () {
    this.initData()
    this.initEvents()
    this.loadRes()
  },


  // 初始化数据
  initData: function () {
    var canvas = document.getElementById('canvas')
    this.ctx = canvas.getContext('2d')
    this.ctx.globalCompositeOperation = 'destination-over'
    // this.ctx.imageSmoothingEnabled = true

    this.mapRes = {
      'tree': 'tree.png',
      'text': 'text.png',
      'heart_1': 'heart_1.png',
      'heart_2': 'heart_2.png',
      'heart_3': 'heart_3.png',
      'heart_4': 'heart_4.png',
      'heart_5': 'heart_5.png',
      'heart_6': 'heart_6.png',
      'heart_7': 'heart_7.png',
    }

    this.arrHearts = []
    this.isTouching = false
  },


  // 初始化事件
  initEvents: function () {
    var that = this

    var touch = false
    window.addEventListener('touchstart', function() {
      touch = true;

      (function() {
        setTimeout(function() {
          if (touch && !that.isTouching) that.isTouching = true
        }, 1000)
      })()
    })

    window.addEventListener('touchend', function() {
      touch = false
    })
  },


  // 加载资源
  loadRes: function () {
    var that = this

    var loading = document.getElementById('loading')
    var maxLen = Object.keys(that.mapRes).length
    var currLen = 0
    for (var i in that.mapRes) {
      var image = new Image()
      image.onload = (function (key) {
        return function () {
          that.mapRes[key] = this
          currLen++
          loading.innerHTML = 'loading... ' + Math.ceil(currLen / maxLen * 100) +  '%'
          if (currLen >= maxLen) {
            loading.className = 'fadeOut'
            setTimeout(function() {
              loading.style.display = 'none'
              that.ctx.canvas.className = 'fadeIn'
              that.start()
            }, 1000)
          }
        }
      })(i)
      image.src = 'img/' + that.mapRes[i]
    }
  },


  // 场景开始
  start: function () {
    var counter = 0
    while (counter < STATIC_HEART) {
      var heart = this.getNewHeart(false, counter)
      if (heart) {
        this.arrHearts.push(heart)
        counter++
      }
    }

    var that = this
    var startTime = Date.now()
    var fn = function () {
      var now = Date.now()
      var dt = now - startTime
      startTime = now
      that.update(dt)
      window.requestAnimationFrame(fn)
    }
    fn()
  },


  // 创建心
  getNewHeart: function (isDynamic, counter) {
    var x = parseInt(450 + Math.random() * 1800)
    var y = parseInt(1000 + Math.random() * 1800)
    if (inheart(x - 1200, 1800 - y, 650)) {
      var index = Math.ceil(Math.random() * 7)
      var alpha = 0.8 + Math.random() * 0.2
      var delay = 0
      var vx = 0
      var vy = 0
      var vr = 0

      if (isDynamic) {
        vx = 0.574 * Math.random() * 500
        vy = 400 + Math.random() * 100
        vr = 30 + 60 * Math.random()
      } else {
        delay = counter * 10
      }

      return new Heart(x, y, index, alpha, delay, vx, vy, vr)
    }
    return null
  },


  // 每帧更新
  update: function (dt) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  
    this.createHeart()
    this.updateHeart(dt)

    this.ctx.drawImage(this.mapRes.tree, 835, 1548)

    if (this.isTouching) this.ctx.drawImage(this.mapRes.text, 556, 400)
  },


  // 绘制心
  updateHeart: function (dt) {
    for (var i = this.arrHearts.length - 1; i >= 0; i--) {
      var item = this.arrHearts[i]
      if (item.delay > 0) {
        item.delay -= dt
      } else {
        this.ctx.save()
        
        var x = item.x
        var y = item.y
        var d = dt / 1000

        if (item.showAlpha < item.alpha) {
          item.showAlpha += d * item.alpha * 5
          this.ctx.globalAlpha = item.showAlpha
        } else {
          this.ctx.globalAlpha = item.alpha
          
          if (item.vr && this.arrHearts[STATIC_HEART - 1].delay <= 0) {
            item.x += item.vx * d
            item.r += item.vr * d
            item.y += item.vy * d
  
            x = 0
            y = 0
  
            if (MAX_Y < item.y) this.arrHearts.splice(i, 1)
            if (MAX_Y - item.y < 150) item.alpha = item.alpha > 0 ? (item.alpha - 2 * d) : 0
            
            this.ctx.translate(item.x, item.y)
            this.ctx.rotate(item.r * Math.PI / 180)
          }
        }
        
        this.ctx.drawImage(this.mapRes['heart_' + item.index], x, y)
        this.ctx.restore()
      }
    }
  },


  // 创建动态的心
  createHeart: function () {
    if (this.arrHearts.length < STATIC_HEART + DYNAMIC_HEART && Math.random() < 0.2) {
      var heart = this.getNewHeart(true)
      if (heart) this.arrHearts.push(heart)
    }
  }
}


Index.init()