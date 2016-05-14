// dungeons
function Room(x, y, type, level){
	this.x = x;
	this.y = y;
	this.type = type;
	this.level = level;
	this.doors = [];
	this.tileMap = undefined;
	this.enemyArray = undefined;
	this.objectArray = undefined;
}
Room.normal = 0;
Room.locked = 1;
Room.entrance = 2;
Room.exit = 3;

Room.width = 16;
Room.height = 10;

Room.prototype.addDoor = function(room, direction, locked){
	this.doors[direction] = {room:room, locked:locked||false};
};

Room.prototype.stairs = function(){
	var tiles = this.map().tiles.values;
	for(var i = 0; i < tiles.length; i++){
		var type = tiles[i].type;
		if(type == Tile.stairsUp || type == Tile.stairsDown){
			return tiles[i];
		}
	}
};

Room.prototype.enemies = function(){
	if(!this.enemyArray){
		this.enemyArray = new GameObjectArray();
		Random.seed = this.x * this.y;
		if(this.type == Room.normal && Random.next() < Math.min(0.6, 0.2*this.level)){
			var numEnemies = Math.floor(Random.next()*Math.min(5,this.level)+1);
			for(var i = 0; i < numEnemies; i++){
				var x = Math.floor(Random.next()*(Room.width-8))+4;
				var y = Math.floor(Random.next()*(Room.height-8))+4;
				this.enemyArray.push(new Enemy(x*Tile.size,y*Tile.size,1));
			}
		}
	}
	return this.enemyArray;
};

Room.prototype.objects = function(){
	if(!this.objectArray){
		this.objectArray = new GameObjectArray();
	}
	return this.objectArray;
};

Room.prototype.map = function(){
	if(!this.tileMap){
		Random.seed = this.x * this.y;
		var tiles = new Array2D(Room.width, Room.height);
		for(var y = 0; y < Room.height; y++){
			for(var x = 0; x < Room.width; x++){
				if(y == 0){
					if(x == 0) tiles.set(x,y,Tile.wallTopLeft);
					else if(x == Room.width-1) tiles.set(x,y,Tile.wallTopRight);
					else tiles.set(x,y,Tile.wallTop);
				} else if(y == Room.height-1){
					if(x == 0) tiles.set(x,y,Tile.wallBottomLeft);
					else if(x == Room.width-1) tiles.set(x,y,Tile.wallBottomRight);
					else tiles.set(x,y,Tile.wallBottom);
				} 
				else if(x == 0) tiles.set(x,y,Tile.wallLeft);
				else if(x == Room.width-1) tiles.set(x,y,Tile.wallRight);
				else tiles.set(x,y,Tile.floor);
			}
		}
		for(var i = 0; i < 4; i++){
			if(this.doors[i] != undefined){
				var sprite = this.doors[i].locked?Tile.lockedDoor:Tile.door;
				var v = Direction.vector(i);
				var x = (v.x == 0)?(8):(7.5+v.x*7.5);
				var y = (v.y == 0)?(5):(4.5+v.y*4.5);
				tiles.set(x,y,sprite);
				if(v.x == 0) tiles.set(x-1, y, sprite);
				else tiles.set(x, y-1, sprite);
			}
		}
		if(this.type == Room.entrance){
			tiles.set(Math.floor(Random.next()*(Room.width-8))+4,Math.floor(Random.next()*(Room.height-8))+4,Tile.stairsUp);
		} else if(this.type == Room.exit){
			tiles.set(Math.floor(Random.next()*(Room.width-8))+4,Math.floor(Random.next()*(Room.height-8))+4,Tile.stairsDown);
		} else if(this.type == Room.locked){
			tiles.set(1,1,Tile.debug);
		}
		this.tileMap = new Map(tiles);
	}
	return this.tileMap;
};

Room.prototype.onEnter = function(){
};

Room.prototype.onExit = function(){
};

Room.prototype.update = function(){
	this.map().update();
	this.enemies().update();
	this.objects().update();
};

Room.prototype.draw = function(gfx){
	this.map().draw(gfx);
	this.enemies().draw(gfx);
	this.objects().draw(gfx);
};

function Dungeon(level){
	this.level = level;
	this.rooms = new Array2D(20,20);
	this.entrance = undefined;
	this.exit = undefined;
}

Dungeon.width = 20;
Dungeon.height = 20;
Dungeon.prototype.addRoom = function(room){
	if(this.rooms.values.length == 0){
		this.entrance = room;
	}
	this.rooms.set(room.x, room.y, room);
};
Dungeon.prototype.addDoor = function(room1, room2, direction){
	room1.addDoor(room2, direction);
	room2.addDoor(room1, Direction.reverse(direction));
};

Dungeon.prototype.lockDoor = function(room, door){
	var direction = room.doors.indexOf(door);
	room.doors[direction].locked = true;
	room.doors[direction].room.doors[Direction.reverse(direction)].locked = true;
};

Dungeon.prototype.unlockDoor = function(room, door){
	var direction = room.doors.indexOf(door);
	room.doors[direction].locked = false;
	room.doors[direction].room.doors[Direction.reverse(direction)].locked = false;
};

Dungeon.prototype.trace = function(boring){
	if(!boring){
		var colors = "#FFF #000 #D23 #23D #2A3".split(" ");
		for(var y = 0; y < Dungeon.height; y++){
			var str = "";
			var arr = [];
			var print = false;
			for(var x = 0; x < Dungeon.width; x++){
				if(this.rooms.get(x,y) == undefined){
					str += "%c + ";
					arr.push("border:3px solid white; color:"+colors[0]);
				} else {
					print = true;
					var t = this.rooms.get(x,y).type;
					str += "%c "+t+" ";
					arr.push("border:3px solid white; text-shadow:2px 2px 2px rgba(0,0,0,0.35);background-color:"+colors[t+1]+";color:white");
				}
			}
			if(print){
				arr.unshift(str);
				(y%2==0?console.log:console.debug).apply(console,arr);
			}
		}
	} else {
		var str = "";
		for(var y = 0; y < Dungeon.height; y++){
			for(var x = 0; x < Dungeon.width; x++){
				if(this.rooms.get(x,y) == undefined){
					str += "+ ";
				} else {
					str += ""+(this.rooms.get(x,y).type)+" ";
				}
			}
			str += "\n";
		}
		console.log(str);
	}
};

Dungeon.prototype.onEnter = function(){
};

Dungeon.prototype.onExit = function(){
};

function DungeonGenerator(){
	this.level = 0;
}

DungeonGenerator.prototype.generate = function(){
	var dungeon = new Dungeon(this.level);
	Random.seed = this.level+1;
	var entrance = new Room(1+Math.floor(Random.next()*(Dungeon.width-2)), 1+Math.floor(Random.next()*(Dungeon.height-2)), this.level>0?Room.entrance:Room.normal, this.level);
	dungeon.addRoom(entrance);
	var rooms = [entrance];
	var size = 0;
	var maxSize = Math.min(Math.floor((this.level+1)/4) + 1, 6)+Math.min(Math.floor(this.level/30),4);
	
	do {
		var nextRooms = [];
		do {
			var room = rooms.shift();
			for(var i = 0; i < 4; i++){
				var delta = Direction.vector(i);
				var x = room.x + delta.x;
				var y = room.y + delta.y;
				if((size == 0 || Random.next() < 0.5) && (x >= 0 && x < Dungeon.width && y >= 0 && y < Dungeon.height)){
					if(dungeon.rooms.get(x,y) == undefined){
						var newRoom = new Room(x, y, Room.normal, this.level);
						dungeon.addRoom(newRoom);
						dungeon.addDoor(room, newRoom, i);
						nextRooms.push(newRoom);
					} else if (Random.next() < 0.4){
						dungeon.addDoor(room, dungeon.rooms.get(x,y), i);
					}
				}
			}
		} while(rooms.length > 0);
		rooms = nextRooms;
	} while (rooms.length > 0 && ++size < maxSize);
	
	var maxDistance = 0;
	var exits = [];
	for(var i = 0; i < dungeon.rooms.values.length; i++){
		var room = dungeon.rooms.values[i];
		if(room){
			var dx = Math.abs(entrance.x - room.x);
			var dy = Math.abs(entrance.y - room.y);
			var d = dx + dy;
			if(d > maxDistance){
				exits = [room];
				maxDistance = d;
			} else if(d == maxDistance){
				exits.push(room);
			}
		}
	}
	
	dungeon.exit = exits[Math.floor(Random.next()*exits.length)];
	dungeon.exit.type = Room.exit;
	
	var numLocks = 0;
	var normalRooms = [];
	for(var i = 0; i < dungeon.rooms.values.length; i++){
		var room = dungeon.rooms.values[i];
		if(room && room.type == Room.normal){
			var doors = room.doors.filter(function(){return true;}); // remove undefined
			if(doors.length == 1 && Random.next() < 0.2){
				room.type = Room.locked;
				dungeon.lockDoor(room, doors[0]);
				numLocks++;
			} else {
				normalRooms.push(room);
			}
		}
	}
	
	while(numLocks-- > 0){
		var index = Math.floor(Random.next() * normalRooms.length);
		var room = normalRooms.splice(index,1)[0];
		if(room){
			room.objects().push(new Box(179, 109)); // TODO: change to key chest or something
		}
	}
	
	return dungeon;
};

function Camera(dungeon){
	this.dungeon = undefined;
	this.currentRoom = undefined;
	this.x = this.targetX = 0;
	this.y = this.targetY = 0;
	this.moving = false;
	if(dungeon) this.show(dungeon);
}

Camera.prototype.show = function(dungeon){
	if(this.dungeon) this.dungeon.onExit();
	this.dungeon = dungeon;
	this.currentRoom = undefined;
	this.x = this.targetX = 0;
	this.y = this.targetY = 0;
	this.moving = false;
	this.moveTo(this.dungeon.entrance);
	dungeon.onEnter();
};

Camera.prototype.moveTo = function(room){
	if(this.currentRoom) this.currentRoom.onExit();
	this.x = this.targetX = room.x * Tile.size * Room.width;
	this.y = this.targetY = room.y * Tile.size * Room.height;
	this.currentRoom = room;
	room.onEnter();
};

Camera.prototype.panTo = function(room){
	if(this.currentRoom) this.currentRoom.onExit();
	this.targetX = room.x * Tile.size * Room.width;
	this.targetY = room.y * Tile.size * Room.height;
	this.currentRoom = room;
	room.onEnter();
};

Camera.prototype.getTileAt = function(x,y){
	var roomX = Math.floor(x/Room.width/Tile.size);
	var roomY = Math.floor(y/Room.height/Tile.size);
	var tileX = Math.floor((x-roomX*Room.width*Tile.size)/Tile.size);
	var tileY = Math.floor((y-roomY*Room.height*Tile.size)/Tile.size);
	var room = this.dungeon.rooms.get(roomX,roomY);
	if(room){
		return room.map().tiles.get(tileX,tileY);
	}
};

Camera.prototype.update = function(){
	var dx = this.targetX - this.x;
	var dy = this.targetY - this.y;
	if(Math.abs(dx) + Math.abs(dy) < 1){
		this.x = this.targetX;
		this.y = this.targetY;
		Game.paused = false;
		this.moving = false;
		this.currentRoom.update();
	} else {
		Game.paused = true;
		Game.player.x -= dx*0.8/5;
		Game.player.y -= dy*0.7/5;
		this.x += dx/5;
		this.y += dy/5;
		this.moving = true;
	}
};

Camera.prototype.draw = function(gfx){
	if(this.moving){
		for(var y = -1; y <= Room.height; y++){
			var posY = y*Tile.size;
			for(var x = -1; x <= Room.width; x++){
				var posX = x*Tile.size;
				var tile = this.getTileAt(this.x+posX,this.y+posY);
				if(tile) tile.draw(gfx,posX-this.x%Tile.size,posY-this.y%Tile.size);
			}
		}
	} else {
		this.currentRoom.draw(gfx);
	}
};