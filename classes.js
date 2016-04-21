// classes
function Player(){
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.currentAnimation = Sprites.playerRun;
}

Player.prototype.currentTile = function(){
	return Game.map.get(this.x, this.y);
};

Player.prototype.update = function(){
	var walking = false;
	if(Key.isDown(87)){
		walking = true;
		this.vy = -1;
	} else if (Key.isDown(83)){
		walking = true;
		this.vy = 1;
	}
	if(Key.isDown(65)){
		walking = true;
		this.vx = -1;
	} else if(Key.isDown(68)){
		walking = true;
		this.vx = 1;
	}
	if(walking) this.currentAnimation.play();
	else this.currentAnimation.reset();
	var dx = (this.vx!=0)?(this.vx/Math.abs(this.vx)*12):0;
	var dy = (this.vy!=0)?(this.vy/Math.abs(this.vy)*10):0;
	var tileX = Math.floor((this.x+12+dx)/24);
	var tileY = Math.floor((this.y+14+dy)/24);
	var type = Game.map.tiles.get(tileX,tileY).type;
	if(type != Tile.floor){
		if(type == Tile.door){
			if(tileX == 0){
				Game.dungeon.currentRoom = Game.dungeon.currentRoom.doors[Direction.left];
				this.x = 336;
			} else if(tileX == 15){
				Game.dungeon.currentRoom = Game.dungeon.currentRoom.doors[Direction.right];
				this.x = 24;
			} else if(tileY == 0){
				Game.dungeon.currentRoom = Game.dungeon.currentRoom.doors[Direction.up];
				this.y = 190;
			} else if(tileY == 9){
				Game.dungeon.currentRoom = Game.dungeon.currentRoom.doors[Direction.down];
				this.y = 24;
			}
			Game.map = Game.dungeon.currentRoom.map();
		}
		this.vx = 0;
		this.vy = 0;
	}
	Game.camera.x += this.vx;
	Game.camera.y += this.vy;
	//this.x += this.vx;
	//this.y += this.vy;
	this.vx *= 0.5;
	this.vy *= 0.5;
	this.currentAnimation.update();
};

Player.prototype.draw = function(gfx){
	this.currentAnimation.draw(gfx,this.x,this.y);
};