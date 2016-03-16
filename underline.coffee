# Returns the same value that is used as the argument. In math, f(x) = x.

identity = (value) -> value

# Iterates over a collection of elements, yielding each in turn to a callback
# function. Each invocation of callback is called with three arguments:
# (element, index, collection). If collection is a JavaScript object,
# the callback's arguments will be (value, key, list).
# Returns the collection for chaining.

each = (collection, callback) ->
  if {}.toString.call(collection) is "[object Object]"
    callback collection[key], key, collection for key of collection
  else
    callback item, index, collection for item, index in collection
  return collection

# Boils down an array of values into a single value. Memo is the initial state
# of the reduction, and each successive step of it should be returned by
# callback. The callback is passed four arguments: the memo, then the value and
# index of the iteration, and finally a reference to the entire array.

reduce = (array, callback, memo) ->
  (memo = callback memo, item, index, array) for item, index in array
  return memo

# Produces a new array of values by mapping each value in array through a
# transformation function (callback). The callback is passed three arguments:
# the value, then the index of the iteration, and finally a reference to the
# entire array.

map = (array, callback) ->
  callback item, index, array for item, index in array

# Looks through each value in the array, returning an array of all the values
# that pass a truth test (predicate).

filter = (array, predicate) ->
  item for item, index in array when predicate(item, index) is true

# Returns the values in list without the elements that the truth test
# (predicate) passes. The opposite of filter.

reject = (array, predicate) ->
  item for item, index in array when predicat

# Returns a copy of the array with all falsy values removed. In JavaScript,
# false, null, 0, "", undefined and NaN are all falsy.

compact = (array) ->
  item for item in array when item

# Returns a function that will itself return the key property of any passed-in
# object.

property = (key) -> (obj) -> obj[key]

# A convenient version of what is perhaps the most common use-case for map:
# extracting a list of property values.

pluck = (array, property) -> object[property] for object in array

# Flattens a nested array (the nesting can be to any depth).

flatten = (array) ->
  flattened = []
  for item in array
    flattened = flattened.concat(if Array.isArray(item) then flatten(item) else item)
  return flattened

# Invokes the given iteratee function n times. Each invocation of iteratee is
# called with an index argument. Produces an array of the returned values

times = (n, callback) ->
  return unless n > 0
  callback index for index in [0..n-1]

# A function to create flexibly-numbered lists of integers. start, if omitted,
# defaults to 0; step defaults to 1. Returns a list of integers from start
# (inclusive) to stop (exclusive), incremented (or decremented) by step,
# (exclusive.) Note that ranges that stop before they start are considered to
# be zero-length instead of negative — if you'd like a negative range, use a
# negative step.

range = () -> # arguments are [start], end, [step]
  switch arguments.length
    when 1
      [end] = arguments
    when 2
      [start, end] = arguments
    when 3
      [start, end, step] = arguments
  start ?= 0
  step ?= 1
  end = if end > 0 then end - 1 else if end < 0 then end + 1 else 0
  i for i in [start..end] by step

# Returns the sum of an array of numbers

sum = (array) ->
  total = 0
  total += number for number in array
  return total

# Produces a duplicate-free version of the array

unique = (array) ->
  seen = []
  for item in array
    seen.push(item) if item not in seen
  return seen

# Returns true if all of the values in the list pass the predicate truth test.
# Short-circuits and stops traversing the list if a false element is found.

every = (array, predicate) ->
  for item, index in array
    return no if predicate(item, index, array) is no
  yes

# Returns true if none of the values in the list pass the predicate truth test.
# Short-circuits and stops traversing the list if a false element is found.

none = (array, predicate) ->
  for item, index in array
    return no if predicate(item, index, array) is yes
  yes

# Returns true if any of the values in the list pass the predicate truth test.
# Short-circuits and stops traversing the list if a true element is found.

any = (array, predicate) ->
  for item, index in array
    return yes if predicate(item, index, array) is yes
  no

# Returns true if the value is present in the array

contains = (array, item) ->
  item in array

# Gets the value at path of object. Returns undefined if the path doesn't exist.
# Path is a string of period-delimited property values.
# e.g. object = { response: { data: { users: [1, 2] } } }
#      get(object, 'response.data') => {users: [1, 2]}
#      get(object, 'response.test.does.not.exist') => undefined

get = (object, path) ->
  node = object
  for property in path.split "."
    node = node?[property]
  return node

# Copy all of the properties in the source objects over to the destination
# object, and return the destination object. It's in-order, so the last source
# will override properties of the same name in previous arguments.
# e.g. extend({name: 'moe'}, {age: 50}, {hair: 'black'}, {isStooge: true})
#      => {name: 'moe', age: 50, hair: 'black', isStooge: true}

extend = (object, sources...) ->
  for source in sources
    object[key] = value for key, value of source

# Returns a copy of the array with all instances of the values removed.

without = (collection, values...) ->
  value for value in collection when value not in values

# Bind a function to an object, meaning that whenever the function is called,
# the value of this will be the object. Optionally, pass arguments to the
# function to pre-fill them, also known as partial application.

bind = (fn, context, boundArgs...) ->
  (calledArgs...) ->
    fn.apply context, boundArgs.concat calledArgs

# Retrieve all the names of the object's own enumerable properties.

keys = (object) ->
  key for key, value of object

# Retrieve all the names of the object's own enumerable properties.

values = (object) ->
  value for key, value of object
