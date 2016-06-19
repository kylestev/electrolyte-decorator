/**
 * Utility regexes used for parsing function declarations
 * @type {Object}
 */
const Patterns = {
  /**
   * Matches a comma used for delimiting arguments in a function declaration.
   * @type {RegExp}
   */
  ArgDelim: /,/,
  /**
   * Matches the argument declarations until the arrow sequence.
   * @return {RegExp}
   */
  ArrowArgs: /^([^\(]+?)=>/,
  /**
   * Matches single line and multiline JavaScript comments.
   * @type {RegExp}
   */
  Comments: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
  /**
   * Matches a single argument which captures non-whitespace characters into
   * group {@code 2}. If the function argument name has an underscore character
   * both preceding and following it, group {@code 1} will be '_'. This naming
   * convention is sometimes used when there are naming collisions but should
   * be used sparingly.
   * @see https://docs.angularjs.org/api/ngMock/function/angular.mock.inject#resolving-references-underscore-wrapping-
   * @type {RegExp}
   */
  FnArg: /^\s*(_?)(\S+?)\1\s*$/,
  FnArgs: /^[^\(]*\(\s*([^\)]*)\)/m,
}

/**
 * Determines if a function was declared using the arrow function syntax by
 * checking if the first instance of '=>' is greeater than the first index of
 * ')'.
 * @param  {String} stringified function
 * @return {Boolean}
 */
const isArrowFn = (body) => body.indexOf('=>') > body.indexOf(')')

/**
 * Determines the type of RegExp to use when matching parameters.
 * @param  {String} body stringified function
 * @return {RegExp} regex object for matching parameters
 */
const argsPattern = (body) => isArrowFn(body) ? Patterns.ArrowArgs : Patterns.FnArgs

/**
 * Convenience method for calling {@code Function.prototype.toString()}
 * @param  {Function} fn
 * @return {String}
 */
const stringifyFn = (fn) => Function.prototype.toString.call(fn)

/**
 * Attempts to parse the argument names from a given Function.
 * <p/>
 * Note: it is not possible to "reflect" default or rest type arguments as they
 * are not present in the resulting String produced by
 * {@code Function.prototype.toString()}. These arguments are also excluded
 * from the {@code Function.prototype.length} property on the Function.
 * @param  {Function} fn reflection target
 * @return {Array.<String>} array of function argument names
 */
export const reflectArguments = (fn) => {
  if (fn.length === 0) {
    return []
  }

  // grab the stringified function body and strip the comments from it
  const fnText = stringifyFn(fn).replace(Patterns.Comments, '')

  // pull the match from the RegExp#exec(String) call
  const [ _text, match ] = argsPattern(fnText).exec(fnText)

  // split the match by the argument delimeter pattern and extract just the
  // name from each 
  return match.split(Patterns.ArgDelim)
    .map((arg) => arg.replace(Patterns.FnArg, (all, underscore, name) => name))
}
