const leadingZeros = function(number, exponent){
    let zeros = new Array( exponent - number.toString().length + 1 );
    return zeros.join( '0' ) + number;
}

const randomBoolean = function(){
    if(Math.random() > 0.5) {
         return true;
    } else {
         return false;
    }
}

const randomMax = function(max){
    return Math.floor(Math.random() * max);
}

const randomRange = function(min, max){
    return Math.round(Math.random() * (max - min)) + min;
}

const randomNumber = function(min,max){
    let rand = Math.random();
    if(max === void(0)) {
        if(min === void(0)) return rand < 0.5;
        else return Math.floor(rand * min);
    } else return Math.round((rand * (max - min)) + min);
}

const numberCommas = function(num){
    return String(num).replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g, ',');
}

const moneyCommas = function(num,decimal,sym='$'){
    if(decimal === void(0)) decimal = 2;
    return String(sym + n.toFixed(decimal)).replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g,',');
}

const randomArrayShuffle = function(arr){
    let tempArray1 = arr.slice(0);
    let tempArray2 = new Array();
    let tempObject;
    while(tempArray1.length > 0){
        tempObject = Math.floor(Math.random() * tempArray1.length);
        tempArray2.push(
            tempArray1.splice(tempObject, 1)[0]
        )
    }
    return tempArray2;
}

const fisherYatesShuffle = function(arr){
    let tempArray = arr.slice(0);
    let length = tempArray.length;
    let randomIndex;
    let tempObject;
    for(let incrementor = 0; incrementor < length; incrementor += 1){
        randomIndex = Math.floor(Math.random() * (length - incrementor)) +incrementor;
        tempObject = tempArray[incrementor];
        tempArray[incrementor] = tempArray[randomIndex];
        tempArray[randomIndex] = tempObject;
    }
    return tempArray;
}

const arrayShuffleWithSort = function(arr){
    let tempArray = arr.slice(0);
    tempArray.sort(function() {
        return Math.random() - 0.5;
    });
    return tempArray;
}

const timeDifference = function(){
    if(!timeDifference.time) {
        timeDifference.time = new Date();
    } else {
        timeDifference.result = new Date() - timeDifference.time;
        timeDifference.time = 0;
        return timeDifference.result;
    }
}

const nodeIndex = function(node){
    let parentChildren = node.parentNode.children;
    for(let i = 0, l = parentChildren.length; i < l; i++) {
        if(parentChildren[i] == node) return i;
    }
}

const templater = function(template,data,notation=['\\<%=\\s*','\\s*%>']){
    if(!template || !data) return template||'';
    for(let key in data){
        if(data.hasOwnProperty(key) === false) continue;
        template = template.replace(RegExp(notation[0] + key + notation[1], 'g'), data[key]);
    }
    return template;
}

const replaceFromArray = function(searchList,replaceList,context){
    for(let key = 0, length = searchList.length; key < length; key += 1) {
        context = context.replace(searchList[key],replaceList[key]);
    }
    return context;
}