var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var groundImage, ground, invisibleground;
var cloud, cloudImage;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacleGroup, cloudsGroup;

var gameOver, restart, reset

var jump, die,checkpoint

function preload() {
  trex_running = loadAnimation(
    "assets/trex1.png",
    "assets/trex3.png",
    "assets/trex4.png"
  );
  trex_collided = loadAnimation("assets/trex_collided.png");

  groundImage = loadImage("assets/ground2.png");

  cloudImage = loadImage("assets/cloud.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  obstacle5 = loadImage("assets/obstacle5.png");
  
  die = loadSound ('assets/die.mp3')
  jump = loadSound ('assets/jump.mp3')
  checkpoint = loadSound ('assets/checkpoint.mp3')

  gameOverImg =loadImage("assets/gameOver.png")
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-30,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
    gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  

  
  score = 0;







}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ score, 500,50);
  

  if (mousePressedOver(restart)) {
reset () ;
    
  }
  
  
  if(gameState === PLAY){
     gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -4;
    //pontuação
    score = score + Math.round(getFrameRate ()/60);
    
     if (score>0 && score%100 ===0) {
      checkpoint.play ()
     }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if((keyDown("space")||touches.length >0)&& trex.y >= 100) {
        trex.velocityY = -13;
        jump.play () ;
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        die.play ()
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;

    
      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0;
      trex.velocityY = 0

      //mudar a animação do trex
      trex.changeAnimation("collide", trex_collided);

      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles() {
 if (frameCount % 60 === 0){
   var obstacle = createSprite(900,height-50,10,40);
   obstacle.velocityX = -6;
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos              
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 } }
function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,100,40,10);
    cloud.y = Math.round(random(100,320));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

function reset (){ 
gameState = PLAY ;
gameOver.visible = false ;
obstaclesGroup.destroyEach () ;
score = 0 ;
cloudsGroup.destroyEach  () ;

}
