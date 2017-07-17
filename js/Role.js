//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
//0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
(function(){
    var Role = window.Role = function(x,y){
        this.x = x;
        this.y = y;
        this.direction = 3;
    };
    //向左走函数，接收设置好的代号
    //0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
    Role.prototype.gotoLeft = function(idx){
        var str = game.map.code2[this.y].substr(0,this.x) + idx + game.map.code2[this.y].substr(this.x + 1);
        str = str.substr(0,this.x - 1) + "4" + str.substr(this.x);
        game.map.code2[this.y] = str;
        this.x = this.x - 1;
        this.direction = 0;
    };
    Role.prototype.gotoRight = function(idx){
        var str = game.map.code2[this.y].substr(0,this.x) + idx + game.map.code2[this.y].substr(this.x + 1);
        str = str.substr(0,this.x + 1) + "4" + str.substr(this.x + 2);
        game.map.code2[this.y] = str;
        this.x = this.x + 1;
        this.direction = 1;
    };
    Role.prototype.gotoUp = function(idx){
        var str = game.map.code2[this.y].substr(0,this.x) + idx + game.map.code2[this.y].substr(this.x + 1);
        game.map.code2[this.y] = str;
        str = game.map.code2[this.y - 1].substr(0,this.x) + "4" + game.map.code2[this.y - 1].substr(this.x + 1);
        game.map.code2[this.y - 1] = str;
        this.y = this.y - 1;
        this.direction = 2;
    };
    Role.prototype.gotoDown = function(idx){
        var str = game.map.code2[this.y].substr(0,this.x) + idx + game.map.code2[this.y].substr(this.x + 1);
        game.map.code2[this.y] = str;
        str = game.map.code2[this.y + 1].substr(0,this.x) + "4" + game.map.code2[this.y + 1].substr(this.x + 1);
        game.map.code2[this.y + 1] = str;
        this.y = this.y + 1;
        this.direction = 3;
    };
    //自己所踩得如果是终点或已推上的箱子，是则走出去时变为终点，否则变为草地
    Role.prototype.isEnd = function(callback){
        if(game.map.code[game.map.codeidx][this.y][this.x] == 6 || game.map.code[game.map.codeidx][this.y][this.x] == 3){
            callback.call(this,"6");
        }else{
            callback.call(this,"1");
        }
        //播放脚步声
        game.Music["pace"].play();
        //判断是否胜利
        game.map.win();
    };
    Role.prototype.move = function(direction){
        switch(direction){
            case "L":
                //前方如果 不是 墙壁或者到边界
                if(game.map.code2[this.y][this.x - 1] != 5 && this.x != 0){
                    //前方如果是箱子
                    if(game.map.code2[this.y][this.x - 1] == 2 || game.map.code2[this.y][this.x - 1] == 3){
                        //执行判断函数，箱子是否能动
                        if(this.blockMove(direction)){
                            this.isEnd(this.gotoLeft);
                        }
                    }else{
                        this.isEnd(this.gotoLeft);
                    }
                }
                break;
            case "R":
                //前方如果 不是 墙壁或者到边界
                if(game.map.code2[this.y][this.x + 1] != 5 && this.x != 15){
                    //前方如果是箱子
                    if(game.map.code2[this.y][this.x + 1] == 2 || game.map.code2[this.y][this.x + 1] == 3){
                        //执行判断函数，箱子是否能动
                        if(this.blockMove(direction)){
                            this.isEnd(this.gotoRight);
                        }
                    }else{
                        this.isEnd(this.gotoRight);
                    }

                }
                break;
            case "U":
                //前方如果 不是 墙壁或者到边界
                if(game.map.code2[this.y - 1][this.x] != 5 && this.y != 0){
                    //前方如果是箱子
                    if(game.map.code2[this.y - 1][this.x] == 2 || game.map.code2[this.y - 1][this.x] == 3){
                        //执行判断函数，箱子是否能动
                        if(this.blockMove(direction)){
                            this.isEnd(this.gotoUp);
                        }
                    }else{
                        this.isEnd(this.gotoUp);
                    }
                }
                break;
            case "D":
                //前方如果 不是 墙壁或者到边界
                if(game.map.code2[this.y + 1][this.x] != 5 && this.y != 15){
                    //前方如果是箱子
                    if(game.map.code2[this.y + 1][this.x] == 2 || game.map.code2[this.y + 1][this.x] == 3){
                        //执行判断函数，箱子是否能动
                        if(this.blockMove(direction)){
                            this.isEnd(this.gotoDown);
                        }
                    }else{
                        this.isEnd(this.gotoDown);
                    }
                }
                break;
        }
    };
    //判断是否能推箱子
    //0——黑色，1——草地，2——普通箱子，3——已推上的箱子，4——人物，5——墙壁，6——终点
    Role.prototype.blockMove = function(direction){
        switch(direction){
            case "L":
                //箱子前不能为0、2、3、5
                if(game.map.code2[this.y][this.x - 2] != 0 &&
                 game.map.code2[this.y][this.x - 2] != 2 &&
                 game.map.code2[this.y][this.x - 2] != 3 &&
                 game.map.code2[this.y][this.x - 2] != 5){
                    //如果箱子前为终点，改变为已推上的箱子
                    if(game.map.code2[this.y][this.x - 2] == 6){
                        var str = game.map.code2[this.y].substr(0,this.x - 2) + "3" + game.map.code2[this.y].substr(this.x - 1);
                    }else{
                        var str = game.map.code2[this.y].substr(0,this.x - 2) + "2" + game.map.code2[this.y].substr(this.x - 1);
                    }
                    game.map.code2[this.y] = str;
                    //播放推箱子声音
                    game.Music["shove"].load();
                    game.Music["shove"].play();
                    return true;
                }else{
                    return false;
                }
                break;
            case "R":
                //箱子前不能为0、2、3、5
                if(game.map.code2[this.y][this.x + 2] != 0 &&
                 game.map.code2[this.y][this.x + 2] != 2 &&
                 game.map.code2[this.y][this.x + 2] != 3 &&
                 game.map.code2[this.y][this.x + 2] != 5){
                    //如果箱子前为终点，改变为已推上的箱子
                    if(game.map.code2[this.y][this.x + 2] == 6){
                        var str = game.map.code2[this.y].substr(0,this.x + 2) + "3" + game.map.code2[this.y].substr(this.x + 3);
                    }else{
                        var str = game.map.code2[this.y].substr(0,this.x + 2) + "2" + game.map.code2[this.y].substr(this.x + 3);
                    }
                    game.map.code2[this.y] = str;
                    //播放推箱子声音
                    game.Music["shove"].load();
                    game.Music["shove"].play();
                    return true;
                }else{
                    return false;
                }
                break;
            case "U":
                //箱子前不能为0、2、3、5
                if(game.map.code2[this.y - 2][this.x] != 0 &&
                 game.map.code2[this.y - 2][this.x] != 2 &&
                 game.map.code2[this.y - 2][this.x] != 3 &&
                 game.map.code2[this.y - 2][this.x] != 5){
                    //如果箱子前为终点，改变为已推上的箱子
                    if(game.map.code2[this.y - 2][this.x] == 6){
                        var str = game.map.code2[this.y - 2].substr(0,this.x) + "3" + game.map.code2[this.y - 2].substr(this.x + 1);
                    }else{
                        var str = game.map.code2[this.y - 2].substr(0,this.x) + "2" + game.map.code2[this.y - 2].substr(this.x + 1);
                    }
                    game.map.code2[this.y - 2] = str;
                    //播放推箱子声音
                    game.Music["shove"].load();
                    game.Music["shove"].play();
                    return true;
                }else{
                    return false;
                }
                break;
            case "D":
                //箱子前不能为0、2、3、5
                if(game.map.code2[this.y + 2][this.x] != 0 &&
                 game.map.code2[this.y + 2][this.x] != 2 &&
                 game.map.code2[this.y + 2][this.x] != 3 &&
                 game.map.code2[this.y + 2][this.x] != 5){
                    //如果箱子前为终点，改变为已推上的箱子
                    if(game.map.code2[this.y + 2][this.x] == 6){
                        var str = game.map.code2[this.y + 2].substr(0,this.x) + "3" + game.map.code2[this.y + 2].substr(this.x + 1);
                    }else{
                        var str = game.map.code2[this.y + 2].substr(0,this.x) + "2" + game.map.code2[this.y + 2].substr(this.x + 1);
                    }
                    game.map.code2[this.y + 2] = str;
                    //播放推箱子声音
                    game.Music["shove"].load();
                    game.Music["shove"].play();
                    return true;
                }else{
                    return false;
                }
                break;
        }
    };
})();