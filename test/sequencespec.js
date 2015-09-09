var lazy = require('../src/Sequence-compiled.js');
var xfr = require('../src/transformers/transformers-compiled.js');


var assert = require("assert");

describe('SequenceArray', function() {
    describe('combined filter transforms', function () {

        new lazy.ArraySequence([1, 2, 3, 4,5, 6, 7, 8])
                .transduce(xfr.Take, 1);
    });
});


describe('SequenceArray', function() {
    describe('combined filter transforms', function () {

        var t1 = new lazy.ArraySequence([1,2,3,4]);
        var t2 = new lazy.ArraySequence([5,6,7,8]);
        var t3 = new lazy.ArraySequence([9,10,11,12]);

        var res = t1
            //.transform(xfr.incXfr)
            .merge(t2, t3)
            .transform(xfr.incXfr)      // map op
            .transform(xfr.isEvenXfr)
            .transform(xfr.debugXfr, 'merged event stream: ')
            .transducer(xfr.aggregateXdr)
            .transform(xfr.debugXfr, 'aggregate event stream: ')
            .toArray();

        console.log(res);

        it('should return filtered result', function () {
            assert.equal('10,6,2,12,8,4', res.toString());
        });

    });
});