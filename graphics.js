// graphics
function Sprite(src, callback){
	this.width = 0;
	this.height = 0;
	this.loaded = false;
	var t = this;
	if(src){
		this.image = new Image();
		this.image.onload = function(){
			t.loaded = true;
			t.width = t.image.width;
			t.height = t.image.height;
			if(callback) callback(t);
		};
		this.image.src = src;
	}
}

Sprite.prototype.clone = function(){
	var s = new Sprite();
	s.image = this.image;
	s.width = this.width;
	s.height = this.height;
	s.loaded = true;
	return s;
};
Sprite.prototype.draw = function(gfx,x,y){
	if(this.loaded){
		gfx.drawImage(this.image, x, y);
	}
};
Sprite.prototype.update = function(){};

function Animation(src, length, loopFrame, callback){
	this.width = 0;
	this.height = 0;
	this.length = length;
	this.currentFrame = 0;
	this.isPlaying = true;
	this.loaded = false;
	this.loopFrame = loopFrame||0;
	if(src){
		this.image = new Image();
		var t = this;
		this.image.onload = function(){
			t.loaded = true;
			t.width = t.image.width/t.length;
			t.height = t.image.height;
			if(callback) callback(t);
		};
		this.image.src = src;
	}
}

Animation.paused = false;

Animation.prototype.clone = function(){
	var a = new Animation();
	a.image = this.image;
	a.width = this.width;
	a.height = this.height;
	a.length = this.length;
	a.loaded = true;
	a.loopFrame = this.loopFrame;
	return a;
};
Animation.prototype.play = function(){ this.isPlaying = true; };
Animation.prototype.stop = function(){ this.isPlaying = false; };
Animation.prototype.reset = function(){ this.isPlaying = true; this.currentFrame = 0; };
Animation.prototype.draw = function(gfx,x,y){
	if(this.loaded){
		gfx.drawImage(this.image, this.width*this.currentFrame, 0, this.width, this.height, x, y, this.width, this.height);
	}
};
Animation.prototype.update = function(){
	if(!Animation.paused && this.isPlaying && ++this.currentFrame >= this.length){
		this.currentFrame = this.loopFrame;
	}
};

function SpriteLoader(sprites, callback){
	var numLoaded = 0;
	
	var loaded = function(sprite){
		if(++numLoaded == sprites.length) callback();
	};

	for(var i = 0; i < sprites.length; i++){
		var current = sprites[i];
		var name = current.name;
		var src = current.src;
		if(!current.type || current.type == "sprite"){
			this[name] = new Sprite(src, loaded);
		} else {
			this[name] = new Animation(src, current.length, current.loop, loaded);
		}
	}
}