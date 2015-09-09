/**
 * Created by marknorman on 17/07/15.
 */

var utils = require('./utils/utils-compiled.js');

class Sequence  {
    constructor(parent, params) {
        this._parent = parent;
        this._params = params;
        this._listeners = [];

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

    transducer(xfr, params) {
        return new TransducerSequence(this, xfr, params);
    }

    transform(xfrm, params) {
        return new TransformSequence(this, xfrm, params);
    }

    // Arguments -  variable list of sources
    merge(params) {
        let streams = utils.flatten(this, [].slice.call(arguments));

        return new MergeSequence(null, streams.reverse(), params);
    }

    _get() {
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

    // each take a callback to receive data, for each upstream change
    // i.e. this function is
    each(callback) {
        // if the source changes, update the callback function with the new data

        return function() {};
    }
}

class ArraySequence extends Sequence {
    constructor(arrayData, parent=null, params=null) {
        super(parent, params);
        this._arrayData = arrayData;
        this._pos = 0;
    };

    reset() {
        this._arrayData = [];
        this._pos = 0;
    }

    _get() {
        // TODO: Use yield to make this async?
        let item = this._arrayData[this._pos];

        if (item !== undefined) {
            this._pos++;
        }

        return item; // return undefined to indicate end of list
    }

    append(newData) {
        this._arrayData.push(newData);
    }

}

class TransducerSequence extends Sequence {
    constructor(parent, _transducer, predicate, params) {
        super(parent, params);
        this._transducer = _transducer;
        this._predicate = predicate;
        this._cachedResult = undefined;
    };

    // eagerly consume the available streamusing the supplied step function to return a new value
    // if the step function return undefined then terminate and return the result so far
    // if the step function returns a value, call the transform function to get a transformed value
    // if the xfrmed value == undefined then the result has been filtered.
    // Tail Recursive in ES6
    _xdr(stepFunction, xdr, predicate, acc=[], params={}, flattenResults=true) {

        let newItem = stepFunction();

        if (typeof(newItem) === 'undefined') {
            return acc.length > 0 ? acc : undefined;
        } else {
            let res = xdr(acc, newItem, predicate);

            return res ? this._xdr(stepFunction, xdr, predicate, res, params, flattenResults) : acc;
        }
    };

    _get() {

        if (!this._cachedResult) {
            // Take the current value and process the data via the transducer
            let resArray = this._xdr(super._get.bind(this), this._transducer, this._predicate, [], this._params/*, flattenResults*/);
            // Create a new array from the
            if (resArray) {
                this._cachedResult = new ArraySequence(resArray,this, this._params);
            } else return resArray;
        }

        let res = this._cachedResult._get();

        // When the underlying stream is exhausted, clear from the cache
        if (typeof(res) === 'undefined') {
            this._cachedResult = undefined;
            // recurse back in-case new stuff is now available up-stream
            res = this._get();
        }
        return res;
    }
}

class TransformSequence extends Sequence {
    constructor(parent, xfrm, params) {
        super(parent, params);
        this._xfrm = xfrm;
    };

    _get() {
        let currentValue = super._get();

        // Take the current value and process the data via the transducer
        return typeof(currentValue) !== "undefined" ? this._xfrm(currentValue, this._params) : currentValue;
    }
}


class MergeSequence extends ArraySequence {

    constructor(parent, streams, params) {
        super(parent, params);
        this._parent = parent;
        this._streams = streams;
        this._arrayData = [];
    };

    _get() {

        // Check if we have reached the end of the current buffer
        if (this._pos  === this._arrayData.length) {

            // Clear down previous data
            this.reset();

            // pull data from all streams
            let streamVals = this._streams.reduce( (previousValue, stream) => {
                let val = stream._get();
                if (val) {
                    previousValue.push(val);
                }
                return previousValue;
            },[]);

            this._arrayData = this._arrayData.concat(streamVals);
        }

        return this._pos  < this._arrayData.length ? super._get() : undefined;
    };

}

class SmartVarSequence extends Sequence {
    constructor(parent, smartVar, params) {
        super(parent,params);

        this._smartVar = smartVar;
        this.supportedPaths = [];


    }

    addPath(newPath) {
        this.supportedPaths.push(newPath);
        return this;
    }

    _newData(attr, data, filter) {}

}

module.exports = {
    ArraySequence: ArraySequence,
    Sequence: Sequence
};