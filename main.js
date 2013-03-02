var GooglePlusAPI = require('./vendor/gplusapi')
, fs = require('fs')
, https = require('https');	 
var plus = null;
//hide API key in .gplusapi
//get one via:
//https://code.google.com/apis/console/
fs.readFile( './.gplusapi', function ( err, data ) {
	if ( err ) {
		throw err;
	}
	var key = data.toString();
	var path = '/plus/v1/activities?key=AIzaSyBaTMsCBdMDhaqhhc15eQzhpeGy5ydssXI&query=ifihadglass';
	//console.log( key );
	var request = https.request( {
		host: 'www.googleapis.com'
		, port: 443
		, path: path
	} ).on( 'response', function( response ) {
		var body = '';
		response.on( 'data', function( chunk ) {		
			body += chunk;
		} );	
		response.on( 'end', function( ) {		
			parseActivities( body.toString() );
		} );	
	 } );
	 request.end();
} );

function saveNextToken( token ) {
	fs.writeFile("./.gplustoken", token, function(err) {
		if( err ) {
			console.log( err );
		} else {
			console.log("Token saved");
		}
	});
}

function readNextToken( token, callback ) {
	fs.readFile("./.gplustoken", token, function( err, data ) {
		if( err ) {
			console.log( err );
			if ( 'function' is typeof callback ) {
				callback( null );
			}
		} else {
			//console.log( "Token", data );
			if ( 'function' is typeof callback ) {
				callback( data );
			}
		}
	});
}


function parseActivities( body ) {
	var response = JSON.parse( body );
	if ( 'undefined' !== typeof response.nextPageToken ) {
		saveNextToken( response.nextPageToken );
	}
	items = response.items;
	if ( 'undefined' !== typeof items ) {
		var x = 0, length = items.length, item;
		for ( ; x < length ; x += 1 ) {
			item = items[ x ];
			writeActivity( item );
		}
	}
}
function writeActivity( object ) {
	id = object.id;
	fs.writeFile("./data/google/" + id, JSON.stringify( object ), function(err) {
		if( err ) {
			console.log( err );
		} else {
			console.log("Activity written");
		}
	});
}
