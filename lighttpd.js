var http = require('http'),
	url  = require('url'),
	path = require('path'),
	fs   = require('fs');

// node lightttpd.js [port [interface]]
var DOCROOT   = '.',
	PORT      = process.argv[2] || '8082',
	INTERFACE = process.argv[3] || '0.0.0.0';


prettify_json = function (json_string) {
  return json_string
          .replace('{"'   , '{\n  "')
          .replace('}'    , '\n}')
          .replace(/,"/g  , ',\n  "');
}

mimetype = function(filename) {
  var extension = path.extname(filename);
  switch (extension) {
    case '.html':
    case '.xhtml':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.txt':
      return 'text/plain';
    case '.pdf':
      return 'application/pdf';
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
      return 'image/' + extension.substring(1);
    case '.webm':
      return 'video/webm';
    default:
      return 'octet/stream';
  }
}

directoryListing = function(pathname) {
  var content = '\n<ul>\n';  
  var listing = fs.readdirSync(pathname);
  var dirs = [];
  var files = [];
  for (var i = 0; i < listing.length; i++) {
    var _path = path.join(pathname, listing[i]);
    try {
      if (fs.statSync(_path).isDirectory()) {
        dirs.push(_path);
      } else {
        files.push(_path);
      }
    } catch (e) {}
  }
  
  dirs = dirs.sort();
  for (var i = 0;i < dirs.length; i++) {
        content += '  <li><a href="/'+ encodeURI(dirs[i].replace(/\\/g, '/')) +'">[d] '+ path.basename(dirs[i]) +'</a></li>\n';
  }
  
  files = files.sort();
  for (var i = 0;i < files.length; i++) {
        content += '  <li><a href="/'+ encodeURI(files[i].replace(/\\/g, '/')) +'">[f] '+ path.basename(files[i]) +'</a></li>\n';
  }
  return content + '</ul>\n'
}

httpResponse = function (req, res, content, httpcode, mime) {
  res.writeHead(httpcode, {'Content-Type': mime});
  res.end(content);
}

htmlResponse = function (req, res, content, httpcode, mime, title) {
  mime		= mime || 'text/html';
  content	= '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n'
			+ '  <title>lightttpd.js' + title +'</title>\n'
			+ '</head>\n<body>'+ content +'</body>\n</html>\n';
  httpResponse(req, res, content, httpcode, mime);
}

http.createServer(function (req, res) {
  var content = '';
  var pathname = DOCROOT + decodeURI(req.url);
  if (fs.existsSync(pathname)) {
	if (fs.statSync(pathname).isDirectory() && fs.existsSync(pathname + '/index.html')) {
	  pathname = pathname + '/index.html';
	}
    if (fs.statSync(pathname).isDirectory()) {
      content = directoryListing(pathname);
      htmlResponse(req, res, content, 200, 'text/html', '');
    } else {
      httpResponse(req, res, fs.readFileSync(pathname), 200, mimetype(pathname));
    }
  } else {
    content = '<p>Error 404! &apos;'+ decodeURI(req.url) +'&apos; wasn&apos;t found.</p>';
    htmlResponse(req, res, content, 404, 'text/html', '');
  }
}).listen(PORT, INTERFACE);

console.log('Server running at: http://'+INTERFACE+':'+PORT+'/');
console.log('Shared directory:  ' + process.cwd());
