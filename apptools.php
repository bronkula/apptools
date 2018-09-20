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
