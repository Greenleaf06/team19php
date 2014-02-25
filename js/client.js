var socket = io.connect('http://localhost:1337');

socket.on('connect', function () {
	// Boutton "Commencer la partie"
  $('#Boss1').on('click', function(e){
    e.preventDefault();
    room.params.nomPartie = $("#reglages input[name=nomPartie]").val();
    room.params.nbrJoueur = parseInt($("#choisirNbrJoueur").data("nbrjoueur"));
    room.params.nbrChanson = parseInt($("#reglages #amount2").val());

    room.creerRoom();
  });

  // Initialisation de la partie ux du jeux
  room.init({
    // Initialisation des id de chaque bouton du jeux
    player : '#player',
    buzzer : '#buzzer',
    affichage : '#rooms',
    form : '#titleform',
    titre : '#title',
    listeAllJoueur: '#listeAllJoueur',
    listeJoueur : '#listeJoueur',
    listeMusique : '#listeMusique',
    monScore : 'monScore',

    // Liste les rooms
    // vide la div conteneur
    // liste les rooms si elle ne sont pas null
    roomListed : function () {
      $(room.params.affichage).empty();
      for (i in room.rooms) {
        if (room.rooms[i] != null) {
          $(room.params.affichage).append('<div><a href="./?room='+room.rooms[i].id+'">' + room.rooms[i].nom + '</a></div>');
        }
      }
    },

    // Fait la list des players
    playerListed : function () {
      var html = "", tour = 0;
      var element = $(room.params.listeAllJoueur);
      if (typeof element != 'undefined' && element != null) {
        $(room.params.listeAllJoueur).empty();
        for (i in room.usernames) {
          if (room.usernames[i] != null) {
              html += '<li class="online"><img class="borderWhite" src="images/avatar_example.png" alt="'+room.usernames[i].id+'" /><h3>'+room.usernames[i].user+'</h3><p>'+room.usernames[i].point+'</p></li>';
            if (room.usernames[i].room == room.room) {
              tour++;
            }  
          }
        }

        var diff = 4-tour;
        for(var i=0; i<diff; i++){
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
              $(room.params.listeJoueur).append('Nom : '+room.usernames[j].user+' Point : '+room.usernames[j].point+'<br>');
            }
            if (j == room.monId) {
              var points = room.usernames[j].point;
              var idScore = '#'+room.params.monScore;
              setTimeout(function(){
                 $(idScore).hide().html(points).fadeIn();
              }, 1000);
            }
          }
        }
      }
    },


    // Utilisateur bien connecter à la room
    roomAdded : function () {
      $('#accueil').remove();
    },


});


// Afficher un message
socket.on('message', function (message) {
  alert(message);
});

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



// Refresh des score
// demande au server d'envoyer à l'utilisateur les infos joueurs de la room
socket.on('refreshScrore', function () {
  socket.emit('refreshScrore');
});


// Detection de fin ou suppression de partie
// redirige vers la page d'accueil
socket.on('accueilLocation', function () {
  document.location.href="/"; 
});

});


