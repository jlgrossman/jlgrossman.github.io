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
	for(var i = 0; i < 4; i++){
		var v = Direction.vector(i);
		var dx = v.x*12;
		var dy = v.y*12;
		var tileX = Math.floor((this.x+12+dx)/24);
		var tileY = Math.floor((this.y+12+dy)/24);
		var type = Game.camera.currentRoom.map().tiles.get(tileX,tileY).type;
		if(type != Tile.floor){
			var cx = this.x - tileX*24;
			var cy = this.y - tileY*24;
			var acx = Math.abs(cx);
			var acy = Math.abs(cy);
			if(acx < 24 && acy < 24){
				if(type >= Tile.wall && type <= Tile.wallBottomLeft){
					var dcx = 24 - acx;
					var dcy = 24 - acy;
					if(cx < 0) dcx *= -1;
					if(cy < 0) dcy *= -1;
					if(Math.abs(dcx) < Math.abs(dcy)) this.x += dcx;
					else this.y += dcy;
				} else if(type == Tile.door){
					Game.camera.panTo(Game.camera.currentRoom.doors[i]);
				} else if(type == Tile.stairsUp){
					Game.previousLevel();
				} else if(type == Tile.stairsDown){
					Game.nextLevel();
				}
			}
		}
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
	var a = Random.next()*Math.PI*2;
	this.vx = Math.cos(a);
	this.vy = Math.sin(a);
	this.pvx = 0;
}

Enemy.prototype.update = function(){
	if(Math.random() < 0.005){
		var a = Math.random()*Math.PI*2;
		this.vx = Math.cos(a);
		this.vy = Math.sin(a);
	}
	this.x += this.vx;
	this.y += this.vy;
	for(var i = 0; i < 4; i++){
		var v = Direction.vector(i);
		var dx = v.x*12;
		var dy = v.y*12;
		var tileX = Math.floor((this.x+12+dx)/24);
		var tileY = Math.floor((this.y+12+dy)/24);
		var tile = Game.camera.currentRoom.map().tiles.get(tileX,tileY);
		if(tile){
			var type = tile.type;
			if(type != Tile.floor){
				var cx = this.x - tile.x;
				var cy = this.y - tile.y;
				var acx = Math.abs(cx);
				var acy = Math.abs(cy);
				if(acx < 24 && acy < 24){
					var dcx = 24 - acx;
					var dcy = 24 - acy;
					if(cx < 0) dcx *= -1;
					if(cy < 0) dcy *= -1;
					if(Math.abs(dcx) < Math.abs(dcy)){ this.x += dcx; this.vx *= -1; }
					else { this.y += dcy; this.vy *= -1; }
				}
			}
		}
	}
	if(this.pvx != this.vx && this.vx > 0){
		this.currentAnimation = Sprites.playerRunRight.clone();
	} else if(this.pvx != this.vx && this.vx < 0){
		this.currentAnimation = Sprites.playerRunLeft.clone();
	}
	this.currentAnimation.play();
	this.currentAnimation.update();
	this.pvx = this.vx;
};

Enemy.prototype.draw = function(gfx){
	this.currentAnimation.draw(gfx,this.x,this.y);
};