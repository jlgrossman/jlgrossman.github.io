/* RAVEBOX STUFF */
function raveOut(brightness){
	var c = 255;
	if(brightness)
		c = 100 + brightness * 155;
	return "rgb("+Math.round(Math.random()*c)+","+Math.round(Math.random()*c)+","+Math.round(Math.random()*c)+")";
}

/* ISOMETRIC STUFF ***************************************************************/
function IsometricPlane(center3d, tl, tr, br, bl){
	this.tl = tl;
	this.tr = tr;
	this.bl = bl;
	this.br = br;
	
	this.index = (center3d.x + center3d.y); // the smaller the index the closer it is to the camera
	
	var idx = 230-(this.index)*0.3;
	
	this.draw = function(svg){
		svg.polyline(this.tl.x, this.tl.y, this.tr.x, this.tr.y, this.br.x, this.br.y, this.bl.x, this.bl.y, this.tl.x, this.tl.y).attr({
			//fill:"rgb("+idx+","+idx+","+idx+")",
			fill:raveOut(),
			stroke:raveOut()
		});
	}
}

IsometricPlane.compare = function(plane1, plane2){
	return plane2.index - plane1.index;
}

function IsometricCanvas(canvas, width, height, depth, angle){
	this.canvas = canvas;	// svg object
	
	this.buffer = [];
	
	var canvasWidth = parseInt(canvas.attr("width"));
	var canvasHeight = parseInt(canvas.attr("height"));
		
	this.width = width;
	this.height = height;
	this.depth = depth;
	
	this.angle = angle; // camera angle ratio
	this.rotation = 0;
	
	var origin = {x:canvasWidth/2, y:canvasHeight/2};
	
	this.create2DPoint = function(x,y,z){
		var c = Math.cos(this.rotation);
		var s = Math.sin(this.rotation);
		var slope = {
			x:{x:-1*s,y:-this.angle*c},
			y:{x:1*c, y:-this.angle*s},
			z:{x:0, y:-1*Math.abs(Math.cos(this.angle*Math.PI/2))}
		};
		var dx = (slope.x.x * x) + (slope.y.x * y) + (slope.z.x) * z;
		var dy = (slope.x.y * x) + (slope.y.y * y) + (slope.z.y) * z;
		var x = origin.x + dx;
		var y = origin.y + dy;
		return {x:x,y:y};
	};
	
	this.line2D = function(p0, p1){
		this.canvas.line(p0.x,p0.y,p1.x,p1.y).attr({
			stroke:raveOut(),
			strokeWidth:3
		});
		return p1;
	};
	
	this.line = function(p0, p1){
		var p0_2d = this.create2DPoint(p0.x,p0.y,p0.z);
		var p1_2d = this.create2DPoint(p1.x,p1.y,p1.z);
		this.canvas.line(p0_2d.x, p0_2d.y, p1_2d.x,p1_2d.y).attr({
			stroke:raveOut(),
			strokeWidth:3
		});
		return p1_2d;
	};
	
	this.rect = function(center, width, height){
		var hw = width/2;
		var hh = height/2;
		var tl = {x:center.x - hw, y:center.y - hh, z:center.z};
		var tr = {x:center.x + hw, y:center.y - hh, z:center.z};
		var bl = {x:center.x - hw, y:center.y + hh, z:center.z};
		var br = {x:center.x + hw, y:center.y + hh, z:center.z};
		var tl_2d = this.line(bl,tl);
		var tr_2d = this.line(tl,tr);
		var br_2d = this.line(tr,br);
		var bl_2d = this.line(br,bl);
		
		return {tl:tl_2d, tr:tr_2d, bl:bl_2d, br:br_2d};
	};
	
	this.draw = function(clear){
		if(clear) this.canvas.clear();
		/*var l = this.create2DPoint(this.width,0,0);
		var t = this.create2DPoint(this.width,this.height,0);
		var r = this.create2DPoint(0,this.height,0);
		var z = this.depth*(Math.cos(this.angle*Math.PI/2));
		this.canvas.line(origin.x, origin.y, l.x,l.y).attr({
			stroke:"#f00",
			strokeWidth:3
		});
		this.canvas.line(r.x, r.y, origin.x,origin.y).attr({
			stroke:"#00f",
			strokeWidth:3
		});
		this.canvas.line(origin.x,origin.y,origin.x, origin.y-z).attr({
			stroke:"#0f0",
			strokeWidth:3
		});*/
	};
	
	this.clear = function(){
		this.canvas.clear();
	}
}


/* TRAY STUFF ********************************************************************/
function Compartment(x, y, width, height, bottomWidth, bottomHeight, depth){
	this.id = null;
	this.tray = null;
	this.x = x;	// center x
	this.y = y; // center y
	this.width = width;
	this.height = height;
	this.bottomWidth = bottomWidth;
	this.bottomHeight = bottomHeight;
	this.depth = depth;
	this.isCompartment = true;
	
	this.checkCollision = function(that){	
		var dx = this.x - that.x;
		var dy = this.y - that.y;
		var adx = Math.abs(dx);
		var ady = Math.abs(dy);
		var half_width1 = this.width/2;
		var half_height1 = this.height/2;
		var half_width2 = that.width/2;
		var half_height2 = that.height/2;
		var min_dx = half_width1 + half_width2;
		var min_dy = half_height1 + half_height2;
		
		if(adx < min_dx && ady < min_dy){ // collision
			var avx = (min_dx - adx);
			var avy = (min_dy - ady);
			// correct in whichever dimension has less overlap
			if(avx < avy){
				var vx = avx * (dx/adx);
				that.width -= avx;
				that.bottomWidth -= avx;
				that.x -= vx/2;
			} else {
				var vy = avy * (dy/ady);
				that.height -= avy;
				that.bottomHeight -= avy;
				that.y -= vy/2;
			}
		}
			
	};
	
	this.draw = function(svg){
		if(this.isVisible()){
			var left = this.x - this.width/2;
			var top = this.y - this.height/2;
			svg.rect(left,top,this.width,this.height).attr({
				fill:"#CCC",
				stroke:"#333",
				strokeWidth:1
			});
			svg.line(this.x-1, this.y-1, this.x+1,this.y+1).attr({
				stroke:"#333",
				strokeWidth:3
			});
			svg.line(this.x-1, this.y+1, this.x+1,this.y-1).attr({
				stroke:"#333",
				strokeWidth:3
			});
		}
	};
	
	this.draw3D = function(iso){
		if(this.isVisible()){
			var cos = Math.cos(iso.rotation);
			var sin = Math.sin(iso.rotation);
			var hw = cos*this.width/2;
			var hh = -sin*this.height/2;
			var rx = cos*this.x;
			var ry = -sin*this.y;
			var left = rx - hw;
			var right = rx + hw;
			var back = ry + hh;
			var front = ry - hh;
			var z = this.depth/2;
			/*var left = this.x - this.width/2;
			var top = this.y - this.height/2;
			var tl = {x:left,y:top,:z:this.depth);
			var br = {x:left+this.width,y:top+this.height,z:this.depth};*/
			var top = iso.rect({x:this.x, y:this.y, z:this.depth},this.width,this.height);		
			var bottom = iso.rect({x:this.x, y:this.y, z:0},this.bottomWidth,this.bottomHeight);
			iso.line2D(top.tl, bottom.tl);
			iso.line2D(top.tr, bottom.tr);
			iso.line2D(top.bl, bottom.bl);
			iso.line2D(top.br, bottom.br);
			var backFace = new IsometricPlane({x:rx,y:back,z:z},top.tl,top.tr,bottom.tr,bottom.tl);
			var frontFace = new IsometricPlane({x:rx,y:front,z:z},top.bl,top.br,bottom.br,bottom.bl);
			var rightFace= new IsometricPlane({x:right,y:ry,z:z},top.br,top.tr,bottom.tr,bottom.br);
			var leftFace = new IsometricPlane({x:left,y:ry,z:z},top.bl,top.tl,bottom.tl,bottom.bl);
			var bottomFace = new IsometricPlane({x:rx,y:ry,z:0},bottom.tl,bottom.tr,bottom.br,bottom.bl);
			return [backFace, frontFace, rightFace, leftFace, bottomFace];
		}
	};
	
	this.isVisible = function(){
		return (this.width > 0 && this.height > 0) && (this.bottomWidth > 0 && this.bottomHeight > 0);
	};
	
}

function Tray(width, height, depth){
	this.compartments = [];
	this.width = width;
	this.height = height;
	this.depth = depth;
	this.isTray = true;
	
	this.add = function(compartment){
		compartment.tray = this;
		compartment.id = (this.compartments.push(compartment) - 1);
	};
	
	this.remove = function(compartment){
		if(compartment.isCompartment){
			var id = compartment.id;
			compartment.tray = null;
			this.compartments.splice(id,1);
		} else {
			var compartment_obj = this.compartments[compartment];
			compartment_obj.tray = null;
			this.compartments.splice(compartment,1);
		}
	}
	
	this.checkCollisions = function(compartment){
		this.compartments.forEach(function(e){
			if(e.id != compartment.id)
				compartment.checkCollision(e);
		});
	};
	
	this.draw = function(svg){
		svg.clear();
		this.compartments.forEach(function(e){
			e.draw(svg);
		});
	};
	
	this.draw3D = function(iso){	
		iso.clear();	
		var buffer = [];
		this.compartments.forEach(function(e){
			var temp = e.draw3D(iso);
			for(var i = 0; i < temp.length; i++)
				buffer.push(temp[i]);
		});
		buffer.sort(IsometricPlane.compare);
		for(var i = 0; i < buffer.length; i++) buffer[i].draw(iso.canvas);
		iso.draw(false);
	};
}

/* JSON STUFF ************************************************************************/
function parseGeometry(json){
	console.log(json);
	return {
		top:{width:json.Top.Width, height:json.Top.Breadth},
		bottom:{width:json.Base.Width, height:json.Base.Breadth},
		depth:json.Height
	};
}

function parseJSON(json){
	var trayGeometry = parseGeometry(json);
	var compartments_json = json.CompartmentList.Compartment;
	var compartments = {};
	
	for(var i = 0; i < compartments_json.length; i++){
		var compartment_json = compartments_json[i];
		compartments[i] = parseGeometry(compartment_json);
	}
	
	var tray = new Tray(trayGeometry.top.width, trayGeometry.top.height, trayGeometry.depth);
	
	var x = 0;
	var y = 0;
	for(var i in compartments){
		var geometry = compartments[i];
		var compartment = new Compartment(x,y,geometry.top.width,geometry.top.height,geometry.bottom.width,geometry.bottom.height,geometry.depth);
		tray.add(compartment);
		x+=parseInt(compartment.width)+10;
	}
	
	return tray;
	
}

/* MAIN STUFF ***********************************************************************/
jQuery(function($){

	var s = Snap(800,600);
	
	//var c1 = new Compartment(200, 200, 100, 100, 70, 70, 100);
	//var c2 = new Compartment(320, 200, 100, 50, 60, 20, 30);
	//var tray = new Tray(400,400,10);
	//var c3 = new Compartment(-40,50,100,100,75,75,40);
	//var c4 = new Compartment(70,75, 50, 50, 35,35, 40);
	//tray.add(c3);
	//tray.add(c4);
	//tray.add(c1);
	//tray.add(c2);
	var tray = parseJSON(trayDimensions["16"]);
	//tray.add(new Compartment(0,0,300,400,250,350,20));
	var i = 0;
	var rv = 0;
	
	
	function loop(){
		/*c1.width++;
		tray.checkCollisions(c1);
		s.clear();
		console.log(tray.compartments);
		tray.draw(s);
		
		//iso.rotation+=0.004;
		//c1.x+=2;
		//tray.checkCollisions(c1);
		if(c4.width < 130){
			c4.width++;
			c4.bottomWidth++;
			c4.x-=0.5;
		}
		iso.draw();
		//iso.angle=Math.sin(i+=0.007)*0.2+0.3;
		tray.checkCollisions(c4);
		c3.draw3D(iso);
		c4.draw3D(iso);
		//c2.draw3D(iso);
		//c1.draw3D(iso);*/
		//if(mouseDown){
			//var dx = mouseX - 400;
			//var dy = mouseY - 300;
			rv += 0.0001;
			iso.rotation += rv;//(dx/400)*0.05;
			//iso.angle += (dy/300)*0.05;
			//if(iso.angle > 1) iso.angle = 1;
			//else if(iso.angle < -1) iso.angle = -1;
		//}
		tray.draw3D(iso);
		window.requestAnimationFrame(loop);
	}
	
	var iso = new IsometricCanvas(s,20,20,20,0.5);
	iso.rotation = Math.PI/3;
	//iso.draw();
	
	window.requestAnimationFrame(loop);
	
	var $body = $("body");
	
	var mouseDown = false;
	var mouseX = 0;
	var mouseY = 0;
	
	$body.on("mousedown",function(e){	
		mouseDown = true;
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
	
	$body.on("mouseup",function(e){
		mouseDown = false;
	});
	
	$body.on("mousemove",function(e){
		mouseX = e.pageX;
		mouseY = e.pageY;
	});
	
});