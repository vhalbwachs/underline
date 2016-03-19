// Returns the same value that is used as the argument. In math, f(x) = x.

function identity(value) {
  return value;
}

// Returns true is value is a native javascript object.

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

// Iterates over a collection of elements, yielding each in turn to a callback
// function. Each invocation of callback is called with three arguments:
// (element, index, collection). If collection is a JavaScript object,
// the callback's arguments will be (value, key, list).
// Returns the collection for chaining.

function each(collection, callback) {
  var i = -1,
      length;
  if(!isObject(collection)) {
    length = collection.length;
    while (++i < length) {
      callback(collection[i], i, collection);
    }
  } else {
    each(keys(collection), function(key) {
      callback(collection[key], key, collection);
    });
  }
  return collection
}

// Boils down an array of values into a single value. Memo is the initial state
// of the reduction, and each successive step of it should be returned by
// callback. The callback is passed four arguments: the memo, then the value and
// index of the iteration, and finally a reference to the entire array.

function reduce(array, callback, memo) {
  each(array, function(item, index, collection) {
    memo = callback(memo, item, index, collection);
  });
  return memo;
}

// Produces a new array of values by mapping each value in array through a
// transformation function (callback). The callback is passed three arguments:
// the value, then the index of the iteration, and finally a reference to the
// entire array.

function map(array, callback) {
  return reduce(array, function(mapped, item, index, array) {
    return mapped.concat([callback(item, index, array)]);
  }, []);
}

// Looks through each value in the array, returning an array of all the values
// that pass a truth test (predicate).

function filter(array, predicate) {
  return reduce(array, function(passed, item, index, collection) {
    return predicate(item, index, collection) ? passed.concat([item]) : passed;
  }, []);
}

// Returns the values in list without the elements that the truth test
// (predicate) passes. The opposite of filter.

function reject(array, predicate) {
  return filter(array, function(item, index, collection) {
    return !predicate(item, index, collection);
  });
}

// Returns a copy of the array with all falsy values removed. In JavaScript,
// false, null, 0, "", undefined and NaN are all falsy.

function compact(array) {
  return filter(array, identity);
}

// Returns a function that will itself return the key property of any passed-in
// object.

function property(key) {
  return function(object) {
    return object[key];
  };
}

// A convenient version of what is perhaps the most common use-case for map:
// extracting a list of property values.

function pluck(array, key) {
  return map(array, property(key))
}

// Flattens a nested array (the nesting can be to any depth).

function flatten(array) {
  return reduce(array, function(flattened, item) {
    return flattened.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

// Invokes the given iteratee function n times. Each invocation of iteratee is
// called with an index argument. Produces an array of the returned values

function times(n, callback) {
  if (n < 0) return;
  return map(Array.apply(0, Array(n)), function(_, i) {
    return callback(i);
  });
}

// A function to create flexibly-numbered lists of integers. start, if omitted,
// defaults to 0; step defaults to 1. Returns a list of integers from start
// (inclusive) to stop (exclusive), incremented (or decremented) by step,
// (exclusive.) Note that ranges that stop before they start are considered to
// be zero-length instead of negative — if you'd like a negative range, use a
// negative step.

function range() { // arguments are [start], end, [step]
  var start, end, step, times;
  switch(size(arguments))
    case 1:
      end = arguments[0];
      break;
    case 2:
      start = arguments[0];
      end = arguments[1];
      break;
    case 3:
      start = arguments[0];
      end = arguments[1];
      step = arguments[2];
      break;
    default:
      throw new Error("range called with " + arguments.length + " arguments, " +
        "expecting between 1 and 3");

  if (start == null) {
    start = 0;
  }

  if (step == null) {
    step = 1;
  }

  end = end > 0 ? end - 1 : end < 0 ? end + 1 : 0

  if (end < start) {
    return []
  }

  n = Math.floor(Math.abs((end - start) * step))

  return reduce(times(n, identity)), function(seq, i) {
    return seq.concat(i * step);
  }, []);

}

// Returns the sum of an array of numbers

function sum(array) {
  return reduce(array, function(sum, num) {
    return sum + num;
  }, 0);
}

// Produces a duplicate-free version of the array

function unique(array) {
  return reduce(array, function(unique, item) {
    return contains(unique, item) ? unique.concat([item]) : unique;
  }, []);
}

// Returns true if all of the values in the list pass the predicate truth test.
// Short-circuits and stops traversing the list if a false element is found.

every = (array, predicate) ->
  for item, index in array
    return no if predicate(item, index, array) is no
  yes

// Returns true if none of the values in the list pass the predicate truth test.
// Short-circuits and stops traversing the list if a false element is found.

none = (array, predicate) ->
  for item, index in array
    return no if predicate(item, index, array) is yes
  yes

// Returns true if any of the values in the list pass the predicate truth test.
// Short-circuits and stops traversing the list if a true element is found.

any = (array, predicate) ->
  for item, index in array
    return yes if predicate(item, index, array) is yes
  no

// Returns true if the value is present in the array

function contains(array, item) {
  return array.indexOf(item) > -1;
}

// Gets the value at path of object. Returns undefined if the path doesn't exist.
// Path is a string of period-delimited property values.
// e.g. object = { response: { data: { users: [1, 2] } } }
//      get(object, 'response.data') => {users: [1, 2]}
//      get(object, 'response.test.does.not.exist') => undefined

get = (object, path) ->
  node = object
  for property in path.split "."
    node = node?[property]
  return node

// Copy all of the properties in the source objects over to the destination
// object, and return the destination object. It's in-order, so the last source
// will override properties of the same name in previous arguments.
// e.g. extend({name: 'moe'}, {age: 50}, {hair: 'black'}, {isStooge: true})
//      => {name: 'moe', age: 50, hair: 'black', isStooge: true}

extend = (object, sources...) ->
  for source in sources
    object[key] = value for key, value of source

// Returns a copy of the array with all instances of the values removed.

without = (collection, values...) ->
  value for value in collection when value not in values

// Bind a function to an object, meaning that whenever the function is called,
// the value of this will be the object. Optionally, pass arguments to the
// function to pre-fill them, also known as partial application.

bind = (fn, context, boundArgs...) ->
  (calledArgs...) ->
    fn.apply context, boundArgs.concat calledArgs

// Retrieve all the names of the object's own enumerable properties.

function keys(object) {
  return Object.keys(object);
}

// Retrieve all the names of the object's own enumerable properties.

values = (object) ->
  value for key, value of object
