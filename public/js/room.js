var room = {

  // Définition des variables et callback de l'obj room
  defaults : {
    player : '',
    pvboss : '',
    titre : '',

    played : function () {},
    roomAdded : function () {},
    roomListed : function () {},
    playerListed : function () {}
  },

  // Merge des infos rempli côté utilisateur et obj
  init : function (options) {
    this.params = $.extend(this.defaults, options);
  },
	
	
  // L'utilisateur à bien rejoin une room
  // active le callback pour kill l'accueil
  roomAjoute : function (data) {
    this.params.roomAdded.call(this);
    // Envoi le mail
    var idRoom = data.idRoom;
    var strWindowFeatures = "toolbar=no,resize=no,titlebar=no,";
    strWindowFeatures = strWindowFeatures + "menubar=no,width=200,height=200,maximize=null";
    window.open('http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl=http://buzzik.local:1337/join?room='+idRoom, '', strWindowFeatures); 
  },
  
  // Liste des rooms (ARRAY)
  // mise en mémoire des rooms
  // active le callback pour lister les rooms
  listeRoom : function (rooms) {
    this.rooms = rooms;
    this.params.roomListed.call(this);
  },

  // Connection à une room (INT)
  // appelle la fonction pour se connecter à la room
  rejoindreRoom : function (room){
    socket.emit('rejoindreRoom', room, 'lol');
  },


  // Affichage des joueurs
  // active le callback d'affichage des joueurs
  afficherJoueur : function () {
    this.params.playerListed.call(this);
  },

  afficherRoom : function() {
    $('#accueil').hide();
    $('#fightBoss').show();
    console.log('test');
  },

  roomRejoint : function () {
     $('#accueil').hide();
    $('#fightBoss').show();
    console.log('test');
  },

   
   roomFin : function() {
    $('#accueil').show();
    $('#fightBoss').hide();
    console.log('test222222');
  },
  // Création d'une room
  creerRoom : function () {
    $("#Boss").fadeOut().hide();

    /***************************************/

    // Envoie au server des info de la partie pour qu'il crée la room
    socket.emit('ajouterRoom', room.params.nomPartie, room.params.nbrJoueur, room.params.nbrChanson);
	
    /***************************************/

   
  }

}