
(function($){

	var life;
 		

        var socket = io.connect('http://localhost:8080');
        $('#hit').on('click',function(e){
                e.preventDefault();
                socket.emit('hit');
        });
 /*
        socket.on('hello',function(pv){
               	alert(pv);
        });

        socket.on('newLife',function(pv){
               	alert(pv);
        });
 		*/
 		
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