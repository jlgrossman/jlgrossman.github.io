// menus
function HUD(x, y){
	this.x = x;
	this.y = y;
	this.healthMeter = new Meter(this.x+5,this.y+5, "HP", Color.red);
}

HUD.prototype.update = function(){
	this.healthMeter.value = Game.player.hp/Game.player.maxHp;
	this.healthMeter.update();
};

HUD.prototype.draw = function(gfx){
	gfx.fillStyle = Color.darkGrey;
	gfx.fillRect(this.x, this.y, Game.width, 20);
	this.healthMeter.draw(gfx);
};

function Meter(x, y, name, color, bgColor, width, height){
	this.x = x;
	this.y = y;
	this.name = name;
	this.color = color;
	this.bgColor = bgColor||Color.grey;
	this.width = width||100;
	this.height = height||10;
	this.value = 1;
	this.currentValue = 1;
}

Meter.prototype.update = function(){
	if(this.value > 1) this.value = 1;
	else if(this.value < 0) this.value = 0;
	this.currentValue += (this.value - this.currentValue)/5;
};

Meter.prototype.draw = function(gfx){
	var barW = this.currentValue * this.width;
	var bgW = this.width - barW;
	gfx.fillStyle = this.color;
	gfx.fillRect(this.x, this.y, barW, this.height);
	gfx.fillStyle = this.bgColor;
	gfx.fillRect(this.x + barW, this.y, bgW, this.height);
	gfx.fillStyle = Color.white;
	gfx.fillText(this.name, this.x, this.y+this.height);
};