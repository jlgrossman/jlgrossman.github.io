// utils
var Key = {
	current: [],
	previous: [],
	keyDown: function(e){ Key.current[e.keyCode] = true; },
	keyUp: function(e){ Key.current[e.keyCode] = false; },
	isDown: function(key){ return Key.current[key]||false; },
	isPressed: function(key){ return (!Key.previous[key]&&Key.current[key]); },
	update: function(){ Key.previous = Key.current.slice(); },
	reset: function(){ Key.current = Key.previous = []; }
};

var Mouse = {
	current: {x: 0, y: 0},
	previous: {x: 0, y: 0},
	velocity: {x: 0, y: 0},
	offset: {x: 0, y: 0},
	scale: {x: 0, y: 0},
	clicked: false,
	previousClicked: false,
	mouseDown: function(e){ Mouse.clicked = true; Mouse.mouseMove(e); },
	mouseUp: function(e){ Mouse.clicked = false; },
	mouseMove: function(e){ Mouse.current = {x: (e.pageX - Mouse.offset.x), y: e.pageY - Mouse.offset.y}; },
	isDown: function(){ return Mouse.clicked; },
	isClicked: function(){ return !Mouse.previousClicked&&Mouse.clicked; },
	update: function(){
		Mouse.velocity = {x: Mouse.current.x - Mouse.previous.x, y: Mouse.current.y - Mouse.previous.y};
		Mouse.previous = Mouse.current;
		Mouse.previousClicked = Mouse.clicked;
	},
	reset: function(){ Mouse.clicked = false; }
	
};

var Random = {
	seed: 0,
	numbers: "3711648386422254175921394827441031330837345043041785181721935256141701514022816112868579704288064592",
	next: function(){
		Random.seed %= 98;
		return +("."+Random.numbers.substr(Random.seed++,3));
	}
};

var Direction = {
	left: 0,
	up: 1,
	right: 2,
	down: 3,
	reverse: function(d){ return (d + 2) % 4; },
	vector: function(d){ 
		switch(d){
			case Direction.left: return {x:-1,y:0};
			case Direction.right: return {x:1,y:0};
			case Direction.up: return {x:0,y:-1};
			case Direction.down: return {x:0,y:1};
		}
	}
};

var Color = {
	red: "#C45A5C",
	green: "#91C45A",
	blue: "#359C9A",
	purple: "#8D5AC4",
	yellow: "#D6DB4B",
	black: "#000",
	white: "#FFF",
	grey: "#999",
	darkGrey: "#444"
};

function Array2D(width, height, values){
	this.width = width;
	this.height = height;
	this.values = values||[];
}

Array2D.prototype.size = function(){ return this.width * this.height; };
Array2D.prototype.inBounds = function(x,y){ return x >= 0 && x < this.width && y >= 0 && y < this.height; };

Array2D.prototype.get = function(x, y){
	if(!this.inBounds(x,y)) return undefined;
	return this.values[y * this.width + x];
};

Array2D.prototype.set = function(x, y, value){
	if(this.inBounds(x,y))
		return this.values[y * this.width + x] = value;
};

Array2D.prototype.clone = function(){
	return new Array2D(this.width, this.height, this.values.slice());
};

function GameObjectArray(){
	this.values = [];
}

GameObjectArray.prototype.size = function(){ return this.values.length; }
GameObjectArray.prototype.get = function(index){ return this.values[index]; };
GameObjectArray.prototype.indexOf = function(object){ return this.values.indexOf(object); };
GameObjectArray.prototype.push = function(object){ return this.values.push(object); };
GameObjectArray.prototype.remove = function(index){ return index>=0&&this.values.splice(index,1); };

GameObjectArray.prototype.update = function(){
	for(var i = 0; i < this.values.length; i++){
		this.values[i].update();
	}
};

GameObjectArray.prototype.draw = function(gfx){
	for(var i = 0; i < this.values.length; i++){
		this.values[i].draw(gfx);
	}
};

window.onkeydown = Key.keyDown;
window.onkeyup = Key.keyUp;
window.onmousemove = window.ontouchmove = Mouse.mouseMove;
window.onmousedown = window.ontouchstart = Mouse.mouseDown;
window.onmouseup = window.ontouchend = Mouse.mouseUp;