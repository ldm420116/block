(function(){
    var Game = window.Game = function(json,box){
        //获取画布
        this.canvas = document.querySelector(box);
        this.ctx = this.canvas.getContext("2d");
        //外部传过来的资源路径
        this.json = json;
        //接收资源空对象
        this.R = {};
        this.Music = {};
        //地图
        this.map = null;
        //人物
        this.role = null;
        //画布初始化
        this.init();
        //帧数
        this.fno = 0;
        //获取资源
        this.xhr();
    };
    //画布初始化
    Game.prototype.init = function(){
        this.w = document.documentElement.clientWidth;
        this.h = document.documentElement.clientHeight;
        if(this.w < 320){
            this.w = 320;
        }else if(this.w > 414){
            this.w = 414;
        }
        if(this.h < 568){
            this.h = 640;
        }else if(this.h > 736){
            this.h = 736;
        }

        this.canvas.width = this.w;
        this.canvas.height = this.h;

    };
    //获取资源
    Game.prototype.xhr = function(){
        var self = this;
        var picsum = 0;
        var bgmsum = 0;
        var end = 0;
        var xhr = new XMLHttpRequest();
        document.body.style.width = self.w + "px";
        document.body.style.height = self.h + "px";
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                var data = JSON.parse(xhr.responseText);
                for (var i = 0; i < data.image.length; i++) {
                    //资源获取中
                    self.R[data.image[i].name] = new Image();
                    self.R[data.image[i].name].src = data.image[i].url;
                    //资源获取完毕
                    self.R[data.image[i].name].onload = function(){
                        picsum++;
                        if(picsum == data.image.length){
                            end++;
                            if(end == 2){
                                self.start();
                            };
                        };
                        self.ctx.clearRect(0,0,self.w,self.h);
                        self.ctx.textAlign = "center";
                        self.ctx.fillText("正在加载第"+(picsum+bgmsum)+"/"+(data.image.length + data.audio.length)+"个资源,请稍后",self.w * 0.5,200);
                    };
                };
                //音乐类资源
                for (var i = 0; i < data.audio.length; i++) {
                    //创建一个同名的key
                    self.Music[data.audio[i].name] = document.createElement("audio");
                    //请求
                    self.Music[data.audio[i].name].src = data.audio[i].url;
                    self.Music[data.audio[i].name].onloadstart = function(){
                        bgmsum++;
                        if(bgmsum == data.audio.length){
                            end++;
                            if(end == 2){
                                self.start();
                            }
                        }
                    }
                }
            }
        };
        xhr.open("get",this.json);
        xhr.send();
    };
    Game.prototype.bindEvent = function(){
        var self = this;
        document.onkeydown = function(event){
            // console.log(event.keyCode)
            switch(event.keyCode){
                case 37:
                    self.role.move("L")
                    break;
                case 38:
                    self.role.move("U")
                    break;
                case 39:
                    self.role.move("R")
                    break;
                case 40:
                    self.role.move("D")
                    break;
            }
        };
        //选关
        document.getElementById("mycanvas").onclick = function(event){
            var mousex = event.pageX;
            var mousey = event.pageY;
            //上一关
            if(mousex >= self.w * 0.1 && mousex <= self.w * 0.3 && (mousey >= self.h * 0.8 && mousey <= self.h)){
                self.map.codeidx--;
                if(self.map.codeidx < 0){
                    self.map.codeidx = 0;
                }
                self.map.newCode();
            //下一关
            }else if(mousex >= self.w * 0.4 && mousex <= self.w * 0.65 && (mousey >= self.h * 0.8 && mousey <= self.h)){
                self.map.codeidx++;
                if(self.map.codeidx > self.map.maxsum - 1){
                    self.map.codeidx = self.map.maxsum - 1;
                }
                self.map.newCode();
            // 重来
            }else if(mousex >= self.w * 0.7 && mousex <= self.w * 0.8 && (mousey >= self.h * 0.8 && mousey <= self.h)){
                self.map.newCode();
            }
        }
        //方向键
        document.getElementById("fangxiang").onmousedown = function(event){
            var x = event.pageX;
            var y = event.pageY;
            //up
            if(x > self.w * 0.18599033 && x < self.w * 0.2898550724 && y > self.h * 0.20244565 && y < self.h * 0.264945652){
                self.role.move("U")
            //down
            }else if(x > self.w * 0.1956521739 && x < self.w * 0.29710144927 && y > self.h * 0.29483695652 && y < self.h * 0.35733695652){
                self.role.move("D")
            //left
            }else if(x > self.w * 0.103864734 && x < self.w * 0.219806763 && y > self.h * 0.2513586956 && y < self.h * 0.3084239130){
                self.role.move("L")
            //right
            }else if(x > self.w * 0.27294685 && x < self.w * 0.3743961 && y > self.h * 0.255434782 && y < self.h * 0.304347826){
                self.role.move("R")
            }
        }
    };
    //游戏开始
    Game.prototype.start = function(){

        var self = this;

        var stoparr = [this.R["stopbgm"],this.R["startbgm"]];
        var stopidx = 0;
        this.bgmidx = 1;
        //bgm
        this.Music["bgm" + this.bgmidx].play();
        //bgm结束后循环播放
        function bgmEnd(){
            self.Music["bgm" + self.bgmidx].onended = function(){
                self.bgmidx++;
                if(self.bgmidx > 4){
                    self.bgmidx = 1;
                }
                self.Music["bgm" + self.bgmidx].play();
                bgmEnd();
            }
        };
        bgmEnd();
        //设定停止音乐
        document.onclick = function(event){
            //当前鼠标点
            var mousex = event.pageX;
            var mousey = event.pageY;
            //点击停止音乐
            if(mousex >= self.w * 0.86 && mousex <= self.w && (mousey >= self.h * 0.13 && mousey <= self.h * 0.2)){
                if(stopidx == 1){
                    stopidx = 0;
                    self.Music["bgm" + self.bgmidx].play();
                }else{
                    stopidx = 1;
                    self.Music["bgm" + self.bgmidx].pause();
                }
            }
        };
        //地图类
        this.map = new Map();
        this.bindEvent();
        //全局定时器
        this.timer = setInterval(function(){
            self.fno++;
            //清屏
            self.ctx.clearRect(0,0,self.w,self.h);
            //背景
            self.ctx.save();
            self.ctx.fillStyle = "black";
            self.ctx.fillRect(0,0,self.w,self.h);
            self.ctx.restore();
            //场景渲染
            self.map.render();
            //渲染停止音乐
            self.ctx.drawImage(stoparr[stopidx],self.w * 0.86,self.h * 0.13);
            //渲染上一关、下一关、重新来
            self.ctx.drawImage(game.R["shang"],self.w * 0.1,self.h * 0.8);
            self.ctx.drawImage(game.R["xia"],self.w * 0.4,self.h * 0.8);
            self.ctx.drawImage(game.R["reast"],self.w * 0.7,self.h * 0.8);
            //测试帧数
            self.ctx.save();
            self.ctx.fillStyle = "orange";
            self.ctx.fillText("帧数："+self.fno,50,10);
            self.ctx.restore();
        },20);
    };
})();