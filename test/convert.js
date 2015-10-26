var GhostScript = require('..'),
	http = require('http'),
	fs = require('fs'),
	should = require('should');

var pdf_link = __dirname + '/testFiles/Test.pdf';
var tmpDir = __dirname + '/tmp';
var testFile = tmpDir + '/test.pdf';

before(function(done){
	deleteTmpDir(function(){
		fs.mkdir(tmpDir, function(){
			fs.symlink(pdf_link, testFile, done);
		});
	});
})	

describe("convert pdf to jpeg", function() {
	
	it('should convert pdf to 400 dpi jpegs', function(done) {
		var target = testFile.split('/').pop();
		var targetName = target.replace(/\.pdf$/, "");
		
		new GhostScript()
		.dNOPAUSE()
		.sDEVICE('jpeg')
		.sOutputFile(tmpDir + '/' + targetName + '_%04d_tmp.jpg')
		.dJPEGQ(100)
		.r(400)
		.q()
		.add(testFile)
		.c('quit')
		.exec(function(err){
			(err === null).should.be.true;
			var files = fs.readdirSync(tmpDir).filter(function(file){
				return target !== file;
			});
			files.should.be.an.Array.with.lengthOf(1);
			files[0].should.equal(targetName + '_0001_tmp.jpg');
			done();
		});
	});
});


after(function(done){
	deleteTmpDir(done)
})


function deleteTmpDir(done) {
	if (!fs.existsSync(tmpDir)) return done();
	fs.readdirSync(tmpDir).forEach(function(file){
		fs.unlinkSync(tmpDir + '/' + file)
	});
	fs.rmdir(tmpDir, done);	
}
