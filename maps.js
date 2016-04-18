// map
function Tile(x, y, type){
	this.x = x;
	this.y = y;
	this.type = type;
	this.sprite = Sprites[Tile.spriteNames[type]].clone();
}

Tile.floor = 0;
Tile.wall = 1;
Tile.door = 2;
Tile.spriteNames = ["tileFloor", "tileWall", "tileDoor"];

Tile.prototype.draw = function(gfx){
	this.sprite.draw(gfx,this.x, this.y);
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
				this.tiles.set(x,y, new Tile(x * 24, y * 24, tileArray.get(x,y)));
			}
		}
	}
	this.tileSize = tileSize||24;
}

Map.prototype.get = function(x,y){ return this.tiles.get(Math.floor(x/this.tileSize), Math.floor(y/this.tileSize)); };

Map.prototype.update = function(){
	for(var y = 0; y < this.tiles.height; y++){
		for(var x = 0; x < this.tiles.width; x++){
			this.tiles.get(x,y).update();
		}
	}
};

Map.prototype.draw = function(gfx){
	for(var y = 0; y < this.tiles.height; y++){
		for(var x = 0; x < this.tiles.width; x++){
			this.tiles.get(x,y).draw(gfx);
		}
	}
};