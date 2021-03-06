var game = new Phaser.Game(800, 470, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload(){
    game.load.tilemap('landscape', 'assets/landscape_level1.json', null, Phaser.Tilemap.TILED_JSON); //json datei
	game.load.tilemap('landscape2', 'assets/landscape_level2.json', null, Phaser.Tilemap.TILED_JSON); //json datei
	game.load.tilemap('landscape3', 'assets/landscape_level3.json', null, Phaser.Tilemap.TILED_JSON); //json datei
    game.load.image('tiles', 'assets/tileset_1.png');
    game.load.image('tiles_wolken', 'assets/tileset_2.png');
    game.load.image('tiles_himmel', 'assets/tileset_3.png');
	game.load.spritesheet('gorilla', 'assets/gorillax.png', 45, 42);
    game.load.spritesheet('snake', 'assets/schlange-01.png', 50, 43);
	game.load.spritesheet('player', 'assets/alien_new.png', 24, 55);
	game.load.spritesheet('tiger', 'assets/tiger.png', 90, 43);
    
	game.load.image('benzinkanister', 'assets/benzin.png');
	game.load.spritesheet('pauseButton', 'assets/button.png', 104, 55);
	game.load.spritesheet("fish", "assets/fish.png", 25, 20);
	game.load.image('ufo', 'assets/ufo.png');
	
	game.load.image("3leben", "assets/3leben.png");
	game.load.image("2leben", "assets/2leben.png");
	game.load.image("1leben", "assets/1leben.png");
	game.load.image("0leben", "assets/0leben.png");
	
	game.load.image('sprechblase1', 'assets/1.png');
	game.load.image('sprechblase2', 'assets/2.png');

	
	game.load.spritesheet('rain', 'assets/rain.png', 17, 17);
}
var zahl = 5; // time to live
var map;
var map2;
var map3;
var button;
var pauseButton;
var tileset;
var layer;
var p;
var tiger;
var snake;
var gorilla;
var gorilla2;

var cursors;
var spaceKey;
var nachlinks = true;
var abgestuertzt;
var sprechblase;
var test;
var up = true;
var benzin;
var score = 0;
var scoreText;
var level = 1;
var inNextLevel= false;
var inNextLevel2= false;
var leben = 3;
var lebenanzeige;
var gameEnd = false;

var sprechblase1;
var sprechblase2;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); // arcade physics angewendet
    this.game.physics.arcade.TILE_BIAS = 27;

    game.stage.backgroundColor = '#1e6dc5';
	
	map3 = game.add.tilemap('landscape3'); // erster name (parameter) der json datei, der oben bei preload verwendet wird
    map3.addTilesetImage('tileset_1', 'tiles'); // name des tilesets, welche im programm tiled verwendet werden.
    map3.addTilesetImage('tileset_2', 'tiles_wolken');
    map3.addTilesetImage('tileset_3', 'tiles_himmel');
	
	map2 = game.add.tilemap('landscape2'); // erster name (parameter) der json datei, der oben bei preload verwendet wird
    map2.addTilesetImage('tileset_1', 'tiles'); // name des tilesets, welche im programm tiled verwendet werden.
    map2.addTilesetImage('tileset_2', 'tiles_wolken');
    map2.addTilesetImage('tileset_3', 'tiles_himmel');
	
    map = game.add.tilemap('landscape'); // erster name (parameter) der json datei, der oben bei preload verwendet wird
    map.addTilesetImage('tileset_1', 'tiles'); // name des tilesets, welche im programm tiled verwendet werden.
    map.addTilesetImage('tileset_2', 'tiles_wolken');
    map.addTilesetImage('tileset_3', 'tiles_himmel');
    //map.addTilesetImage('background', 'background');
	
	
	/*Rain*/
    var emitter = game.add.emitter(game.world.centerX, 0, 400);
    game.physics.enable(emitter);
    emitter.width = game.world.width;
	emitter.makeParticles('rain');
	emitter.minParticleScale = 0.1;
	emitter.maxParticleScale = 0.5;
	emitter.setYSpeed(300, 500);
	emitter.setXSpeed(-5, 5);
	emitter.minRotation = 0;
	emitter.maxRotation = 0;
	emitter.start(false, 1600, 5, 0);
	emitter.fixedToCamera = true;
	
	
   	/*level 1*/
   	layer3 = map.createLayer('collision'); // name des layers im programm tiled
   	layer3.resizeWorld();
   	layer5 = map.createLayer('wolken');
   	layer5.resizeWorld();
   	layer5.wrap = true; // wiederholt den layer
   	layer5.scrollFactorX = 0.5; // parallax
   	layer4 = map.createLayer('ttlwater');
   	layer9 = map.createLayer('water');
	layer8 = map.createLayer('plants'); // unter player erst kreiert, denn so ist das gras vor dem player
   	layer2 = map.createLayer('raw');
   	layer2.resizeWorld();
   	layer = map.createLayer('sky');
   	layer.resizeWorld();
   	layer.autoCull; // wird wird ausgeblendet an den stellen, wo es nicht sichtbar ist
	
	/*level 2*/
	layer6 = map2.createLayer('collision2');
   	layer6.resizeWorld();
	layer6.visible = false;
	layer10 = map2.createLayer('ttl_water2');
   	layer10.resizeWorld();
	layer10.visible = false;
    layer17 = map2.createLayer('water2');
    layer17.visible = false;
	layer11 = map2.createLayer('gras2');
	layer11.visible = false;
   	layer11.resizeWorld();
	layer7 = map2.createLayer('raw2');
	layer7.visible = false;
   	layer7.resizeWorld();
	
	
	/*level 3*/
	layer12 = map3.createLayer('collision3');
   	layer12.resizeWorld();
	layer12.visible = false;
	layer13 = map3.createLayer('ttl_water3');
   	layer13.resizeWorld();
	layer13.visible = false;
	layer16 = map3.createLayer('water3');
	layer16.visible = false;
   	layer16.resizeWorld();
	layer14 = map3.createLayer('gras3');
	layer14.visible = false;
   	layer14.resizeWorld();
	layer15 = map3.createLayer('raw3');
	layer15.visible = false;
   	layer15.resizeWorld();
	

    map.setCollision(37); // wert aus collision layer

	/*collision für unter wasser*/
	map.setCollision(38, true, layer4);
	map.setTileIndexCallback(38, stirbImWasser, game, layer4);
	
	sprechblase1 = game.add.sprite(100, 50, "sprechblase1");
	sprechblase1.fixedToCamera = true;
	sprechblase2 = game.add.sprite(100, 2000, "sprechblase2");
	sprechblase2.visible = false;
	
	//der spieler soll sich erst nach 3 sekunden bewegen können
	abgestuertzt = false;
	game.time.events.add(5000, function() {
		abgestuertzt = true;
		sprechblase1.visible = false;
		sprechblase2.visible = true;
	}, this);

	/*button*/
	this.pauseButton = this.game.add.sprite(680, 10, 'pauseButton');
	this.pauseButton.inputEnabled = true;
	this.pauseButton.events.onInputUp.add(function () {this.game.paused = true;},this);
	this.game.input.onDown.add(function () {if(this.game.paused)this.game.paused = false;},this);
	this.pauseButton.fixedToCamera = true;
	
	lebenanzeige = this.game.add.sprite(10, 50, '3leben');
	lebenanzeige.fixedToCamera = true;

	//Spieler
    p = game.add.sprite(93, 100, 'player');
    p.animations.add('left', [0, 1, 2, 3], 10, true);
    p.animations.add('right', [5, 6, 7, 8], 10, true);
	game.physics.enable(p);
	game.camera.follow(p); // kamera folgt den player
    p.body.bounce.y = 0,8;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;
	
	//schlange
    snake = game.add.sprite(500, 1380, 'snake'); // position und parameter von preload
    snake.animations.add('left', [0, 1, 2, ], 5, true);
    snake.animations.add('right', [5, 6,  ], 5, true);
	game.physics.enable(snake); // bekommt physics
    
    snake3_1 = game.add.sprite(1650, 1380, 'snake'); // position und parameter von preload
    snake3_1.animations.add('left', [0, 1, 2, ], 5, true);
    snake3_1.animations.add('right', [5, 6,  ], 5, true);
	game.physics.enable(snake3_1); // bekommt physics

	//Gorilla
   	gorilla = game.add.sprite(500, 1750, 'gorilla'); // position und parameter von preload
    gorilla.animations.add('left', [0, 1, 2, 3], 5, true);
    gorilla.animations.add('right', [5, 6, 7, 8], 5, true);
	game.physics.enable(gorilla); // bekommt physics

    gorilla2 = game.add.sprite(4800, 2000, 'gorilla'); // position und parameter von preload
    gorilla2.animations.add('left', [0, 1, 2, 3], 5, true);
    gorilla2.animations.add('right', [5, 6, 7, 8], 5, true);
	game.physics.enable(gorilla2); // bekommt physics
    
	//Tiger
	tiger = game.add.sprite(2200, 2000, "tiger");
	tiger.animations.add('right', [3, 4, 5], 5, true);
    tiger.animations.add('left', [0, 1, 2], 5, true);
	game.physics.enable(tiger);

	tiger1 = game.add.sprite(5000, 2000, "tiger");
	tiger1.animations.add('right', [3, 4, 5], 5, true);
    tiger1.animations.add('left', [0, 1, 2], 5, true);
    game.physics.enable(tiger1);
    
    tiger3_1 = game.add.sprite(500, 1780, "tiger");
	tiger3_1.animations.add('right', [3, 4, 5], 5, true);
    tiger3_1.animations.add('left', [0, 1, 2], 5, true);
    game.physics.enable(tiger3_1);
    
    tiger3_2 = game.add.sprite(900, 1350, "tiger");
	tiger3_2.animations.add('right', [3, 4, 5], 5, true);
    tiger3_2.animations.add('left', [0, 1, 2], 5, true);
    game.physics.enable(tiger3_2);
    

	//Fisch
	fish = game.add.sprite(1300, 2000, "fish");
	fish.animations.add("up", [0, 1], 4, true);
	fish.animations.add("down", [2, 3], 4, true);

	fish1 = game.add.sprite(1250, 2000, "fish");
	fish1.animations.add("up", [0, 1], 4, true);
	fish1.animations.add("down", [2, 3], 4, true);
    
    fish2 = game.add.sprite(4700, 2000, "fish");
	fish2.animations.add("up", [0, 1], 4, true);
	fish2.animations.add("down", [2, 3], 4, true);
    
    fish4 = game.add.sprite(6100, 2000, "fish");
	fish4.animations.add("up", [0, 1], 4, true);
	fish4.animations.add("down", [2, 3], 4, true);

    fish5 = game.add.sprite(6050, 2000, "fish");
	fish5.animations.add("up", [0, 1], 4, true);
	fish5.animations.add("down", [2, 3], 4, true);
    
    fish2_1 = game.add.sprite(900, 2000, "fish");
	fish2_1.animations.add("up", [0, 1], 4, true);
	fish2_1.animations.add("down", [2, 3], 4, true);
    
    fish2_2 = game.add.sprite(950, 2000, "fish");
	fish2_2.animations.add("up", [0, 1], 4, true);
	fish2_2.animations.add("down", [2, 3], 4, true);
    
    fish2_3 = game.add.sprite(1180, 2000, "fish");
	fish2_3.animations.add("up", [0, 1], 4, true);
	fish2_3.animations.add("down", [2, 3], 4, true);
    
    fish2_4 = game.add.sprite(1200, 2000, "fish");
	fish2_4.animations.add("up", [0, 1], 4, true);
	fish2_4.animations.add("down", [2, 3], 4, true);
    
    fish2_5 = game.add.sprite(1365, 2000, "fish");
	fish2_5.animations.add("up", [0, 1], 4, true);
	fish2_5.animations.add("down", [2, 3], 4, true);
    
    fish2_6 = game.add.sprite(1820, 2000, "fish");
	fish2_6.animations.add("up", [0, 1], 4, true);
	fish2_6.animations.add("down", [2, 3], 4, true);
    
    fish2_7 = game.add.sprite(2000, 2000, "fish");
	fish2_7.animations.add("up", [0, 1], 4, true);
	fish2_7.animations.add("down", [2, 3], 4, true);
    
    fish2_8 = game.add.sprite(2750, 2000, "fish");
	fish2_8.animations.add("up", [0, 1], 4, true);
	fish2_8.animations.add("down", [2, 3], 4, true);
    
    fish2_9 = game.add.sprite(2850, 2000, "fish");
	fish2_9.animations.add("up", [0, 1], 4, true);
	fish2_9.animations.add("down", [2, 3], 4, true);
    
    fish2_10 = game.add.sprite(3280, 2000, "fish");
	fish2_10.animations.add("up", [0, 1], 4, true);
	fish2_10.animations.add("down", [2, 3], 4, true);
    
    fish2_11 = game.add.sprite(5460, 2000, "fish");
	fish2_11.animations.add("up", [0, 1], 4, true);
	fish2_11.animations.add("down", [2, 3], 4, true);

    fish2_13 = game.add.sprite(5590, 2000, "fish");
	fish2_13.animations.add("up", [0, 1], 4, true);
	fish2_13.animations.add("down", [2, 3], 4, true);
    
    fish3_1 = game.add.sprite(500, 2000, "fish");
	fish3_1.animations.add("up", [0, 1], 4, true);
	fish3_1.animations.add("down", [2, 3], 4, true);
    
    fish3_2 = game.add.sprite(700, 2000, "fish");
	fish3_2.animations.add("up", [0, 1], 4, true);
	fish3_2.animations.add("down", [2, 3], 4, true);
    
    fish3_3 = game.add.sprite(1000, 2000, "fish");
	fish3_3.animations.add("up", [0, 1], 4, true);
	fish3_3.animations.add("down", [2, 3], 4, true);
    
    fish3_4 = game.add.sprite(1870, 2000, "fish");
	fish3_4.animations.add("up", [0, 1], 4, true);
	fish3_4.animations.add("down", [2, 3], 4, true);
    
    fish3_5 = game.add.sprite(1970, 2000, "fish");
	fish3_5.animations.add("up", [0, 1], 4, true);
	fish3_5.animations.add("down", [2, 3], 4, true);
    
    fish3_6 = game.add.sprite(5060, 2000, "fish");
	fish3_6.animations.add("up", [0, 1], 4, true);
	fish3_6.animations.add("down", [2, 3], 4, true);
    

    
	game.physics.enable(fish);
	game.physics.enable(fish1);
    game.physics.enable(fish2);
    game.physics.enable(fish4);
    game.physics.enable(fish5);
    game.physics.enable(fish2_1);
    game.physics.enable(fish2_2); 
    game.physics.enable(fish2_3);
    game.physics.enable(fish2_4); 
    game.physics.enable(fish2_5); 
    game.physics.enable(fish2_6); 
    game.physics.enable(fish2_7); 
    game.physics.enable(fish2_8); 
    game.physics.enable(fish2_9); 
    game.physics.enable(fish2_10); 
    game.physics.enable(fish2_11);
    game.physics.enable(fish2_13); 
    game.physics.enable(fish3_1);
    game.physics.enable(fish3_2);
    game.physics.enable(fish3_3);
    game.physics.enable(fish3_4);
    game.physics.enable(fish3_5);
    game.physics.enable(fish3_6);

	
    fish.body.bounce.y = 0,8;
    fish.body.linearDamping = 1;
    fish.body.collideWorldBounds = true;
    
    fish1.body.bounce.y = 0,8;
    fish1.body.linearDamping = 1;
    fish1.body.collideWorldBounds = true;
    
    fish2.body.bounce.y = 0,8;
    fish2.body.linearDamping = 1;
    fish2.body.collideWorldBounds = true;
    
    fish4.body.bounce.y = 0,8;
    fish4.body.linearDamping = 1;
    fish4.body.collideWorldBounds = true;
    
    fish5.body.bounce.y = 0,8;
    fish5.body.linearDamping = 1;
    fish5.body.collideWorldBounds = true;
    
    
    //UFO
	ufo = game.add.sprite(0, 100, "ufo");
	game.physics.enable(ufo);
	ufo.body.bounce.y = 0,8;
    ufo.body.linearDamping = 1;
    ufo.body.collideWorldBounds = true;
	
	

    //Benzin
    benzin = game.add.group();
    benzin.enableBody = true;
	benzin.create(890, 800, 'benzinkanister');
	benzin.create(500, 800, 'benzinkanister');
    benzin.create(1890, 1000, 'benzinkanister');
    benzin.create(2200, 2000, 'benzinkanister');
    benzin.create(2700, 2000, 'benzinkanister');
    benzin.create(2730, 800, 'benzinkanister');
    benzin.create(5850, 800, 'benzinkanister');


	//Liter
	scoreText = game.add.text(10, 16, '0 Liter | Level' + level, {fontSize: '32px', fill: '#fff' });
	scoreText.fixedToCamera = true;
	
	

    game.physics.arcade.gravity.y = 250;
	cursors = game.input.keyboard.createCursorKeys(); // interaktion durch tasten
}

function update() {

	/*methoden die bei bestimmten kollisionen stattfinden*/
    game.physics.arcade.collide(p, layer3); // collision mit player und grundboden -> level 1
	game.physics.arcade.collide(p, layer4, stirbImWasser, null, this)
    game.physics.arcade.collide(p, layer6); // collision mit player und grundboden -> level 2
	game.physics.arcade.collide(p, layer10, stirbImWasser, null, this)
	game.physics.arcade.collide(p, layer12); // collision mit player und grundboden -> level 3
	game.physics.arcade.collide(p, layer13, stirbImWasser, null, this);
	
	/* level 1 collisions */
	game.physics.arcade.collide(benzin, layer3);
	game.physics.arcade.collide(gorilla, layer3);
    //game.physics.arcade.collide(snake, layer3);
   // game.physics.arcade.collide(p, snake, layer4, stirb,null, this);
	game.physics.arcade.collide(ufo, layer3);
	game.physics.arcade.collide(ufo, layer12);
	game.physics.arcade.collide(tiger, layer3);
	game.physics.arcade.collide(tiger1, layer3);
    game.physics.arcade.collide(p, fish, layer3, stirb, null, this)
    game.physics.arcade.collide(p, fish1, layer3, stirb, null, this)
    game.physics.arcade.collide(p, fish2, layer3, stirb, null, this)
    game.physics.arcade.collide(p, fish4, layer3, stirb, null, this)
    game.physics.arcade.collide(p, fish5, layer3, stirb, null, this)
 
	
	/* level 2 collisions */
	game.physics.arcade.collide(benzin, layer6);
	game.physics.arcade.collide(gorilla2, layer6);
    game.physics.arcade.collide(snake, layer6);
   
    game.physics.arcade.collide(p, fish2_1, stirb, null, this);
    game.physics.arcade.collide(p, fish2_2, stirb, null, this);
    game.physics.arcade.collide(p, fish2_3, stirb, null, this);
    game.physics.arcade.collide(p, fish2_4, stirb, null, this);
    game.physics.arcade.collide(p, fish2_5, stirb, null, this);
    game.physics.arcade.collide(p, fish2_6, stirb, null, this);
    game.physics.arcade.collide(p, fish2_7, stirb, null, this);
    game.physics.arcade.collide(p, fish2_8, stirb, null, this);
    game.physics.arcade.collide(p, fish2_9, stirb, null, this);
    game.physics.arcade.collide(p, fish2_10, stirb, null, this);
    game.physics.arcade.collide(p, fish2_11, stirb, null, this);
    game.physics.arcade.collide(p, fish2_13, stirb, null, this);
	game.physics.arcade.collide(ufo, layer6);
	game.physics.arcade.collide(tiger, layer6);
	game.physics.arcade.collide(tiger1, layer6);
    
	/* level 3 collisions */
	game.physics.arcade.collide(benzin, layer12);
	game.physics.arcade.collide(gorilla, layer12);
	game.physics.arcade.collide(ufo, layer12);
    game.physics.arcade.collide(tiger, layer12);
	game.physics.arcade.collide(tiger3_1, layer12);
    game.physics.arcade.collide(tiger3_2, layer12);
	game.physics.arcade.collide(snake, layer12);
    game.physics.arcade.collide(snake3_1, layer12);
    
		 
	game.physics.arcade.overlap(p, gorilla, stirb, null, this);
    game.physics.arcade.overlap(p, gorilla2, stirb, null, this);
    
	game.physics.arcade.overlap(p, tiger, stirb, null, this);
	game.physics.arcade.overlap(p, tiger3_1, stirb, null, this);
    game.physics.arcade.overlap(p, tiger3_2, stirb, null, this);
    
    game.physics.arcade.overlap(p, snake, stirb, null, this);
    game.physics.arcade.overlap(p, snake3_1, stirb, null, this);
    
    game.physics.arcade.collide(p, fish3_1, stirb, null, this);
    game.physics.arcade.collide(p, fish3_2, stirb, null, this);
    game.physics.arcade.collide(p, fish3_3, stirb, null, this);
    game.physics.arcade.collide(p, fish3_4, stirb, null, this);
    game.physics.arcade.collide(p, fish3_5, stirb, null, this);
    game.physics.arcade.collide(p, fish3_6, stirb, null, this);

	game.physics.arcade.overlap(p, benzin, sammelBenzin, null, this);
	
	
    p.body.velocity.x = 0; // bewegung ohne was zu machen	
	ufo.body.velocity.x = 0;
    
	
	//Sprechblasen
	if (p.body.onFloor()){
    	
    }

    if(level === 1 && p.x > 6375){
		
    	level = 2;
		p.body.x = 0;
		p.body.y = 2169;
		
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer8.destroy();
		layer9.destroy();
		fish.kill();
		fish1.kill();
		fish2.kill();
		fish4.kill();
		fish5.kill();
        gorilla.kill();
        
        
        
		
		layer10.visible = false;
		layer11.visible = true;
		layer6.visible = false;
		layer7.visible = true;
		layer17.visible = true;
		map2.setCollision(38, true, layer10);
		map2.setTileIndexCallback(38, stirbImWasser, game, layer10);
	
		ufo.visible = false;
		sprechblase2.visible = false;
		
		map2.setCollision(37);
		
		scoreText.text = score+' Liter | Level' + level;
		
		game.time.events.add(2000, function() {
    		inNextLevel = true;
		}, this);
        
        
        benzin.create(1230, 2000, 'benzinkanister');
        benzin.create(3100, 2217, 'benzinkanister');
        benzin.create(4155, 1990, 'benzinkanister');
        benzin.create(4630, 2320, 'benzinkanister');
        benzin.create(4624, 2265, 'benzinkanister');
       	benzin.create(6027, 2009, 'benzinkanister');
        
		fish2_1.body.bounce.y = 200;
		fish2_1.body.linearDamping = 100;
		fish2_1.body.collideWorldBounds = true;
		
		fish2_2.body.bounce.y = 0,8;
		fish2_2.body.linearDamping = 1;
		fish2_2.body.collideWorldBounds = true;
	   
		fish2_3.body.bounce.y = 0,8;
		fish2_3.body.linearDamping = 1;
		fish2_3.body.collideWorldBounds = true;
		
		fish2_4.body.bounce.y = 0,8;
		fish2_4.body.linearDamping = 1;
		fish2_4.body.collideWorldBounds = true;
			
		fish2_5.body.bounce.y = 0,8;
		fish2_5.body.linearDamping = 1;
		fish2_5.body.collideWorldBounds = true; 
	   
		fish2_6.body.bounce.y = 0,8;
		fish2_6.body.linearDamping = 1;
		fish2_6.body.collideWorldBounds = true;
			
		fish2_7.body.bounce.y = 0,8;
		fish2_7.body.linearDamping = 1;
		fish2_7.body.collideWorldBounds = true;
			
		fish2_8.body.bounce.y = 0,8;
		fish2_8.body.linearDamping = 1;
		fish2_8.body.collideWorldBounds = true;
			
		fish2_9.body.bounce.y = 0,8;
		fish2_9.body.linearDamping = 1;
		fish2_9.body.collideWorldBounds = true;    
		
		fish2_10.body.bounce.y = 0,8;
		fish2_10.body.linearDamping = 1;
		fish2_10.body.collideWorldBounds = true;    
	   
		fish2_11.body.bounce.y = 0,8;
		fish2_11.body.linearDamping = 1;
		fish2_11.body.collideWorldBounds = true;
			
		fish2_13.body.bounce.y = 0,8;
		fish2_13.body.linearDamping = 1;
		fish2_13.body.collideWorldBounds = true;    
    }

 

    
	if(level === 2 && p.x > 6375 && inNextLevel){
        
		p.body.x = 0;
		p.body.y = 2153;
		
		sprechblase2.visible = false;
		
		layer10.destroy();
		layer17.destroy();
		layer11.destroy();
		layer6.destroy();
		layer7.destroy();
        layer4.destroy();
        layer9.destroy();
        
        
        layer12.visible = false;
		layer13.visible = true;
		layer14.visible = true;
		layer15.visible = true;
		layer16.visible = true;

        
        
        fish2.kill();
        fish2_1.kill();
        fish2_2.kill();
        fish2_3.kill();
        fish2_4.kill();
        fish2_5.kill();
        fish2_6.kill();
        fish2_7.kill();
        fish2_8.kill();
        fish2_9.kill();
        fish2_10.kill();
		fish2_11.kill();
        fish2_13.kill();
    
        
		
		map3.setCollision(38, true, layer13);
		map3.setTileIndexCallback(38, stirbImWasser, game, layer13);
	
		map3.setCollision(37);
		level = 3;
		scoreText.text = score+' Liter | Level' + level;

		fish3_1.body.bounce.y = 0,8;
        fish3_1.body.linearDamping = 1;
        fish3_1.body.collideWorldBounds = true;
            
        fish3_2.body.bounce.y = 0,8;
        fish3_2.body.linearDamping = 1;
        fish3_2.body.collideWorldBounds = true;   
            
        fish3_3.body.bounce.y = 0,8;
        fish3_3.body.linearDamping = 1;
        fish3_3.body.collideWorldBounds = true;   
        
        fish3_4.body.bounce.y = 0,8;
        fish3_4.body.linearDamping = 1;
        fish3_4.body.collideWorldBounds = true;   
        
        fish3_5.body.bounce.y = 0,8;
        fish3_5.body.linearDamping = 1;
        fish3_5.body.collideWorldBounds = true;   
        
        fish3_6.body.bounce.y = 0,8;
        fish3_6.body.linearDamping = 1;
        fish3_6.body.collideWorldBounds = true;  
        
        benzin.create(1750, 1380, 'benzinkanister');
        benzin.create(2270, 2000, 'benzinkanister');
        benzin.create(3200, 1700, 'benzinkanister');
         
			
		ufo2 = game.add.sprite(6190, 1800, "ufo");
		game.physics.enable(ufo2);
		ufo2.body.bounce.y = 0,8;
		ufo2.body.linearDamping = 1;
		ufo2.body.collideWorldBounds = true;
		
		game.time.events.add(5000, function() {
    		inNextLevel2 = true;
		}, this);
    }
	
	if(level === 3 && p.x > 6253 && inNextLevel2){
		gameEnd = true;
		p.animations.stop();
		p.frame = 4;
        p.body.velocity.y = -100;
		ufo2.body.velocity.y = -100;
    }
	

    /*player*/
    if (cursors.up.isDown && abgestuertzt && !gameEnd)
    {
        if (p.body.onFloor())
        {
            p.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown && abgestuertzt && !gameEnd)
    {
		p.animations.play('left');
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown && abgestuertzt && !gameEnd)
    {
		p.animations.play('right');
        p.body.velocity.x = 150;
    }else
    {
        //  Stand still
        p.animations.stop();
		p.frame = 4;
	}


	/*tiger*/
	if(tiger.nachlinks) {
		tiger.animations.play('left');
        tiger.body.velocity.x = -40;
	} else {
		tiger.animations.play('right');
        tiger.body.velocity.x = +40;
	}
	
	if(tiger.body.blocked.left) {
		tiger.nachlinks = false;
	} else if(tiger.body.blocked.right){
		tiger.nachlinks = true;	
	}
	
	if(tiger1.nachlinks) {
		tiger1.animations.play('left');
        tiger1.body.velocity.x = -40;
	} else {
		tiger1.animations.play('right');
        tiger1.body.velocity.x = +40;
	}
	
	if(tiger1.body.blocked.left) {
		tiger1.nachlinks = false;
	} else if(tiger1.body.blocked.right){
		tiger1.nachlinks = true;
	}
    
    if(tiger3_1.nachlinks) {
		tiger3_1.animations.play('left');
        tiger3_1.body.velocity.x = -80;
	} else {
		tiger3_1.animations.play('right');
        tiger3_1.body.velocity.x = +80;
	}
	
	if(tiger3_1.body.blocked.left) {
		tiger3_1.nachlinks = false;
	} else if(tiger3_1.body.blocked.right){
		tiger3_1.nachlinks = true;
	}
    
     if(tiger3_2.nachlinks) {
		tiger3_2.animations.play('left');
        tiger3_2.body.velocity.x = -80;
	} else {
		tiger3_2.animations.play('right');
        tiger3_2.body.velocity.x = +80;
	}
	
	if(tiger3_2.body.blocked.left) {
		tiger3_2.nachlinks = false;
	} else if(tiger3_2.body.blocked.right){
		tiger3_2.nachlinks = true;
	}
    
      
    
      
    // Schlange
    if(nachlinks) {
		snake.animations.play('left');
        snake.body.velocity.x = -80;
	} else {
		snake.animations.play('right');
        snake.body.velocity.x = +80;
	}
	
	if(snake.body.blocked.left) {
		nachlinks = false;
	} else if(snake.body.blocked.right){
		nachlinks = true;
	}
    
    if(nachlinks) {
		snake3_1.animations.play('left');
        snake3_1.body.velocity.x = -80;
	} else {
		snake3_1.animations.play('right');
        snake3_1.body.velocity.x = +80;
	}
	
	if(snake3_1.body.blocked.left) {
		nachlinks = false;
	} else if(snake3_1.body.blocked.right){
		nachlinks = true;
	}
    


	/*gorilla*/

	if(nachlinks) {
		gorilla.animations.play('left');
        gorilla.body.velocity.x = -80;
	} else {
		gorilla.animations.play('right');
        gorilla.body.velocity.x = +80;
	}
	
	if(gorilla.body.blocked.left) {
		nachlinks = false;
	} else if(gorilla.body.blocked.right){
		nachlinks = true;
	}

    if(nachlinks) {
		gorilla2.animations.play('left');
        gorilla2.body.velocity.x = -80;
	} else {
		gorilla2.animations.play('right');
        gorilla2.body.velocity.x = +80;
	}
	
	if(gorilla2.body.blocked.left) {
		nachlinks = false;
	} else if(gorilla2.body.blocked.right){
		nachlinks = true;
	}
    
    
    
	/*fisch*/
	if (fish.body.onFloor()){
        fish.animations.play("up");
		fish.body.velocity.y= -390;
    }

    if(fish.body.velocity.y >= 0){
        fish.animations.play("down");
    }

    if (fish1.body.onFloor()){
        fish1.animations.play("up");
		fish1.body.velocity.y= -370; // velocity ist die geschwindigkeit
	}

    if(fish1.body.velocity.y >= 0){
        fish1.animations.play("down");
    }
    if (fish2.body.onFloor()){
        fish2.animations.play("up");
		fish2.body.velocity.y= -370;
    }

    if(fish2.body.velocity.y >= 0){
        fish2.animations.play("down");
    }
    
     if (fish4.body.onFloor()){
        fish4.animations.play("up");
		fish4.body.velocity.y= -370;
    }

    if(fish4.body.velocity.y >= 0){
        fish4.animations.play("down");
    }
    
    if (fish5.body.onFloor()){
        fish5.animations.play("up");
		fish5.body.velocity.y= -390;
    }

    if(fish5.body.velocity.y >= 0){
        fish5.animations.play("down");
    }
    if (fish2_1.body.onFloor()){
    	fish2_1.animations.play("up");
        fish2_1.body.velocity.y= -390;
    }

    if(fish2_1.body.velocity.y >= 0){
        fish2_1.animations.play("down");
    }
    
    if (fish2_2.body.onFloor()){
        fish2_2.animations.play("up");
		fish2_2.body.velocity.y= -370;
    }

    if(fish2_2.body.velocity.y >= 0){
        fish2_2.animations.play("down");
    }
 
    if (fish2_3.body.onFloor()){
        fish2_3.animations.play("up");
		fish2_3.body.velocity.y= -360;
    }

    if(fish2_3.body.velocity.y >= 0){
        fish2_3.animations.play("down");
    }
   
    if (fish2_4.body.onFloor()){
        fish2_4.animations.play("up");
		fish2_4.body.velocity.y= -390;
    }

    if(fish2_4.body.velocity.y >= 0){
        fish2_4.animations.play("down");
    }
    
     if (fish2_5.body.onFloor()){
        fish2_5.animations.play("up");
		fish2_5.body.velocity.y= -390;
    }

    if(fish2_5.body.velocity.y >= 0){
        fish2_5.animations.play("down");
    }
    
     if (fish2_6.body.onFloor()){
        fish2_6.animations.play("up");
		fish2_6.body.velocity.y= -390;
    }

    if(fish2_6.body.velocity.y >= 0){
        fish2_6.animations.play("down");
    }
    
     if (fish2_7.body.onFloor()){
        fish2_7.animations.play("up");
		fish2_7.body.velocity.y= -390;
    }

    if(fish2_7.body.velocity.y >= 0){
        fish2_7.animations.play("down");
    }
    
     if (fish2_8.body.onFloor()){
        fish2_8.animations.play("up");
		fish2_8.body.velocity.y= -390;
    }

    if(fish2_8.body.velocity.y >= 0){
        fish2_8.animations.play("down");
    }
    
     if (fish2_9.body.onFloor()){
        fish2_9.animations.play("up");
		fish2_9.body.velocity.y= -390;
    }

    if(fish2_9.body.velocity.y >= 0){
        fish2_9.animations.play("down");
    }
    
     if (fish2_10.body.onFloor()){
        fish2_10.animations.play("up");
		fish2_10.body.velocity.y= -390;
    }

    if(fish2_10.body.velocity.y >= 0){
        fish2_10.animations.play("down");
    }
    
     if (fish2_11.body.onFloor()){
        fish2_11.animations.play("up");
		fish2_11.body.velocity.y= -350;
    }

    if(fish2_11.body.velocity.y >= 0){
        fish2_11.animations.play("down");
    }
    
    
     if (fish2_13.body.onFloor()){
        fish2_13.animations.play("up");
		fish2_13.body.velocity.y= -350;
    }

    if (fish2_13.body.velocity.y >= 0){
        fish2_13.animations.play("down");
    }
    
    if (fish3_1.body.onFloor()){
        fish3_1.animations.play("up");
		fish3_1.body.velocity.y= -380;
    }

    if (fish3_1.body.velocity.y >= 0){
        fish3_1.animations.play("down");
    }
    
    if (fish3_2.body.onFloor()){
        fish3_2.animations.play("up");
		fish3_2.body.velocity.y= -380;
    }

    if(fish3_2.body.velocity.y >= 0){
        fish3_2.animations.play("down");
    }
    
     if (fish3_3.body.onFloor()){
        fish3_3.animations.play("up");
		fish3_3.body.velocity.y= -380;
    }

    if(fish3_3.body.velocity.y >= 0){
        fish3_3.animations.play("down");
    }
    
     if (fish3_4.body.onFloor()){
        fish3_4.animations.play("up");
		fish3_4.body.velocity.y= -380;
    }

    if(fish3_4.body.velocity.y >= 0){
        fish3_4.animations.play("down");
    }
    
     if (fish3_5.body.onFloor()){
        fish3_5.animations.play("up");
		fish3_5.body.velocity.y= -380;
    }

    if(fish3_5.body.velocity.y >= 0){
        fish3_5.animations.play("down");
    }
    
     if (fish3_6.body.onFloor()){
        fish3_6.animations.play("up");
		fish3_6.body.velocity.y= -380;
    }

    if(fish3_6.body.velocity.y >= 0){
        fish3_6.animations.play("down");
    }

    
}

function sammelBenzin (player, benzinkanister) { 
    benzinkanister.kill();
    score += 2;
    scoreText.text = score+' Liter | Level' + level;
}

function stirb (player, tier) {
	leben = leben -1;
	tier.body.velocity.x= 0; //somit werden die Tiere nicht aus ihrer Bahn "geschubst" 
	lebenanzeige.loadTexture(leben+'leben');
	if(level == 1){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current,true,true); // replay
			leben = 3;
		} else {
			p.body.x = 0;
			p.body.y = 2153;
		}
	}
	if(level == 2){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current); // replay
			leben = 3;
		}  else {
			p.body.x = 0;
			p.body.y = 2169;
		}
	}
    if(level == 3){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current); // replay
			leben = 3;
		}  else {
			p.body.x = 0;
			p.body.y = 2153;
		}
	}
}

function stirbImWasser (player, water) {
	leben = leben -1;
	lebenanzeige.loadTexture(leben+'leben');
	if(level == 1){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current,true,true); // replay
			leben = 3;
		} else {
			p.body.x = 0;
			p.body.y = 2153;
		}
	}
	if(level == 2){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current); // replay
			leben = 3;
		}  else {
			p.body.x = 0;
			p.body.y = 2169;
		}
	}
    if(level == 3){
		if(leben < 1) {
			p.kill();
			level = 1;
			inNextLevel= false;
			inNextLevel2= false;
			game.state.start(game.state.current); // replay
			leben = 3;
		}  else {
			p.body.x = 0;
			p.body.y = 2153;
		}
	}
}

function render() {
    //game.debug.body(p);
    //game.debug.bodyInfo(p, 32, 320);
}