<?php


// $g = some array, $p = array of properties;
// If all $p properties are present in $g, return true, else false;
function areset($g,$p) {
	foreach($p as $o) if(!isset($g[$o])) return false;
	return true;
}

// If all $p are present in $g, map each property onto $s template, else return $d default;
function getDefault($g,$p,$s,$d) {
	return areset($g,$p) ?
	vsprintf($s,array_map(
		function($a) use $g {return $g[$a];},$p
	)) : $d;
}

// Map $f function onto $a array, and then join using $dj delimiter
function mapJoin($a,$f,$d) {
	return implode($d, array_map($f, $a));
}
// Test $c value, if string split using $sd delimiter, else use array, and pass values to mapJoin;
function splitMapJoin($c,$f,$jd,$sd="/\s?,\s?/") {
	return mapJoin(is_array($c)?$c:preg_split($sd,$c),$f,$jd);
}

// Preformat a print_r output
function print_p($v) {
	echo "<pre>",print_r($v),"</pre>";
}




