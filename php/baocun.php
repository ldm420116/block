<?php
    //读取POST请求传入的关卡编号
    $level = $_POST["level"];
    //读取POST请求传入的地图数组
    $arr = $_POST["arr"];
    $level = $level;
    //打开一个文件
    $myfile = fopen("../Maps/{$level}.txm", "w");
    //写入
    fwrite($myfile, stripslashes($arr));
    //关闭文件
    fclose($myfile);
?>