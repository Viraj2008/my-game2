/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var kiwi,kiwiGroup
var basket,basketGroup
var obstaclesGroup, obstacle1;
var pcount=0;
var kcount=0;
var acount=0;
var bcount=0;
var score=0;
var flag=0

var gameOver, restart;

function preload(){
  boy_running =   loadAnimation("assets/boy1.png","assets/boy2.png","assets/boy3.png","assets/boy4.png","assets/boy5.png","assets/boy6.png");
  boy_collided = loadAnimation("assets/boy1.png");
  jungleImage = loadImage("assets/backgroung2.jpg");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver2.gif");
  restartImg = loadImage("assets/restart2.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  apple=loadImage("assets/appel.gif");
  basketImg=loadImage("assets/basket.png");
  kiwiImg=loadImage("assets/kiwi.png");
  pineapple=loadImage("assets/pineapple.gif");
}

function setup() {
  createCanvas(800, 400);
  
   




  jungle = createSprite(400,150,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=2;
  jungle.x = width /2;

  boy = createSprite(50,200,20,50);
  boy.addAnimation("running",boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.20;
  boy.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,180);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  shrubsGroup = new Group();
  kiwiGroup=new Group()
  obstaclesGroup = new Group();
  basketGroup=new Group()
  
applenum=createSprite(camera.position.x+600,90)
applenum.addImage(apple)
applenum.scale=0.09
pineapplenum=createSprite(camera.position.x+600,130)
pineapplenum.addImage(pineapple)
pineapplenum.scale=0.09
basketnum=createSprite(camera.position.x+600,170)
 basketnum.addImage(basketImg)
 basketnum.scale=0.09
 
kiwinum=createSprite(camera.position.x+600,220)
kiwinum.scale=0.2
kiwinum.addImage(kiwiImg)



  score = 0;

}

function draw() {
  background(255);
  
  boy.x=camera.position.x-270;
   
  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<300)
    {
       jungle.x=500
    }
  // console.log(boy.y)
    if(keyDown("space")&& boy.y>270) {
      jumpSound.play();
      boy.velocityY = -16;
    }
  
    boy.velocityY =boy.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    boy.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(boy)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(boy)){
      score = score + 2;
       
      shrubsGroup.destroyEach();
    }

              if(kiwiGroup.isTouching(boy)){
                score = score + 2
                kcount=kcount+1
                kiwiGroup.destroyEach();
              }
              if(basketGroup.isTouching(boy)){
                score = score + 10;
                bcount=bcount+1
                basketGroup.destroyEach();
              }
    
              if(flag===1){
                if (frameCount % 150 === 0) {
                kiwi=createSprite(camera.position.x+514,330,40,10);
                        kiwi.addImage(kiwiImg)
                        kiwi.velocityX = -(6 + 3*score/100)
                kiwi.scale = 0.2;
              kiwiGroup.add(kiwi)
              
              }
              }
              if(flag===2){
                if (frameCount % 150 === 0) {

                basket=createSprite(camera.position.x+510,330,40,10);
                        basket.addImage(basketImg)
                        basket.velocityX = -(6 + 3*score/100)
              basket.scale = 0.09;
              basketGroup.add(basket)
                }
          }
       
         
    
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    boy.velocityY = 0;
    jungle.velocityX = 0;
   kiwiGroup.setVelocityXEach(0);
    basketGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    jungle.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);

    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
  }
  
  
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x+200,50);


  text(" = "+ acount, camera.position.x+230,90);
  text(" = "+ bcount, camera.position.x+230,170);
  text(" = "+ kcount, camera.position.x+230,220);
  text(" = "+ pcount, camera.position.x+230,130);
  
  if(score >= 100){
    boy.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnShrubs() {
 
  if (frameCount % 150 === 0) {

    var shrub = createSprite(camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/100)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: shrub.addImage(apple);
              break;
      case 2: shrub.addImage(pineapple);
              break;
              case 3: flag=1;
              break;
              case 4: flag=2;
              break;

      default: break;
    }
       
    shrub.scale = 0.12;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.15;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}




function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  boy.changeAnimation("running",
               boy_running);
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  score = 0;
  acount=0
  bcount=0
  kcount=0
  pcount=0
}

