
var socket = io.connect();

function addMessage( msg, pseudo ) {
	$( "#chatEntries" ).append( '<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>' );
};

function sentMessage() {
	if ( $( '#messageInput' ).val() != "" ) 
	{
		socket.emit( 'message', $( '#messageInput' ).val());
		addMessage( $( '#messageInput' ).val(), "Me", new Date().toISOString(), true );
		$( '#messageInput' ).val('');
	}
};

function setPseudo() {
	if ( $( "#pseudoInput" ).val() != "" ) {
		socket.emit( 'setPseudo', $( "#pseudoInput" ).val() );
		$( '#chatControls' ).show();
		$( '#pseudoInput' ).hide();
		$( '#pseudoSet' ).hide();
        localStorage["name"] = $( "#pseudoInput" ).val();
        console.log("Name in localStroage: " + localStorage["name"])
	}
};

// join room specified by URL
socket.on( "connect", function( data ) {
    socket.emit( "joinRoom", location.pathname.slice( 1 ) );
});

// add message to screen upon receiving it from server
socket.on( 'message', function( data ) {
	addMessage( data[ 'message' ], data[ 'pseudo' ] );
});


$( document ).ready( function() {
    if (localStorage.name) {
        $( "#pseudoInput" ).val(localStorage.name); 
        console.log($( "#pseudoInput" ).val());
        $( "#pseudoSet" ).click();
        console.log($( "#pseudoInput" ).val());
    };    

    // initialize fn - hide chat box until nickname is set, add events to buttons
    $( function() {
	    $( "#chatControls" ).hide();
        $( 'input' ).focus(); // focus on nickname input upon page load
	    $( "#pseudoSet" ).click( function() { 
            setPseudo(); 
            $( 'input' ).focus(); // focus on messge input after submitting nickname
        } );
	    $( "#submit" ).click( function() { 
            sentMessage(); 
            $( 'input' ).focus(); // focus on messge input after submitting message
        } );
    });

    // pressing enter sends message
    $( 'input' ).keydown( function( event ) {
        if ( event.keyCode == 13 ) {
            $( this ).next( 'button' ).click();
        };
    });

});

//localStorage test

