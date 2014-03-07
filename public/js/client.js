var socket = io.connect('http://localhost:1337');

socket.on('connect', function () {
    // Boutton "Commencer la partie"
    $('#Boss1').on('click', function (e) {
        e.preventDefault();
        room.params.nomPartie = $("#Boss1").val();
        room.params.nbrJoueur = 5;
        room.params.nbrChanson = parseInt($("#reglages #amount2").val());
        room.afficherRoom();
        room.creerRoom();
    });

    // Initialisation de la partie ux du jeux
    room.init({
        // Initialisation des id de chaque bouton du jeux
        player: '#player',
        buzzer: '#buzzer',
        affichage: '#rooms',
        form: '#titleform',
        titre: '#title',
        listeAllJoueur: '#listeAllJoueur',
        listeJoueur: '#listeJoueur',
        listeMusique: '#listeMusique',
        monScore: 'monScore',

        // Liste les rooms
        // vide la div conteneur
        // liste les rooms si elle ne sont pas null
        roomListed: function () {
            $(room.params.affichage).empty();
            for (i in room.rooms) {
                if (room.rooms[i] != null) {
                    $(room.params.affichage).append('<div class="boss"><div><a href="./?room=' + room.rooms[i].id + '" data-id="' + room.rooms[i].id + '" class="lol">' + room.rooms[i].nom + '</a></div></div>');
                }
            }
        },

        // Fait la list des players
        playerListed: function () {
            var html = "",
                tour = 0;
            var element = $(room.params.listeAllJoueur);
            if (typeof element != 'undefined' && element != null) {
                $(room.params.listeAllJoueur).empty();
                for (i in room.usernames) {
                    if (room.usernames[i] != null) {
                        html += '<li class="online"><img class="borderWhite" src="images/avatar_example.png" alt="' + room.usernames[i].id + '" /><h3>' + room.usernames[i].user + '</h3><p>' + room.usernames[i].point + '</p></li>';
                        if (room.usernames[i].room == room.room) {
                            tour++;
                        }
                    }
                }

                var diff = 4 - tour;
                for (var i = 0; i < diff; i++) {
                    html += '<li class="online"><img class="borderWhite" src="images/avatar_example.png" /><h3>Offline</h3><p>0</p></li>';
                }

                $(room.params.listeAllJoueur).html(html);

            }

            element = $(room.params.listeJoueur);
            if (typeof element != 'undefined' && element != null) {
                $(room.params.listeJoueur).empty();
                for (j in room.usernames) {
                    if (room.usernames[j] != null) {
                        if (room.usernames[j].room == room.room && j != room.monId) {
                            $(room.params.listeJoueur).append('Nom : ' + room.usernames[j].user + ' Point : ' + room.usernames[j].point + '<br>');
                        }
                        if (j == room.monId) {
                            var points = room.usernames[j].point;
                            var idScore = '#' + room.params.monScore;
                            setTimeout(function () {
                                $(idScore).hide().html(points).fadeIn();
                            }, 1000);
                        }
                    }
                }
            }
        },


        


    });
// Detection d'url pour rejoindre une room
  if (typeof window.location.search != '' && window.location.search != ''){
    var getRoom = window.location.search.split('=');
    getRoom[1] = parseInt(getRoom[1]);

    if(!isNaN(getRoom[1]) && getRoom[1]!=''){
      room.rejoindreRoom(getRoom[1]);
      
    }
  }else{
    //alert("pas d'url");
    
  }
  


    // Afficher les rooms existantes
    // active la fonction de l'obj room qui liste les rooms
    socket.on('afficherLesRoomsExistante', function (rooms) {
        room.listeRoom(rooms);
    });

    // L'ulisateur a créer une room
    // active la fonction de l'obj room qui prépare l'affichage de l'espace de jeux
    socket.on('roomAjoute', function (data) {
        room.roomAjoute(data);
    });

    // L'ulisateur a rejoin une room
    // active la fonction de l'obj room qui prépare l'affichage du buzzer(Affichage timer?)
    socket.on('roomRejoin', function () {
        room.roomRejoint();
    });

    // Affichage des joueur de la partie (ARRAY, INT, INT)
    // mise en memoir des infos joueurs
    // active la fonction de l'obj room qui affiche les joueurs
    socket.on('afficherJoueur', function (usernames, rooms, monId) {
        room.usernames = usernames;
        room.room = rooms;
        room.monId = monId;
        room.afficherJoueur();
    })


    socket.on('fin', function () {
        room.roomFin();
    }),
    // Refresh des score
    // demande au server d'envoyer à l'utilisateur les infos joueurs de la room
    socket.on('refreshScrore', function () {
        socket.emit('refreshScrore');
    });


    // Detection de fin ou suppression de partie
    // redirige vers la page d'accueil
    socket.on('accueilLocation', function () {
        $('#accueil').show();
    $('#fightBoss').hide();
    console.log('test222222');
    });

});

(function($){

  var life;


  $("#rooms").on('click', 'a.lol', function(e){
    e.preventDefault();
    var id = $(this).data("id");
    room.rejoindreRoom(id);
      console.log(room.rooms[id]);
    return false;
  })
    
       $('.shot').on('click',function(e){
                e.preventDefault();
                var titleAtk=$(this).attr("id");
                console.log(titleAtk);
                socket.emit("Atk", titleAtk);
        });
    
    
    socket.on('hello',function(pv){
                $('#pv').html(pv);
        });
    socket.on('newLife',function(pv){
                $('#pv').html(pv);
        });
    socket.on('ended',function(message){
                this.disconnect();
        });
        
    socket.on('newLog',function(username){
                $("#logins").html("New login of " + username);
        });

        socket.emit('login', {
          username : $('#username').text(),
          level : $('#level').text()
        });
})(jQuery);
