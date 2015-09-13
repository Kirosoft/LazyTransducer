/**
 * Created by marknorman on 17/07/15.
 */

let utils = require('./utils/utils-compiled.js');
let transducers = require('./transducers/transducers-compiled.js');
let transformers = require('./transformers/transformers-compiled.js');

class Sequence  {
    constructor(parent, params) {
        this._parent = parent;
        this._params = params;
        this._listeners = [];
        this._cachedResult = null;

        // find the most upstream parent e.g. adam or eve :-)
        // register as a listener
        if (parent) {
            let adam = parent._getParentSource();
            adam.subscribe(this);
        }
        return this;
    }

    arraySequence(sourceData, params) {
        return new  ArraySequence(sourceData,null,params)
    }

    transducer(xdr, params) {
        return new TransducerSequence(this, xdr, params);
    }

    transform(xfrm, params) {
        return new TransformSequence(this, xfrm, params);
    }

    // Arguments -  variable list of sources
    merge(params) {
        let streams = utils.flatten(this, [].slice.call(arguments));

        return new MergeSequence(null, streams.reverse(), params);
    }

    _get () {
        return this._parent._get();
    }

    _getParentSource() {
        return this._parent ? this._parent._getParentSource() : this;
    }

    toArray(flattenResults = false) {
        var results = [];

        do {
            var item = this._get();

            if (item) {
                results.push(item);
            }

        } while (typeof(item) !== "undefined");

        return flattenResults ? utils.flatten(results) : results;
    }

    _nextItemFunc() {

        if (this._cachedResult === null) {
            let parentRes = this._parent._get();
            if (parentRes === undefined) {
                return undefined;
            } else if (utils.isArray(parentRes)) {
                this._cachedResult = new ArraySequence(parentRes);
            } else {
                return parentRes;
            }
        }
        let res = this._cachedResult._get();

        if (res === undefined) {
            this._cachedResult = null;
            return this._nextItemFunc();
        }
        return res;
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    _notify(data) {
        this._listeners.forEach((listener) => {
            listener._change(data);
        })
    }

    _change(data) {
        console.log("Change: "+data.toString());
    }
}


class ArraySequence extends Sequence {
    constructor(arrayData, parent=null, params=null) {
        super(parent, params);
        // TODO: These still need to be Async
        this._iter = arrayData[Symbol.iterator]();
    };

    reset(arrayData) {
        this._iter = arrayData[Symbol.iterator]();
    }

    _get() {
        return this._iter.next().value;
    }
}

class TransducerSequence extends Sequence {
    constructor(parent, _transducer, predicate, params) {
        super(parent, params);
        this._transducer = _transducer;
        this._predicate = predicate;
    }

    // Transducers will eagerly (recursively) consume the available data or return undefined (to indicate completion)
    // if xdr returns undefined then terminate and return the results so far
    // The xdr will use a step function provided in the outer closure (when initialised) to get items (targets back to the super._get)
    // Tail Recursive - hopefully should be optimised by transpiler ES6/2015
    _xdr(xdr, acc = []) {

        let res = xdr(acc);

        if (res === undefined) {
            return acc.length > 0 ? acc : undefined;
        } else {
            return this._xdr(xdr, res);
        }
    }

    _get() {

        this._cachedResult = null;

        // Create a closure to encapsulate any local state
        let transducerInstance = this._transducer(this._nextItemFunc.bind(this), this._predicate, this._params);

        // Take the current value and process the data via the transducer recursively
        return this._xdr(transducerInstance, []);
    }
}

class TransformSequence extends Sequence {
    constructor(parent, xfrm, params) {
        super(parent, params);
        this._xfrm = xfrm;
    };

    _get() {
        let currentValue = this._nextItemFunc();

        // Take the current value and process the data via the transducer
        return typeof(currentValue) !== "undefined" ? this._xfrm(currentValue, this._params) : currentValue;
    }
}


class MergeSequence extends ArraySequence {

    constructor(parent, streams, params) {
        super([], parent, params);
        this._parent = parent;
        this._streams = streams;
    };

    _get() {

        let res = super._get();

        // Check if we have reached the end of the current buffer
        if (res === undefined) {

            // pull data from all streams
            let streamVals = this._streams.reduce( (previousValue, stream) => {
                let val = stream._get();
                if (val) {
                    previousValue.push(val);
                }
                return previousValue;
            },[]);

            if (streamVals && streamVals.length > 0) {

                // Reset the iterator with the new stream data
                this.reset([].concat(streamVals));

                // recurse to get the next value
                return this._get();
           }
        }

        return res;
    };

}

// Install all available transduces as a dispatch map
for (let xdr in transducers) {
    Sequence.prototype[xdr] = function(params) {
        return this.transducer(transducers[xdr], params);
    }
}
for (let xfrm in transformers) {
    Sequence.prototype[xfrm] = function(params) {
        return this.transform(transformers[xfrm], params);
    }
}

module.exports = {
    ArraySequence: ArraySequence,
    Sequence: Sequence
};