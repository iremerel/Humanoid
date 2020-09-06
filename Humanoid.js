var gl;

var numVertices = 36;

//WHOLE BODY ANGLES

var thetax = 0.0;
var thetay = 0.0;
var thetaz = 0.0;

//BODY PARTS ANGLES

var headtheta = 0.0;
var LUA = 0.0;
var LLA = 0.0;
var LUL = 0.0;
var LLL = 0.0;
var RUA = 0.0;
var RLA = 0.0;
var RUL = 0.0;
var RLL = 0.0;

var scalex = 1.0;
var scaley = 1.0;
var scalez = 1.0;

var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

var modelViewMatrixLoc;
var modelViewMatrix = new Float32Array(16);
var projectionMatrixLoc;
var projectionMatrix;
var aspect;
var select_pro = 0.0;

var data = new Float32Array(144);
var zero =	[-0.1,	-0.1,	0.1,	1.0];	
var one =	[0.1,	-0.1,	0.1,	1.0];	
var two =	[0.1,	0.1,	0.1,	1.0];	
var three =	[-0.1,	0.1,	0.1,	1.0];	
var four =	[-0.1,	0.1,	-0.1,	1.0];
var five = 	[0.1,	0.1,	-0.1,	1.0];	
var six =	[0.1,	-0.1,	-0.1,	1.0];
var seven =	[-0.1,	-0.1,	-0.1,	1.0];

var normaldata = new Float32Array(108);

var colors = new Float32Array(144);
var black = [0.0, 0.0, 0.0, 1.0];  
var red = [1.0, 0.0, 0.0, 1.0];  
var yellow = [ 1.0, 1.0, 0.0, 1.0];  
var green = [0.0, 1.0, 0.0, 1.0]; 
var blue =   [0.0, 0.0, 1.0, 1.0]; 
var magenta = [1.0, 0.0, 1.0, 1.0]; 
var white = [1.0, 1.0, 1.0, 1.0];
var cyan = [0.0, 1.0, 1.0, 1.0];

function coloring() {
	index = 0;
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = red[j];
			index++;
		}
	}
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = yellow[j];
			index++;
		}
	}
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = green[j];
			index++;
		}
	}
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = blue[j];
			index++;
		}
	}
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = magenta[j];
			index++;
		}
	}
	for(var i = 0; i<6 ; i++) {
		for(var j = 0; j<4 ; j++) {
			colors[index] = cyan[j];
			index++;
		}
	}
}

function gather() {
	triangle(zero,one,two,three);
	triangle(three,two,five,four);
	triangle(two,one,six,five);
	triangle(six,one,zero,seven);
	triangle(four,five,six,seven);
	triangle(seven,zero,three,four);
}

var idx = 0;
var ndx = 0;

function scale(x,y,z) {
	var scalematrix = new Float32Array(16);
	scalematrix[0] = x;
	scalematrix[5] = y;
	scalematrix[10] = z;
	scalematrix[15] = 1.0;
	
	return scalematrix;
}

function translate(x,y,z) {
	var matrix = new Float32Array(16);
	matrix[0] = 1.0;
	matrix[3] = x;
	matrix[5] = 1.0;
	matrix[7] = y;
	matrix[10] = 1.0;
	matrix[11] = z;
	matrix[15] = 1.0;
	
	return matrix;
}

function mult_4x4(a,b) {
	var indx = 0;
	var result = new Float32Array(16);
	for(var i = 0; i<4 ; i++) {
		var x = a[0] * b[i];
		var y = a[1] * b[i+4];
		var z = a[2] * b[i+8];
		var w = a[3] * b[i+12];
		result[indx] = x+y+z+w;
		indx++;
	}
	for(var i = 0; i<4 ; i++) {
		var x = a[4] * b[i];
		var y = a[5] * b[i+4];
		var z = a[6] * b[i+8];
		var w = a[7] * b[i+12];
		result[indx] = x+y+z+w;
		indx++;
	}
	for(var i = 0; i<4 ; i++) {
		var x = a[8] * b[i];
		var y = a[9] * b[i+4];
		var z = a[10] * b[i+8];
		var w = a[11] * b[i+12];
		result[indx] = x+y+z+w;
		indx++;
	}
	for(var i = 0; i<4 ; i++) {
		var x = a[12] * b[i];
		var y = a[13] * b[i+4];
		var z = a[14] * b[i+8];
		var w = a[15] * b[i+12];
		result[indx] = x+y+z+w;
		indx++;
	}
	return result;
}

function mult_4x1(a,b) {
	var result = new Float32Array(4);
	
	result[0] = a[0]*b[0];
	result[1] = a[1]*b[1];
	result[2] = a[2]*b[2];
	result[3] = a[3]*b[3];
	
	return result;
}

function cross(u, v) {
    
	result = new Float32Array(3);

	result[0] = u[1]*v[2] - u[2]*v[1];
	result[1] = u[2]*v[0] - u[0]*v[2];
	result[2] = u[0]*v[1] - u[1]*v[0];

    return result;
}

function subtract(a,b) {
	var result = new Float32Array(4);
	
	result[0] = a[0]-b[0];
	result[1] = a[1]-b[1];
	result[2] = a[2]-b[2];
	result[3] = a[3]-b[3];
	
	return result;
}

function radians(degrees) {
	return degrees * Math.PI / 180.0;
}

function rotate(angle,axis) {
	var result = new Float32Array(16);
	
	var s = Math.sin(radians(angle));
	var c = Math.cos(radians(angle));
	//console.log(c);
	
	switch(axis) {
		case 'x' :
			result[0] = 1.0;
			result[5] = c;
			result[6] = -s;
			result[9] = s;
			result[10] = c;
			result[15] = 1.0;
			break;
		case 'y' :
			result[0] = c;
			result[2] = s;
			result[5] = 1;
			result[8] = -s;
			result[10] = c;
			result[15] = 1.0;
			break;
		case 'z' :
			result[0] = c;
			result[1] = -s;
			result[4] = s;
			result[5] = c;
			result[10] = 1.0;
			result[15] = 1.0;
			break;
	}
	return result;
}

function transpose(matrix) {
	var result = new Float32Array(16);
	var a = 0;
	
	for(i=0;i<13;i+=4) {
		result[a] = matrix[i];
		a++;
	}
	for(i=1;i<14;i+=4) {
		result[a] = matrix[i];
		a++;
	}
	for(i=2;i<15;i+=4) {
		result[a] = matrix[i];
		a++;
	}
	for(i=3;i<16;i+=4) {
		result[a] = matrix[i];
		a++;
	}
	return result;
}

function triangle(a,b,c,d) {
	
	for(var j = 0; j<4; j++)
	{
		data[idx] = a[j];
		idx++;
	}
	for(var j = 0; j<4; j++)
	{
		data[idx] = b[j];
		idx++;
	}
	for(var j = 0; j<4; j++)
	{
		data[idx] = c[j];
		idx++;
	}
	for(var j = 0; j<4; j++)
	{
		data[idx] = c[j];
		idx++;
	}
	for(var j = 0; j<4; j++)
	{
		data[idx] = d[j];
		idx++;
	}
	for(var j = 0; j<4; j++)
	{
		data[idx] = a[j];
		idx++;
	}
}

//scale ratios
				
var head_x = 2;
var head_y = 2;
var head_z = 1.5;
var torso_x = 3.5;
var torso_y = 3;
var torso_z = 2;
var arm_x = 0.5;
var arm_y = 1.8;
var arm_z = 0.5;
var leg_x = 1;
var leg_y = 1.8;
var leg_z = 1;
var u_arm_x = 0.8;
var u_arm_y = 1.8;
var u_arm_z = 0.8;
var u_leg_x = 1.3;
var u_leg_y = 1.8;
var u_leg_z = 1.3;

function ortho(left,right,bottom,topp,near,far) {
    var w = right - left;
    var h = topp - bottom;
    var d = far - near;

    var result = new Float32Array(16);
	result[0] = 2.0/w;
	result[5] = 2.0/h;
	result[10] = -2.0/d;
	result[15] = 1.0;
	result[3] = -(left+right)/w;
	result[7] = -(topp+bottom)/h;
	result[11] = -(near+far)/d;

    return result;
}

function perspective(fovy,aspect,near,far) {
    var f = 1.0 / Math.tan( radians(fovy) / 2 );
    var d = far - near;

    var result = new Float32Array(16);
	result[0] = f/aspect;
	result[5] = f;
	result[10] = -(near+far)/d;
	result[11] = -2.0*near*far/d;
	result[14] = -1.0;
	result[15] = 0.0;

    return result;
}

window.onload = function init(){
	
	var canvas = document.getElementById("gl-canvas");
	
	gl = canvas.getContext("webgl");
	if (!gl) { 
		alert("WebGL isn't available"); 
	}
	gather();
	coloring();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	aspect = canvas.width/canvas.height;

	var vertShdr;
	var fragShdr;

	var vertElem = document.getElementById("vertex-shader");
	
	if (!vertElem) {
		alert("Unable to load the vertex shader!");
		return -1;
	}
	
	else {
		vertShdr = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShdr, vertElem.text);
		gl.compileShader(vertShdr);
		
		if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
			alert("Vertex shader failed to compile!");
			return -1;
		}
	}

	var fragElem = document.getElementById("fragment-shader");
	if (!fragElem) {
		alert("Unable to load fragment shader!");
		return -1;
	}
	
	else {
		fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShdr, fragElem.text);
		gl.compileShader(fragShdr);
		
		if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
			alert("Fragment shader failed to compile!");
			return -1;
		}
	}
	
	var program = gl.createProgram();
	gl.attachShader(program, vertShdr);
	gl.attachShader(program, fragShdr);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Shader program failed to link!");
		return -1;
	}
	
	gl.enable(gl.DEPTH_TEST);

	gl.useProgram(program);

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	
	document.getElementById("rotate_x").onchange = function(event) {
        thetax = event.target.value;
		
    };
	
	document.getElementById("rotate_y").onchange = function(event) {
        thetay = event.target.value;
		
    };
	
	document.getElementById("rotate_z").onchange = function(event) {
        thetaz = event.target.value;
		
    };
	
	document.getElementById("scale_x").onchange = function(event) {
        scalex = event.target.value;
		
    };
	
	document.getElementById("scale_y").onchange = function(event) {
        scaley = event.target.value;
		
    };
	
	document.getElementById("scale_z").onchange = function(event) {
        scalez = event.target.value;
		
    };
	
	document.getElementById("t_x").onchange = function(event) {
        tx = event.target.value;
		
    };
	
	document.getElementById("t_y").onchange = function(event) {
        ty = event.target.value;
		//console.log(ty);
    };
	
	document.getElementById("t_z").onchange = function(event) {
        tz = event.target.value;
		
    };
	
	document.getElementById("head").onchange = function(event) {
        headtheta = event.target.value;
		//console.log(headtheta);
    };
	
	document.getElementById("leftUpperArm").onchange = function(event) {
        LUA = event.target.value;
		
    };
	
	document.getElementById("leftLowerArm").onchange = function(event) {
        LLA = event.target.value;
		//console.log(LLA);
    };
	
	document.getElementById("leftUpperLeg").onchange = function(event) {
        LUL = event.target.value;
		
    };
	
	document.getElementById("leftLowerLeg").onchange = function(event) {
        LLL = event.target.value;
	
    };
	
		
	document.getElementById("rightUpperArm").onchange = function(event) {
        RUA = event.target.value;
		
    };
	
	document.getElementById("rightLowerArm").onchange = function(event) {
        RLA = event.target.value;
		
    };
	
	document.getElementById("rightUpperLeg").onchange = function(event) {
        RUL = event.target.value;
		
    };
	
	document.getElementById("rightLowerLeg").onchange = function(event) {
        RLL = event.target.value;
	
    };
	
	window.addEventListener("keydown", function(event){
		var key = String.fromCharCode(event.keyCode);
		if(key == 'P') {
			if(select_pro==0.0)
				select_pro = 1.0;
			else
				select_pro = 0.0;
		}
	});
	
	canvas.addEventListener("mousedown", function(event){
        if(select_pro==0.0)
			select_pro = 1.0;
		else
			select_pro = 0.0;
		
		//console.log(select_pro);
    } );

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	
	setInterval(render, 50);
};

function torso() {
	var s = scale(torso_x,torso_y,torso_z);
	var instance = mult_4x4(translate(0,0,0),s);
	var x = mult_4x4(modelViewMatrix, instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function head() {
	var s = scale(head_x,head_y,head_z);
	var instance = mult_4x4(translate(0,0.1*(head_y+torso_y),0), s);
	var x = mult_4x4(modelViewMatrix,instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function upper_arm(a,b,c) {
	var s = scale(u_arm_x,arm_y,u_arm_z);
	var instance = mult_4x4(translate(a,b,c), s);
	var x = mult_4x4(modelViewMatrix,instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function lower_arm(a,b,c) {
	var s = scale(arm_x,arm_y,arm_z);
	var instance = mult_4x4(translate(a,b,c), s);
	var x = mult_4x4(modelViewMatrix,instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function upper_leg(a,b,c) {
	var s = scale(u_leg_x,leg_y,u_leg_z);
	var instance = mult_4x4(translate(a,b,c), s);
	var x = mult_4x4(modelViewMatrix,instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function lower_leg(a,b,c) {
	var s = scale(leg_x,leg_y,leg_z);
	var instance = mult_4x4(translate(a,b,c), s);
	var x = mult_4x4(modelViewMatrix,instance);
	x = transpose(x);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, x);
	gl.drawArrays(gl.TRIANGLES, 0, numVertices);
}

function system() {
	modelViewMatrix = translate(tx,ty,tz);
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(thetax, 'x'));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(thetay, 'y'));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(thetaz, 'z'));
	modelViewMatrix = mult_4x4(modelViewMatrix, scale(scalex,scaley,scalez));
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if(select_pro == 0.0) {
		projectionMatrix = ortho(-1.8, 1.8, -1, 1, -1, 1);
		gl.uniformMatrix4fv(projectionMatrixLoc,  false, transpose(projectionMatrix));
	}
	else if(select_pro == 1.0) {
		projectionMatrix = perspective(45,aspect,0.1,10.0);
		projectionMatrix = mult_4x4(projectionMatrix, translate(0,0,-2.5));
		//console.log(projectionMatrix);
		gl.uniformMatrix4fv(projectionMatrixLoc,  false, transpose(projectionMatrix));
	}
	
	system();
	
	torso();
	
	system();
	
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(headtheta, 'y'));
	
	head();
	
	system();
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,0.1,0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(LUA, 'x'));
	
	upper_arm(-(0.1*(torso_x+u_arm_x)),0.0,0.0); //LEFT UPPER ARM
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*u_arm_y),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(LLA, 'x'));

	lower_arm(-(0.1*(torso_x+arm_x)),-(0.1*u_arm_y),0); //LEFT LOWER ARM
	
	system();
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,0.1,0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(RUA, 'x'));
	
	upper_arm((0.1*(torso_x+u_arm_x)),0.0,0.0); //RIGHT UPPER ARM
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*u_arm_y),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(RLA, 'x'));

	lower_arm((0.1*(torso_x+arm_x)),-(0.1*u_arm_y),0); //RIGHT LOWER ARM
	
	system();
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*torso_y),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(LUL, 'x'));
	
	upper_leg(-(0.1*(torso_x-u_leg_x))+0.05,-(0.1*(u_leg_y)),0); //LEFT UPPER LEG
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*(u_leg_y + (0.5*torso_y))),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(LLL, 'x'));
	
	lower_leg(-(0.1*(0.5*torso_x))+0.01,-(0.1*u_leg_y)+0.05,0); //LEFT LOWER LEG
	
	system();
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*torso_y),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(RUL, 'x'));
	
	upper_leg((0.1*(torso_x-u_leg_x))-0.05,-(0.1*(u_leg_y)),0); //RIGHT UPPER LEG
	
	modelViewMatrix = mult_4x4(modelViewMatrix, translate(0,-(0.1*(u_leg_y + (0.5*torso_y))),0));
	modelViewMatrix = mult_4x4(modelViewMatrix, rotate(RLL, 'x'));
	
	lower_leg((0.1*(0.5*torso_x))-0.01,-(0.1*u_leg_y)+0.05,0); //RIGHT LOWER LEG
	
}