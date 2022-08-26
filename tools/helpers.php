<?php

// Return array of query results or die with query string and error;
function getQueryResults($c,$s) {
	$r = $c->query($s);

	if($c->errno) die(json_encode([ "sql"=>$s, "error"=>$c->error]));

	$a = [];
	while($row = $r->fetch_object()) $a[] = $row;
	return $a;
}

// $g = some array, $p = array of properties;
// If all $p properties are present in $g, return true, else false;
function areset($g,$p) {
	foreach($p as $o) if(!isset($g[$p])) return false;
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






/*
// Make a mysqli connection to database. Return connection object;
function makeConn($host = "localhost", $user = "", $pass = "", $dbname = "") {
	$c = new mysqli($host, $user, $pass, $dbname);
	if($c->connect_errno) die($c->connect_error);
	return $c;
}


// Expects mysqli result object
// Does a fetch_all if that function isn't working in your php version
function altFetchAll($r) {
	$a = [];
	while($row = $r->fetch_assoc())
		$a[] = $row;
	return $a;
}

// Expects a mysqli connection, and a prepared statement
// Returns an object
	// qry = The prepared statement passed into it
	// result = An array of result rows
	// error = An error string on failure
function makeQuery($m,$ps) {
	$r = $m->query($ps);
	if(!$m->errno) return [
		"qry"=>$ps,
		//"result"=>$r->fetch_all(MYSQLI_ASSOC)
		"result"=>altFetchAll($r)
	];
	else return [
		"qry"=>$ps,
		"error"=>$m->error
	];
}

// Expects a mysqli connection, and type of prepared statement
// Takes the type and calls a makeQuery
// Returns makeQuery result object or an error object
function makeStatement($m, $t) {

	switch($t) {
		case 1: return makeQuery($m, "SELECT * FROM table1");
		case 2: return makeQuery($m, "SELECT * FROM table2");
		case 3: return makeQuery($m, "SELECT * FROM table3");
	}

	return ["error"=>"Statement does not exist"];
}

// Print out a result after passing options into a prepared statement
echo json_encode(
	makeStatement(
		makeConn(),
		(isset($_GET['type']) ? $_GET['type'] : 1)
	),
	JSON_NUMERIC_CHECK
);
*/




// https://stackoverflow.com/questions/54258642/how-to-access-the-current-index-in-array-reduce#answer-54259037
function array_reduce_assoc(array $array, callable $callback, $initial=null) {
    $carry = $initial;
    foreach ( $array as $key => $value ) {
        $carry = $callback($carry, $value, $key);
    }
    return $carry;
}

function makeColumn($o) { return "`$o`"; }
function makeSets($r,$o,$i) { $r[] = "`$i`=$o"; return $r; }

function makeInsertStatement($t,$a) {
    $keys = array_map('makeColumn',array_keys($a));
    $vals = array_values($a);

    return "INSERT INTO `$t`
    (".implode(",",$keys).")
    VALUES
    (".implode(",",$vals).")";
}

function makeUpdateStatement($t,$a,$c) {
    $sets = array_reduce_assoc($a,'makeSets',[]);
    $conditions = array_reduce_assoc($c,'makeSets',[]);

    return "UPDATE `$t`
    SET ".implode(" , ",$sets)."
    WHERE ".implode(" AND ",$conditions);
}