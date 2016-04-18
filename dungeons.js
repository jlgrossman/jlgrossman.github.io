// dungeons
function Room(x, y, type){
	this.x = x;
	this.y = y;
	this.type = type;
	this.doors = [];
}
Room.normal = 0;
Room.entrance = 1;
Room.exit = 2;

Room.prototype.addDoor = function(room, direction){
	this.doors[direction] = room;
};

Room.prototype.map = function(){
	Random.seed = this.x * this.y;
	var tiles = new Array2D(16, 10);
	for(var y = 0; y < 10; y++){
		for(var x = 0; x < 16; x++){
			if(y == 0 || y == 9) tiles.set(x,y,1);
			else if(x == 0 || x == 15) tiles.set(x,y,1);
			else tiles.set(x,y,0);
		}
	}
	for(var i = 0; i < 4; i++){
		if(this.doors[i] != undefined){
			var v = Direction.vector(i);
			var x = (v.x == 0)?(8):(7.5+v.x*7.5);
			var y = (v.y == 0)?(5):(4.5+v.y*4.5);
			tiles.set(x,y,2);
			if(v.x == 0) tiles.set(x-1, y, 2);
			else tiles.set(x, y-1, 2);
		}
	}
	return new Map(tiles);
};

function Dungeon(level){
	this.level = level;
	this.rooms = new Array2D(20,20);
	this.doors = new Array2D(20,20);
	this.currentRoom = undefined;
}

Dungeon.prototype.width = 20;
Dungeon.prototype.height = 20;
Dungeon.prototype.addRoom = function(room){
	if(this.rooms.values.length == 0) this.currentRoom = room;
	this.rooms.set(room.x, room.y, room);
};
Dungeon.prototype.addDoor = function(room1, room2, direction){
	if(this.doors.get(room1.x, room1.y) == undefined) this.doors.set(room1.x, room1.y, []);
	if(this.doors.get(room2.x, room2.y) == undefined) this.doors.set(room2.x, room2.y, []);
	this.doors.get(room1.x, room1.y)[direction] = room2;
	this.doors.get(room2.x, room2.y)[Direction.reverse(direction)] = room1;
	room1.addDoor(room2, direction);
	room2.addDoor(room1, Direction.reverse(direction));
};


function DungeonGenerator(){
	this.level = 0;
}

DungeonGenerator.prototype.generate = function(){
	var dungeon = new Dungeon(this.level);
	Random.seed = this.level++;
	var entrance = new Room(1+Math.floor(Random.next()*18), 1+Math.floor(Random.next()*18), Room.entrance);
	dungeon.addRoom(entrance);
	var rooms = [entrance];
	var size = 0;
	var maxSize = Math.min(Math.floor(this.level/4) + 1, 6);
	
	do {
		var nextRooms = [];
		do {
			var room = rooms.shift();
			for(var i = 0; i < 4; i++){
				var delta = Direction.vector(i);
				var x = room.x + delta.x;
				var y = room.y + delta.y;
				if((size == 0 || Random.next() < 0.5) && (x >= 0 && x < dungeon.width && y >= 0 && y < dungeon.height)){
					if(dungeon.rooms.get(x,y) == undefined){
						var newRoom = new Room(x, y, 0);
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
	
	return dungeon;
};

function traceDungeon(d){
	var str = "[";
	for(var y = 0; y < d.height; y++){
		for(var x = 0; x < d.width; x++){
			if(d.rooms.get(x,y) == undefined){
				str += "0 ";
			} else {
				str += ""+(d.rooms.get(x,y).type+1)+" ";
			}
		}
		str += "\n";
	}
	console.log(str);
}