/*************** SOCKET.IO & NODE VARS ****************/

var http    =   require('http'),
    fs      =   require('fs'),
    path    =   require('path'),
    io      =   require('socket.io');

var pv = 50;

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
}).listen(1337);

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

// fonction timer
var timerSong;

var pv = 50;

// liste des utilisateur et rooms
var usernames = new Array();
var rooms = new Array();

//Points de vie des boss associés aux instances crées
var boss = new Array ();

// info musique
var numTrack;
var listMusiqueUrl = "";
var listMusiqueTitle = "";
var listMusiqueArtist = "";
var listMusiqueCover = "";

// compteur
var numRoom = 1;
var numUser = 1;

io.sockets.on('connection', function (socket) {
  
  //console.log(socket);
  socket.on('login',function(user){
  	//console.log(user);
  	usernames.push(user.username);
  	socket.broadcast.emit('newLog',user.username);
  })
  
    // Ajout à la room 'accueil' et affichage des rooms existante
    socket.join('accueil');
    socket.emit('afficherLesRoomsExistante', rooms);

    // Création de la room (STRING, INT, INT)
    socket.on('ajouterRoom', function (nomPartie, nbrJoueur, nbrChanson){
        console.log('/////////////////////////////////');
        console.log('///// Une partie à été crée /////');
        console.log('/////////////////////////////////');
        var newRoom = {id: numRoom, nom: nomPartie, nbrJoueur: nbrJoueur, pvBoss: 99, listeMusique: [], play: false, buzz: true};
        socket.room = numRoom;
        socket.numRoom = numRoom;
        rooms[socket.numRoom] = newRoom;
        socket.emit('hello', rooms[socket.numRoom].pvBoss);
        
        socket.join(socket.room);

        /* Envoi des emails aux personnes */
        socket.emit('roomAjoute', { idRoom : socket.numRoom});
        socket.broadcast.to('accueil').emit('afficherLesRoomsExistante', rooms);
        numRoom++;
    });

    // Rejoindre une room (INT, STRING)
    socket.on('rejoindreRoom', function(room, nom){
        if (rooms[room] != null) {
            var nbrPlayerPartie = 0;
            for (k in usernames) {
                    if (usernames[k].room == rooms[room].id) {
                            nbrPlayerPartie++;
                    }
            }
            if (nbrPlayerPartie < rooms[room].nbrJoueur) {
                socket.join(room);
                socket.room = room;
                socket.numUser = numUser;

                usernames[socket.numUser] = {
                    id : numUser,
                    user : nom,
                    point : 0,
                    room : rooms[room].id
                };
                socket.emit('roomRejoin');
                console.log(rooms[socket.numRoom].pvBoss);
                socket.emit('newLife', rooms[socket.numRoom].pvBoss);
                
                socket.broadcast.to(socket.room).emit('refreshScrore');
                numUser++;
            }else{
                    socket.emit('message', 'La partie est pleine');
                    socket.emit('accueilLocation');
            }
        }else{
                socket.emit('message', 'cette room n\'existe pas');
                socket.emit('accueilLocation');
        }
    });

  socket.on("hit", function(){
  	  if(rooms[socket.numRoom].pvBoss <= 0)
  	{
  		
      io.sockets.emit('ended',200);
  	}
  	{
      console.log(rooms[socket.numRoom].pvBoss);
  	  rooms[socket.numRoom].pvBoss--;
  	}
  	  
      io.sockets.to(socket.room).emit('newLife', rooms[socket.numRoom].pvBoss);
  });
  socket.on("hit2", function(){
      if( rooms[socket.numRoom].pvBoss <= 0)
    {
      
      io.sockets.emit('ended',200);
    }
    {
      rooms[socket.numRoom].pvBoss = rooms[socket.numRoom].pvBoss - 2;
    }
      
      
     io.sockets.to(socket.room).emit('newLife', rooms[socket.numRoom].pvBoss);
  });
  socket.on("hit3", function(){
      if(rooms[socket.numRoom].pvBoss <= 0)
    {
      io.sockets.emit('ended',200);
    }
      else
        if(rooms[socket.numRoom].pvBoss == 20)
    {
      rooms[socket.numRoom].pvBoss = rooms[socket.numRoom].pvBoss - 20;
    }
      
      
      io.sockets.to(socket.room).emit('newLife', rooms[socket.numRoom].pvBoss);
  });
  socket.on("hit4", function(){
      if(rooms[socket.numRoom].pvBoss <= 0)
    {
      io.sockets.emit('ended',200);
    }
    {
     rooms[socket.numRoom].pvBoss = rooms[socket.numRoom].pvBoss - 50;
    }
      
      
      io.sockets.to(socket.room).emit('newLife', rooms[socket.numRoom].pvBoss);
  });


});

/*
function pop (){

	console.log('fin');
}*/