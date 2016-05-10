// game
function GameEngine(graphics, width, height){
	this.width = width||384;
	this.height = height||260;
	this.paused = false;
	this.graphics = graphics;
	this.graphics.canvas.width = this.width;
	this.graphics.canvas.height = this.height;
	this.thread = undefined;
	this.player = new Player();
	this.dungeonGenerator = new DungeonGenerator(0);
	this.camera = new Camera(this.dungeonGenerator.generate());
	this.hud = new HUD(0,this.height-20);
	this.init();
}

GameEngine.prototype.loop = function(){ Game.update(); };
GameEngine.prototype.render = function(){ requestAnimationFrame(Game.render); Game.draw(); };
GameEngine.prototype.run = function(){ this.thread = setInterval(this.loop, 17); requestAnimationFrame(this.render); };

GameEngine.prototype.init = function(){
	this.player.x = this.width/2;
	this.player.y = this.height/2;
	Key.reset();
	Mouse.reset();
};

GameEngine.prototype.update = function(){
	if(!this.paused){
		if(Key.isPressed(32)) this.nextLevel();
		this.player.update();
	}
	this.camera.update();
	this.hud.update();
	
	Mouse.update();
	Key.update();
};

GameEngine.prototype.draw = function(){
	if(this.graphics){
		this.graphics.fillStyle = "rgba(255,255,255,0.65)";
		this.graphics.fillRect(0,0,this.width, this.height);
		
		this.camera.draw(this.graphics);
		this.player.draw(this.graphics);
		this.hud.draw(this.graphics);
	}
};

GameEngine.prototype.nextLevel = function(){
	this.init();
	this.dungeonGenerator.level++;
	this.camera = new Camera(this.dungeonGenerator.generate());
	this.player.x = this.camera.currentRoom.stairs().x;
	this.player.y = this.camera.currentRoom.stairs().y+28;
	this.player.vx = 0;
	this.player.vy = 1;
};

GameEngine.prototype.previousLevel = function(){
	this.init();
	this.dungeonGenerator.level--;
	this.camera = new Camera(this.dungeonGenerator.generate());
	this.camera.moveTo(this.camera.dungeon.exit);
	this.player.x = this.camera.currentRoom.stairs().x;
	this.player.y = this.camera.currentRoom.stairs().y-28;
	this.player.vx = 0;
	this.player.vy = -1;
};

var Game;
var Sprites;
var Maps = {};

window.onload = function(){
	
	Sprites = new SpriteLoader([
		{name:"debug", src:"sprites/debug.png"},
		{name:"playerRunLeft", src:"sprites/runLeft.png", length: 16, type: "animation"},
		{name:"playerRunRight", src:"sprites/runRight.png", length: 16, type: "animation"},
		{name:"playerJump", src:"sprites/jump.png", length: 8, loop: 7, type: "animation"},
		{name:"playerFall", src:"sprites/fall.png", length: 6, type: "animation"},
		{name:"wall", src:"sprites/wall.png"},
		{name:"wallLeft", src:"sprites/wallLeft.png"},
		{name:"wallRight", src:"sprites/wallRight.png"},
		{name:"wallTop", src:"sprites/wallTop.png"},
		{name:"wallBottom", src:"sprites/wallBottom.png"},
		{name:"wallTopLeft", src:"sprites/wallCornerTopLeft.png"},
		{name:"wallTopRight", src:"sprites/wallCornerTopRight.png"},
		{name:"wallBottomRight", src:"sprites/wallCornerBottomRight.png"},
		{name:"wallBottomLeft", src:"sprites/wallCornerBottomLeft.png"},
		{name:"tileFloor", src:"sprites/stoneFloor.png"},
		{name:"tileDoor", src:"sprites/tileDoor.png"},
		{name:"stairsUp", src:"sprites/stairsUp.png"},
		{name:"stairsDown", src:"sprites/stairsDown.png"},
		{name:"box", src:"sprites/box.png"}
	],
	function(){
		
		var canvas = document.getElementById("canvas");
		Game = new GameEngine(canvas.getContext("2d"));
		Game.run();
		Mouse.offset = {x: canvas.offsetLeft, y: canvas.offsetTop};
		Mouse.scale = canvas.offsetWidth/Game.width;
	});
	
	window.onresize = function(){
		Mouse.scale = canvas.offsetWidth/Game.width;
	};
	
};