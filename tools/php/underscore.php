<?php

function orderBy($arr, $ord){
    usort($arr, function($a, $b) use ($ord){
        return strcmp($a->{$ord}, $b->{$ord});
    });
    return $arr;
}
function findWhere($arr,$k,$v) {
    foreach($arr as $key=>$val) {
        if(isset($val->$k) && $val->$k==$v) return $val;
    } 
    return false;
}
function findPlaceWhere($arr,$k,$v) {
    foreach($arr as $key=>$val) {
        if(isset($val->$k)) {
            if($val->$k==$v) {
                return (object)array("key"=>$key,"val"=>$val);
            }
        }
    } 
    return false;
}
function replaceWhere($arr,$replace,$k,$v) { // in $arr, $replace $val where $k == $v
    foreach($arr as $key=>$val) {
        if(isset($val->$k)) {
            if($val->$k==$v) {
                $arr[$key] = $replace;
            }
        }
    } 
    return $arr;
}
function deleteWhere($arr,$k,$v) {
    $tarr = array();
    foreach($arr as $key=>$val) {
        if(isset($val->$k)) {
            if($val->$k!=$v) {
                $tarr[] = $val;
            }
        }
    } 
    return $tarr;
}
