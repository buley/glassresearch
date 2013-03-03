<?php
include_once( "../gender.php" );
include_once( "../words.php" );
$root = implode( "/", array_slice( explode( "/", dirname( __FILE__ ) ), 0, -2 ) );
$dir = $root . "/data/google";
$files = scandir( $dir );
$names = array();
$genders = array( 'male' => 0, 'female' => 0, 'all' => 0, 'gendered' => 0, 'ungendered' => 0 );
$counts = array();
$words = array();
$ngrams = array();
foreach ( $files as $file ) {
	if ( '.' !== $file && '..' !== $file ) {
		$file = "$dir/{$file}";
		$contents = file_get_contents( $file );
		$obj = json_decode( $contents );
		$parts = preg_split('/([\s\n\r]+)/', preg_replace('/[\W]+/', ' ', strip_tags( $obj->object->content ) ), null, PREG_SPLIT_DELIM_CAPTURE);
		$x = 0;
		$ct = count( $parts );
		foreach ( $parts as $k => $part ) {

			if ( " " !== $part && false === empty( $part ) ) {
				$gram = null;
				if ( 0 !== $x && $x !== $ct ) {
					$gram = $parts[ $x - 1 ] . ' ' . $part;
				}
				if ( ( $x > 1 ) && $x < ( $ct - 1 ) ) {
					$gram = $parts[ $x - 2 ] . ' ' . $parts[ $x - 1 ] . ' '  . $part;
				}

				$gram = strtolower( preg_replace('/[\W]+/', ' ', $gram ) );;
				$ngrams[ $gram ] = ( isset( $ngrams[ $gram ] ) ) ? $ngrams[ $gram ] + 1 : 1;
				
				$words[ $part ] = ( isset( $words[ $part ] ) ) ? $words[ $part ] + 1 : 1;
				$x += 1;
			}
		}
		$name = array_pop( array_slice( explode( ' ', $obj->actor->displayName ), 0, 1 ) );
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
$words = array_diff( $words, stopwords() );
arsort( $ngrams );
$top = array_slice( $ngrams, 0, 1000 );
foreach ( $top as $name => $count ) {
	echo "$name $count\n";
}

//var_dump( $words );

?>
