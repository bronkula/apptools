<?php


/* shim for array_reduce_assoc */
function array_reduce_assoc(array $array, callable $callback, $initial=null) {
    $carry = $initial;
    foreach ( $array as $key => $value ) {
        $carry = $callback($carry, $value, $key);
    }
    return $carry;
}

/* surround column names with backticks */
function makeBacktick($o) { \
    return "`".preg_replace('/`/g','',$o)."`"; }

/*
$r = reducer value
$o = current object
$i = current index
*/
function makePairs($r,$o,$i) {
    $r[] = makeBacktick($i)."=$o"; return $r; }

function makeSet($a,$d=" , ") {
    return implode($d,array_reduce_assoc($a,'makePairs',[])); }

function makeArrayKeys($a,$d=",") {
    return implode($d,array_map('makeBacktick',$a)); }

/*
Return all fetched rows as array
$r = pdo result object
*/
function fetchAll($r) {
    $a = [];
    while($row = $r->fetch(PDO::FETCH_OBJ)) $a[] = $row;
    return $a;
}

/*
$t = database table
$k = array of keys
$v = array of values
*/
function makeInsertStatement($t,$k,$v) {
    return "INSERT INTO `$t`
    (".makeArrayKeys($k).")
    VALUES
    (".implode(',',$v).")";
}

/*
$c = database connection
$t = database table
$a = associative array of SET name value pairs
$p = parameter values array
*/
function makeInsert($c,$t,$a,$p,$admin=false) {
    if(checkYourPrivilege($admin))
        return ["error"=>"Not an Admin Account"];

    try {
        $query = makeInsertStatement($t,array_keys($a),array_values($a));
        $c->prepare($query)->execute($p);
        return ["result"=>$c->lastInsertId()];
    } catch(PDOException $e) {
        return ["error"=>"Insert Failed: ".$e->getMessage()];
    }
}


/*
$t = database table
$a = associative array of SET name value pairs
$w = associative array of WHERE name value pairs
*/
function makeUpdateStatement($t,$a,$w) {
    return "UPDATE `$t`
    SET ".makeSet($a)."
    WHERE ".makeSet($w," AND ");
}

/*
$c = database connection
$t = database table
$a = associative array of SET name value pairs
$w = associative array of WHERE name value pairs
$p = parameter values array
example: makeUpdate($c,'products',$a,$w,$p,$admin=false)
*/
function makeUpdate($c,$t,$a,$w,$p,$admin=false) {
    if(checkYourPrivilege($admin))
        return ["error"=>"Not an Admin Account"];

    try {
        $query = makeUpdateStatement($t,$a,$w);
        $c->prepare($query)->execute($p);
        return ["result"=>"Update Success"];
    } catch(PDOException $e) {
        return ["error"=>"Update Failed: ".$e->getMessage()];
    }
}

/*
$c = database connection
$t = database table
$p = parameter values array
*/
function makeDelete($c,$t,$p,$admin=false) {
    if(checkYourPrivilege($admin))
        return ["error"=>"Not an Admin Account"];

    try {
        $query = "DELETE FROM $t WHERE id=?";
        $c->prepare($query)->execute($p);
        return ["result"=>"Delete Success"];
    } catch(PDOException $e) {
        return ["error"=>"Delete Failed: ".$e->getMessage()];
    }
}

/*
Make a query or prepared statement
$c = database connection
$ps = prepared statement
$p = parameter values array
*/
function makeQuery($c,$ps,$p,$admin=false) {
    if(checkYourPrivilege($admin))
        return ["error"=>"Not an Admin Account"];

    try {
        if(count($p)) {
            $stmt = $c->prepare($ps);
            $stmt->execute($p);
        } else {
            $stmt = $c->query($ps);
        }
        $r = fetchAll($stmt);
        return [
            // "params"=>$p,"qry"=>$ps,
            "result"=>$r];
    } catch (PDOException $e) {
        return ["error"=>"Query failed: ".$e->getMessage()];
    }
}














/* Make Connection to database with PDO */
function makeConn(
    $host = "localhost",
    $user = "",
    $pass = "",
    $dbname = ""
) {
    try {
        return new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $user,
            $pass
        );
    } catch (PDOException $e) {
        die('{"error":"'.$e->getMessage().'"}');
    }
}
