
# LazyTransducer (early work in progress)

[Transducers are described by Rich Hickley](http://blog.cognitect.com/blog/2014/8/6/transducers-are-coming):

'Transducers are a powerful and composable way to build algorithmic transformations that you can reuse in many contexts, and they're coming to Clojure core and core.async.'

Key enhancements:

* Full lazy evaluation of the data stream
* Pluggable library of composeable transducer and transformer functions
* Fluent style interface
* Reactive 

Note: Written using ES6/ES2015 javascript features

Experimental javascript implementation of transducers with a lazily evaluated function chain. 


    var t1 = new lazy.ArraySequence([1,2,3,4]);
    var t2 = new lazy.ArraySequence([5,6,7,8]);
    var t3 = new lazy.ArraySequence([9,10,11,12]);

    var res = t1
        //.incXfr()
        .merge(t2, t3)              // merge in two other sequence sources
                                    // for each request and array result is produced e.g. [1,5,6] and then then [2,6,10] etc
                                   // this buffer then acts as an ArraySequence until empty e.g. 1 is returned then 5 then 6 and then the input streams 
                                   // are pulled from again to give [2,6,10] in the buffer and returning 2,6 and then 10
        .incXfr()      // simple +1 function applied to each element in turn
        .isEvenXfr()   // filtering transform, returns null to indicate a filtered result
        .debugXfr('merged event stream: ')
        .aggregateXfr() // aggregating transducer, null results are removed from the input stream
        .debugXfr('aggregate event stream: ')
        .toArray();
    

In this example data is pulled through the transformation and debug functions to give the output:

    10,6,2,12,8,4

.transform() functions are applied to each element in the input stream - transforming the input

.transducer() 
    functions are applied recursively to the input stream to greedily absorb the stream until an undefined value is received from the the upstream data or from the transducer

e.g. the aggregateXfr function returns the same value it receives effectively pulling all the data through the stream and creating an aggregated result.



example functions that can be applied as transforms or transducers:

    exports.aggregateXfr = x => x;

    exports.incXfr = x => x + 1;

    exports.isEvenXfr = x => x % 2 == 0 ? x : null;

    exports.debugXfr = (x,y) => {
        if (x) {
            var str = '';
            if (utils.isArray(x) && x.length > 0) {
                str = utils.flatten(x).join(',');
            } else {
                str = ''+ x;
            }
            console.log(y + str)
        };
        return x;
    };


## Transformers are a class of functions that can be used as part of a transducer or applied to elements in an iteration.

* Pure function
* Receives a single input and returns a response (which can be a composite structure)
* A null response indicates the element should be filtered when used as a transducer
* Has no idea where the input comes from
* Has no idea where or how the output is used
* Inherently composable


## Goals

Build a system where the primary purpose is to focus on the specification of the process and not how the process is implemented. This leads to several goals:

* Time related issues should be abstracted i.e. the processing of immediate of asynchronous data should not change any of the actual transformation processes.
* Process impedance mismatch (buffering)
* Iteration - ultimately any transformation process tends to operate on single logical elements which tend to form part of a larger grouping. This means iterators are required to unpack lists and then form recombination operations. These actual processes should not be concerned with the packing unpacking operations. Iterators and aggregators should be 
* Inherent parallelism


## TODO

* make the function chain reactive
* ensure immutable structures are used



## Mapping

## Filtering


## Reducing

## Flattening/Aggregation

## Counting/Iterators


## Combining


## State/Conditionals

## Splitting/Parallelising


## Reactive



## Changes


* Added transducers and transformer functions into a dispatch map. This cleans up the execution synatx and means the object can be easily extended by just adding functions
into the transducer.js or transformer.js file and then will automatically becomes available to use in a stream.

* Array sequence now uses ES6 iterator (still needs to be converted to a fully async generator)

* Added takeXdr, and TakeUntilXdr which will aggregate a defined number of elements together

* Removed auto flattening from the transducer and added a flattenXdr to the library


