// utils
var Key = {
	current: [],
	previous: [],
	keyDown: function(e){ Key.current[e.keyCode] = true; },
	keyUp: function(e){ Key.current[e.keyCode] = false; },
	isDown: function(key){ return Key.current[key]||false; },
	isPressed: function(key){ return (!Key.previous[key]&&Key.current[key]); },
	update: function(){ Key.previous = Key.current.slice(); }
};

var Mouse = {
	current: {x: 0, y: 0},
	previous: {x: 0, y: 0},
	velocity: {x: 0, y: 0},
	offset: {x: 0, y: 0},
	clicked: false,
	previousClicked: false,
	mouseDown: function(e){ Mouse.clicked = true; },
	mouseUp: function(e){ Mouse.clicked = false; },
	mouseMove: function(e){ Mouse.current = {x: e.pageX - Mouse.offset.x, y: e.pageY - Mouse.offset.y}; },
	isDown: function(){ return Mouse.clicked; },
	isClicked: function(){ return !Mouse.previousClicked&&Mouse.clicked; },
	update: function(){
		Mouse.velocity = {x: Mouse.current.x - Mouse.previous.x, y: Mouse.current.y - Mouse.previous.y};
		Mouse.previous = Mouse.current;
		Mouse.previousClicked = Mouse.clicked;
	}
	
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

window.onkeydown = Key.keyDown;
window.onkeyup = Key.keyUp;
window.onmousemove = window.touchmove = Mouse.mouseMove;
window.onmousedown = window.touchstart = Mouse.mouseDown;
window.onmouseup = window.touchend = Mouse.mouseUp;