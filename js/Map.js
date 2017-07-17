//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
(function(){
    var Map = window.Map = function(){
        //地图数组
        this.code = [];
        // 被克隆的地图数组
        this.code2 = [];
        //控制可出现的方块，以及上一关、下一关
        this.imgarr = [
            game.R["black"],
            game.R["land"],
            game.R["block"],
            game.R["endblock"],
            [game.R["left"],game.R["right"],game.R["up"],game.R["down"]],
            game.R["wall"],
            game.R["end"]
        ];
        //关卡下标
        this.codeidx = 0;
        //锁
        this.flag = true;
        this.sum = 0;
        this.maxsum = 0;
        //获得地图总数
        this.xhr();
    };
    //获得地图总数
    Map.prototype.xhr = function(){
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                var data = JSON.parse(xhr.responseText);
                //排序
                data = data.sort(function(a,b){
                    if(a.length > 5){
                        var str1 = a.substr(0,2);
                    }else{
                        var str1 = a[0];
                    }
                    if(b.length > 5){
                        var str2 = b.substr(0,2);
                    }else{
                        var str2 = b[0];
                    }

                    return Number(str2) > Number(str1) ? -1 : 1;
                });
                self.maxsum = data.length;
                self.getAllMaps(data);
            }
        };
        xhr.open("get","./php/list.php");
        xhr.send();
    };
    //获得所有地图数据
    Map.prototype.getAllMaps = function(url){
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                self.sum++;
                var data = JSON.parse(xhr.responseText);
                self.code.push(data);
                //开锁，可开始渲染、更新
                if(self.sum == self.maxsum){
                    self.newCode();
                    self.flag = false;
                    return;
                }
                self.getAllMaps(url);
            }
        };
        xhr.open("get","./Maps/"+url[self.sum]);
        xhr.send();
    };
    //渲染
    Map.prototype.render = function(){
        if(this.flag) return;
        //固定好的比例，每一格为多少
        var base = game.w / 16;
        //将矩阵里的数组渲染出来
        for(var i = 0; i < 16; i++){
            for(var j = 0; j < 16; j++) {
                var idx = this.code2[i][j];
                //如果是人物，看人物自己的方向朝向（为了让人物初始就朝下)
                if(idx == 4){
                    game.ctx.drawImage(this.imgarr[idx][game.role.direction],j*base,i*base,base,base);
                }else{
                    game.ctx.drawImage(this.imgarr[idx],j*base,i*base,base,base);
                }
            };
        };
        /******************测试用*****************/
       document.getElementById("code").innerHTML = this.code2.join("<br />");
        /******************测试用*****************/
    };
    //判断胜利
    Map.prototype.win = function(){
        for(var i = 0; i < 16; i++){
            for(var j = 0; j < 16; j++){
                //如果内部还有终点，就跳出
                if(this.code2[i][j] == 6){
                    return;
                //如果原本为已推上的箱子或终点站着人，那也跳出
                }else if((this.code[this.codeidx][i][j] == 3 || this.code[this.codeidx][i][j] == 6) && this.code2[i][j] == 4){
                    return;
                }
            };
        };
        //播放胜利音乐
        game.Music["complete"].play();
        //如果以上都不满足，代表胜利，地图关卡加1
        this.codeidx++;
        //如果是最后一关
        if(this.codeidx >= this.code.length){
            this.codeidx = this.code.length - 1;
            alert("恭喜你已通关");
            this.flag = true;
            return;
        }
        //胜利，到下一关。
        alert("胜利");
        // 克隆一个新的数组
        this.newCode();
    };
    //克隆一个新的数组
    Map.prototype.newCode = function(){
        //克隆数组
        var arr = [];
        for(var i = 0; i < this.code[this.codeidx].length; i++){
            arr.push(this.code[this.codeidx][i]);
        };
        this.code2 = arr;
        //创建人物到新位置
        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                if(this.code2[i][j] == 4){
                    game.role = new Role(j,i);
                }
            };
        };
    };
})();