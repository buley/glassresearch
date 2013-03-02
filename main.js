var GooglePlusAPI = require('./vendor/gplusapi')
, fs = require('fs')
, https = require('https')
, lastToken = null;
fs.exists || require( 'path' ).exists
var plus = null, key = null;
var hashtag = "#ifihadglass";
//hide API key in .gplusapi
//get one via:
//https://code.google.com/apis/console/
fs.readFile( './.gplusapi', function ( err, data ) {
	if ( err ) {
		throw err;
	}
	key = data;
	start();
} );

function start( ) {
	readNextToken( function( token ) {
		request( { token: token } );
	} );
}

function request( options ) {
	var nextToken = options.token;
	var path = '/plus/v1/activities?key=AIzaSyBaTMsCBdMDhaqhhc15eQzhpeGy5ydssXI';
	path += '&maxResults=20&query=' + encodeURIComponent( hashtag );
	if ( null !== nextToken ) {
		path += "&pageToken=" + nextToken;
	}
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
}
function saveNextToken( token ) {
	fs.writeFile("./.gplustoken", token, function(err) {
		if( err ) {
			console.log( err );
		} else {
			console.log("Token saved", token);
		}
	} );
}

function readNextToken( callback ) {
	fs.readFile("./.gplustoken", function( err, data ) {
		if( err ) {
			console.log( "ERROR", err );
			if ( 'function' === typeof callback ) {
				callback( null );
			}
		} else {
			if ( 'function' === typeof callback ) {
				var token = data.toString();
				console.log("Token read", token);
				callback( token );
			}
		}
	} );
}


function parseActivities( body ) {
	var response = JSON.parse( body )
	, nextToken = response.nextPageToken;
	if ( null === nextToken || '' === nextToken || nextToken === lastToken ) {
		throw new Error( "Finished" );
	}
	if ( 'undefined' !== typeof nextToken ) {
		saveNextToken( nextToken );
	}
	lastToken = nextToken;
	items = response.items;
	if ( 'undefined' !== typeof items ) {
		var x = 0, length = items.length, item;
		for ( ; x < length ; x += 1 ) {
			item = items[ x ];
			writeActivity( item );
		}
	}
	start();
}
function writeActivity( object ) {
	var id = object.id
	, filepath = './data/google/' + id;
	fs.exists( filepath, function ( exists ) {
		if ( false === exists ) {
			fs.writeFile( filepath, JSON.stringify( object ), function( err ) {
				if( err ) {
					console.log( err );
				} else {
					console.log("Activity written", id);
				}
			} );
		} else {
			console.log( "Activity exists", id );
		} 
	} );
}
