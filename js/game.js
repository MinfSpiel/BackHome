var game = new Phaser.Game(800, 470, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload(){
    game.load.tilemap('landscape', 'assets/landscape_level1.json', null, Phaser.Tilemap.TILED_JSON); //json datei
	game.load.tilemap('landscape2', 'assets/landscape_level2.json', null, Phaser.Tilemap.TILED_JSON); //json datei
	game.load.tilemap('landscape3', 'assets/landscape_level3.json', null, Phaser.Tilemap.TILED_JSON); //json datei
    game.load.image('tiles', 'assets/tileset_1.png');
    game.load.image('tiles_wolken', 'assets/tileset_2.png');
    game.load.image('tiles_himmel', 'assets/tileset_3.png');
	game.load.spritesheet('gorilla', 'assets/gorillax.png', 45, 42);
	game.load.spritesheet('player', 'assets/alien_new.png', 24, 55);
	game.load.spritesheet('tiger', 'assets/tiger.png', 90, 43);
	game.load.image('benzinkanister', 'assets/benzin.png');
	game.load.spritesheet('pauseButton', 'assets/button.png', 104, 55);
	game.load.spritesheet("fish", "assets/fish.png", 25, 20);
	game.load.image('ufo', 'assets/ufo.png');
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
var gorilla;
var fish;
var fish1;
var cursors;
var spaceKey;
var nachlinks = true;
var abgestuertzt = false;
var test;
var up = true;
var benzin;
var score = 0;
var scoreText;
var level = 1;

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
	
    //layer.debug = true;

	/*collision für unter wasser*/
	map.setCollision(38, true, layer4);
	map.setTileIndexCallback(38, killingWater, game, layer4);
	
	

	//der spieler soll sich erst nach 3 sekunden bewegen können
	abgestuertzt = false;
	
	game.time.events.add(500, function() {
		abgestuertzt = true;
	}, this);

	/*button*/
	this.pauseButton = this.game.add.sprite(10, 50, 'pauseButton');
	this.pauseButton.inputEnabled = true;
	this.pauseButton.events.onInputUp.add(function () {this.game.paused = true;},this);
	this.game.input.onDown.add(function () {if(this.game.paused)this.game.paused = false;},this);
	this.pauseButton.fixedToCamera = true;

	/*Spieler*/
    p = game.add.sprite(55, 55, 'player');
    p.animations.add('left', [0, 1, 2, 3], 10, true);
    p.animations.add('right', [5, 6, 7, 8], 10, true);
	game.physics.enable(p);
	game.camera.follow(p); // kamera folgt den player
    p.body.bounce.y = 0,8;
    p.body.linearDamping = 1;
    p.body.collideWorldBounds = true;
	
	
	

	/*Gorilla*/
   	gorilla = game.add.sprite(400, 2000, 'gorilla'); // position und parameter von preload
    gorilla.animations.add('left', [0, 1, 2, 3], 5, true);
    gorilla.animations.add('right', [5, 6, 7, 8], 5, true);
	game.physics.enable(gorilla); // bekommt physics

	/*Tiger*/
	tiger = game.add.sprite(2200, 2000, "tiger");
	tiger.animations.add('right', [3, 4, 5], 5, true);
    tiger.animations.add('left', [0, 1, 2], 5, true);
	game.physics.enable(tiger);
	tiger1 = game.add.sprite(4200, 2000, "tiger");
	tiger1.animations.add('left', [0, 1, 2], 5, true);
    tiger1.animations.add('right', [3, 4, 5], 5, true);
    game.physics.enable(tiger1);


	/*Fisch*/
	fish = game.add.sprite(1300, 2000, "fish");
	fish.animations.add("up", [0, 1], 4, true);
	fish.animations.add("down", [2, 3], 4, true);

	fish1 = game.add.sprite(1250, 2000, "fish");
	fish1.animations.add("up", [0, 1], 4, true);
	fish1.animations.add("down", [2, 3], 4, true);


	game.physics.enable(fish);
	game.physics.enable(fish1);

	fish.body.bounce.y = 0,8;
    fish.body.linearDamping = 1;
    fish.body.collideWorldBounds = true;
    fish1.body.bounce.y = 0,8;
    fish1.body.linearDamping = 1;
    fish1.body.collideWorldBounds = true;

    /*UFO*/
	ufo = game.add.group();
    ufo.enableBody = true;
    ufo.create(0, 100, 'ufo');

    /*Benzin*/
    benzin = game.add.group();
    benzin.enableBody = true;
	benzin.create(500, 2000, 'benzinkanister');
	benzin.create(500, 800, 'benzinkanister');
	benzin.create(2730, 2000, 'benzinkanister');


	/*Liter*/
	scoreText = game.add.text(10, 16, '0 Liter | Level' + level, {fontSize: '32px', fill: '#fff' });
	scoreText.fixedToCamera = true; // immer im bild

    game.physics.arcade.gravity.y = 250;
	cursors = game.input.keyboard.createCursorKeys(); // interaktion durch tasten
	

	/*leertaste*/
	/*spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // spacetaste
    spaceKey.onDown.add(togglePause, this);*/
}

function update() {

	/*methoden die bei bestimmten kollisionen stattfinden*/
    game.physics.arcade.collide(p, layer3); // collision mit player und grundboden -> level 1
	game.physics.arcade.collide(p, layer4, killingWater, null, this)
    game.physics.arcade.collide(p, layer6); // collision mit player und grundboden -> level 2
	game.physics.arcade.collide(p, layer10, killingWater, null, this)
	game.physics.arcade.collide(p, layer12); // collision mit player und grundboden -> level 3
	game.physics.arcade.collide(p, layer13, killingWater, null, this);
	game.physics.arcade.collide(benzin, layer3);
	game.physics.arcade.collide(gorilla, layer3);
	game.physics.arcade.collide(ufo, layer3);
	game.physics.arcade.collide(tiger, layer3);
	game.physics.arcade.collide(tiger1, layer3);	 
	game.physics.arcade.overlap(p, gorilla, stirb, null, this);
	game.physics.arcade.overlap(p, tiger, stirb, null, this);
	game.physics.arcade.overlap(p, tiger1, stirb, null, this);
	game.physics.arcade.collide(p, fish, stirbPiranha, null, this);
	game.physics.arcade.collide(p, fish1, stirbPiranha, null, this);
	game.physics.arcade.overlap(p, benzin, sammelBenzin, null, this);
	
	
    p.body.velocity.x = 0; // bewegung ohne was zu machen	

	if(level === 1 && p.x > 200){
		p.body.x = 0;
		p.body.y = 2169;
		
		layer2.destroy();
		layer3.destroy();
		layer4.destroy();
		layer8.destroy();
		layer9.destroy();
		fish.kill();
		fish1.kill();
		
		layer10.visible = true;
		layer11.visible = true;
		layer6.visible = true;
		layer7.visible = true;
		
		map2.setCollision(38, true, layer10);
	map2.setTileIndexCallback(38, killingWater, game, layer10);
	
	
		
		map2.setCollision(37);
		level = 2;
		scoreText.text = score+' Liter | Level' + level;
	} 
	if(level === 2 && p.x > 6376){
		p.body.x = 0;
		p.body.y = 2000;
		
		layer10.destroy();
		layer11.destroy();
		layer6.destroy();
		layer7.destroy();
		
		layer12.visible = true;
		layer13.visible = true;
		layer14.visible = true;
		layer15.visible = true;
		layer16.visible = true;

		map3.setCollision(38, true, layer13);
	map3.setTileIndexCallback(38, killingWater, game, layer13);
	
		map3.setCollision(37);
		level = 3;
		scoreText.text = score+' Liter | Level' + level;
	}

    /*player*/

    if (cursors.up.isDown)
    {
        if (p.body.onFloor())
        {
            p.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown && abgestuertzt)
    {
		p.animations.play('left');
        p.body.velocity.x = -150;
    }
    else if (cursors.right.isDown && abgestuertzt)
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
	
	if(tiger.body.blocked.left) {
		tiger.nachlinks = false;
	} else if(tiger.body.blocked.right){
		tiger.nachlinks = true;
	}

	/*gorilla*/

	if(nachlinks) {
		gorilla.animations.play('left');
        gorilla.body.velocity.x = -40;
	} else {
		gorilla.animations.play('right');
        gorilla.body.velocity.x = +40;
	}
	
	if(gorilla.body.blocked.left) {
		nachlinks = false;
	} else if(gorilla.body.blocked.right){
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
}



function killingWater (player, water){
	/*timeToLeave = game.add.text(32, 50, 'Counter jetzt starten!', {fontSize: '35px', fill: '#fff' })*/
	p.kill();
	//game.state.start(game.state.current); // replay
		console.log("1");
}

function sammelBenzin (player, benzinkanister) { 
    benzinkanister.kill();
    score += 2;
    scoreText.text = score+' Liter | Level' + level;
}

function stirb (player, tier) {
		p.kill();
		//game.state.start(game.state.current); // replay
		console.log("2");
}

function stirbPiranha (player, fisch) { 
		p.kill();
		//game.state.start(game.state.current);
		console.log("3");
		
}

function render() {
    game.debug.body(p);
    game.debug.bodyInfo(p, 32, 320);
}