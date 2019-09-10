<?php


function fixURL($url){
	$url = preg_replace(
		array('/http:\/\/[^\/]+/','/\.\./','/\/\//','/\.\//'),
		array('','','/',''),
		$url);
	return $url;
}

function makeFileFolderList($dir="."){
	$folder = fixURL($dir);
	$folders = array();
	$files = array();

	if(!file_exists($folder)) {
    	die(json_encode(array(
    		"error"=>"File Or Folder Does Not Exist",
    		"dir"=>$dir,
    		"folder"=>$folder
    	)));
	} else
	if(!is_dir($folder)) {
		$folder = dirname($folder);
	}

	if ($handle = opendir($folder)) {
    	while (false !== ($file = readdir($handle))) {
    		if($file=="." || $file=="..") continue;
    		if(is_dir("$folder/$file")) $folders[] = $file;
    		else $files[] = $file;
    	}

    	echo json_encode((object) array(
    		"dir"=>$dir,
    		"folder"=>$folder,
    		"self"=>basename($folder),
    		"parent"=>dirname($folder),
    		"files"=>$files,
    		"folders"=>$folders
    	));
    	die;
    } else {
    	die("error opening directory");
    }
}



function getQueryResults($c,$s) {
	$r = $c->query($s);

	if($c->errno)
		die(json_encode([
			"sql"=>$s,
			"error"=>$c->error
		]));

	$a = [];

	while($row = $r->fetch_object())
		$a[] = $row;

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

function mapJoin($a,$f,$dj) {
	return implode($dj, array_map($f, $a));
}
function splitMapJoin($c,$f,$dj,$ds="/\s?,\s?/") {
	return splitMapJoin(is_array($c)?$c:preg_split($ds,$c),$f,$dj);
}


function print_p($v) {
	echo "<pre>",print_r($v),"</pre>";
}


function dbConnect(
	$host = "localhost",
	$user = "",
	$pass = "",
	$dbname = ""
	) {

	$c = new mysqli(
		$host,
		$user,
		$pass,
		$dbname
	);

	if($c->connect_errno)
		die($c->connect_error);

	return $c;
}
