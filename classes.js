// classes
function Player(){
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.currentAnimation = Sprites.playerRunRight;
	this.hp = 100;
	this.maxHp = 100;
	this.xp = 0;
	this.level = 0;
}

Player.prototype.currentTile = function(){
	return Game.map.get(this.x, this.y);
};

Player.prototype.update = function(){
	var walking = false;
	if(Mouse.isDown()){
		var p = Mouse.current;
		var dx = p.x - Game.width*Mouse.scale/2;
		var dy = p.y - Game.height*Mouse.scale/2;
		var d = Math.sqrt(dx*dx+dy*dy);
		if(d > 0){
			this.vx = dx/d;
			this.vy = dy/d;
			walking = true;
		}
	}
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
	var type = Game.camera.currentRoom.map().tiles.get(tileX,tileY).type;
	if(type != Tile.floor){
		if(type == Tile.door){
			var r;
			if(tileX == 0){
				r = Game.camera.currentRoom.doors[Direction.left];
			} else if(tileX == 15){
				r = Game.camera.currentRoom.doors[Direction.right];
			} else if(tileY == 0){
				r = Game.camera.currentRoom.doors[Direction.up];
			} else if(tileY == 9){
				r = Game.camera.currentRoom.doors[Direction.down];
			}
			Game.camera.panTo(r);
		} else if(type == Tile.stairsUp){
			Game.previousLevel();
		} else if(type == Tile.stairsDown){
			Game.nextLevel();
		}
		this.vx = 0;
		this.vy = 0;
	}
	var ms = 1;
	if(Key.isDown(16)){
		if(Key.isDown(65) || Key.isDown(68)) this.vx*=2, ms=2;
		if(Key.isDown(87) || Key.isDown(83)) this.vy*=2, ms=2;
	}
	var v = this.vx*this.vx+this.vy*this.vy;
	if(v>ms){
		v = Math.sqrt(v);
		this.vx *= ms/v;
		this.vy *= ms/v;
	}
	if(this.vx > 0){
		this.currentAnimation = Sprites.playerRunRight;
	} else if(this.vx < 0){
		this.currentAnimation = Sprites.playerRunLeft;
	}
	this.x += this.vx;
	this.y += this.vy;
	this.vx *= 0.8;
	this.vy *= 0.8;
	this.currentAnimation.update();
};

Player.prototype.draw = function(gfx){
	this.currentAnimation.draw(gfx,this.x,this.y);
};

function Enemy(x,y,type){
	this.x = x;
	this.y = y;
	this.type = type;
	this.currentAnimation = Sprites.playerRunRight.clone();
}

Enemy.prototype.update = function(){
	this.currentAnimation.update();
};

Enemy.prototype.draw = function(gfx){
	this.currentAnimation.draw(gfx,this.x,this.y);
};