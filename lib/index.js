var exec = require('child_process').exec;

var GhostScript = function(){
	this.arguments = [__dirname + '/../bin/gs'];
	return this;
}

GhostScript.prototype.add = function(value){
	this.arguments.push(value);
	
	return this;
}

/*****************************************************
	-c token ... 
	-c string ...

	Interprets arguments as PostScript code up to the next argument that begins with "-" followed by a non-digit, 
	or with "@". For example, if the file quit.ps contains just the word "quit", then -c quit on the command line 
	is equivalent to quit.ps there. Each argument must be valid PostScript, either individual tokens as defined 
	by the token operator, or a string containing valid PostScript.
	
*****************************************************/
GhostScript.prototype.c = function(value){
	this.arguments.push('-c', value);

	return this;
}

GhostScript.prototype.dBATCH = function(value){
	this.arguments.push('-dBATCH');

	return this;
}

GhostScript.prototype.dFirstPage = function(value){
	this.arguments.push('-dFirstPage=' + value);
	
	return this;
}

GhostScript.prototype.dJPEGQ = function(value){
	this.arguments.push('-dJPEGQ=' + value);

	return this;
}

GhostScript.prototype.dLastPage = function(value){
	this.arguments.push('-dLastPage=' + value);
	
	return this;
}

GhostScript.prototype.dNODISPLAY = function(){
	this.arguments.push('-dNODISPLAY');

	return this;
}

GhostScript.prototype.dNOPAUSE = function(){
	this.arguments.push('-dNOPAUSE');

	return this;
}

GhostScript.prototype.sDEVICE = function(value){
	this.arguments.push('-sDEVICE=' + value);

	return this;
}

GhostScript.prototype.sOutputFile = function(value){
	this.arguments.push('-sOutputFile=' + value);

	return this;
}

/*****************************************************
	
	Quiet startup: suppress normal startup messages, and also do the equivalent of -dQUIET.

	*****************************************************/
GhostScript.prototype.q = function(){
	this.arguments.push('-q');

	return this;
}

/*****************************************************
	-rnumber (same as -rnumberxnumber) 
	-rnumber1xnumber2

	Equivalent to -dDEVICEXRESOLUTION=number1 and -dDEVICEYRESOLUTION=number2, specifying the device horizontal and 
	vertical resolution in pixels per inch for the benefit of devices such as printers that support multiple X and Y 
	resolutions.
	
*****************************************************/
GhostScript.prototype.r = function(value){
	this.arguments.push('-r' + value);

	return this;
}


GhostScript.prototype.version = function(callback) {
	this.add('--version');
	if (typeof callback !== 'function') return this;
	
	this.exec(function(err, stdout, stderr){
		callback(err, escape(stdout).split("%0A")[0]);
	});
}

GhostScript.prototype.exec = function(callback){
	if (arguments.length > 1) {
		this.arguments.push(Array.isArray(arguments[0]) ? arguments[0].join(' ') : arguments[0]);
		callback = arguments[1];
	}

	exec(this.arguments.join(' '), callback);
}

module.exports = GhostScript;
