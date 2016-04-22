// map
function Tile(x, y, type){
	this.x = x;
	this.y = y;
	this.type = type;
	this.sprite = Sprites[Tile.spriteNames[type]].clone();
}

Tile.floor = 0;
Tile.wall = 1;
Tile.wallLeft = 2;
Tile.wallRight = 3;
Tile.wallTop = 4;
Tile.wallBottom = 5;
Tile.wallTopLeft = 6;
Tile.wallTopRight = 7;
Tile.wallBottomRight = 8;
Tile.wallBottomLeft = 9;
Tile.door = 10;
Tile.spriteNames = ["tileFloor", "wall", "wallLeft", "wallRight", "wallTop", "wallBottom", "wallTopLeft", "wallTopRight", "wallBottomRight", "wallBottomLeft", "tileFloor"];

Tile.size = 24;

Tile.prototype.draw = function(gfx,x,y){
	this.sprite.draw(gfx,x||this.x, y||this.y);
};

Tile.prototype.update = function(){
	this.sprite.update();
};

function Map(tileArray, tileSize){
	if(tileArray.values[0] instanceof Tile){
		this.tiles = tileArray;
	} else {
		this.tiles = new Array2D(tileArray.width, tileArray.height);
		for(var y = 0; y < tileArray.height; y++){
			for(var x = 0; x < tileArray.width; x++){
				this.tiles.set(x,y, new Tile(x * Tile.size, y * Tile.size, tileArray.get(x,y)));
			}
		}
	}
	this.tileSize = tileSize||Tile.size;
}

Map.prototype.get = function(x,y){ return this.tiles.get(Math.floor(x/this.tileSize), Math.floor(y/this.tileSize)); };

Map.prototype.update = function(){
	for(var y = 0; y < this.tiles.height; y++){
		for(var x = 0; x < this.tiles.width; x++){
			this.tiles.get(x,y).update();
		}
	}
};

Map.prototype.draw = function(gfx, startX, startY, endX, endY){
	startX = startX||0;
	startY = startY||0;
	endX = endX||this.tiles.width;
	endY = endY||this.tiles.height;
	for(var y = startY; y < endY; y++){
		for(var x = startX; x < endX; x++){
			this.tiles.get(x,y).draw(gfx);
		}
	}
};