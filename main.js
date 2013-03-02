var GooglePlusAPI = require('./vendor/gplusapi')
, fs = require('fs')
, http = require( 'http' )
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
	//console.log( key );
	var request = https.request( {
		host: 'www.googleapis.com'
		, path: '/plus/v1/activities?key=' + key + '&query=%23ifihadglass'
		, method: 'GET'
	} ).on( 'response', function( response ) {
		var body = '';
		response.on( 'data', function( chunk ) {		
			body += chunk.toString();
		} );	
		response.on( 'close', function( ) {
			console.log( body );
		} );
	 } );
	 request.end();
} );
