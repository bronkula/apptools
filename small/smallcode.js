var leadingZeros = function(number, exponent){
    var zeros = new Array( exponent - number.toString().length + 1 );
    return zeros.join( '0' ) + number;
}

var randomBoolean = function(){
    if(Math.random() > 0.5) {
         return true;
    } else {
         return false;
    }
}

var randomMax = function(max){
    return Math.floor(Math.random() * max);
}

var randomRange = function(min, max){
    return Math.round(Math.random() * (max - min)) + min;
}

var randomNumber = function(min,max){
    var rand = Math.random();
    if(max === void(0)) {
        if(min === void(0)) {
            return rand < 0.5;
        } else {
            return Math.floor(rand * min);
        }
    } else {
        return Math.round((rand * (max - min)) + min);
    }
}

var numberCommas = function(num){
    return String(num).replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g, ',');
}

var moneyCommas = function(num,decimal){
    if(decimal === void(0)) {
        decimal = 2;
    }
    return String('$' + n.toFixed(decimal)).replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g,',');
}

var randomArrayShuffle = function(arr){
    var tempArray1 = arr.slice(0);
    var tempArray2 = new Array();
    var tempObject;
    while(tempArray1.length > 0){
        tempObject = Math.floor(Math.random() * tempArray1.length);
        tempArray2.push(
            tempArray1.splice(tempObject, 1)[0]
        )
    }
    return tempArray2;
}

var fisherYatesShuffle = function(arr){
    var tempArray = arr.slice(0);
    var length = tempArray.length;
    var randomIndex;
    var tempObject;
    for(var incrementor = 0; incrementor < length; incrementor += 1){
        randomIndex = Math.floor(Math.random() * (length - incrementor)) +incrementor;
        tempObject = tempArray[incrementor];
        tempArray[incrementor] = tempArray[randomIndex];
        tempArray[randomIndex] = tempObject;
    }
    return tempArray;
}

var arrayShuffleWithSort = function(arr){
    var tempArray = arr.slice(0);
    tempArray.sort(function() {
        return Math.random() - 0.5;
    });
    return tempArray;
}

var timeDifference = function(){
    if(!timeDifference.time) {
        timeDifference.time = new Date();
    } else {
        timeDifference.result = new Date() - timeDifference.time;
        timeDifference.time = 0;
        return timeDifference.result;
    }
}

var nodeIndex = function(node){
    var parentChildren = node.parentNode.children;
    for(var i = 0, l = parentChildren.length; i < l; i++) {
        if(parentChildren[i] == node) return i;
    }
}

var mustacheTemplate = function(template,data){
    if(!template || !data) return template||'';
    for(var key in data){
        if(data.hasOwnProperty(key) === false) continue;
        template = template.replace(RegExp('\{\{' + key + '}}', 'g'), data[key]);
    }
    return template;
}

var replaceFromArray = function(searchList,replaceList,context){
    for(var key = 0, length = searchList.length; key < length; key += 1) {
        context = context.replace(searchList[key],replaceList[key]);
    }
    return context;
}