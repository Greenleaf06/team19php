/*************** SOCKET.IO & NODE VARS ****************/

var http    =   require('http'),
    fs      =   require('fs'),
    path    =   require('path'),
    io      =   require('socket.io');

var pv = 10;

var HTTP_OK = 200,
    HTTP_ERR_UNKNOWN = 500,
    HTTP_ERR_NOT_FOUND = 404;


var usernames = [];

/************** NODE SERVER ****************/
var app = http.createServer(function (req, res) {
    var filepath = (req.url == '/' ? "index.html" : req.url), fileext = path.extname(filepath); 

    fs.exists(filepath, function (f) {
        if (f) {
            fs.readFile(filepath, function (err, content) {
                if (err) {
                    res.writeHead(HTTP_ERR_UNKNOWN);
                    res.end();
                } else {
                    res.writeHead(HTTP_OK, contentType(fileext));
                    res.end(content);
                }
            });
        } else {
            res.writeHead(HTTP_ERR_NOT_FOUND);
            res.end();
        }
    });
}).listen(8080);

function contentType(ext) {
    var ct;

    switch (ext) {
    case '.html':
        ct = 'text/html';
        break;
    case '.css':
        ct = 'text/css';
        break;
    case '.js':
        ct = 'text/javascript';
        break;
    case '.png':
        ct = 'image/png';
        break;
    case '.jpg':
        ct = 'image/jpg';
        break;
    case '.svg':
        ct = 'image/svg+xml';
        break;
    case '.mp4':
        ct = 'video/mp4';
        break;
    case '.ogv':
        ct = 'video/ogv';
        break;
    case '.webm':
        ct = 'video/webm';
        break;
    default:
        ct = 'text/plain';
        break;
    }

    return {'Content-Type': ct};
}


/*************** SOCKET.IO ***************/
//IO listen to node app
io = io.listen(app);

io.sockets.on('connection', function (socket) {
  socket.emit('hello', pv);
  console.log(socket);
  socket.on('login',function(user){
  	console.log(user);
  	usernames.push(user.username);
  	socket.broadcast.emit('newLog',user.username);
  })
  
  socket.on("hit", function(){
  	  if(pv == 0)
  	{
  		io.sockets.emit('ended',200);
  	}
  	{
  	  pv--;
  	}
  	  
      
      io.sockets.emit('newLife', pv);
  });
});
/*
function pop (){

	console.log('fin');
}*/