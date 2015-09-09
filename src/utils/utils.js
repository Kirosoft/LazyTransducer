


// Pass in an array of arrays get return a single array
exports.flatten = function flatten() {
    // variable number of arguments, each argument could be:
    // - array
    //   array items are passed to flatten function as arguments and result is appended to flat array
    // - anything else
    //   pushed to the flat array as-is
    var flat = [],
        i;
    for (i = 0; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
            flat = flat.concat(flatten.apply(null, arguments[i]));
        } else {
            flat.push(arguments[i]);
        }
    }
    return flat;
};



exports.nodeCallback = function nodeCallback(error, result, completeCallback, errorCallback) {
    var callback = null;

    if (error) {
        if (errorCallback) {
            errorCallback(error);
        }
    }
    else if (completeCallback) {
        completeCallback(result);
    }
};

exports.existy = function existy(x) {
    if (typeof x === 'undefined') {
        return false;
    }
    else {
        return x !== null;
    }
};
exports.truthy = function truthy(x) { return (x !== false) && existy(x); };

exports.compareStringsWithWildCard =  function compareStringsWithWildCard(s1, s2) {

    return !!((s1 === s2) || (s1 === '*') || (s2 === '*'));
};

// recursively compare two paths zipped into arrays of strings
// wildcards match all strings, terminating wildcards
// in the last position match all subsequent segments
// wildcards only in the first array
// e.g. [[0,*,2,3,*,undefined],[0,1,2,3,4,5]] === true
exports.compareArrays = function compareArrays(tail,wildcard) {

    if (tail.length === 0) {
        // reached the end - match
        return true;
    } else {
        // propogate wildcard if previous segment has wildcard
        if (!existy(tail[0][0]) && truthy(wildcard)) {
            tail[0][0] = '*';
        }
        if (compareStringsWithWildCard(tail[0][0], tail[0][1])) {
            // recurse onto next segment
            return compareArrays(_.rest(tail), tail[0][0] === '*');
        } else {
            // strings do not match terminates
            //console.log('s0: '+tail[0][0]);
            //console.log('s1: '+tail[0][1]);

            return false;
        }
    }
}


//TODO: requires that the filter function is available on the supplied object (ob)
// obj: eventStream object (e.g. Bacon.bus)
// messagePath: the spec for the path we would like to filter on. Can include widlcards
//              a1.b2.*.d2.* - terminal * matches all subsequent segments
exports.filterBy = function filterBy(obj, messagePath) {
    var messagePathArray = messagePath.split('.');

    return obj.filter(function (message) {
        var messageArray = message.message.split('.');
        var joinedArrays = _.zip.apply(_,[messagePathArray, messageArray]);
        return compareArrays(joinedArrays,false);
    });
};

exports.removeFromArrayByValue = function removeFromArrayByValue(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}


exports.isObjLiteral = function isObjLiteral(_obj) {
    var _test  = _obj;
    return (  typeof _obj !== 'object' || _obj === null ?
            false :
            (
                (function () {
                    while (!false) {
                        if (  Object.getPrototypeOf( _test = Object.getPrototypeOf(_test)  ) === null) {
                            break;
                        }
                    }
                    return Object.getPrototypeOf(_obj) === _test;
                })()
            )
    );
}

exports.isFunction = function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

exports.isArray = function isArray(obj) {
    return obj instanceof Array;
};

exports.isSmartVar = function isSmartVar(obj) {
    return obj instanceof SmartVar;
};

exports.isObjLiteral = function isObjLiteral(_obj) {
    var _test  = _obj;
    return (  typeof _obj !== 'object' || _obj === null ?
            false :
            (
                (function () {
                    while (!false) {
                        if (  Object.getPrototypeOf( _test = Object.getPrototypeOf(_test)  ) === null) {
                            break;
                        }
                    }
                    return Object.getPrototypeOf(_obj) === _test;
                })()
            )
    );
};

