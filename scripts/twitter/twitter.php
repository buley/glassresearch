<?php
include_once( './../gender.php' );
$root = implode( "/", array_slice( explode( "/", dirname( __FILE__ ) ), 0, -2 ) );
$dir = $root . "/data/twitter";
$files = scandir( $dir );
$names = array();
$genders = array( 'male' => 0, 'female' => 0, 'all' => 0, 'gendered' => 0, 'ungendered' => 0 );
$counts = array();
foreach ( $files as $file ) {
	if ( '.' !== $file && '..' !== $file ) {
		$file = "$dir/{$file}";
		$contents = file_get_contents( $file );
		$obj = json_decode( $contents );
		$name = array_pop( array_slice( explode( ' ', $obj->from_user_name ), 0, 1 ) );
		//throw away empty lines
		if ( true === empty( $name ) || null == $name ) {
			continue;
		}
		$names[ $name ] = ( isset( $names[ $name ] ) ) ? $names[ $name ] + 1 : 1; 
		$value = gender( $name );
		if ( empty ( $value ) ) {
		}
		$genders[ $name ] = $value;
		$counts[ 'all' ] = $counts[ 'all' ] + 1;
		if ( 0 !== strpos( $value, "likely" ) ) {
			$counts[ $value ] = $counts[ $value ] + 1;
			$counts[ 'gendered' ] = $counts[ 'gendered' ] + 1;
		} else {
			if ( 'amibguous' === $value ) { 
				$counts[ 'ungendered' ] = $counts[ 'ungendered' ] + 1;
			} else {
				$counts[ 'uncertain' ] = $counts[ 'uncertain' ] + 1;
			}
		}
	}
}
/*
arsort( $names );
$top = array_slice( $names, 0, 1000 );
foreach ( $top as $name => $count ) {
	echo "$name $count\n";
}*/
var_dump( $counts );

?>
