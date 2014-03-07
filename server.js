/*************** SOCKET.IO & NODE VARS ****************/

var http    =   require('http'),
    fs      =   require('fs'),
    path    =   require('path'),
    io      =   require('socket.io');


var HTTP_OK = 200,
    HTTP_ERR_UNKNOWN = 500,
    HTTP_ERR_NOT_FOUND = 404;


var usernames = [];

/************** NODE SERVER ****************/
var app = http.createServer(function (req, res) {
    var filepath = (req.url == '/' ? "app/views/home.html" : req.url), fileext = path.extname(filepath); 

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



/*************** SOCKET.IO ***************/
//IO listen to node app
io = io.listen(app);

// fonction timer
var timerSong;


// liste des utilisateur et rooms
var usernames = new Array();
var rooms = new Array();


// compteur
var numRoom = 1;
var numUser = 1;

io.sockets.on('connection', function (socket) {
  
  //console.log(socket);
  socket.on('login',function(user){
  	console.log(user);
    console.log("****************");
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
                console.log(rooms[socket.room].pvBoss);
                socket.emit('newLife', rooms[socket.room].pvBoss);
                socket.emit('roomRejoin');
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
    // Envoie des infos de partie
    // envoie des infos de la partie à l'urilisateur
    socket.on('refreshScrore', function () {
            socket.emit('afficherJoueur', usernames, socket.room, socket.numUser);
    });

    // Deconnection
    socket.on('disconnect', function () {
            if (socket.numUser != undefined) {
                    socket.join("accueil");
                    delete usernames[socket.numUser];
                    socket.numUser = undefined;
                    socket.broadcast.to(socket.room).emit('refreshScrore');
            }
            if (socket.numRoom != undefined) {
                console.log('/////////////////////////////////////');
                console.log('///// Une partie à été terminée /////');
                console.log('/////////////////////////////////////');
                    clearInterval(timerSong);
                    socket.join("accueil");
                    io.sockets.to(socket.room).emit('accueilLocation');
                    io.sockets.to('accueil').emit('afficherLesRoomsExistante', rooms);
                    delete rooms[socket.numRoom];
                    socket.numRoom = undefined
            }
    });


   socket.on("Atk", function(titleAtk){
  console.log(rooms[socket.room]);
      if(rooms[socket.room].pvBoss <= 0)
    {
      io.sockets.to(socket.room).emit('accueilLocation');
    
    }
    {
      switch(titleAtk)
      {
        case "hit" : rooms[socket.room].pvBoss--; break;
        case "hit2": rooms[socket.room].pvBoss = rooms[socket.room].pvBoss - 2; break;
        case "hit3": if(rooms[socket.room].pvBoss == 20)
                      {
                        rooms[socket.room].pvBoss = rooms[socket.room].pvBoss - 20;
                      };
                      break;
        case "hit4": rooms[socket.room].pvBoss = rooms[socket.room].pvBoss - 50; break;
      }
      
    }
    io.sockets.to(socket.room).emit('newLife', rooms[socket.room].pvBoss);
    socket.broadcast.to('accueil').emit('afficherLesRoomsExistante', rooms);

  });


});

/*
function pop (){

	console.log('fin');
}*/