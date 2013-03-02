var fs = require('fs')
, https = require('https')
, lastId = null;
fs.exists || require( 'path' ).exists
var plus = null, key = null, secret;
var hashtag = "#ifihadglass";
var util = require('util'),
    twitter = require('twitter');
var twit = null;
//hide API key in .twitterapi
//get one via:
//https://code.twitter.com/apis/console/
fs.readFile( './.twitterapi', function ( err, data ) {
	if ( err ) {
		throw err;
	}
	var secrets = data.toString().split( ':' );
	consumer_key = secrets[ 0 ];
	consumer_secret = secrets[ 1 ];
	access_token = secrets[ 2 ];
	access_secret = secrets[ 3 ];
	twit = new twitter( {
		consumer_key: consumer_key,
		consumer_secret: consumer_secret,
		access_token_key: access_token,
		access_token_secret: access_secret
	} );
	start();
} );

function start( ) {
	readNextId( function( id ) {
		request( { id: id } );
	} );
}

function request( options ) {
	var nextId = options.id;
	var params = {
		count: 100
	};
	if ( null !== nextId && 'undefined' !== typeof nextId ) {
		params[ 'max_id' ] = nextId;
	}
	twit.search( '#ifihadglass', params, function(data) {
		console.log( "RESPONSE", data );
		parseTweets( data );
	});
}
function saveNextId( token ) {
	fs.writeFile("./.twittertoken", token, function(err) {
		if( err ) {
			console.log( err );
		} else {
			console.log("Id saved", token);
		}
	} );
}

function readNextId( callback ) {
	fs.readFile("./.twittertoken", function( err, data ) {
		if( err ) {
			console.log( "ERROR", err );
			if ( 'function' === typeof callback ) {
				callback( null );
			}
		} else {
			if ( 'function' === typeof callback ) {
				var token = data.toString();
				callback( token );
			}
		}
	} );
}


function parseTweets( response ) {
	//var response = JSON.parse( body )
	var items = response.results;
	var nextId = response.max_id_str;
	if ( 'undefined' !== typeof items ) {
		var x = 0, length = items.length, item;
		for ( ; x < length ; x += 1 ) {
			item = items[ x ];
			nextId = item.id_str;
			writeTweet( item );
		}
	}
	if ( 'undefined' !== typeof nextId && null !== nextId ) {
		saveNextId( nextId );
	}
	start();
}
function writeTweet( object ) {
	var id = object.id_str
	, filepath = './data/twitter/' + id;
	console.log('tweet', object );
	fs.exists( filepath, function ( exists ) {
		if ( false === exists ) {
			fs.writeFile( filepath, JSON.stringify( object ), function( err ) {
				if( err ) {
					console.log( err );
				} else {
					console.log("Tweet written", id);
				}
			} );
		} else {
			console.log( "Tweet exists", id );
		} 
	} );
}
