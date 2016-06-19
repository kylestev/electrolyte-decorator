# electrolyte-decorator
Handy wrappers for annotating electrolyte components by reflecting
dependencies from the factory method parameter list.

## Example
`components/settings.js`

```es6
import { Annotations, decorate } from 'electrolyte-decorator'

// Note the Annotations.Singleton reference being passed as the last argument
// into the decorate method. The decorate method has a signature of:
//
// (Function componentFactory, ... Function componentAnnotations)
//
// This allows us to pass any number (including 0!) of annotations we want to
// apply to our componentFactory. Annotations are Functions that take zero
// arguments and return an object whose keys and values should be assigned onto
// the target function when applied.
//
// This package only supports the @require and @singleton annotations that
// electrolyte ships with. If more annotations are added in the future,
// it is trivial to add support for them.
module.exports = decorate(function () {
  return {
    sqliteFile: ':memory:'
  }
}, Annotations.Singleton)
```

`components/sqlite.js`

```es6
import sqlite3 from 'sqlite3'
import { decorate } from 'electrolyte-decorator'

// The decorate method inspects the name of the declared function arguments
// and automatically manages setting them for this component.
// This is a shorthand for module.exports['@require'] = [ 'settings' ]
module.exports = decorate(function (settings) {
  return new sqlite3.Database(settings.sqliteFile)
})
```
