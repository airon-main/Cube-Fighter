//Game
let isStarted = false;
let TimePassed = 0;
let TimeLimit = 250;
//ArenaData
let Xarena = 10;
let Yarena = 6;
//Player
let PlayerHealth = 3;
let cubeDirection;
let topCube = 0;
let leftCube = 0;
let StringLeftCube;
let StringTopCube;
//Boss
let BossPhase = 0;
let isWeak = false;
let WeakX;
let WeakY;
let BossX = 0;
let BossY = 0; 
let BossHealth = 9;
let LaserPosX = 0;
let LaserPosY = 0;

//Random Int
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Start All Update
function Start(){
    setInterval(update1, 1000);
    setInterval(update5, 500);
    isStarted = true;
}

//Update .5s
function update5() {
    TimePassed += .5;
}

//Update logic 1s
function update1() {
    TimeLimit -= 1;
    document.getElementById("TimeLimit").innerHTML = `${TimeLimit}`
    if(TimeLimit <= 0 || PlayerHealth <= 0){
        LoseScreen();
    }
    if(BossHealth <= 0){
        WinScreen();
    }
}

function LoseScreen(){
    let Back = document.getElementById("finished");
    let BackText = document.getElementById("finishtext");
    Back.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    BackText.innerHTML = 'You Lose'
    BackText.style.color = 'rgba(255, 0, 0, 1)';
}
function WinScreen(){
    let Back = document.getElementById("finished");
    let BackText = document.getElementById("finishtext");
    Back.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    BackText.innerHTML = 'You Win'
    BackText.style.color = 'rgba(255, 0, 0, 1)';
}

//Classes
class Laser {
    constructor(Direction,Quantity,Seconds,NextFunc){
        
        const GameArena = document.getElementById("Game");

        //Laser
        if(Quantity > 0){
            
            //Horizontal Laser
            if(Direction == "Horizontal"){
                Quantity -= 1;
                this.element = document.createElement("div");
                this.element.className = "TargetHorizontalLaser"
                this.element.style.position = "Absolute";
                this.element.style.top = String(getRandomInt(0,5)*100) + "px";
                this.element.style.left = 0;
                GameArena.appendChild(this.element);
                
                //Custom Timeout
                setTimeout(() => {
                    new Laser("Horizontal",Quantity,Seconds,NextFunc);
                },(Seconds*1000))

                //What Happen in 1s
                setTimeout(() => {
                    this.element.className = "HorizontalLaser";
                    LaserPosY = this.element.style.top;
                    //Damager
                    if(StringTopCube+'px' == LaserPosY){
                        PlayerHealth -= 1;
                        document.getElementById("Player1").innerHTML = `${PlayerHealth}`
                    }
                    //What Happen in 1.5s
                    setTimeout(() => {
                        this.element.remove();
                        LaserPosY = '';
                    }, 500);
                }, 1000);
            
            //Vertical Laser
            }else if(Direction == "Vertical"){
                Quantity -= 1;
                this.element = document.createElement("div");
                this.element.className = "TargetVerticalLaser"
                this.element.style.position = "Absolute";
                this.element.style.top = 0;
                this.element.style.left = String(getRandomInt(0,9)*100) + "px";
                GameArena.appendChild(this.element);
                
                //Custom Timeout
                setTimeout(() => {
                    new Laser("Vertical",Quantity,Seconds,NextFunc);
                },(Seconds*1000))
                
                //What Happen in 1s
                setTimeout(() => {
                    this.element.className = "VerticalLaser";
                    LaserPosX = this.element.style.left;
                    //Damager
                    if(StringLeftCube+'px' == LaserPosX){
                        PlayerHealth -= 1;
                        document.getElementById("Player1").innerHTML = `${PlayerHealth}`
                    }
                    //What Happen in 1.5s
                    setTimeout(() => {
                        this.element.remove();
                        LaserPosX = '';
                    }, 500);
                }, 1000);
            }else if(Direction == "Both"){
                new Laser("Horizontal",Quantity,Seconds,NextFunc);
                new Laser("Vertical",Quantity,Seconds,NextFunc)
            }
        
        //Weak
        }else if(Quantity <= 0){
            isWeak = true;
            let Weak = document.getElementById("Weak");
            WeakX = getRandomInt(0,9)*100;
            WeakY = getRandomInt(0,5)*100;
            Weak.style = `background-color: aqua; left:${WeakX}px; top:${WeakY}px;`;
            setTimeout(() => {
                WeakX = BossX;
                WeakY = BossY;
                Weak.style = `background-color: black; left:${WeakX}px; top:${WeakY}px;`;
                NextFunc();
            },3000)
        }
    }
}


//Player
document.addEventListener("keydown", function(event) {

    //Start Method
    if(isStarted == false){
        Start();
        BossStartPhase();
        document.getElementById("finishtext").innerHTML = '';
        document.getElementById("finishtext").style.color = 'rgba(0,0,0,0)'
        document.getElementById("finished").style.backgroundColor = 'rgba(0,0,0,0)';
    }

    let Player = document.getElementById("Player1");
    //Player Movement
    Player.innerHTML = `${PlayerHealth}`
    if (event.code == "KeyW" || event.code == "ArrowUp") {
        if(topCube>0){
            topCube -= 100;
        }
    } else if (event.code == "KeyA" || event.code == "ArrowLeft") {
        if(leftCube>0){
            leftCube -= 100;
        }
    } else if (event.code == "KeyS" || event.code == "ArrowDown") {
        if(topCube<500){
            topCube += 100;
        }
    } else if (event.code == "KeyD" || event.code == "ArrowRight") {
        if(leftCube<900){
            leftCube += 100;
        }
    }
    StringLeftCube = String(leftCube);
    StringTopCube = String(topCube);
    document.getElementById("Player1").style = `left:${StringLeftCube}px; top:${StringTopCube}px;`;

    //Boss Hit
    if(isWeak == true){
        if(topCube == WeakY && leftCube == WeakX){
            isWeak = false;
            const Boss = document.getElementById("Boss");
            const Weak = document.getElementById("Weak");
            BossHealth -= 1;
            Boss.innerHTML = BossHealth;
            Weak.style = 'background-color: black;';
        }
    }
});

//Boss Logic
function BossStartPhase(){
    const Boss = document.getElementById("Boss");
    Boss.style.top = '-130px';
    Boss.innerHTML = "😈";
    setTimeout(() => {
        //run after 1s
        Boss.innerHTML = BossHealth;
        new Laser("Vertical",15,1,secondPhase);
    },1000)
}
function firstPhase(){
    new Laser("Vertical",15,1,secondPhase);
}
function secondPhase(){
    new Laser("Horizontal",15,1,thirdPhase);
}
function thirdPhase(){
    new Laser("Both",15,1,firstPhase);
}
function nothing(){}