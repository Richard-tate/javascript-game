const btn_start =document.querySelector('.startButton');
const myShip = document.querySelector('.myShip');
const container = document.querySelector('.container');
const fireme = document.querySelector('.fireme');
const scoreOutput = document.querySelector('.score');
const containerDim = container.getBoundingClientRect();
const message = document.querySelector('.message');
btn_start.addEventListener('click', startGame);
let player = {
    score : 0,
    speed: 8,
    gameOver: true,
    fire: false,
    alienSpeed: 5   
};

let keyValue = {};
document.addEventListener('keydown',function(e){
    let key = e.keyCode;
    if (key === 37){keyValue.left = true;}
    else if (key === 39){keyValue.right = true;}
    else if (key === 38|| key === 32){
       if(!player.fire){addShoot();}
    }

});

document.addEventListener('keyup',function(e){
    let key = e.keyCode;
    if (key === 37){keyValue.left = false;}
    else if (key === 39){keyValue.right = false;}
    console.log(keyValue);
});

function gameOver(){
    btn_start.style.display ='block';
    btn_start.innerHTML = "Restart New Game";
    player.fire = true;
    fireme.classList('hide');
  }
function clearAliens(){
    let tempAliens = document.querySelectorAll('.alien');
    for(let x = 0;x < tempAliens.length; x++) {
        tempAliens[x].parentNode.removeChild(tempAliens[x]);
    }
}  

function startGame (){
    if(player.gameOver){
        clearAliens();
        player.gameOver = false;
        btn_start.style.display = 'none';
        player.alienSpeed = 8;
        player.score = 0;
        player.fire = false;
        setupAliens (20);
        scoreOutput.textContent = player.score;
        messageOutput('Destroy the Aliens');
        player.animFrame = requestAnimationFrame(update);
    }
}
    function setupAliens(num){
        let tempWidth = 100;
        let lastCol = containerDim.width - tempWidth;
        let row = {
            x: containerDim.left,
            y: 50
        };
        for(let x =0;x<num;x++){
            if(row.x > (lastCol - tempWidth)){
                row.y += 70;
                row.x = containerDim.left;
            }
            alienMaker(row,tempWidth);
            row.x += tempWidth + 35;
        }
    }

    function randomColor() {
        return '#'+ Math.random().toString(16).substr(-6);
    }

    function alienMaker(row,tempWidth){
        if(row.y >(containerDim.height - 200)){
            return;
        }
        let div = document.createElement('div');
        div.classList.add('alien');
        div.style.backgroundColor = randomColor();
        let eye1 = document.createElement('span');
        eye1.classList.add('eye');
        eye1.style.left = '10px';
        div.appendChild(eye1);
        let eye2 = document.createElement('span');
        eye2.classList.add('eye');
        eye2.style.right = '10px';
        div.appendChild(eye2);
        let mouth = document.createElement('span');
        mouth.classList.add('mouth');
        mouth.style.top = '30px';
        div.appendChild(mouth);


        div.style.width = tempWidth + 'px';
        div.xpos = Math.floor(row.x);
        div.ypos = Math.floor(row.y);
        div.style.left = div.xpos + 'px';
        div.style.top = div.ypos + 'px';
        div.directionMove = 1;
        container.appendChild(div);
    }


    function addShoot(){
        player.fire = true;
        fireme.classList.remove('hide');
        fireme.xpos = (myShip.offsetLeft + (myShip.offsetWidth/2));
        fireme.ypos = myShip.offsetTop - 25; 
        fireme.style.left = fireme.xpos + -10 + 'px';
        fireme.style.top = fireme.ypos + 'px';
    }
function isCollide(a,b){
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return!(
        (aRect.right < bRect.left)||
        (aRect.left > bRect.right)||
        (aRect.bottom < bRect.top)||
        (aRect.top > bRect.bottom)
    );
        
}

function messageOutput(mes){
    message.innerHTML = mes;
}

function update(){
  if(!player.gameOver){
    let tempAliens = document.querySelectorAll ('.alien');
    if(tempAliens.length == 0){
        player.gameOver = true;
        messageOutput("You Have Saved the Earth");
        gameOver();
    }
    for(let x =tempAliens.length-1;x>-1;x--){
            let el = tempAliens[x];
             if(isCollide(el, fireme)){
                console.log('hit');
                player.alienSpeed ++;
                player.score ++;
                scoreOutput.textContent = player.score;
                player.fire = false;
                fireme.classList.add('hide');
                el.parentNode.removeChild(el);
                fireme.ypos = containerDim.height + 100;

        }
        if(el.xpos >(containerDim.width - el.offsetWidth)|| el.xpos
             < containerDim.left - el.offsetLeft - 100){
            el.directionMove *= -1;
            el.ypos += 40;
            if(el.ypos > (myShip.offsetTop-30)){
                player.gameOver = true;
                messageOutput('You Have Been Defeated!');
                gameOver();
                
            }
        }
        
        el.xpos += (player.alienSpeed * el.directionMove);
        el.style.left = el.xpos + 'px';
        el.style.top = el.ypos + 'px';
        

    }

    let tempPos = myShip.offsetLeft;

    if(player.fire){
     if(fireme.ypos >0){
        fireme.ypos -= 15;
        fireme.style.top = fireme.ypos + 'px';
        }else{
            player.fire = false;
            fireme.classList.add('hide');
            fireme.ypos =containerDim.height + 100;
        }
    }

    if(keyValue.left && tempPos > 0) { tempPos -= player.speed;}
    if(keyValue.right && (tempPos < (containerDim.width - myShip.offsetWidth))){ tempPos += player.speed;}
    myShip.style.left = tempPos + 'px';
    player.animFrame =requestAnimationFrame(update);
}}