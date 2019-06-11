var gameBox = document.getElementById("gameBox");
var rows = document.getElementsByClassName("row");
var cols = document.getElementsByClassName("col");
var btn01 = document.getElementById("btn01");
var btn02 = document.getElementById("btn02");
var btn03 = document.getElementById("btn03");
var btn04 = document.getElementById("btn04");
var clearMineNum = 0; //清除的炸弹数
var markMineNum = 0; //标记的炸弹数

//初始化
var r = 4;
var c = 4;
var num = 3;
var map=[];
init(r, c, num);
function init(r, c, num){
    mineSweepingMap(r, c, num);
    // console.log(map);
    // console.log(gameBox);
    writeHtml(map); 
    clearMine(r, c, num); 
};

btn04.onclick = function(){
    reload(r, c, num);
};
btn01.onclick = function(){
    reload(4, 4, 3);
};
btn02.onclick = function(){
    reload(6, 6, 6);
};
btn03.onclick = function(){
    reload(8, 8, 10);
};

//1.生成雷地图
function mineSweepingMap(r, c, num){
    blankMap(r, c);
    writeInMine(num);
    writeInHint();

    //生成空白地图
    function blankMap(r, c){
        for(var i = 0; i < r; i++){
            map[i] = new Array();
            for(var j = 0; j < c; j++){
                map[i][j] = 0;
            }
        }
    }

    //随机写入地雷
    function writeInMine(num){
        function randomLocation(){
            var x = Math.floor(Math.random() * r);
            var y = Math.floor(Math.random() * r);
            if(map[x][y] !== 9){
                map[x][y] = 9;
            }
            else{
                randomLocation();
            }
        }
        for(var i = 0; i < num; i++){
            randomLocation();
        }
    }

    //给雷边上所有的数加1
     function writeInHint(){
        for(var x = 0; x < map.length; x++){
            for(var y = 0; y < map[0].length; y++){
                if(map[x][y] === 9){
                    for(var i = -1; i < 2; i++){
                        plus(map, x - 1, y + i);
                        plus(map, x + 1, y + i);
                    }
                    plus(map, x, y + 1);
                    plus(map, x, y - 1);
                }
            }
        }
    }
    function plus(map, x, y){
        if(x >=0 && x < r && y >= 0 && y < c){
            if(map[x][y] !== 9){
                map[x][y] += 1;
            }
        }
    }
}

//2.将雷写入页面
function writeHtml(map){
    for(var i = 0; i < map.length; i++){
        var ul = document.createElement("ul");
        ul.classList.add("row");
        ul.classList.add("x-"+i);
        gameBox.appendChild(ul);
    }
    
    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[0].length; j++){
            var point = map[i][j];
            if(point === 0){
                point = "";
            }
            var li = document.createElement("li");
            li.classList.add("col");
            li.classList.add("y-"+j);
            li.classList.add("num-" +point);
            li.innerHTML = "<span>"+point+"</span>";
            // console.log(li);
            rows[i].appendChild(li);
        }
    }
}

//3.扫雷过程
function clearMine(r, c, num){
    //makeWhite(0,0);
    function makeWhite(x, y){
        if(x < r && y < c && x >= 0 && y >= 0){
            var el = rows[x].children[y];
            console.log(el);
            if(el.style.background !== "white"){
                el.style.background = "white";
                el.children[0].style.opacity = "1";
                el.classList.add("expose");
                // clearMineNum++;
                // changeClearMineNum(clearMineNum);
                if(el.children[0].innerHTML === ""){
                    showNoMine(x, y);
                }
            }
        }
        
    }
    //显示空白周围的九宫格
    function showNoMine(x, y){
        makeWhite(x - 1, y + 1);
        makeWhite(x , y + 1);
        makeWhite(x + 1, y + 1);
        makeWhite(x, y - 1);
        makeWhite(x, y + 1);
        makeWhite(x + 1, y - 1);
        makeWhite(x + 1, y);
        makeWhite(x + 1, y + 1);
    }

    show();
    //给所有方块绑定点击事件
    function show(){
        for(let i = 0; i < rows.length; i++){
            for(let j = 0; j < rows[0].children.length; j++){
                //左键单击事件
                rows[i].children[j].onclick = function(event){
                    var el = event.target;
                    console.log(el);
                    if(el.nodeName == "SPAN"){
                        el = event.target.parentElement;
                    }
                    //console.log(el);

                    var flag = el.classList.contains("expose");
                    if(!flag && el.children[0].innerHTML !== "9"){
                        //alert("i=" + i + " j=" + j);
                        makeWhite(i, j);
                    }else if(!flag && el.children[0].innerHTML === "9"){
                        alert("失败了QAQ");
                        showAllBoom();
                    }
                };
                //右键单击事件
                rows[i].children[j].oncontextmenu = function(event){
                    // alert("i=" + i + " j=" + j);
                    var el = event.target;
                    console.log(el);
                    if(el.nodeName == "SPAN"){
                        el = event.target.parentElement;
                    }
                    var flag = el.classList.contains("mark");
                    if(el.style.background !== "white" && flag){
                        el.classList.remove("mark");
                        markMineNum--;
                        if(el.children[0].innerHTML === "9"){
                            clearMineNum--;
                        }
                    }else if(el.style.background !== "white" && !flag && markMineNum <= num && !el.classList.contains("boom")){
                        el.classList.add("mark");
                        markMineNum++;
                        if(el.children[0].innerHTML === "9"){
                            clearMineNum++;
                        }
                    }
                    judge();
                    return false;

                };
                
            }
        }
        
    }
    //显示所有炸弹
    function showAllBoom(){
        for(var i = 0; i < cols.length; i++){
            if(cols[i].children[0].innerHTML === "9"){
                cols[i].classList.add("boom");
            }
        }
    }
    //判断是否成功
    function judge(){
        if(num == clearMineNum){
            alert("成功了！！！");
            showAllBoom();
        }
    }

}

//重新渲染
function reload(r, c, num){
    var box = document.getElementById("gameBox");
    box.innerHTML = "";
    init(r, c, num);
}