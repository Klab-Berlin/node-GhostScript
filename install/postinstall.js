var http = require('http'),
	fs = require('fs'),
	exec = require('child_process').exec,
	GhostScript = require('..');


var options = {
	host : "downloads.ghostscript.com",
	path : "/public/binaries/ghostscript-9.18-linux-x86_64.tgz"
};
var binDir = __dirname + '/../bin/',
	tmpFile = options.path.split('/').pop();

http.request(options, function(req){
	if(req.statusCode !== 200) throw new Error('uri incorrect');
	
	req.pipe(fs.createWriteStream(tmpFile))
	.on('finish', function(){
		fs.mkdir(binDir, function(err){
			if (err && err.code !== 'EEXIST') throw err;
			exec('tar -xzf ' + tmpFile + ' -C ' + binDir, function(){
				var dir = tmpFile.replace(/\.tgz$/, "");
				fs.readdir(binDir + dir, function(err, files){
					if (err) throw err;
					files = files.filter(function(file){
						return /gs\-\d+\-linux\_x86\_64/.test(file)
					});
					if (files.length !== 1) throw new Error('to many Files found');
					
					fs.symlink('./' + dir + '/' + files[0], binDir + 'gs', function(){
						fs.unlink(tmpFile, function(){
							new GhostScript()
							.version(function(err, version){
								if (err) throw err;
								if (!isNaN) throw new Error('undefined Version' +  version);
								console.log('installed GhostScript Version: ' + version);
							});
						});
					})
				});
			});
		});
	});
})
.end();

