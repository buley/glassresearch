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
	//console.log( key );
	var request = https.request( {
		host: 'www.googleapis.com'
		, port: 443
		, method: 'GET'
		, path: '/plus/v1/activities?key=' + key + '
		//, path: '/plus/v1/activities?key=' + key + '&query=ifihadglass'
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
