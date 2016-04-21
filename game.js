// game
function GameEngine(graphics, width, height){
	this.width = width||384;
	this.height = height||240;
	this.paused = false;
	this.graphics = graphics;
	this.graphics.canvas.width = this.width;
	this.graphics.canvas.height = this.height;
	this.thread = undefined;
	this.player = new Player();
	this.dungeonGenerator = new DungeonGenerator(0);
	this.dungeon = this.dungeonGenerator.generate();
	this.map = this.dungeon.currentRoom.map();
	this.camera = new Camera(this.dungeon);
	this.init();
}

GameEngine.prototype.loop = function(){ Game.update(); };
GameEngine.prototype.render = function(){ requestAnimationFrame(Game.render); Game.draw(); };
GameEngine.prototype.run = function(){ this.thread = setInterval(this.loop, 17); requestAnimationFrame(this.render); };

GameEngine.prototype.init = function(){
	this.player.x = this.width/2;
	this.player.y = this.height/2;
};

GameEngine.prototype.update = function(){
	if(!this.paused){
		if(Key.isPressed(32)) this.nextLevel();
		this.player.update();
		this.map.update();
	}
	Mouse.update();
	Key.update();
};

GameEngine.prototype.draw = function(){
	if(this.graphics){
		this.graphics.fillStyle = "rgba(255,255,255,0.65)";
		this.graphics.fillRect(0,0,this.width, this.height);
		
		this.camera.draw(this.graphics);
		this.player.draw(this.graphics);
	}
};

GameEngine.prototype.nextLevel = function(){
	this.init();
	this.dungeon = this.dungeonGenerator.generate();
	this.map = this.dungeon.currentRoom.map();
};

var Game;
var Sprites;
var Maps = {};

window.onload = function(){
	
	Sprites = new SpriteLoader([
		{name:"debug", src:"sprites/debug.png"},
		{name:"playerRun", src:"sprites/run.png", length: 16, type: "animation"},
		{name:"playerJump", src:"sprites/jump.png", length: 8, loop: 7, type: "animation"},
		{name:"playerFall", src:"sprites/fall.png", length: 6, type: "animation"},
		{name:"tileWall", src:"sprites/tileWall.png"},
		{name:"tileFloor", src:"sprites/tileFloor.png"},
		{name:"tileDoor", src:"sprites/tileDoor.png"}
	],
	function(){
		
		Maps.debug = new Map(new Array2D(16, 10,[
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
		1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
		]));
		
		var canvas = document.getElementById("canvas");
		Mouse.offset = {x: canvas.offsetLeft, y: canvas.offsetTop};
		Game = new GameEngine(canvas.getContext("2d"));
		Game.run();
		
	});
	
};