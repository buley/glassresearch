<?php
global $threshold;
$threshold = .95;
$root = implode( "/", array_slice( explode( "/", dirname( __FILE__ ) ), 0, -1 ) );
$dir = $root . "/data/twitter";
$female_raw_file = $root . "/datasets/female_first_names.txt";
$female_raw_data = file_get_contents( $female_raw_file );
$female_data = explode( "\n", $female_raw_data );
global $female_probability;
$female_probability = array();
foreach ( $female_data as $female ) {
	if ( false === empty( $female ) ) {
		$female = preg_replace( "/\s+/", " ", $female );
		$spl = explode( " ", $female );
		$name = $spl[ 0 ];
		$female_probability[ $name ] = floatval( $spl[ 1 ] );
	}
}
$male_raw_file = $root . "/datasets/male_first_names.txt";
$male_raw_data = file_get_contents( $male_raw_file );
$male_data = explode( "\n", $male_raw_data );
$male_probability = array();
global $male_probability;
foreach ( $male_data as $male ) {
	if ( false === empty( $male ) ) {
		$male = preg_replace( "/\s+/", " ", $male );
		$spl = explode( " ", $male );
		$name = strtoupper( $spl[ 0 ] );
		$male_probability[ $name ] = floatval( $spl[ 1 ] );
	}
}

function gender( $name ) {
	$results = judge( $name );
	global $threshold;
	//no probability, if calculated correctly, should be > 1
	if ( $results[ 'male' ] > 1 || $results[ 'female' ] > 1 ) {
		die( "Bad math" );
	}
	if ( $results[ 'male' ] >= $threshold ) {
		return 'male';
	} else if ( $results[ 'female' ] >= $threshold ) {
		return 'female';
	} else if ( $results[ 'male' ] > $results[ 'female' ] ) {
		return 'likely-male';
	} else if ( $results[ 'female' ] > $results[ 'male' ] ) {
		return 'likely-female';
	}
	return 'ambiguous';
}

function judge( $name ) {
	$r = array(
		'male' => male( $name ),
		'female' => female( $name )
	);
	return $r;
}

/* 
A = male
B = male name "taylor"
( ( male name "taylor" / male ) * male name "taylor" ) / ( female name "taylor" + male name "taylor" )
*/
function male( $name ) {
	global $female_probability;
	global $male_probability;

	$name = strtoupper( $name );
	$a = .5;//50/50 change male vs. female (naive)
	$f = ( isset( $female_probability[ $name ] ) ) ? $female_probability[ $name ] : 0;
	$m = ( isset( $male_probability[ $name ] ) ) ? $male_probability[ $name ] : 0;
	$b = $m; //male name
	if ( ( $f + $m ) > 0 ) { 
		return ( ( $b / $a ) * $a ) / ( $f + $m );
	} else {
		return 0;
	}
}
function female( $name ) {
	global $female_probability;
	global $male_probability;


	$name = strtoupper( $name );
	$a = .5;//50/50 change male vs. female (naive)
	$f = ( isset( $female_probability[ $name ] ) ) ? $female_probability[ $name ] : 0;
	$m = ( isset( $male_probability[ $name ] ) ) ? $male_probability[ $name ] : 0;
	$b = $f; //female name
	if ( $f + $m > 0 ) { 
		return ( ( $b / $a ) * $a ) / ( $f + $m );
	} else {
		return 0;
	}
}


