/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
  // The deferred used on DOM ready
  readyList,

  // A central reference to the root jQuery(document)
  rootjQuery,

  // Support: IE<9
  // For `typeof node.method` instead of `node.method !== undefined`
  core_strundefined = typeof undefined,

  // Use the correct document accordingly with window argument (sandbox)
  document = window.document,
  location = window.location,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // [[Class]] -> type pairs
  class2type = {},

  // List of deleted data cache ids, so we can reuse them
  core_deletedIds = [],

  core_version = "1.9.1",

  // Save a reference to some core methods
  core_concat = core_deletedIds.concat,
  core_push = core_deletedIds.push,
  core_slice = core_deletedIds.slice,
  core_indexOf = core_deletedIds.indexOf,
  core_toString = class2type.toString,
  core_hasOwn = class2type.hasOwnProperty,
  core_trim = core_version.trim,

  // Define a local copy of jQuery
  jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Used for matching numbers
  core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

  // Used for splitting on whitespace
  core_rnotwhite = /\S+/g,

  // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  // Strict HTML recognition (#11290: must start with <)
  rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

  // Matches dashed string for camelizing
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return letter.toUpperCase();
  },

  // The ready event handler
  completed = function( event ) {

    // readyState === "complete" is good enough for us to call the dom ready in oldIE
    if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
      detach();
      jQuery.ready();
    }
  },
  // Clean-up method for dom ready events
  detach = function() {
    if ( document.addEventListener ) {
      document.removeEventListener( "DOMContentLoaded", completed, false );
      window.removeEventListener( "load", completed, false );

    } else {
      document.detachEvent( "onreadystatechange", completed );
      window.detachEvent( "onload", completed );
    }
  };

jQuery.fn = jQuery.prototype = {
  // The current version of jQuery being used
  jquery: core_version,

  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = rquickExpr.exec( selector );
      }

      // Match html or make sure no context is specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;

          // scripts is true for back-compat
          jQuery.merge( this, jQuery.parseHTML(
            match[1],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          ) );

          // HANDLE: $(html, props)
          if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
            for ( match in context ) {
              // Properties of context are called as methods if possible
              if ( jQuery.isFunction( this[ match ] ) ) {
                this[ match ]( context[ match ] );

              // ...and otherwise set as attributes
              } else {
                this.attr( match, context[ match ] );
              }
            }
          }

          return this;

        // HANDLE: $(#id)
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(DOMElement)
    } else if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return core_slice.call( this );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;
    ret.context = this.context;

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
  },

  slice: function() {
    return this.pushStack( core_slice.apply( this, arguments ) );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  eq: function( i ) {
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: core_push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var src, copyIsArray, copy, name, options, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }

    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( !document.body ) {
      return setTimeout( jQuery.ready );
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }

    // If there are functions bound, to execute
    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    if ( jQuery.fn.trigger ) {
      jQuery( document ).trigger("ready").off("ready");
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  isWindow: function( obj ) {
    return obj != null && obj == obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    if ( obj == null ) {
      return String( obj );
    }
    return typeof obj === "object" || typeof obj === "function" ?
      class2type[ core_toString.call(obj) ] || "object" :
      typeof obj;
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !core_hasOwn.call(obj, "constructor") &&
        !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || core_hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  // data: string of html
  // context (optional): If specified, the fragment will be created in this context, defaults to document
  // keepScripts (optional): If true, will include scripts passed in the html string
  parseHTML: function( data, context, keepScripts ) {
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    if ( typeof context === "boolean" ) {
      keepScripts = context;
      context = false;
    }
    context = context || document;

    var parsed = rsingleTag.exec( data ),
      scripts = !keepScripts && [];

    // Single tag
    if ( parsed ) {
      return [ context.createElement( parsed[1] ) ];
    }

    parsed = jQuery.buildFragment( [ data ], context, scripts );
    if ( scripts ) {
      jQuery( scripts ).remove();
    }
    return jQuery.merge( [], parsed.childNodes );
  },

  parseJSON: function( data ) {
    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    if ( data === null ) {
      return data;
    }

    if ( typeof data === "string" ) {

      // Make sure leading/trailing whitespace is removed (IE can't handle it)
      data = jQuery.trim( data );

      if ( data ) {
        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
          .replace( rvalidtokens, "]" )
          .replace( rvalidbraces, "")) ) {

          return ( new Function( "return " + data ) )();
        }
      }
    }

    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && jQuery.trim( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  },

  // args is for internal usage only
  each: function( obj, callback, args ) {
    var value,
      i = 0,
      length = obj.length,
      isArray = isArraylike( obj );

    if ( args ) {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.apply( obj[ i ], args );

          if ( value === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      } else {
        for ( i in obj ) {
          value = callback.call( obj[ i ], i, obj[ i ] );

          if ( value === false ) {
            break;
          }
        }
      }
    }

    return obj;
  },

  // Use native String.trim function wherever possible
  trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
    function( text ) {
      return text == null ?
        "" :
        core_trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
    },

  // results is for internal usage only
  makeArray: function( arr, results ) {
    var ret = results || [];

    if ( arr != null ) {
      if ( isArraylike( Object(arr) ) ) {
        jQuery.merge( ret,
          typeof arr === "string" ?
          [ arr ] : arr
        );
      } else {
        core_push.call( ret, arr );
      }
    }

    return ret;
  },

  inArray: function( elem, arr, i ) {
    var len;

    if ( arr ) {
      if ( core_indexOf ) {
        return core_indexOf.call( arr, elem, i );
      }

      len = arr.length;
      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

      for ( ; i < len; i++ ) {
        // Skip accessing in sparse arrays
        if ( i in arr && arr[ i ] === elem ) {
          return i;
        }
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var l = second.length,
      i = first.length,
      j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }
    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var retVal,
      ret = [],
      i = 0,
      length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value,
      i = 0,
      length = elems.length,
      isArray = isArraylike( elems ),
      ret = [];

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( i in elems ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return core_concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    var args, proxy, tmp;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
  },

  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
    var i = 0,
      length = elems.length,
      bulk = key == null;

    // Sets many values
    if ( jQuery.type( key ) === "object" ) {
      chainable = true;
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
      }

    // Sets one value
    } else if ( value !== undefined ) {
      chainable = true;

      if ( !jQuery.isFunction( value ) ) {
        raw = true;
      }

      if ( bulk ) {
        // Bulk operations run against the entire set
        if ( raw ) {
          fn.call( elems, value );
          fn = null;

        // ...except when executing function values
        } else {
          bulk = fn;
          fn = function( elem, key, value ) {
            return bulk.call( jQuery( elem ), value );
          };
        }
      }

      if ( fn ) {
        for ( ; i < length; i++ ) {
          fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
        }
      }
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: function() {
    return ( new Date() ).getTime();
  }
});

jQuery.ready.promise = function( obj ) {
  if ( !readyList ) {

    readyList = jQuery.Deferred();

    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( jQuery.ready );

    // Standards-based browsers support DOMContentLoaded
    } else if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", completed, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", completed, false );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", completed );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", completed );

      // If IE and not a frame
      // continually check to see if the document is ready
      var top = false;

      try {
        top = window.frameElement == null && document.documentElement;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !jQuery.isReady ) {

            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll("left");
            } catch(e) {
              return setTimeout( doScrollCheck, 50 );
            }

            // detach all dom ready events
            detach();

            // and execute any waiting functions
            jQuery.ready();
          }
        })();
      }
    }
  }
  return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
  var length = obj.length,
    type = jQuery.type( obj );

  if ( jQuery.isWindow( obj ) ) {
    return false;
  }

  if ( obj.nodeType === 1 && length ) {
    return true;
  }

  return type === "array" || type !== "function" &&
    ( length === 0 ||
    typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Flag to know if list is currently firing
    firing,
    // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" ) {
                if ( !options.unique || !self.has( arg ) ) {
                  list.push( arg );
                }
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Check if a given callback is in the list.
      // If no argument is given, return whether or not list has callbacks attached.
      has: function( fn ) {
        return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        if ( list && ( !fired || stack ) ) {
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};
jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ](function() {
                var returned = fn && fn.apply( this, arguments );
                if ( returned && jQuery.isFunction( returned.promise ) ) {
                  returned.promise()
                    .done( newDefer.resolve )
                    .fail( newDefer.reject )
                    .progress( newDefer.notify );
                } else {
                  newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                }
              });
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ]
      deferred[ tuple[0] ] = function() {
        deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
        return this;
      };
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }
});
jQuery.support = (function() {

  var support, all, a,
    input, select, fragment,
    opt, eventName, isSupported, i,
    div = document.createElement("div");

  // Setup
  div.setAttribute( "className", "t" );
  div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

  // Support tests won't run in some limited or non-browser environments
  all = div.getElementsByTagName("*");
  a = div.getElementsByTagName("a")[ 0 ];
  if ( !all || !a || !all.length ) {
    return {};
  }

  // First batch of tests
  select = document.createElement("select");
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName("input")[ 0 ];

  a.style.cssText = "top:1px;float:left;opacity:.5";
  support = {
    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: div.firstChild.nodeType === 3,

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName("tbody").length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName("link").length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: a.getAttribute("href") === "/a",

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.5/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
    checkOn: !!input.value,

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Tests for enctype support on a form (#6743)
    enctype: !!document.createElement("form").enctype,

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

    // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
    boxModel: document.compatMode === "CSS1Compat",

    // Will be defined later
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true,
    boxSizingReliable: true,
    pixelPosition: false
  };

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Support: IE<9
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  // Check if we can trust getAttribute("value")
  input = document.createElement("input");
  input.setAttribute( "value", "" );
  support.input = input.getAttribute( "value" ) === "";

  // Check if an input maintains its value after becoming a radio
  input.value = "t";
  input.setAttribute( "type", "radio" );
  support.radioValue = input.value === "t";

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "checked", "t" );
  input.setAttribute( "name", "t" );

  fragment = document.createDocumentFragment();
  fragment.appendChild( input );

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Support: IE<9
  // Opera does not clone events (and typeof div.attachEvent === undefined).
  // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
  if ( div.attachEvent ) {
    div.attachEvent( "onclick", function() {
      support.noCloneEvent = false;
    });

    div.cloneNode( true ).click();
  }

  // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
  // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
  for ( i in { submit: true, change: true, focusin: true }) {
    div.setAttribute( eventName = "on" + i, "t" );

    support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
  }

  div.style.backgroundClip = "content-box";
  div.cloneNode( true ).style.backgroundClip = "";
  support.clearCloneStyle = div.style.backgroundClip === "content-box";

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, marginDiv, tds,
      divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
      body = document.getElementsByTagName("body")[0];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    container = document.createElement("div");
    container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

    body.appendChild( container ).appendChild( div );

    // Support: IE8
    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName("td");
    tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Support: IE8
    // Check if empty table cells still have offsetWidth/Height
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

    // Check box-sizing and margin behavior
    div.innerHTML = "";
    div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
    support.boxSizing = ( div.offsetWidth === 4 );
    support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

    // Use window.getComputedStyle because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
      support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. (#3333)
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      marginDiv = div.appendChild( document.createElement("div") );
      marginDiv.style.cssText = div.style.cssText = divReset;
      marginDiv.style.marginRight = marginDiv.style.width = "0";
      div.style.width = "1px";

      support.reliableMarginRight =
        !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
    }

    if ( typeof div.style.zoom !== core_strundefined ) {
      // Support: IE<8
      // Check if natively block-level elements act like inline-block
      // elements when setting their display to 'inline' and giving
      // them layout
      div.innerHTML = "";
      div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
      support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

      // Support: IE6
      // Check if elements with layout shrink-wrap their children
      div.style.display = "block";
      div.innerHTML = "<div></div>";
      div.firstChild.style.width = "5px";
      support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

      if ( support.inlineBlockNeedsLayout ) {
        // Prevent IE 6 from affecting layout for positioned elements #11048
        // Prevent IE from shrinking the body in IE 7 mode #12869
        // Support: IE<8
        body.style.zoom = 1;
      }
    }

    body.removeChild( container );

    // Null elements to avoid leaks in IE
    container = div = tds = marginDiv = null;
  });

  // Null elements to avoid leaks in IE
  all = select = fragment = opt = a = input = null;

  return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
  rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
  if ( !jQuery.acceptData( elem ) ) {
    return;
  }

  var thisCache, ret,
    internalKey = jQuery.expando,
    getByName = typeof name === "string",

    // We have to handle DOM nodes and JS objects differently because IE6-7
    // can't GC object references properly across the DOM-JS boundary
    isNode = elem.nodeType,

    // Only DOM nodes need the global jQuery cache; JS object data is
    // attached directly to the object so GC can occur automatically
    cache = isNode ? jQuery.cache : elem,

    // Only defining an ID for JS objects if its cache already exists allows
    // the code to shortcut on the same path as a DOM node with no cache
    id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

  // Avoid doing any more work than we need to when trying to get data on an
  // object that has no data at all
  if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
    return;
  }

  if ( !id ) {
    // Only DOM nodes need a new unique ID for each element since their data
    // ends up in the global cache
    if ( isNode ) {
      elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
    } else {
      id = internalKey;
    }
  }

  if ( !cache[ id ] ) {
    cache[ id ] = {};

    // Avoids exposing jQuery metadata on plain JS objects when the object
    // is serialized using JSON.stringify
    if ( !isNode ) {
      cache[ id ].toJSON = jQuery.noop;
    }
  }

  // An object can be passed to jQuery.data instead of a key/value pair; this gets
  // shallow copied over onto the existing cache
  if ( typeof name === "object" || typeof name === "function" ) {
    if ( pvt ) {
      cache[ id ] = jQuery.extend( cache[ id ], name );
    } else {
      cache[ id ].data = jQuery.extend( cache[ id ].data, name );
    }
  }

  thisCache = cache[ id ];

  // jQuery data() is stored in a separate object inside the object's internal data
  // cache in order to avoid key collisions between internal data and user-defined
  // data.
  if ( !pvt ) {
    if ( !thisCache.data ) {
      thisCache.data = {};
    }

    thisCache = thisCache.data;
  }

  if ( data !== undefined ) {
    thisCache[ jQuery.camelCase( name ) ] = data;
  }

  // Check for both converted-to-camel and non-converted data property names
  // If a data property was specified
  if ( getByName ) {

    // First Try to find as-is property data
    ret = thisCache[ name ];

    // Test for null|undefined property data
    if ( ret == null ) {

      // Try to find the camelCased property
      ret = thisCache[ jQuery.camelCase( name ) ];
    }
  } else {
    ret = thisCache;
  }

  return ret;
}

function internalRemoveData( elem, name, pvt ) {
  if ( !jQuery.acceptData( elem ) ) {
    return;
  }

  var i, l, thisCache,
    isNode = elem.nodeType,

    // See jQuery.data for more information
    cache = isNode ? jQuery.cache : elem,
    id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

  // If there is already no cache entry for this object, there is no
  // purpose in continuing
  if ( !cache[ id ] ) {
    return;
  }

  if ( name ) {

    thisCache = pvt ? cache[ id ] : cache[ id ].data;

    if ( thisCache ) {

      // Support array or space separated string names for data keys
      if ( !jQuery.isArray( name ) ) {

        // try the string as a key before any manipulation
        if ( name in thisCache ) {
          name = [ name ];
        } else {

          // split the camel cased version by spaces unless a key with the spaces exists
          name = jQuery.camelCase( name );
          if ( name in thisCache ) {
            name = [ name ];
          } else {
            name = name.split(" ");
          }
        }
      } else {
        // If "name" is an array of keys...
        // When data is initially created, via ("key", "val") signature,
        // keys will be converted to camelCase.
        // Since there is no way to tell _how_ a key was added, remove
        // both plain key and camelCase key. #12786
        // This will only penalize the array argument path.
        name = name.concat( jQuery.map( name, jQuery.camelCase ) );
      }

      for ( i = 0, l = name.length; i < l; i++ ) {
        delete thisCache[ name[i] ];
      }

      // If there is no data left in the cache, we want to continue
      // and let the cache object itself get destroyed
      if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
        return;
      }
    }
  }

  // See jQuery.data for more information
  if ( !pvt ) {
    delete cache[ id ].data;

    // Don't destroy the parent cache unless the internal data object
    // had been the only thing left in it
    if ( !isEmptyDataObject( cache[ id ] ) ) {
      return;
    }
  }

  // Destroy the cache
  if ( isNode ) {
    jQuery.cleanData( [ elem ], true );

  // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
  } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
    delete cache[ id ];

  // When all else fails, null
  } else {
    cache[ id ] = null;
  }
}

jQuery.extend({
  cache: {},

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data ) {
    return internalData( elem, name, data );
  },

  removeData: function( elem, name ) {
    return internalRemoveData( elem, name );
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return internalData( elem, name, data, true );
  },

  _removeData: function( elem, name ) {
    return internalRemoveData( elem, name, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    // Do not set data on non-element because it will not be cleared (#8335).
    if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
      return false;
    }

    var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

    // nodes accept data unless otherwise specified; rejection can be conditional
    return !noData || noData !== true && elem.getAttribute("classid") === noData;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var attrs, name,
      elem = this[0],
      i = 0,
      data = null;

    // Gets all values
    if ( key === undefined ) {
      if ( this.length ) {
        data = jQuery.data( elem );

        if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
          attrs = elem.attributes;
          for ( ; i < attrs.length; i++ ) {
            name = attrs[i].name;

            if ( !name.indexOf( "data-" ) ) {
              name = jQuery.camelCase( name.slice(5) );

              dataAttr( elem, name, data[ name ] );
            }
          }
          jQuery._data( elem, "parsedAttrs", true );
        }
      }

      return data;
    }

    // Sets multiple values
    if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    return jQuery.access( this, function( value ) {

      if ( value === undefined ) {
        // Try to fetch any internally stored data first
        return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
      }

      this.each(function() {
        jQuery.data( this, key, value );
      });
    }, null, value, arguments.length > 1, null, true );
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {

    var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
          data === "false" ? false :
          data === "null" ? null :
          // Only convert to a number if it doesn't change the string
          +data + "" === data ? +data :
          rbrace.test( data ) ? jQuery.parseJSON( data ) :
            data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
  var name;
  for ( name in obj ) {

    // if the public data object is empty, the private is still empty
    if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
      continue;
    }
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}
jQuery.extend({
  queue: function( elem, type, data ) {
    var queue;

    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      queue = jQuery._data( elem, type );

      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !queue || jQuery.isArray(data) ) {
          queue = jQuery._data( elem, type, jQuery.makeArray(data) );
        } else {
          queue.push( data );
        }
      }
      return queue || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      startLength = queue.length,
      fn = queue.shift(),
      hooks = jQuery._queueHooks( elem, type ),
      next = function() {
        jQuery.dequeue( elem, type );
      };

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
      startLength--;
    }

    hooks.cur = fn;
    if ( fn ) {

      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift( "inprogress" );
      }

      // clear up the last queue stop function
      delete hooks.stop;
      fn.call( elem, next, hooks );
    }

    if ( !startLength && hooks ) {
      hooks.empty.fire();
    }
  },

  // not intended for public consumption - generates a queueHooks object, or returns the current one
  _queueHooks: function( elem, type ) {
    var key = type + "queueHooks";
    return jQuery._data( elem, key ) || jQuery._data( elem, key, {
      empty: jQuery.Callbacks("once memory").add(function() {
        jQuery._removeData( elem, type + "queue" );
        jQuery._removeData( elem, key );
      })
    });
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    var setter = 2;

    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    if ( arguments.length < setter ) {
      return jQuery.queue( this[0], type );
    }

    return data === undefined ?
      this :
      this.each(function() {
        var queue = jQuery.queue( this, type, data );

        // ensure a hooks for this queue
        jQuery._queueHooks( this, type );

        if ( type === "fx" && queue[0] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
      var timeout = setTimeout( next, time );
      hooks.stop = function() {
        clearTimeout( timeout );
      };
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, obj ) {
    var tmp,
      count = 1,
      defer = jQuery.Deferred(),
      elements = this,
      i = this.length,
      resolve = function() {
        if ( !( --count ) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      };

    if ( typeof type !== "string" ) {
      obj = type;
      type = undefined;
    }
    type = type || "fx";

    while( i-- ) {
      tmp = jQuery._data( elements[ i ], type + "queueHooks" );
      if ( tmp && tmp.empty ) {
        count++;
        tmp.empty.add( resolve );
      }
    }
    resolve();
    return defer.promise( obj );
  }
});
var nodeHook, boolHook,
  rclass = /[\t\r\n]/g,
  rreturn = /\r/g,
  rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i,
  rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
  ruseDefault = /^(?:checked|selected)$/i,
  getSetAttribute = jQuery.support.getSetAttribute,
  getSetInput = jQuery.support.input;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },

  prop: function( name, value ) {
    return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
  },

  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    var classes, elem, cur, clazz, j,
      i = 0,
      len = this.length,
      proceed = typeof value === "string" && value;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).addClass( value.call( this, j, this.className ) );
      });
    }

    if ( proceed ) {
      // The disjunction here is for better compressibility (see removeClass)
      classes = ( value || "" ).match( core_rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        cur = elem.nodeType === 1 && ( elem.className ?
          ( " " + elem.className + " " ).replace( rclass, " " ) :
          " "
        );

        if ( cur ) {
          j = 0;
          while ( (clazz = classes[j++]) ) {
            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
              cur += clazz + " ";
            }
          }
          elem.className = jQuery.trim( cur );

        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    var classes, elem, cur, clazz, j,
      i = 0,
      len = this.length,
      proceed = arguments.length === 0 || typeof value === "string" && value;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call( this, j, this.className ) );
      });
    }
    if ( proceed ) {
      classes = ( value || "" ).match( core_rnotwhite ) || [];

      for ( ; i < len; i++ ) {
        elem = this[ i ];
        // This expression is here for better compressibility (see addClass)
        cur = elem.nodeType === 1 && ( elem.className ?
          ( " " + elem.className + " " ).replace( rclass, " " ) :
          ""
        );

        if ( cur ) {
          j = 0;
          while ( (clazz = classes[j++]) ) {
            // Remove *all* instances
            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
              cur = cur.replace( " " + clazz + " ", " " );
            }
          }
          elem.className = value ? jQuery.trim( cur ) : "";
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.match( core_rnotwhite ) || [];

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space separated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      // Toggle whole class name
      } else if ( type === core_strundefined || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // If the element has a class name or if we're passed "false",
        // then remove the whole classname (if there was one, the above saved it).
        // Otherwise bring back whatever was previously saved (if anything),
        // falling back to the empty string if nothing was stored.
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var ret, hooks, isFunction,
      elem = this[0];

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return;
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var val,
        self = jQuery(this);

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value, option,
          options = elem.options,
          index = elem.selectedIndex,
          one = elem.type === "select-one" || index < 0,
          values = one ? null : [],
          max = one ? index + 1 : options.length,
          i = index < 0 ?
            max :
            one ? index : 0;

        // Loop through all the selected options
        for ( ; i < max; i++ ) {
          option = options[ i ];

          // oldIE doesn't update selected after form reset (#2551)
          if ( ( option.selected || i === index ) &&
              // Don't return options that are disabled or in a disabled optgroup
              ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
              ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  attr: function( elem, name, value ) {
    var hooks, notxml, ret,
      nType = elem.nodeType;

    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    // Fallback to prop when attributes are not supported
    if ( typeof elem.getAttribute === core_strundefined ) {
      return jQuery.prop( elem, name, value );
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // All attributes are lowercase
    // Grab necessary hook if one is defined
    if ( notxml ) {
      name = name.toLowerCase();
      hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );

      } else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, value + "" );
        return value;
      }

    } else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
      return ret;

    } else {

      // In IE9+, Flash objects don't have .getAttribute (#12945)
      // Support: IE9+
      if ( typeof elem.getAttribute !== core_strundefined ) {
        ret =  elem.getAttribute( name );
      }

      // Non-existent attributes return null, we normalize to undefined
      return ret == null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, value ) {
    var name, propName,
      i = 0,
      attrNames = value && value.match( core_rnotwhite );

    if ( attrNames && elem.nodeType === 1 ) {
      while ( (name = attrNames[i++]) ) {
        propName = jQuery.propFix[ name ] || name;

        // Boolean attributes get special treatment (#10870)
        if ( rboolean.test( name ) ) {
          // Set corresponding property to false for boolean attributes
          // Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
          if ( !getSetAttribute && ruseDefault.test( name ) ) {
            elem[ jQuery.camelCase( "default-" + name ) ] =
              elem[ propName ] = false;
          } else {
            elem[ propName ] = false;
          }

        // See #9699 for explanation of this approach (setting first, then removal)
        } else {
          jQuery.attr( elem, name, "" );
        }

        elem.removeAttribute( getSetAttribute ? name : propName );
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to default in case type is set after value during creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },

  prop: function( elem, name, value ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    if ( notxml ) {
      // Fix name and attach hooks
      name = jQuery.propFix[ name ] || name;
      hooks = jQuery.propHooks[ name ];
    }

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return ( elem[ name ] = value );
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },

  propHooks: {
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  }
});

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    var
      // Use .prop to determine if this attribute is understood as boolean
      prop = jQuery.prop( elem, name ),

      // Fetch it accordingly
      attr = typeof prop === "boolean" && elem.getAttribute( name ),
      detail = typeof prop === "boolean" ?

        getSetInput && getSetAttribute ?
          attr != null :
          // oldIE fabricates an empty string for missing boolean attributes
          // and conflates checked/selected into attroperties
          ruseDefault.test( name ) ?
            elem[ jQuery.camelCase( "default-" + name ) ] :
            !!attr :

        // fetch an attribute node for properties not recognized as boolean
        elem.getAttributeNode( name );

    return detail && detail.value !== false ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
      // IE<8 needs the *property* name
      elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

    // Use defaultChecked and defaultSelected for oldIE
    } else {
      elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
    }

    return name;
  }
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
  jQuery.attrHooks.value = {
    get: function( elem, name ) {
      var ret = elem.getAttributeNode( name );
      return jQuery.nodeName( elem, "input" ) ?

        // Ignore the value *property* by using defaultValue
        elem.defaultValue :

        ret && ret.specified ? ret.value : undefined;
    },
    set: function( elem, value, name ) {
      if ( jQuery.nodeName( elem, "input" ) ) {
        // Does not return so that setAttribute is also used
        elem.defaultValue = value;
      } else {
        // Use nodeHook if defined (#1954); otherwise setAttribute is fine
        return nodeHook && nodeHook.set( elem, value, name );
      }
    }
  };
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

  // Use this for any attribute in IE6/7
  // This fixes almost every IE6/7 issue
  nodeHook = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret = elem.getAttributeNode( name );
      return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
        ret.value :
        undefined;
    },
    set: function( elem, value, name ) {
      // Set the existing or create a new attribute node
      var ret = elem.getAttributeNode( name );
      if ( !ret ) {
        elem.setAttributeNode(
          (ret = elem.ownerDocument.createAttribute( name ))
        );
      }

      ret.value = value += "";

      // Break association with cloned elements by also using setAttribute (#9646)
      return name === "value" || value === elem.getAttribute( name ) ?
        value :
        undefined;
    }
  };

  // Set contenteditable to false on removals(#10429)
  // Setting to empty string throws an error as an invalid value
  jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function( elem, value, name ) {
      nodeHook.set( elem, value === "" ? false : value, name );
    }
  };

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret == null ? undefined : ret;
      }
    });
  });

  // href/src property should get the full normalized URL (#10299/#12915)
  jQuery.each([ "href", "src" ], function( i, name ) {
    jQuery.propHooks[ name ] = {
      get: function( elem ) {
        return elem.getAttribute( name, 4 );
      }
    };
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Note: IE uppercases css property names, but if we were to .toLowerCase()
      // .cssText, that would destroy case senstitivity in URL's, like in "background"
      return elem.style.cssText || undefined;
    },
    set: function( elem, value ) {
      return ( elem.style.cssText = value + "" );
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
      return null;
    }
  });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
  jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      }
    }
  });
});
var rformElems = /^(?:input|select|textarea)$/i,
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|contextmenu)|click/,
  rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
  rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
  return true;
}

function returnFalse() {
  return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

  global: {},

  add: function( elem, types, handler, data, selector ) {
    var tmp, events, t, handleObjIn,
      special, eventHandle, handleObj,
      handlers, type, namespaces, origType,
      elemData = jQuery._data( elem );

    // Don't attach events to noData or text/comment nodes (but allow plain objects)
    if ( !elemData ) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    if ( !(events = elemData.events) ) {
      events = elemData.events = {};
    }
    if ( !(eventHandle = elemData.handle) ) {
      eventHandle = elemData.handle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
          undefined;
      };
      // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      eventHandle.elem = elem;
    }

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = ( types || "" ).match( core_rnotwhite ) || [""];
    t = types.length;
    while ( t-- ) {
      tmp = rtypenamespace.exec( types[t] ) || [];
      type = origType = tmp[1];
      namespaces = ( tmp[2] || "" ).split( "." ).sort();

      // If event changes its type, use the special event handlers for the changed type
      special = jQuery.event.special[ type ] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = ( selector ? special.delegateType : special.bindType ) || type;

      // Update special based on newly reset type
      special = jQuery.event.special[ type ] || {};

      // handleObj is passed to all event handlers
      handleObj = jQuery.extend({
        type: type,
        origType: origType,
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
        namespace: namespaces.join(".")
      }, handleObjIn );

      // Init the event handler queue if we're the first
      if ( !(handlers = events[ type ]) ) {
        handlers = events[ type ] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
      } else {
        handlers.push( handleObj );
      }

      // Keep track of which events have ever been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, selector, mappedTypes ) {
    var j, handleObj, tmp,
      origCount, t, events,
      special, handlers, type,
      namespaces, origType,
      elemData = jQuery.hasData( elem ) && jQuery._data( elem );

    if ( !elemData || !(events = elemData.events) ) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = ( types || "" ).match( core_rnotwhite ) || [""];
    t = types.length;
    while ( t-- ) {
      tmp = rtypenamespace.exec( types[t] ) || [];
      type = origType = tmp[1];
      namespaces = ( tmp[2] || "" ).split( "." ).sort();

      // Unbind all events (on this namespace, if provided) for the element
      if ( !type ) {
        for ( type in events ) {
          jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
        }
        continue;
      }

      special = jQuery.event.special[ type ] || {};
      type = ( selector ? special.delegateType : special.bindType ) || type;
      handlers = events[ type ] || [];
      tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

      // Remove matching events
      origCount = j = handlers.length;
      while ( j-- ) {
        handleObj = handlers[ j ];

        if ( ( mappedTypes || origType === handleObj.origType ) &&
          ( !handler || handler.guid === handleObj.guid ) &&
          ( !tmp || tmp.test( handleObj.namespace ) ) &&
          ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
          handlers.splice( j, 1 );

          if ( handleObj.selector ) {
            handlers.delegateCount--;
          }
          if ( special.remove ) {
            special.remove.call( elem, handleObj );
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if ( origCount && !handlers.length ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      delete elemData.handle;

      // removeData also checks for emptiness and clears the expando if empty
      // so use it instead of delete
      jQuery._removeData( elem, "events" );
    }
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    var handle, ontype, cur,
      bubbleType, special, tmp, i,
      eventPath = [ elem || document ],
      type = core_hasOwn.call( event, "type" ) ? event.type : event,
      namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

    cur = tmp = elem = elem || document;

    // Don't do events on text and comment nodes
    if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
      return;
    }

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      return;
    }

    if ( type.indexOf(".") >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }
    ontype = type.indexOf(":") < 0 && "on" + type;

    // Caller can pass in a jQuery.Event object, Object, or just an event type string
    event = event[ jQuery.expando ] ?
      event :
      new jQuery.Event( type, typeof event === "object" && event );

    event.isTrigger = true;
    event.namespace = namespaces.join(".");
    event.namespace_re = event.namespace ?
      new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
      null;

    // Clean up the event in case it is being reused
    event.result = undefined;
    if ( !event.target ) {
      event.target = elem;
    }

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data == null ?
      [ event ] :
      jQuery.makeArray( data, [ event ] );

    // Allow special events to draw outside the lines
    special = jQuery.event.special[ type ] || {};
    if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
      return;
    }

    // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

      bubbleType = special.delegateType || type;
      if ( !rfocusMorph.test( bubbleType + type ) ) {
        cur = cur.parentNode;
      }
      for ( ; cur; cur = cur.parentNode ) {
        eventPath.push( cur );
        tmp = cur;
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      if ( tmp === (elem.ownerDocument || document) ) {
        eventPath.push( tmp.defaultView || tmp.parentWindow || window );
      }
    }

    // Fire handlers on the event path
    i = 0;
    while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

      event.type = i > 1 ?
        bubbleType :
        special.bindType || type;

      // jQuery handler
      handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
      if ( handle ) {
        handle.apply( cur, data );
      }

      // Native handler
      handle = ontype && cur[ ontype ];
      if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
        event.preventDefault();
      }
    }
    event.type = type;

    // If nobody prevented the default action, do it now
    if ( !onlyHandlers && !event.isDefaultPrevented() ) {

      if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction() check here because IE6/7 fails that test.
        // Don't do default actions on window, that's where global variables be (#6170)
        if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

          // Don't re-trigger an onFOO event when we call its FOO() method
          tmp = elem[ ontype ];

          if ( tmp ) {
            elem[ ontype ] = null;
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          jQuery.event.triggered = type;
          try {
            elem[ type ]();
          } catch ( e ) {
            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
          }
          jQuery.event.triggered = undefined;

          if ( tmp ) {
            elem[ ontype ] = tmp;
          }
        }
      }
    }

    return event.result;
  },

  dispatch: function( event ) {

    // Make a writable jQuery.Event from the native event object
    event = jQuery.event.fix( event );

    var i, ret, handleObj, matched, j,
      handlerQueue = [],
      args = core_slice.call( arguments ),
      handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
      special = jQuery.event.special[ event.type ] || {};

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      return;
    }

    // Determine handlers
    handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    // Run delegates first; they may want to stop propagation beneath us
    i = 0;
    while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
      event.currentTarget = matched.elem;

      j = 0;
      while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

        // Triggered event must either 1) have no namespace, or
        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
        if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

          event.handleObj = handleObj;
          event.data = handleObj.data;

          ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

          if ( ret !== undefined ) {
            if ( (event.result = ret) === false ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if ( special.postDispatch ) {
      special.postDispatch.call( this, event );
    }

    return event.result;
  },

  handlers: function( event, handlers ) {
    var sel, handleObj, matches, i,
      handlerQueue = [],
      delegateCount = handlers.delegateCount,
      cur = event.target;

    // Find delegate handlers
    // Black-hole SVG <use> instance trees (#13180)
    // Avoid non-left-click bubbling in Firefox (#3861)
    if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

      for ( ; cur != this; cur = cur.parentNode || this ) {

        // Don't check non-elements (#13208)
        // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
        if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
          matches = [];
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];

            // Don't conflict with Object.prototype properties (#13203)
            sel = handleObj.selector + " ";

            if ( matches[ sel ] === undefined ) {
              matches[ sel ] = handleObj.needsContext ?
                jQuery( sel, this ).index( cur ) >= 0 :
                jQuery.find( sel, this, null, [ cur ] ).length;
            }
            if ( matches[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, handlers: matches });
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if ( delegateCount < handlers.length ) {
      handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
    }

    return handlerQueue;
  },

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // Create a writable copy of the event object and normalize some properties
    var i, prop, copy,
      type = event.type,
      originalEvent = event,
      fixHook = this.fixHooks[ type ];

    if ( !fixHook ) {
      this.fixHooks[ type ] = fixHook =
        rmouseEvent.test( type ) ? this.mouseHooks :
        rkeyEvent.test( type ) ? this.keyHooks :
        {};
    }
    copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

    event = new jQuery.Event( originalEvent );

    i = copy.length;
    while ( i-- ) {
      prop = copy[ i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Support: IE<9
    // Fix target property (#1925)
    if ( !event.target ) {
      event.target = originalEvent.srcElement || document;
    }

    // Support: Chrome 23+, Safari?
    // Target should not be a text node (#504, #13143)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // Support: IE<9
    // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
    event.metaKey = !!event.metaKey;

    return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
  },

  // Includes some event props shared by KeyEvent and MouseEvent
  props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

  fixHooks: {},

  keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

      // Add which for key events
      if ( event.which == null ) {
        event.which = original.charCode != null ? original.charCode : original.keyCode;
      }

      return event;
    }
  },

  mouseHooks: {
    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
      var body, eventDoc, doc,
        button = original.button,
        fromElement = original.fromElement;

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && original.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && fromElement ) {
        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && button !== undefined ) {
        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      }

      return event;
    }
  },

  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },
    click: {
      // For checkbox, fire native event so checked state will be right
      trigger: function() {
        if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
          this.click();
          return false;
        }
      }
    },
    focus: {
      // Fire native event if possible so blur/focus sequence is correct
      trigger: function() {
        if ( this !== document.activeElement && this.focus ) {
          try {
            this.focus();
            return false;
          } catch ( e ) {
            // Support: IE<9
            // If we error on focus to hidden element (#1486, #12518),
            // let .trigger() run the handlers
          }
        }
      },
      delegateType: "focusin"
    },
    blur: {
      trigger: function() {
        if ( this === document.activeElement && this.blur ) {
          this.blur();
          return false;
        }
      },
      delegateType: "focusout"
    },

    beforeunload: {
      postDispatch: function( event ) {

        // Even when returnValue equals to undefined Firefox will still show alert
        if ( event.result !== undefined ) {
          event.originalEvent.returnValue = event.result;
        }
      }
    }
  },

  simulate: function( type, elem, event, bubble ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    var e = jQuery.extend(
      new jQuery.Event(),
      event,
      { type: type,
        isSimulated: true,
        originalEvent: {}
      }
    );
    if ( bubble ) {
      jQuery.event.trigger( e, null, elem );
    } else {
      jQuery.event.dispatch.call( elem, e );
    }
    if ( e.isDefaultPrevented() ) {
      event.preventDefault();
    }
  }
};

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    var name = "on" + type;

    if ( elem.detachEvent ) {

      // #8545, #7054, preventing memory leaks for custom events in IE6-8
      // detachEvent needed property on element, by name of that event, to properly expose it to GC
      if ( typeof elem[ name ] === core_strundefined ) {
        elem[ name ] = null;
      }

      elem.detachEvent( name, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse,

  preventDefault: function() {
    var e = this.originalEvent;

    this.isDefaultPrevented = returnTrue;
    if ( !e ) {
      return;
    }

    // If preventDefault exists, run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // Support: IE
    // Otherwise set the returnValue property of the original event to false
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    var e = this.originalEvent;

    this.isPropagationStopped = returnTrue;
    if ( !e ) {
      return;
    }
    // If stopPropagation exists, run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }

    // Support: IE
    // Set the cancelBubble property of the original event to true
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  }
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    delegateType: fix,
    bindType: fix,

    handle: function( event ) {
      var ret,
        target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj;

      // For mousenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply( this, arguments );
        event.type = fix;
      }
      return ret;
    }
  };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Lazy-add a submit handler when a descendant form may potentially be submitted
      jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
        // Node name check avoids a VML-related crash in IE (#9807)
        var elem = e.target,
          form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
        if ( form && !jQuery._data( form, "submitBubbles" ) ) {
          jQuery.event.add( form, "submit._submit", function( event ) {
            event._submit_bubble = true;
          });
          jQuery._data( form, "submitBubbles", true );
        }
      });
      // return undefined since we don't need an event listener
    },

    postDispatch: function( event ) {
      // If form was submitted by the user, bubble the event up the tree
      if ( event._submit_bubble ) {
        delete event._submit_bubble;
        if ( this.parentNode && !event.isTrigger ) {
          jQuery.event.simulate( "submit", this.parentNode, event, true );
        }
      }
    },

    teardown: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
      jQuery.event.remove( this, "._submit" );
    }
  };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

  jQuery.event.special.change = {

    setup: function() {

      if ( rformElems.test( this.nodeName ) ) {
        // IE doesn't fire change on a check/radio until blur; trigger it on click
        // after a propertychange. Eat the blur-change in special.change.handle.
        // This still fires onchange a second time for check/radio after blur.
        if ( this.type === "checkbox" || this.type === "radio" ) {
          jQuery.event.add( this, "propertychange._change", function( event ) {
            if ( event.originalEvent.propertyName === "checked" ) {
              this._just_changed = true;
            }
          });
          jQuery.event.add( this, "click._change", function( event ) {
            if ( this._just_changed && !event.isTrigger ) {
              this._just_changed = false;
            }
            // Allow triggered, simulated change events (#11500)
            jQuery.event.simulate( "change", this, event, true );
          });
        }
        return false;
      }
      // Delegated event; lazy-add a change handler on descendant inputs
      jQuery.event.add( this, "beforeactivate._change", function( e ) {
        var elem = e.target;

        if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
          jQuery.event.add( elem, "change._change", function( event ) {
            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
              jQuery.event.simulate( "change", this.parentNode, event, true );
            }
          });
          jQuery._data( elem, "changeBubbles", true );
        }
      });
    },

    handle: function( event ) {
      var elem = event.target;

      // Swallow native change events from checkbox/radio, we already triggered them above
      if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
        return event.handleObj.handler.apply( this, arguments );
      }
    },

    teardown: function() {
      jQuery.event.remove( this, "._change" );

      return !rformElems.test( this.nodeName );
    }
  };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0,
      handler = function( event ) {
        jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      };

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };
  });
}

jQuery.fn.extend({

  on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var type, origFn;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {
      // ( types-Object, selector, data )
      if ( typeof selector !== "string" ) {
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }
      for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
      }
      return this;
    }

    if ( data == null && fn == null ) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if ( fn == null ) {
      if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if ( fn === false ) {
      fn = returnFalse;
    } else if ( !fn ) {
      return this;
    }

    if ( one === 1 ) {
      origFn = fn;
      fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
      };
      // Use same guid so caller can remove using origFn
      fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return this.each( function() {
      jQuery.event.add( this, types, fn, data, selector );
    });
  },
  one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
  },
  off: function( types, selector, fn ) {
    var handleObj, type;
    if ( types && types.preventDefault && types.handleObj ) {
      // ( event )  dispatched jQuery.Event
      handleObj = types.handleObj;
      jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
      );
      return this;
    }
    if ( typeof types === "object" ) {
      // ( types-object [, selector] )
      for ( type in types ) {
        this.off( type, selector, types[ type ] );
      }
      return this;
    }
    if ( selector === false || typeof selector === "function" ) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }
    if ( fn === false ) {
      fn = returnFalse;
    }
    return this.each(function() {
      jQuery.event.remove( this, types, fn, selector );
    });
  },

  bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
  },
  unbind: function( types, fn ) {
    return this.off( types, null, fn );
  },

  delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
  },
  undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },
  triggerHandler: function( type, data ) {
    var elem = this[0];
    if ( elem ) {
      return jQuery.event.trigger( type, data, elem, true );
    }
  }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
  cachedruns,
  Expr,
  getText,
  isXML,
  compile,
  hasDuplicate,
  outermostContext,

  // Local document vars
  setDocument,
  document,
  docElem,
  documentIsXML,
  rbuggyQSA,
  rbuggyMatches,
  matches,
  contains,
  sortOrder,

  // Instance-specific data
  expando = "sizzle" + -(new Date()),
  preferredDoc = window.document,
  support = {},
  dirruns = 0,
  done = 0,
  classCache = createCache(),
  tokenCache = createCache(),
  compilerCache = createCache(),

  // General-purpose constants
  strundefined = typeof undefined,
  MAX_NEGATIVE = 1 << 31,

  // Array methods
  arr = [],
  pop = arr.pop,
  push = arr.push,
  slice = arr.slice,
  // Use a stripped-down indexOf if we can't use a native one
  indexOf = arr.indexOf || function( elem ) {
    var i = 0,
      len = this.length;
    for ( ; i < len; i++ ) {
      if ( this[i] === elem ) {
        return i;
      }
    }
    return -1;
  },


  // Regular expressions

  // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
  whitespace = "[\\x20\\t\\r\\n\\f]",
  // http://www.w3.org/TR/css3-syntax/#characters
  characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

  // Loosely modeled on CSS identifier characters
  // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
  // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  identifier = characterEncoding.replace( "w", "w#" ),

  // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
  operators = "([*^$|!~]?=)",
  attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
    "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

  // Prefer arguments quoted,
  //   then not containing pseudos/brackets,
  //   then attribute selectors/non-parenthetical expressions,
  //   then anything else
  // These preferences are here to reduce the number of selectors
  //   needing tokenize in the PSEUDO preFilter
  pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

  // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
  rpseudo = new RegExp( pseudos ),
  ridentifier = new RegExp( "^" + identifier + "$" ),

  matchExpr = {
    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
    "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
    "ATTR": new RegExp( "^" + attributes ),
    "PSEUDO": new RegExp( "^" + pseudos ),
    "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
      "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    // For use in libraries implementing .is()
    // We use this for POS matching in `select`
    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
      whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
  },

  rsibling = /[\x20\t\r\n\f]*[+~]/,

  rnative = /^[^{]+\{\s*\[native code/,

  // Easily-parseable/retrievable ID or TAG or CLASS selectors
  rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

  rinputs = /^(?:input|select|textarea|button)$/i,
  rheader = /^h\d$/i,

  rescape = /'|\\/g,
  rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

  // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
  runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
  funescape = function( _, escaped ) {
    var high = "0x" + escaped - 0x10000;
    // NaN means non-codepoint
    return high !== high ?
      escaped :
      // BMP codepoint
      high < 0 ?
        String.fromCharCode( high + 0x10000 ) :
        // Supplemental Plane codepoint (surrogate pair)
        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
  };

// Use a stripped-down slice if we can't use a native one
try {
  slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
  slice = function( i ) {
    var elem,
      results = [];
    while ( (elem = this[i++]) ) {
      results.push( elem );
    }
    return results;
  };
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
  return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *  property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *  deleting the oldest entry
 */
function createCache() {
  var cache,
    keys = [];

  return (cache = function( key, value ) {
    // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    if ( keys.push( key += " " ) > Expr.cacheLength ) {
      // Only keep the most recent entries
      delete cache[ keys.shift() ];
    }
    return (cache[ key ] = value);
  });
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
  fn[ expando ] = true;
  return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
  var div = document.createElement("div");

  try {
    return fn( div );
  } catch (e) {
    return false;
  } finally {
    // release memory in IE
    div = null;
  }
}

function Sizzle( selector, context, results, seed ) {
  var match, elem, m, nodeType,
    // QSA vars
    i, groups, old, nid, newContext, newSelector;

  if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
    setDocument( context );
  }

  context = context || document;
  results = results || [];

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
    return [];
  }

  if ( !documentIsXML && !seed ) {

    // Shortcuts
    if ( (match = rquickExpr.exec( selector )) ) {
      // Speed-up: Sizzle("#ID")
      if ( (m = match[1]) ) {
        if ( nodeType === 9 ) {
          elem = context.getElementById( m );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE, Opera, and Webkit return items
            // by name instead of ID
            if ( elem.id === m ) {
              results.push( elem );
              return results;
            }
          } else {
            return results;
          }
        } else {
          // Context is not a document
          if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
            contains( context, elem ) && elem.id === m ) {
            results.push( elem );
            return results;
          }
        }

      // Speed-up: Sizzle("TAG")
      } else if ( match[2] ) {
        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
        return results;

      // Speed-up: Sizzle(".CLASS")
      } else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
        return results;
      }
    }

    // QSA path
    if ( support.qsa && !rbuggyQSA.test(selector) ) {
      old = true;
      nid = expando;
      newContext = context;
      newSelector = nodeType === 9 && selector;

      // qSA works strangely on Element-rooted queries
      // We can work around this by specifying an extra ID on the root
      // and working up from there (Thanks to Andrew Dupont for the technique)
      // IE 8 doesn't work on object elements
      if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
        groups = tokenize( selector );

        if ( (old = context.getAttribute("id")) ) {
          nid = old.replace( rescape, "\\$&" );
        } else {
          context.setAttribute( "id", nid );
        }
        nid = "[id='" + nid + "'] ";

        i = groups.length;
        while ( i-- ) {
          groups[i] = nid + toSelector( groups[i] );
        }
        newContext = rsibling.test( selector ) && context.parentNode || context;
        newSelector = groups.join(",");
      }

      if ( newSelector ) {
        try {
          push.apply( results, slice.call( newContext.querySelectorAll(
            newSelector
          ), 0 ) );
          return results;
        } catch(qsaError) {
        } finally {
          if ( !old ) {
            context.removeAttribute("id");
          }
        }
      }
    }
  }

  // All others
  return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
  var doc = node ? node.ownerDocument || node : preferredDoc;

  // If no document and documentElement is available, return
  if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
    return document;
  }

  // Set our document
  document = doc;
  docElem = doc.documentElement;

  // Support tests
  documentIsXML = isXML( doc );

  // Check if getElementsByTagName("*") returns only elements
  support.tagNameNoComments = assert(function( div ) {
    div.appendChild( doc.createComment("") );
    return !div.getElementsByTagName("*").length;
  });

  // Check if attributes should be retrieved by attribute nodes
  support.attributes = assert(function( div ) {
    div.innerHTML = "<select></select>";
    var type = typeof div.lastChild.getAttribute("multiple");
    // IE8 returns a string for some attributes even when not present
    return type !== "boolean" && type !== "string";
  });

  // Check if getElementsByClassName can be trusted
  support.getByClassName = assert(function( div ) {
    // Opera can't find a second classname (in 9.6)
    div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
    if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
      return false;
    }

    // Safari 3.2 caches class attributes and doesn't catch changes
    div.lastChild.className = "e";
    return div.getElementsByClassName("e").length === 2;
  });

  // Check if getElementById returns elements by name
  // Check if getElementsByName privileges form controls or returns elements by ID
  support.getByName = assert(function( div ) {
    // Inject content
    div.id = expando + 0;
    div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
    docElem.insertBefore( div, docElem.firstChild );

    // Test
    var pass = doc.getElementsByName &&
      // buggy browsers will return fewer than the correct 2
      doc.getElementsByName( expando ).length === 2 +
      // buggy browsers will return more than the correct 0
      doc.getElementsByName( expando + 0 ).length;
    support.getIdNotName = !doc.getElementById( expando );

    // Cleanup
    docElem.removeChild( div );

    return pass;
  });

  // IE6/7 return modified attributes
  Expr.attrHandle = assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
      div.firstChild.getAttribute("href") === "#";
  }) ?
    {} :
    {
      "href": function( elem ) {
        return elem.getAttribute( "href", 2 );
      },
      "type": function( elem ) {
        return elem.getAttribute("type");
      }
    };

  // ID find and filter
  if ( support.getIdNotName ) {
    Expr.find["ID"] = function( id, context ) {
      if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
        var m = context.getElementById( id );
        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        return m && m.parentNode ? [m] : [];
      }
    };
    Expr.filter["ID"] = function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        return elem.getAttribute("id") === attrId;
      };
    };
  } else {
    Expr.find["ID"] = function( id, context ) {
      if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
        var m = context.getElementById( id );

        return m ?
          m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
            [m] :
            undefined :
          [];
      }
    };
    Expr.filter["ID"] =  function( id ) {
      var attrId = id.replace( runescape, funescape );
      return function( elem ) {
        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
        return node && node.value === attrId;
      };
    };
  }

  // Tag
  Expr.find["TAG"] = support.tagNameNoComments ?
    function( tag, context ) {
      if ( typeof context.getElementsByTagName !== strundefined ) {
        return context.getElementsByTagName( tag );
      }
    } :
    function( tag, context ) {
      var elem,
        tmp = [],
        i = 0,
        results = context.getElementsByTagName( tag );

      // Filter out possible comments
      if ( tag === "*" ) {
        while ( (elem = results[i++]) ) {
          if ( elem.nodeType === 1 ) {
            tmp.push( elem );
          }
        }

        return tmp;
      }
      return results;
    };

  // Name
  Expr.find["NAME"] = support.getByName && function( tag, context ) {
    if ( typeof context.getElementsByName !== strundefined ) {
      return context.getElementsByName( name );
    }
  };

  // Class
  Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
    if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
      return context.getElementsByClassName( className );
    }
  };

  // QSA and matchesSelector support

  // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
  rbuggyMatches = [];

  // qSa(:focus) reports false when true (Chrome 21),
  // no need to also add to buggyMatches since matches checks buggyQSA
  // A support test would require too much code (would include document ready)
  rbuggyQSA = [ ":focus" ];

  if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
    // Build QSA regex
    // Regex strategy adopted from Diego Perini
    assert(function( div ) {
      // Select is set to empty string on purpose
      // This is to test IE's treatment of not explictly
      // setting a boolean content attribute,
      // since its presence should be enough
      // http://bugs.jquery.com/ticket/12359
      div.innerHTML = "<select><option selected=''></option></select>";

      // IE8 - Some boolean attributes are not treated correctly
      if ( !div.querySelectorAll("[selected]").length ) {
        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
      }

      // Webkit/Opera - :checked should return selected option elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":checked").length ) {
        rbuggyQSA.push(":checked");
      }
    });

    assert(function( div ) {

      // Opera 10-12/IE8 - ^= $= *= and empty values
      // Should not select anything
      div.innerHTML = "<input type='hidden' i=''/>";
      if ( div.querySelectorAll("[i^='']").length ) {
        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
      }

      // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      // IE8 throws error here and will not see later tests
      if ( !div.querySelectorAll(":enabled").length ) {
        rbuggyQSA.push( ":enabled", ":disabled" );
      }

      // Opera 10-11 does not throw on post-comma invalid pseudos
      div.querySelectorAll("*,:x");
      rbuggyQSA.push(",.*:");
    });
  }

  if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
    docElem.mozMatchesSelector ||
    docElem.webkitMatchesSelector ||
    docElem.oMatchesSelector ||
    docElem.msMatchesSelector) )) ) {

    assert(function( div ) {
      // Check to see if it's possible to do matchesSelector
      // on a disconnected node (IE 9)
      support.disconnectedMatch = matches.call( div, "div" );

      // This should fail with an exception
      // Gecko does not error, returns false instead
      matches.call( div, "[s!='']:x" );
      rbuggyMatches.push( "!=", pseudos );
    });
  }

  rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
  rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

  // Element contains another
  // Purposefully does not implement inclusive descendent
  // As in, an element does not contain itself
  contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
    function( a, b ) {
      var adown = a.nodeType === 9 ? a.documentElement : a,
        bup = b && b.parentNode;
      return a === bup || !!( bup && bup.nodeType === 1 && (
        adown.contains ?
          adown.contains( bup ) :
          a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
      ));
    } :
    function( a, b ) {
      if ( b ) {
        while ( (b = b.parentNode) ) {
          if ( b === a ) {
            return true;
          }
        }
      }
      return false;
    };

  // Document order sorting
  sortOrder = docElem.compareDocumentPosition ?
  function( a, b ) {
    var compare;

    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
      if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
        if ( a === doc || contains( preferredDoc, a ) ) {
          return -1;
        }
        if ( b === doc || contains( preferredDoc, b ) ) {
          return 1;
        }
        return 0;
      }
      return compare & 4 ? -1 : 1;
    }

    return a.compareDocumentPosition ? -1 : 1;
  } :
  function( a, b ) {
    var cur,
      i = 0,
      aup = a.parentNode,
      bup = b.parentNode,
      ap = [ a ],
      bp = [ b ];

    // Exit early if the nodes are identical
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Parentless nodes are either documents or disconnected
    } else if ( !aup || !bup ) {
      return a === doc ? -1 :
        b === doc ? 1 :
        aup ? -1 :
        bup ? 1 :
        0;

    // If the nodes are siblings, we can do a quick check
    } else if ( aup === bup ) {
      return siblingCheck( a, b );
    }

    // Otherwise we need full lists of their ancestors for comparison
    cur = a;
    while ( (cur = cur.parentNode) ) {
      ap.unshift( cur );
    }
    cur = b;
    while ( (cur = cur.parentNode) ) {
      bp.unshift( cur );
    }

    // Walk down the tree looking for a discrepancy
    while ( ap[i] === bp[i] ) {
      i++;
    }

    return i ?
      // Do a sibling check if the nodes have a common ancestor
      siblingCheck( ap[i], bp[i] ) :

      // Otherwise nodes in our document sort first
      ap[i] === preferredDoc ? -1 :
      bp[i] === preferredDoc ? 1 :
      0;
  };

  // Always assume the presence of duplicates if sort doesn't
  // pass them to our comparison function (as in Google Chrome).
  hasDuplicate = false;
  [0, 0].sort( sortOrder );
  support.detectDuplicates = hasDuplicate;

  return document;
};

Sizzle.matches = function( expr, elements ) {
  return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  // Make sure that attribute selectors are quoted
  expr = expr.replace( rattributeQuotes, "='$1']" );

  // rbuggyQSA always contains :focus, so no need for an existence check
  if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
    try {
      var ret = matches.call( elem, expr );

      // IE 9's matchesSelector returns false on disconnected nodes
      if ( ret || support.disconnectedMatch ||
          // As well, disconnected nodes are said to be in a document
          // fragment in IE 9
          elem.document && elem.document.nodeType !== 11 ) {
        return ret;
      }
    } catch(e) {}
  }

  return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
  // Set document vars if needed
  if ( ( context.ownerDocument || context ) !== document ) {
    setDocument( context );
  }
  return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
  var val;

  // Set document vars if needed
  if ( ( elem.ownerDocument || elem ) !== document ) {
    setDocument( elem );
  }

  if ( !documentIsXML ) {
    name = name.toLowerCase();
  }
  if ( (val = Expr.attrHandle[ name ]) ) {
    return val( elem );
  }
  if ( documentIsXML || support.attributes ) {
    return elem.getAttribute( name );
  }
  return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
    name :
    val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
  var elem,
    duplicates = [],
    i = 1,
    j = 0;

  // Unless we *know* we can detect duplicates, assume their presence
  hasDuplicate = !support.detectDuplicates;
  results.sort( sortOrder );

  if ( hasDuplicate ) {
    for ( ; (elem = results[i]); i++ ) {
      if ( elem === results[ i - 1 ] ) {
        j = duplicates.push( i );
      }
    }
    while ( j-- ) {
      results.splice( duplicates[ j ], 1 );
    }
  }

  return results;
};

function siblingCheck( a, b ) {
  var cur = b && a,
    diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

  // Use IE sourceIndex if available on both nodes
  if ( diff ) {
    return diff;
  }

  // Check if b follows a
  if ( cur ) {
    while ( (cur = cur.nextSibling) ) {
      if ( cur === b ) {
        return -1;
      }
    }
  }

  return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return name === "input" && elem.type === type;
  };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return (name === "input" || name === "button") && elem.type === type;
  };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
  return markFunction(function( argument ) {
    argument = +argument;
    return markFunction(function( seed, matches ) {
      var j,
        matchIndexes = fn( [], seed.length, argument ),
        i = matchIndexes.length;

      // Match elements found at the specified indexes
      while ( i-- ) {
        if ( seed[ (j = matchIndexes[i]) ] ) {
          seed[j] = !(matches[j] = seed[j]);
        }
      }
    });
  });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
  var node,
    ret = "",
    i = 0,
    nodeType = elem.nodeType;

  if ( !nodeType ) {
    // If no nodeType, this is expected to be an array
    for ( ; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      ret += getText( node );
    }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
    // Use textContent for elements
    // innerText usage removed for consistency of new lines (see #11153)
    if ( typeof elem.textContent === "string" ) {
      return elem.textContent;
    } else {
      // Traverse its children
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        ret += getText( elem );
      }
    }
  } else if ( nodeType === 3 || nodeType === 4 ) {
    return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  find: {},

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },

  preFilter: {
    "ATTR": function( match ) {
      match[1] = match[1].replace( runescape, funescape );

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

      if ( match[2] === "~=" ) {
        match[3] = " " + match[3] + " ";
      }

      return match.slice( 0, 4 );
    },

    "CHILD": function( match ) {
      /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 what (child|of-type)
        3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        4 xn-component of xn+y argument ([+-]?\d*n|)
        5 sign of xn-component
        6 x of xn-component
        7 sign of y-component
        8 y of y-component
      */
      match[1] = match[1].toLowerCase();

      if ( match[1].slice( 0, 3 ) === "nth" ) {
        // nth-* requires argument
        if ( !match[3] ) {
          Sizzle.error( match[0] );
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

      // other types prohibit arguments
      } else if ( match[3] ) {
        Sizzle.error( match[0] );
      }

      return match;
    },

    "PSEUDO": function( match ) {
      var excess,
        unquoted = !match[5] && match[2];

      if ( matchExpr["CHILD"].test( match[0] ) ) {
        return null;
      }

      // Accept quoted arguments as-is
      if ( match[4] ) {
        match[2] = match[4];

      // Strip excess characters from unquoted arguments
      } else if ( unquoted && rpseudo.test( unquoted ) &&
        // Get excess from tokenize (recursively)
        (excess = tokenize( unquoted, true )) &&
        // advance to the next closing parenthesis
        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

        // excess is a negative index
        match[0] = match[0].slice( 0, excess );
        match[2] = unquoted.slice( 0, excess );
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice( 0, 3 );
    }
  },

  filter: {

    "TAG": function( nodeName ) {
      if ( nodeName === "*" ) {
        return function() { return true; };
      }

      nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
      return function( elem ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
      };
    },

    "CLASS": function( className ) {
      var pattern = classCache[ className + " " ];

      return pattern ||
        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
        classCache( className, function( elem ) {
          return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
        });
    },

    "ATTR": function( name, operator, check ) {
      return function( elem ) {
        var result = Sizzle.attr( elem, name );

        if ( result == null ) {
          return operator === "!=";
        }
        if ( !operator ) {
          return true;
        }

        result += "";

        return operator === "=" ? result === check :
          operator === "!=" ? result !== check :
          operator === "^=" ? check && result.indexOf( check ) === 0 :
          operator === "*=" ? check && result.indexOf( check ) > -1 :
          operator === "$=" ? check && result.slice( -check.length ) === check :
          operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
          operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
          false;
      };
    },

    "CHILD": function( type, what, argument, first, last ) {
      var simple = type.slice( 0, 3 ) !== "nth",
        forward = type.slice( -4 ) !== "last",
        ofType = what === "of-type";

      return first === 1 && last === 0 ?

        // Shortcut for :nth-*(n)
        function( elem ) {
          return !!elem.parentNode;
        } :

        function( elem, context, xml ) {
          var cache, outerCache, node, diff, nodeIndex, start,
            dir = simple !== forward ? "nextSibling" : "previousSibling",
            parent = elem.parentNode,
            name = ofType && elem.nodeName.toLowerCase(),
            useCache = !xml && !ofType;

          if ( parent ) {

            // :(first|last|only)-(child|of-type)
            if ( simple ) {
              while ( dir ) {
                node = elem;
                while ( (node = node[ dir ]) ) {
                  if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                    return false;
                  }
                }
                // Reverse direction for :only-* (if we haven't yet done so)
                start = dir = type === "only" && !start && "nextSibling";
              }
              return true;
            }

            start = [ forward ? parent.firstChild : parent.lastChild ];

            // non-xml :nth-child(...) stores cache data on `parent`
            if ( forward && useCache ) {
              // Seek `elem` from a previously-cached index
              outerCache = parent[ expando ] || (parent[ expando ] = {});
              cache = outerCache[ type ] || [];
              nodeIndex = cache[0] === dirruns && cache[1];
              diff = cache[0] === dirruns && cache[2];
              node = nodeIndex && parent.childNodes[ nodeIndex ];

              while ( (node = ++nodeIndex && node && node[ dir ] ||

                // Fallback to seeking `elem` from the start
                (diff = nodeIndex = 0) || start.pop()) ) {

                // When found, cache indexes on `parent` and break
                if ( node.nodeType === 1 && ++diff && node === elem ) {
                  outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                  break;
                }
              }

            // Use previously-cached element index if available
            } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
              diff = cache[1];

            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
            } else {
              // Use the same loop as above to seek `elem` from the start
              while ( (node = ++nodeIndex && node && node[ dir ] ||
                (diff = nodeIndex = 0) || start.pop()) ) {

                if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                  // Cache the index of each encountered element
                  if ( useCache ) {
                    (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                  }

                  if ( node === elem ) {
                    break;
                  }
                }
              }
            }

            // Incorporate the offset, then check against cycle size
            diff -= last;
            return diff === first || ( diff % first === 0 && diff / first >= 0 );
          }
        };
    },

    "PSEUDO": function( pseudo, argument ) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      var args,
        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
          Sizzle.error( "unsupported pseudo: " + pseudo );

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if ( fn[ expando ] ) {
        return fn( argument );
      }

      // But maintain support for old signatures
      if ( fn.length > 1 ) {
        args = [ pseudo, pseudo, "", argument ];
        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
          markFunction(function( seed, matches ) {
            var idx,
              matched = fn( seed, argument ),
              i = matched.length;
            while ( i-- ) {
              idx = indexOf.call( seed, matched[i] );
              seed[ idx ] = !( matches[ idx ] = matched[i] );
            }
          }) :
          function( elem ) {
            return fn( elem, 0, args );
          };
      }

      return fn;
    }
  },

  pseudos: {
    // Potentially complex pseudos
    "not": markFunction(function( selector ) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      var input = [],
        results = [],
        matcher = compile( selector.replace( rtrim, "$1" ) );

      return matcher[ expando ] ?
        markFunction(function( seed, matches, context, xml ) {
          var elem,
            unmatched = matcher( seed, null, xml, [] ),
            i = seed.length;

          // Match elements unmatched by `matcher`
          while ( i-- ) {
            if ( (elem = unmatched[i]) ) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) :
        function( elem, context, xml ) {
          input[0] = elem;
          matcher( input, null, xml, results );
          return !results.pop();
        };
    }),

    "has": markFunction(function( selector ) {
      return function( elem ) {
        return Sizzle( selector, elem ).length > 0;
      };
    }),

    "contains": markFunction(function( text ) {
      return function( elem ) {
        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      };
    }),

    // "Whether an element is represented by a :lang() selector
    // is based solely on the element's language value
    // being equal to the identifier C,
    // or beginning with the identifier C immediately followed by "-".
    // The matching of C against the element's language value is performed case-insensitively.
    // The identifier C does not have to be a valid language name."
    // http://www.w3.org/TR/selectors/#lang-pseudo
    "lang": markFunction( function( lang ) {
      // lang value must be a valid identifider
      if ( !ridentifier.test(lang || "") ) {
        Sizzle.error( "unsupported lang: " + lang );
      }
      lang = lang.replace( runescape, funescape ).toLowerCase();
      return function( elem ) {
        var elemLang;
        do {
          if ( (elemLang = documentIsXML ?
            elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
            elem.lang) ) {

            elemLang = elemLang.toLowerCase();
            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
          }
        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
        return false;
      };
    }),

    // Miscellaneous
    "target": function( elem ) {
      var hash = window.location && window.location.hash;
      return hash && hash.slice( 1 ) === elem.id;
    },

    "root": function( elem ) {
      return elem === docElem;
    },

    "focus": function( elem ) {
      return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    },

    // Boolean properties
    "enabled": function( elem ) {
      return elem.disabled === false;
    },

    "disabled": function( elem ) {
      return elem.disabled === true;
    },

    "checked": function( elem ) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      var nodeName = elem.nodeName.toLowerCase();
      return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    },

    "selected": function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    // Contents
    "empty": function( elem ) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      //   not comment, processing instructions, or others
      // Thanks to Diego Perini for the nodeName shortcut
      //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
          return false;
        }
      }
      return true;
    },

    "parent": function( elem ) {
      return !Expr.pseudos["empty"]( elem );
    },

    // Element/input types
    "header": function( elem ) {
      return rheader.test( elem.nodeName );
    },

    "input": function( elem ) {
      return rinputs.test( elem.nodeName );
    },

    "button": function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === "button" || name === "button";
    },

    "text": function( elem ) {
      var attr;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" &&
        elem.type === "text" &&
        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
    },

    // Position-in-collection
    "first": createPositionalPseudo(function() {
      return [ 0 ];
    }),

    "last": createPositionalPseudo(function( matchIndexes, length ) {
      return [ length - 1 ];
    }),

    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ argument < 0 ? argument + length : argument ];
    }),

    "even": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 0;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "odd": createPositionalPseudo(function( matchIndexes, length ) {
      var i = 1;
      for ( ; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; --i >= 0; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      var i = argument < 0 ? argument + length : argument;
      for ( ; ++i < length; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    })
  }
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
  Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
  Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
  var matched, match, tokens, type,
    soFar, groups, preFilters,
    cached = tokenCache[ selector + " " ];

  if ( cached ) {
    return parseOnly ? 0 : cached.slice( 0 );
  }

  soFar = selector;
  groups = [];
  preFilters = Expr.preFilter;

  while ( soFar ) {

    // Comma and first run
    if ( !matched || (match = rcomma.exec( soFar )) ) {
      if ( match ) {
        // Don't consume trailing commas as valid
        soFar = soFar.slice( match[0].length ) || soFar;
      }
      groups.push( tokens = [] );
    }

    matched = false;

    // Combinators
    if ( (match = rcombinators.exec( soFar )) ) {
      matched = match.shift();
      tokens.push( {
        value: matched,
        // Cast descendant combinators to space
        type: match[0].replace( rtrim, " " )
      } );
      soFar = soFar.slice( matched.length );
    }

    // Filters
    for ( type in Expr.filter ) {
      if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
        (match = preFilters[ type ]( match ))) ) {
        matched = match.shift();
        tokens.push( {
          value: matched,
          type: type,
          matches: match
        } );
        soFar = soFar.slice( matched.length );
      }
    }

    if ( !matched ) {
      break;
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly ?
    soFar.length :
    soFar ?
      Sizzle.error( selector ) :
      // Cache the tokens
      tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
  var i = 0,
    len = tokens.length,
    selector = "";
  for ( ; i < len; i++ ) {
    selector += tokens[i].value;
  }
  return selector;
}

function addCombinator( matcher, combinator, base ) {
  var dir = combinator.dir,
    checkNonElements = base && dir === "parentNode",
    doneName = done++;

  return combinator.first ?
    // Check against closest ancestor/preceding element
    function( elem, context, xml ) {
      while ( (elem = elem[ dir ]) ) {
        if ( elem.nodeType === 1 || checkNonElements ) {
          return matcher( elem, context, xml );
        }
      }
    } :

    // Check against all ancestor/preceding elements
    function( elem, context, xml ) {
      var data, cache, outerCache,
        dirkey = dirruns + " " + doneName;

      // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      if ( xml ) {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            if ( matcher( elem, context, xml ) ) {
              return true;
            }
          }
        }
      } else {
        while ( (elem = elem[ dir ]) ) {
          if ( elem.nodeType === 1 || checkNonElements ) {
            outerCache = elem[ expando ] || (elem[ expando ] = {});
            if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
              if ( (data = cache[1]) === true || data === cachedruns ) {
                return data === true;
              }
            } else {
              cache = outerCache[ dir ] = [ dirkey ];
              cache[1] = matcher( elem, context, xml ) || cachedruns;
              if ( cache[1] === true ) {
                return true;
              }
            }
          }
        }
      }
    };
}

function elementMatcher( matchers ) {
  return matchers.length > 1 ?
    function( elem, context, xml ) {
      var i = matchers.length;
      while ( i-- ) {
        if ( !matchers[i]( elem, context, xml ) ) {
          return false;
        }
      }
      return true;
    } :
    matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
  var elem,
    newUnmatched = [],
    i = 0,
    len = unmatched.length,
    mapped = map != null;

  for ( ; i < len; i++ ) {
    if ( (elem = unmatched[i]) ) {
      if ( !filter || filter( elem, context, xml ) ) {
        newUnmatched.push( elem );
        if ( mapped ) {
          map.push( i );
        }
      }
    }
  }

  return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  if ( postFilter && !postFilter[ expando ] ) {
    postFilter = setMatcher( postFilter );
  }
  if ( postFinder && !postFinder[ expando ] ) {
    postFinder = setMatcher( postFinder, postSelector );
  }
  return markFunction(function( seed, results, context, xml ) {
    var temp, i, elem,
      preMap = [],
      postMap = [],
      preexisting = results.length,

      // Get initial elements from seed or context
      elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

      // Prefilter to get matcher input, preserving a map for seed-results synchronization
      matcherIn = preFilter && ( seed || !selector ) ?
        condense( elems, preMap, preFilter, context, xml ) :
        elems,

      matcherOut = matcher ?
        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
        matcherIn;

    // Find primary matches
    if ( matcher ) {
      matcher( matcherIn, matcherOut, context, xml );
    }

    // Apply postFilter
    if ( postFilter ) {
      temp = condense( matcherOut, postMap );
      postFilter( temp, [], context, xml );

      // Un-match failing elements by moving them back to matcherIn
      i = temp.length;
      while ( i-- ) {
        if ( (elem = temp[i]) ) {
          matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
        }
      }
    }

    if ( seed ) {
      if ( postFinder || preFilter ) {
        if ( postFinder ) {
          // Get the final matcherOut by condensing this intermediate into postFinder contexts
          temp = [];
          i = matcherOut.length;
          while ( i-- ) {
            if ( (elem = matcherOut[i]) ) {
              // Restore matcherIn since elem is not yet a final match
              temp.push( (matcherIn[i] = elem) );
            }
          }
          postFinder( null, (matcherOut = []), temp, xml );
        }

        // Move matched elements from seed to results to keep them synchronized
        i = matcherOut.length;
        while ( i-- ) {
          if ( (elem = matcherOut[i]) &&
            (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

            seed[temp] = !(results[temp] = elem);
          }
        }
      }

    // Add elements to results, through postFinder if defined
    } else {
      matcherOut = condense(
        matcherOut === results ?
          matcherOut.splice( preexisting, matcherOut.length ) :
          matcherOut
      );
      if ( postFinder ) {
        postFinder( null, results, matcherOut, xml );
      } else {
        push.apply( results, matcherOut );
      }
    }
  });
}

function matcherFromTokens( tokens ) {
  var checkContext, matcher, j,
    len = tokens.length,
    leadingRelative = Expr.relative[ tokens[0].type ],
    implicitRelative = leadingRelative || Expr.relative[" "],
    i = leadingRelative ? 1 : 0,

    // The foundational matcher ensures that elements are reachable from top-level context(s)
    matchContext = addCombinator( function( elem ) {
      return elem === checkContext;
    }, implicitRelative, true ),
    matchAnyContext = addCombinator( function( elem ) {
      return indexOf.call( checkContext, elem ) > -1;
    }, implicitRelative, true ),
    matchers = [ function( elem, context, xml ) {
      return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
        (checkContext = context).nodeType ?
          matchContext( elem, context, xml ) :
          matchAnyContext( elem, context, xml ) );
    } ];

  for ( ; i < len; i++ ) {
    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
    } else {
      matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

      // Return special upon seeing a positional matcher
      if ( matcher[ expando ] ) {
        // Find the next relative operator (if any) for proper handling
        j = ++i;
        for ( ; j < len; j++ ) {
          if ( Expr.relative[ tokens[j].type ] ) {
            break;
          }
        }
        return setMatcher(
          i > 1 && elementMatcher( matchers ),
          i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
          matcher,
          i < j && matcherFromTokens( tokens.slice( i, j ) ),
          j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
          j < len && toSelector( tokens )
        );
      }
      matchers.push( matcher );
    }
  }

  return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  // A counter to specify which element is currently being matched
  var matcherCachedRuns = 0,
    bySet = setMatchers.length > 0,
    byElement = elementMatchers.length > 0,
    superMatcher = function( seed, context, xml, results, expandContext ) {
      var elem, j, matcher,
        setMatched = [],
        matchedCount = 0,
        i = "0",
        unmatched = seed && [],
        outermost = expandContext != null,
        contextBackup = outermostContext,
        // We must always have either seed elements or context
        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
        // Use integer dirruns iff this is the outermost matcher
        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

      if ( outermost ) {
        outermostContext = context !== document && context;
        cachedruns = matcherCachedRuns;
      }

      // Add elements passing elementMatchers directly to results
      // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
      for ( ; (elem = elems[i]) != null; i++ ) {
        if ( byElement && elem ) {
          j = 0;
          while ( (matcher = elementMatchers[j++]) ) {
            if ( matcher( elem, context, xml ) ) {
              results.push( elem );
              break;
            }
          }
          if ( outermost ) {
            dirruns = dirrunsUnique;
            cachedruns = ++matcherCachedRuns;
          }
        }

        // Track unmatched elements for set filters
        if ( bySet ) {
          // They will have gone through all possible matchers
          if ( (elem = !matcher && elem) ) {
            matchedCount--;
          }

          // Lengthen the array for every element, matched or not
          if ( seed ) {
            unmatched.push( elem );
          }
        }
      }

      // Apply set filters to unmatched elements
      matchedCount += i;
      if ( bySet && i !== matchedCount ) {
        j = 0;
        while ( (matcher = setMatchers[j++]) ) {
          matcher( unmatched, setMatched, context, xml );
        }

        if ( seed ) {
          // Reintegrate element matches to eliminate the need for sorting
          if ( matchedCount > 0 ) {
            while ( i-- ) {
              if ( !(unmatched[i] || setMatched[i]) ) {
                setMatched[i] = pop.call( results );
              }
            }
          }

          // Discard index placeholder values to get only actual matches
          setMatched = condense( setMatched );
        }

        // Add matches to results
        push.apply( results, setMatched );

        // Seedless set matches succeeding multiple successful matchers stipulate sorting
        if ( outermost && !seed && setMatched.length > 0 &&
          ( matchedCount + setMatchers.length ) > 1 ) {

          Sizzle.uniqueSort( results );
        }
      }

      // Override manipulation of globals by nested matchers
      if ( outermost ) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

  return bySet ?
    markFunction( superMatcher ) :
    superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
  var i,
    setMatchers = [],
    elementMatchers = [],
    cached = compilerCache[ selector + " " ];

  if ( !cached ) {
    // Generate a function of recursive functions that can be used to check each element
    if ( !group ) {
      group = tokenize( selector );
    }
    i = group.length;
    while ( i-- ) {
      cached = matcherFromTokens( group[i] );
      if ( cached[ expando ] ) {
        setMatchers.push( cached );
      } else {
        elementMatchers.push( cached );
      }
    }

    // Cache the compiled function
    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
  }
  return cached;
};

function multipleContexts( selector, contexts, results ) {
  var i = 0,
    len = contexts.length;
  for ( ; i < len; i++ ) {
    Sizzle( selector, contexts[i], results );
  }
  return results;
}

function select( selector, context, results, seed ) {
  var i, tokens, token, type, find,
    match = tokenize( selector );

  if ( !seed ) {
    // Try to minimize operations if there is only one group
    if ( match.length === 1 ) {

      // Take a shortcut and set the context if the root selector is an ID
      tokens = match[0] = match[0].slice( 0 );
      if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
          context.nodeType === 9 && !documentIsXML &&
          Expr.relative[ tokens[1].type ] ) {

        context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
        if ( !context ) {
          return results;
        }

        selector = selector.slice( tokens.shift().value.length );
      }

      // Fetch a seed set for right-to-left matching
      i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
      while ( i-- ) {
        token = tokens[i];

        // Abort if we hit a combinator
        if ( Expr.relative[ (type = token.type) ] ) {
          break;
        }
        if ( (find = Expr.find[ type ]) ) {
          // Search, expanding context for leading sibling combinators
          if ( (seed = find(
            token.matches[0].replace( runescape, funescape ),
            rsibling.test( tokens[0].type ) && context.parentNode || context
          )) ) {

            // If seed is empty or no tokens remain, we can return early
            tokens.splice( i, 1 );
            selector = seed.length && toSelector( tokens );
            if ( !selector ) {
              push.apply( results, slice.call( seed, 0 ) );
              return results;
            }

            break;
          }
        }
      }
    }
  }

  // Compile and execute a filtering function
  // Provide `match` to avoid retokenization if we modified the selector above
  compile( selector, match )(
    seed,
    context,
    documentIsXML,
    results,
    rsibling.test( selector )
  );
  return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
  rparentsprev = /^(?:parents|prev(?:Until|All))/,
  isSimple = /^.[^:#\[\.,]*$/,
  rneedsContext = jQuery.expr.match.needsContext,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var i, ret, self,
      len = this.length;

    if ( typeof selector !== "string" ) {
      self = this;
      return this.pushStack( jQuery( selector ).filter(function() {
        for ( i = 0; i < len; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      }) );
    }

    ret = [];
    for ( i = 0; i < len; i++ ) {
      jQuery.find( selector, this[ i ], ret );
    }

    // Needed because $( selector, context ) becomes $( context ).find( selector )
    ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
    ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
    return ret;
  },

  has: function( target ) {
    var i,
      targets = jQuery( target, this ),
      len = targets.length;

    return this.filter(function() {
      for ( i = 0; i < len; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false) );
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true) );
  },

  is: function( selector ) {
    return !!selector && (
      typeof selector === "string" ?
        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        rneedsContext.test( selector ) ?
          jQuery( selector, this.context ).index( this[0] ) >= 0 :
          jQuery.filter( selector, this ).length > 0 :
        this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var cur,
      i = 0,
      l = this.length,
      ret = [],
      pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( ; i < l; i++ ) {
      cur = this[i];

      while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;
        }
        cur = cur.parentNode;
      }
    }

    return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {

    // No argument, return index in parent
    if ( !elem ) {
      return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
    }

    // index in selector
    if ( typeof elem === "string" ) {
      return jQuery.inArray( this[0], jQuery( elem ) );
    }

    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( jQuery.unique(all) );
  },

  addBack: function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter(selector)
    );
  }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
  do {
    cur = cur[ dir ];
  } while ( cur && cur.nodeType !== 1 );

  return cur;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return sibling( elem, "nextSibling" );
  },
  prev: function( elem ) {
    return sibling( elem, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.merge( [], elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until );

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( this.length > 1 && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem ) {
      return ( elem === qualifier ) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem ) {
    return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
  });
}
function createSafeFragment( document ) {
  var list = nodeNames.split( "|" ),
    safeFrag = document.createDocumentFragment();

  if ( safeFrag.createElement ) {
    while ( list.length ) {
      safeFrag.createElement(
        list.pop()
      );
    }
  }
  return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
  rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
  rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnoInnerhtml = /<(?:script|style|link)/i,
  manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /^$|\/(?:java|ecma)script/i,
  rscriptTypeMasked = /^true\/(.*)/,
  rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

  // We have to close these tags to support XHTML (#13200)
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    area: [ 1, "<map>", "</map>" ],
    param: [ 1, "<object>", "</object>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
    // unless wrapped in a div with non-breaking characters in front of it.
    _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
  },
  safeFragment = createSafeFragment( document ),
  fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
  text: function( value ) {
    return jQuery.access( this, function( value ) {
      return value === undefined ?
        jQuery.text( this ) :
        this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
    }, null, value, arguments.length );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    var isFunction = jQuery.isFunction( html );

    return this.each(function(i) {
      jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    return this.domManip( arguments, false, function( elem ) {
      if ( this.parentNode ) {
        this.parentNode.insertBefore( elem, this );
      }
    });
  },

  after: function() {
    return this.domManip( arguments, false, function( elem ) {
      if ( this.parentNode ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      }
    });
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( getAll( elem ) );
        }

        if ( elem.parentNode ) {
          if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
            setGlobalEval( getAll( elem, "script" ) );
          }
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( getAll( elem, false ) );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }

      // If this is a select, ensure that it displays empty (#12336)
      // Support: IE<9
      if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
        elem.options.length = 0;
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    return jQuery.access( this, function( value ) {
      var elem = this[0] || {},
        i = 0,
        l = this.length;

      if ( value === undefined ) {
        return elem.nodeType === 1 ?
          elem.innerHTML.replace( rinlinejQuery, "" ) :
          undefined;
      }

      // See if we can take a shortcut and just use innerHTML
      if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
        ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
        ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

        value = value.replace( rxhtmlTag, "<$1></$2>" );

        try {
          for (; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            elem = this[i] || {};
            if ( elem.nodeType === 1 ) {
              jQuery.cleanData( getAll( elem, false ) );
              elem.innerHTML = value;
            }
          }

          elem = 0;

        // If using innerHTML throws an exception, use the fallback method
        } catch(e) {}
      }

      if ( elem ) {
        this.empty().append( value );
      }
    }, null, value, arguments.length );
  },

  replaceWith: function( value ) {
    var isFunc = jQuery.isFunction( value );

    // Make sure that the elements are removed from the DOM before they are inserted
    // this can help fix replacing a parent with child elements
    if ( !isFunc && typeof value !== "string" ) {
      value = jQuery( value ).not( this ).detach();
    }

    return this.domManip( [ value ], true, function( elem ) {
      var next = this.nextSibling,
        parent = this.parentNode;

      if ( parent ) {
        jQuery( this ).remove();
        parent.insertBefore( elem, next );
      }
    });
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {

    // Flatten any nested arrays
    args = core_concat.apply( [], args );

    var first, node, hasScripts,
      scripts, doc, fragment,
      i = 0,
      l = this.length,
      set = this,
      iNoClone = l - 1,
      value = args[0],
      isFunction = jQuery.isFunction( value );

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
      return this.each(function( index ) {
        var self = set.eq( index );
        if ( isFunction ) {
          args[0] = value.call( this, index, table ? self.html() : undefined );
        }
        self.domManip( args, table, callback );
      });
    }

    if ( l ) {
      fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
      first = fragment.firstChild;

      if ( fragment.childNodes.length === 1 ) {
        fragment = first;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );
        scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
        hasScripts = scripts.length;

        // Use the original fragment for the last item instead of the first because it can end up
        // being emptied incorrectly in certain situations (#8070).
        for ( ; i < l; i++ ) {
          node = fragment;

          if ( i !== iNoClone ) {
            node = jQuery.clone( node, true, true );

            // Keep references to cloned scripts for later restoration
            if ( hasScripts ) {
              jQuery.merge( scripts, getAll( node, "script" ) );
            }
          }

          callback.call(
            table && jQuery.nodeName( this[i], "table" ) ?
              findOrAppend( this[i], "tbody" ) :
              this[i],
            node,
            i
          );
        }

        if ( hasScripts ) {
          doc = scripts[ scripts.length - 1 ].ownerDocument;

          // Reenable scripts
          jQuery.map( scripts, restoreScript );

          // Evaluate executable scripts on first document insertion
          for ( i = 0; i < hasScripts; i++ ) {
            node = scripts[ i ];
            if ( rscriptType.test( node.type || "" ) &&
              !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

              if ( node.src ) {
                // Hope ajax is available...
                jQuery.ajax({
                  url: node.src,
                  type: "GET",
                  dataType: "script",
                  async: false,
                  global: false,
                  "throws": true
                });
              } else {
                jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
              }
            }
          }
        }

        // Fix #11809: Avoid leaking memory
        fragment = first = null;
      }
    }

    return this;
  }
});

function findOrAppend( elem, tag ) {
  return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
  var attr = elem.getAttributeNode("type");
  elem.type = ( attr && attr.specified ) + "/" + elem.type;
  return elem;
}
function restoreScript( elem ) {
  var match = rscriptTypeMasked.exec( elem.type );
  if ( match ) {
    elem.type = match[1];
  } else {
    elem.removeAttribute("type");
  }
  return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
  var elem,
    i = 0;
  for ( ; (elem = elems[i]) != null; i++ ) {
    jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
  }
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var type, i, l,
    oldData = jQuery._data( src ),
    curData = jQuery._data( dest, oldData ),
    events = oldData.events;

  if ( events ) {
    delete curData.handle;
    curData.events = {};

    for ( type in events ) {
      for ( i = 0, l = events[ type ].length; i < l; i++ ) {
        jQuery.event.add( dest, type, events[ type ][ i ] );
      }
    }
  }

  // make the cloned public data object a copy from the original
  if ( curData.data ) {
    curData.data = jQuery.extend( {}, curData.data );
  }
}

function fixCloneNodeIssues( src, dest ) {
  var nodeName, e, data;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  nodeName = dest.nodeName.toLowerCase();

  // IE6-8 copies events bound via attachEvent when using cloneNode.
  if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
    data = jQuery._data( dest );

    for ( e in data.events ) {
      jQuery.removeEvent( dest, e, data.handle );
    }

    // Event data gets referenced instead of copied if the expando gets copied too
    dest.removeAttribute( jQuery.expando );
  }

  // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
  if ( nodeName === "script" && dest.text !== src.text ) {
    disableScript( dest ).text = src.text;
    restoreScript( dest );

  // IE6-10 improperly clones children of object elements using classid.
  // IE10 throws NoModificationAllowedError if parent is null, #12132.
  } else if ( nodeName === "object" ) {
    if ( dest.parentNode ) {
      dest.outerHTML = src.outerHTML;
    }

    // This path appears unavoidable for IE9. When cloning an object
    // element in IE9, the outerHTML strategy above is not sufficient.
    // If the src has innerHTML and the destination does not,
    // copy the src.innerHTML into the dest.innerHTML. #10324
    if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
      dest.innerHTML = src.innerHTML;
    }

  } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set

    dest.defaultChecked = dest.checked = src.checked;

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.defaultSelected = dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;
  }
}

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var elems,
      i = 0,
      ret = [],
      insert = jQuery( selector ),
      last = insert.length - 1;

    for ( ; i <= last; i++ ) {
      elems = i === last ? this : this.clone(true);
      jQuery( insert[i] )[ original ]( elems );

      // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
      core_push.apply( ret, elems.get() );
    }

    return this.pushStack( ret );
  };
});

function getAll( context, tag ) {
  var elems, elem,
    i = 0,
    found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
      typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
      undefined;

  if ( !found ) {
    for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
      if ( !tag || jQuery.nodeName( elem, tag ) ) {
        found.push( elem );
      } else {
        jQuery.merge( found, getAll( elem, tag ) );
      }
    }
  }

  return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
    jQuery.merge( [ context ], found ) :
    found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( manipulation_rcheckableType.test( elem.type ) ) {
    elem.defaultChecked = elem.checked;
  }
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var destElements, node, clone, i, srcElements,
      inPage = jQuery.contains( elem.ownerDocument, elem );

    if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
      clone = elem.cloneNode( true );

    // IE<=8 does not properly clone detached, unknown element nodes
    } else {
      fragmentDiv.innerHTML = elem.outerHTML;
      fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
    }

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

      // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
      destElements = getAll( clone );
      srcElements = getAll( elem );

      // Fix all IE cloning issues
      for ( i = 0; (node = srcElements[i]) != null; ++i ) {
        // Ensure that the destination node is not null; Fixes #9587
        if ( destElements[i] ) {
          fixCloneNodeIssues( node, destElements[i] );
        }
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      if ( deepDataAndEvents ) {
        srcElements = srcElements || getAll( elem );
        destElements = destElements || getAll( clone );

        for ( i = 0; (node = srcElements[i]) != null; i++ ) {
          cloneCopyEvent( node, destElements[i] );
        }
      } else {
        cloneCopyEvent( elem, clone );
      }
    }

    // Preserve script evaluation history
    destElements = getAll( clone, "script" );
    if ( destElements.length > 0 ) {
      setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    }

    destElements = srcElements = node = null;

    // Return the cloned set
    return clone;
  },

  buildFragment: function( elems, context, scripts, selection ) {
    var j, elem, contains,
      tmp, tag, tbody, wrap,
      l = elems.length,

      // Ensure a safe fragment
      safe = createSafeFragment( context ),

      nodes = [],
      i = 0;

    for ( ; i < l; i++ ) {
      elem = elems[ i ];

      if ( elem || elem === 0 ) {

        // Add nodes directly
        if ( jQuery.type( elem ) === "object" ) {
          jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

        // Convert non-html into a text node
        } else if ( !rhtml.test( elem ) ) {
          nodes.push( context.createTextNode( elem ) );

        // Convert html into DOM nodes
        } else {
          tmp = tmp || safe.appendChild( context.createElement("div") );

          // Deserialize a standard representation
          tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
          wrap = wrapMap[ tag ] || wrapMap._default;

          tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

          // Descend through wrappers to the right content
          j = wrap[0];
          while ( j-- ) {
            tmp = tmp.lastChild;
          }

          // Manually add leading whitespace removed by IE
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            elem = tag === "table" && !rtbody.test( elem ) ?
              tmp.firstChild :

              // String was a bare <thead> or <tfoot>
              wrap[1] === "<table>" && !rtbody.test( elem ) ?
                tmp :
                0;

            j = elem && elem.childNodes.length;
            while ( j-- ) {
              if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
                elem.removeChild( tbody );
              }
            }
          }

          jQuery.merge( nodes, tmp.childNodes );

          // Fix #12392 for WebKit and IE > 9
          tmp.textContent = "";

          // Fix #12392 for oldIE
          while ( tmp.firstChild ) {
            tmp.removeChild( tmp.firstChild );
          }

          // Remember the top-level container for proper cleanup
          tmp = safe.lastChild;
        }
      }
    }

    // Fix #11356: Clear elements from fragment
    if ( tmp ) {
      safe.removeChild( tmp );
    }

    // Reset defaultChecked for any radios and checkboxes
    // about to be appended to the DOM in IE 6/7 (#8060)
    if ( !jQuery.support.appendChecked ) {
      jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
    }

    i = 0;
    while ( (elem = nodes[ i++ ]) ) {

      // #4087 - If origin and destination elements are the same, and this is
      // that element, do not do anything
      if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
        continue;
      }

      contains = jQuery.contains( elem.ownerDocument, elem );

      // Append to fragment
      tmp = getAll( safe.appendChild( elem ), "script" );

      // Preserve script evaluation history
      if ( contains ) {
        setGlobalEval( tmp );
      }

      // Capture executables
      if ( scripts ) {
        j = 0;
        while ( (elem = tmp[ j++ ]) ) {
          if ( rscriptType.test( elem.type || "" ) ) {
            scripts.push( elem );
          }
        }
      }
    }

    tmp = null;

    return safe;
  },

  cleanData: function( elems, /* internal */ acceptData ) {
    var elem, type, id, data,
      i = 0,
      internalKey = jQuery.expando,
      cache = jQuery.cache,
      deleteExpando = jQuery.support.deleteExpando,
      special = jQuery.event.special;

    for ( ; (elem = elems[i]) != null; i++ ) {

      if ( acceptData || jQuery.acceptData( elem ) ) {

        id = elem[ internalKey ];
        data = id && cache[ id ];

        if ( data ) {
          if ( data.events ) {
            for ( type in data.events ) {
              if ( special[ type ] ) {
                jQuery.event.remove( elem, type );

              // This is a shortcut to avoid jQuery.event.remove's overhead
              } else {
                jQuery.removeEvent( elem, type, data.handle );
              }
            }
          }

          // Remove cache only if it was not already removed by jQuery.event.remove
          if ( cache[ id ] ) {

            delete cache[ id ];

            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( deleteExpando ) {
              delete elem[ internalKey ];

            } else if ( typeof elem.removeAttribute !== core_strundefined ) {
              elem.removeAttribute( internalKey );

            } else {
              elem[ internalKey ] = null;
            }

            core_deletedIds.push( id );
          }
        }
      }
    }
  }
});
var iframe, getStyles, curCSS,
  ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity\s*=\s*([^)]*)/,
  rposition = /^(top|right|bottom|left)$/,
  // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
  // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  rmargin = /^margin/,
  rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
  rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
  rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
  elemdisplay = { BODY: "block" },

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssNormalTransform = {
    letterSpacing: 0,
    fontWeight: 400
  },

  cssExpand = [ "Top", "Right", "Bottom", "Left" ],
  cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

  // shortcut for names that are not vendor prefixed
  if ( name in style ) {
    return name;
  }

  // check for vendor prefixed names
  var capName = name.charAt(0).toUpperCase() + name.slice(1),
    origName = name,
    i = cssPrefixes.length;

  while ( i-- ) {
    name = cssPrefixes[ i ] + capName;
    if ( name in style ) {
      return name;
    }
  }

  return origName;
}

function isHidden( elem, el ) {
  // isHidden might be called from jQuery#filter function;
  // in that case, element will be second argument
  elem = el || elem;
  return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
  var display, elem, hidden,
    values = [],
    index = 0,
    length = elements.length;

  for ( ; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }

    values[ index ] = jQuery._data( elem, "olddisplay" );
    display = elem.style.display;
    if ( show ) {
      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if ( !values[ index ] && display === "none" ) {
        elem.style.display = "";
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if ( elem.style.display === "" && isHidden( elem ) ) {
        values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
      }
    } else {

      if ( !values[ index ] ) {
        hidden = isHidden( elem );

        if ( display && display !== "none" || !hidden ) {
          jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
        }
      }
    }
  }

  // Set the display of most of the elements in a second loop
  // to avoid the constant reflow
  for ( index = 0; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
      elem.style.display = show ? values[ index ] || "" : "none";
    }
  }

  return elements;
}

jQuery.fn.extend({
  css: function( name, value ) {
    return jQuery.access( this, function( elem, name, value ) {
      var len, styles,
        map = {},
        i = 0;

      if ( jQuery.isArray( name ) ) {
        styles = getStyles( elem );
        len = name.length;

        for ( ; i < len; i++ ) {
          map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
        }

        return map;
      }

      return value !== undefined ?
        jQuery.style( elem, name, value ) :
        jQuery.css( elem, name );
    }, name, value, arguments.length > 1 );
  },
  show: function() {
    return showHide( this, true );
  },
  hide: function() {
    return showHide( this );
  },
  toggle: function( state ) {
    var bool = typeof state === "boolean";

    return this.each(function() {
      if ( bool ? state : isHidden( this ) ) {
        jQuery( this ).show();
      } else {
        jQuery( this ).hide();
      }
    });
  }
});

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity" );
          return ret === "" ? "1" : ret;
        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "columnCount": true,
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, hooks,
      origName = jQuery.camelCase( name ),
      style = elem.style;

    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && (ret = rrelNum.exec( value )) ) {
        value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
        // Fixes bug #9237
        type = "number";
      }

      // Make sure that NaN and null values aren't set. See: #7116
      if ( value == null || type === "number" && isNaN( value ) ) {
        return;
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
      // but it would mean to define eight (for every problematic property) identical functions
      if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
        style[ name ] = "inherit";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, extra, styles ) {
    var num, val, hooks,
      origName = jQuery.camelCase( name );

    // Make sure that we're working with the right name
    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks ) {
      val = hooks.get( elem, true, extra );
    }

    // Otherwise, if a way to get the computed value exists, use that
    if ( val === undefined ) {
      val = curCSS( elem, name, styles );
    }

    //convert "normal" to computed value
    if ( val === "normal" && name in cssNormalTransform ) {
      val = cssNormalTransform[ name ];
    }

    // Return, converting to number if forced or a qualifier was provided and val looks numeric
    if ( extra === "" || extra ) {
      num = parseFloat( val );
      return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
    }
    return val;
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback, args ) {
    var ret, name,
      old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.apply( elem, args || [] );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
  getStyles = function( elem ) {
    return window.getComputedStyle( elem, null );
  };

  curCSS = function( elem, name, _computed ) {
    var width, minWidth, maxWidth,
      computed = _computed || getStyles( elem ),

      // getPropertyValue is only needed for .css('filter') in IE9, see #12537
      ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
      style = elem.style;

    if ( computed ) {

      if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
        ret = jQuery.style( elem, name );
      }

      // A tribute to the "awesome hack by Dean Edwards"
      // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
      // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

        // Remember the original values
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        // Put in the new values to get a computed value out
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        // Revert the changed values
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret;
  };
} else if ( document.documentElement.currentStyle ) {
  getStyles = function( elem ) {
    return elem.currentStyle;
  };

  curCSS = function( elem, name, _computed ) {
    var left, rs, rsLeft,
      computed = _computed || getStyles( elem ),
      ret = computed ? computed[ name ] : undefined,
      style = elem.style;

    // Avoid setting ret to empty string here
    // so we don't default to auto
    if ( ret == null && style && style[ name ] ) {
      ret = style[ name ];
    }

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    // but not position css attributes, as those are proportional to the parent element instead
    // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
    if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

      // Remember the original values
      left = style.left;
      rs = elem.runtimeStyle;
      rsLeft = rs && rs.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        rs.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        rs.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

function setPositiveNumber( elem, value, subtract ) {
  var matches = rnumsplit.exec( value );
  return matches ?
    // Guard against undefined "subtract", e.g., when used as in cssHooks
    Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
    value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
  var i = extra === ( isBorderBox ? "border" : "content" ) ?
    // If we already have the right measurement, avoid augmentation
    4 :
    // Otherwise initialize for horizontal or vertical properties
    name === "width" ? 1 : 0,

    val = 0;

  for ( ; i < 4; i += 2 ) {
    // both box models exclude margin, so add it if we want it
    if ( extra === "margin" ) {
      val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
    }

    if ( isBorderBox ) {
      // border-box includes padding, so remove it if we want content
      if ( extra === "content" ) {
        val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
      }

      // at this point, extra isn't border nor margin, so remove border
      if ( extra !== "margin" ) {
        val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

      // at this point, extra isn't content nor padding, so add border
      if ( extra !== "padding" ) {
        val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
      }
    }
  }

  return val;
}

function getWidthOrHeight( elem, name, extra ) {

  // Start with offset property, which is equivalent to the border-box value
  var valueIsBorderBox = true,
    val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    styles = getStyles( elem ),
    isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if ( val <= 0 || val == null ) {
    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, styles );
    if ( val < 0 || val == null ) {
      val = elem.style[ name ];
    }

    // Computed unit is not pixels. Stop here and return.
    if ( rnumnonpx.test(val) ) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style
    valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  return ( val +
    augmentWidthOrHeight(
      elem,
      name,
      extra || ( isBorderBox ? "border" : "content" ),
      valueIsBorderBox,
      styles
    )
  ) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
  var doc = document,
    display = elemdisplay[ nodeName ];

  if ( !display ) {
    display = actualDisplay( nodeName, doc );

    // If the simple way fails, read from inside an iframe
    if ( display === "none" || !display ) {
      // Use the already-created iframe if possible
      iframe = ( iframe ||
        jQuery("<iframe frameborder='0' width='0' height='0'/>")
        .css( "cssText", "display:block !important" )
      ).appendTo( doc.documentElement );

      // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
      doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
      doc.write("<!doctype html><html><body>");
      doc.close();

      display = actualDisplay( nodeName, doc );
      iframe.detach();
    }

    // Store the correct default display
    elemdisplay[ nodeName ] = display;
  }

  return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
  var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
    display = jQuery.css( elem[0], "display" );
  elem.remove();
  return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      if ( computed ) {
        // certain elements can have dimension info if we invisibly show them
        // however, it must have a current display style that would benefit from this
        return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
          jQuery.swap( elem, cssShow, function() {
            return getWidthOrHeight( elem, name, extra );
          }) :
          getWidthOrHeight( elem, name, extra );
      }
    },

    set: function( elem, value, extra ) {
      var styles = extra && getStyles( elem );
      return setPositiveNumber( elem, value, extra ?
        augmentWidthOrHeight(
          elem,
          name,
          extra,
          jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
          styles
        ) : 0
      );
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle,
        opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
      // if value === "", then remove inline opacity #12685
      if ( ( value >= 1 || value === "" ) &&
          jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
          style.removeAttribute ) {

        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
        // if "filter:" is present at all, clearType is disabled, we want to avoid this
        // style.removeAttribute is IE Only, but so apparently is this code path...
        style.removeAttribute( "filter" );

        // if there is no filter style applied in a css rule or unset inline opacity, we are done
        if ( value === "" || currentStyle && !currentStyle.filter ) {
          return;
        }
      }

      // otherwise, set new filter values
      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        if ( computed ) {
          // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
          // Work around by temporarily setting element display to inline-block
          return jQuery.swap( elem, { "display": "inline-block" },
            curCSS, [ elem, "marginRight" ] );
        }
      }
    };
  }

  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // getComputedStyle returns percent when specified for top/left/bottom/right
  // rather than make the css module depend on the offset module, we just check for it here
  if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
    jQuery.each( [ "top", "left" ], function( i, prop ) {
      jQuery.cssHooks[ prop ] = {
        get: function( elem, computed ) {
          if ( computed ) {
            computed = curCSS( elem, prop );
            // if curCSS returns percentage, fallback to offset
            return rnumnonpx.test( computed ) ?
              jQuery( elem ).position()[ prop ] + "px" :
              computed;
          }
        }
      };
    });
  }

});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    // Support: Opera <= 12.12
    // Opera reports offsetWidths and offsetHeights less than zero on some elements
    return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
      (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}

// These hooks are used by animate to expand properties
jQuery.each({
  margin: "",
  padding: "",
  border: "Width"
}, function( prefix, suffix ) {
  jQuery.cssHooks[ prefix + suffix ] = {
    expand: function( value ) {
      var i = 0,
        expanded = {},

        // assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [ value ];

      for ( ; i < 4; i++ ) {
        expanded[ prefix + cssExpand[ i ] + suffix ] =
          parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      }

      return expanded;
    }
  };

  if ( !rmargin.test( prefix ) ) {
    jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
  }
});
var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
  rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },
  serializeArray: function() {
    return this.map(function(){
      // Can add propHook for "elements" to filter or add form elements
      var elements = jQuery.prop( this, "elements" );
      return elements ? jQuery.makeArray( elements ) : this;
    })
    .filter(function(){
      var type = this.type;
      // Use .is(":disabled") so that fieldset[disabled] works
      return this.name && !jQuery( this ).is( ":disabled" ) &&
        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
        ( this.checked || !manipulation_rcheckableType.test( type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
  var prefix,
    s = [],
    add = function( key, value ) {
      // If value is a function, invoke it and return its value
      value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if ( traditional === undefined ) {
    traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  }

  // If an array was passed in, assume that it is an array of form elements.
  if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    // Serialize the form elements
    jQuery.each( a, function() {
      add( this.name, this.value );
    });

  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // Item is non-scalar (array or object), encode its numeric index.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    return arguments.length > 0 ?
      this.on( name, null, data, fn ) :
      this.trigger( name );
  };
});

jQuery.fn.hover = function( fnOver, fnOut ) {
  return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
  // Document location
  ajaxLocParts,
  ajaxLocation,
  ajax_nonce = jQuery.now(),

  ajax_rquery = /\?/,
  rhash = /#.*$/,
  rts = /([?&])_=[^&]*/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    var dataType,
      i = 0,
      dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

    if ( jQuery.isFunction( func ) ) {
      // For each dataType in the dataTypeExpression
      while ( (dataType = dataTypes[i++]) ) {
        // Prepend if requested
        if ( dataType[0] === "+" ) {
          dataType = dataType.slice( 1 ) || "*";
          (structure[ dataType ] = structure[ dataType ] || []).unshift( func );

        // Otherwise append
        } else {
          (structure[ dataType ] = structure[ dataType ] || []).push( func );
        }
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

  var inspected = {},
    seekingTransport = ( structure === transports );

  function inspect( dataType ) {
    var selected;
    inspected[ dataType ] = true;
    jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
      var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
      if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
        options.dataTypes.unshift( dataTypeOrTransport );
        inspect( dataTypeOrTransport );
        return false;
      } else if ( seekingTransport ) {
        return !( selected = dataTypeOrTransport );
      }
    });
    return selected;
  }

  return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
  var deep, key,
    flatOptions = jQuery.ajaxSettings.flatOptions || {};

  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    jQuery.extend( true, target, deep );
  }

  return target;
}

jQuery.fn.load = function( url, params, callback ) {
  if ( typeof url !== "string" && _load ) {
    return _load.apply( this, arguments );
  }

  var selector, response, type,
    self = this,
    off = url.indexOf(" ");

  if ( off >= 0 ) {
    selector = url.slice( off, url.length );
    url = url.slice( 0, off );
  }

  // If it's a function
  if ( jQuery.isFunction( params ) ) {

    // We assume that it's the callback
    callback = params;
    params = undefined;

  // Otherwise, build a param string
  } else if ( params && typeof params === "object" ) {
    type = "POST";
  }

  // If we have elements to modify, make the request
  if ( self.length > 0 ) {
    jQuery.ajax({
      url: url,

      // if "type" variable is undefined, then "GET" method will be used
      type: type,
      dataType: "html",
      data: params
    }).done(function( responseText ) {

      // Save response for use in complete callback
      response = arguments;

      self.html( selector ?

        // If a selector was specified, locate the right elements in a dummy div
        // Exclude scripts to avoid IE 'Permission Denied' errors
        jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

        // Otherwise use the full result
        responseText );

    }).complete( callback && function( jqXHR, status ) {
      self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
    });
  }

  return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
  jQuery.fn[ type ] = function( fn ){
    return this.on( type, fn );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});

jQuery.extend({

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {},

  ajaxSettings: {
    url: ajaxLocation,
    type: "GET",
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    processData: true,
    async: true,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    throws: false,
    traditional: false,
    headers: {},
    */

    accepts: {
      "*": allTypes,
      text: "text/plain",
      html: "text/html",
      xml: "application/xml, text/xml",
      json: "application/json, text/javascript"
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // Data converters
    // Keys separate source (or catchall "*") and destination types with a single space
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    },

    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      url: true,
      context: true
    }
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function( target, settings ) {
    return settings ?

      // Building a settings object
      ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

      // Extending ajaxSettings
      ajaxExtend( jQuery.ajaxSettings, target );
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // Cross-domain detection vars
      parts,
      // Loop variable
      i,
      // URL without anti-cache param
      cacheURL,
      // Response headers as string
      responseHeadersString,
      // timeout handle
      timeoutTimer,

      // To know if global events are to be dispatched
      fireGlobals,

      transport,
      // Response headers
      responseHeaders,
      // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events is callbackContext if it is a DOM node or jQuery collection
      globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
        jQuery( callbackContext ) :
        jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery.Callbacks("once memory"),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // The jqXHR state
      state = 0,
      // Default abort message
      strAbort = "canceled",
      // Fake xhr
      jqXHR = {
        readyState: 0,

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while ( (match = rheaders.exec( responseHeadersString )) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match == null ? null : match;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Caches the header
        setRequestHeader: function( name, value ) {
          var lname = name.toLowerCase();
          if ( !state ) {
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Status-dependent callbacks
        statusCode: function( map ) {
          var code;
          if ( map ) {
            if ( state < 2 ) {
              for ( code in map ) {
                // Lazy-add the new callback in a way that preserves old ones
                statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
              }
            } else {
              // Execute the appropriate callbacks
              jqXHR.always( map[ jqXHR.status ] );
            }
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          var finalText = statusText || strAbort;
          if ( transport ) {
            transport.abort( finalText );
          }
          done( 0, finalText );
          return this;
        }
      };

    // Attach deferreds
    deferred.promise( jqXHR ).complete = completeDeferred.add;
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // Handle falsy url in the settings object (#10093: consistency with old signature)
    // We also use the url parameter if available
    s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Alias method option to type as per ticket #12004
    s.type = options.method || options.type || s.method || s.type;

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

    // A cross-domain request is in order when we have a protocol:host:port mismatch
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() );
      s.crossDomain = !!( parts &&
        ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
          ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
      );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefilter, stop there
    if ( state === 2 ) {
      return jqXHR;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger("ajaxStart");
    }

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Save the URL in case we're toying with the If-Modified-Since
    // and/or If-None-Match header later on
    cacheURL = s.url;

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
        // #9682: remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Add anti-cache in url if needed
      if ( s.cache === false ) {
        s.url = rts.test( cacheURL ) ?

          // If there is already a '_' parameter, set its value
          cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

          // Otherwise add one to the end
          cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
      }
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      if ( jQuery.lastModified[ cacheURL ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
      }
      if ( jQuery.etag[ cacheURL ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
      // Abort if not done already and return
      return jqXHR.abort();
    }

    // aborting is no longer a cancellation
    strAbort = "abort";

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;

      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout(function() {
          jqXHR.abort("timeout");
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch ( e ) {
        // Propagate exception as error if not done
        if ( state < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          throw e;
        }
      }
    }

    // Callback for when everything is done
    function done( status, nativeStatusText, responses, headers ) {
      var isSuccess, success, error, response, modified,
        statusText = nativeStatusText;

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status > 0 ? 4 : 0;

      // Get response data
      if ( responses ) {
        response = ajaxHandleResponses( s, jqXHR, responses );
      }

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
          modified = jqXHR.getResponseHeader("Last-Modified");
          if ( modified ) {
            jQuery.lastModified[ cacheURL ] = modified;
          }
          modified = jqXHR.getResponseHeader("etag");
          if ( modified ) {
            jQuery.etag[ cacheURL ] = modified;
          }
        }

        // if no content
        if ( status === 204 ) {
          isSuccess = true;
          statusText = "nocontent";

        // if not modified
        } else if ( status === 304 ) {
          isSuccess = true;
          statusText = "notmodified";

        // If we have data, let's convert it
        } else {
          isSuccess = ajaxConvert( s, response );
          statusText = isSuccess.state;
          success = isSuccess.data;
          error = isSuccess.error;
          isSuccess = !error;
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if ( status || !statusText ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = ( nativeStatusText || statusText ) + "";

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
          [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger("ajaxStop");
        }
      }
    }

    return jqXHR;
  },

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  }
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
  var firstDataType, ct, finalDataType, type,
    contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields;

  // Fill responseXXX fields
  for ( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
  var conv2, current, conv, tmp,
    converters = {},
    i = 0,
    // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice(),
    prev = dataTypes[ 0 ];

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  // Create converters map with lowercased keys
  if ( dataTypes[ 1 ] ) {
    for ( conv in s.converters ) {
      converters[ conv.toLowerCase() ] = s.converters[ conv ];
    }
  }

  // Convert to each sequential dataType, tolerating list modification
  for ( ; (current = dataTypes[++i]); ) {

    // There's only work to do if current dataType is non-auto
    if ( current !== "*" ) {

      // Convert response if prev dataType is non-auto and differs from current
      if ( prev !== "*" && prev !== current ) {

        // Seek a direct converter
        conv = converters[ prev + " " + current ] || converters[ "* " + current ];

        // If none found, seek a pair
        if ( !conv ) {
          for ( conv2 in converters ) {

            // If conv2 outputs current
            tmp = conv2.split(" ");
            if ( tmp[ 1 ] === current ) {

              // If prev can be converted to accepted input
              conv = converters[ prev + " " + tmp[ 0 ] ] ||
                converters[ "* " + tmp[ 0 ] ];
              if ( conv ) {
                // Condense equivalence converters
                if ( conv === true ) {
                  conv = converters[ conv2 ];

                // Otherwise, insert the intermediate dataType
                } else if ( converters[ conv2 ] !== true ) {
                  current = tmp[ 0 ];
                  dataTypes.splice( i--, 0, current );
                }

                break;
              }
            }
          }
        }

        // Apply converter (if not an equivalence)
        if ( conv !== true ) {

          // Unless errors are allowed to bubble, catch and return them
          if ( conv && s["throws"] ) {
            response = conv( response );
          } else {
            try {
              response = conv( response );
            } catch ( e ) {
              return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
            }
          }
        }
      }

      // Update prev for next iteration
      prev = current;
    }
  }

  return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /(?:java|ecma)script/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || jQuery("head")[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement("script");

        script.async = true;

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( script.parentNode ) {
              script.parentNode.removeChild( script );
            }

            // Dereference the script
            script = null;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };

        // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
        // Use native DOM manipulation to avoid our domManip AJAX trickery
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( undefined, true );
        }
      }
    };
  }
});
var oldCallbacks = [],
  rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
    this[ callback ] = true;
    return callback;
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var callbackName, overwritten, responseContainer,
    jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
      "url" :
      typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
    );

  // Handle iff the expected data type is "jsonp" or we have a parameter to set
  if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    // Get callback name, remembering preexisting value associated with it
    callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
      s.jsonpCallback() :
      s.jsonpCallback;

    // Insert callback into url or form data
    if ( jsonProp ) {
      s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    } else if ( s.jsonp !== false ) {
      s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    }

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( callbackName + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Install callback
    overwritten = window[ callbackName ];
    window[ callbackName ] = function() {
      responseContainer = arguments;
    };

    // Clean-up function (fires after converters)
    jqXHR.always(function() {
      // Restore preexisting value
      window[ callbackName ] = overwritten;

      // Save back as free
      if ( s[ callbackName ] ) {
        // make sure that re-using the options doesn't screw things around
        s.jsonpCallback = originalSettings.jsonpCallback;

        // save the callback name for future use
        oldCallbacks.push( callbackName );
      }

      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( overwritten ) ) {
        overwritten( responseContainer[ 0 ] );
      }

      responseContainer = overwritten = undefined;
    });

    // Delegate to script
    return "script";
  }
});
var xhrCallbacks, xhrSupported,
  xhrId = 0,
  // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject && function() {
    // Abort all pending requests
    var key;
    for ( key in xhrCallbacks ) {
      xhrCallbacks[ key ]( undefined, true );
    }
  };

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject("Microsoft.XMLHTTP");
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var handle, i,
            xhr = s.xhr();

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( err ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {
            var status, responseHeaders, statusText, responses;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occurred
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  responses = {};
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();

                  // When requesting binary data, IE6-9 will throw an exception
                  // on any attempt to access responseText (#11426)
                  if ( typeof xhr.responseText === "string" ) {
                    responses.text = xhr.responseText;
                  }

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          if ( !s.async ) {
            // if we're in sync mode we fire the callback
            callback();
          } else if ( xhr.readyState === 4 ) {
            // (IE6 & IE7) if it's in cache and has been
            // retrieved directly we need to fire the callback
            setTimeout( callback );
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback( undefined, true );
          }
        }
      };
    }
  });
}
var fxNow, timerId,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
  rrun = /queueHooks$/,
  animationPrefilters = [ defaultPrefilter ],
  tweeners = {
    "*": [function( prop, value ) {
      var end, unit,
        tween = this.createTween( prop, value ),
        parts = rfxnum.exec( value ),
        target = tween.cur(),
        start = +target || 0,
        scale = 1,
        maxIterations = 20;

      if ( parts ) {
        end = +parts[2];
        unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

        // We need to compute starting value
        if ( unit !== "px" && start ) {
          // Iteratively approximate from a nonzero starting point
          // Prefer the current property, because this process will be trivial if it uses the same units
          // Fallback to end or a simple constant
          start = jQuery.css( tween.elem, prop, true ) || end || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style( tween.elem, prop, start + unit );

          // Update scale, tolerating zero or NaN from tween.cur()
          // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
        }

        tween.unit = unit;
        tween.start = start;
        // If a +=/-= token was provided, we're doing a relative animation
        tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
      }
      return tween;
    }]
  };

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout(function() {
    fxNow = undefined;
  });
  return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
  jQuery.each( props, function( prop, value ) {
    var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      index = 0,
      length = collection.length;
    for ( ; index < length; index++ ) {
      if ( collection[ index ].call( animation, prop, value ) ) {

        // we're done with this property
        return;
      }
    }
  });
}

function Animation( elem, properties, options ) {
  var result,
    stopped,
    index = 0,
    length = animationPrefilters.length,
    deferred = jQuery.Deferred().always( function() {
      // don't match elem in the :animated selector
      delete tick.elem;
    }),
    tick = function() {
      if ( stopped ) {
        return false;
      }
      var currentTime = fxNow || createFxNow(),
        remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
        // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
        temp = remaining / animation.duration || 0,
        percent = 1 - temp,
        index = 0,
        length = animation.tweens.length;

      for ( ; index < length ; index++ ) {
        animation.tweens[ index ].run( percent );
      }

      deferred.notifyWith( elem, [ animation, percent, remaining ]);

      if ( percent < 1 && length ) {
        return remaining;
      } else {
        deferred.resolveWith( elem, [ animation ] );
        return false;
      }
    },
    animation = deferred.promise({
      elem: elem,
      props: jQuery.extend( {}, properties ),
      opts: jQuery.extend( true, { specialEasing: {} }, options ),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function( prop, end ) {
        var tween = jQuery.Tween( elem, animation.opts, prop, end,
            animation.opts.specialEasing[ prop ] || animation.opts.easing );
        animation.tweens.push( tween );
        return tween;
      },
      stop: function( gotoEnd ) {
        var index = 0,
          // if we are going to the end, we want to run all the tweens
          // otherwise we skip this part
          length = gotoEnd ? animation.tweens.length : 0;
        if ( stopped ) {
          return this;
        }
        stopped = true;
        for ( ; index < length ; index++ ) {
          animation.tweens[ index ].run( 1 );
        }

        // resolve when we played the last frame
        // otherwise, reject
        if ( gotoEnd ) {
          deferred.resolveWith( elem, [ animation, gotoEnd ] );
        } else {
          deferred.rejectWith( elem, [ animation, gotoEnd ] );
        }
        return this;
      }
    }),
    props = animation.props;

  propFilter( props, animation.opts.specialEasing );

  for ( ; index < length ; index++ ) {
    result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
    if ( result ) {
      return result;
    }
  }

  createTweens( animation, props );

  if ( jQuery.isFunction( animation.opts.start ) ) {
    animation.opts.start.call( elem, animation );
  }

  jQuery.fx.timer(
    jQuery.extend( tick, {
      elem: elem,
      anim: animation,
      queue: animation.opts.queue
    })
  );

  // attach callbacks from options
  return animation.progress( animation.opts.progress )
    .done( animation.opts.done, animation.opts.complete )
    .fail( animation.opts.fail )
    .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
  var value, name, index, easing, hooks;

  // camelCase, specialEasing and expand cssHook pass
  for ( index in props ) {
    name = jQuery.camelCase( index );
    easing = specialEasing[ name ];
    value = props[ index ];
    if ( jQuery.isArray( value ) ) {
      easing = value[ 1 ];
      value = props[ index ] = value[ 0 ];
    }

    if ( index !== name ) {
      props[ name ] = value;
      delete props[ index ];
    }

    hooks = jQuery.cssHooks[ name ];
    if ( hooks && "expand" in hooks ) {
      value = hooks.expand( value );
      delete props[ name ];

      // not quite $.extend, this wont overwrite keys already present.
      // also - reusing 'index' from above because we have the correct "name"
      for ( index in value ) {
        if ( !( index in props ) ) {
          props[ index ] = value[ index ];
          specialEasing[ index ] = easing;
        }
      }
    } else {
      specialEasing[ name ] = easing;
    }
  }
}

jQuery.Animation = jQuery.extend( Animation, {

  tweener: function( props, callback ) {
    if ( jQuery.isFunction( props ) ) {
      callback = props;
      props = [ "*" ];
    } else {
      props = props.split(" ");
    }

    var prop,
      index = 0,
      length = props.length;

    for ( ; index < length ; index++ ) {
      prop = props[ index ];
      tweeners[ prop ] = tweeners[ prop ] || [];
      tweeners[ prop ].unshift( callback );
    }
  },

  prefilter: function( callback, prepend ) {
    if ( prepend ) {
      animationPrefilters.unshift( callback );
    } else {
      animationPrefilters.push( callback );
    }
  }
});

function defaultPrefilter( elem, props, opts ) {
  /*jshint validthis:true */
  var prop, index, length,
    value, dataShow, toggle,
    tween, hooks, oldfire,
    anim = this,
    style = elem.style,
    orig = {},
    handled = [],
    hidden = elem.nodeType && isHidden( elem );

  // handle queue: false promises
  if ( !opts.queue ) {
    hooks = jQuery._queueHooks( elem, "fx" );
    if ( hooks.unqueued == null ) {
      hooks.unqueued = 0;
      oldfire = hooks.empty.fire;
      hooks.empty.fire = function() {
        if ( !hooks.unqueued ) {
          oldfire();
        }
      };
    }
    hooks.unqueued++;

    anim.always(function() {
      // doing this makes sure that the complete handler will be called
      // before this completes
      anim.always(function() {
        hooks.unqueued--;
        if ( !jQuery.queue( elem, "fx" ).length ) {
          hooks.empty.fire();
        }
      });
    });
  }

  // height/width overflow pass
  if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
    // Make sure that nothing sneaks out
    // Record all 3 overflow attributes because IE does not
    // change the overflow attribute when overflowX and
    // overflowY are set to the same value
    opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    // Set display property to inline-block for height/width
    // animations on inline elements that are having width/height animated
    if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

      // inline-level elements accept inline-block;
      // block-level elements need to be inline with layout
      if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
        style.display = "inline-block";

      } else {
        style.zoom = 1;
      }
    }
  }

  if ( opts.overflow ) {
    style.overflow = "hidden";
    if ( !jQuery.support.shrinkWrapBlocks ) {
      anim.always(function() {
        style.overflow = opts.overflow[ 0 ];
        style.overflowX = opts.overflow[ 1 ];
        style.overflowY = opts.overflow[ 2 ];
      });
    }
  }


  // show/hide pass
  for ( index in props ) {
    value = props[ index ];
    if ( rfxtypes.exec( value ) ) {
      delete props[ index ];
      toggle = toggle || value === "toggle";
      if ( value === ( hidden ? "hide" : "show" ) ) {
        continue;
      }
      handled.push( index );
    }
  }

  length = handled.length;
  if ( length ) {
    dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
    if ( "hidden" in dataShow ) {
      hidden = dataShow.hidden;
    }

    // store state if its toggle - enables .stop().toggle() to "reverse"
    if ( toggle ) {
      dataShow.hidden = !hidden;
    }
    if ( hidden ) {
      jQuery( elem ).show();
    } else {
      anim.done(function() {
        jQuery( elem ).hide();
      });
    }
    anim.done(function() {
      var prop;
      jQuery._removeData( elem, "fxshow" );
      for ( prop in orig ) {
        jQuery.style( elem, prop, orig[ prop ] );
      }
    });
    for ( index = 0 ; index < length ; index++ ) {
      prop = handled[ index ];
      tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
      orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

      if ( !( prop in dataShow ) ) {
        dataShow[ prop ] = tween.start;
        if ( hidden ) {
          tween.end = tween.start;
          tween.start = prop === "width" || prop === "height" ? 1 : 0;
        }
      }
    }
  }
}

function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];

    return hooks && hooks.get ?
      hooks.get( this ) :
      Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    var eased,
      hooks = Tween.propHooks[ this.prop ];

    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
      );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;

    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
  _default: {
    get: function( tween ) {
      var result;

      if ( tween.elem[ tween.prop ] != null &&
        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
        return tween.elem[ tween.prop ];
      }

      // passing an empty string as a 3rd parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails
      // so, simple values such as "10px" are parsed to Float.
      // complex values such as "rotate(1rad)" are returned as is.
      result = jQuery.css( tween.elem, tween.prop, "" );
      // Empty strings, null, undefined and "auto" are converted to 0.
      return !result || result === "auto" ? 0 : result;
    },
    set: function( tween ) {
      // use step hook for back compat - use cssHook if its there - use .style if its
      // available and use plain properties where available
      if ( jQuery.fx.step[ tween.prop ] ) {
        jQuery.fx.step[ tween.prop ]( tween );
      } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      } else {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function( tween ) {
    if ( tween.elem.nodeType && tween.elem.parentNode ) {
      tween.elem[ tween.prop ] = tween.now;
    }
  }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
  var cssFn = jQuery.fn[ name ];
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return speed == null || typeof speed === "boolean" ?
      cssFn.apply( this, arguments ) :
      this.animate( genFx( name, true ), speed, easing, callback );
  };
});

jQuery.fn.extend({
  fadeTo: function( speed, to, easing, callback ) {

    // show any hidden elements after setting opacity to 0
    return this.filter( isHidden ).css( "opacity", 0 ).show()

      // animate to the value specified
      .end().animate({ opacity: to }, speed, easing, callback );
  },
  animate: function( prop, speed, easing, callback ) {
    var empty = jQuery.isEmptyObject( prop ),
      optall = jQuery.speed( speed, easing, callback ),
      doAnimation = function() {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation( this, jQuery.extend( {}, prop ), optall );
        doAnimation.finish = function() {
          anim.stop( true );
        };
        // Empty animations, or finishing resolves immediately
        if ( empty || jQuery._data( this, "finish" ) ) {
          anim.stop( true );
        }
      };
      doAnimation.finish = doAnimation;

    return empty || optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },
  stop: function( type, clearQueue, gotoEnd ) {
    var stopQueue = function( hooks ) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop( gotoEnd );
    };

    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var dequeue = true,
        index = type != null && type + "queueHooks",
        timers = jQuery.timers,
        data = jQuery._data( this );

      if ( index ) {
        if ( data[ index ] && data[ index ].stop ) {
          stopQueue( data[ index ] );
        }
      } else {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
            stopQueue( data[ index ] );
          }
        }
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          timers[ index ].anim.stop( gotoEnd );
          dequeue = false;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( dequeue || !gotoEnd ) {
        jQuery.dequeue( this, type );
      }
    });
  },
  finish: function( type ) {
    if ( type !== false ) {
      type = type || "fx";
    }
    return this.each(function() {
      var index,
        data = jQuery._data( this ),
        queue = data[ type + "queue" ],
        hooks = data[ type + "queueHooks" ],
        timers = jQuery.timers,
        length = queue ? queue.length : 0;

      // enable finishing flag on private data
      data.finish = true;

      // empty the queue first
      jQuery.queue( this, type, [] );

      if ( hooks && hooks.cur && hooks.cur.finish ) {
        hooks.cur.finish.call( this );
      }

      // look for any active animations, and finish them
      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
          timers[ index ].anim.stop( true );
          timers.splice( index, 1 );
        }
      }

      // look for any animations in the old queue and finish them
      for ( index = 0; index < length; index++ ) {
        if ( queue[ index ] && queue[ index ].finish ) {
          queue[ index ].finish.call( this );
        }
      }

      // turn off finishing flag
      delete data.finish;
    });
  }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
  var which,
    attrs = { height: type },
    i = 0;

  // if we include width, step value is 1 to do all cssExpand values,
  // if we don't include width, step value is 2 to skip over Left and Right
  includeWidth = includeWidth? 1 : 0;
  for( ; i < 4 ; i += 2 - includeWidth ) {
    which = cssExpand[ i ];
    attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  }

  if ( includeWidth ) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show"),
  slideUp: genFx("hide"),
  slideToggle: genFx("toggle"),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.speed = function( speed, easing, fn ) {
  var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    complete: fn || !fn && easing ||
      jQuery.isFunction( speed ) && speed,
    duration: speed,
    easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  };

  opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  // normalize opt.queue - true/undefined/null -> "fx"
  if ( opt.queue == null || opt.queue === true ) {
    opt.queue = "fx";
  }

  // Queueing
  opt.old = opt.complete;

  opt.complete = function() {
    if ( jQuery.isFunction( opt.old ) ) {
      opt.old.call( this );
    }

    if ( opt.queue ) {
      jQuery.dequeue( this, opt.queue );
    }
  };

  return opt;
};

jQuery.easing = {
  linear: function( p ) {
    return p;
  },
  swing: function( p ) {
    return 0.5 - Math.cos( p*Math.PI ) / 2;
  }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
  var timer,
    timers = jQuery.timers,
    i = 0;

  fxNow = jQuery.now();

  for ( ; i < timers.length; i++ ) {
    timer = timers[ i ];
    // Checks the timer has not already been removed
    if ( !timer() && timers[ i ] === timer ) {
      timers.splice( i--, 1 );
    }
  }

  if ( !timers.length ) {
    jQuery.fx.stop();
  }
  fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
  if ( timer() && jQuery.timers.push( timer ) ) {
    jQuery.fx.start();
  }
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
  if ( !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};

jQuery.fx.stop = function() {
  clearInterval( timerId );
  timerId = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}
jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var docElem, win,
    box = { top: 0, left: 0 },
    elem = this[ 0 ],
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return;
  }

  docElem = doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if ( !jQuery.contains( docElem, elem ) ) {
    return box;
  }

  // If we don't have gBCR, just use 0,0 rather than error
  // BlackBerry 5, iOS 3 (original iPhone)
  if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow( doc );
  return {
    top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
    left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
  };
};

jQuery.offset = {

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[ 0 ] ) {
      return;
    }

    var offsetParent, offset,
      parentOffset = { top: 0, left: 0 },
      elem = this[ 0 ];

    // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
    if ( jQuery.css( elem, "position" ) === "fixed" ) {
      // we assume that getBoundingClientRect is available when computed position is fixed
      offset = elem.getBoundingClientRect();
    } else {
      // Get *real* offsetParent
      offsetParent = this.offsetParent();

      // Get correct offsets
      offset = this.offset();
      if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
        parentOffset = offsetParent.offset();
      }

      // Add offsetParent borders
      parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
      parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
    }

    // Subtract parent offsets and element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    return {
      top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
      left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.documentElement;
      while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || document.documentElement;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = /Y/.test( prop );

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? (prop in win) ? win[ prop ] :
          win.document.documentElement[ method ] :
          elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : jQuery( win ).scrollLeft(),
          top ? val : jQuery( win ).scrollTop()
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
    // margin is only for outerHeight, outerWidth
    jQuery.fn[ funcName ] = function( margin, value ) {
      var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

      return jQuery.access( this, function( elem, type, value ) {
        var doc;

        if ( jQuery.isWindow( elem ) ) {
          // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
          // isn't a whole lot we can do. See pull request at this URL for discussion:
          // https://github.com/jquery/jquery/pull/764
          return elem.document.documentElement[ "client" + name ];
        }

        // Get document width or height
        if ( elem.nodeType === 9 ) {
          doc = elem.documentElement;

          // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
          // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
          return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
          );
        }

        return value === undefined ?
          // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css( elem, type, extra ) :

          // Set width or height on the element
          jQuery.style( elem, type, value, extra );
      }, type, chainable ? margin : undefined, chainable, null );
    };
  });
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}

})( window );
// Instantiate the object
var I18n = I18n || {};

// Set default locale to english
I18n.defaultLocale = "en";

// Set default handling of translation fallbacks to false
I18n.fallbacks = false;

// Set default separator
I18n.defaultSeparator = ".";

// Set current locale to null
I18n.locale = null;

// Set the placeholder format. Accepts `{{placeholder}}` and `%{placeholder}`.
I18n.PLACEHOLDER = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm;

I18n.isValidNode = function(obj, node, undefined) {
    return obj[node] !== null && obj[node] !== undefined;
}

I18n.lookup = function(scope, options) {
  var options = options || {}
    , lookupInitialScope = scope
    , translations = this.prepareOptions(I18n.translations)
    , messages = translations[options.locale || I18n.currentLocale()]
    , options = this.prepareOptions(options)
    , currentScope
  ;

  if (!messages){
    return;
  }

  if (typeof(scope) == "object") {
    scope = scope.join(this.defaultSeparator);
  }

  if (options.scope) {
    scope = options.scope.toString() + this.defaultSeparator + scope;
  }

  scope = scope.split(this.defaultSeparator);

  while (scope.length > 0) {
    currentScope = scope.shift();
    messages = messages[currentScope];

    if (!messages) {
      if (I18n.fallbacks && !options.fallback) {
        messages = I18n.lookup(lookupInitialScope, this.prepareOptions({ locale: I18n.defaultLocale, fallback: true }, options));
      }
      break;
    }
  }

  if (!messages && this.isValidNode(options, "defaultValue")) {
    messages = options.defaultValue;
  }

  return messages;
};

// Merge serveral hash options, checking if value is set before
// overwriting any value. The precedence is from left to right.
//
//   I18n.prepareOptions({name: "John Doe"}, {name: "Mary Doe", role: "user"});
//   #=> {name: "John Doe", role: "user"}
//
I18n.prepareOptions = function() {
  var options = {}
    , opts
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    opts = arguments[i];

    if (!opts) {
      continue;
    }

    for (var key in opts) {
      if (!this.isValidNode(options, key)) {
        options[key] = opts[key];
      }
    }
  }

  return options;
};

I18n.interpolate = function(message, options) {
  options = this.prepareOptions(options);
  var matches = message.match(this.PLACEHOLDER)
    , placeholder
    , value
    , name
  ;

  if (!matches) {
    return message;
  }

  for (var i = 0; placeholder = matches[i]; i++) {
    name = placeholder.replace(this.PLACEHOLDER, "$1");

    value = options[name];

    if (!this.isValidNode(options, name)) {
      value = "[missing " + placeholder + " value]";
    }

    regex = new RegExp(placeholder.replace(/\{/gm, "\\{").replace(/\}/gm, "\\}"));
    message = message.replace(regex, value);
  }

  return message;
};

I18n.translate = function(scope, options) {
  options = this.prepareOptions(options);
  var translation = this.lookup(scope, options);

  try {
    if (typeof(translation) == "object") {
      if (typeof(options.count) == "number") {
        return this.pluralize(options.count, scope, options);
      } else {
        return translation;
      }
    } else {
      return this.interpolate(translation, options);
    }
  } catch(err) {
    return this.missingTranslation(scope);
  }
};

I18n.localize = function(scope, value) {
  switch (scope) {
    case "currency":
      return this.toCurrency(value);
    case "number":
      scope = this.lookup("number.format");
      return this.toNumber(value, scope);
    case "percentage":
      return this.toPercentage(value);
    default:
      if (scope.match(/^(date|time)/)) {
        return this.toTime(scope, value);
      } else {
        return value.toString();
      }
  }
};

I18n.parseDate = function(date) {
  var matches, convertedDate;

  // we have a date, so just return it.
  if (typeof(date) == "object") {
    return date;
  };

  // it matches the following formats:
  //   yyyy-mm-dd
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ss
  //   yyyy-mm-dd[ T]hh:mm::ssZ
  //   yyyy-mm-dd[ T]hh:mm::ss+0000
  //
  matches = date.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?(Z|\+0000)?/);

  if (matches) {
    for (var i = 1; i <= 6; i++) {
      matches[i] = parseInt(matches[i], 10) || 0;
    }

    // month starts on 0
    matches[2] -= 1;

    if (matches[7]) {
      convertedDate = new Date(Date.UTC(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]));
    } else {
      convertedDate = new Date(matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]);
    }
  } else if (typeof(date) == "number") {
    // UNIX timestamp
    convertedDate = new Date();
    convertedDate.setTime(date);
  } else if (date.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)) {
    // a valid javascript format with timezone info
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date))
  } else {
    // an arbitrary javascript string
    convertedDate = new Date();
    convertedDate.setTime(Date.parse(date));
  }

  return convertedDate;
};

I18n.toTime = function(scope, d) {
  var date = this.parseDate(d)
    , format = this.lookup(scope)
  ;

  if (date.toString().match(/invalid/i)) {
    return date.toString();
  }

  if (!format) {
    return date.toString();
  }

  return this.strftime(date, format);
};

I18n.strftime = function(date, format) {
  var options = this.lookup("date");

  if (!options) {
    return date.toString();
  }

  options.meridian = options.meridian || ["AM", "PM"];

  var weekDay = date.getDay()
    , day = date.getDate()
    , year = date.getFullYear()
    , month = date.getMonth() + 1
    , hour = date.getHours()
    , hour12 = hour
    , meridian = hour > 11 ? 1 : 0
    , secs = date.getSeconds()
    , mins = date.getMinutes()
    , offset = date.getTimezoneOffset()
    , absOffsetHours = Math.floor(Math.abs(offset / 60))
    , absOffsetMinutes = Math.abs(offset) - (absOffsetHours * 60)
    , timezoneoffset = (offset > 0 ? "-" : "+") + (absOffsetHours.toString().length < 2 ? "0" + absOffsetHours : absOffsetHours) + (absOffsetMinutes.toString().length < 2 ? "0" + absOffsetMinutes : absOffsetMinutes)
  ;

  if (hour12 > 12) {
    hour12 = hour12 - 12;
  } else if (hour12 === 0) {
    hour12 = 12;
  }

  var padding = function(n) {
    var s = "0" + n.toString();
    return s.substr(s.length - 2);
  };

  var f = format;
  f = f.replace("%a", options.abbr_day_names[weekDay]);
  f = f.replace("%A", options.day_names[weekDay]);
  f = f.replace("%b", options.abbr_month_names[month]);
  f = f.replace("%B", options.month_names[month]);
  f = f.replace("%d", padding(day));
  f = f.replace("%e", day);
  f = f.replace("%-d", day);
  f = f.replace("%H", padding(hour));
  f = f.replace("%-H", hour);
  f = f.replace("%I", padding(hour12));
  f = f.replace("%-I", hour12);
  f = f.replace("%m", padding(month));
  f = f.replace("%-m", month);
  f = f.replace("%M", padding(mins));
  f = f.replace("%-M", mins);
  f = f.replace("%p", options.meridian[meridian]);
  f = f.replace("%S", padding(secs));
  f = f.replace("%-S", secs);
  f = f.replace("%w", weekDay);
  f = f.replace("%y", padding(year));
  f = f.replace("%-y", padding(year).replace(/^0+/, ""));
  f = f.replace("%Y", year);
  f = f.replace("%z", timezoneoffset);

  return f;
};

I18n.toNumber = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ",", strip_insignificant_zeros: false}
  );

  var negative = number < 0
    , string = Math.abs(number).toFixed(options.precision).toString()
    , parts = string.split(".")
    , precision
    , buffer = []
    , formattedNumber
  ;

  number = parts[0];
  precision = parts[1];

  while (number.length > 0) {
    buffer.unshift(number.substr(Math.max(0, number.length - 3), 3));
    number = number.substr(0, number.length -3);
  }

  formattedNumber = buffer.join(options.delimiter);

  if (options.precision > 0) {
    formattedNumber += options.separator + parts[1];
  }

  if (negative) {
    formattedNumber = "-" + formattedNumber;
  }

  if (options.strip_insignificant_zeros) {
    var regex = {
        separator: new RegExp(options.separator.replace(/\./, "\\.") + "$")
      , zeros: /0+$/
    };

    formattedNumber = formattedNumber
      .replace(regex.zeros, "")
      .replace(regex.separator, "")
    ;
  }

  return formattedNumber;
};

I18n.toCurrency = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.currency.format"),
    this.lookup("number.format"),
    {unit: "$", precision: 2, format: "%u%n", delimiter: ",", separator: "."}
  );

  number = this.toNumber(number, options);
  number = options.format
    .replace("%u", options.unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toHumanSize = function(number, options) {
  var kb = 1024
    , size = number
    , iterations = 0
    , unit
    , precision
  ;

  while (size >= kb && iterations < 4) {
    size = size / kb;
    iterations += 1;
  }

  if (iterations === 0) {
    unit = this.t("number.human.storage_units.units.byte", {count: size});
    precision = 0;
  } else {
    unit = this.t("number.human.storage_units.units." + [null, "kb", "mb", "gb", "tb"][iterations]);
    precision = (size - Math.floor(size) === 0) ? 0 : 1;
  }

  options = this.prepareOptions(
    options,
    {precision: precision, format: "%n%u", delimiter: ""}
  );

  number = this.toNumber(size, options);
  number = options.format
    .replace("%u", unit)
    .replace("%n", number)
  ;

  return number;
};

I18n.toPercentage = function(number, options) {
  options = this.prepareOptions(
    options,
    this.lookup("number.percentage.format"),
    this.lookup("number.format"),
    {precision: 3, separator: ".", delimiter: ""}
  );

  number = this.toNumber(number, options);
  return number + "%";
};

I18n.pluralize = function(count, scope, options) {
  var translation;

  try {
    translation = this.lookup(scope, options);
  } catch (error) {}

  if (!translation) {
    return this.missingTranslation(scope);
  }

  var message;
  options = this.prepareOptions(options);
  options.count = count.toString();

  switch(Math.abs(count)) {
    case 0:
      message = this.isValidNode(translation, "zero") ? translation.zero :
                this.isValidNode(translation, "none") ? translation.none :
                this.isValidNode(translation, "other") ? translation.other :
                this.missingTranslation(scope, "zero");
      break;
    case 1:
      message = this.isValidNode(translation, "one") ? translation.one : this.missingTranslation(scope, "one");
      break;
    default:
      message = this.isValidNode(translation, "other") ? translation.other : this.missingTranslation(scope, "other");
  }

  return this.interpolate(message, options);
};

I18n.missingTranslation = function() {
  var message = '[missing "' + this.currentLocale()
    , count = arguments.length
  ;

  for (var i = 0; i < count; i++) {
    message += "." + arguments[i];
  }

  message += '" translation]';

  return message;
};

I18n.currentLocale = function() {
  return (I18n.locale || I18n.defaultLocale);
};

// shortcuts
I18n.t = I18n.translate;
I18n.l = I18n.localize;
I18n.p = I18n.pluralize;
var I18n = I18n || {};
I18n.translations = {"en":{"date":{"formats":{"default":"%Y-%m-%d","short":"%b %d","long":"%B %d, %Y"},"day_names":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"abbr_day_names":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"month_names":[null,"January","February","March","April","May","June","July","August","September","October","November","December"],"abbr_month_names":[null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"order":["year","month","day"]},"time":{"formats":{"default":"%a, %d %b %Y %H:%M:%S %z","short":"%d %b %H:%M","long":"%B %d, %Y %H:%M"},"am":"am","pm":"pm"},"support":{"array":{"words_connector":", ","two_words_connector":" and ","last_word_connector":", and "}},"errors":{"format":"%{attribute} %{message}","messages":{"inclusion":"is not included in the list","exclusion":"is reserved","invalid":"is invalid","confirmation":"doesn't match confirmation","accepted":"must be accepted","empty":"can't be empty","blank":"can't be blank","too_long":"is too long (maximum is %{count} characters)","too_short":"is too short (minimum is %{count} characters)","wrong_length":"is the wrong length (should be %{count} characters)","not_a_number":"is not a number","not_an_integer":"must be an integer","greater_than":"must be greater than %{count}","greater_than_or_equal_to":"must be greater than or equal to %{count}","equal_to":"must be equal to %{count}","less_than":"must be less than %{count}","less_than_or_equal_to":"must be less than or equal to %{count}","odd":"must be odd","even":"must be even","in_between":"must be in between %{min} and %{max}","already_confirmed":"was already confirmed","confirmation_period_expired":"needs to be confirmed within %{period}, please request a new one","expired":"has expired, please request a new one","not_found":"not found","not_locked":"was not locked","not_saved":{"one":"1 error prohibited this %{resource} from being saved:","other":"%{count} errors prohibited this %{resource} from being saved:"}}},"activerecord":{"errors":{"messages":{"taken":"has already been taken","record_invalid":"Validation failed: %{errors}"}}},"number":{"format":{"separator":".","delimiter":",","precision":3,"significant":false,"strip_insignificant_zeros":false},"currency":{"format":{"format":"%u%n","unit":"$","separator":".","delimiter":",","precision":2,"significant":false,"strip_insignificant_zeros":false}},"percentage":{"format":{"delimiter":""}},"precision":{"format":{"delimiter":""}},"human":{"format":{"delimiter":"","precision":3,"significant":true,"strip_insignificant_zeros":true},"storage_units":{"format":"%n %u","units":{"byte":{"one":"Byte","other":"Bytes"},"kb":"KB","mb":"MB","gb":"GB","tb":"TB"}},"decimal_units":{"format":"%n %u","units":{"unit":"","thousand":"Thousand","million":"Million","billion":"Billion","trillion":"Trillion","quadrillion":"Quadrillion"}}}},"datetime":{"distance_in_words":{"half_a_minute":"half a minute","less_than_x_seconds":{"one":"less than 1 second","other":"less than %{count} seconds"},"x_seconds":{"one":"1 second","other":"%{count} seconds"},"less_than_x_minutes":{"one":"less than a minute","other":"less than %{count} minutes"},"x_minutes":{"one":"1 minute","other":"%{count} minutes"},"about_x_hours":{"one":"about 1 hour","other":"about %{count} hours"},"x_days":{"one":"1 day","other":"%{count} days"},"about_x_months":{"one":"about 1 month","other":"about %{count} months"},"x_months":{"one":"1 month","other":"%{count} months"},"about_x_years":{"one":"about 1 year","other":"about %{count} years"},"over_x_years":{"one":"over 1 year","other":"over %{count} years"},"almost_x_years":{"one":"almost 1 year","other":"almost %{count} years"}},"prompts":{"year":"Year","month":"Month","day":"Day","hour":"Hour","minute":"Minute","second":"Seconds"}},"helpers":{"select":{"prompt":"Please select"},"submit":{"create":"Create %{model}","update":"Update %{model}","submit":"Save %{model}"},"button":{"create":"Create %{model}","update":"Update %{model}","submit":"Save %{model}"}},"faker":{"address":{"city_prefix":["North","East","West","South","New","Lake","Port"],"city_suffix":["town","ton","land","ville","berg","burgh","borough","bury","view","port","mouth","stad","furt","chester","mouth","fort","haven","side","shire"],"country":["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antarctica (the territory South of 60 deg S)","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Bouvet Island (Bouvetoya)","Brazil","British Indian Ocean Territory (Chagos Archipelago)","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Chile","China","Christmas Island","Cocos (Keeling) Islands","Colombia","Comoros","Congo","Congo","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Faroe Islands","Falkland Islands (Malvinas)","Fiji","Finland","France","French Guiana","French Polynesia","French Southern Territories","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Holy See (Vatican City State)","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Democratic People's Republic of Korea","Republic of Korea","Kuwait","Kyrgyz Republic","Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg","Macao","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands Antilles","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Norfolk Island","Northern Mariana Islands","Norway","Oman","Pakistan","Palau","Palestinian Territory","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn Islands","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russian Federation","Rwanda","Saint Barthelemy","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia (Slovak Republic)","Slovenia","Solomon Islands","Somalia","South Africa","South Georgia and the South Sandwich Islands","Spain","Sri Lanka","Sudan","Suriname","Svalbard & Jan Mayen Islands","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","United States Minor Outlying Islands","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Virgin Islands, British","Virgin Islands, U.S.","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"],"country_code":["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL",false,"NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"],"building_number":["#####","####","###"],"street_suffix":["Alley","Avenue","Branch","Bridge","Brook","Brooks","Burg","Burgs","Bypass","Camp","Canyon","Cape","Causeway","Center","Centers","Circle","Circles","Cliff","Cliffs","Club","Common","Corner","Corners","Course","Court","Courts","Cove","Coves","Creek","Crescent","Crest","Crossing","Crossroad","Curve","Dale","Dam","Divide","Drive","Drive","Drives","Estate","Estates","Expressway","Extension","Extensions","Fall","Falls","Ferry","Field","Fields","Flat","Flats","Ford","Fords","Forest","Forge","Forges","Fork","Forks","Fort","Freeway","Garden","Gardens","Gateway","Glen","Glens","Green","Greens","Grove","Groves","Harbor","Harbors","Haven","Heights","Highway","Hill","Hills","Hollow","Inlet","Inlet","Island","Island","Islands","Islands","Isle","Isle","Junction","Junctions","Key","Keys","Knoll","Knolls","Lake","Lakes","Land","Landing","Lane","Light","Lights","Loaf","Lock","Locks","Locks","Lodge","Lodge","Loop","Mall","Manor","Manors","Meadow","Meadows","Mews","Mill","Mills","Mission","Mission","Motorway","Mount","Mountain","Mountain","Mountains","Mountains","Neck","Orchard","Oval","Overpass","Park","Parks","Parkway","Parkways","Pass","Passage","Path","Pike","Pine","Pines","Place","Plain","Plains","Plains","Plaza","Plaza","Point","Points","Port","Port","Ports","Ports","Prairie","Prairie","Radial","Ramp","Ranch","Rapid","Rapids","Rest","Ridge","Ridges","River","Road","Road","Roads","Roads","Route","Row","Rue","Run","Shoal","Shoals","Shore","Shores","Skyway","Spring","Springs","Springs","Spur","Spurs","Square","Square","Squares","Squares","Station","Station","Stravenue","Stravenue","Stream","Stream","Street","Street","Streets","Summit","Summit","Terrace","Throughway","Trace","Track","Trafficway","Trail","Trail","Tunnel","Tunnel","Turnpike","Turnpike","Underpass","Union","Unions","Valley","Valleys","Via","Viaduct","View","Views","Village","Village","Villages","Ville","Vista","Vista","Walk","Walks","Wall","Way","Ways","Well","Wells"],"secondary_address":["Apt. ###","Suite ###"],"postcode":["#####","#####-####"],"state":["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"],"state_abbr":["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],"time_zone":["Pacific/Midway","Pacific/Pago_Pago","Pacific/Honolulu","America/Juneau","America/Los_Angeles","America/Tijuana","America/Denver","America/Phoenix","America/Chihuahua","America/Mazatlan","America/Chicago","America/Regina","America/Mexico_City","America/Mexico_City","America/Monterrey","America/Guatemala","America/New_York","America/Indiana/Indianapolis","America/Bogota","America/Lima","America/Lima","America/Halifax","America/Caracas","America/La_Paz","America/Santiago","America/St_Johns","America/Sao_Paulo","America/Argentina/Buenos_Aires","America/Guyana","America/Godthab","Atlantic/South_Georgia","Atlantic/Azores","Atlantic/Cape_Verde","Europe/Dublin","Europe/London","Europe/Lisbon","Europe/London","Africa/Casablanca","Africa/Monrovia","Etc/UTC","Europe/Belgrade","Europe/Bratislava","Europe/Budapest","Europe/Ljubljana","Europe/Prague","Europe/Sarajevo","Europe/Skopje","Europe/Warsaw","Europe/Zagreb","Europe/Brussels","Europe/Copenhagen","Europe/Madrid","Europe/Paris","Europe/Amsterdam","Europe/Berlin","Europe/Berlin","Europe/Rome","Europe/Stockholm","Europe/Vienna","Africa/Algiers","Europe/Bucharest","Africa/Cairo","Europe/Helsinki","Europe/Kiev","Europe/Riga","Europe/Sofia","Europe/Tallinn","Europe/Vilnius","Europe/Athens","Europe/Istanbul","Europe/Minsk","Asia/Jerusalem","Africa/Harare","Africa/Johannesburg","Europe/Moscow","Europe/Moscow","Europe/Moscow","Asia/Kuwait","Asia/Riyadh","Africa/Nairobi","Asia/Baghdad","Asia/Tehran","Asia/Muscat","Asia/Muscat","Asia/Baku","Asia/Tbilisi","Asia/Yerevan","Asia/Kabul","Asia/Yekaterinburg","Asia/Karachi","Asia/Karachi","Asia/Tashkent","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kathmandu","Asia/Dhaka","Asia/Dhaka","Asia/Colombo","Asia/Almaty","Asia/Novosibirsk","Asia/Rangoon","Asia/Bangkok","Asia/Bangkok","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Shanghai","Asia/Chongqing","Asia/Hong_Kong","Asia/Urumqi","Asia/Kuala_Lumpur","Asia/Singapore","Asia/Taipei","Australia/Perth","Asia/Irkutsk","Asia/Ulaanbaatar","Asia/Seoul","Asia/Tokyo","Asia/Tokyo","Asia/Tokyo","Asia/Yakutsk","Australia/Darwin","Australia/Adelaide","Australia/Melbourne","Australia/Melbourne","Australia/Sydney","Australia/Brisbane","Australia/Hobart","Asia/Vladivostok","Pacific/Guam","Pacific/Port_Moresby","Asia/Magadan","Asia/Magadan","Pacific/Noumea","Pacific/Fiji","Asia/Kamchatka","Pacific/Majuro","Pacific/Auckland","Pacific/Auckland","Pacific/Tongatapu","Pacific/Fakaofo","Pacific/Apia"],"city":["#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.first_name}","#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}"],"street_name":["#{Name.first_name} #{street_suffix}","#{Name.last_name} #{street_suffix}"],"street_address":["#{building_number} #{street_name}"],"default_country":["United States of America"]},"credit_card":{"visa":["/4###########L/","/4###-####-####-###L/"],"mastercard":["/5[1-5]##-####-####-###L/","/6771-89##-####-###L/"],"discover":["/6011-####-####-###L/","/65##-####-####-###L/","/64[4-9]#-####-####-###L/","/6011-62##-####-####-###L/","/65##-62##-####-####-###L/","/64[4-9]#-62##-####-####-###L/"],"american_express":["/34##-######-####L/","/37##-######-####L/"],"diners_club":["/30[0-5]#-######-###L/","/368#-######-###L/"],"jcb":["/3528-####-####-###L/","/3529-####-####-###L/","/35[3-8]#-####-####-###L/"],"switch":["/6759-####-####-###L/","/6759-####-####-####-#L/","/6759-####-####-####-##L/"],"solo":["/6767-####-####-###L/","/6767-####-####-####-#L/","/6767-####-####-####-##L/"],"dankort":"/5019-####-####-###L/","maestro":["/50#{9,16}L/","/5[6-8]#{9,16}L/","/56##{9,16}L/"],"forbrugsforeningen":"/6007-22##-####-###L/","laser":["/6304###########L/","/6706###########L/","/6771###########L/","/6709###########L/","/6304#########{5,6}L/","/6706#########{5,6}L/","/6771#########{5,6}L/","/6709#########{5,6}L/"]},"company":{"suffix":["Inc","and Sons","LLC","Group"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","asymmetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} and #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","biz","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Aaliyah","Aaron","Abagail","Abbey","Abbie","Abbigail","Abby","Abdiel","Abdul","Abdullah","Abe","Abel","Abelardo","Abigail","Abigale","Abigayle","Abner","Abraham","Ada","Adah","Adalberto","Adaline","Adam","Adan","Addie","Addison","Adela","Adelbert","Adele","Adelia","Adeline","Adell","Adella","Adelle","Aditya","Adolf","Adolfo","Adolph","Adolphus","Adonis","Adrain","Adrian","Adriana","Adrianna","Adriel","Adrien","Adrienne","Afton","Aglae","Agnes","Agustin","Agustina","Ahmad","Ahmed","Aida","Aidan","Aiden","Aileen","Aimee","Aisha","Aiyana","Akeem","Al","Alaina","Alan","Alana","Alanis","Alanna","Alayna","Alba","Albert","Alberta","Albertha","Alberto","Albin","Albina","Alda","Alden","Alec","Aleen","Alejandra","Alejandrin","Alek","Alena","Alene","Alessandra","Alessandro","Alessia","Aletha","Alex","Alexa","Alexander","Alexandra","Alexandre","Alexandrea","Alexandria","Alexandrine","Alexandro","Alexane","Alexanne","Alexie","Alexis","Alexys","Alexzander","Alf","Alfonso","Alfonzo","Alford","Alfred","Alfreda","Alfredo","Ali","Alia","Alice","Alicia","Alisa","Alisha","Alison","Alivia","Aliya","Aliyah","Aliza","Alize","Allan","Allen","Allene","Allie","Allison","Ally","Alphonso","Alta","Althea","Alva","Alvah","Alvena","Alvera","Alverta","Alvina","Alvis","Alyce","Alycia","Alysa","Alysha","Alyson","Alysson","Amalia","Amanda","Amani","Amara","Amari","Amaya","Amber","Ambrose","Amelia","Amelie","Amely","America","Americo","Amie","Amina","Amir","Amira","Amiya","Amos","Amparo","Amy","Amya","Ana","Anabel","Anabelle","Anahi","Anais","Anastacio","Anastasia","Anderson","Andre","Andreane","Andreanne","Andres","Andrew","Andy","Angel","Angela","Angelica","Angelina","Angeline","Angelita","Angelo","Angie","Angus","Anibal","Anika","Anissa","Anita","Aniya","Aniyah","Anjali","Anna","Annabel","Annabell","Annabelle","Annalise","Annamae","Annamarie","Anne","Annetta","Annette","Annie","Ansel","Ansley","Anthony","Antoinette","Antone","Antonetta","Antonette","Antonia","Antonietta","Antonina","Antonio","Antwan","Antwon","Anya","April","Ara","Araceli","Aracely","Arch","Archibald","Ardella","Arden","Ardith","Arely","Ari","Ariane","Arianna","Aric","Ariel","Arielle","Arjun","Arlene","Arlie","Arlo","Armand","Armando","Armani","Arnaldo","Arne","Arno","Arnold","Arnoldo","Arnulfo","Aron","Art","Arthur","Arturo","Arvel","Arvid","Arvilla","Aryanna","Asa","Asha","Ashlee","Ashleigh","Ashley","Ashly","Ashlynn","Ashton","Ashtyn","Asia","Assunta","Astrid","Athena","Aubree","Aubrey","Audie","Audra","Audreanne","Audrey","August","Augusta","Augustine","Augustus","Aurelia","Aurelie","Aurelio","Aurore","Austen","Austin","Austyn","Autumn","Ava","Avery","Avis","Axel","Ayana","Ayden","Ayla","Aylin","Baby","Bailee","Bailey","Barbara","Barney","Baron","Barrett","Barry","Bart","Bartholome","Barton","Baylee","Beatrice","Beau","Beaulah","Bell","Bella","Belle","Ben","Benedict","Benjamin","Bennett","Bennie","Benny","Benton","Berenice","Bernadette","Bernadine","Bernard","Bernardo","Berneice","Bernhard","Bernice","Bernie","Berniece","Bernita","Berry","Bert","Berta","Bertha","Bertram","Bertrand","Beryl","Bessie","Beth","Bethany","Bethel","Betsy","Bette","Bettie","Betty","Bettye","Beulah","Beverly","Bianka","Bill","Billie","Billy","Birdie","Blair","Blaise","Blake","Blanca","Blanche","Blaze","Bo","Bobbie","Bobby","Bonita","Bonnie","Boris","Boyd","Brad","Braden","Bradford","Bradley","Bradly","Brady","Braeden","Brain","Brandi","Brando","Brandon","Brandt","Brandy","Brandyn","Brannon","Branson","Brant","Braulio","Braxton","Brayan","Breana","Breanna","Breanne","Brenda","Brendan","Brenden","Brendon","Brenna","Brennan","Brennon","Brent","Bret","Brett","Bria","Brian","Briana","Brianne","Brice","Bridget","Bridgette","Bridie","Brielle","Brigitte","Brionna","Brisa","Britney","Brittany","Brock","Broderick","Brody","Brook","Brooke","Brooklyn","Brooks","Brown","Bruce","Bryana","Bryce","Brycen","Bryon","Buck","Bud","Buddy","Buford","Bulah","Burdette","Burley","Burnice","Buster","Cade","Caden","Caesar","Caitlyn","Cale","Caleb","Caleigh","Cali","Calista","Callie","Camden","Cameron","Camila","Camilla","Camille","Camren","Camron","Camryn","Camylle","Candace","Candelario","Candice","Candida","Candido","Cara","Carey","Carissa","Carlee","Carleton","Carley","Carli","Carlie","Carlo","Carlos","Carlotta","Carmel","Carmela","Carmella","Carmelo","Carmen","Carmine","Carol","Carolanne","Carole","Carolina","Caroline","Carolyn","Carolyne","Carrie","Carroll","Carson","Carter","Cary","Casandra","Casey","Casimer","Casimir","Casper","Cassandra","Cassandre","Cassidy","Cassie","Catalina","Caterina","Catharine","Catherine","Cathrine","Cathryn","Cathy","Cayla","Ceasar","Cecelia","Cecil","Cecile","Cecilia","Cedrick","Celestine","Celestino","Celia","Celine","Cesar","Chad","Chadd","Chadrick","Chaim","Chance","Chandler","Chanel","Chanelle","Charity","Charlene","Charles","Charley","Charlie","Charlotte","Chase","Chasity","Chauncey","Chaya","Chaz","Chelsea","Chelsey","Chelsie","Chesley","Chester","Chet","Cheyanne","Cheyenne","Chloe","Chris","Christ","Christa","Christelle","Christian","Christiana","Christina","Christine","Christop","Christophe","Christopher","Christy","Chyna","Ciara","Cicero","Cielo","Cierra","Cindy","Citlalli","Clair","Claire","Clara","Clarabelle","Clare","Clarissa","Clark","Claud","Claude","Claudia","Claudie","Claudine","Clay","Clemens","Clement","Clementina","Clementine","Clemmie","Cleo","Cleora","Cleta","Cletus","Cleve","Cleveland","Clifford","Clifton","Clint","Clinton","Clotilde","Clovis","Cloyd","Clyde","Coby","Cody","Colby","Cole","Coleman","Colin","Colleen","Collin","Colt","Colten","Colton","Columbus","Concepcion","Conner","Connie","Connor","Conor","Conrad","Constance","Constantin","Consuelo","Cooper","Cora","Coralie","Corbin","Cordelia","Cordell","Cordia","Cordie","Corene","Corine","Cornelius","Cornell","Corrine","Cortez","Cortney","Cory","Coty","Courtney","Coy","Craig","Crawford","Creola","Cristal","Cristian","Cristina","Cristobal","Cristopher","Cruz","Crystal","Crystel","Cullen","Curt","Curtis","Cydney","Cynthia","Cyril","Cyrus","Dagmar","Dahlia","Daija","Daisha","Daisy","Dakota","Dale","Dallas","Dallin","Dalton","Damaris","Dameon","Damian","Damien","Damion","Damon","Dan","Dana","Dandre","Dane","D'angelo","Dangelo","Danial","Daniela","Daniella","Danielle","Danika","Dannie","Danny","Dante","Danyka","Daphne","Daphnee","Daphney","Darby","Daren","Darian","Dariana","Darien","Dario","Darion","Darius","Darlene","Daron","Darrel","Darrell","Darren","Darrick","Darrin","Darrion","Darron","Darryl","Darwin","Daryl","Dashawn","Dasia","Dave","David","Davin","Davion","Davon","Davonte","Dawn","Dawson","Dax","Dayana","Dayna","Dayne","Dayton","Dean","Deangelo","Deanna","Deborah","Declan","Dedric","Dedrick","Dee","Deion","Deja","Dejah","Dejon","Dejuan","Delaney","Delbert","Delfina","Delia","Delilah","Dell","Della","Delmer","Delores","Delpha","Delphia","Delphine","Delta","Demarco","Demarcus","Demario","Demetris","Demetrius","Demond","Dena","Denis","Dennis","Deon","Deondre","Deontae","Deonte","Dereck","Derek","Derick","Deron","Derrick","Deshaun","Deshawn","Desiree","Desmond","Dessie","Destany","Destin","Destinee","Destiney","Destini","Destiny","Devan","Devante","Deven","Devin","Devon","Devonte","Devyn","Dewayne","Dewitt","Dexter","Diamond","Diana","Dianna","Diego","Dillan","Dillon","Dimitri","Dina","Dino","Dion","Dixie","Dock","Dolly","Dolores","Domenic","Domenica","Domenick","Domenico","Domingo","Dominic","Dominique","Don","Donald","Donato","Donavon","Donna","Donnell","Donnie","Donny","Dora","Dorcas","Dorian","Doris","Dorothea","Dorothy","Dorris","Dortha","Dorthy","Doug","Douglas","Dovie","Doyle","Drake","Drew","Duane","Dudley","Dulce","Duncan","Durward","Dustin","Dusty","Dwight","Dylan","Earl","Earlene","Earline","Earnest","Earnestine","Easter","Easton","Ebba","Ebony","Ed","Eda","Edd","Eddie","Eden","Edgar","Edgardo","Edison","Edmond","Edmund","Edna","Eduardo","Edward","Edwardo","Edwin","Edwina","Edyth","Edythe","Effie","Efrain","Efren","Eileen","Einar","Eino","Eladio","Elaina","Elbert","Elda","Eldon","Eldora","Eldred","Eldridge","Eleanora","Eleanore","Eleazar","Electa","Elena","Elenor","Elenora","Eleonore","Elfrieda","Eli","Elian","Eliane","Elias","Eliezer","Elijah","Elinor","Elinore","Elisa","Elisabeth","Elise","Eliseo","Elisha","Elissa","Eliza","Elizabeth","Ella","Ellen","Ellie","Elliot","Elliott","Ellis","Ellsworth","Elmer","Elmira","Elmo","Elmore","Elna","Elnora","Elody","Eloisa","Eloise","Elouise","Eloy","Elroy","Elsa","Else","Elsie","Elta","Elton","Elva","Elvera","Elvie","Elvis","Elwin","Elwyn","Elyse","Elyssa","Elza","Emanuel","Emelia","Emelie","Emely","Emerald","Emerson","Emery","Emie","Emil","Emile","Emilia","Emiliano","Emilie","Emilio","Emily","Emma","Emmalee","Emmanuel","Emmanuelle","Emmet","Emmett","Emmie","Emmitt","Emmy","Emory","Ena","Enid","Enoch","Enola","Enos","Enrico","Enrique","Ephraim","Era","Eriberto","Eric","Erica","Erich","Erick","Ericka","Erik","Erika","Erin","Erling","Erna","Ernest","Ernestina","Ernestine","Ernesto","Ernie","Ervin","Erwin","Eryn","Esmeralda","Esperanza","Esta","Esteban","Estefania","Estel","Estell","Estella","Estelle","Estevan","Esther","Estrella","Etha","Ethan","Ethel","Ethelyn","Ethyl","Ettie","Eudora","Eugene","Eugenia","Eula","Eulah","Eulalia","Euna","Eunice","Eusebio","Eva","Evalyn","Evan","Evangeline","Evans","Eve","Eveline","Evelyn","Everardo","Everett","Everette","Evert","Evie","Ewald","Ewell","Ezekiel","Ezequiel","Ezra","Fabian","Fabiola","Fae","Fannie","Fanny","Fatima","Faustino","Fausto","Favian","Fay","Faye","Federico","Felicia","Felicita","Felicity","Felipa","Felipe","Felix","Felton","Fermin","Fern","Fernando","Ferne","Fidel","Filiberto","Filomena","Finn","Fiona","Flavie","Flavio","Fleta","Fletcher","Flo","Florence","Florencio","Florian","Florida","Florine","Flossie","Floy","Floyd","Ford","Forest","Forrest","Foster","Frances","Francesca","Francesco","Francis","Francisca","Francisco","Franco","Frank","Frankie","Franz","Fred","Freda","Freddie","Freddy","Frederic","Frederick","Frederik","Frederique","Fredrick","Fredy","Freeda","Freeman","Freida","Frida","Frieda","Friedrich","Fritz","Furman","Gabe","Gabriel","Gabriella","Gabrielle","Gaetano","Gage","Gail","Gardner","Garett","Garfield","Garland","Garnet","Garnett","Garret","Garrett","Garrick","Garrison","Garry","Garth","Gaston","Gavin","Gay","Gayle","Gaylord","Gene","General","Genesis","Genevieve","Gennaro","Genoveva","Geo","Geoffrey","George","Georgette","Georgiana","Georgianna","Geovanni","Geovanny","Geovany","Gerald","Geraldine","Gerard","Gerardo","Gerda","Gerhard","Germaine","German","Gerry","Gerson","Gertrude","Gia","Gianni","Gideon","Gilbert","Gilberto","Gilda","Giles","Gillian","Gina","Gino","Giovani","Giovanna","Giovanni","Giovanny","Gisselle","Giuseppe","Gladyce","Gladys","Glen","Glenda","Glenna","Glennie","Gloria","Godfrey","Golda","Golden","Gonzalo","Gordon","Grace","Gracie","Graciela","Grady","Graham","Grant","Granville","Grayce","Grayson","Green","Greg","Gregg","Gregoria","Gregorio","Gregory","Greta","Gretchen","Greyson","Griffin","Grover","Guadalupe","Gudrun","Guido","Guillermo","Guiseppe","Gunnar","Gunner","Gus","Gussie","Gust","Gustave","Guy","Gwen","Gwendolyn","Hadley","Hailee","Hailey","Hailie","Hal","Haleigh","Haley","Halie","Halle","Hallie","Hank","Hanna","Hannah","Hans","Hardy","Harley","Harmon","Harmony","Harold","Harrison","Harry","Harvey","Haskell","Hassan","Hassie","Hattie","Haven","Hayden","Haylee","Hayley","Haylie","Hazel","Hazle","Heath","Heather","Heaven","Heber","Hector","Heidi","Helen","Helena","Helene","Helga","Hellen","Helmer","Heloise","Henderson","Henri","Henriette","Henry","Herbert","Herman","Hermann","Hermina","Herminia","Herminio","Hershel","Herta","Hertha","Hester","Hettie","Hilario","Hilbert","Hilda","Hildegard","Hillard","Hillary","Hilma","Hilton","Hipolito","Hiram","Hobart","Holden","Hollie","Hollis","Holly","Hope","Horace","Horacio","Hortense","Hosea","Houston","Howard","Howell","Hoyt","Hubert","Hudson","Hugh","Hulda","Humberto","Hunter","Hyman","Ian","Ibrahim","Icie","Ida","Idell","Idella","Ignacio","Ignatius","Ike","Ila","Ilene","Iliana","Ima","Imani","Imelda","Immanuel","Imogene","Ines","Irma","Irving","Irwin","Isaac","Isabel","Isabell","Isabella","Isabelle","Isac","Isadore","Isai","Isaiah","Isaias","Isidro","Ismael","Isobel","Isom","Israel","Issac","Itzel","Iva","Ivah","Ivory","Ivy","Izabella","Izaiah","Jabari","Jace","Jacey","Jacinthe","Jacinto","Jack","Jackeline","Jackie","Jacklyn","Jackson","Jacky","Jaclyn","Jacquelyn","Jacques","Jacynthe","Jada","Jade","Jaden","Jadon","Jadyn","Jaeden","Jaida","Jaiden","Jailyn","Jaime","Jairo","Jakayla","Jake","Jakob","Jaleel","Jalen","Jalon","Jalyn","Jamaal","Jamal","Jamar","Jamarcus","Jamel","Jameson","Jamey","Jamie","Jamil","Jamir","Jamison","Jammie","Jan","Jana","Janae","Jane","Janelle","Janessa","Janet","Janice","Janick","Janie","Janis","Janiya","Jannie","Jany","Jaquan","Jaquelin","Jaqueline","Jared","Jaren","Jarod","Jaron","Jarred","Jarrell","Jarret","Jarrett","Jarrod","Jarvis","Jasen","Jasmin","Jason","Jasper","Jaunita","Javier","Javon","Javonte","Jay","Jayce","Jaycee","Jayda","Jayde","Jayden","Jaydon","Jaylan","Jaylen","Jaylin","Jaylon","Jayme","Jayne","Jayson","Jazlyn","Jazmin","Jazmyn","Jazmyne","Jean","Jeanette","Jeanie","Jeanne","Jed","Jedediah","Jedidiah","Jeff","Jefferey","Jeffery","Jeffrey","Jeffry","Jena","Jenifer","Jennie","Jennifer","Jennings","Jennyfer","Jensen","Jerad","Jerald","Jeramie","Jeramy","Jerel","Jeremie","Jeremy","Jermain","Jermaine","Jermey","Jerod","Jerome","Jeromy","Jerrell","Jerrod","Jerrold","Jerry","Jess","Jesse","Jessica","Jessie","Jessika","Jessy","Jessyca","Jesus","Jett","Jettie","Jevon","Jewel","Jewell","Jillian","Jimmie","Jimmy","Jo","Joan","Joana","Joanie","Joanne","Joannie","Joanny","Joany","Joaquin","Jocelyn","Jodie","Jody","Joe","Joel","Joelle","Joesph","Joey","Johan","Johann","Johanna","Johathan","John","Johnathan","Johnathon","Johnnie","Johnny","Johnpaul","Johnson","Jolie","Jon","Jonas","Jonatan","Jonathan","Jonathon","Jordan","Jordane","Jordi","Jordon","Jordy","Jordyn","Jorge","Jose","Josefa","Josefina","Joseph","Josephine","Josh","Joshua","Joshuah","Josiah","Josiane","Josianne","Josie","Josue","Jovan","Jovani","Jovanny","Jovany","Joy","Joyce","Juana","Juanita","Judah","Judd","Jude","Judge","Judson","Judy","Jules","Julia","Julian","Juliana","Julianne","Julie","Julien","Juliet","Julio","Julius","June","Junior","Junius","Justen","Justice","Justina","Justine","Juston","Justus","Justyn","Juvenal","Juwan","Kacey","Kaci","Kacie","Kade","Kaden","Kadin","Kaela","Kaelyn","Kaia","Kailee","Kailey","Kailyn","Kaitlin","Kaitlyn","Kale","Kaleb","Kaleigh","Kaley","Kali","Kallie","Kameron","Kamille","Kamren","Kamron","Kamryn","Kane","Kara","Kareem","Karelle","Karen","Kari","Kariane","Karianne","Karina","Karine","Karl","Karlee","Karley","Karli","Karlie","Karolann","Karson","Kasandra","Kasey","Kassandra","Katarina","Katelin","Katelyn","Katelynn","Katharina","Katherine","Katheryn","Kathleen","Kathlyn","Kathryn","Kathryne","Katlyn","Katlynn","Katrina","Katrine","Kattie","Kavon","Kay","Kaya","Kaycee","Kayden","Kayla","Kaylah","Kaylee","Kayleigh","Kayley","Kayli","Kaylie","Kaylin","Keagan","Keanu","Keara","Keaton","Keegan","Keeley","Keely","Keenan","Keira","Keith","Kellen","Kelley","Kelli","Kellie","Kelly","Kelsi","Kelsie","Kelton","Kelvin","Ken","Kendall","Kendra","Kendrick","Kenna","Kennedi","Kennedy","Kenneth","Kennith","Kenny","Kenton","Kenya","Kenyatta","Kenyon","Keon","Keshaun","Keshawn","Keven","Kevin","Kevon","Keyon","Keyshawn","Khalid","Khalil","Kian","Kiana","Kianna","Kiara","Kiarra","Kiel","Kiera","Kieran","Kiley","Kim","Kimberly","King","Kip","Kira","Kirk","Kirsten","Kirstin","Kitty","Kobe","Koby","Kody","Kolby","Kole","Korbin","Korey","Kory","Kraig","Kris","Krista","Kristian","Kristin","Kristina","Kristofer","Kristoffer","Kristopher","Kristy","Krystal","Krystel","Krystina","Kurt","Kurtis","Kyla","Kyle","Kylee","Kyleigh","Kyler","Kylie","Kyra","Lacey","Lacy","Ladarius","Lafayette","Laila","Laisha","Lamar","Lambert","Lamont","Lance","Landen","Lane","Laney","Larissa","Laron","Larry","Larue","Laura","Laurel","Lauren","Laurence","Lauretta","Lauriane","Laurianne","Laurie","Laurine","Laury","Lauryn","Lavada","Lavern","Laverna","Laverne","Lavina","Lavinia","Lavon","Lavonne","Lawrence","Lawson","Layla","Layne","Lazaro","Lea","Leann","Leanna","Leanne","Leatha","Leda","Lee","Leif","Leila","Leilani","Lela","Lelah","Leland","Lelia","Lempi","Lemuel","Lenna","Lennie","Lenny","Lenora","Lenore","Leo","Leola","Leon","Leonard","Leonardo","Leone","Leonel","Leonie","Leonor","Leonora","Leopold","Leopoldo","Leora","Lera","Lesley","Leslie","Lesly","Lessie","Lester","Leta","Letha","Letitia","Levi","Lew","Lewis","Lexi","Lexie","Lexus","Lia","Liam","Liana","Libbie","Libby","Lila","Lilian","Liliana","Liliane","Lilla","Lillian","Lilliana","Lillie","Lilly","Lily","Lilyan","Lina","Lincoln","Linda","Lindsay","Lindsey","Linnea","Linnie","Linwood","Lionel","Lisa","Lisandro","Lisette","Litzy","Liza","Lizeth","Lizzie","Llewellyn","Lloyd","Logan","Lois","Lola","Lolita","Loma","Lon","London","Lonie","Lonnie","Lonny","Lonzo","Lora","Loraine","Loren","Lorena","Lorenz","Lorenza","Lorenzo","Lori","Lorine","Lorna","Lottie","Lou","Louie","Louisa","Lourdes","Louvenia","Lowell","Loy","Loyal","Loyce","Lucas","Luciano","Lucie","Lucienne","Lucile","Lucinda","Lucio","Lucious","Lucius","Lucy","Ludie","Ludwig","Lue","Luella","Luigi","Luis","Luisa","Lukas","Lula","Lulu","Luna","Lupe","Lura","Lurline","Luther","Luz","Lyda","Lydia","Lyla","Lynn","Lyric","Lysanne","Mabel","Mabelle","Mable","Mac","Macey","Maci","Macie","Mack","Mackenzie","Macy","Madaline","Madalyn","Maddison","Madeline","Madelyn","Madelynn","Madge","Madie","Madilyn","Madisen","Madison","Madisyn","Madonna","Madyson","Mae","Maegan","Maeve","Mafalda","Magali","Magdalen","Magdalena","Maggie","Magnolia","Magnus","Maia","Maida","Maiya","Major","Makayla","Makenna","Makenzie","Malachi","Malcolm","Malika","Malinda","Mallie","Mallory","Malvina","Mandy","Manley","Manuel","Manuela","Mara","Marc","Marcel","Marcelina","Marcelino","Marcella","Marcelle","Marcellus","Marcelo","Marcia","Marco","Marcos","Marcus","Margaret","Margarete","Margarett","Margaretta","Margarette","Margarita","Marge","Margie","Margot","Margret","Marguerite","Maria","Mariah","Mariam","Marian","Mariana","Mariane","Marianna","Marianne","Mariano","Maribel","Marie","Mariela","Marielle","Marietta","Marilie","Marilou","Marilyne","Marina","Mario","Marion","Marisa","Marisol","Maritza","Marjolaine","Marjorie","Marjory","Mark","Markus","Marlee","Marlen","Marlene","Marley","Marlin","Marlon","Marques","Marquis","Marquise","Marshall","Marta","Martin","Martina","Martine","Marty","Marvin","Mary","Maryam","Maryjane","Maryse","Mason","Mateo","Mathew","Mathias","Mathilde","Matilda","Matilde","Matt","Matteo","Mattie","Maud","Maude","Maudie","Maureen","Maurice","Mauricio","Maurine","Maverick","Mavis","Max","Maxie","Maxime","Maximilian","Maximillia","Maximillian","Maximo","Maximus","Maxine","Maxwell","May","Maya","Maybell","Maybelle","Maye","Maymie","Maynard","Mayra","Mazie","Mckayla","Mckenna","Mckenzie","Meagan","Meaghan","Meda","Megane","Meggie","Meghan","Mekhi","Melany","Melba","Melisa","Melissa","Mellie","Melody","Melvin","Melvina","Melyna","Melyssa","Mercedes","Meredith","Merl","Merle","Merlin","Merritt","Mertie","Mervin","Meta","Mia","Micaela","Micah","Michael","Michaela","Michale","Micheal","Michel","Michele","Michelle","Miguel","Mikayla","Mike","Mikel","Milan","Miles","Milford","Miller","Millie","Milo","Milton","Mina","Minerva","Minnie","Miracle","Mireille","Mireya","Misael","Missouri","Misty","Mitchel","Mitchell","Mittie","Modesta","Modesto","Mohamed","Mohammad","Mohammed","Moises","Mollie","Molly","Mona","Monica","Monique","Monroe","Monserrat","Monserrate","Montana","Monte","Monty","Morgan","Moriah","Morris","Mortimer","Morton","Mose","Moses","Moshe","Mossie","Mozell","Mozelle","Muhammad","Muriel","Murl","Murphy","Murray","Mustafa","Mya","Myah","Mylene","Myles","Myra","Myriam","Myrl","Myrna","Myron","Myrtice","Myrtie","Myrtis","Myrtle","Nadia","Nakia","Name","Nannie","Naomi","Naomie","Napoleon","Narciso","Nash","Nasir","Nat","Natalia","Natalie","Natasha","Nathan","Nathanael","Nathanial","Nathaniel","Nathen","Nayeli","Neal","Ned","Nedra","Neha","Neil","Nelda","Nella","Nelle","Nellie","Nels","Nelson","Neoma","Nestor","Nettie","Neva","Newell","Newton","Nia","Nicholas","Nicholaus","Nichole","Nick","Nicklaus","Nickolas","Nico","Nicola","Nicolas","Nicole","Nicolette","Nigel","Nikita","Nikki","Nikko","Niko","Nikolas","Nils","Nina","Noah","Noble","Noe","Noel","Noelia","Noemi","Noemie","Noemy","Nola","Nolan","Nona","Nora","Norbert","Norberto","Norene","Norma","Norris","Norval","Norwood","Nova","Novella","Nya","Nyah","Nyasia","Obie","Oceane","Ocie","Octavia","Oda","Odell","Odessa","Odie","Ofelia","Okey","Ola","Olaf","Ole","Olen","Oleta","Olga","Olin","Oliver","Ollie","Oma","Omari","Omer","Ona","Onie","Opal","Ophelia","Ora","Oral","Oran","Oren","Orie","Orin","Orion","Orland","Orlando","Orlo","Orpha","Orrin","Orval","Orville","Osbaldo","Osborne","Oscar","Osvaldo","Oswald","Oswaldo","Otha","Otho","Otilia","Otis","Ottilie","Ottis","Otto","Ova","Owen","Ozella","Pablo","Paige","Palma","Pamela","Pansy","Paolo","Paris","Parker","Pascale","Pasquale","Pat","Patience","Patricia","Patrick","Patsy","Pattie","Paul","Paula","Pauline","Paxton","Payton","Pearl","Pearlie","Pearline","Pedro","Peggie","Penelope","Percival","Percy","Perry","Pete","Peter","Petra","Peyton","Philip","Phoebe","Phyllis","Pierce","Pierre","Pietro","Pink","Pinkie","Piper","Polly","Porter","Precious","Presley","Preston","Price","Prince","Princess","Priscilla","Providenci","Prudence","Queen","Queenie","Quentin","Quincy","Quinn","Quinten","Quinton","Rachael","Rachel","Rachelle","Rae","Raegan","Rafael","Rafaela","Raheem","Rahsaan","Rahul","Raina","Raleigh","Ralph","Ramiro","Ramon","Ramona","Randal","Randall","Randi","Randy","Ransom","Raoul","Raphael","Raphaelle","Raquel","Rashad","Rashawn","Rasheed","Raul","Raven","Ray","Raymond","Raymundo","Reagan","Reanna","Reba","Rebeca","Rebecca","Rebeka","Rebekah","Reece","Reed","Reese","Regan","Reggie","Reginald","Reid","Reilly","Reina","Reinhold","Remington","Rene","Renee","Ressie","Reta","Retha","Retta","Reuben","Reva","Rex","Rey","Reyes","Reymundo","Reyna","Reynold","Rhea","Rhett","Rhianna","Rhiannon","Rhoda","Ricardo","Richard","Richie","Richmond","Rick","Rickey","Rickie","Ricky","Rico","Rigoberto","Riley","Rita","River","Robb","Robbie","Robert","Roberta","Roberto","Robin","Robyn","Rocio","Rocky","Rod","Roderick","Rodger","Rodolfo","Rodrick","Rodrigo","Roel","Rogelio","Roger","Rogers","Rolando","Rollin","Roma","Romaine","Roman","Ron","Ronaldo","Ronny","Roosevelt","Rory","Rosa","Rosalee","Rosalia","Rosalind","Rosalinda","Rosalyn","Rosamond","Rosanna","Rosario","Roscoe","Rose","Rosella","Roselyn","Rosemarie","Rosemary","Rosendo","Rosetta","Rosie","Rosina","Roslyn","Ross","Rossie","Rowan","Rowena","Rowland","Roxane","Roxanne","Roy","Royal","Royce","Rozella","Ruben","Rubie","Ruby","Rubye","Rudolph","Rudy","Rupert","Russ","Russel","Russell","Rusty","Ruth","Ruthe","Ruthie","Ryan","Ryann","Ryder","Rylan","Rylee","Ryleigh","Ryley","Sabina","Sabrina","Sabryna","Sadie","Sadye","Sage","Saige","Sallie","Sally","Salma","Salvador","Salvatore","Sam","Samanta","Samantha","Samara","Samir","Sammie","Sammy","Samson","Sandra","Sandrine","Sandy","Sanford","Santa","Santiago","Santina","Santino","Santos","Sarah","Sarai","Sarina","Sasha","Saul","Savanah","Savanna","Savannah","Savion","Scarlett","Schuyler","Scot","Scottie","Scotty","Seamus","Sean","Sebastian","Sedrick","Selena","Selina","Selmer","Serena","Serenity","Seth","Shad","Shaina","Shakira","Shana","Shane","Shanel","Shanelle","Shania","Shanie","Shaniya","Shanna","Shannon","Shanny","Shanon","Shany","Sharon","Shaun","Shawn","Shawna","Shaylee","Shayna","Shayne","Shea","Sheila","Sheldon","Shemar","Sheridan","Sherman","Sherwood","Shirley","Shyann","Shyanne","Sibyl","Sid","Sidney","Sienna","Sierra","Sigmund","Sigrid","Sigurd","Silas","Sim","Simeon","Simone","Sincere","Sister","Skye","Skyla","Skylar","Sofia","Soledad","Solon","Sonia","Sonny","Sonya","Sophia","Sophie","Spencer","Stacey","Stacy","Stan","Stanford","Stanley","Stanton","Stefan","Stefanie","Stella","Stephan","Stephania","Stephanie","Stephany","Stephen","Stephon","Sterling","Steve","Stevie","Stewart","Stone","Stuart","Summer","Sunny","Susan","Susana","Susanna","Susie","Suzanne","Sven","Syble","Sydnee","Sydney","Sydni","Sydnie","Sylvan","Sylvester","Sylvia","Tabitha","Tad","Talia","Talon","Tamara","Tamia","Tania","Tanner","Tanya","Tara","Taryn","Tate","Tatum","Tatyana","Taurean","Tavares","Taya","Taylor","Teagan","Ted","Telly","Terence","Teresa","Terrance","Terrell","Terrence","Terrill","Terry","Tess","Tessie","Tevin","Thad","Thaddeus","Thalia","Thea","Thelma","Theo","Theodora","Theodore","Theresa","Therese","Theresia","Theron","Thomas","Thora","Thurman","Tia","Tiana","Tianna","Tiara","Tierra","Tiffany","Tillman","Timmothy","Timmy","Timothy","Tina","Tito","Titus","Tobin","Toby","Tod","Tom","Tomas","Tomasa","Tommie","Toney","Toni","Tony","Torey","Torrance","Torrey","Toy","Trace","Tracey","Tracy","Travis","Travon","Tre","Tremaine","Tremayne","Trent","Trenton","Tressa","Tressie","Treva","Trever","Trevion","Trevor","Trey","Trinity","Trisha","Tristian","Tristin","Triston","Troy","Trudie","Trycia","Trystan","Turner","Twila","Tyler","Tyra","Tyree","Tyreek","Tyrel","Tyrell","Tyrese","Tyrique","Tyshawn","Tyson","Ubaldo","Ulices","Ulises","Una","Unique","Urban","Uriah","Uriel","Ursula","Vada","Valentin","Valentina","Valentine","Valerie","Vallie","Van","Vance","Vanessa","Vaughn","Veda","Velda","Vella","Velma","Velva","Vena","Verda","Verdie","Vergie","Verla","Verlie","Vern","Verna","Verner","Vernice","Vernie","Vernon","Verona","Veronica","Vesta","Vicenta","Vicente","Vickie","Vicky","Victor","Victoria","Vida","Vidal","Vilma","Vince","Vincent","Vincenza","Vincenzo","Vinnie","Viola","Violet","Violette","Virgie","Virgil","Virginia","Virginie","Vita","Vito","Viva","Vivian","Viviane","Vivianne","Vivien","Vivienne","Vladimir","Wade","Waino","Waldo","Walker","Wallace","Walter","Walton","Wanda","Ward","Warren","Watson","Wava","Waylon","Wayne","Webster","Weldon","Wellington","Wendell","Wendy","Werner","Westley","Weston","Whitney","Wilber","Wilbert","Wilburn","Wiley","Wilford","Wilfred","Wilfredo","Wilfrid","Wilhelm","Wilhelmine","Will","Willa","Willard","William","Willie","Willis","Willow","Willy","Wilma","Wilmer","Wilson","Wilton","Winfield","Winifred","Winnifred","Winona","Winston","Woodrow","Wyatt","Wyman","Xander","Xavier","Xzavier","Yadira","Yasmeen","Yasmin","Yasmine","Yazmin","Yesenia","Yessenia","Yolanda","Yoshiko","Yvette","Yvonne","Zachariah","Zachary","Zachery","Zack","Zackary","Zackery","Zakary","Zander","Zane","Zaria","Zechariah","Zelda","Zella","Zelma","Zena","Zetta","Zion","Zita","Zoe","Zoey","Zoie","Zoila","Zola","Zora","Zula"],"last_name":["Abbott","Abernathy","Abshire","Adams","Altenwerth","Anderson","Ankunding","Armstrong","Auer","Aufderhar","Bahringer","Bailey","Balistreri","Barrows","Bartell","Bartoletti","Barton","Bashirian","Batz","Bauch","Baumbach","Bayer","Beahan","Beatty","Bechtelar","Becker","Bednar","Beer","Beier","Berge","Bergnaum","Bergstrom","Bernhard","Bernier","Bins","Blanda","Blick","Block","Bode","Boehm","Bogan","Bogisich","Borer","Bosco","Botsford","Boyer","Boyle","Bradtke","Brakus","Braun","Breitenberg","Brekke","Brown","Bruen","Buckridge","Carroll","Carter","Cartwright","Casper","Cassin","Champlin","Christiansen","Cole","Collier","Collins","Conn","Connelly","Conroy","Considine","Corkery","Cormier","Corwin","Cremin","Crist","Crona","Cronin","Crooks","Cruickshank","Cummerata","Cummings","Dach","D'Amore","Daniel","Dare","Daugherty","Davis","Deckow","Denesik","Dibbert","Dickens","Dicki","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","DuBuque","Durgan","Ebert","Effertz","Eichmann","Emard","Emmerich","Erdman","Ernser","Fadel","Fahey","Farrell","Fay","Feeney","Feest","Feil","Ferry","Fisher","Flatley","Frami","Franecki","Friesen","Fritsch","Funk","Gaylord","Gerhold","Gerlach","Gibson","Gislason","Gleason","Gleichner","Glover","Goldner","Goodwin","Gorczany","Gottlieb","Goyette","Grady","Graham","Grant","Green","Greenfelder","Greenholt","Grimes","Gulgowski","Gusikowski","Gutkowski","Gutmann","Haag","Hackett","Hagenes","Hahn","Haley","Halvorson","Hamill","Hammes","Hand","Hane","Hansen","Harber","Harris","Hartmann","Harvey","Hauck","Hayes","Heaney","Heathcote","Hegmann","Heidenreich","Heller","Herman","Hermann","Hermiston","Herzog","Hessel","Hettinger","Hickle","Hilll","Hills","Hilpert","Hintz","Hirthe","Hodkiewicz","Hoeger","Homenick","Hoppe","Howe","Howell","Hudson","Huel","Huels","Hyatt","Jacobi","Jacobs","Jacobson","Jakubowski","Jaskolski","Jast","Jenkins","Jerde","Johns","Johnson","Johnston","Jones","Kassulke","Kautzer","Keebler","Keeling","Kemmer","Kerluke","Kertzmann","Kessler","Kiehn","Kihn","Kilback","King","Kirlin","Klein","Kling","Klocko","Koch","Koelpin","Koepp","Kohler","Konopelski","Koss","Kovacek","Kozey","Krajcik","Kreiger","Kris","Kshlerin","Kub","Kuhic","Kuhlman","Kuhn","Kulas","Kunde","Kunze","Kuphal","Kutch","Kuvalis","Labadie","Lakin","Lang","Langosh","Langworth","Larkin","Larson","Leannon","Lebsack","Ledner","Leffler","Legros","Lehner","Lemke","Lesch","Leuschke","Lind","Lindgren","Littel","Little","Lockman","Lowe","Lubowitz","Lueilwitz","Luettgen","Lynch","Macejkovic","MacGyver","Maggio","Mann","Mante","Marks","Marquardt","Marvin","Mayer","Mayert","McClure","McCullough","McDermott","McGlynn","McKenzie","McLaughlin","Medhurst","Mertz","Metz","Miller","Mills","Mitchell","Moen","Mohr","Monahan","Moore","Morar","Morissette","Mosciski","Mraz","Mueller","Muller","Murazik","Murphy","Murray","Nader","Nicolas","Nienow","Nikolaus","Nitzsche","Nolan","Oberbrunner","O'Connell","O'Conner","O'Hara","O'Keefe","O'Kon","Okuneva","Olson","Ondricka","O'Reilly","Orn","Ortiz","Osinski","Pacocha","Padberg","Pagac","Parisian","Parker","Paucek","Pfannerstill","Pfeffer","Pollich","Pouros","Powlowski","Predovic","Price","Prohaska","Prosacco","Purdy","Quigley","Quitzon","Rath","Ratke","Rau","Raynor","Reichel","Reichert","Reilly","Reinger","Rempel","Renner","Reynolds","Rice","Rippin","Ritchie","Robel","Roberts","Rodriguez","Rogahn","Rohan","Rolfson","Romaguera","Roob","Rosenbaum","Rowe","Ruecker","Runolfsdottir","Runolfsson","Runte","Russel","Rutherford","Ryan","Sanford","Satterfield","Sauer","Sawayn","Schaden","Schaefer","Schamberger","Schiller","Schimmel","Schinner","Schmeler","Schmidt","Schmitt","Schneider","Schoen","Schowalter","Schroeder","Schulist","Schultz","Schumm","Schuppe","Schuster","Senger","Shanahan","Shields","Simonis","Sipes","Skiles","Smith","Smitham","Spencer","Spinka","Sporer","Stamm","Stanton","Stark","Stehr","Steuber","Stiedemann","Stokes","Stoltenberg","Stracke","Streich","Stroman","Strosin","Swaniawski","Swift","Terry","Thiel","Thompson","Tillman","Torp","Torphy","Towne","Toy","Trantow","Tremblay","Treutel","Tromp","Turcotte","Turner","Ullrich","Upton","Vandervort","Veum","Volkman","Von","VonRueden","Waelchi","Walker","Walsh","Walter","Ward","Waters","Watsica","Weber","Wehner","Weimann","Weissnat","Welch","West","White","Wiegand","Wilderman","Wilkinson","Will","Williamson","Willms","Windler","Wintheiser","Wisoky","Wisozk","Witting","Wiza","Wolf","Wolff","Wuckert","Wunsch","Wyman","Yost","Yundt","Zboncak","Zemlak","Ziemann","Zieme","Zulauf"],"prefix":["Mr.","Mrs.","Ms.","Miss","Dr."],"suffix":["Jr.","Sr.","I","II","III","IV","V","MD","DDS","PhD","DVM"],"title":{"descriptor":["Lead","Senior","Direct","Corporate","Dynamic","Future","Product","National","Regional","District","Central","Global","Customer","Investor","Dynamic","International","Legacy","Forward","Internal","Human","Chief","Principal"],"level":["Solutions","Program","Brand","Security","Research","Marketing","Directives","Implementation","Integration","Functionality","Response","Paradigm","Tactics","Identity","Markets","Group","Division","Applications","Optimization","Operations","Infrastructure","Intranet","Communications","Web","Branding","Quality","Assurance","Mobility","Accounts","Data","Creative","Configuration","Accountability","Interactions","Factors","Usability","Metrics"],"job":["Supervisor","Associate","Executive","Liason","Officer","Manager","Engineer","Specialist","Director","Coordinator","Administrator","Architect","Analyst","Designer","Planner","Orchestrator","Technician","Developer","Producer","Consultant","Assistant","Facilitator","Agent","Representative","Strategist"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["###-###-####","(###) ###-####","1-###-###-####","###.###.####","###-###-####","(###) ###-####","1-###-###-####","###.###.####","###-###-#### x###","(###) ###-#### x###","1-###-###-#### x###","###.###.#### x###","###-###-#### x####","(###) ###-#### x####","1-###-###-#### x####","###.###.#### x####","###-###-#### x#####","(###) ###-#### x#####","1-###-###-#### x#####","###.###.#### x#####"]},"cell_phone":{"formats":["###-###-####","(###) ###-####","1-###-###-####","###.###.####"]},"business":{"credit_card_numbers":["1234-2121-1221-1211","1212-1221-1121-1234","1211-1221-1234-2201","1228-1221-1221-1431"],"credit_card_expiry_dates":["2011-10-12","2012-11-12","2015-11-11","2013-9-12"],"credit_card_types":["visa","mastercard","americanexpress","discover"]},"commerce":{"color":["red","green","blue","yellow","purple","mint green","teal","white","black","orange","pink","grey","maroon","violet","turquoise","tan","sky blue","salmon","plum","orchid","olive","magenta","lime","ivory","indigo","gold","fuchsia","cyan","azure","lavender","silver"],"department":["Books","Movies, Music & Games","Electronics & Computers","Home, Garden & Tools","Grocery, Health & Beauty","Toys, Kids & Baby","Clothing, Shoes & Jewelery","Sports & Outdoors","Automotive & Industrial"],"product_name":{"adjective":["Small","Ergonomic","Rustic","Intelligent","Gorgeous","Incredible","Fantastic","Practical","Sleek","Awesome"],"material":["Steel","Wooden","Concrete","Plastic","Cotton","Granite","Rubber"],"product":["Chair","Car","Computer","Gloves","Pants","Shirt","Table","Shoes","Hat"]}},"team":{"creature":["ants","bats","bears","bees","birds","buffalo","cats","chickens","cattle","dogs","dolphins","ducks","elephants","fishes","foxes","frogs","geese","goats","horses","kangaroos","lions","monkeys","owls","oxen","penguins","people","pigs","rabbits","sheep","tigers","whales","wolves","zebras","banshees","crows","black cats","chimeras","ghosts","conspirators","dragons","dwarves","elves","enchanters","exorcists","sons","foes","giants","gnomes","goblins","gooses","griffins","lycanthropes","nemesis","ogres","oracles","prophets","sorcerors","spiders","spirits","vampires","warlocks","vixens","werewolves","witches","worshipers","zombies","druids"],"name":["#{Address.state} #{creature}"]},"hacker":{"abbreviation":["TCP","HTTP","SDD","RAM","GB","CSS","SSL","AGP","SQL","FTP","PCI","AI","ADP","RSS","XML","EXE","COM","HDD","THX","SMTP","SMS","USB","PNG"],"adjective":["auxiliary","primary","back-end","digital","open-source","virtual","cross-platform","redundant","online","haptic","multi-byte","bluetooth","wireless","1080p","neural","optical","solid state","mobile"],"noun":["driver","protocol","bandwidth","panel","microchip","program","port","card","array","interface","system","sensor","firewall","hard drive","pixel","alarm","feed","monitor","application","transmitter","bus","circuit","capacitor","matrix"],"verb":["back up","bypass","hack","override","compress","copy","navigate","index","connect","generate","quantify","calculate","synthesize","input","transmit","program","reboot","parse"],"ingverb":["backing up","bypassing","hacking","overriding","compressing","copying","navigating","indexing","connecting","generating","quantifying","calculating","synthesizing","transmitting","programming","parsing"]}},"devise":{"confirmations":{"confirmed":"Your account was successfully confirmed. You are now signed in.","send_instructions":"You will receive an email with instructions about how to confirm your account in a few minutes.","send_paranoid_instructions":"If your email address exists in our database, you will receive an email with instructions about how to confirm your account in a few minutes."},"failure":{"already_authenticated":"You are already signed in.","inactive":"Your account was not activated yet.","invalid":"Invalid email or password.","invalid_token":"Invalid authentication token.","locked":"Your account is locked.","not_found_in_database":"Invalid email or password.","timeout":"Your session expired, please sign in again to continue.","unauthenticated":"You need to sign in or sign up before continuing.","unconfirmed":"You have to confirm your account before continuing."},"mailer":{"confirmation_instructions":{"subject":"Confirmation instructions","user_subject":"Confirmation instructions"},"reset_password_instructions":{"subject":"Reset password instructions CHANGED"},"unlock_instructions":{"subject":"Unlock Instructions"},"invitation_instructions":{"subject":"fgfdfds","user_subject":"ewrrewwer"}},"omniauth_callbacks":{"failure":"Could not authenticate you from %{kind} because \"%{reason}\".","success":"Successfully authenticated from %{kind} account."},"passwords":{"no_token":"You can't access this page without coming from a password reset email. If you do come from a password reset email, please make sure you used the full URL provided.","send_instructions":"You will receive an email with instructions about how to reset your password in a few minutes.","send_paranoid_instructions":"If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.","updated":"Your password was changed successfully. You are now signed in.","updated_not_active":"Your password was changed successfully."},"registrations":{"destroyed":"Bye! Your account was successfully cancelled. We hope to see you again soon.","signed_up":"You have signed up successfully. If enabled, a confirmation was sent to your e-mail.","signed_up_but_inactive":"You have signed up successfully. However, we could not sign you in because your account is not yet activated.","signed_up_but_locked":"You have signed up successfully. However, we could not sign you in because your account is locked.","signed_up_but_unconfirmed":"A message with a confirmation link has been sent to your email address. Please open the link to activate your account.","update_needs_confirmation":"You updated your account successfully, but we need to verify your new email address. Please check your email and click on the confirm link to finalize confirming your new email address.","updated":"You updated your account successfully."},"sessions":{"signed_in":"Signed in successfully.","signed_out":"Signed out successfully."},"unlocks":{"send_instructions":"You will receive an email with instructions about how to unlock your account in a few minutes.","send_paranoid_instructions":"If your account exists, you will receive an email with instructions about how to unlock it in a few minutes.","unlocked":"Your account was successfully unlocked. You are now signed in."},"invitations":{"send_instructions":"An invitation email has been sent to %{email}.","invitation_token_invalid":"The invitation token provided is not valid!","updated":"Your password was set successfully. You are now signed in.","no_invitations_remaining":"No invitations remaining","new":{"header":"Send invitation","submit_button":"Send an invitation"},"edit":{"header":"Set your password","submit_button":"Set my password"}}},"simple_form":{"yes":"Yes","no":"No","required":{"text":"required","mark":"*"},"error_notification":{"default_message":"Some errors were found, please take a look:"}},"surveyor":{"take_these_surveys":"You may take these surveys","take_it":"Take it","completed_survey":"Completed survey","unable_to_find_your_responses":"Unable to find your responses to the survey","unable_to_update_survey":"Unable to update survey","unable_to_find_that_survey":"Unable to find that survey","survey_started_success":"Survey started successfully","click_here_to_finish":"Click here to finish","previous_section":"&laquo; Previous section","next_section":"Next section &raquo;","select_one":"Select one ...","sections":"Sections","language":"Language"},"hello":"Hello world"},"en-US":{"faker":{"internet":{"domain_suffix":["com","us","biz","info","name","net","org"]},"address":{"default_country":["United States","United States of America","USA"]},"phone_number":{"area_code":["201","202","203","205","206","207","208","209","210","212","213","214","215","216","217","218","219","224","225","227","228","229","231","234","239","240","248","251","252","253","254","256","260","262","267","269","270","276","281","283","301","302","303","304","305","307","308","309","310","312","313","314","315","316","317","318","319","320","321","323","330","331","334","336","337","339","347","351","352","360","361","386","401","402","404","405","406","407","408","409","410","412","413","414","415","417","419","423","424","425","434","435","440","443","445","464","469","470","475","478","479","480","484","501","502","503","504","505","507","508","509","510","512","513","515","516","517","518","520","530","540","541","551","557","559","561","562","563","564","567","570","571","573","574","580","585","586","601","602","603","605","606","607","608","609","610","612","614","615","616","617","618","619","620","623","626","630","631","636","641","646","650","651","660","661","662","667","678","682","701","702","703","704","706","707","708","712","713","714","715","716","717","718","719","720","724","727","731","732","734","737","740","754","757","760","763","765","770","772","773","774","775","781","785","786","801","802","803","804","805","806","808","810","812","813","814","815","816","817","818","828","830","831","832","835","843","845","847","848","850","856","857","858","859","860","862","863","864","865","870","872","878","901","903","904","906","907","908","909","910","912","913","914","915","916","917","918","919","920","925","928","931","936","937","940","941","947","949","952","954","956","959","970","971","972","973","975","978","979","980","984","985","989"],"exchange_code":["201","202","203","205","206","207","208","209","210","212","213","214","215","216","217","218","219","224","225","227","228","229","231","234","239","240","248","251","252","253","254","256","260","262","267","269","270","276","281","283","301","302","303","304","305","307","308","309","310","312","313","314","315","316","317","318","319","320","321","323","330","331","334","336","337","339","347","351","352","360","361","386","401","402","404","405","406","407","408","409","410","412","413","414","415","417","419","423","424","425","434","435","440","443","445","464","469","470","475","478","479","480","484","501","502","503","504","505","507","508","509","510","512","513","515","516","517","518","520","530","540","541","551","557","559","561","562","563","564","567","570","571","573","574","580","585","586","601","602","603","605","606","607","608","609","610","612","614","615","616","617","618","619","620","623","626","630","631","636","641","646","650","651","660","661","662","667","678","682","701","702","703","704","706","707","708","712","713","714","715","716","717","718","719","720","724","727","731","732","734","737","740","754","757","760","763","765","770","772","773","774","775","781","785","786","801","802","803","804","805","806","808","810","812","813","814","815","816","817","818","828","830","831","832","835","843","845","847","848","850","856","857","858","859","860","862","863","864","865","870","872","878","901","903","904","906","907","908","909","910","912","913","914","915","916","917","918","919","920","925","928","931","936","937","940","941","947","949","952","954","956","959","970","971","972","973","975","978","979","980","984","985","989"],"formats":["#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","(#{PhoneNumber.area_code}) #{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","1-#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","#{PhoneNumber.area_code}.#{PhoneNumber.exchange_code}.#{PhoneNumber.subscriber_number}","#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","(#{PhoneNumber.area_code}) #{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","1-#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number}","#{PhoneNumber.area_code}.#{PhoneNumber.exchange_code}.#{PhoneNumber.subscriber_number}","#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","(#{PhoneNumber.area_code}) #{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","1-#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","#{PhoneNumber.area_code}.#{PhoneNumber.exchange_code}.#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","(#{PhoneNumber.area_code}) #{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","1-#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","#{PhoneNumber.area_code}.#{PhoneNumber.exchange_code}.#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","(#{PhoneNumber.area_code}) #{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","1-#{PhoneNumber.area_code}-#{PhoneNumber.exchange_code}-#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}","#{PhoneNumber.area_code}.#{PhoneNumber.exchange_code}.#{PhoneNumber.subscriber_number} x#{PhoneNumber.extension}"]}}},"de-AT":{"faker":{"address":{"country":["\u00c4gypten","\u00c4quatorialguinea","\u00c4thiopien","\u00d6sterreich","Afghanistan","Albanien","Algerien","Amerikanisch-Samoa","Amerikanische Jungferninseln","Andorra","Angola","Anguilla","Antarktis","Antigua und Barbuda","Argentinien","Armenien","Aruba","Aserbaidschan","Australien","Bahamas","Bahrain","Bangladesch","Barbados","Belarus","Belgien","Belize","Benin","die Bermudas","Bhutan","Bolivien","Bosnien und Herzegowina","Botsuana","Bouvetinsel","Brasilien","Britische Jungferninseln","Britisches Territorium im Indischen Ozean","Brunei Darussalam","Bulgarien","Burkina Faso","Burundi","Chile","China","Cookinseln","Costa Rica","D\u00e4nemark","Demokratische Republik Kongo","Demokratische Volksrepublik Korea","Deutschland","Dominica","Dominikanische Republik","Dschibuti","Ecuador","El Salvador","Eritrea","Estland","F\u00e4r\u00f6er","Falklandinseln","Fidschi","Finnland","Frankreich","Franz\u00f6sisch-Guayana","Franz\u00f6sisch-Polynesien","Franz\u00f6sische Gebiete im s\u00fcdlichen Indischen Ozean","Gabun","Gambia","Georgien","Ghana","Gibraltar","Gr\u00f6nland","Grenada","Griechenland","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard und McDonaldinseln","Honduras","Hongkong","Indien","Indonesien","Irak","Iran","Irland","Island","Israel","Italien","Jamaika","Japan","Jemen","Jordanien","Jugoslawien","Kaimaninseln","Kambodscha","Kamerun","Kanada","Kap Verde","Kasachstan","Katar","Kenia","Kirgisistan","Kiribati","Kleinere amerikanische \u00dcberseeinseln","Kokosinseln","Kolumbien","Komoren","Kongo","Kroatien","Kuba","Kuwait","Laos","Lesotho","Lettland","Libanon","Liberia","Libyen","Liechtenstein","Litauen","Luxemburg","Macau","Madagaskar","Malawi","Malaysia","Malediven","Mali","Malta","ehemalige jugoslawische Republik Mazedonien","Marokko","Marshallinseln","Martinique","Mauretanien","Mauritius","Mayotte","Mexiko","Mikronesien","Monaco","Mongolei","Montserrat","Mosambik","Myanmar","N\u00f6rdliche Marianen","Namibia","Nauru","Nepal","Neukaledonien","Neuseeland","Nicaragua","Niederl\u00e4ndische Antillen","Niederlande","Niger","Nigeria","Niue","Norfolkinsel","Norwegen","Oman","Osttimor","Pakistan","Palau","Panama","Papua-Neuguinea","Paraguay","Peru","Philippinen","Pitcairninseln","Polen","Portugal","Puerto Rico","R\u00e9union","Republik Korea","Republik Moldau","Ruanda","Rum\u00e4nien","Russische F\u00f6deration","S\u00e3o Tom\u00e9 und Pr\u00edncipe","S\u00fcdafrika","S\u00fcdgeorgien und S\u00fcdliche Sandwichinseln","Salomonen","Sambia","Samoa","San Marino","Saudi-Arabien","Schweden","Schweiz","Senegal","Seychellen","Sierra Leone","Simbabwe","Singapur","Slowakei","Slowenien","Somalien","Spanien","Sri Lanka","St. Helena","St. Kitts und Nevis","St. Lucia","St. Pierre und Miquelon","St. Vincent und die Grenadinen","Sudan","Surinam","Svalbard und Jan Mayen","Swasiland","Syrien","T\u00fcrkei","Tadschikistan","Taiwan","Tansania","Thailand","Togo","Tokelau","Tonga","Trinidad und Tobago","Tschad","Tschechische Republik","Tunesien","Turkmenistan","Turks- und Caicosinseln","Tuvalu","Uganda","Ukraine","Ungarn","Uruguay","Usbekistan","Vanuatu","Vatikanstadt","Venezuela","Vereinigte Arabische Emirate","Vereinigte Staaten","Vereinigtes K\u00f6nigreich","Vietnam","Wallis und Futuna","Weihnachtsinsel","Westsahara","Zentralafrikanische Republik","Zypern"],"street_root":["Ahorn","Ahorngasse (St. Andr\u00e4)","Alleestra\u00dfe (Poysbrunn)","Alpenlandstra\u00dfe","Alte Poststra\u00dfe","Alte Ufergasse","Am Kronawett (Hagenbrunn)","Am M\u00fchlwasser","Am Rebenhang","Am Sternweg","Anton Wildgans-Stra\u00dfe","Auer-von-Welsbach-Weg","Auf der Stift","Aufeldgasse","Bahngasse","Bahnhofstra\u00dfe","Bahnstra\u00dfe (Gerhaus)","Basteigasse","Berggasse","Bergstra\u00dfe","Birkenweg","Blasiussteig","Blattur","Bruderhofgasse","Brunnelligasse","B\u00fchelweg","Darnautgasse","Donaugasse","Dorfplatz (Haselbach)","Dr.-Oberreiter-Stra\u00dfe","Dr.Karl Holoubek-Str.","Drautal Bundesstra\u00dfe","D\u00fcrnrohrer Stra\u00dfe","Ebenthalerstra\u00dfe","Eckgrabenweg","Erlenstra\u00dfe","Erlenweg","Eschenweg","Etrichgasse","Fassergasse","Feichteggerwiese","Feld-Weg","Feldgasse","Feldstapfe","Fischpointweg","Flachbergstra\u00dfe","Flurweg","Franz Schubert-Gasse","Franz-Schneewei\u00df-Weg","Franz-von-Assisi-Stra\u00dfe","Fritz-Pregl-Stra\u00dfe","Fuchsgrubenweg","F\u00f6dlerweg","F\u00f6hrenweg","F\u00fcnfhaus (Paasdorf)","Gabelsbergerstra\u00dfe","Gartenstra\u00dfe","Geigen","Geigergasse","Gemeindeaugasse","Gemeindeplatz","Georg-Aichinger-Stra\u00dfe","Glanfeldbachweg","Graben (Burgauberg)","Grub","Gr\u00f6retgasse","Gr\u00fcnbach","G\u00f6sting","Hainschwang","Hans-Mauracher-Stra\u00dfe","Hart","Teichstra\u00dfe","Hauptplatz","Hauptstra\u00dfe","Heideweg","Heinrich Landauer Gasse","Helenengasse","Hermann von Gilmweg","Hermann-L\u00f6ns-Gasse","Herminengasse","Hernstorferstra\u00dfe","Hirsdorf","Hochfeistritz","Hochhaus Neue Donau","Hof","Hussovits Gasse","H\u00f6ggen","H\u00fctten","Janzgasse","Jochriemgutstra\u00dfe","Johann-Strau\u00df-Gasse","Julius-Raab-Stra\u00dfe","Kahlenberger Stra\u00dfe","Karl Kraft-Stra\u00dfe","Kegelprielstra\u00dfe","Keltenberg-Eponaweg","Kennedybr\u00fccke","Kerpelystra\u00dfe","Kindergartenstra\u00dfe","Kinderheimgasse","Kirchenplatz","Kirchweg","Klagenfurter Stra\u00dfe","Klamm","Kleinbaumgarten","Klingergasse","Koloniestra\u00dfe","Konrad-Duden-Gasse","Krankenhausstra\u00dfe","Kubinstra\u00dfe","K\u00f6hldorfergasse","Lackenweg","Lange Mekotte","Leifling","Leopold Frank-Stra\u00dfe (Pellendorf)","Lerchengasse (Pirka)","Lichtensternsiedlung V","Lindenhofstra\u00dfe","Lindenweg","Luegstra\u00dfe","Maierhof","Malerweg","Mitterweg","Mittlere Hauptstra\u00dfe","Moosbachgasse","Morettigasse","Musikpavillon Riezlern","M\u00fchlboden","M\u00fchle","M\u00fchlenweg","Neustiftgasse","Niederegg","Niedergams","Nordwestbahnbr\u00fccke","Oberb\u00f6denalm","Obere Berggasse","Oedt","Am F\u00e4rberberg","Ottogasse","Paul Peters-Gasse","Perspektivstra\u00dfe","Poppichl","Privatweg","Prixgasse","Pyhra","Radetzkystra\u00dfe","Raiden","Reichensteinstra\u00dfe","Reitbauernstra\u00dfe","Reiterweg","Reitschulgasse","Ringweg","Rupertistra\u00dfe","R\u00f6merstra\u00dfe","R\u00f6merweg","Sackgasse","Schaunbergerstra\u00dfe","Schlo\u00dfweg","Schulgasse (Langeck)","Sch\u00f6nholdsiedlung","Seeblick","Seestra\u00dfe","Semriacherstra\u00dfe","Simling","Sipbachzeller Stra\u00dfe","Sonnenweg","Spargelfeldgasse","Spiesmayrweg","Sportplatzstra\u00dfe","St.Ulrich","Steilmannstra\u00dfe","Steingr\u00fcneredt","Strassfeld","Stra\u00dferau","St\u00f6pflweg","St\u00fcra","Taferngasse","Tennweg","Thomas Koschat-Gasse","Tiroler Stra\u00dfe","Torrogasse","Uferstra\u00dfe (Schwarzau am Steinfeld)","Unterd\u00f6rfl","Unterer Sonnrainweg","Verwaltersiedlung","Waldhang","Wasen","Weidenstra\u00dfe","Weiherweg","Wettsteingasse","Wiener Stra\u00dfe","Windisch","Zebragasse","Zellerstra\u00dfe","Ziehrerstra\u00dfe","Zulechnerweg","Zwergjoch","\u00d6tzbruck"],"building_number":["###","##","#","##a","##b","##c"],"secondary_address":["Apt. ###","Zimmer ###","# OG"],"postcode":["####"],"state":["Burgenland","K\u00e4rnten","Nieder\u00f6sterreich","Ober\u00f6sterreich","Salzburg","Steiermark","Tirol","Vorarlberg","Wien"],"state_abbr":["Bgld.","Ktn.","N\u00d6","O\u00d6","Sbg.","Stmk.","T","Vbg.","W"],"city_name":["Aigen im M\u00fchlkreis","Allerheiligen bei Wildon","Altenfelden","Arriach","Axams","Baumgartenberg","Bergern im Dunkelsteinerwald","Berndorf bei Salzburg","Bregenz","Breitenbach am Inn","Deutsch-Wagram","Dienten am Hochk\u00f6nig","Dietach","Dornbirn","D\u00fcrnkrut","Eben im Pongau","Ebenthal in K\u00e4rnten","Eichgraben","Eisenstadt","Ellmau","Feistritz am Wechsel","Finkenberg","Fiss","Frantschach-St. Gertraud","Fritzens","Gams bei Hieflau","Geiersberg","Graz","Gro\u00dfh\u00f6flein","G\u00f6\u00dfnitz","Hartl","Hausleiten","Herzogenburg","Hinterhornbach","Hochwolkersdorf","Ilz","Ilztal","Innerbraz","Innsbruck","Itter","Jagerberg","Jeging","Johnsbach","Johnsdorf-Brunn","Jungholz","Kirchdorf am Inn","Klagenfurt","Kottes-Purk","Krumau am Kamp","Krumbach","Lavam\u00fcnd","Lech","Linz","Ludesch","L\u00f6dersdorf","Marbach an der Donau","Mattsee","Mautern an der Donau","Mauterndorf","Mitterbach am Erlaufsee","Neudorf bei Passail","Neudorf bei Staatz","Neukirchen an der Enknach","Neustift an der Lafnitz","Niederleis","Oberndorf in Tirol","Oberstorcha","Oberwaltersdorf","Oed-Oehling","Ort im Innkreis","Pilgersdorf","Pitschgau","Pollham","Preitenegg","Purbach am Neusiedler See","Rabenwald","Raiding","Rastenfeld","Ratten","Rettenegg","Salzburg","Sankt Johann im Saggautal","St. Peter am Kammersberg","St. P\u00f6lten","St. Veit an der Glan","Taxenbach","Tragwein","Trebesing","Trieben","Turnau","Ungerdorf","Unterauersbach","Unterstinkenbrunn","Untertilliach","Uttendorf","Vals","Velden am W\u00f6rther See","Viehhofen","Villach","Vitis","Waidhofen an der Thaya","Waldkirchen am Wesen","Wei\u00dfkirchen an der Traun","Wien","Wimpassing im Schwarzatale","Ybbs an der Donau","Ybbsitz","Yspertal","Zeillern","Zell am Pettenfirst","Zell an der Pram","Zerlach","Zw\u00f6lfaxing","\u00d6blarn","\u00dcbelbach","\u00dcberackern","\u00dcbersaxen","\u00dcbersbach"],"city":["#{city_name}"],"street_name":["#{street_root}"],"street_address":["#{street_name} #{building_number}"],"default_country":["\u00d6sterreich"]},"company":{"suffix":["GmbH","AG","Gruppe","KG","GmbH & Co. KG","UG","OHG"],"legal_form":["GmbH","AG","Gruppe","KG","GmbH & Co. KG","UG","OHG"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} und #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","info","name","net","org","de","ch","at"]},"name":{"first_name":["Aaron","Abdul","Abdullah","Adam","Adrian","Adriano","Ahmad","Ahmed","Ahmet","Alan","Albert","Alessandro","Alessio","Alex","Alexander","Alfred","Ali","Amar","Amir","Amon","Andre","Andreas","Andrew","Angelo","Ansgar","Anthony","Anton","Antonio","Arda","Arian","Armin","Arne","Arno","Arthur","Artur","Arved","Arvid","Ayman","Baran","Baris","Bastian","Batuhan","Bela","Ben","Benedikt","Benjamin","Bennet","Bennett","Benno","Bent","Berat","Berkay","Bernd","Bilal","Bjarne","Bj\u00f6rn","Bo","Boris","Brandon","Brian","Bruno","Bryan","Burak","Calvin","Can","Carl","Carlo","Carlos","Caspar","Cedric","Cedrik","Cem","Charlie","Chris","Christian","Christiano","Christoph","Christopher","Claas","Clemens","Colin","Collin","Conner","Connor","Constantin","Corvin","Curt","Damian","Damien","Daniel","Danilo","Danny","Darian","Dario","Darius","Darren","David","Davide","Davin","Dean","Deniz","Dennis","Denny","Devin","Diego","Dion","Domenic","Domenik","Dominic","Dominik","Dorian","Dustin","Dylan","Ecrin","Eddi","Eddy","Edgar","Edwin","Efe","Ege","Elia","Eliah","Elias","Elijah","Emanuel","Emil","Emilian","Emilio","Emir","Emirhan","Emre","Enes","Enno","Enrico","Eren","Eric","Erik","Etienne","Fabian","Fabien","Fabio","Fabrice","Falk","Felix","Ferdinand","Fiete","Filip","Finlay","Finley","Finn","Finnley","Florian","Francesco","Franz","Frederic","Frederick","Frederik","Friedrich","Fritz","Furkan","Fynn","Gabriel","Georg","Gerrit","Gian","Gianluca","Gino","Giuliano","Giuseppe","Gregor","Gustav","Hagen","Hamza","Hannes","Hanno","Hans","Hasan","Hassan","Hauke","Hendrik","Hennes","Henning","Henri","Henrick","Henrik","Henry","Hugo","Hussein","Ian","Ibrahim","Ilias","Ilja","Ilyas","Immanuel","Ismael","Ismail","Ivan","Iven","Jack","Jacob","Jaden","Jakob","Jamal","James","Jamie","Jan","Janek","Janis","Janne","Jannek","Jannes","Jannik","Jannis","Jano","Janosch","Jared","Jari","Jarne","Jarno","Jaron","Jason","Jasper","Jay","Jayden","Jayson","Jean","Jens","Jeremias","Jeremie","Jeremy","Jermaine","Jerome","Jesper","Jesse","Jim","Jimmy","Joe","Joel","Joey","Johann","Johannes","John","Johnny","Jon","Jona","Jonah","Jonas","Jonathan","Jonte","Joost","Jordan","Joris","Joscha","Joschua","Josef","Joseph","Josh","Joshua","Josua","Juan","Julian","Julien","Julius","Juri","Justin","Justus","Kaan","Kai","Kalle","Karim","Karl","Karlo","Kay","Keanu","Kenan","Kenny","Keno","Kerem","Kerim","Kevin","Kian","Kilian","Kim","Kimi","Kjell","Klaas","Klemens","Konrad","Konstantin","Koray","Korbinian","Kurt","Lars","Lasse","Laurence","Laurens","Laurenz","Laurin","Lean","Leander","Leandro","Leif","Len","Lenn","Lennard","Lennart","Lennert","Lennie","Lennox","Lenny","Leo","Leon","Leonard","Leonardo","Leonhard","Leonidas","Leopold","Leroy","Levent","Levi","Levin","Lewin","Lewis","Liam","Lian","Lias","Lino","Linus","Lio","Lion","Lionel","Logan","Lorenz","Lorenzo","Loris","Louis","Luan","Luc","Luca","Lucas","Lucian","Lucien","Ludwig","Luis","Luiz","Luk","Luka","Lukas","Luke","Lutz","Maddox","Mads","Magnus","Maik","Maksim","Malik","Malte","Manuel","Marc","Marcel","Marco","Marcus","Marek","Marian","Mario","Marius","Mark","Marko","Markus","Marlo","Marlon","Marten","Martin","Marvin","Marwin","Mateo","Mathis","Matis","Mats","Matteo","Mattes","Matthias","Matthis","Matti","Mattis","Maurice","Max","Maxim","Maximilian","Mehmet","Meik","Melvin","Merlin","Mert","Michael","Michel","Mick","Miguel","Mika","Mikail","Mike","Milan","Milo","Mio","Mirac","Mirco","Mirko","Mohamed","Mohammad","Mohammed","Moritz","Morten","Muhammed","Murat","Mustafa","Nathan","Nathanael","Nelson","Neo","Nevio","Nick","Niclas","Nico","Nicolai","Nicolas","Niels","Nikita","Niklas","Niko","Nikolai","Nikolas","Nils","Nino","Noah","Noel","Norman","Odin","Oke","Ole","Oliver","Omar","Onur","Oscar","Oskar","Pascal","Patrice","Patrick","Paul","Peer","Pepe","Peter","Phil","Philip","Philipp","Pierre","Piet","Pit","Pius","Quentin","Quirin","Rafael","Raik","Ramon","Raphael","Rasmus","Raul","Rayan","Ren\u00e9","Ricardo","Riccardo","Richard","Rick","Rico","Robert","Robin","Rocco","Roman","Romeo","Ron","Ruben","Ryan","Said","Salih","Sam","Sami","Sammy","Samuel","Sandro","Santino","Sascha","Sean","Sebastian","Selim","Semih","Shawn","Silas","Simeon","Simon","Sinan","Sky","Stefan","Steffen","Stephan","Steve","Steven","Sven","S\u00f6nke","S\u00f6ren","Taha","Tamino","Tammo","Tarik","Tayler","Taylor","Teo","Theo","Theodor","Thies","Thilo","Thomas","Thorben","Thore","Thorge","Tiago","Til","Till","Tillmann","Tim","Timm","Timo","Timon","Timothy","Tino","Titus","Tizian","Tjark","Tobias","Tom","Tommy","Toni","Tony","Torben","Tore","Tristan","Tyler","Tyron","Umut","Valentin","Valentino","Veit","Victor","Viktor","Vin","Vincent","Vito","Vitus","Wilhelm","Willi","William","Willy","Xaver","Yannic","Yannick","Yannik","Yannis","Yasin","Youssef","Yunus","Yusuf","Yven","Yves","\u00d6mer","Aaliyah","Abby","Abigail","Ada","Adelina","Adriana","Aileen","Aimee","Alana","Alea","Alena","Alessa","Alessia","Alexa","Alexandra","Alexia","Alexis","Aleyna","Alia","Alica","Alice","Alicia","Alina","Alisa","Alisha","Alissa","Aliya","Aliyah","Allegra","Alma","Alyssa","Amalia","Amanda","Amelia","Amelie","Amina","Amira","Amy","Ana","Anabel","Anastasia","Andrea","Angela","Angelina","Angelique","Anja","Ann","Anna","Annabel","Annabell","Annabelle","Annalena","Anne","Anneke","Annelie","Annemarie","Anni","Annie","Annika","Anny","Anouk","Antonia","Arda","Ariana","Ariane","Arwen","Ashley","Asya","Aurelia","Aurora","Ava","Ayleen","Aylin","Ayse","Azra","Betty","Bianca","Bianka","Caitlin","Cara","Carina","Carla","Carlotta","Carmen","Carolin","Carolina","Caroline","Cassandra","Catharina","Catrin","Cecile","Cecilia","Celia","Celina","Celine","Ceyda","Ceylin","Chantal","Charleen","Charlotta","Charlotte","Chayenne","Cheyenne","Chiara","Christin","Christina","Cindy","Claire","Clara","Clarissa","Colleen","Collien","Cora","Corinna","Cosima","Dana","Daniela","Daria","Darleen","Defne","Delia","Denise","Diana","Dilara","Dina","Dorothea","Ecrin","Eda","Eileen","Ela","Elaine","Elanur","Elea","Elena","Eleni","Eleonora","Eliana","Elif","Elina","Elisa","Elisabeth","Ella","Ellen","Elli","Elly","Elsa","Emelie","Emely","Emilia","Emilie","Emily","Emma","Emmely","Emmi","Emmy","Enie","Enna","Enya","Esma","Estelle","Esther","Eva","Evelin","Evelina","Eveline","Evelyn","Fabienne","Fatima","Fatma","Felicia","Felicitas","Felina","Femke","Fenja","Fine","Finia","Finja","Finnja","Fiona","Flora","Florentine","Francesca","Franka","Franziska","Frederike","Freya","Frida","Frieda","Friederike","Giada","Gina","Giulia","Giuliana","Greta","Hailey","Hana","Hanna","Hannah","Heidi","Helen","Helena","Helene","Helin","Henriette","Henrike","Hermine","Ida","Ilayda","Imke","Ina","Ines","Inga","Inka","Irem","Isa","Isabel","Isabell","Isabella","Isabelle","Ivonne","Jacqueline","Jamie","Jamila","Jana","Jane","Janin","Janina","Janine","Janna","Janne","Jara","Jasmin","Jasmina","Jasmine","Jella","Jenna","Jennifer","Jenny","Jessica","Jessy","Jette","Jil","Jill","Joana","Joanna","Joelina","Joeline","Joelle","Johanna","Joleen","Jolie","Jolien","Jolin","Jolina","Joline","Jona","Jonah","Jonna","Josefin","Josefine","Josephin","Josephine","Josie","Josy","Joy","Joyce","Judith","Judy","Jule","Julia","Juliana","Juliane","Julie","Julienne","Julika","Julina","Juna","Justine","Kaja","Karina","Karla","Karlotta","Karolina","Karoline","Kassandra","Katarina","Katharina","Kathrin","Katja","Katrin","Kaya","Kayra","Kiana","Kiara","Kim","Kimberley","Kimberly","Kira","Klara","Korinna","Kristin","Kyra","Laila","Lana","Lara","Larissa","Laura","Laureen","Lavinia","Lea","Leah","Leana","Leandra","Leann","Lee","Leila","Lena","Lene","Leni","Lenia","Lenja","Lenya","Leona","Leoni","Leonie","Leonora","Leticia","Letizia","Levke","Leyla","Lia","Liah","Liana","Lili","Lilia","Lilian","Liliana","Lilith","Lilli","Lillian","Lilly","Lily","Lina","Linda","Lindsay","Line","Linn","Linnea","Lisa","Lisann","Lisanne","Liv","Livia","Liz","Lola","Loreen","Lorena","Lotta","Lotte","Louisa","Louise","Luana","Luca","Lucia","Lucie","Lucienne","Lucy","Luisa","Luise","Luka","Luna","Luzie","Lya","Lydia","Lyn","Lynn","Madeleine","Madita","Madleen","Madlen","Magdalena","Maike","Mailin","Maira","Maja","Malena","Malia","Malin","Malina","Mandy","Mara","Marah","Mareike","Maren","Maria","Mariam","Marie","Marieke","Mariella","Marika","Marina","Marisa","Marissa","Marit","Marla","Marleen","Marlen","Marlena","Marlene","Marta","Martha","Mary","Maryam","Mathilda","Mathilde","Matilda","Maxi","Maxima","Maxine","Maya","Mayra","Medina","Medine","Meike","Melanie","Melek","Melike","Melina","Melinda","Melis","Melisa","Melissa","Merle","Merve","Meryem","Mette","Mia","Michaela","Michelle","Mieke","Mila","Milana","Milena","Milla","Mina","Mira","Miray","Miriam","Mirja","Mona","Monique","Nadine","Nadja","Naemi","Nancy","Naomi","Natalia","Natalie","Nathalie","Neele","Nela","Nele","Nelli","Nelly","Nia","Nicole","Nika","Nike","Nikita","Nila","Nina","Nisa","Noemi","Nora","Olivia","Patricia","Patrizia","Paula","Paulina","Pauline","Penelope","Philine","Phoebe","Pia","Rahel","Rania","Rebecca","Rebekka","Riana","Rieke","Rike","Romina","Romy","Ronja","Rosa","Rosalie","Ruby","Sabrina","Sahra","Sally","Salome","Samantha","Samia","Samira","Sandra","Sandy","Sanja","Saphira","Sara","Sarah","Saskia","Selin","Selina","Selma","Sena","Sidney","Sienna","Silja","Sina","Sinja","Smilla","Sofia","Sofie","Sonja","Sophia","Sophie","Soraya","Stefanie","Stella","Stephanie","Stina","Sude","Summer","Susanne","Svea","Svenja","Sydney","Tabea","Talea","Talia","Tamara","Tamia","Tamina","Tanja","Tara","Tarja","Teresa","Tessa","Thalea","Thalia","Thea","Theresa","Tia","Tina","Tomke","Tuana","Valentina","Valeria","Valerie","Vanessa","Vera","Veronika","Victoria","Viktoria","Viola","Vivian","Vivien","Vivienne","Wibke","Wiebke","Xenia","Yara","Yaren","Yasmin","Ylvi","Ylvie","Yvonne","Zara","Zehra","Zeynep","Zoe","Zoey","Zo\u00e9"],"last_name":["Abel","Abicht","Abraham","Abramovic","Abt","Achilles","Achkinadze","Ackermann","Adam","Adams","Ade","Agostini","Ahlke","Ahrenberg","Ahrens","Aigner","Albert","Albrecht","Alexa","Alexander","Alizadeh","Allgeyer","Amann","Amberg","Anding","Anggreny","Apitz","Arendt","Arens","Arndt","Aryee","Aschenbroich","Assmus","Astafei","Auer","Axmann","Baarck","Bachmann","Badane","Bader","Baganz","Bahl","Bak","Balcer","Balck","Balkow","Balnuweit","Balzer","Banse","Barr","Bartels","Barth","Barylla","Baseda","Battke","Bauer","Bauermeister","Baumann","Baumeister","Bauschinger","Bauschke","Bayer","Beavogui","Beck","Beckel","Becker","Beckmann","Bedewitz","Beele","Beer","Beggerow","Beh","Behr","Behrenbruch","Belz","Bender","Benecke","Benner","Benninger","Benzing","Berends","Berger","Berner","Berning","Bertenbreiter","Best","Bethke","Betz","Beushausen","Beutelspacher","Beyer","Biba","Bichler","Bickel","Biedermann","Bieler","Bielert","Bienasch","Bienias","Biesenbach","Bigdeli","Birkemeyer","Bittner","Blank","Blaschek","Blassneck","Bloch","Blochwitz","Blockhaus","Blum","Blume","Bock","Bode","Bogdashin","Bogenrieder","Bohge","Bolm","Borgschulze","Bork","Bormann","Bornscheuer","Borrmann","Borsch","Boruschewski","Bos","Bosler","Bourrouag","Bouschen","Boxhammer","Boyde","Bozsik","Brand","Brandenburg","Brandis","Brandt","Brauer","Braun","Brehmer","Breitenstein","Bremer","Bremser","Brenner","Brettschneider","Breu","Breuer","Briesenick","Bringmann","Brinkmann","Brix","Broening","Brosch","Bruckmann","Bruder","Bruhns","Brunner","Bruns","Br\u00e4utigam","Br\u00f6mme","Br\u00fcggmann","Buchholz","Buchrucker","Buder","Bultmann","Bunjes","Burger","Burghagen","Burkhard","Burkhardt","Burmeister","Busch","Buschbaum","Busemann","Buss","Busse","Bussmann","Byrd","B\u00e4cker","B\u00f6hm","B\u00f6nisch","B\u00f6rgeling","B\u00f6rner","B\u00f6ttner","B\u00fcchele","B\u00fchler","B\u00fcker","B\u00fcngener","B\u00fcrger","B\u00fcrklein","B\u00fcscher","B\u00fcttner","Camara","Carlowitz","Carlsohn","Caspari","Caspers","Chapron","Christ","Cierpinski","Clarius","Cleem","Cleve","Co","Conrad","Cordes","Cornelsen","Cors","Cotthardt","Crews","Cronj\u00e4ger","Crosskofp","Da","Dahm","Dahmen","Daimer","Damaske","Danneberg","Danner","Daub","Daubner","Daudrich","Dauer","Daum","Dauth","Dautzenberg","De","Decker","Deckert","Deerberg","Dehmel","Deja","Delonge","Demut","Dengler","Denner","Denzinger","Derr","Dertmann","Dethloff","Deuschle","Dieckmann","Diedrich","Diekmann","Dienel","Dies","Dietrich","Dietz","Dietzsch","Diezel","Dilla","Dingelstedt","Dippl","Dittmann","Dittmar","Dittmer","Dix","Dobbrunz","Dobler","Dohring","Dolch","Dold","Dombrowski","Donie","Doskoczynski","Dragu","Drechsler","Drees","Dreher","Dreier","Dreissigacker","Dressler","Drews","Duma","Dutkiewicz","Dyett","Dylus","D\u00e4chert","D\u00f6bel","D\u00f6ring","D\u00f6rner","D\u00f6rre","D\u00fcck","Eberhard","Eberhardt","Ecker","Eckhardt","Edorh","Effler","Eggenmueller","Ehm","Ehmann","Ehrig","Eich","Eichmann","Eifert","Einert","Eisenlauer","Ekpo","Elbe","Eleyth","Elss","Emert","Emmelmann","Ender","Engel","Engelen","Engelmann","Eplinius","Erdmann","Erhardt","Erlei","Erm","Ernst","Ertl","Erwes","Esenwein","Esser","Evers","Everts","Ewald","Fahner","Faller","Falter","Farber","Fassbender","Faulhaber","Fehrig","Feld","Felke","Feller","Fenner","Fenske","Feuerbach","Fietz","Figl","Figura","Filipowski","Filsinger","Fincke","Fink","Finke","Fischer","Fitschen","Fleischer","Fleischmann","Floder","Florczak","Flore","Flottmann","Forkel","Forst","Frahmeke","Frank","Franke","Franta","Frantz","Franz","Franzis","Franzmann","Frauen","Frauendorf","Freigang","Freimann","Freimuth","Freisen","Frenzel","Frey","Fricke","Fried","Friedek","Friedenberg","Friedmann","Friedrich","Friess","Frisch","Frohn","Frosch","Fuchs","Fuhlbr\u00fcgge","Fusenig","Fust","F\u00f6rster","Gaba","Gabius","Gabler","Gadschiew","Gakst\u00e4dter","Galander","Gamlin","Gamper","Gangnus","Ganzmann","Garatva","Gast","Gastel","Gatzka","Gauder","Gebhardt","Geese","Gehre","Gehrig","Gehring","Gehrke","Geiger","Geisler","Geissler","Gelling","Gens","Gerbennow","Gerdel","Gerhardt","Gerschler","Gerson","Gesell","Geyer","Ghirmai","Ghosh","Giehl","Gierisch","Giesa","Giesche","Gilde","Glatting","Goebel","Goedicke","Goldbeck","Goldfuss","Goldkamp","Goldk\u00fchle","Goller","Golling","Gollnow","Golomski","Gombert","Gotthardt","Gottschalk","Gotz","Goy","Gradzki","Graf","Grams","Grasse","Gratzky","Grau","Greb","Green","Greger","Greithanner","Greschner","Griem","Griese","Grimm","Gromisch","Gross","Grosser","Grossheim","Grosskopf","Grothaus","Grothkopp","Grotke","Grube","Gruber","Grundmann","Gruning","Gruszecki","Gr\u00f6ss","Gr\u00f6tzinger","Gr\u00fcn","Gr\u00fcner","Gummelt","Gunkel","Gunther","Gutjahr","Gutowicz","Gutschank","G\u00f6bel","G\u00f6ckeritz","G\u00f6hler","G\u00f6rlich","G\u00f6rmer","G\u00f6tz","G\u00f6tzelmann","G\u00fcldemeister","G\u00fcnther","G\u00fcnz","G\u00fcrbig","Haack","Haaf","Habel","Hache","Hackbusch","Hackelbusch","Hadfield","Hadwich","Haferkamp","Hahn","Hajek","Hallmann","Hamann","Hanenberger","Hannecker","Hanniske","Hansen","Hardy","Hargasser","Harms","Harnapp","Harter","Harting","Hartlieb","Hartmann","Hartwig","Hartz","Haschke","Hasler","Hasse","Hassfeld","Haug","Hauke","Haupt","Haverney","Heberstreit","Hechler","Hecht","Heck","Hedermann","Hehl","Heidelmann","Heidler","Heinemann","Heinig","Heinke","Heinrich","Heinze","Heiser","Heist","Hellmann","Helm","Helmke","Helpling","Hengmith","Henkel","Hennes","Henry","Hense","Hensel","Hentel","Hentschel","Hentschke","Hepperle","Herberger","Herbrand","Hering","Hermann","Hermecke","Herms","Herold","Herrmann","Herschmann","Hertel","Herweg","Herwig","Herzenberg","Hess","Hesse","Hessek","Hessler","Hetzler","Heuck","Heydem\u00fcller","Hiebl","Hildebrand","Hildenbrand","Hilgendorf","Hillard","Hiller","Hingsen","Hingst","Hinrichs","Hirsch","Hirschberg","Hirt","Hodea","Hoffman","Hoffmann","Hofmann","Hohenberger","Hohl","Hohn","Hohnheiser","Hold","Holdt","Holinski","Holl","Holtfreter","Holz","Holzdeppe","Holzner","Hommel","Honz","Hooss","Hoppe","Horak","Horn","Horna","Hornung","Hort","Howard","Huber","Huckestein","Hudak","Huebel","Hugo","Huhn","Hujo","Huke","Huls","Humbert","Huneke","Huth","H\u00e4ber","H\u00e4fner","H\u00f6cke","H\u00f6ft","H\u00f6hne","H\u00f6nig","H\u00f6rdt","H\u00fcbenbecker","H\u00fcbl","H\u00fcbner","H\u00fcgel","H\u00fcttcher","H\u00fctter","Ibe","Ihly","Illing","Isak","Isekenmeier","Itt","Jacob","Jacobs","Jagusch","Jahn","Jahnke","Jakobs","Jakubczyk","Jambor","Jamrozy","Jander","Janich","Janke","Jansen","Jarets","Jaros","Jasinski","Jasper","Jegorov","Jellinghaus","Jeorga","Jerschabek","Jess","John","Jonas","Jossa","Jucken","Jung","Jungbluth","Jungton","Just","J\u00fcrgens","Kaczmarek","Kaesmacher","Kahl","Kahlert","Kahles","Kahlmeyer","Kaiser","Kalinowski","Kallabis","Kallensee","Kampf","Kampschulte","Kappe","Kappler","Karhoff","Karrass","Karst","Karsten","Karus","Kass","Kasten","Kastner","Katzinski","Kaufmann","Kaul","Kausemann","Kawohl","Kazmarek","Kedzierski","Keil","Keiner","Keller","Kelm","Kempe","Kemper","Kempter","Kerl","Kern","Kesselring","Kesselschl\u00e4ger","Kette","Kettenis","Keutel","Kick","Kiessling","Kinadeter","Kinzel","Kinzy","Kirch","Kirst","Kisabaka","Klaas","Klabuhn","Klapper","Klauder","Klaus","Kleeberg","Kleiber","Klein","Kleinert","Kleininger","Kleinmann","Kleinsteuber","Kleiss","Klemme","Klimczak","Klinger","Klink","Klopsch","Klose","Kloss","Kluge","Kluwe","Knabe","Kneifel","Knetsch","Knies","Knippel","Knobel","Knoblich","Knoll","Knorr","Knorscheidt","Knut","Kobs","Koch","Kochan","Kock","Koczulla","Koderisch","Koehl","Koehler","Koenig","Koester","Kofferschlager","Koha","Kohle","Kohlmann","Kohnle","Kohrt","Koj","Kolb","Koleiski","Kolokas","Komoll","Konieczny","Konig","Konow","Konya","Koob","Kopf","Kosenkow","Koster","Koszewski","Koubaa","Kovacs","Kowalick","Kowalinski","Kozakiewicz","Krabbe","Kraft","Kral","Kramer","Krauel","Kraus","Krause","Krauspe","Kreb","Krebs","Kreissig","Kresse","Kreutz","Krieger","Krippner","Krodinger","Krohn","Krol","Kron","Krueger","Krug","Kruger","Krull","Kruschinski","Kr\u00e4mer","Kr\u00f6ckert","Kr\u00f6ger","Kr\u00fcger","Kubera","Kufahl","Kuhlee","Kuhnen","Kulimann","Kulma","Kumbernuss","Kummle","Kunz","Kupfer","Kupprion","Kuprion","Kurnicki","Kurrat","Kurschilgen","Kuschewitz","Kuschmann","Kuske","Kustermann","Kutscherauer","Kutzner","Kwadwo","K\u00e4hler","K\u00e4ther","K\u00f6hler","K\u00f6hrbr\u00fcck","K\u00f6hre","K\u00f6lotzei","K\u00f6nig","K\u00f6pernick","K\u00f6seoglu","K\u00fahn","K\u00fahnert","K\u00fchn","K\u00fchnel","K\u00fchnemund","K\u00fchnert","K\u00fchnke","K\u00fcsters","K\u00fcter","Laack","Lack","Ladewig","Lakomy","Lammert","Lamos","Landmann","Lang","Lange","Langfeld","Langhirt","Lanig","Lauckner","Lauinger","Laur\u00e9n","Lausecker","Laux","Laws","Lax","Leberer","Lehmann","Lehner","Leibold","Leide","Leimbach","Leipold","Leist","Leiter","Leiteritz","Leitheim","Leiwesmeier","Lenfers","Lenk","Lenz","Lenzen","Leo","Lepthin","Lesch","Leschnik","Letzelter","Lewin","Lewke","Leyckes","Lg","Lichtenfeld","Lichtenhagen","Lichtl","Liebach","Liebe","Liebich","Liebold","Lieder","Liensh\u00f6ft","Linden","Lindenberg","Lindenmayer","Lindner","Linke","Linnenbaum","Lippe","Lipske","Lipus","Lischka","Lobinger","Logsch","Lohmann","Lohre","Lohse","Lokar","Loogen","Lorenz","Losch","Loska","Lott","Loy","Lubina","Ludolf","Lufft","Lukoschek","Lutje","Lutz","L\u00f6ser","L\u00f6wa","L\u00fcbke","Maak","Maczey","Madetzky","Madubuko","Mai","Maier","Maisch","Malek","Malkus","Mallmann","Malucha","Manns","Manz","Marahrens","Marchewski","Margis","Markowski","Marl","Marner","Marquart","Marschek","Martel","Marten","Martin","Marx","Marxen","Mathes","Mathies","Mathiszik","Matschke","Mattern","Matthes","Matula","Mau","Maurer","Mauroff","May","Maybach","Mayer","Mebold","Mehl","Mehlhorn","Mehlorn","Meier","Meisch","Meissner","Meloni","Melzer","Menga","Menne","Mensah","Mensing","Merkel","Merseburg","Mertens","Mesloh","Metzger","Metzner","Mewes","Meyer","Michallek","Michel","Mielke","Mikitenko","Milde","Minah","Mintzlaff","Mockenhaupt","Moede","Moedl","Moeller","Moguenara","Mohr","Mohrhard","Molitor","Moll","Moller","Molzan","Montag","Moormann","Mordhorst","Morgenstern","Morhelfer","Moritz","Moser","Motchebon","Motzenbb\u00e4cker","Mrugalla","Muckenthaler","Mues","Muller","Mulrain","M\u00e4chtig","M\u00e4der","M\u00f6cks","M\u00f6genburg","M\u00f6hsner","M\u00f6ldner","M\u00f6llenbeck","M\u00f6ller","M\u00f6llinger","M\u00f6rsch","M\u00fchleis","M\u00fcller","M\u00fcnch","Nabein","Nabow","Nagel","Nannen","Nastvogel","Nau","Naubert","Naumann","Ne","Neimke","Nerius","Neubauer","Neubert","Neuendorf","Neumair","Neumann","Neupert","Neurohr","Neuschwander","Newton","Ney","Nicolay","Niedermeier","Nieklauson","Niklaus","Nitzsche","Noack","Nodler","Nolte","Normann","Norris","Northoff","Nowak","Nussbeck","Nwachukwu","Nytra","N\u00f6h","Oberem","Obergf\u00f6ll","Obermaier","Ochs","Oeser","Olbrich","Onnen","Ophey","Oppong","Orth","Orthmann","Oschkenat","Osei","Osenberg","Ostendarp","Ostwald","Otte","Otto","Paesler","Pajonk","Pallentin","Panzig","Paschke","Patzwahl","Paukner","Peselman","Peter","Peters","Petzold","Pfeiffer","Pfennig","Pfersich","Pfingsten","Pflieger","Pfl\u00fcgner","Philipp","Pichlmaier","Piesker","Pietsch","Pingpank","Pinnock","Pippig","Pitschugin","Plank","Plass","Platzer","Plauk","Plautz","Pletsch","Plotzitzka","Poehn","Poeschl","Pogorzelski","Pohl","Pohland","Pohle","Polifka","Polizzi","Pollm\u00e4cher","Pomp","Ponitzsch","Porsche","Porth","Poschmann","Poser","Pottel","Prah","Prange","Prediger","Pressler","Preuk","Preuss","Prey","Priemer","Proske","Pusch","P\u00f6che","P\u00f6ge","Raabe","Rabenstein","Rach","Radtke","Rahn","Ranftl","Rangen","Ranz","Rapp","Rath","Rau","Raubuch","Raukuc","Rautenkranz","Rehwagen","Reiber","Reichardt","Reichel","Reichling","Reif","Reifenrath","Reimann","Reinberg","Reinelt","Reinhardt","Reinke","Reitze","Renk","Rentz","Renz","Reppin","Restle","Restorff","Retzke","Reuber","Reumann","Reus","Reuss","Reusse","Rheder","Rhoden","Richards","Richter","Riedel","Riediger","Rieger","Riekmann","Riepl","Riermeier","Riester","Riethm\u00fcller","Rietm\u00fcller","Rietscher","Ringel","Ringer","Rink","Ripken","Ritosek","Ritschel","Ritter","Rittweg","Ritz","Roba","Rockmeier","Rodehau","Rodowski","Roecker","Roggatz","Rohl\u00e4nder","Rohrer","Rokossa","Roleder","Roloff","Roos","Rosbach","Roschinsky","Rose","Rosenauer","Rosenbauer","Rosenthal","Rosksch","Rossberg","Rossler","Roth","Rother","Ruch","Ruckdeschel","Rumpf","Rupprecht","Ruth","Ryjikh","Ryzih","R\u00e4dler","R\u00e4ntsch","R\u00f6diger","R\u00f6se","R\u00f6ttger","R\u00fccker","R\u00fcdiger","R\u00fcter","Sachse","Sack","Saflanis","Sagafe","Sagonas","Sahner","Saile","Sailer","Salow","Salzer","Salzmann","Sammert","Sander","Sarvari","Sattelmaier","Sauer","Sauerland","Saumweber","Savoia","Scc","Schacht","Schaefer","Schaffarzik","Schahbasian","Scharf","Schedler","Scheer","Schelk","Schellenbeck","Schembera","Schenk","Scherbarth","Scherer","Schersing","Scherz","Scheurer","Scheuring","Scheytt","Schielke","Schieskow","Schildhauer","Schilling","Schima","Schimmer","Schindzielorz","Schirmer","Schirrmeister","Schlachter","Schlangen","Schlawitz","Schlechtweg","Schley","Schlicht","Schlitzer","Schmalzle","Schmid","Schmidt","Schmidtchen","Schmitt","Schmitz","Schmuhl","Schneider","Schnelting","Schnieder","Schniedermeier","Schn\u00fcrer","Schoberg","Scholz","Schonberg","Schondelmaier","Schorr","Schott","Schottmann","Schouren","Schrader","Schramm","Schreck","Schreiber","Schreiner","Schreiter","Schroder","Schr\u00f6der","Schuermann","Schuff","Schuhaj","Schuldt","Schult","Schulte","Schultz","Schultze","Schulz","Schulze","Schumacher","Schumann","Schupp","Schuri","Schuster","Schwab","Schwalm","Schwanbeck","Schwandke","Schwanitz","Schwarthoff","Schwartz","Schwarz","Schwarzer","Schwarzkopf","Schwarzmeier","Schwatlo","Schweisfurth","Schwennen","Schwerdtner","Schwidde","Schwirkschlies","Schwuchow","Sch\u00e4fer","Sch\u00e4ffel","Sch\u00e4ffer","Sch\u00e4ning","Sch\u00f6ckel","Sch\u00f6nball","Sch\u00f6nbeck","Sch\u00f6nberg","Sch\u00f6nebeck","Sch\u00f6nenberger","Sch\u00f6nfeld","Sch\u00f6nherr","Sch\u00f6nlebe","Sch\u00f6tz","Sch\u00fcler","Sch\u00fcppel","Sch\u00fctz","Sch\u00fctze","Seeger","Seelig","Sehls","Seibold","Seidel","Seiders","Seigel","Seiler","Seitz","Semisch","Senkel","Sewald","Siebel","Siebert","Siegling","Sielemann","Siemon","Siener","Sievers","Siewert","Sihler","Sillah","Simon","Sinnhuber","Sischka","Skibicki","Sladek","Slotta","Smieja","Soboll","Sokolowski","Soller","Sollner","Sommer","Somssich","Sonn","Sonnabend","Spahn","Spank","Spelmeyer","Spiegelburg","Spielvogel","Spinner","Spitzm\u00fcller","Splinter","Sporrer","Sprenger","Sp\u00f6ttel","Stahl","Stang","Stanger","Stauss","Steding","Steffen","Steffny","Steidl","Steigauf","Stein","Steinecke","Steinert","Steinkamp","Steinmetz","Stelkens","Stengel","Stengl","Stenzel","Stepanov","Stephan","Stern","Steuk","Stief","Stifel","Stoll","Stolle","Stolz","Storl","Storp","Stoutjesdijk","Stratmann","Straub","Strausa","Streck","Streese","Strege","Streit","Streller","Strieder","Striezel","Strogies","Strohschank","Strunz","Strutz","Stube","St\u00f6ckert","St\u00f6ppler","St\u00f6wer","St\u00fcrmer","Suffa","Sujew","Sussmann","Suthe","Sutschet","Swillims","Szendrei","S\u00f6ren","S\u00fcrth","Tafelmeier","Tang","Tasche","Taufratshofer","Tegethof","Teichmann","Tepper","Terheiden","Terlecki","Teufel","Theele","Thieke","Thimm","Thiomas","Thomas","Thriene","Thr\u00e4nhardt","Thust","Thyssen","Th\u00f6ne","Tidow","Tiedtke","Tietze","Tilgner","Tillack","Timmermann","Tischler","Tischmann","Tittman","Tivontschik","Tonat","Tonn","Trampeli","Trauth","Trautmann","Travan","Treff","Tremmel","Tress","Tsamonikian","Tschiers","Tschirch","Tuch","Tucholke","Tudow","Tuschmo","T\u00e4chl","T\u00f6bben","T\u00f6pfer","Uhlemann","Uhlig","Uhrig","Uibel","Uliczka","Ullmann","Ullrich","Umbach","Umlauft","Umminger","Unger","Unterpaintner","Urban","Urbaniak","Urbansky","Urhig","Vahlensieck","Van","Vangermain","Vater","Venghaus","Verniest","Verzi","Vey","Viellehner","Vieweg","Voelkel","Vogel","Vogelgsang","Vogt","Voigt","Vokuhl","Volk","Volker","Volkmann","Von","Vona","Vontein","Wachenbrunner","Wachtel","Wagner","Waibel","Wakan","Waldmann","Wallner","Wallstab","Walter","Walther","Walton","Walz","Wanner","Wartenberg","Waschb\u00fcsch","Wassilew","Wassiluk","Weber","Wehrsen","Weidlich","Weidner","Weigel","Weight","Weiler","Weimer","Weis","Weiss","Weller","Welsch","Welz","Welzel","Weniger","Wenk","Werle","Werner","Werrmann","Wessel","Wessinghage","Weyel","Wezel","Wichmann","Wickert","Wiebe","Wiechmann","Wiegelmann","Wierig","Wiese","Wieser","Wilhelm","Wilky","Will","Willwacher","Wilts","Wimmer","Winkelmann","Winkler","Winter","Wischek","Wischer","Wissing","Wittich","Wittl","Wolf","Wolfarth","Wolff","Wollenberg","Wollmann","Woytkowska","Wujak","Wurm","Wyludda","W\u00f6lpert","W\u00f6schler","W\u00fchn","W\u00fcnsche","Zach","Zaczkiewicz","Zahn","Zaituc","Zandt","Zanner","Zapletal","Zauber","Zeidler","Zekl","Zender","Zeuch","Zeyen","Zeyhle","Ziegler","Zimanyi","Zimmer","Zimmermann","Zinser","Zintl","Zipp","Zipse","Zschunke","Zuber","Zwiener","Z\u00fcmsande","\u00d6stringer","\u00dcberacker"],"prefix":["Dr.","Prof. Dr."],"nobility_title_prefix":["zu","von","vom","von der"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{nobility_title_prefix} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["01 #######","01#######","+43-1-#######","+431#######","0#### ####","0#########","+43-####-####","+43 ########"]},"cell_phone":{"formats":["+43-6##-#######","06##-########","+436#########","06##########"]}}},"it":{"faker":{"address":{"city_prefix":["San","Borgo","Sesto","Quarto","Settimo"],"city_suffix":["a mare","lido","ligure","del friuli","salentino","calabro","veneto","nell'emilia","umbro","laziale","terme","sardo"],"country":["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antartide (territori a sud del 60\u00b0 parallelo)","Antigua e Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Bielorussia","Belgio","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia e Herzegovina","Botswana","Bouvet Island (Bouvetoya)","Brasile","Territorio dell'arcipelago indiano","Isole Vergini Britanniche","Brunei Darussalam","Bulgaria","Burkina Faso","Burundi","Cambogia","Cameroon","Canada","Capo Verde","Isole Cayman","Repubblica Centrale Africana","Chad","Cile","Cina","Isola di Pasqua","Isola di Cocos (Keeling)","Colombia","Comoros","Congo","Isole Cook","Costa Rica","Costa d'Avorio","Croazia","Cuba","Cipro","Repubblica Ceca","Danimarca","Gibuti","Repubblica Dominicana","Equador","Egitto","El Salvador","Guinea Equatoriale","Eritrea","Estonia","Etiopia","Isole Faroe","Isole Falkland (Malvinas)","Fiji","Finlandia","Francia","Guyana Francese","Polinesia Francese","Territori Francesi del sud","Gabon","Gambia","Georgia","Germania","Ghana","Gibilterra","Grecia","Groenlandia","Grenada","Guadalupa","Guam","Guatemala","Guernsey","Guinea","Guinea-Bissau","Guyana","Haiti","Heard Island and McDonald Islands","Citt\u00e0 del Vaticano","Honduras","Hong Kong","Ungheria","Islanda","India","Indonesia","Iran","Iraq","Irlanda","Isola di Man","Israele","Italia","Giamaica","Giappone","Jersey","Giordania","Kazakhstan","Kenya","Kiribati","Korea","Kuwait","Republicca Kirgiza","Repubblica del Laos","Latvia","Libano","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lituania","Lussemburgo","Macao","Macedonia","Madagascar","Malawi","Malesia","Maldive","Mali","Malta","Isole Marshall","Martinica","Mauritania","Mauritius","Mayotte","Messico","Micronesia","Moldova","Principato di Monaco","Mongolia","Montenegro","Montserrat","Marocco","Mozambico","Myanmar","Namibia","Nauru","Nepal","Antille Olandesi","Olanda","Nuova Caledonia","Nuova Zelanda","Nicaragua","Niger","Nigeria","Niue","Isole Norfolk","Northern Mariana Islands","Norvegia","Oman","Pakistan","Palau","Palestina","Panama","Papua Nuova Guinea","Paraguay","Peru","Filippine","Pitcairn Islands","Polonia","Portogallo","Porto Rico","Qatar","Reunion","Romania","Russia","Rwanda","San Bartolomeo","Sant'Elena","Saint Kitts and Nevis","Saint Lucia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Arabia Saudita","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovenia","Isole Solomon","Somalia","Sud Africa","Georgia del sud e South Sandwich Islands","Spagna","Sri Lanka","Sudan","Suriname","Svalbard & Jan Mayen Islands","Swaziland","Svezia","Svizzera","Siria","Taiwan","Tajikistan","Tanzania","Tailandia","Timor-Leste","Togo","Tokelau","Tonga","Trinidad e Tobago","Tunisia","Turchia","Turkmenistan","Isole di Turks and Caicos","Tuvalu","Uganda","Ucraina","Emirati Arabi Uniti","Regno Unito","Stati Uniti d'America","United States Minor Outlying Islands","Isole Vergini Statunitensi","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Wallis and Futuna","Western Sahara","Yemen","Zambia","Zimbabwe"],"building_number":["###","##","#"],"street_suffix":["Piazza","Strada","Via","Borgo","Contrada","Rotonda","Incrocio"],"secondary_address":["Appartamento ##","Piano #"],"postcode":["#####"],"state":["Agrigento","Alessandria","Ancona","Aosta","Arezzo","Ascoli Piceno","Asti","Avellino","Bari","Barletta-Andria-Trani","Belluno","Benevento","Bergamo","Biella","Bologna","Bolzano","Brescia","Brindisi","Cagliari","Caltanissetta","Campobasso","Carbonia-Iglesias","Caserta","Catania","Catanzaro","Chieti","Como","Cosenza","Cremona","Crotone","Cuneo","Enna","Fermo","Ferrara","Firenze","Foggia","Forl\u00ec-Cesena","Frosinone","Genova","Gorizia","Grosseto","Imperia","Isernia","La Spezia","L'Aquila","Latina","Lecce","Lecco","Livorno","Lodi","Lucca","Macerata","Mantova","Massa-Carrara","Matera","Messina","Milano","Modena","Monza e della Brianza","Napoli","Novara","Nuoro","Olbia-Tempio","Oristano","Padova","Palermo","Parma","Pavia","Perugia","Pesaro e Urbino","Pescara","Piacenza","Pisa","Pistoia","Pordenone","Potenza","Prato","Ragusa","Ravenna","Reggio Calabria","Reggio Emilia","Rieti","Rimini","Roma","Rovigo","Salerno","Medio Campidano","Sassari","Savona","Siena","Siracusa","Sondrio","Taranto","Teramo","Terni","Torino","Ogliastra","Trapani","Trento","Treviso","Trieste","Udine","Varese","Venezia","Verbano-Cusio-Ossola","Vercelli","Verona","Vibo Valentia","Vicenza","Viterbo"],"state_abbr":["AG","AL","AN","AO","AR","AP","AT","AV","BA","BT","BL","BN","BG","BI","BO","BZ","BS","BR","CA","CL","CB","CI","CE","CT","CZ","CH","CO","CS","CR","KR","CN","EN","FM","FE","FI","FG","FC","FR","GE","GO","GR","IM","IS","SP","AQ","LT","LE","LC","LI","LO","LU","MC","MN","MS","MT","ME","MI","MO","MB","NA",false,"NU","OT","OR","PD","PA","PR","PV","PG","PU","PE","PC","PI","PT","PN","PZ","PO","RG","RA","RC","RE","RI","RN","RM","RO","SA","VS","SS","SV","SI","SR","SO","TA","TE","TR","TO","OG","TP","TN","TV","TS","UD","VA","VE","VB","VC","VR","VV","VI","VT"],"city":["#{city_prefix} #{Name.first_name} #{city_suffix}","#{city_prefix} #{Name.first_name}","#{Name.first_name} #{city_suffix}","#{Name.last_name} #{city_suffix}"],"street_name":["#{street_suffix} #{Name.first_name}","#{street_suffix} #{Name.last_name}"],"street_address":["#{street_name} #{building_number}","#{street_name} #{building_number}, #{secondary_address}"],"default_country":["Italia"]},"company":{"suffix":["SPA","e figli","Group","s.r.l."],"buzzwords":[["Abilit\u00e0","Access","Adattatore","Algoritmo","Alleanza","Analizzatore","Applicazione","Approccio","Architettura","Archivio","Intelligenza artificiale","Array","Attitudine","Benchmark","Capacit\u00e0","Sfida","Circuito","Collaborazione","Complessit\u00e0","Concetto","Conglomerato","Contingenza","Core","Database","Data-warehouse","Definizione","Emulazione","Codifica","Criptazione","Firmware","Flessibilit\u00e0","Previsione","Frame","framework","Funzione","Funzionalit\u00e0","Interfaccia grafica","Hardware","Help-desk","Gerarchia","Hub","Implementazione","Infrastruttura","Iniziativa","Installazione","Set di istruzioni","Interfaccia","Soluzione internet","Intranet","Conoscenza base","Matrici","Matrice","Metodologia","Middleware","Migrazione","Modello","Moderazione","Monitoraggio","Moratoria","Rete","Architettura aperta","Sistema aperto","Orchestrazione","Paradigma","Parallelismo","Policy","Portale","Struttura di prezzo","Prodotto","Produttivit\u00e0","Progetto","Proiezione","Protocollo","Servizio clienti","Software","Soluzione","Standardizzazione","Strategia","Struttura","Successo","Sovrastruttura","Supporto","Sinergia","Task-force","Finestra temporale","Strumenti","Utilizzazione","Sito web","Forza lavoro"],["adattiva","avanzata","migliorata","assimilata","automatizzata","bilanciata","centralizzata","compatibile","configurabile","cross-platform","decentralizzata","digitalizzata","distribuita","piccola","ergonomica","esclusiva","espansa","estesa","configurabile","fondamentale","orizzontale","implementata","innovativa","integrata","intuitiva","inversa","gestita","obbligatoria","monitorata","multi-canale","multi-laterale","open-source","operativa","ottimizzata","organica","persistente","polarizzata","proattiva","programmabile","progressiva","reattiva","riallineata","ricontestualizzata","ridotta","robusta","sicura","condivisibile","stand-alone","switchabile","sincronizzata","sinergica","totale","universale","user-friendly","versatile","virtuale","visionaria"],["24 ore","24/7","terza generazione","quarta generazione","quinta generazione","sesta generazione","asimmetrica","asincrona","background","bi-direzionale","biforcata","bottom-line","coerente","coesiva","composita","sensibile al contesto","basta sul contesto","basata sul contenuto","dedicata","didattica","direzionale","discreta","dinamica","eco-centrica","esecutiva","esplicita","full-range","globale","euristica","alto livello","olistica","omogenea","ibrida","impattante","incrementale","intangibile","interattiva","intermediaria","locale","logistica","massimizzata","metodica","mission-critical","mobile","modulare","motivazionale","multimedia","multi-tasking","nazionale","neutrale","nextgeneration","non-volatile","object-oriented","ottima","ottimizzante","radicale","real-time","reciproca","regionale","responsiva","scalabile","secondaria","stabile","statica","sistematica","sistemica","tangibile","terziaria","uniforme","valore aggiunto"]],"bs":[["partnerships","comunit\u00e0","ROI","soluzioni","e-services","nicchie","tecnologie","contenuti","supply-chains","convergenze","relazioni","architetture","interfacce","mercati","e-commerce","sistemi","modelli","schemi","reti","applicazioni","metriche","e-business","funzionalit\u00e0","esperienze","webservices","metodologie"],["implementate","utilizzo","integrate","ottimali","evolutive","abilitate","reinventate","aggregate","migliorate","incentivate","monetizzate","sinergizzate","strategiche","deploy","marchi","accrescitive","target","sintetizzate","spedizioni","massimizzate","innovazione","guida","estensioni","generate","exploit","transizionali","matrici","ricontestualizzate"],["valore aggiunto","verticalizzate","proattive","forti","rivoluzionari","scalabili","innovativi","intuitivi","strategici","e-business","mission-critical","24/7","globali","B2B","B2C","granulari","virtuali","virali","dinamiche","magnetiche","web","interattive","sexy","back-end","real-time","efficienti","front-end","distributivi","estensibili","mondiali","open-source","cross-platform","sinergiche","out-of-the-box","enterprise","integrate","di impatto","wireless","trasparenti","next-generation","cutting-edge","visionari","plug-and-play","collaborative","olistiche","ricche"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name} #{suffix}","#{Name.last_name}, #{Name.last_name} e #{Name.last_name} #{suffix}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com","email.it","libero.it","yahoo.it"],"domain_suffix":["com","com","com","net","org","it","it","it"]},"name":{"first_name":["Aaron","Akira","Alberto","Alessandro","Alighieri","Amedeo","Amos","Anselmo","Antonino","Arcibaldo","Armando","Artes","Audenico","Ausonio","Bacchisio","Battista","Bernardo","Boris","Caio","Carlo","Cecco","Cirino","Cleros","Costantino","Damiano","Danny","Davide","Demian","Dimitri","Domingo","Dylan","Edilio","Egidio","Elio","Emanuel","Enrico","Ercole","Ermes","Ethan","Eusebio","Evangelista","Fabiano","Ferdinando","Fiorentino","Flavio","Fulvio","Gabriele","Gastone","Germano","Giacinto","Gianantonio","Gianleonardo","Gianmarco","Gianriccardo","Gioacchino","Giordano","Giuliano","Graziano","Guido","Harry","Iacopo","Ilario","Ione","Italo","Jack","Jari","Joey","Joseph","Kai","Kociss","Laerte","Lauro","Leonardo","Liborio","Lorenzo","Ludovico","Maggiore","Manuele","Mariano","Marvin","Matteo","Mauro","Michael","Mirco","Modesto","Muzio","Nabil","Nathan","Nick","Noah","Odino","Olo","Oreste","Osea","Pablo","Patrizio","Piererminio","Pierfrancesco","Piersilvio","Priamo","Quarto","Quirino","Radames","Raniero","Renato","Rocco","Romeo","Rosalino","Rudy","Sabatino","Samuel","Santo","Sebastian","Serse","Silvano","Sirio","Tancredi","Terzo","Timoteo","Tolomeo","Trevis","Ubaldo","Ulrico","Valdo","Neri","Vinicio","Walter","Xavier","Yago","Zaccaria","Abramo","Adriano","Alan","Albino","Alessio","Alighiero","Amerigo","Anastasio","Antimo","Antonio","Arduino","Aroldo","Arturo","Augusto","Avide","Baldassarre","Bettino","Bortolo","Caligola","Carmelo","Celeste","Ciro","Costanzo","Dante","Danthon","Davis","Demis","Dindo","Domiziano","Edipo","Egisto","Eliziario","Emidio","Enzo","Eriberto","Erminio","Ettore","Eustachio","Fabio","Fernando","Fiorenzo","Folco","Furio","Gaetano","Gavino","Gerlando","Giacobbe","Giancarlo","Gianmaria","Giobbe","Giorgio","Giulio","Gregorio","Hector","Ian","Ippolito","Ivano","Jacopo","Jarno","Joannes","Joshua","Karim","Kris","Lamberto","Lazzaro","Leone","Lino","Loris","Luigi","Manfredi","Marco","Marino","Marzio","Mattia","Max","Michele","Mirko","Moreno","Nadir","Nazzareno","Nestore","Nico","Noel","Odone","Omar","Orfeo","Osvaldo","Pacifico","Pericle","Pietro","Primo","Quasimodo","Radio","Raoul","Renzo","Rodolfo","Romolo","Rosolino","Rufo","Sabino","Sandro","Sasha","Secondo","Sesto","Silverio","Siro","Tazio","Teseo","Timothy","Tommaso","Tristano","Umberto","Ariel","Artemide","Assia","Azue","Benedetta","Bibiana","Brigitta","Carmela","Cassiopea","Cesidia","Cira","Clea","Cleopatra","Clodovea","Concetta","Cosetta","Cristyn","Damiana","Danuta","Deborah","Demi","Diamante","Diana","Donatella","Doriana","Edvige","Elda","Elga","Elsa","Emilia","Enrica","Erminia","Eufemia","Evita","Fatima","Felicia","Filomena","Flaviana","Fortunata","Gelsomina","Genziana","Giacinta","Gilda","Giovanna","Giulietta","Grazia","Guendalina","Helga","Ileana","Ingrid","Irene","Isabel","Isira","Ivonne","Jelena","Jole","Claudia","Kayla","Kristel","Laura","Lucia","Lia","Lidia","Lisa","Loredana","Loretta","Luce","Lucrezia","Luna","Maika","Marcella","Maria","Mariagiulia","Marianita","Mariapia","Marieva","Marina","Maristella","Maruska","Matilde","Mecren","Mercedes","Mietta","Miriana","Miriam","Monia","Morgana","Naomi","Nayade","Nicoletta","Ninfa","Noemi","Nunzia","Olimpia","Oretta","Ortensia","Penelope","Piccarda","Prisca","Rebecca","Rita","Rosalba","Rosaria","Rosita","Ruth","Samira","Sarita","Selvaggia","Shaira","Sibilla","Soriana","Thea","Tosca","Ursula","Vania","Vera","Vienna","Violante","Vitalba","Zelida"],"last_name":["Amato","Barbieri","Barone","Basile","Battaglia","Bellini","Benedetti","Bernardi","Bianc","Bianchi","Bruno","Caputo","Carbon","Caruso","Cattaneo","Colombo","Cont","Conte","Coppola","Costa","Costantin","D'amico","D'angelo","Damico","De Angelis","De luca","De rosa","De Santis","Donati","Esposito","Fabbri","Farin","Ferrara","Ferrari","Ferraro","Ferretti","Ferri","Fior","Fontana","Galli","Gallo","Gatti","Gentile","Giordano","Giuliani","Grassi","Grasso","Greco","Guerra","Leone","Lombardi","Lombardo","Longo","Mancini","Marchetti","Marian","Marini","Marino","Martinelli","Martini","Martino","Mazza","Messina","Milani","Montanari","Monti","Morelli","Moretti","Negri","Neri","Orlando","Pagano","Palmieri","Palumbo","Parisi","Pellegrini","Pellegrino","Piras","Ricci","Rinaldi","Riva","Rizzi","Rizzo","Romano","Ross","Rossetti","Ruggiero","Russo","Sala","Sanna","Santoro","Sartori","Serr","Silvestri","Sorrentino","Testa","Valentini","Villa","Vitale","Vitali"],"prefix":["Sig.","Dott.","Dr.","Ing."],"suffix":[],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["+## ### ## ## ####","+## ## #######","+## ## ########","+## ### #######","+## ### ########","+## #### #######","+## #### ########","0## ### ####","+39 0## ### ###","3## ### ###","+39 3## ### ###"]}}},"sk":{"faker":{"address":{"city_prefix":["North","East","West","South","New","Lake","Port"],"city_suffix":["town","ton","land","ville","berg","burgh","borough","bury","view","port","mouth","stad","furt","chester","mouth","fort","haven","side","shire"],"country":["Afganistan","Afg\u00e1nsky islamsk\u00fd \u0161t\u00e1t","Alb\u00e1nsko","Alb\u00e1nska republika","Al\u017e\u00edrsko","Al\u017e\u00edrska demokratick\u00e1 \u013eudov\u00e1 republika","Andorra","Andorrsk\u00e9 knie\u017eatsvo","Angola","Angolsk\u00e1 republika","Antigua a Barbuda","Antigua a Barbuda","Argent\u00edna","Argent\u00ednska republika","Arm\u00e9nsko","Arm\u00e9nska republika","Austr\u00e1lia","Austr\u00e1lsky zv\u00e4z","Azerbajd\u017ean","Azerbajd\u017eansk\u00e1 republika","Bahamy","Bahamsk\u00e9 spolo\u010denstvo","Bahrajn","Bahrajnsk\u00e9 kr\u00e1\u013eovstvo","Banglad\u00e9\u0161","Banglad\u00e9\u0161ska \u013eudov\u00e1 republika","Barbados","Barbados","Belgicko","Belgick\u00e9 kr\u00e1\u013eovstvo","Belize","Belize","Benin","Beninsk\u00e1 republika","Bhut\u00e1n","Bhut\u00e1nske kr\u00e1\u013eovstvo","Bielorusko","Bielorusk\u00e1 republika","Bol\u00edvia","Bol\u00edvijsk\u00e1 republika","Bosna a Hercegovina","Republika Bosny a Hercegoviny","Botswana","Botswansk\u00e1 republika","Braz\u00edlia","Braz\u00edlska federat\u00edvna republika","Brunej","Brunejsk\u00fd sultan\u00e1t","Bulharsko","Bulharsk\u00e1 republika","Burkina Faso","Burkina Faso","Burundi","Burundsk\u00e1 republika","Cyprus","Cypersk\u00e1 republika","\u010cad","Republika \u010cad","\u010cesko","\u010cesk\u00e1 republika","\u010c\u00edna","\u010c\u00ednska \u013eudov\u00e1 republika","D\u00e1nsko","D\u00e1nsko kr\u00e1\u013eovstvo","Dominika","Spolo\u010denstvo Dominika","Dominik\u00e1nska republika","Dominik\u00e1nska republika","D\u017eibutsko","D\u017eibutsk\u00e1 republika","Egypt","Egyptsk\u00e1 arabsk\u00e1 republika","Ekv\u00e1dor","Ekv\u00e1dorsk\u00e1 republika","Eritrea","Eritrejsk\u00fd \u0161t\u00e1t","Est\u00f3nsko","Est\u00f3nska republika","Eti\u00f3pia","Eti\u00f3pska federat\u00edvna demokratick\u00e1 republika","Fid\u017ei","Republika ostrovy Fid\u017ei","Filip\u00edny","Filip\u00ednska republika","F\u00ednsko","F\u00ednska republika","Franc\u00fazsko","Franc\u00fazska republika","Gabon","Gabonsk\u00e1 republika","Gambia","Gambijsk\u00e1 republika","Ghana","Ghansk\u00e1 republika","Gr\u00e9cko","Hel\u00e9nska republika","Grenada","Grenada","Gruz\u00ednsko","Gruz\u00ednsko","Guatemala","Guatemalsk\u00e1 republika","Guinea","Guinejsk\u00e1 republika","Guinea-Bissau","Republika Guinea-Bissau","Guayana","Guayansk\u00e1 republika","Haiti","Republika Haiti","Holandsko","Holandsk\u00e9 kr\u00e1\u013eovstvo","Honduras","Hondurask\u00e1 republika","Chile","\u010c\u00edlska republika","Chorv\u00e1tsko","Chorv\u00e1tska republika","India","Indick\u00e1 republika","Indon\u00e9zia","Indon\u00e9zska republika","Irak","Irack\u00e1 republika","Ir\u00e1n","Ir\u00e1nska islamsk\u00e1 republika","Island","Islandsk\u00e1 republika","Izrael","\u0160t\u00e1t Izrael","\u00cdrsko","\u00cdrska republika","Jamajka","Jamajka","Japonsko","Japonsko","Jemen","Jemensk\u00e1 republika","Jord\u00e1nsko","Jord\u00e1nske h\u00e1\u0161imovsk\u00e9 kr\u00e1\u013eovstvo","Ju\u017en\u00e1 Afrika","Juhoafrick\u00e1 republika","Kambod\u017ea","Kambod\u017esk\u00e9 kr\u00e1\u013eovstvo","Kamerun","Kamerunsk\u00e1 republika","Kanada","Kanada","Kapverdy","Kapverdsk\u00e1 republika","Katar","\u0160t\u00e1t Katar","Kazachstan","Kaza\u0161sk\u00e1 republika","Ke\u0148a","Kensk\u00e1 republika","Kirgizsko","Kirgizsk\u00e1 republika","Kiribati","Kiribatsk\u00e1 republika","Kolumbia","Kolumbijsk\u00e1 republika","Komory","Komorsk\u00e1 \u00fania","Kongo","Kon\u017esk\u00e1 demokratick\u00e1 republika","Kongo (\"Brazzaville\")","Kon\u017esk\u00e1 republika","K\u00f3rea (\"Ju\u017en\u00e1\")","K\u00f3rejsk\u00e1 republika","K\u00f3rea (\"Severn\u00e1\")","K\u00f3rejsk\u00e1 \u013eudovodemokratick\u00e1 republika","Kostarika","Kostarick\u00e1 republika","Kuba","Kub\u00e1nska republika","Kuvajt","Kuvajtsk\u00fd \u0161t\u00e1t","Laos","Laosk\u00e1 \u013eudovodemokratick\u00e1 republika","Lesotho","Lesothsk\u00e9 kr\u00e1\u013eovstvo","Libanon","Libanonsk\u00e1 republika","Lib\u00e9ria","Lib\u00e9rijsk\u00e1 republika","L\u00edbya","L\u00edbyjsk\u00e1 arabsk\u00e1 \u013eudov\u00e1 socialistick\u00e1 d\u017eam\u00e1h\u00edrija","Lichten\u0161tajnsko","Lichten\u0161tajnsk\u00e9 knie\u017eatstvo","Litva","Litovsk\u00e1 republika","Loty\u0161sko","Loty\u0161sk\u00e1 republika","Luxembursko","Luxembursk\u00e9 ve\u013ekovojvodstvo","Maced\u00f3nsko","Maced\u00f3nska republika","Madagaskar","Madagaskarsk\u00e1 republika","Ma\u010farsko","Ma\u010farsk\u00e1 republika","Malajzia","Malajzia","Malawi","Malawijsk\u00e1 republika","Maldivy","Maldivsk\u00e1 republika","Mali","Malijsk\u00e1 republika","Malta","Malta","Maroko","Marock\u00e9 kr\u00e1\u013eovstvo","Marshallove ostrovy","Republika Marshallov\u00fdch ostrovy","Maurit\u00e1nia","Maurit\u00e1nska islamsk\u00e1 republika","Maur\u00edcius","Maur\u00edcijsk\u00e1 republika","Mexiko","Spojen\u00e9 \u0161t\u00e1ty mexick\u00e9","Mikron\u00e9zia","Mikron\u00e9zske federat\u00edvne \u0161t\u00e1ty","Mjanmarsko","Mjanmarsk\u00fd zv\u00e4z","Moldavsko","Moldavsk\u00e1 republika","Monako","Monack\u00e9 knie\u017eatstvo","Mongolsko","Mongolsko","Mozambik","Mozambick\u00e1 republika","Nam\u00edbia","Nam\u00edbijsk\u00e1 republika","Nauru","Naursk\u00e1 republika","Nemecko","Nemeck\u00e1 spolkov\u00e1 republika","Nep\u00e1l","Nep\u00e1lske kr\u00e1\u013eovstvo","Niger","Nigersk\u00e1 republika","Nig\u00e9ria","Nig\u00e9rijsk\u00e1 federat\u00edvna republika","Nikaragua","Nikaragujsk\u00e1 republika","Nov\u00fd Z\u00e9land","Nov\u00fd Z\u00e9land","N\u00f3rsko","N\u00f3rske kr\u00e1\u013eovstvo","Om\u00e1n","Om\u00e1nsky sultan\u00e1t","Pakistan","Pakistansk\u00e1 islamsk\u00e1 republika","Palau","Palausk\u00e1 republika","Panama","Panamsk\u00e1 republika","Papua-Nov\u00e1 Guinea","Nez\u00e1visl\u00fd \u0161t\u00e1t Papua-Nov\u00e1 Guinea","Paraguaj","Paraguajsk\u00e1 republika","Peru","Peru\u00e1nska republika","Pobre\u017eie Slonoviny","Republika Pobre\u017eie Slonoviny","Po\u013esko","Po\u013esk\u00e1 republika","Portugalsko","Portugalsk\u00e1 republika","Rak\u00fasko","Rak\u00faska republika","Rovn\u00edkov\u00e1 Guinea","Republika Rovn\u00edkov\u00e1 Guinea","Rumunsko","Rumunsko","Rusko","Rusk\u00e1 feder\u00e1cia","Rwanda","Rwandsk\u00e1 republika","Salv\u00e1dor","Salv\u00e1dorsk\u00e1 republika","Samoa","Nez\u00e1visl\u00fd \u0161t\u00e1t Samoa","San Mar\u00edno","Sanmar\u00ednska republika","Saudsk\u00e1 Ar\u00e1bia","Kr\u00e1\u013eovstvo Saudskej Ar\u00e1bie","Senegal","Senegalsk\u00e1 republika","Seychely","Seychelsk\u00e1 republika","Sierra Leone","Republika Sierra Leone","Singapur","Singapurska republika","Slovensko","Slovensk\u00e1 republika","Slovinsko","Slovinsk\u00e1 republika","Som\u00e1lsko","Som\u00e1lska demokratick\u00e1 republika","Spojen\u00e9 arabsk\u00e9 emir\u00e1ty","Spojen\u00e9 arabsk\u00e9 emir\u00e1ty","Spojen\u00e9 \u0161t\u00e1ty americk\u00e9","Spojen\u00e9 \u0161t\u00e1ty americk\u00e9","Srbsko a \u010cierna Hora","Srbsko a \u010cierna Hora","Sr\u00ed Lanka","Demokratick\u00e1 socialistick\u00e1 republika Sr\u00ed Lanka","Stredoafrick\u00e1 republika","Stredoafrick\u00e1 republika","Sud\u00e1n","Sud\u00e1nska republika","Surinam","Surinamsk\u00e1 republika","Svazijsko","Svazijsk\u00e9 kr\u00e1\u013eovstvo","Sv\u00e4t\u00e1 Lucia","Sv\u00e4t\u00e1 Lucia","Sv\u00e4t\u00fd Kri\u0161tof a Nevis","Feder\u00e1cia Sv\u00e4t\u00fd Kri\u0161tof a Nevis","Sv. Tom\u00e1\u0161 a Princov Ostrov","Demokratick\u00e1 republika Sv\u00e4t\u00fd Tom\u00e1\u0161 a Princov Ostrov","Sv. Vincent a Grenad\u00edny","Sv\u00e4t\u00fd Vincent a Grenad\u00edny","S\u00fdria","S\u00fdrska arabsk\u00e1 republika","\u0160alam\u00fanove ostrovy","\u0160alam\u00fanove ostrovy","\u0160panielsko","\u0160panielske kr\u00e1\u013eovstvo","\u0160vaj\u010diarsko","\u0160vaj\u010diarska konfeder\u00e1cia","\u0160v\u00e9dsko","\u0160v\u00e9dske kr\u00e1\u013eovstvo","Tad\u017eikistan","Tad\u017eick\u00e1 republika","Taliansko","Talianska republika","Tanz\u00e1nia","Tanz\u00e1nijsk\u00e1 zjednoten\u00e1 republika","Thajsko","Thajsk\u00e9 kr\u00e1\u013eovstvo","Togo","To\u017esk\u00e1 republika","Tonga","Ton\u017esk\u00e9 kr\u00e1\u013eovstvo","Trinidad a Tobago","Republika Trinidad a Tobago","Tunisko","Tunisk\u00e1 republika","Turecko","Tureck\u00e1 republika","Turkm\u00e9nsko","Turkm\u00e9nsko","Tuvalu","Tuvalu","Uganda","Ugandsk\u00e1 republika","Ukrajina","Uruguaj","Uruguajsk\u00e1 v\u00fdchodn\u00e1 republika","Uzbekistan","Vanuatu","Vanuatsk\u00e1 republika","Vatik\u00e1n","Sv\u00e4t\u00e1 Stolica","Ve\u013ek\u00e1 Brit\u00e1nia","Spojen\u00e9 kr\u00e1\u013eovstvo Ve\u013ekej Brit\u00e1nie a Severn\u00e9ho \u00cdrska","Venezuela","Venezuelsk\u00e1 bol\u00edvarovsk\u00e1 republika","Vietnam","Vietnamsk\u00e1 socialistick\u00e1 republika","V\u00fdchodn\u00fd Timor","Demokratick\u00e1 republika V\u00fdchodn\u00fd Timor","Zambia","Zambijsk\u00e1 republika","Zimbabwe","Zimbabwianska republika"],"building_number":["#","##","###"],"secondary_address":["Apt. ###","Suite ###"],"postcode":["#####","### ##","## ###"],"state":[],"state_abbr":[],"time_zone":["Pacific/Midway","Pacific/Pago_Pago","Pacific/Honolulu","America/Juneau","America/Los_Angeles","America/Tijuana","America/Denver","America/Phoenix","America/Chihuahua","America/Mazatlan","America/Chicago","America/Regina","America/Mexico_City","America/Mexico_City","America/Monterrey","America/Guatemala","America/New_York","America/Indiana/Indianapolis","America/Bogota","America/Lima","America/Lima","America/Halifax","America/Caracas","America/La_Paz","America/Santiago","America/St_Johns","America/Sao_Paulo","America/Argentina/Buenos_Aires","America/Guyana","America/Godthab","Atlantic/South_Georgia","Atlantic/Azores","Atlantic/Cape_Verde","Europe/Dublin","Europe/London","Europe/Lisbon","Europe/London","Africa/Casablanca","Africa/Monrovia","Etc/UTC","Europe/Belgrade","Europe/Bratislava","Europe/Budapest","Europe/Ljubljana","Europe/Prague","Europe/Sarajevo","Europe/Skopje","Europe/Warsaw","Europe/Zagreb","Europe/Brussels","Europe/Copenhagen","Europe/Madrid","Europe/Paris","Europe/Amsterdam","Europe/Berlin","Europe/Berlin","Europe/Rome","Europe/Stockholm","Europe/Vienna","Africa/Algiers","Europe/Bucharest","Africa/Cairo","Europe/Helsinki","Europe/Kiev","Europe/Riga","Europe/Sofia","Europe/Tallinn","Europe/Vilnius","Europe/Athens","Europe/Istanbul","Europe/Minsk","Asia/Jerusalem","Africa/Harare","Africa/Johannesburg","Europe/Moscow","Europe/Moscow","Europe/Moscow","Asia/Kuwait","Asia/Riyadh","Africa/Nairobi","Asia/Baghdad","Asia/Tehran","Asia/Muscat","Asia/Muscat","Asia/Baku","Asia/Tbilisi","Asia/Yerevan","Asia/Kabul","Asia/Yekaterinburg","Asia/Karachi","Asia/Karachi","Asia/Tashkent","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kathmandu","Asia/Dhaka","Asia/Dhaka","Asia/Colombo","Asia/Almaty","Asia/Novosibirsk","Asia/Rangoon","Asia/Bangkok","Asia/Bangkok","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Shanghai","Asia/Chongqing","Asia/Hong_Kong","Asia/Urumqi","Asia/Kuala_Lumpur","Asia/Singapore","Asia/Taipei","Australia/Perth","Asia/Irkutsk","Asia/Ulaanbaatar","Asia/Seoul","Asia/Tokyo","Asia/Tokyo","Asia/Tokyo","Asia/Yakutsk","Australia/Darwin","Australia/Adelaide","Australia/Melbourne","Australia/Melbourne","Australia/Sydney","Australia/Brisbane","Australia/Hobart","Asia/Vladivostok","Pacific/Guam","Pacific/Port_Moresby","Asia/Magadan","Asia/Magadan","Pacific/Noumea","Pacific/Fiji","Asia/Kamchatka","Pacific/Majuro","Pacific/Auckland","Pacific/Auckland","Pacific/Tongatapu","Pacific/Fakaofo","Pacific/Apia"],"city_name":["B\u00e1novce nad Bebravou","Bansk\u00e1 Bystrica","Bansk\u00e1 \u0160tiavnica","Bardejov","Bratislava I","Bratislava II","Bratislava III","Bratislava IV","Bratislava V","Brezno","Byt\u010da","\u010cadca","Detva","Doln\u00fd Kub\u00edn","Dunajsk\u00e1 Streda","Galanta","Gelnica","Hlohovec","Humenn\u00e9","Ilava","Ke\u017emarok","Kom\u00e1rno","Ko\u0161ice I","Ko\u0161ice II","Ko\u0161ice III","Ko\u0161ice IV","Ko\u0161ice-okolie","Krupina","Kysuck\u00e9 Nov\u00e9 Mesto","Levice","Levo\u010da","Liptovsk\u00fd Mikul\u00e1\u0161","Lu\u010denec","Malacky","Martin","Medzilaborce","Michalovce","Myjava","N\u00e1mestovo","Nitra","Nov\u00e9 Mesto n.V\u00e1hom","Nov\u00e9 Z\u00e1mky","Partiz\u00e1nske","Pezinok","Pie\u0161\u0165any","Polt\u00e1r","Poprad","Pova\u017esk\u00e1 Bystrica","Pre\u0161ov","Prievidza","P\u00fachov","Rev\u00faca","Rimavsk\u00e1 Sobota","Ro\u017e\u0148ava","Ru\u017eomberok","Sabinov","\u0160a\u013ea","Senec","Senica","Skalica","Snina","Sobrance","Spi\u0161sk\u00e1 Nov\u00e1 Ves","Star\u00e1 \u013dubov\u0148a","Stropkov","Svidn\u00edk","Topo\u013e\u010dany","Trebi\u0161ov","Tren\u010d\u00edn","Trnava","Tur\u010dianske Teplice","Tvrdo\u0161\u00edn","Ve\u013ek\u00fd Krt\u00ed\u0161","Vranov nad Top\u013eou","\u017darnovica","\u017diar nad Hronom","\u017dilina","Zlat\u00e9 Moravce","Zvolen"],"city":["#{city_name}"],"street":["Ad\u00e1miho","Ahoj","Alb\u00edna Brunovsk\u00e9ho","Albrechtova","Alejov\u00e1","Ale\u0161ova","Alibernetov\u00e1","Al\u017ebet\u00ednska","Al\u017ebety Gwerkovej","Ambroseho","Ambru\u0161ova","Americk\u00e1","Americk\u00e9 n\u00e1mestie","Americk\u00e9 n\u00e1mestie","Andreja Mr\u00e1za","Andreja Pl\u00e1vku","Andrusovova","Anensk\u00e1","Anensk\u00e1","Antolsk\u00e1","Astronomick\u00e1","Astrov\u00e1","Azalkov\u00e1","Azovsk\u00e1","Babu\u0161kova","Bachova","Bajkalsk\u00e1","Bajkalsk\u00e1","Bajkalsk\u00e1","Bajkalsk\u00e1","Bajkalsk\u00e1","Bajkalsk\u00e1","Bajzova","Banc\u00edkovej","Ban\u00edcka","Ban\u00edkova","Banskobystrick\u00e1","Ban\u0161elova","Bardejovsk\u00e1","Bart\u00f3kova","Barto\u0148ova","Barto\u0161kova","Ba\u0161tov\u00e1","Bazov\u00e1","Ba\u017eantia","Beblav\u00e9ho","Beckovsk\u00e1","Bed\u013eov\u00e1","Bel\u00e1nikov\u00e1","Belehradsk\u00e1","Belinsk\u00e9ho","Belopotock\u00e9ho","Be\u0148adick\u00e1","Benc\u00farova","Benediktiho","Beniakova","Bernol\u00e1kova","Beskydsk\u00e1","Betliarska","Bezru\u010dova","Biela","Bielkova","Bj\u00f6rnsonova","Blagoevova","Blatnick\u00e1","Blument\u00e1lska","Blysk\u00e1\u010dov\u00e1","Bo\u010dn\u00e1","Bohrova","Boh\u00fa\u0148ova","Bojnick\u00e1","Borod\u00e1\u010dova","Borsk\u00e1","Bos\u00e1kova","Botanick\u00e1","Bottova","Bo\u017eeny N\u011bmcovej","B\u00f4rik","Brad\u00e1\u010dova","Bradlianska","Bran\u010dsk\u00e1","Bratsk\u00e1","Brestov\u00e1","Brezovsk\u00e1","Brie\u017eky","Brnianska","Brodn\u00e1","Brodsk\u00e1","Brosky\u0148ov\u00e1","B\u0159eclavsk\u00e1","Budat\u00ednska","Budat\u00ednska","Budat\u00ednska","B\u00fadkova  cesta","Budovate\u013esk\u00e1","Budy\u0161\u00ednska","Budy\u0161\u00ednska","Bukov\u00e1","Bukure\u0161tsk\u00e1","Bulharsk\u00e1","Bul\u00edkova","Bystr\u00e9ho","Bzov\u00edcka","Cablkova","Cesta na \u010cerven\u00fd most","Cesta na \u010cerven\u00fd most","Cesta na Senec","Cikkerova","Cintor\u00ednska","Cintulova","Cukrov\u00e1","Cyrilova","\u010cajakova","\u010cajkovsk\u00e9ho","\u010caklovsk\u00e1","\u010calovsk\u00e1","\u010capajevova","\u010capkova","\u010c\u00e1rskeho","\u010cavojsk\u00e9ho","\u010ce\u010dinov\u00e1","\u010celakovsk\u00e9ho","\u010cere\u0161\u0148ov\u00e1","\u010cerny\u0161evsk\u00e9ho","\u010cerve\u0148ova","\u010cesk\u00e1","\u010ceskoslovensk\u00fdch par","\u010cipk\u00e1rska","\u010cmel\u00edkova","\u010cme\u013eovec","\u010culenova","Daliborovo n\u00e1mestie","Dankovsk\u00e9ho","Dargovsk\u00e1","\u010eatelinov\u00e1","Daxnerovo n\u00e1mestie","Dev\u00ednska cesta","Dlh\u00e9 diely I.","Dlh\u00e9 diely II.","Dlh\u00e9 diely III.","Dobrovi\u010dova","Dobrovi\u010dova","Dobrovsk\u00e9ho","Dob\u0161insk\u00e9ho","Dohnalova","Dohn\u00e1nyho","Dole\u017ealova","Doln\u00e1","Dolnozemsk\u00e1 cesta","Domk\u00e1rska","Domov\u00e9 role","Donnerova","Donovalova","Dostojevsk\u00e9ho rad","Dr. Vladim\u00edra Clemen","Dreven\u00e1","Drie\u0148ov\u00e1","Drie\u0148ov\u00e1","Drie\u0148ov\u00e1","Drot\u00e1rska cesta","Drot\u00e1rska cesta","Drot\u00e1rska cesta","Dru\u017eicov\u00e1","Dru\u017estevn\u00e1","Dubnick\u00e1","Dubov\u00e1","D\u00fabravsk\u00e1 cesta","Dudova","Dulovo n\u00e1mestie","Dulovo n\u00e1mestie","Dunajsk\u00e1","Dvo\u0159\u00e1kovo n\u00e1bre\u017eie","Edisonova","Einsteinova","Elektr\u00e1rensk\u00e1","Exn\u00e1rova","F. Kostku","Fadruszova","Fajnorovo n\u00e1bre\u017eie","F\u00e1ndlyho","Farebn\u00e1","Farsk\u00e1","Farsk\u00e9ho","Fazu\u013eov\u00e1","Fedinova","Ferien\u010d\u00edkova","Fialkov\u00e9 \u00fadolie","Fibichova","Fili\u00e1lne n\u00e1dra\u017eie","Fl\u00f6glova","Flori\u00e1nske n\u00e1mestie","Fra\u0148a Kr\u00e1\u013ea","Francisciho","Franc\u00fazskych partiz\u00e1","Franti\u0161k\u00e1nska","Franti\u0161k\u00e1nske n\u00e1mest","Furdekova","Furdekova","Gab\u010d\u00edkova","Gagarinova","Gagarinova","Gagarinova","Gajova","Galaktick\u00e1","Galandova","Gallova","Galvaniho","Ga\u0161par\u00edkova","Ga\u0161tanov\u00e1","Gavlovi\u010dova","Gemersk\u00e1","Gercenova","Gessayova","Gettingov\u00e1","Godrova","Gogo\u013eova","Gol\u00e1\u0148ova","Gondova","Goralsk\u00e1","Gorazdova","Gork\u00e9ho","Gregorovej","Gr\u00f6sslingova","Gruz\u00ednska","Gunduli\u010dova","Gusevova","Haanova","Habursk\u00e1","Hala\u0161ova","H\u00e1lkova","H\u00e1lova","Hamuliakova","Han\u00e1cka","Handlovsk\u00e1","Hany Meli\u010dkovej","Harmaneck\u00e1","Hasi\u010dsk\u00e1","Hattalova","Havl\u00ed\u010dkova","Havrania","Haydnova","Herlianska","Herlianska","Heydukova","Hlav\u00e1\u010dikova","Hlavat\u00e9ho","Hlavn\u00e9 n\u00e1mestie","Hlbok\u00e1 cesta","Hlbok\u00e1 cesta","Hlivov\u00e1","Hlu\u010d\u00ednska","Hod\u00e1lova","Hod\u017eovo n\u00e1mestie","Holekova","Hol\u00ed\u010dska","Holl\u00e9ho","Holubyho","Hontianska","Hor\u00e1rska","Horn\u00e9 \u017didiny","Horsk\u00e1","Horsk\u00e1","Hrad","Hradn\u00e9 \u00fadolie","Hrachov\u00e1","Hrani\u010dn\u00e1","Hrebendova","Hr\u00edbov\u00e1","Hri\u0148ovsk\u00e1","Hrob\u00e1kova","Hrob\u00e1rska","Hrobo\u0148ova","Hudecova","Humensk\u00e9 n\u00e1mestie","Hummelova","Hurbanovo n\u00e1mestie","Hurbanovo n\u00e1mestie","Hviezdoslavovo n\u00e1mes","H\u00fdro\u0161ova","Chalupkova","Chemick\u00e1","Chlumeck\u00e9ho","Chorv\u00e1tska","Chorv\u00e1tska","I\u013eju\u0161inova","Ilkovi\u010dova","Inoveck\u00e1","Inoveck\u00e1","Iskern\u00edkov\u00e1","Ivana Horv\u00e1tha","Iv\u00e1nska cesta","J.C.Hronsk\u00e9ho","Jablo\u0148ov\u00e1","Jadrov\u00e1","Jakabova","Jakubovo n\u00e1mestie","Jamnick\u00e9ho","J\u00e1na Stanislava","Jan\u00e1\u010dkova","Jan\u010dova","Jan\u00edkove role","Jankolova","J\u00e1no\u0161\u00edkova","J\u00e1no\u0161kova","Janotova","J\u00e1nska","Jant\u00e1rov\u00e1 cesta","Jarabinkov\u00e1","Jarn\u00e1","Jaroslavova","Jaro\u0161ova","Jase\u0148ov\u00e1","Jasn\u00e1","Jasovsk\u00e1","Jastrabia","Ja\u0161\u00edkova","Javorinsk\u00e1","Javorov\u00e1","Jazdeck\u00e1","Jedl\u00edkova","J\u00e9g\u00e9ho","Jela\u010di\u010dova","Jelenia","Jesenn\u00e1","Jesensk\u00e9ho","Jir\u00e1skova","Jiskrova","Jozefsk\u00e1","Jun\u00e1cka","Jungmannova","Jurigovo n\u00e1mestie","Jurovsk\u00e9ho","Jursk\u00e1","Justi\u010dn\u00e1","K lomu","K \u017deleznej studienke","Kalin\u010diakova","Kamen\u00e1rska","Kamenn\u00e9 n\u00e1mestie","Kapicova","Kapitulsk\u00e1","Kapitulsk\u00fd dvor","Kapuc\u00ednska","Kapu\u0161ianska","Karad\u017ei\u010dova","Karad\u017ei\u010dova","Karad\u017ei\u010dova","Karad\u017ei\u010dova","Karlovesk\u00e1","Karlovesk\u00e9 rameno","Karpatsk\u00e1","Ka\u0161m\u00edrska","Ka\u0161tielska","Kaukazsk\u00e1","Kempelenova","Ke\u017emarsk\u00e9 n\u00e1mestie","Kladnianska","Klarisk\u00e1","Kl\u00e1\u0161torsk\u00e1","Klatovsk\u00e1","Klatovsk\u00e1","Klemensova","Klincov\u00e1","Klobu\u010dn\u00edcka","Kloko\u010dova","K\u013eukat\u00e1","Kme\u0165ovo n\u00e1mestie","Koce\u013eova","Ko\u010d\u00e1nkova","Koh\u00fatova","Kol\u00e1rska","Kol\u00edskova","Koll\u00e1rovo n\u00e1mestie","Koll\u00e1rovo n\u00e1mestie","Kolm\u00e1","Kom\u00e1r\u0148ansk\u00e1","Kom\u00e1rnick\u00e1","Kom\u00e1rnick\u00e1","Komensk\u00e9ho n\u00e1mestie","Komin\u00e1rska","Komonicov\u00e1","Konopn\u00e1","Konvalinkov\u00e1","Konventn\u00e1","Kopanice","Kop\u010dianska","Kopern\u00edkova","Korabinsk\u00e9ho","Koreni\u010dova","Kostliv\u00e9ho","Kostoln\u00e1","Ko\u0161ick\u00e1","Ko\u0161ick\u00e1","Ko\u0161ick\u00e1","Kov\u00e1\u010dska","Kovorobotn\u00edcka","Kozia","Koziarka","Kozmonautick\u00e1","Krajn\u00e1","Krakovsk\u00e1","Kr\u00e1\u013eovsk\u00e9 \u00fadolie","Krasinsk\u00e9ho","Kraskova","Kr\u00e1sna","Kr\u00e1snohorsk\u00e1","Krasovsk\u00e9ho","Kr\u00e1tka","Kr\u010dm\u00e9ryho","Kremnick\u00e1","Kres\u00e1nkova","Kriv\u00e1","Kri\u017ekova","Kr\u00ed\u017ena","Kr\u00ed\u017ena","Kr\u00ed\u017ena","Kr\u00ed\u017ena","Krmanova","Krompa\u0161sk\u00e1","Krupinsk\u00e1","Krupkova","Kub\u00e1niho","Kub\u00ednska","Kuklovsk\u00e1","Kuku\u010d\u00ednova","Kukuri\u010dn\u00e1","Kul\u00ed\u0161kova","Kult\u00farna","Kupeck\u00e9ho","K\u00fape\u013en\u00e1","Kutl\u00edkova","Kutuzovova","Kuzm\u00e1nyho","Kva\u010dalova","Kvetn\u00e1","K\u00fd\u010dersk\u00e9ho","Kyjevsk\u00e1","Kysuck\u00e1","Laboreck\u00e1","Lackova","Ladislava S\u00e1ru","\u013dadov\u00e1","Lachova","\u013daliov\u00e1","Lama\u010dsk\u00e1 cesta","Lama\u010dsk\u00e1 cesta","Lamansk\u00e9ho","Landererova","Langsfeldova","\u013danov\u00e1","Laskomersk\u00e9ho","Lau\u010dekova","Laurinsk\u00e1","Lazaretsk\u00e1","Lazaretsk\u00e1","Legersk\u00e9ho","Legion\u00e1rska","Legion\u00e1rska","Lehock\u00e9ho","Lehock\u00e9ho","Lenardova","Lermontovova","Lesn\u00e1","Le\u0161kova","Leteck\u00e1","Letisko M.R.\u0160tef\u00e1nik","Letn\u00e1","Lev\u00e1rska","Levick\u00e1","Levo\u010dsk\u00e1","Lidick\u00e1","Lietavsk\u00e1","Lichardova","Lipov\u00e1","Lipovinov\u00e1","Liptovsk\u00e1","Listov\u00e1","L\u00ed\u0161\u010die nivy","L\u00ed\u0161\u010die \u00fadolie","Litovsk\u00e1","Lodn\u00e1","Lombardiniho","Lomonosovova","Lopen\u00edcka","Lovinsk\u00e9ho","\u013dubietovsk\u00e1","\u013dubinsk\u00e1","\u013dub\u013eansk\u00e1","\u013dubochnianska","\u013dubovnianska","L\u00fa\u010dna","\u013dudov\u00e9 n\u00e1mestie","\u013dudov\u00edta Fullu","Luha\u010dovick\u00e1","Lu\u017eick\u00e1","Lu\u017en\u00e1","L\u00fdcejn\u00e1","Lykovcov\u00e1","M. Hella","Magnetov\u00e1","Macharova","Majakovsk\u00e9ho","Majern\u00edkova","M\u00e1jkova","M\u00e1jov\u00e1","Makovick\u00e9ho","Mal\u00e1","Mal\u00e9 p\u00e1lenisko","Malinov\u00e1","Mal\u00fd Dra\u017ediak","Mal\u00fd trh","Mamateyova","Mamateyova","M\u00e1nesovo n\u00e1mestie","Mari\u00e1nska","Marie Curie-Sklodows","M\u00e1rie Medve\u010fovej","Markova","Mar\u00f3tyho","Mart\u00e1kovej","Martin\u010dekova","Martin\u010dekova","Martinengova","Martinsk\u00e1","Mateja Bela","Matejkova","Mati\u010dn\u00e1","Mat\u00fa\u0161ova","Meden\u00e1","Medzierka","Medzilaboreck\u00e1","Merlotov\u00e1","Mesa\u010dn\u00e1","Mestsk\u00e1","Meteorov\u00e1","Metodova","Mickiewiczova","Mierov\u00e1","Michalsk\u00e1","Mikov\u00edniho","Mikul\u00e1\u0161ska","Mileti\u010dova","Mileti\u010dova","Mi\u0161\u00edkova","Mi\u0161\u00edkova","Mi\u0161\u00edkova","Mliek\u00e1rensk\u00e1","Mlynarovi\u010dova","Mlynsk\u00e1 dolina","Mlynsk\u00e1 dolina","Mlynsk\u00e1 dolina","Mlynsk\u00e9 luhy","Mlynsk\u00e9 nivy","Mlynsk\u00e9 nivy","Mlynsk\u00e9 nivy","Mlynsk\u00e9 nivy","Mlynsk\u00e9 nivy","Mlyny","Modransk\u00e1","Mojm\u00edrova","Mokr\u00e1\u0148 z\u00e1hon","Mokroh\u00e1jska cesta","Moldavsk\u00e1","Molecova","Moravsk\u00e1","Moskovsk\u00e1","Most SNP","Mostov\u00e1","Mo\u0161ovsk\u00e9ho","Mot\u00fdlia","Moyzesova","Mozartova","Mraziarensk\u00e1","Mudro\u0148ova","Mudro\u0148ova","Mudro\u0148ova","Muchovo n\u00e1mestie","Murga\u0161ova","Mu\u0161k\u00e1tov\u00e1","Mu\u0161tov\u00e1","M\u00fazejn\u00e1","Myjavsk\u00e1","M\u00fdtna","M\u00fdtna","Na Bar\u00e1nku","Na Brezin\u00e1ch","Na Hrebienku","Na Kalv\u00e1rii","Na Kamp\u00e1rke","Na kopci","Na kri\u017eovatk\u00e1ch","Na l\u00e1noch","Na pa\u0161i","Na piesku","Na Rivi\u00e9re","Na Sitine","Na Slav\u00edne","Na str\u00e1ni","Na \u0160tyridsiatku","Na \u00favrati","Na v\u0155\u0161ku","Na v\u00fdsln\u00ed","N\u00e1b\u011blkova","N\u00e1bre\u017eie arm. gen. L","N\u00e1bre\u017en\u00e1","Nad Dunajom","Nad lomom","Nad l\u00fa\u010dkami","Nad l\u00fa\u010dkami","Nad ostrovom","Nad Siho\u0165ou","N\u00e1mestie 1. m\u00e1ja","N\u00e1mestie Alexandra D","N\u00e1mestie Biely kr\u00ed\u017e","N\u00e1mestie Hrani\u010diarov","N\u00e1mestie J\u00e1na Pavla","N\u00e1mestie \u013dudov\u00edta \u0160t","N\u00e1mestie Martina Ben","N\u00e1m. M.R.\u0160tef\u00e1nika","N\u00e1mestie slobody","N\u00e1mestie slobody","N\u00e1mestie SNP","N\u00e1mestie SNP","N\u00e1mestie sv. Franti\u0161","Narcisov\u00e1","Nedbalova","Nekrasovova","Neronetov\u00e1","Nerudova","Nev\u00e4dzov\u00e1","Nez\u00e1budkov\u00e1","Ni\u0165ov\u00e1","Nitrianska","N\u00ed\u017einn\u00e1","Nobelova","Nobelovo n\u00e1mestie","Nov\u00e1","Nov\u00e1 Ro\u017e\u0148avsk\u00e1","Novack\u00e9ho","Nov\u00e9 p\u00e1lenisko","Nov\u00e9 z\u00e1hrady I","Nov\u00e9 z\u00e1hrady II","Nov\u00e9 z\u00e1hrady III","Nov\u00e9 z\u00e1hrady IV","Nov\u00e9 z\u00e1hrady V","Nov\u00e9 z\u00e1hrady VI","Nov\u00e9 z\u00e1hrady VII","Novin\u00e1rska","Novobansk\u00e1","Novohradsk\u00e1","Novosvetsk\u00e1","Novosvetsk\u00e1","Novosvetsk\u00e1","Obe\u017en\u00e1","Obchodn\u00e1","O\u010dovsk\u00e1","Odboj\u00e1rov","Odbor\u00e1rska","Odbor\u00e1rske n\u00e1mestie","Odbor\u00e1rske n\u00e1mestie","Ohnicov\u00e1","Ok\u00e1nikova","Okru\u017en\u00e1","Olbrachtova","Olejk\u00e1rska","Ondavsk\u00e1","Ondrejovova","Oravsk\u00e1","Orechov\u00e1 cesta","Orechov\u00fd rad","Orie\u0161kov\u00e1","Ormisova","Osadn\u00e1","Ostravsk\u00e1","Ostredkov\u00e1","Osusk\u00e9ho","Osvetov\u00e1","Otonelsk\u00e1","Ovru\u010dsk\u00e1","Ovsi\u0161tsk\u00e9 n\u00e1mestie","Paj\u0161t\u00fanska","Palack\u00e9ho","Pal\u00e1rikova","Pal\u00e1rikova","P\u00e1lavsk\u00e1","Palis\u00e1dy","Palis\u00e1dy","Palis\u00e1dy","Palkovi\u010dova","Panensk\u00e1","Pank\u00fachova","Pan\u00f3nska cesta","Pansk\u00e1","Pap\u00e1nkovo n\u00e1mestie","Papra\u010fov\u00e1","P\u00e1ri\u010dkova","Parkov\u00e1","Partiz\u00e1nska","Pasienky","Paul\u00ednyho","Pavlovi\u010dova","Pavlovova","Pavlovsk\u00e1","Pa\u017eick\u00e9ho","Pa\u017e\u00edtkov\u00e1","Pe\u010dnianska","Perneck\u00e1","Pestovate\u013esk\u00e1","Petersk\u00e1","Petzvalova","Pezinsk\u00e1","Pieso\u010dn\u00e1","Pie\u0161\u0165ansk\u00e1","Pifflova","Pil\u00e1rikova","Pionierska","Pivo\u0148kov\u00e1","Planckova","Plan\u00e9t","Pl\u00e1ten\u00edcka","Pluhov\u00e1","Plyn\u00e1rensk\u00e1","Plzensk\u00e1","Pobre\u017en\u00e1","Pod B\u00f4rikom","Pod Kalv\u00e1riou","Pod lesom","Pod Rovnicami","Pod vinicami","Podhorsk\u00e9ho","Podjavorinskej","Podlu\u010dinsk\u00e9ho","Podnikov\u00e1","Podtatransk\u00e9ho","Pohronsk\u00e1","Pol\u00e1rna","Poloreck\u00e9ho","Po\u013en\u00e1","Po\u013esk\u00e1","Poludn\u00edkov\u00e1","Porubsk\u00e9ho","Po\u0161tov\u00e1","Pova\u017esk\u00e1","Povrazn\u00edcka","Povrazn\u00edcka","Pra\u017esk\u00e1","Predstani\u010dn\u00e9 n\u00e1mesti","Prepo\u0161tsk\u00e1","Pre\u0161ernova","Pre\u0161ovsk\u00e1","Pre\u0161ovsk\u00e1","Pre\u0161ovsk\u00e1","Pri Bielom kr\u00ed\u017ei","Pri dvore","Pri Dynamitke","Pri Hab\u00e1nskom mlyne","Pri hradnej studni","Pri se\u010di","Pri Starej Prach\u00e1rni","Pri Starom h\u00e1ji","Pri Starom M\u00fdte","Pri strelnici","Pri Suchom mlyne","Pri zvonici","Pribinova","Pribinova","Pribinova","Pribi\u0161ova","Pribylinsk\u00e1","Prie\u010dna","Priekopy","Priemyseln\u00e1","Priemyseln\u00e1","Prievozsk\u00e1","Prievozsk\u00e1","Prievozsk\u00e1","Pr\u00edkopova","Primaci\u00e1lne n\u00e1mestie","Pr\u00edstav","Pr\u00edstavn\u00e1","Prokofievova","Prokopa Ve\u013ek\u00e9ho","Prokopova","Pr\u00fadov\u00e1","Prvosienkov\u00e1","P\u00fapavov\u00e1","Pust\u00e1","Pu\u0161kinova","Ra\u010dianska","Ra\u010dianska","Ra\u010dianske m\u00fdto","Radarov\u00e1","R\u00e1diov\u00e1","Radlinsk\u00e9ho","Radni\u010dn\u00e1","Radni\u010dn\u00e9 n\u00e1mestie","Radvansk\u00e1","Rajsk\u00e1","Raketov\u00e1","R\u00e1kosov\u00e1","Rastislavova","R\u00e1zusovo n\u00e1bre\u017eie","Repn\u00e1","Re\u0161etkova","Revolu\u010dn\u00e1","R\u00e9vov\u00e1","Rev\u00facka","Rezedov\u00e1","Riazansk\u00e1","Riazansk\u00e1","Ribayov\u00e1","Rie\u010dna","Rigeleho","R\u00edzlingov\u00e1","Riznerova","Robotn\u00edcka","Romanova","R\u00f6ntgenova","Rosn\u00e1","Rovn\u00e1","Rovniankova","Rovn\u00edkov\u00e1","Rozmar\u00ednov\u00e1","Ro\u017e\u0148avsk\u00e1","Ro\u017e\u0148avsk\u00e1","Ro\u017e\u0148avsk\u00e1","Rubinsteinova","Rudnayovo n\u00e1mestie","Ruman\u010dekov\u00e1","Rusovsk\u00e1 cesta","Ru\u017ei\u010dkov\u00e1","Ru\u017einovsk\u00e1","Ru\u017einovsk\u00e1","Ru\u017einovsk\u00e1","Ru\u017eombersk\u00e1","Ru\u017eov\u00e1 dolina","Ru\u017eov\u00e1 dolina","Ryb\u00e1rska br\u00e1na","Rybn\u00e9 n\u00e1mestie","R\u00fddzikov\u00e1","Sabinovsk\u00e1","Sabinovsk\u00e1","Sad Janka Kr\u00e1\u013ea","Sadov\u00e1","Sartorisova","Sasinkova","Seber\u00edniho","Se\u010dovsk\u00e1","Sedl\u00e1rska","Sedmokr\u00e1skov\u00e1","Segnerova","Sekulsk\u00e1","Semianova","Senick\u00e1","Senn\u00e1","Schillerova","Schody pri starej vo","Sib\u00edrska","Sienkiewiczova","Silv\u00e1nska","Sinokvetn\u00e1","Skalick\u00e1 cesta","Skaln\u00e1","Sklen\u00e1rova","Sklen\u00e1rska","Sl\u00e1dkovi\u010dova","Sladov\u00e1","Sl\u00e1vi\u010die \u00fadolie","Slav\u00edn","Slep\u00e1","Slia\u010dska","Sliezska","Slivkov\u00e1","Slne\u010dn\u00e1","Slovansk\u00e1","Slovinsk\u00e1","Slovnaftsk\u00e1","Slowack\u00e9ho","Smetanova","Smikova","Smolenick\u00e1","Smoln\u00edcka","Smre\u010dianska","Soferove schody","Soch\u00e1\u0148ova","Sokolsk\u00e1","Solivarsk\u00e1","Solo\u0161nick\u00e1","Somolick\u00e9ho","Somolick\u00e9ho","Sosnov\u00e1","Spi\u0161sk\u00e1","Spojn\u00e1","Spolo\u010densk\u00e1","Sputnikov\u00e1","Sreznevsk\u00e9ho","Srn\u010dia","Stachanovsk\u00e1","St\u00e1licov\u00e1","Stani\u010dn\u00e1","Star\u00e1 \u010cernicov\u00e1","Star\u00e1 Iv\u00e1nska cesta","Star\u00e1 Prievozsk\u00e1","Star\u00e1 Vajnorsk\u00e1","Star\u00e1 vin\u00e1rska","Star\u00e9 Grunty","Star\u00e9 ihrisko","Star\u00e9 z\u00e1hrady","Starhradsk\u00e1","Staroh\u00e1jska","Staromestsk\u00e1","Starotursk\u00fd chodn\u00edk","Stavite\u013esk\u00e1","Stodolova","Stoklasov\u00e1","Strakova","Str\u00e1\u017enick\u00e1","Str\u00e1\u017eny dom","Stre\u010dnianska","Stredn\u00e1","Streleck\u00e1","Strm\u00e1 cesta","Strojn\u00edcka","Stropkovsk\u00e1","Strukov\u00e1","Studen\u00e1","Stuhov\u00e1","S\u00fabe\u017en\u00e1","S\u00fahvezdn\u00e1","Such\u00e9 m\u00fdto","Suchohradsk\u00e1","S\u00fakenn\u00edcka","S\u00fa\u013eovsk\u00e1","Sumbalova","S\u00famra\u010dn\u00e1","S\u00fa\u0165a\u017en\u00e1","Sv\u00e4t\u00e9ho Vincenta","Sv\u00e4toplukova","Sv\u00e4toplukova","Sv\u00e4tovojte\u0161sk\u00e1","Svetl\u00e1","Sv\u00edbov\u00e1","Svidn\u00edcka","Svoradova","Svr\u010dia","Syslia","\u0160af\u00e1rikovo n\u00e1mestie","\u0160af\u00e1rikovo n\u00e1mestie","\u0160afr\u00e1nov\u00e1","\u0160ag\u00e1tova","\u0160alviov\u00e1","\u0160ancov\u00e1","\u0160ancov\u00e1","\u0160ancov\u00e1","\u0160ancov\u00e1","\u0160\u00e1ndorova","\u0160ari\u0161sk\u00e1","\u0160\u00e1\u0161ovsk\u00e1","\u0160a\u0161t\u00ednska","\u0160ev\u010denkova","\u0160intavsk\u00e1","\u0160\u00edpkov\u00e1","\u0160karniclova","\u0160kolsk\u00e1","\u0160kovr\u00e1n\u010dia","\u0160kult\u00e9tyho","\u0160olt\u00e9sovej","\u0160pieszova","\u0160pit\u00e1lska","\u0160portov\u00e1","\u0160rob\u00e1rovo n\u00e1mestie","\u0160\u0165astn\u00e1","\u0160tedr\u00e1","\u0160tef\u00e1nikova","\u0160tef\u00e1nikova","\u0160tef\u00e1nikova","\u0160tefanovi\u010dova","\u0160tefunkova","\u0160tetinova","\u0160tiavnick\u00e1","\u0160t\u00farova","\u0160tyndlova","\u0160ulekova","\u0160ulekova","\u0160ulekova","\u0160umavsk\u00e1","\u0160u\u0148avcova","\u0160ustekova","\u0160vabinsk\u00e9ho","Tabakov\u00e1","Tablicova","T\u00e1borsk\u00e1","Tajovsk\u00e9ho","Tallerova","Teheln\u00e1","Technick\u00e1","Tekovsk\u00e1","Telocvi\u010dn\u00e1","Temat\u00ednska","Teplick\u00e1","Terchovsk\u00e1","Teslova","Tetmayerova","Thurzova","Tich\u00e1","Tilgnerova","Timravina","Tobruck\u00e1","Tokaj\u00edcka","Tolst\u00e9ho","Tom\u00e1nkova","Tom\u00e1\u0161ikova","Tom\u00e1\u0161ikova","Tom\u00e1\u0161ikova","Tom\u00e1\u0161ikova","Tom\u00e1\u0161ikova","Topo\u013e\u010dianska","Topo\u013eov\u00e1","Tov\u00e1rensk\u00e1","Trebi\u0161ovsk\u00e1","Trebi\u0161ovsk\u00e1","Trebi\u0161ovsk\u00e1","Tren\u010dianska","Tresko\u0148ova","Trnavsk\u00e1 cesta","Trnavsk\u00e1 cesta","Trnavsk\u00e1 cesta","Trnavsk\u00e1 cesta","Trnavsk\u00e1 cesta","Trnavsk\u00e9 m\u00fdto","T\u0155\u0148ov\u00e1","Trojdomy","Tu\u010dkova","Tupolevova","Turb\u00ednova","Tur\u010dianska","Turnianska","Tvaro\u017ekova","Tylova","Tyr\u0161ovo n\u00e1bre\u017eie","\u00dadern\u00edcka","\u00dadoln\u00e1","Uhorkov\u00e1","Ukrajinsk\u00e1","Ulica 29. augusta","Ulica 29. augusta","Ulica 29. augusta","Ulica 29. augusta","Ulica Imricha Karva\u0161","Ulica Jozefa Kr\u00f3nera","Ulica Viktora Tegelh","\u00daprkova","\u00daradn\u00edcka","Ur\u00e1nov\u00e1","Urb\u00e1nkova","Urs\u00ednyho","Ur\u0161ul\u00ednska","\u00dazka","V z\u00e1hrad\u00e1ch","Vajansk\u00e9ho n\u00e1bre\u017eie","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vajnorsk\u00e1","Vala\u0161sk\u00e1","Valch\u00e1rska","Vansovej","V\u00e1penn\u00e1","Var\u00ednska","Var\u0161avsk\u00e1","Var\u0161avsk\u00e1","Vavilovova","Vavr\u00ednova","Vazovova","V\u010del\u00e1rska","Velehradsk\u00e1","Veltl\u00ednska","Vent\u00farska","Vetern\u00e1","Veternicov\u00e1","Vetvov\u00e1","Viedensk\u00e1 cesta","Viedensk\u00e1 cesta","Vietnamsk\u00e1","V\u00edg\u013ea\u0161sk\u00e1","Vihorlatsk\u00e1","Viktor\u00ednova","Vilov\u00e1","Vincenta Hlo\u017en\u00edka","V\u00ednna","Vlasteneck\u00e9 n\u00e1mestie","Vl\u010dkova","Vl\u010dkova","Vl\u010dkova","Vodn\u00fd vrch","Votrubova","Vr\u00e1be\u013esk\u00e1","Vrakunsk\u00e1 cesta","Vranovsk\u00e1","Vretenov\u00e1","Vrchn\u00e1","Vr\u00fatock\u00e1","Vyhliadka","Vyhnianska cesta","Vysok\u00e1","Vy\u0161ehradsk\u00e1","Vy\u0161n\u00e1","Wattova","Wilsonova","Wolkrova","Za Kas\u00e1r\u0148ou","Za sokolov\u0148ou","Za Stanicou","Za tehel\u0148ou","Z\u00e1borsk\u00e9ho","Zadunajsk\u00e1 cesta","Z\u00e1hor\u00e1cka","Z\u00e1hradn\u00edcka","Z\u00e1hradn\u00edcka","Z\u00e1hradn\u00edcka","Z\u00e1hradn\u00edcka","Z\u00e1hrebsk\u00e1","Z\u00e1hrebsk\u00e1","Z\u00e1lu\u017eick\u00e1","Z\u00e1mock\u00e1","Z\u00e1mock\u00e9 schody","Z\u00e1mo\u010dn\u00edcka","Z\u00e1padn\u00e1","Z\u00e1padn\u00fd rad","Z\u00e1poro\u017esk\u00e1","Z\u00e1ti\u0161ie","Z\u00e1vodn\u00edkova","Zelen\u00e1","Zelin\u00e1rska","Zimn\u00e1","Zlat\u00e9 piesky","Zlat\u00e9 schody","Znievska","Zohorsk\u00e1","Zochova","Zrinsk\u00e9ho","Zvolensk\u00e1","\u017dab\u00ed majer","\u017dabotova","\u017dehrianska","\u017delezn\u00e1","\u017delezni\u010diarska","\u017dellova","\u017diarska","\u017didovsk\u00e1","\u017dilinsk\u00e1","\u017dilinsk\u00e1","\u017divnostensk\u00e1","\u017di\u017ekova","\u017dupn\u00e9 n\u00e1mestie"],"street_name":["#{street}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Slovensko"]},"company":{"suffix":["s.r.o.","a.s.","v.o.s."],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","asymmetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name} #{suffix}","#{Name.man_last_name} a #{Name.man_last_name} #{suffix}"]},"internet":{"free_email":["gmail.com","zoznam.sk","azet.sk"],"domain_suffix":["sk","com","net","eu","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"man_first_name":["Drahoslav","Sever\u00edn","Alexej","Ernest","Rastislav","Radovan","Dobroslav","Dalibor","Vincent","Milo\u0161","Timotej","Gejza","Bohu\u0161","Alfonz","Ga\u0161par","Emil","Erik","Bla\u017eej","Zdenko","Dezider","Arp\u00e1d","Valent\u00edn","Pravoslav","Jarom\u00edr","Roman","Matej","Frederik","Viktor","Alexander","Radom\u00edr","Alb\u00edn","Bohumil","Kazim\u00edr","Fridrich","Radoslav","Tom\u00e1\u0161","Alan","Branislav","Bruno","Gregor","Vlastimil","Boleslav","Eduard","Jozef","V\u00ed\u0165azoslav","Blahoslav","Be\u0148adik","Adri\u00e1n","Gabriel","Mari\u00e1n","Emanuel","Miroslav","Benjam\u00edn","Hugo","Richard","Izidor","Zolt\u00e1n","Albert","Igor","J\u00falius","Ale\u0161","Fedor","Rudolf","Val\u00e9r","Marcel","Erv\u00edn","Slavom\u00edr","Vojtech","Juraj","Marek","Jaroslav","\u017digmund","Flori\u00e1n","Roland","Pankr\u00e1c","Serv\u00e1c","Bonif\u00e1c","Svetoz\u00e1r","Bernard","J\u00falia","Urban","Du\u0161an","Viliam","Ferdinand","Norbert","R\u00f3bert","Medard","Zlatko","Anton","Vasil","V\u00edt","Adolf","Vratislav","Alfr\u00e9d","Alojz","J\u00e1n","Tade\u00e1\u0161","Ladislav","Peter","Pavol","Miloslav","Prokop","Cyril","Metod","Patrik","Oliver","Ivan","Kamil","Henrich","Drahom\u00edr","Bohuslav","I\u013eja","Daniel","Vladim\u00edr","Jakub","Kri\u0161tof","Ign\u00e1c","Gust\u00e1v","Jergu\u0161","Dominik","Oskar","Vavrinec","\u013dubom\u00edr","Mojm\u00edr","Leonard","Tichom\u00edr","Filip","Bartolomej","\u013dudov\u00edt","Samuel","August\u00edn","Belo","Oleg","Bystr\u00edk","Ctibor","\u013dudomil","Kon\u0161tant\u00edn","\u013duboslav","Mat\u00fa\u0161","M\u00f3ric","\u013dubo\u0161","\u013dubor","Vladislav","Cypri\u00e1n","V\u00e1clav","Michal","Jarol\u00edm","Arnold","Levoslav","Franti\u0161ek","Dion\u00fdz","Maximili\u00e1n","Koloman","Boris","Luk\u00e1\u0161","Kristi\u00e1n","Vendel\u00edn","Sergej","Aurel","Demeter","Denis","Hubert","Karol","Imrich","Ren\u00e9","Bohum\u00edr","Teodor","Tibor","Maro\u0161","Martin","Sv\u00e4topluk","Stanislav","Leopold","Eugen","F\u00e9lix","Klement","Kornel","Milan","Vratko","Ondrej","Andrej","Edmund","Oldrich","Oto","Mikul\u00e1\u0161","Ambr\u00f3z","Rad\u00faz","Bohdan","Adam","\u0160tefan","D\u00e1vid","Silvester"],"woman_first_name":["Alexandra","Karina","Daniela","Andrea","Ant\u00f3nia","Bohuslava","D\u00e1\u0161a","Malv\u00edna","Krist\u00edna","Nata\u0161a","Bohdana","Drahom\u00edra","S\u00e1ra","Zora","Tamara","Ema","Tatiana","Erika","Veronika","Ag\u00e1ta","Dorota","Vanda","Zoja","Gabriela","Perla","Ida","Liana","Miloslava","Vlasta","L\u00edvia","Eleon\u00f3ra","Etela","Romana","Zlatica","Ane\u017eka","Bohumila","Franti\u0161ka","Angela","Matilda","Svetlana","\u013dubica","Alena","So\u0148a","Vieroslava","Zita","Miroslava","Irena","Milena","Estera","Just\u00edna","Dana","Danica","Jela","Jaroslava","Jarmila","Lea","Anast\u00e1zia","Galina","Lesana","Herm\u00edna","Monika","Ingrida","Vikt\u00f3ria","Bla\u017eena","\u017dofia","Sofia","Gizela","Viola","Gertr\u00fada","Zina","J\u00falia","Juliana","\u017delm\u00edra","Ela","Vanesa","Iveta","Vilma","Petronela","\u017daneta","X\u00e9nia","Karol\u00edna","Lenka","Laura","Stanislava","Margar\u00e9ta","Dobroslava","Blanka","Val\u00e9ria","Paul\u00edna","Sid\u00f3nia","Adri\u00e1na","Be\u00e1ta","Petra","Mel\u00e1nia","Diana","Berta","Patr\u00edcia","Lujza","Am\u00e1lia","Milota","Nina","Margita","Kamila","Du\u0161ana","Magdal\u00e9na","O\u013ega","Anna","Hana","Bo\u017eena","Marta","Libu\u0161a","Bo\u017eidara","Dominika","Hortenzia","Jozef\u00edna","\u0160tef\u00e1nia","\u013dubom\u00edra","Zuzana","Darina","Marcela","Milica","Elena","Helena","L\u00fddia","Anabela","Jana","Silvia","Nikola","Ru\u017eena","Nora","Drahoslava","Linda","Melinda","Rebeka","Roz\u00e1lia","Reg\u00edna","Alica","Marianna","Miriama","Martina","M\u00e1ria","Jolana","\u013dudomila","\u013dudmila","Olympia","Eug\u00e9nia","\u013duboslava","Zdenka","Edita","Michaela","Stela","Viera","Nat\u00e1lia","Eli\u0161ka","Brigita","Valent\u00edna","Ter\u00e9zia","Vladim\u00edra","Hedviga","Ur\u0161u\u013ea","Alojza","Kvetoslava","Sab\u00edna","Dobromila","Kl\u00e1ra","Simona","Aur\u00e9lia","Denisa","Ren\u00e1ta","Irma","Agnesa","Klaudia","Al\u017ebeta","Elv\u00edra","Cec\u00edlia","Em\u00edlia","Katar\u00edna","Henrieta","Bibi\u00e1na","Barbora","Mar\u00edna","Izabela","Hilda","Ot\u00edlia","Lucia","Branislava","Bronislava","Ivica","Alb\u00edna","Korn\u00e9lia","Sl\u00e1va","Sl\u00e1vka","Judita","Dagmara","Adela","Nade\u017eda","Eva","Filom\u00e9na","Ivana","Milada"],"man_last_name":["Antal","Babka","Bahna","Bahno","Bal\u00e1\u017e","Baran","Baranka","Bartovi\u010d","Barto\u0161","Ba\u010da","Bernol\u00e1k","Be\u0148o","Bicek","Bielik","Blaho","Bondra","Bos\u00e1k","Bo\u0161ka","Brezina","Bukovsk\u00fd","Chalupka","Chud\u00edk","Cibula","Cibulka","Cibu\u013ea","Cyprich","C\u00edger","Danko","Da\u0148ko","Da\u0148o","Debn\u00e1r","Dej","Dek\u00fd\u0161","Dole\u017eal","Do\u010dolomansk\u00fd","Droppa","Dubovsk\u00fd","Dudek","Dula","Dulla","Dus\u00edk","Dvon\u010d","Dzurjanin","D\u00e1vid","Fabian","Fabi\u00e1n","Fajnor","Farka\u0161ovsk\u00fd","Fico","Filc","Filip","Finka","Ftorek","Ga\u0161par","Ga\u0161parovi\u010d","Gocn\u00edk","Gregor","Gregu\u0161","Grzn\u00e1r","Habl\u00e1k","Hab\u0161uda","Halda","Halu\u0161ka","Hal\u00e1k","Hanko","Hanzal","Ha\u0161\u010d\u00e1k","Heretik","He\u010dko","Hlav\u00e1\u010dek","Hlinka","Holub","Holuby","Hossa","Hoza","Hra\u0161ko","Hric","Hrmo","Hru\u0161ovsk\u00fd","Huba","Ihna\u010d\u00e1k","Jane\u010dek","Jano\u0161ka","Janto\u0161ovi\u010d","Jan\u00edk","Jan\u010dek","Jed\u013eovsk\u00fd","Jendek","Jonata","Jurina","Jurkovi\u010d","Jur\u00edk","J\u00e1no\u0161\u00edk","Kafenda","Kalisk\u00fd","Karul","Ken\u00ed\u017e","Klapka","Kme\u0165","Koles\u00e1r","Koll\u00e1r","Kolnik","Koln\u00edk","Kol\u00e1r","Korec","Kostka","Kostrec","Kov\u00e1\u010d","Kov\u00e1\u010dik","Koza","Ko\u010di\u0161","Kraj\u00ed\u010dek","Kraj\u010di","Kraj\u010do","Kraj\u010dovi\u010d","Kraj\u010d\u00edr","Kr\u00e1lik","Kr\u00fapa","Kub\u00edk","Kyse\u013e","K\u00e1llay","Labuda","Lep\u0161\u00edk","Lipt\u00e1k","Lisick\u00fd","Lubina","Luk\u00e1\u010d","Lupt\u00e1k","L\u00ed\u0161ka","Madej","Majesk\u00fd","Malachovsk\u00fd","Mal\u00ed\u0161ek","Mamojka","Marcinko","Mari\u00e1n","Masaryk","Maslo","Matia\u0161ko","Medve\u010f","Melcer","Me\u010diar","Michal\u00edk","Mihalik","Mih\u00e1l","Mih\u00e1lik","Miklo\u0161ko","Mikul\u00edk","Miku\u0161","Mik\u00fa\u0161","Milota","Min\u00e1\u010d","Mi\u0161\u00edk","Moj\u017ei\u0161","Mokro\u0161","Mora","Morav\u010d\u00edk","Mydlo","Nemec","Nitra","Nov\u00e1k","Ob\u0161ut","Ondru\u0161","Ot\u010den\u00e1\u0161","Pauko","Pavlikovsk\u00fd","Pav\u00fak","Pa\u0161ek","Pa\u0161ka","Pa\u0161ko","Pelik\u00e1n","Petrovick\u00fd","Petru\u0161ka","Pe\u0161ko","Plch","Plekanec","Podhradsk\u00fd","Podkonick\u00fd","Poliak","Pup\u00e1k","Rak","Repisk\u00fd","Roman\u010d\u00edk","Rus","Ru\u017ei\u010dka","Rybn\u00ed\u010dek","Ryb\u00e1r","Ryb\u00e1rik","Samson","Sedliak","Senko","Sklenka","Skokan","Skuteck\u00fd","Sla\u0161\u0165an","Sloboda","Slobodn\u00edk","Slota","Slov\u00e1k","Smrek","Stodola","Straka","Strnisko","Svrb\u00edk","S\u00e1mel","S\u00fdkora","Tatar","Tatarka","Tat\u00e1r","Tat\u00e1rka","Thomka","Tome\u010dek","Tomka","Tomko","Truben","Tur\u010dok","Uram","Urbl\u00edk","Vajc\u00edk","Vajda","Valach","Valachovi\u010d","Valent","Valu\u0161ka","Vanek","Vesel","Vicen","Vi\u0161\u0148ovsk\u00fd","Vlach","Vojtek","Vydaren\u00fd","Zajac","Zima","Zimka","Z\u00e1borsk\u00fd","Z\u00fabrik","\u010capkovi\u010d","\u010caplovi\u010d","\u010carnogursk\u00fd","\u010cierny","\u010cobrda","\u010ea\u010fo","\u010eurica","\u010euri\u0161","\u0160idlo","\u0160imonovi\u010d","\u0160kriniar","\u0160kult\u00e9ty","\u0160majda","\u0160olt\u00e9s","\u0160olt\u00fds","\u0160tefan","\u0160tefanka","\u0160ulc","\u0160urka","\u0160vehla","\u0160\u0165astn\u00fd"],"woman_last_name":["Antalov\u00e1","Babkov\u00e1","Bahnov\u00e1","Bal\u00e1\u017eov\u00e1","Baranov\u00e1","Barankov\u00e1","Bartovi\u010dov\u00e1","Barto\u0161ov\u00e1","Ba\u010dov\u00e1","Bernol\u00e1kov\u00e1","Be\u0148ov\u00e1","Bicekov\u00e1","Bielikov\u00e1","Blahov\u00e1","Bondrov\u00e1","Bos\u00e1kov\u00e1","Bo\u0161kov\u00e1","Brezinov\u00e1","Bukovsk\u00e1","Chalupkov\u00e1","Chud\u00edkov\u00e1","Cibulov\u00e1","Cibulkov\u00e1","Cyprichov\u00e1","C\u00edgerov\u00e1","Dankov\u00e1","Da\u0148kov\u00e1","Da\u0148ov\u00e1","Debn\u00e1rov\u00e1","Dejov\u00e1","Dek\u00fd\u0161ov\u00e1","Dole\u017ealov\u00e1","Do\u010dolomansk\u00e1","Droppov\u00e1","Dubovsk\u00e1","Dudekov\u00e1","Dulov\u00e1","Dullov\u00e1","Dus\u00edkov\u00e1","Dvon\u010dov\u00e1","Dzurjaninov\u00e1","D\u00e1vidov\u00e1","Fabianov\u00e1","Fabi\u00e1nov\u00e1","Fajnorov\u00e1","Farka\u0161ovsk\u00e1","Ficov\u00e1","Filcov\u00e1","Filipov\u00e1","Finkov\u00e1","Ftorekov\u00e1","Ga\u0161parov\u00e1","Ga\u0161parovi\u010dov\u00e1","Gocn\u00edkov\u00e1","Gregorov\u00e1","Gregu\u0161ov\u00e1","Grzn\u00e1rov\u00e1","Habl\u00e1kov\u00e1","Hab\u0161udov\u00e1","Haldov\u00e1","Halu\u0161kov\u00e1","Hal\u00e1kov\u00e1","Hankov\u00e1","Hanzalov\u00e1","Ha\u0161\u010d\u00e1kov\u00e1","Heretikov\u00e1","He\u010dkov\u00e1","Hlav\u00e1\u010dekov\u00e1","Hlinkov\u00e1","Holubov\u00e1","Holubyov\u00e1","Hossov\u00e1","Hozov\u00e1","Hra\u0161kov\u00e1","Hricov\u00e1","Hrmov\u00e1","Hru\u0161ovsk\u00e1","Hubov\u00e1","Ihna\u010d\u00e1kov\u00e1","Jane\u010dekov\u00e1","Jano\u0161kov\u00e1","Janto\u0161ovi\u010dov\u00e1","Jan\u00edkov\u00e1","Jan\u010dekov\u00e1","Jed\u013eovsk\u00e1","Jendekov\u00e1","Jonatov\u00e1","Jurinov\u00e1","Jurkovi\u010dov\u00e1","Jur\u00edkov\u00e1","J\u00e1no\u0161\u00edkov\u00e1","Kafendov\u00e1","Kalisk\u00e1","Karulov\u00e1","Ken\u00ed\u017eov\u00e1","Klapkov\u00e1","Kme\u0165ov\u00e1","Koles\u00e1rov\u00e1","Koll\u00e1rov\u00e1","Kolnikov\u00e1","Koln\u00edkov\u00e1","Kol\u00e1rov\u00e1","Korecov\u00e1","Kostkaov\u00e1","Kostrecov\u00e1","Kov\u00e1\u010dov\u00e1","Kov\u00e1\u010dikov\u00e1","Kozov\u00e1","Ko\u010di\u0161ov\u00e1","Kraj\u00ed\u010dekov\u00e1","Kraj\u010dov\u00e1","Kraj\u010dovi\u010dov\u00e1","Kraj\u010d\u00edrov\u00e1","Kr\u00e1likov\u00e1","Kr\u00fapov\u00e1","Kub\u00edkov\u00e1","Kyse\u013eov\u00e1","K\u00e1llayov\u00e1","Labudov\u00e1","Lep\u0161\u00edkov\u00e1","Lipt\u00e1kov\u00e1","Lisick\u00e1","Lubinov\u00e1","Luk\u00e1\u010dov\u00e1","Lupt\u00e1kov\u00e1","L\u00ed\u0161kov\u00e1","Madejov\u00e1","Majesk\u00e1","Malachovsk\u00e1","Mal\u00ed\u0161ekov\u00e1","Mamojkov\u00e1","Marcinkov\u00e1","Mari\u00e1nov\u00e1","Masarykov\u00e1","Maslov\u00e1","Matia\u0161kov\u00e1","Medve\u010fov\u00e1","Melcerov\u00e1","Me\u010diarov\u00e1","Michal\u00edkov\u00e1","Mihalikov\u00e1","Mih\u00e1lov\u00e1","Mih\u00e1likov\u00e1","Miklo\u0161kov\u00e1","Mikul\u00edkov\u00e1","Miku\u0161ov\u00e1","Mik\u00fa\u0161ov\u00e1","Milotov\u00e1","Min\u00e1\u010dov\u00e1","Mi\u0161\u00edkov\u00e1","Moj\u017ei\u0161ov\u00e1","Mokro\u0161ov\u00e1","Morov\u00e1","Morav\u010d\u00edkov\u00e1","Mydlov\u00e1","Nemcov\u00e1","Nov\u00e1kov\u00e1","Ob\u0161utov\u00e1","Ondru\u0161ov\u00e1","Ot\u010den\u00e1\u0161ov\u00e1","Paukov\u00e1","Pavlikovsk\u00e1","Pav\u00fakov\u00e1","Pa\u0161ekov\u00e1","Pa\u0161kov\u00e1","Pelik\u00e1nov\u00e1","Petrovick\u00e1","Petru\u0161kov\u00e1","Pe\u0161kov\u00e1","Plchov\u00e1","Plekanecov\u00e1","Podhradsk\u00e1","Podkonick\u00e1","Poliakov\u00e1","Pup\u00e1kov\u00e1","Rakov\u00e1","Repisk\u00e1","Roman\u010d\u00edkov\u00e1","Rusov\u00e1","Ru\u017ei\u010dkov\u00e1","Rybn\u00ed\u010dekov\u00e1","Ryb\u00e1rov\u00e1","Ryb\u00e1rikov\u00e1","Samsonov\u00e1","Sedliakov\u00e1","Senkov\u00e1","Sklenkov\u00e1","Skokanov\u00e1","Skuteck\u00e1","Sla\u0161\u0165anov\u00e1","Slobodov\u00e1","Slobodn\u00edkov\u00e1","Slotov\u00e1","Slov\u00e1kov\u00e1","Smrekov\u00e1","Stodolov\u00e1","Strakov\u00e1","Strniskov\u00e1","Svrb\u00edkov\u00e1","S\u00e1melov\u00e1","S\u00fdkorov\u00e1","Tatarov\u00e1","Tatarkov\u00e1","Tat\u00e1rov\u00e1","Tat\u00e1rkaov\u00e1","Thomkov\u00e1","Tome\u010dekov\u00e1","Tomkov\u00e1","Trubenov\u00e1","Tur\u010dokov\u00e1","Uramov\u00e1","Urbl\u00edkov\u00e1","Vajc\u00edkov\u00e1","Vajdov\u00e1","Valachov\u00e1","Valachovi\u010dov\u00e1","Valentov\u00e1","Valu\u0161kov\u00e1","Vanekov\u00e1","Veselov\u00e1","Vicenov\u00e1","Vi\u0161\u0148ovsk\u00e1","Vlachov\u00e1","Vojtekov\u00e1","Vydaren\u00e1","Zajacov\u00e1","Zimov\u00e1","Zimkov\u00e1","Z\u00e1borsk\u00e1","Z\u00fabrikov\u00e1","\u010capkovi\u010dov\u00e1","\u010caplovi\u010dov\u00e1","\u010carnogursk\u00e1","\u010ciern\u00e1","\u010cobrdov\u00e1","\u010ea\u010fov\u00e1","\u010euricov\u00e1","\u010euri\u0161ov\u00e1","\u0160idlov\u00e1","\u0160imonovi\u010dov\u00e1","\u0160kriniarov\u00e1","\u0160kult\u00e9tyov\u00e1","\u0160majdov\u00e1","\u0160olt\u00e9sov\u00e1","\u0160olt\u00fdsov\u00e1","\u0160tefanov\u00e1","\u0160tefankov\u00e1","\u0160ulcov\u00e1","\u0160urkov\u00e1","\u0160vehlov\u00e1","\u0160\u0165astn\u00e1"],"prefix":["Ing.","Mgr.","JUDr.","MUDr."],"suffix":["Phd."],"title":{"descriptor":["Lead","Senior","Direct","Corporate","Dynamic","Future","Product","National","Regional","District","Central","Global","Customer","Investor","Dynamic","International","Legacy","Forward","Internal","Human","Chief","Principal"],"level":["Solutions","Program","Brand","Security","Research","Marketing","Directives","Implementation","Integration","Functionality","Response","Paradigm","Tactics","Identity","Markets","Group","Division","Applications","Optimization","Operations","Infrastructure","Intranet","Communications","Web","Branding","Quality","Assurance","Mobility","Accounts","Data","Creative","Configuration","Accountability","Interactions","Factors","Usability","Metrics"],"job":["Supervisor","Associate","Executive","Liason","Officer","Manager","Engineer","Specialist","Director","Coordinator","Administrator","Architect","Analyst","Designer","Planner","Orchestrator","Technician","Developer","Producer","Consultant","Assistant","Facilitator","Agent","Representative","Strategist"]},"name":["#{prefix} #{man_first_name} #{man_last_name}","#{prefix} #{woman_first_name} #{woman_last_name}","#{man_first_name} #{man_last_name} #{suffix}","#{woman_first_name} #{woman_last_name} #{suffix}","#{man_first_name} #{man_last_name}","#{man_first_name} #{man_last_name}","#{man_first_name} #{man_last_name}","#{woman_first_name} #{woman_last_name}","#{woman_first_name} #{woman_last_name}","#{woman_first_name} #{woman_last_name}"]},"phone_number":{"formats":["09## ### ###","0## #### ####","0# #### ####","+421 ### ### ###"]}}},"ru":{"faker":{"address":{"country":["\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f","\u0410\u0432\u0441\u0442\u0440\u0438\u044f","\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d","\u0410\u043b\u0431\u0430\u043d\u0438\u044f","\u0410\u043b\u0436\u0438\u0440","\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0410\u043d\u0433\u0438\u043b\u044c\u044f","\u0410\u043d\u0433\u043e\u043b\u0430","\u0410\u043d\u0434\u043e\u0440\u0440\u0430","\u0410\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u043a\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430","\u0410\u043d\u0442\u0438\u043b\u044c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0410\u043e\u043c\u044b\u043d\u044c (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430","\u0410\u0440\u043c\u0435\u043d\u0438\u044f","\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d","\u0411\u0430\u0433\u0430\u043c\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430","\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448","\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441","\u0411\u0430\u0445\u0440\u0435\u0439\u043d","\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c","\u0411\u0435\u043b\u0438\u0437","\u0411\u0435\u043b\u044c\u0433\u0438\u044f","\u0411\u0435\u043d\u0438\u043d","\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f","\u0411\u043e\u043b\u0438\u0432\u0438\u044f","\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430","\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","\u0411\u0440\u0443\u043d\u0435\u0439","\u0411\u0443\u0440\u043a\u0438\u043d\u0430-\u0424\u0430\u0441\u043e","\u0411\u0443\u0440\u0443\u043d\u0434\u0438","\u0411\u0443\u0442\u0430\u043d","\u0412\u0430\u043d\u0443\u0430\u0442\u0443","\u0412\u0430\u0442\u0438\u043a\u0430\u043d","\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f","\u0412\u0435\u043d\u0433\u0440\u0438\u044f","\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430","\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","\u0412\u044c\u0435\u0442\u043d\u0430\u043c","\u0413\u0430\u0431\u043e\u043d","\u0413\u0430\u0438\u0442\u0438","\u0413\u0430\u0439\u0430\u043d\u0430","\u0413\u0430\u043c\u0431\u0438\u044f","\u0413\u0430\u043d\u0430","\u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430","\u0413\u0432\u0438\u0430\u043d\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0413\u0432\u0438\u043d\u0435\u044f","\u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0430\u0443","\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441","\u0413\u0440\u0435\u043d\u0430\u0434\u0430","\u0413\u0440\u0435\u0446\u0438\u044f","\u0413\u0440\u0443\u0437\u0438\u044f","\u0414\u0430\u043d\u0438\u044f","\u0414\u0436\u0438\u0431\u0443\u0442\u0438","\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430","\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u0415\u0433\u0438\u043f\u0435\u0442","\u0417\u0430\u043c\u0431\u0438\u044f","\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435","\u0418\u0437\u0440\u0430\u0438\u043b\u044c","\u0418\u043d\u0434\u0438\u044f","\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f","\u0418\u0440\u0430\u043a","\u0418\u0440\u0430\u043d","\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f","\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f","\u0418\u0441\u043f\u0430\u043d\u0438\u044f","\u0418\u0442\u0430\u043b\u0438\u044f","\u0419\u0435\u043c\u0435\u043d","\u041a\u0430\u0431\u043e-\u0412\u0435\u0440\u0434\u0435","\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430","\u041a\u0430\u043c\u0435\u0440\u0443\u043d","\u041a\u0430\u043d\u0430\u0434\u0430","\u041a\u0430\u0442\u0430\u0440","\u041a\u0435\u043d\u0438\u044f","\u041a\u0438\u043f\u0440","\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438","\u041a\u0438\u0442\u0430\u0439","\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f","\u041a\u043e\u043c\u043e\u0440\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430","\u041a\u043e\u043d\u0433\u043e","\u0414\u0435\u043c\u043e\u043a\u0440\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u041a\u043e\u0440\u0435\u044f (\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f)","\u041a\u043e\u0440\u0435\u044f (\u042e\u0436\u043d\u0430\u044f)","\u041a\u043e\u0441\u043e\u0432\u043e","\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430","\u041a\u043e\u0442-\u0434'\u0418\u0432\u0443\u0430\u0440","\u041a\u0443\u0431\u0430","\u041a\u0443\u0432\u0435\u0439\u0442","\u041a\u0443\u043a\u0430 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","\u041a\u044b\u0440\u0433\u044b\u0437\u0441\u0442\u0430\u043d","\u041b\u0430\u043e\u0441","\u041b\u0430\u0442\u0432\u0438\u044f","\u041b\u0435\u0441\u043e\u0442\u043e","\u041b\u0438\u0431\u0435\u0440\u0438\u044f","\u041b\u0438\u0432\u0430\u043d","\u041b\u0438\u0432\u0438\u044f","\u041b\u0438\u0442\u0432\u0430","\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d","\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433","\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439","\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f","\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440","\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f","\u041c\u0430\u043b\u0430\u0432\u0438","\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","\u041c\u0430\u043b\u0438","\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u044b","\u041c\u0430\u043b\u044c\u0442\u0430","\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","\u041c\u0435\u043a\u0441\u0438\u043a\u0430","\u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u044f","\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a","\u041c\u043e\u043b\u0434\u043e\u0432\u0430","\u041c\u043e\u043d\u0430\u043a\u043e","\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f","\u041c\u0430\u0440\u043e\u043a\u043a\u043e","\u041c\u044c\u044f\u043d\u043c\u0430","\u041d\u0430\u043c\u0438\u0431\u0438\u044f","\u041d\u0430\u0443\u0440\u0443","\u041d\u0435\u043f\u0430\u043b","\u041d\u0438\u0433\u0435\u0440","\u041d\u0438\u0433\u0435\u0440\u0438\u044f","\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430","\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f","\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0410\u0440\u0430\u0431\u0441\u043a\u0438\u0435 \u042d\u043c\u0438\u0440\u0430\u0442\u044b","\u041e\u043c\u0430\u043d","\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d","\u041f\u0430\u043b\u0430\u0443","\u041f\u0430\u043d\u0430\u043c\u0430","\u041f\u0430\u043f\u0443\u0430 \u2014 \u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439","\u041f\u0435\u0440\u0443","\u041f\u043e\u043b\u044c\u0448\u0430","\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u043d\u0433\u043e","\u0420\u043e\u0441\u0441\u0438\u044f","\u0420\u0443\u0430\u043d\u0434\u0430","\u0420\u0443\u043c\u044b\u043d\u0438\u044f","\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440","\u0421\u0430\u043c\u043e\u0430","\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e","\u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438","\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f","\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434","\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u043e\u0441\u0442\u0440\u043e\u0432\u0430","\u0421\u0435\u043d\u0435\u0433\u0430\u043b","\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b","\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441","\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f","\u0421\u0435\u0440\u0431\u0438\u044f","\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440","\u0421\u0438\u0440\u0438\u044f","\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f","\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f","\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b \u0410\u043c\u0435\u0440\u0438\u043a\u0438","\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u041e\u0441\u0442\u0440\u043e\u0432\u0430","\u0421\u043e\u043c\u0430\u043b\u0438","\u0421\u0443\u0434\u0430\u043d","\u0421\u0443\u0440\u0438\u043d\u0430\u043c","\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435","\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d","\u0422\u0430\u0438\u043b\u0430\u043d\u0434","\u0422\u0430\u0439\u0432\u0430\u043d\u044c (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0422\u0430\u043c\u0438\u043b-\u0418\u043b\u0430\u043c (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f","\u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0422\u043e\u0433\u043e","\u0422\u043e\u043a\u0435\u043b\u0430\u0443 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0422\u043e\u043d\u0433\u0430","\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e","\u0422\u0443\u0432\u0430\u043b\u0443","\u0422\u0443\u043d\u0438\u0441","\u0422\u0443\u0440\u0435\u0446\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0421\u0435\u0432\u0435\u0440\u043d\u043e\u0433\u043e \u041a\u0438\u043f\u0440\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d","\u0422\u0443\u0440\u0446\u0438\u044f","\u0423\u0433\u0430\u043d\u0434\u0430","\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d","\u0423\u043a\u0440\u0430\u0438\u043d\u0430","\u0423\u0440\u0443\u0433\u0432\u0430\u0439","\u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u041e\u0441\u0442\u0440\u043e\u0432\u0430 (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0424\u0438\u0434\u0436\u0438","\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b","\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f","\u0424\u0440\u0430\u043d\u0446\u0438\u044f","\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f (\u043d\u0435 \u043f\u0440\u0438\u0437\u043d\u0430\u043d\u0430)","\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f","\u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u043e\u0430\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u0427\u0430\u0434","\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f","\u0427\u0435\u0445\u0438\u044f","\u0427\u0438\u043b\u0438","\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f","\u0428\u0432\u0435\u0446\u0438\u044f","\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430","\u042d\u043a\u0432\u0430\u0434\u043e\u0440","\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","\u042d\u0440\u0438\u0442\u0440\u0435\u044f","\u042d\u0441\u0442\u043e\u043d\u0438\u044f","\u042d\u0444\u0438\u043e\u043f\u0438\u044f","\u042e\u0436\u043d\u043e-\u0410\u0444\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u042f\u043c\u0430\u0439\u043a\u0430","\u042f\u043f\u043e\u043d\u0438\u044f"],"building_number":["###"],"street_suffix":["\u0443\u043b.","\u0443\u043b\u0438\u0446\u0430","\u043f\u0440\u043e\u0441\u043f\u0435\u043a\u0442","\u043f\u0440.","\u043f\u043b\u043e\u0449\u0430\u0434\u044c","\u043f\u043b."],"secondary_address":["\u043a\u0432. ###"],"postcode":["######"],"state":["\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0410\u0434\u044b\u0433\u0435\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0411\u0430\u0448\u043a\u043e\u0440\u0442\u043e\u0441\u0442\u0430\u043d","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0411\u0443\u0440\u044f\u0442\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0410\u043b\u0442\u0430\u0439 \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0414\u0430\u0433\u0435\u0441\u0442\u0430\u043d","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0418\u043d\u0433\u0443\u0448\u0435\u0442\u0438\u044f","\u041a\u0430\u0431\u0430\u0440\u0434\u0438\u043d\u043e-\u0411\u0430\u043b\u043a\u0430\u0440\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u043b\u043c\u044b\u043a\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u0440\u0430\u0447\u0430\u0435\u0432\u043e-\u0427\u0435\u0440\u043a\u0435\u0441\u0441\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u0440\u0435\u043b\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u043c\u0438","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041c\u0430\u0440\u0438\u0439 \u042d\u043b","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041c\u043e\u0440\u0434\u043e\u0432\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0421\u0430\u0445\u0430 (\u042f\u043a\u0443\u0442\u0438\u044f)","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f \u041e\u0441\u0435\u0442\u0438\u044f-\u0410\u043b\u0430\u043d\u0438\u044f","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0422\u0430\u0442\u0430\u0440\u0441\u0442\u0430\u043d","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0422\u044b\u0432\u0430","\u0423\u0434\u043c\u0443\u0440\u0442\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u0425\u0430\u043a\u0430\u0441\u0438\u044f","\u0427\u0443\u0432\u0430\u0448\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","\u0410\u043b\u0442\u0430\u0439\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u041f\u0440\u0438\u043c\u043e\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u0425\u0430\u0431\u0430\u0440\u043e\u0432\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439","\u0410\u043c\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0410\u0440\u0445\u0430\u043d\u0433\u0435\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0411\u0435\u043b\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0411\u0440\u044f\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0412\u043e\u043b\u0433\u043e\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0412\u043e\u043b\u043e\u0433\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0412\u043e\u0440\u043e\u043d\u0435\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0418\u0432\u0430\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0418\u0440\u043a\u0443\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0430\u043b\u0438\u043d\u0438\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0430\u043b\u0443\u0436\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0430\u043c\u0447\u0430\u0442\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0435\u043c\u0435\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0438\u0440\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u043e\u0441\u0442\u0440\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0443\u0440\u0433\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041a\u0443\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041b\u0435\u043d\u0438\u043d\u0433\u0440\u0430\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041c\u0430\u0433\u0430\u0434\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041c\u0443\u0440\u043c\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041d\u0438\u0436\u0435\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041e\u0440\u0435\u043d\u0431\u0443\u0440\u0433\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041e\u0440\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041f\u0435\u043d\u0437\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041f\u0435\u0440\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u041f\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0420\u043e\u0441\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0420\u044f\u0437\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0421\u0430\u043c\u0430\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0421\u0430\u0440\u0430\u0442\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0421\u0430\u0445\u0430\u043b\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0421\u0432\u0435\u0440\u0434\u043b\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0421\u043c\u043e\u043b\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0422\u0430\u043c\u0431\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0422\u0432\u0435\u0440\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0422\u043e\u043c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0422\u0443\u043b\u044c\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0422\u044e\u043c\u0435\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0423\u043b\u044c\u044f\u043d\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0427\u0435\u043b\u044f\u0431\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0427\u0438\u0442\u0438\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0415\u0432\u0440\u0435\u0439\u0441\u043a\u0430\u044f \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c","\u0410\u0433\u0438\u043d\u0441\u043a\u0438\u0439 \u0411\u0443\u0440\u044f\u0442\u0441\u043a\u0438\u0439 \u0430\u0432\u0442. \u043e\u043a\u0440\u0443\u0433","\u041a\u043e\u043c\u0438-\u041f\u0435\u0440\u043c\u044f\u0446\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u041a\u043e\u0440\u044f\u043a\u0441\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u041d\u0435\u043d\u0435\u0446\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u0422\u0430\u0439\u043c\u044b\u0440\u0441\u043a\u0438\u0439 (\u0414\u043e\u043b\u0433\u0430\u043d\u043e-\u041d\u0435\u043d\u0435\u0446\u043a\u0438\u0439) \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u0423\u0441\u0442\u044c-\u041e\u0440\u0434\u044b\u043d\u0441\u043a\u0438\u0439 \u0411\u0443\u0440\u044f\u0442\u0441\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u0425\u0430\u043d\u0442\u044b-\u041c\u0430\u043d\u0441\u0438\u0439\u0441\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u0427\u0443\u043a\u043e\u0442\u0441\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u042d\u0432\u0435\u043d\u043a\u0438\u0439\u0441\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u042f\u043c\u0430\u043b\u043e-\u041d\u0435\u043d\u0435\u0446\u043a\u0438\u0439 \u0430\u0432\u0442\u043e\u043d\u043e\u043c\u043d\u044b\u0439 \u043e\u043a\u0440\u0443\u0433","\u0427\u0435\u0447\u0435\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430"],"street_title":["\u0421\u043e\u0432\u0435\u0442\u0441\u043a\u0430\u044f","\u041c\u043e\u043b\u043e\u0434\u0435\u0436\u043d\u0430\u044f","\u0426\u0435\u043d\u0442\u0440\u0430\u043b\u044c\u043d\u0430\u044f","\u0428\u043a\u043e\u043b\u044c\u043d\u0430\u044f","\u041d\u043e\u0432\u0430\u044f","\u0421\u0430\u0434\u043e\u0432\u0430\u044f","\u041b\u0435\u0441\u043d\u0430\u044f","\u041d\u0430\u0431\u0435\u0440\u0435\u0436\u043d\u0430\u044f","\u041b\u0435\u043d\u0438\u043d\u0430","\u041c\u0438\u0440\u0430","\u041e\u043a\u0442\u044f\u0431\u0440\u044c\u0441\u043a\u0430\u044f","\u0417\u0435\u043b\u0435\u043d\u0430\u044f","\u041a\u043e\u043c\u0441\u043e\u043c\u043e\u043b\u044c\u0441\u043a\u0430\u044f","\u0417\u0430\u0440\u0435\u0447\u043d\u0430\u044f","\u041f\u0435\u0440\u0432\u043e\u043c\u0430\u0439\u0441\u043a\u0430\u044f","\u0413\u0430\u0433\u0430\u0440\u0438\u043d\u0430","\u041f\u043e\u043b\u0435\u0432\u0430\u044f","\u041b\u0443\u0433\u043e\u0432\u0430\u044f","\u041f\u0438\u043e\u043d\u0435\u0440\u0441\u043a\u0430\u044f","\u041a\u0438\u0440\u043e\u0432\u0430","\u042e\u0431\u0438\u043b\u0435\u0439\u043d\u0430\u044f","\u0421\u0435\u0432\u0435\u0440\u043d\u0430\u044f","\u041f\u0440\u043e\u043b\u0435\u0442\u0430\u0440\u0441\u043a\u0430\u044f","\u0421\u0442\u0435\u043f\u043d\u0430\u044f","\u041f\u0443\u0448\u043a\u0438\u043d\u0430","\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0430","\u042e\u0436\u043d\u0430\u044f","\u041a\u043e\u043b\u0445\u043e\u0437\u043d\u0430\u044f","\u0420\u0430\u0431\u043e\u0447\u0430\u044f","\u0421\u043e\u043b\u043d\u0435\u0447\u043d\u0430\u044f","\u0416\u0435\u043b\u0435\u0437\u043d\u043e\u0434\u043e\u0440\u043e\u0436\u043d\u0430\u044f","\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u0430\u044f","\u0417\u0430\u0432\u043e\u0434\u0441\u043a\u0430\u044f","\u0427\u0430\u043f\u0430\u0435\u0432\u0430","\u041d\u0430\u0433\u043e\u0440\u043d\u0430\u044f","\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u0435\u0439","\u0411\u0435\u0440\u0435\u0433\u043e\u0432\u0430\u044f","\u041f\u043e\u0431\u0435\u0434\u044b","\u0413\u043e\u0440\u044c\u043a\u043e\u0433\u043e","\u041a\u043e\u043e\u043f\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u0430\u044f","\u041a\u0440\u0430\u0441\u043d\u043e\u0430\u0440\u043c\u0435\u0439\u0441\u043a\u0430\u044f","\u0421\u043e\u0432\u0445\u043e\u0437\u043d\u0430\u044f","\u0420\u0435\u0447\u043d\u0430\u044f","\u0428\u043a\u043e\u043b\u044c\u043d\u044b\u0439","\u0421\u043f\u043e\u0440\u0442\u0438\u0432\u043d\u0430\u044f","\u041e\u0437\u0435\u0440\u043d\u0430\u044f","\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f","\u041f\u0430\u0440\u043a\u043e\u0432\u0430\u044f","\u0427\u043a\u0430\u043b\u043e\u0432\u0430","\u041c\u0438\u0447\u0443\u0440\u0438\u043d\u0430","\u0440\u0435\u0447\u0435\u043d\u044c \u0443\u043b\u0438\u0446","\u041f\u043e\u0434\u0433\u043e\u0440\u043d\u0430\u044f","\u0414\u0440\u0443\u0436\u0431\u044b","\u041f\u043e\u0447\u0442\u043e\u0432\u0430\u044f","\u041f\u0430\u0440\u0442\u0438\u0437\u0430\u043d\u0441\u043a\u0430\u044f","\u0412\u043e\u043a\u0437\u0430\u043b\u044c\u043d\u0430\u044f","\u041b\u0435\u0440\u043c\u043e\u043d\u0442\u043e\u0432\u0430","\u0421\u0432\u043e\u0431\u043e\u0434\u044b","\u0414\u043e\u0440\u043e\u0436\u043d\u0430\u044f","\u0414\u0430\u0447\u043d\u0430\u044f","\u041c\u0430\u044f\u043a\u043e\u0432\u0441\u043a\u043e\u0433\u043e","\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f","\u0424\u0440\u0443\u043d\u0437\u0435","\u0414\u0437\u0435\u0440\u0436\u0438\u043d\u0441\u043a\u043e\u0433\u043e","\u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f","\u0421\u0432\u0435\u0440\u0434\u043b\u043e\u0432\u0430","\u041d\u0435\u043a\u0440\u0430\u0441\u043e\u0432\u0430","\u0413\u043e\u0433\u043e\u043b\u044f","\u041a\u0440\u0430\u0441\u043d\u0430\u044f","\u0422\u0440\u0443\u0434\u043e\u0432\u0430\u044f","\u0428\u043e\u0441\u0441\u0435\u0439\u043d\u0430\u044f","\u0427\u0435\u0445\u043e\u0432\u0430","\u041a\u043e\u043c\u043c\u0443\u043d\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f","\u0422\u0440\u0443\u0434\u0430","\u041a\u043e\u043c\u0430\u0440\u043e\u0432\u0430","\u041c\u0430\u0442\u0440\u043e\u0441\u043e\u0432\u0430","\u041e\u0441\u0442\u0440\u043e\u0432\u0441\u043a\u043e\u0433\u043e","\u0421\u043e\u0441\u043d\u043e\u0432\u0430\u044f","\u041a\u043b\u0443\u0431\u043d\u0430\u044f","\u041a\u0443\u0439\u0431\u044b\u0448\u0435\u0432\u0430","\u041a\u0440\u0443\u043f\u0441\u043a\u043e\u0439","\u0411\u0435\u0440\u0435\u0437\u043e\u0432\u0430\u044f","\u041a\u0430\u0440\u043b\u0430 \u041c\u0430\u0440\u043a\u0441\u0430","8 \u041c\u0430\u0440\u0442\u0430","\u0411\u043e\u043b\u044c\u043d\u0438\u0447\u043d\u0430\u044f","\u0421\u0430\u0434\u043e\u0432\u044b\u0439","\u0418\u043d\u0442\u0435\u0440\u043d\u0430\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f","\u0421\u0443\u0432\u043e\u0440\u043e\u0432\u0430","\u0426\u0432\u0435\u0442\u043e\u0447\u043d\u0430\u044f","\u0422\u0440\u0430\u043a\u0442\u043e\u0432\u0430\u044f","\u041b\u043e\u043c\u043e\u043d\u043e\u0441\u043e\u0432\u0430","\u0413\u043e\u0440\u043d\u0430\u044f","\u041a\u043e\u0441\u043c\u043e\u043d\u0430\u0432\u0442\u043e\u0432","\u042d\u043d\u0435\u0440\u0433\u0435\u0442\u0438\u043a\u043e\u0432","\u0428\u0435\u0432\u0447\u0435\u043d\u043a\u043e","\u0412\u0435\u0441\u0435\u043d\u043d\u044f\u044f","\u041c\u0435\u0445\u0430\u043d\u0438\u0437\u0430\u0442\u043e\u0440\u043e\u0432","\u041a\u043e\u043c\u043c\u0443\u043d\u0430\u043b\u044c\u043d\u0430\u044f","\u041b\u0435\u0441\u043d\u043e\u0439","40 \u043b\u0435\u0442 \u041f\u043e\u0431\u0435\u0434\u044b","\u041c\u0430\u0439\u0441\u043a\u0430\u044f"],"city_name":["\u041c\u043e\u0441\u043a\u0432\u0430","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440","\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433","\u041d\u043e\u0432\u043e\u0441\u0438\u0431\u0438\u0440\u0441\u043a","\u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0431\u0443\u0440\u0433","\u041d\u0438\u0436\u043d\u0438\u0439 \u041d\u043e\u0432\u0433\u043e\u0440\u043e\u0434","\u0421\u0430\u043c\u0430\u0440\u0430","\u041a\u0430\u0437\u0430\u043d\u044c","\u041e\u043c\u0441\u043a","\u0427\u0435\u043b\u044f\u0431\u0438\u043d\u0441\u043a","\u0420\u043e\u0441\u0442\u043e\u0432-\u043d\u0430-\u0414\u043e\u043d\u0443","\u0423\u0444\u0430","\u0412\u043e\u043b\u0433\u043e\u0433\u0440\u0430\u0434","\u041f\u0435\u0440\u043c\u044c","\u041a\u0440\u0430\u0441\u043d\u043e\u044f\u0440\u0441\u043a","\u0412\u043e\u0440\u043e\u043d\u0435\u0436","\u0421\u0430\u0440\u0430\u0442\u043e\u0432","\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440","\u0422\u043e\u043b\u044c\u044f\u0442\u0442\u0438","\u0418\u0436\u0435\u0432\u0441\u043a","\u0411\u0430\u0440\u043d\u0430\u0443\u043b","\u0423\u043b\u044c\u044f\u043d\u043e\u0432\u0441\u043a","\u0422\u044e\u043c\u0435\u043d\u044c","\u0418\u0440\u043a\u0443\u0442\u0441\u043a","\u0412\u043b\u0430\u0434\u0438\u0432\u043e\u0441\u0442\u043e\u043a","\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u043b\u044c","\u0425\u0430\u0431\u0430\u0440\u043e\u0432\u0441\u043a","\u041c\u0430\u0445\u0430\u0447\u043a\u0430\u043b\u0430","\u041e\u0440\u0435\u043d\u0431\u0443\u0440\u0433","\u041d\u043e\u0432\u043e\u043a\u0443\u0437\u043d\u0435\u0446\u043a","\u0422\u043e\u043c\u0441\u043a","\u041a\u0435\u043c\u0435\u0440\u043e\u0432\u043e","\u0420\u044f\u0437\u0430\u043d\u044c","\u0410\u0441\u0442\u0440\u0430\u0445\u0430\u043d\u044c","\u041f\u0435\u043d\u0437\u0430","\u041b\u0438\u043f\u0435\u0446\u043a","\u0422\u0443\u043b\u0430","\u041a\u0438\u0440\u043e\u0432","\u0427\u0435\u0431\u043e\u043a\u0441\u0430\u0440\u044b","\u041a\u0443\u0440\u0441\u043a","\u0411\u0440\u044f\u043d\u0441\u043am \u041c\u0430\u0433\u043d\u0438\u0442\u043e\u0433\u043e\u0440\u0441\u043a","\u0418\u0432\u0430\u043d\u043e\u0432\u043e","\u0422\u0432\u0435\u0440\u044c","\u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c","\u0411\u0435\u043b\u0433\u043e\u0440\u043e\u0434","\u0421\u043e\u0447\u0438"],"city":["#{Address.city_name}"],"street_name":["#{street_suffix} #{Address.street_title}","#{Address.street_title} #{street_suffix}"],"street_address":["#{street_name}, #{building_number}"],"default_country":["\u0420\u043e\u0441\u0441\u0438\u044f"]},"internet":{"free_email":["yandex.ru","ya.ru","mail.ru","gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","ru","info","\u0440\u0444","net","org"]},"name":{"male_first_name":["\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440","\u0410\u043b\u0435\u043a\u0441\u0435\u0439","\u0410\u043b\u044c\u0431\u0435\u0440\u0442","\u0410\u043d\u0430\u0442\u043e\u043b\u0438\u0439","\u0410\u043d\u0434\u0440\u0435\u0439","\u0410\u043d\u0442\u043e\u043d","\u0410\u0440\u043a\u0430\u0434\u0438\u0439","\u0410\u0440\u0441\u0435\u043d\u0438\u0439","\u0410\u0440\u0442\u0451\u043c","\u0411\u043e\u0440\u0438\u0441","\u0412\u0430\u0434\u0438\u043c","\u0412\u0430\u043b\u0435\u043d\u0442\u0438\u043d","\u0412\u0430\u043b\u0435\u0440\u0438\u0439","\u0412\u0430\u0441\u0438\u043b\u0438\u0439","\u0412\u0438\u043a\u0442\u043e\u0440","\u0412\u0438\u0442\u0430\u043b\u0438\u0439","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440","\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432","\u0412\u044f\u0447\u0435\u0441\u043b\u0430\u0432","\u0413\u0435\u043d\u043d\u0430\u0434\u0438\u0439","\u0413\u0435\u043e\u0440\u0433\u0438\u0439","\u0413\u0435\u0440\u043c\u0430\u043d","\u0413\u0440\u0438\u0433\u043e\u0440\u0438\u0439","\u0414\u0430\u043d\u0438\u0438\u043b","\u0414\u0435\u043d\u0438\u0441","\u0414\u043c\u0438\u0442\u0440\u0438\u0439","\u0415\u0432\u0433\u0435\u043d\u0438\u0439","\u0415\u0433\u043e\u0440","\u0418\u0432\u0430\u043d","\u0418\u0433\u043d\u0430\u0442\u0438\u0439","\u0418\u0433\u043e\u0440\u044c","\u0418\u043b\u044c\u044f","\u041a\u043e\u043d\u0441\u0442\u0430\u043d\u0442\u0438\u043d","\u041b\u0430\u0432\u0440\u0435\u043d\u0442\u0438\u0439","\u041b\u0435\u043e\u043d\u0438\u0434","\u041b\u0443\u043a\u0430","\u041c\u0430\u043a\u0430\u0440","\u041c\u0430\u043a\u0441\u0438\u043c","\u041c\u0430\u0442\u0432\u0435\u0439","\u041c\u0438\u0445\u0430\u0438\u043b","\u041d\u0438\u043a\u0438\u0442\u0430","\u041d\u0438\u043a\u043e\u043b\u0430\u0439","\u041e\u043b\u0435\u0433","\u0420\u043e\u043c\u0430\u043d","\u0421\u0435\u043c\u0451\u043d","\u0421\u0435\u0440\u0433\u0435\u0439","\u0421\u0442\u0430\u043d\u0438\u0441\u043b\u0430\u0432","\u0421\u0442\u0435\u043f\u0430\u043d","\u0424\u0451\u0434\u043e\u0440","\u042d\u0434\u0443\u0430\u0440\u0434","\u042e\u0440\u0438\u0439","\u042f\u0440\u043e\u0441\u043b\u0430\u0432"],"male_middle_name":["\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u0438\u0447","\u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u0438\u0447","\u0410\u043b\u044c\u0431\u0435\u0440\u0442\u043e\u0432\u0438\u0447","\u0410\u043d\u0430\u0442\u043e\u043b\u044c\u0435\u0432\u0438\u0447","\u0410\u043d\u0434\u0440\u0435\u0435\u0432\u0438\u0447","\u0410\u043d\u0442\u043e\u043d\u043e\u0432\u0438\u0447","\u0410\u0440\u043a\u0430\u0434\u044c\u0435\u0432\u0438\u0447","\u0410\u0440\u0441\u0435\u043d\u044c\u0435\u0432\u0438\u0447","\u0410\u0440\u0442\u0451\u043c\u043e\u0432\u0438\u0447","\u0411\u043e\u0440\u0438\u0441\u043e\u0432\u0438\u0447","\u0412\u0430\u0434\u0438\u043c\u043e\u0432\u0438\u0447","\u0412\u0430\u043b\u0435\u043d\u0442\u0438\u043d\u043e\u0432\u0438\u0447","\u0412\u0430\u043b\u0435\u0440\u044c\u0435\u0432\u0438\u0447","\u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432\u0438\u0447","\u0412\u0438\u043a\u0442\u043e\u0440\u043e\u0432\u0438\u0447","\u0412\u0438\u0442\u0430\u043b\u044c\u0435\u0432\u0438\u0447","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u043e\u0432\u0438\u0447","\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432\u043e\u0432\u0438\u0447","\u0412\u044f\u0447\u0435\u0441\u043b\u0430\u0432\u043e\u0432\u0438\u0447","\u0413\u0435\u043d\u043d\u0430\u0434\u044c\u0435\u0432\u0438\u0447","\u0413\u0435\u043e\u0440\u0433\u0438\u0435\u0432\u0438\u0447","\u0413\u0435\u0440\u043c\u0430\u043d\u043e\u0432\u0438\u0447","\u0413\u0440\u0438\u0433\u043e\u0440\u044c\u0435\u0432\u0438\u0447","\u0414\u0430\u043d\u0438\u0438\u043b\u043e\u0432\u0438\u0447","\u0414\u0435\u043d\u0438\u0441\u043e\u0432\u0438\u0447","\u0414\u043c\u0438\u0442\u0440\u0438\u0435\u0432\u0438\u0447","\u0415\u0432\u0433\u0435\u043d\u044c\u0435\u0432\u0438\u0447","\u0415\u0433\u043e\u0440\u043e\u0432\u0438\u0447","\u0418\u0432\u0430\u043d\u043e\u0432\u0438\u0447","\u0418\u0433\u043d\u0430\u0442\u044c\u0435\u0432\u0438\u0447","\u0418\u0433\u043e\u0440\u0435\u0432\u0438\u0447","\u0418\u043b\u044c\u0438\u0447","\u041a\u043e\u043d\u0441\u0442\u0430\u043d\u0442\u0438\u043d\u043e\u0432\u0438\u0447","\u041b\u0430\u0432\u0440\u0435\u043d\u0442\u044c\u0435\u0432\u0438\u0447","\u041b\u0435\u043e\u043d\u0438\u0434\u043e\u0432\u0438\u0447","\u041b\u0443\u043a\u0438\u0447","\u041c\u0430\u043a\u0430\u0440\u043e\u0432\u0438\u0447","\u041c\u0430\u043a\u0441\u0438\u043c\u043e\u0432\u0438\u0447","\u041c\u0430\u0442\u0432\u0435\u0435\u0432\u0438\u0447","\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u0438\u0447","\u041d\u0438\u043a\u0438\u0442\u0438\u0447","\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432\u0438\u0447","\u041e\u043b\u0435\u0433\u043e\u0432\u0438\u0447","\u0420\u043e\u043c\u0430\u043d\u043e\u0432\u0438\u0447","\u0421\u0435\u043c\u0451\u043d\u043e\u0432\u0438\u0447","\u0421\u0435\u0440\u0433\u0435\u0435\u0432\u0438\u0447","\u0421\u0442\u0430\u043d\u0438\u0441\u043b\u0430\u0432\u043e\u0432\u0438\u0447","\u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432\u0438\u0447","\u0424\u0451\u0434\u043e\u0440\u043e\u0432\u0438\u0447","\u042d\u0434\u0443\u0430\u0440\u0434\u043e\u0432\u0438\u0447","\u042e\u0440\u044c\u0435\u0432\u0438\u0447","\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u043e\u0432\u0438\u0447"],"male_last_name":["\u0421\u043c\u0438\u0440\u043d\u043e\u0432","\u0418\u0432\u0430\u043d\u043e\u0432","\u041a\u0443\u0437\u043d\u0435\u0446\u043e\u0432","\u041f\u043e\u043f\u043e\u0432","\u0421\u043e\u043a\u043e\u043b\u043e\u0432","\u041b\u0435\u0431\u0435\u0434\u0435\u0432","\u041a\u043e\u0437\u043b\u043e\u0432","\u041d\u043e\u0432\u0438\u043a\u043e\u0432","\u041c\u043e\u0440\u043e\u0437\u043e\u0432","\u041f\u0435\u0442\u0440\u043e\u0432","\u0412\u043e\u043b\u043a\u043e\u0432","\u0421\u043e\u043b\u043e\u0432\u044c\u0435\u0432","\u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432","\u0417\u0430\u0439\u0446\u0435\u0432","\u041f\u0430\u0432\u043b\u043e\u0432","\u0421\u0435\u043c\u0435\u043d\u043e\u0432","\u0413\u043e\u043b\u0443\u0431\u0435\u0432","\u0412\u0438\u043d\u043e\u0433\u0440\u0430\u0434\u043e\u0432","\u0411\u043e\u0433\u0434\u0430\u043d\u043e\u0432","\u0412\u043e\u0440\u043e\u0431\u044c\u0435\u0432","\u0424\u0435\u0434\u043e\u0440\u043e\u0432","\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432","\u0411\u0435\u043b\u044f\u0435\u0432","\u0422\u0430\u0440\u0430\u0441\u043e\u0432","\u0411\u0435\u043b\u043e\u0432","\u041a\u043e\u043c\u0430\u0440\u043e\u0432","\u041e\u0440\u043b\u043e\u0432","\u041a\u0438\u0441\u0435\u043b\u0435\u0432","\u041c\u0430\u043a\u0430\u0440\u043e\u0432","\u0410\u043d\u0434\u0440\u0435\u0435\u0432","\u041a\u043e\u0432\u0430\u043b\u0435\u0432","\u0418\u043b\u044c\u0438\u043d","\u0413\u0443\u0441\u0435\u0432","\u0422\u0438\u0442\u043e\u0432","\u041a\u0443\u0437\u044c\u043c\u0438\u043d","\u041a\u0443\u0434\u0440\u044f\u0432\u0446\u0435\u0432","\u0411\u0430\u0440\u0430\u043d\u043e\u0432","\u041a\u0443\u043b\u0438\u043a\u043e\u0432","\u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432","\u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432","\u042f\u043a\u043e\u0432\u043b\u0435\u0432","\u0421\u043e\u0440\u043e\u043a\u0438\u043d","\u0421\u0435\u0440\u0433\u0435\u0435\u0432","\u0420\u043e\u043c\u0430\u043d\u043e\u0432","\u0417\u0430\u0445\u0430\u0440\u043e\u0432","\u0411\u043e\u0440\u0438\u0441\u043e\u0432","\u041a\u043e\u0440\u043e\u043b\u0435\u0432","\u0413\u0435\u0440\u0430\u0441\u0438\u043c\u043e\u0432","\u041f\u043e\u043d\u043e\u043c\u0430\u0440\u0435\u0432","\u0413\u0440\u0438\u0433\u043e\u0440\u044c\u0435\u0432","\u041b\u0430\u0437\u0430\u0440\u0435\u0432","\u041c\u0435\u0434\u0432\u0435\u0434\u0435\u0432","\u0415\u0440\u0448\u043e\u0432","\u041d\u0438\u043a\u0438\u0442\u0438\u043d","\u0421\u043e\u0431\u043e\u043b\u0435\u0432","\u0420\u044f\u0431\u043e\u0432","\u041f\u043e\u043b\u044f\u043a\u043e\u0432","\u0426\u0432\u0435\u0442\u043a\u043e\u0432","\u0414\u0430\u043d\u0438\u043b\u043e\u0432","\u0416\u0443\u043a\u043e\u0432","\u0424\u0440\u043e\u043b\u043e\u0432","\u0416\u0443\u0440\u0430\u0432\u043b\u0435\u0432","\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432","\u041a\u0440\u044b\u043b\u043e\u0432","\u041c\u0430\u043a\u0441\u0438\u043c\u043e\u0432","\u0421\u0438\u0434\u043e\u0440\u043e\u0432","\u041e\u0441\u0438\u043f\u043e\u0432","\u0411\u0435\u043b\u043e\u0443\u0441\u043e\u0432","\u0424\u0435\u0434\u043e\u0442\u043e\u0432","\u0414\u043e\u0440\u043e\u0444\u0435\u0435\u0432","\u0415\u0433\u043e\u0440\u043e\u0432","\u041c\u0430\u0442\u0432\u0435\u0435\u0432","\u0411\u043e\u0431\u0440\u043e\u0432","\u0414\u043c\u0438\u0442\u0440\u0438\u0435\u0432","\u041a\u0430\u043b\u0438\u043d\u0438\u043d","\u0410\u043d\u0438\u0441\u0438\u043c\u043e\u0432","\u041f\u0435\u0442\u0443\u0445\u043e\u0432","\u0410\u043d\u0442\u043e\u043d\u043e\u0432","\u0422\u0438\u043c\u043e\u0444\u0435\u0435\u0432","\u041d\u0438\u043a\u0438\u0444\u043e\u0440\u043e\u0432","\u0412\u0435\u0441\u0435\u043b\u043e\u0432","\u0424\u0438\u043b\u0438\u043f\u043f\u043e\u0432","\u041c\u0430\u0440\u043a\u043e\u0432","\u0411\u043e\u043b\u044c\u0448\u0430\u043a\u043e\u0432","\u0421\u0443\u0445\u0430\u043d\u043e\u0432","\u041c\u0438\u0440\u043e\u043d\u043e\u0432","\u0428\u0438\u0440\u044f\u0435\u0432","\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432","\u041a\u043e\u043d\u043e\u0432\u0430\u043b\u043e\u0432","\u0428\u0435\u0441\u0442\u0430\u043a\u043e\u0432","\u041a\u0430\u0437\u0430\u043a\u043e\u0432","\u0415\u0444\u0438\u043c\u043e\u0432","\u0414\u0435\u043d\u0438\u0441\u043e\u0432","\u0413\u0440\u043e\u043c\u043e\u0432","\u0424\u043e\u043c\u0438\u043d","\u0414\u0430\u0432\u044b\u0434\u043e\u0432","\u041c\u0435\u043b\u044c\u043d\u0438\u043a\u043e\u0432","\u0429\u0435\u0440\u0431\u0430\u043a\u043e\u0432","\u0411\u043b\u0438\u043d\u043e\u0432","\u041a\u043e\u043b\u0435\u0441\u043d\u0438\u043a\u043e\u0432","\u041a\u0430\u0440\u043f\u043e\u0432","\u0410\u0444\u0430\u043d\u0430\u0441\u044c\u0435\u0432","\u0412\u043b\u0430\u0441\u043e\u0432","\u041c\u0430\u0441\u043b\u043e\u0432","\u0418\u0441\u0430\u043a\u043e\u0432","\u0422\u0438\u0445\u043e\u043d\u043e\u0432","\u0410\u043a\u0441\u0435\u043d\u043e\u0432","\u0413\u0430\u0432\u0440\u0438\u043b\u043e\u0432","\u0420\u043e\u0434\u0438\u043e\u043d\u043e\u0432","\u041a\u043e\u0442\u043e\u0432","\u0413\u043e\u0440\u0431\u0443\u043d\u043e\u0432","\u041a\u0443\u0434\u0440\u044f\u0448\u043e\u0432","\u0411\u044b\u043a\u043e\u0432","\u0417\u0443\u0435\u0432","\u0422\u0440\u0435\u0442\u044c\u044f\u043a\u043e\u0432","\u0421\u0430\u0432\u0435\u043b\u044c\u0435\u0432","\u041f\u0430\u043d\u043e\u0432","\u0420\u044b\u0431\u0430\u043a\u043e\u0432","\u0421\u0443\u0432\u043e\u0440\u043e\u0432","\u0410\u0431\u0440\u0430\u043c\u043e\u0432","\u0412\u043e\u0440\u043e\u043d\u043e\u0432","\u041c\u0443\u0445\u0438\u043d","\u0410\u0440\u0445\u0438\u043f\u043e\u0432","\u0422\u0440\u043e\u0444\u0438\u043c\u043e\u0432","\u041c\u0430\u0440\u0442\u044b\u043d\u043e\u0432","\u0415\u043c\u0435\u043b\u044c\u044f\u043d\u043e\u0432","\u0413\u043e\u0440\u0448\u043a\u043e\u0432","\u0427\u0435\u0440\u043d\u043e\u0432","\u041e\u0432\u0447\u0438\u043d\u043d\u0438\u043a\u043e\u0432","\u0421\u0435\u043b\u0435\u0437\u043d\u0435\u0432","\u041f\u0430\u043d\u0444\u0438\u043b\u043e\u0432","\u041a\u043e\u043f\u044b\u043b\u043e\u0432","\u041c\u0438\u0445\u0435\u0435\u0432","\u0413\u0430\u043b\u043a\u0438\u043d","\u041d\u0430\u0437\u0430\u0440\u043e\u0432","\u041b\u043e\u0431\u0430\u043d\u043e\u0432","\u041b\u0443\u043a\u0438\u043d","\u0411\u0435\u043b\u044f\u043a\u043e\u0432","\u041f\u043e\u0442\u0430\u043f\u043e\u0432","\u041d\u0435\u043a\u0440\u0430\u0441\u043e\u0432","\u0425\u043e\u0445\u043b\u043e\u0432","\u0416\u0434\u0430\u043d\u043e\u0432","\u041d\u0430\u0443\u043c\u043e\u0432","\u0428\u0438\u043b\u043e\u0432","\u0412\u043e\u0440\u043e\u043d\u0446\u043e\u0432","\u0415\u0440\u043c\u0430\u043a\u043e\u0432","\u0414\u0440\u043e\u0437\u0434\u043e\u0432","\u0418\u0433\u043d\u0430\u0442\u044c\u0435\u0432","\u0421\u0430\u0432\u0438\u043d","\u041b\u043e\u0433\u0438\u043d\u043e\u0432","\u0421\u0430\u0444\u043e\u043d\u043e\u0432","\u041a\u0430\u043f\u0443\u0441\u0442\u0438\u043d","\u041a\u0438\u0440\u0438\u043b\u043b\u043e\u0432","\u041c\u043e\u0438\u0441\u0435\u0435\u0432","\u0415\u043b\u0438\u0441\u0435\u0435\u0432","\u041a\u043e\u0448\u0435\u043b\u0435\u0432","\u041a\u043e\u0441\u0442\u0438\u043d","\u0413\u043e\u0440\u0431\u0430\u0447\u0435\u0432","\u041e\u0440\u0435\u0445\u043e\u0432","\u0415\u0444\u0440\u0435\u043c\u043e\u0432","\u0418\u0441\u0430\u0435\u0432","\u0415\u0432\u0434\u043e\u043a\u0438\u043c\u043e\u0432","\u041a\u0430\u043b\u0430\u0448\u043d\u0438\u043a\u043e\u0432","\u041a\u0430\u0431\u0430\u043d\u043e\u0432","\u041d\u043e\u0441\u043a\u043e\u0432","\u042e\u0434\u0438\u043d","\u041a\u0443\u043b\u0430\u0433\u0438\u043d","\u041b\u0430\u043f\u0438\u043d","\u041f\u0440\u043e\u0445\u043e\u0440\u043e\u0432","\u041d\u0435\u0441\u0442\u0435\u0440\u043e\u0432","\u0425\u0430\u0440\u0438\u0442\u043e\u043d\u043e\u0432","\u0410\u0433\u0430\u0444\u043e\u043d\u043e\u0432","\u041c\u0443\u0440\u0430\u0432\u044c\u0435\u0432","\u041b\u0430\u0440\u0438\u043e\u043d\u043e\u0432","\u0424\u0435\u0434\u043e\u0441\u0435\u0435\u0432","\u0417\u0438\u043c\u0438\u043d","\u041f\u0430\u0445\u043e\u043c\u043e\u0432","\u0428\u0443\u0431\u0438\u043d","\u0418\u0433\u043d\u0430\u0442\u043e\u0432","\u0424\u0438\u043b\u0430\u0442\u043e\u0432","\u041a\u0440\u044e\u043a\u043e\u0432","\u0420\u043e\u0433\u043e\u0432","\u041a\u0443\u043b\u0430\u043a\u043e\u0432","\u0422\u0435\u0440\u0435\u043d\u0442\u044c\u0435\u0432","\u041c\u043e\u043b\u0447\u0430\u043d\u043e\u0432","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u043e\u0432","\u0410\u0440\u0442\u0435\u043c\u044c\u0435\u0432","\u0413\u0443\u0440\u044c\u0435\u0432","\u0417\u0438\u043d\u043e\u0432\u044c\u0435\u0432","\u0413\u0440\u0438\u0448\u0438\u043d","\u041a\u043e\u043d\u043e\u043d\u043e\u0432","\u0414\u0435\u043c\u0435\u043d\u0442\u044c\u0435\u0432","\u0421\u0438\u0442\u043d\u0438\u043a\u043e\u0432","\u0421\u0438\u043c\u043e\u043d\u043e\u0432","\u041c\u0438\u0448\u0438\u043d","\u0424\u0430\u0434\u0435\u0435\u0432","\u041a\u043e\u043c\u0438\u0441\u0441\u0430\u0440\u043e\u0432","\u041c\u0430\u043c\u043e\u043d\u0442\u043e\u0432","\u041d\u043e\u0441\u043e\u0432","\u0413\u0443\u043b\u044f\u0435\u0432","\u0428\u0430\u0440\u043e\u0432","\u0423\u0441\u0442\u0438\u043d\u043e\u0432","\u0412\u0438\u0448\u043d\u044f\u043a\u043e\u0432","\u0415\u0432\u0441\u0435\u0435\u0432","\u041b\u0430\u0432\u0440\u0435\u043d\u0442\u044c\u0435\u0432","\u0411\u0440\u0430\u0433\u0438\u043d","\u041a\u043e\u043d\u0441\u0442\u0430\u043d\u0442\u0438\u043d\u043e\u0432","\u041a\u043e\u0440\u043d\u0438\u043b\u043e\u0432","\u0410\u0432\u0434\u0435\u0435\u0432","\u0417\u044b\u043a\u043e\u0432","\u0411\u0438\u0440\u044e\u043a\u043e\u0432","\u0428\u0430\u0440\u0430\u043f\u043e\u0432","\u041d\u0438\u043a\u043e\u043d\u043e\u0432","\u0429\u0443\u043a\u0438\u043d","\u0414\u044c\u044f\u0447\u043a\u043e\u0432","\u041e\u0434\u0438\u043d\u0446\u043e\u0432","\u0421\u0430\u0437\u043e\u043d\u043e\u0432","\u042f\u043a\u0443\u0448\u0435\u0432","\u041a\u0440\u0430\u0441\u0438\u043b\u044c\u043d\u0438\u043a\u043e\u0432","\u0413\u043e\u0440\u0434\u0435\u0435\u0432","\u0421\u0430\u043c\u043e\u0439\u043b\u043e\u0432","\u041a\u043d\u044f\u0437\u0435\u0432","\u0411\u0435\u0441\u043f\u0430\u043b\u043e\u0432","\u0423\u0432\u0430\u0440\u043e\u0432","\u0428\u0430\u0448\u043a\u043e\u0432","\u0411\u043e\u0431\u044b\u043b\u0435\u0432","\u0414\u043e\u0440\u043e\u043d\u0438\u043d","\u0411\u0435\u043b\u043e\u0437\u0435\u0440\u043e\u0432","\u0420\u043e\u0436\u043a\u043e\u0432","\u0421\u0430\u043c\u0441\u043e\u043d\u043e\u0432","\u041c\u044f\u0441\u043d\u0438\u043a\u043e\u0432","\u041b\u0438\u0445\u0430\u0447\u0435\u0432","\u0411\u0443\u0440\u043e\u0432","\u0421\u044b\u0441\u043e\u0435\u0432","\u0424\u043e\u043c\u0438\u0447\u0435\u0432","\u0420\u0443\u0441\u0430\u043a\u043e\u0432","\u0421\u0442\u0440\u0435\u043b\u043a\u043e\u0432","\u0413\u0443\u0449\u0438\u043d","\u0422\u0435\u0442\u0435\u0440\u0438\u043d","\u041a\u043e\u043b\u043e\u0431\u043e\u0432","\u0421\u0443\u0431\u0431\u043e\u0442\u0438\u043d","\u0424\u043e\u043a\u0438\u043d","\u0411\u043b\u043e\u0445\u0438\u043d","\u0421\u0435\u043b\u0438\u0432\u0435\u0440\u0441\u0442\u043e\u0432","\u041f\u0435\u0441\u0442\u043e\u0432","\u041a\u043e\u043d\u0434\u0440\u0430\u0442\u044c\u0435\u0432","\u0421\u0438\u043b\u0438\u043d","\u041c\u0435\u0440\u043a\u0443\u0448\u0435\u0432","\u041b\u044b\u0442\u043a\u0438\u043d","\u0422\u0443\u0440\u043e\u0432"],"female_first_name":["\u0410\u043d\u043d\u0430","\u0410\u043b\u0451\u043d\u0430","\u0410\u043b\u0435\u0432\u0442\u0438\u043d\u0430","\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u0430","\u0410\u043b\u0438\u043d\u0430","\u0410\u043b\u043b\u0430","\u0410\u043d\u0430\u0441\u0442\u0430\u0441\u0438\u044f","\u0410\u043d\u0433\u0435\u043b\u0438\u043d\u0430","\u0410\u043d\u0436\u0435\u043b\u0430","\u0410\u043d\u0436\u0435\u043b\u0438\u043a\u0430","\u0410\u043d\u0442\u043e\u043d\u0438\u0434\u0430","\u0410\u043d\u0442\u043e\u043d\u0438\u043d\u0430","\u0410\u043d\u0444\u0438\u0441\u0430","\u0410\u0440\u0438\u043d\u0430","\u0412\u0430\u043b\u0435\u043d\u0442\u0438\u043d\u0430","\u0412\u0430\u043b\u0435\u0440\u0438\u044f","\u0412\u0430\u0440\u0432\u0430\u0440\u0430","\u0412\u0430\u0441\u0438\u043b\u0438\u0441\u0430","\u0412\u0435\u0440\u0430","\u0412\u0435\u0440\u043e\u043d\u0438\u043a\u0430","\u0412\u0438\u043a\u0442\u043e\u0440\u0438\u044f","\u0413\u0430\u043b\u0438\u043d\u0430","\u0414\u0430\u0440\u044c\u044f","\u0415\u0432\u0433\u0435\u043d\u0438\u044f","\u0415\u043a\u0430\u0442\u0435\u0440\u0438\u043d\u0430","\u0415\u043b\u0435\u043d\u0430","\u0415\u043b\u0438\u0437\u0430\u0432\u0435\u0442\u0430","\u0416\u0430\u043d\u043d\u0430","\u0417\u0438\u043d\u0430\u0438\u0434\u0430","\u0417\u043e\u044f","\u0418\u0440\u0438\u043d\u0430","\u041a\u0438\u0440\u0430","\u041a\u043b\u0430\u0432\u0434\u0438\u044f","\u041a\u0441\u0435\u043d\u0438\u044f","\u041b\u0430\u0440\u0438\u0441\u0430","\u041b\u0438\u0434\u0438\u044f","\u041b\u044e\u0431\u043e\u0432\u044c","\u041b\u044e\u0434\u043c\u0438\u043b\u0430","\u041c\u0430\u0440\u0433\u0430\u0440\u0438\u0442\u0430","\u041c\u0430\u0440\u0438\u043d\u0430","\u041c\u0430\u0440\u0438\u044f","\u041d\u0430\u0434\u0435\u0436\u0434\u0430","\u041d\u0430\u0442\u0430\u043b\u044c\u044f","\u041d\u0438\u043d\u0430","\u041e\u043a\u0441\u0430\u043d\u0430","\u041e\u043b\u044c\u0433\u0430","\u0420\u0430\u0438\u0441\u0430","\u0420\u0435\u0433\u0438\u043d\u0430","\u0420\u0438\u043c\u043c\u0430","\u0421\u0432\u0435\u0442\u043b\u0430\u043d\u0430","\u0421\u043e\u0444\u0438\u044f","\u0422\u0430\u0438\u0441\u0438\u044f","\u0422\u0430\u043c\u0430\u0440\u0430","\u0422\u0430\u0442\u044c\u044f\u043d\u0430","\u0423\u043b\u044c\u044f\u043d\u0430","\u042e\u043b\u0438\u044f"],"female_middle_name":["\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u043d\u0430","\u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u043d\u0430","\u0410\u043b\u044c\u0431\u0435\u0440\u0442\u043e\u0432\u043d\u0430","\u0410\u043d\u0430\u0442\u043e\u043b\u044c\u0435\u0432\u043d\u0430","\u0410\u043d\u0434\u0440\u0435\u0435\u0432\u043d\u0430","\u0410\u043d\u0442\u043e\u043d\u043e\u0432\u043d\u0430","\u0410\u0440\u043a\u0430\u0434\u044c\u0435\u0432\u043d\u0430","\u0410\u0440\u0441\u0435\u043d\u044c\u0435\u0432\u043d\u0430","\u0410\u0440\u0442\u0451\u043c\u043e\u0432\u043d\u0430","\u0411\u043e\u0440\u0438\u0441\u043e\u0432\u043d\u0430","\u0412\u0430\u0434\u0438\u043c\u043e\u0432\u043d\u0430","\u0412\u0430\u043b\u0435\u043d\u0442\u0438\u043d\u043e\u0432\u043d\u0430","\u0412\u0430\u043b\u0435\u0440\u044c\u0435\u0432\u043d\u0430","\u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432\u043d\u0430","\u0412\u0438\u043a\u0442\u043e\u0440\u043e\u0432\u043d\u0430","\u0412\u0438\u0442\u0430\u043b\u044c\u0435\u0432\u043d\u0430","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u043e\u0432\u043d\u0430","\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432\u043e\u0432\u043d\u0430","\u0412\u044f\u0447\u0435\u0441\u043b\u0430\u0432\u043e\u0432\u043d\u0430","\u0413\u0435\u043d\u043d\u0430\u0434\u044c\u0435\u0432\u043d\u0430","\u0413\u0435\u043e\u0440\u0433\u0438\u0435\u0432\u043d\u0430","\u0413\u0435\u0440\u043c\u0430\u043d\u043e\u0432\u043d\u0430","\u0413\u0440\u0438\u0433\u043e\u0440\u044c\u0435\u0432\u043d\u0430","\u0414\u0430\u043d\u0438\u0438\u043b\u043e\u0432\u043d\u0430","\u0414\u0435\u043d\u0438\u0441\u043e\u0432\u043d\u0430","\u0414\u043c\u0438\u0442\u0440\u0438\u0435\u0432\u043d\u0430","\u0415\u0432\u0433\u0435\u043d\u044c\u0435\u0432\u043d\u0430","\u0415\u0433\u043e\u0440\u043e\u0432\u043d\u0430","\u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430","\u0418\u0433\u043d\u0430\u0442\u044c\u0435\u0432\u043d\u0430","\u0418\u0433\u043e\u0440\u0435\u0432\u043d\u0430","\u0418\u043b\u044c\u0438\u043d\u0438\u0447\u043d\u0430","\u041a\u043e\u043d\u0441\u0442\u0430\u043d\u0442\u0438\u043d\u043e\u0432\u043d\u0430","\u041b\u0430\u0432\u0440\u0435\u043d\u0442\u044c\u0435\u0432\u043d\u0430","\u041b\u0435\u043e\u043d\u0438\u0434\u043e\u0432\u043d\u0430","\u041c\u0430\u043a\u0430\u0440\u043e\u0432\u043d\u0430","\u041c\u0430\u043a\u0441\u0438\u043c\u043e\u0432\u043d\u0430","\u041c\u0430\u0442\u0432\u0435\u0435\u0432\u043d\u0430","\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u043d\u0430","\u041d\u0438\u043a\u0438\u0442\u0438\u0447\u043d\u0430","\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432\u043d\u0430","\u041e\u043b\u0435\u0433\u043e\u0432\u043d\u0430","\u0420\u043e\u043c\u0430\u043d\u043e\u0432\u043d\u0430","\u0421\u0435\u043c\u0451\u043d\u043e\u0432\u043d\u0430","\u0421\u0435\u0440\u0433\u0435\u0435\u0432\u043d\u0430","\u0421\u0442\u0430\u043d\u0438\u0441\u043b\u0430\u0432\u043e\u0432\u043d\u0430","\u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432\u043d\u0430","\u0424\u0451\u0434\u043e\u0440\u043e\u0432\u043d\u0430","\u042d\u0434\u0443\u0430\u0440\u0434\u043e\u0432\u043d\u0430","\u042e\u0440\u044c\u0435\u0432\u043d\u0430","\u042f\u0440\u043e\u0441\u043b\u0430\u0432\u043e\u0432\u043d\u0430"],"female_last_name":["\u0421\u043c\u0438\u0440\u043d\u043e\u0432\u0430","\u0418\u0432\u0430\u043d\u043e\u0432\u0430","\u041a\u0443\u0437\u043d\u0435\u0446\u043e\u0432\u0430","\u041f\u043e\u043f\u043e\u0432\u0430","\u0421\u043e\u043a\u043e\u043b\u043e\u0432\u0430","\u041b\u0435\u0431\u0435\u0434\u0435\u0432\u0430","\u041a\u043e\u0437\u043b\u043e\u0432\u0430","\u041d\u043e\u0432\u0438\u043a\u043e\u0432\u0430","\u041c\u043e\u0440\u043e\u0437\u043e\u0432\u0430","\u041f\u0435\u0442\u0440\u043e\u0432\u0430","\u0412\u043e\u043b\u043a\u043e\u0432\u0430","\u0421\u043e\u043b\u043e\u0432\u044c\u0435\u0432\u0430","\u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432\u0430","\u0417\u0430\u0439\u0446\u0435\u0432\u0430","\u041f\u0430\u0432\u043b\u043e\u0432\u0430","\u0421\u0435\u043c\u0435\u043d\u043e\u0432\u0430","\u0413\u043e\u043b\u0443\u0431\u0435\u0432\u0430","\u0412\u0438\u043d\u043e\u0433\u0440\u0430\u0434\u043e\u0432\u0430","\u0411\u043e\u0433\u0434\u0430\u043d\u043e\u0432\u0430","\u0412\u043e\u0440\u043e\u0431\u044c\u0435\u0432\u0430","\u0424\u0435\u0434\u043e\u0440\u043e\u0432\u0430","\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u0430","\u0411\u0435\u043b\u044f\u0435\u0432\u0430","\u0422\u0430\u0440\u0430\u0441\u043e\u0432\u0430","\u0411\u0435\u043b\u043e\u0432\u0430","\u041a\u043e\u043c\u0430\u0440\u043e\u0432\u0430","\u041e\u0440\u043b\u043e\u0432\u0430","\u041a\u0438\u0441\u0435\u043b\u0435\u0432\u0430","\u041c\u0430\u043a\u0430\u0440\u043e\u0432\u0430","\u0410\u043d\u0434\u0440\u0435\u0435\u0432\u0430","\u041a\u043e\u0432\u0430\u043b\u0435\u0432\u0430","\u0418\u043b\u044c\u0438\u043d\u0430","\u0413\u0443\u0441\u0435\u0432\u0430","\u0422\u0438\u0442\u043e\u0432\u0430","\u041a\u0443\u0437\u044c\u043c\u0438\u043d\u0430","\u041a\u0443\u0434\u0440\u044f\u0432\u0446\u0435\u0432\u0430","\u0411\u0430\u0440\u0430\u043d\u043e\u0432\u0430","\u041a\u0443\u043b\u0438\u043a\u043e\u0432\u0430","\u0410\u043b\u0435\u043a\u0441\u0435\u0435\u0432\u0430","\u0421\u0442\u0435\u043f\u0430\u043d\u043e\u0432\u0430","\u042f\u043a\u043e\u0432\u043b\u0435\u0432\u0430","\u0421\u043e\u0440\u043e\u043a\u0438\u043d\u0430","\u0421\u0435\u0440\u0433\u0435\u0435\u0432\u0430","\u0420\u043e\u043c\u0430\u043d\u043e\u0432\u0430","\u0417\u0430\u0445\u0430\u0440\u043e\u0432\u0430","\u0411\u043e\u0440\u0438\u0441\u043e\u0432\u0430","\u041a\u043e\u0440\u043e\u043b\u0435\u0432\u0430","\u0413\u0435\u0440\u0430\u0441\u0438\u043c\u043e\u0432\u0430","\u041f\u043e\u043d\u043e\u043c\u0430\u0440\u0435\u0432\u0430","\u0413\u0440\u0438\u0433\u043e\u0440\u044c\u0435\u0432\u0430","\u041b\u0430\u0437\u0430\u0440\u0435\u0432\u0430","\u041c\u0435\u0434\u0432\u0435\u0434\u0435\u0432\u0430","\u0415\u0440\u0448\u043e\u0432\u0430","\u041d\u0438\u043a\u0438\u0442\u0438\u043d\u0430","\u0421\u043e\u0431\u043e\u043b\u0435\u0432\u0430","\u0420\u044f\u0431\u043e\u0432\u0430","\u041f\u043e\u043b\u044f\u043a\u043e\u0432\u0430","\u0426\u0432\u0435\u0442\u043a\u043e\u0432\u0430","\u0414\u0430\u043d\u0438\u043b\u043e\u0432\u0430","\u0416\u0443\u043a\u043e\u0432\u0430","\u0424\u0440\u043e\u043b\u043e\u0432\u0430","\u0416\u0443\u0440\u0430\u0432\u043b\u0435\u0432\u0430","\u041d\u0438\u043a\u043e\u043b\u0430\u0435\u0432\u0430","\u041a\u0440\u044b\u043b\u043e\u0432\u0430","\u041c\u0430\u043a\u0441\u0438\u043c\u043e\u0432\u0430","\u0421\u0438\u0434\u043e\u0440\u043e\u0432\u0430","\u041e\u0441\u0438\u043f\u043e\u0432\u0430","\u0411\u0435\u043b\u043e\u0443\u0441\u043e\u0432\u0430","\u0424\u0435\u0434\u043e\u0442\u043e\u0432\u0430","\u0414\u043e\u0440\u043e\u0444\u0435\u0435\u0432\u0430","\u0415\u0433\u043e\u0440\u043e\u0432\u0430","\u041c\u0430\u0442\u0432\u0435\u0435\u0432\u0430","\u0411\u043e\u0431\u0440\u043e\u0432\u0430","\u0414\u043c\u0438\u0442\u0440\u0438\u0435\u0432\u0430","\u041a\u0430\u043b\u0438\u043d\u0438\u043d\u0430","\u0410\u043d\u0438\u0441\u0438\u043c\u043e\u0432\u0430","\u041f\u0435\u0442\u0443\u0445\u043e\u0432\u0430","\u0410\u043d\u0442\u043e\u043d\u043e\u0432\u0430","\u0422\u0438\u043c\u043e\u0444\u0435\u0435\u0432\u0430","\u041d\u0438\u043a\u0438\u0444\u043e\u0440\u043e\u0432\u0430","\u0412\u0435\u0441\u0435\u043b\u043e\u0432\u0430","\u0424\u0438\u043b\u0438\u043f\u043f\u043e\u0432\u0430","\u041c\u0430\u0440\u043a\u043e\u0432\u0430","\u0411\u043e\u043b\u044c\u0448\u0430\u043a\u043e\u0432\u0430","\u0421\u0443\u0445\u0430\u043d\u043e\u0432\u0430","\u041c\u0438\u0440\u043e\u043d\u043e\u0432\u0430","\u0428\u0438\u0440\u044f\u0435\u0432\u0430","\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u0430","\u041a\u043e\u043d\u043e\u0432\u0430\u043b\u043e\u0432\u0430","\u0428\u0435\u0441\u0442\u0430\u043a\u043e\u0432\u0430","\u041a\u0430\u0437\u0430\u043a\u043e\u0432\u0430","\u0415\u0444\u0438\u043c\u043e\u0432\u0430","\u0414\u0435\u043d\u0438\u0441\u043e\u0432\u0430","\u0413\u0440\u043e\u043c\u043e\u0432\u0430","\u0424\u043e\u043c\u0438\u043d\u0430","\u0414\u0430\u0432\u044b\u0434\u043e\u0432\u0430","\u041c\u0435\u043b\u044c\u043d\u0438\u043a\u043e\u0432\u0430","\u0429\u0435\u0440\u0431\u0430\u043a\u043e\u0432\u0430","\u0411\u043b\u0438\u043d\u043e\u0432\u0430","\u041a\u043e\u043b\u0435\u0441\u043d\u0438\u043a\u043e\u0432\u0430","\u041a\u0430\u0440\u043f\u043e\u0432\u0430","\u0410\u0444\u0430\u043d\u0430\u0441\u044c\u0435\u0432\u0430","\u0412\u043b\u0430\u0441\u043e\u0432\u0430","\u041c\u0430\u0441\u043b\u043e\u0432\u0430","\u0418\u0441\u0430\u043a\u043e\u0432\u0430","\u0422\u0438\u0445\u043e\u043d\u043e\u0432\u0430","\u0410\u043a\u0441\u0435\u043d\u043e\u0432\u0430","\u0413\u0430\u0432\u0440\u0438\u043b\u043e\u0432\u0430","\u0420\u043e\u0434\u0438\u043e\u043d\u043e\u0432\u0430","\u041a\u043e\u0442\u043e\u0432\u0430","\u0413\u043e\u0440\u0431\u0443\u043d\u043e\u0432\u0430","\u041a\u0443\u0434\u0440\u044f\u0448\u043e\u0432\u0430","\u0411\u044b\u043a\u043e\u0432\u0430","\u0417\u0443\u0435\u0432\u0430","\u0422\u0440\u0435\u0442\u044c\u044f\u043a\u043e\u0432\u0430","\u0421\u0430\u0432\u0435\u043b\u044c\u0435\u0432\u0430","\u041f\u0430\u043d\u043e\u0432\u0430","\u0420\u044b\u0431\u0430\u043a\u043e\u0432\u0430","\u0421\u0443\u0432\u043e\u0440\u043e\u0432\u0430","\u0410\u0431\u0440\u0430\u043c\u043e\u0432\u0430","\u0412\u043e\u0440\u043e\u043d\u043e\u0432\u0430","\u041c\u0443\u0445\u0438\u043d\u0430","\u0410\u0440\u0445\u0438\u043f\u043e\u0432\u0430","\u0422\u0440\u043e\u0444\u0438\u043c\u043e\u0432\u0430","\u041c\u0430\u0440\u0442\u044b\u043d\u043e\u0432\u0430","\u0415\u043c\u0435\u043b\u044c\u044f\u043d\u043e\u0432\u0430","\u0413\u043e\u0440\u0448\u043a\u043e\u0432\u0430","\u0427\u0435\u0440\u043d\u043e\u0432\u0430","\u041e\u0432\u0447\u0438\u043d\u043d\u0438\u043a\u043e\u0432\u0430","\u0421\u0435\u043b\u0435\u0437\u043d\u0435\u0432\u0430","\u041f\u0430\u043d\u0444\u0438\u043b\u043e\u0432\u0430","\u041a\u043e\u043f\u044b\u043b\u043e\u0432\u0430","\u041c\u0438\u0445\u0435\u0435\u0432\u0430","\u0413\u0430\u043b\u043a\u0438\u043d\u0430","\u041d\u0430\u0437\u0430\u0440\u043e\u0432\u0430","\u041b\u043e\u0431\u0430\u043d\u043e\u0432\u0430","\u041b\u0443\u043a\u0438\u043d\u0430","\u0411\u0435\u043b\u044f\u043a\u043e\u0432\u0430","\u041f\u043e\u0442\u0430\u043f\u043e\u0432\u0430","\u041d\u0435\u043a\u0440\u0430\u0441\u043e\u0432\u0430","\u0425\u043e\u0445\u043b\u043e\u0432\u0430","\u0416\u0434\u0430\u043d\u043e\u0432\u0430","\u041d\u0430\u0443\u043c\u043e\u0432\u0430","\u0428\u0438\u043b\u043e\u0432\u0430","\u0412\u043e\u0440\u043e\u043d\u0446\u043e\u0432\u0430","\u0415\u0440\u043c\u0430\u043a\u043e\u0432\u0430","\u0414\u0440\u043e\u0437\u0434\u043e\u0432\u0430","\u0418\u0433\u043d\u0430\u0442\u044c\u0435\u0432\u0430","\u0421\u0430\u0432\u0438\u043d\u0430","\u041b\u043e\u0433\u0438\u043d\u043e\u0432\u0430","\u0421\u0430\u0444\u043e\u043d\u043e\u0432\u0430","\u041a\u0430\u043f\u0443\u0441\u0442\u0438\u043d\u0430","\u041a\u0438\u0440\u0438\u043b\u043b\u043e\u0432\u0430","\u041c\u043e\u0438\u0441\u0435\u0435\u0432\u0430","\u0415\u043b\u0438\u0441\u0435\u0435\u0432\u0430","\u041a\u043e\u0448\u0435\u043b\u0435\u0432\u0430","\u041a\u043e\u0441\u0442\u0438\u043d\u0430","\u0413\u043e\u0440\u0431\u0430\u0447\u0435\u0432\u0430","\u041e\u0440\u0435\u0445\u043e\u0432\u0430","\u0415\u0444\u0440\u0435\u043c\u043e\u0432\u0430","\u0418\u0441\u0430\u0435\u0432\u0430","\u0415\u0432\u0434\u043e\u043a\u0438\u043c\u043e\u0432\u0430","\u041a\u0430\u043b\u0430\u0448\u043d\u0438\u043a\u043e\u0432\u0430","\u041a\u0430\u0431\u0430\u043d\u043e\u0432\u0430","\u041d\u043e\u0441\u043a\u043e\u0432\u0430","\u042e\u0434\u0438\u043d\u0430","\u041a\u0443\u043b\u0430\u0433\u0438\u043d\u0430","\u041b\u0430\u043f\u0438\u043d\u0430","\u041f\u0440\u043e\u0445\u043e\u0440\u043e\u0432\u0430","\u041d\u0435\u0441\u0442\u0435\u0440\u043e\u0432\u0430","\u0425\u0430\u0440\u0438\u0442\u043e\u043d\u043e\u0432\u0430","\u0410\u0433\u0430\u0444\u043e\u043d\u043e\u0432\u0430","\u041c\u0443\u0440\u0430\u0432\u044c\u0435\u0432\u0430","\u041b\u0430\u0440\u0438\u043e\u043d\u043e\u0432\u0430","\u0424\u0435\u0434\u043e\u0441\u0435\u0435\u0432\u0430","\u0417\u0438\u043c\u0438\u043d\u0430","\u041f\u0430\u0445\u043e\u043c\u043e\u0432\u0430","\u0428\u0443\u0431\u0438\u043d\u0430","\u0418\u0433\u043d\u0430\u0442\u043e\u0432\u0430","\u0424\u0438\u043b\u0430\u0442\u043e\u0432\u0430","\u041a\u0440\u044e\u043a\u043e\u0432\u0430","\u0420\u043e\u0433\u043e\u0432\u0430","\u041a\u0443\u043b\u0430\u043a\u043e\u0432\u0430","\u0422\u0435\u0440\u0435\u043d\u0442\u044c\u0435\u0432\u0430","\u041c\u043e\u043b\u0447\u0430\u043d\u043e\u0432\u0430","\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u043e\u0432\u0430","\u0410\u0440\u0442\u0435\u043c\u044c\u0435\u0432\u0430","\u0413\u0443\u0440\u044c\u0435\u0432\u0430","\u0417\u0438\u043d\u043e\u0432\u044c\u0435\u0432\u0430","\u0413\u0440\u0438\u0448\u0438\u043d\u0430","\u041a\u043e\u043d\u043e\u043d\u043e\u0432\u0430","\u0414\u0435\u043c\u0435\u043d\u0442\u044c\u0435\u0432\u0430","\u0421\u0438\u0442\u043d\u0438\u043a\u043e\u0432\u0430","\u0421\u0438\u043c\u043e\u043d\u043e\u0432\u0430","\u041c\u0438\u0448\u0438\u043d\u0430","\u0424\u0430\u0434\u0435\u0435\u0432\u0430","\u041a\u043e\u043c\u0438\u0441\u0441\u0430\u0440\u043e\u0432\u0430","\u041c\u0430\u043c\u043e\u043d\u0442\u043e\u0432\u0430","\u041d\u043e\u0441\u043e\u0432\u0430","\u0413\u0443\u043b\u044f\u0435\u0432\u0430","\u0428\u0430\u0440\u043e\u0432\u0430","\u0423\u0441\u0442\u0438\u043d\u043e\u0432\u0430","\u0412\u0438\u0448\u043d\u044f\u043a\u043e\u0432\u0430","\u0415\u0432\u0441\u0435\u0435\u0432\u0430","\u041b\u0430\u0432\u0440\u0435\u043d\u0442\u044c\u0435\u0432\u0430","\u0411\u0440\u0430\u0433\u0438\u043d\u0430","\u041a\u043e\u043d\u0441\u0442\u0430\u043d\u0442\u0438\u043d\u043e\u0432\u0430","\u041a\u043e\u0440\u043d\u0438\u043b\u043e\u0432\u0430","\u0410\u0432\u0434\u0435\u0435\u0432\u0430","\u0417\u044b\u043a\u043e\u0432\u0430","\u0411\u0438\u0440\u044e\u043a\u043e\u0432\u0430","\u0428\u0430\u0440\u0430\u043f\u043e\u0432\u0430","\u041d\u0438\u043a\u043e\u043d\u043e\u0432\u0430","\u0429\u0443\u043a\u0438\u043d\u0430","\u0414\u044c\u044f\u0447\u043a\u043e\u0432\u0430","\u041e\u0434\u0438\u043d\u0446\u043e\u0432\u0430","\u0421\u0430\u0437\u043e\u043d\u043e\u0432\u0430","\u042f\u043a\u0443\u0448\u0435\u0432\u0430","\u041a\u0440\u0430\u0441\u0438\u043b\u044c\u043d\u0438\u043a\u043e\u0432\u0430","\u0413\u043e\u0440\u0434\u0435\u0435\u0432\u0430","\u0421\u0430\u043c\u043e\u0439\u043b\u043e\u0432\u0430","\u041a\u043d\u044f\u0437\u0435\u0432\u0430","\u0411\u0435\u0441\u043f\u0430\u043b\u043e\u0432\u0430","\u0423\u0432\u0430\u0440\u043e\u0432\u0430","\u0428\u0430\u0448\u043a\u043e\u0432\u0430","\u0411\u043e\u0431\u044b\u043b\u0435\u0432\u0430","\u0414\u043e\u0440\u043e\u043d\u0438\u043d\u0430","\u0411\u0435\u043b\u043e\u0437\u0435\u0440\u043e\u0432\u0430","\u0420\u043e\u0436\u043a\u043e\u0432\u0430","\u0421\u0430\u043c\u0441\u043e\u043d\u043e\u0432\u0430","\u041c\u044f\u0441\u043d\u0438\u043a\u043e\u0432\u0430","\u041b\u0438\u0445\u0430\u0447\u0435\u0432\u0430","\u0411\u0443\u0440\u043e\u0432\u0430","\u0421\u044b\u0441\u043e\u0435\u0432\u0430","\u0424\u043e\u043c\u0438\u0447\u0435\u0432\u0430","\u0420\u0443\u0441\u0430\u043a\u043e\u0432\u0430","\u0421\u0442\u0440\u0435\u043b\u043a\u043e\u0432\u0430","\u0413\u0443\u0449\u0438\u043d\u0430","\u0422\u0435\u0442\u0435\u0440\u0438\u043d\u0430","\u041a\u043e\u043b\u043e\u0431\u043e\u0432\u0430","\u0421\u0443\u0431\u0431\u043e\u0442\u0438\u043d\u0430","\u0424\u043e\u043a\u0438\u043d\u0430","\u0411\u043b\u043e\u0445\u0438\u043d\u0430","\u0421\u0435\u043b\u0438\u0432\u0435\u0440\u0441\u0442\u043e\u0432\u0430","\u041f\u0435\u0441\u0442\u043e\u0432\u0430","\u041a\u043e\u043d\u0434\u0440\u0430\u0442\u044c\u0435\u0432\u0430","\u0421\u0438\u043b\u0438\u043d\u0430","\u041c\u0435\u0440\u043a\u0443\u0448\u0435\u0432\u0430","\u041b\u044b\u0442\u043a\u0438\u043d\u0430","\u0422\u0443\u0440\u043e\u0432\u0430"],"name":["#{male_first_name} #{male_last_name}","#{male_last_name} #{male_first_name}","#{male_first_name} #{male_middle_name} #{male_last_name}","#{male_last_name} #{male_first_name} #{male_middle_name}","#{female_first_name} #{female_last_name}","#{female_last_name} #{female_first_name}","#{female_first_name} #{female_middle_name} #{female_last_name}","#{female_last_name} #{female_first_name} #{female_middle_name}"]},"phone_number":{"formats":["(9##)###-##-##"]},"commerce":{"color":["\u043a\u0440\u0430\u0441\u043d\u044b\u0439","\u0437\u0435\u043b\u0435\u043d\u044b\u0439","\u0441\u0438\u043d\u0438\u0439","\u0436\u0435\u043b\u0442\u044b\u0439","\u0431\u0430\u0433\u0440\u043e\u0432\u044b\u0439","\u043c\u044f\u0442\u043d\u044b\u0439","\u0437\u0435\u043b\u0435\u043d\u043e\u0432\u0430\u0442\u043e-\u0433\u043e\u043b\u0443\u0431\u043e\u0439","\u0431\u0435\u043b\u044b\u0439","\u0447\u0435\u0440\u043d\u044b\u0439","\u043e\u0440\u0430\u043d\u0436\u0435\u0432\u044b\u0439","\u0440\u043e\u0437\u043e\u0432\u044b\u0439","\u0441\u0435\u0440\u044b\u0439","\u043a\u0440\u0430\u0441\u043d\u043e-\u043a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439","\u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439","\u0431\u0438\u0440\u044e\u0437\u043e\u0432\u044b\u0439","\u0436\u0435\u043b\u0442\u043e-\u043a\u043e\u0440\u0438\u0447\u043d\u0435\u0432\u044b\u0439","\u043d\u0435\u0431\u0435\u0441\u043d\u043e \u0433\u043e\u043b\u0443\u0431\u043e\u0439","\u043e\u0440\u0430\u043d\u0436\u0435\u0432\u043e-\u0440\u043e\u0437\u043e\u0432\u044b\u0439","\u0442\u0435\u043c\u043d\u043e-\u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439","\u043e\u0440\u0445\u0438\u0434\u043d\u044b\u0439","\u043e\u043b\u0438\u0432\u043a\u043e\u0432\u044b\u0439","\u043f\u0443\u0440\u043f\u0443\u0440\u043d\u044b\u0439","\u043b\u0438\u043c\u043e\u043d\u043d\u044b\u0439","\u043a\u0440\u0435\u043c\u043e\u0432\u044b\u0439","\u0441\u0438\u043d\u0435-\u0444\u0438\u043e\u043b\u0435\u0442\u043e\u0432\u044b\u0439","\u0437\u043e\u043b\u043e\u0442\u043e\u0439","\u043a\u0440\u0430\u0441\u043d\u043e-\u043f\u0443\u0440\u043f\u0443\u0440\u043d\u044b\u0439","\u0433\u043e\u043b\u0443\u0431\u043e\u0439","\u043b\u0430\u0437\u0443\u0440\u043d\u044b\u0439","\u043b\u0438\u043b\u043e\u0432\u044b\u0439","\u0441\u0435\u0440\u0435\u0431\u0440\u044f\u043d\u044b\u0439"],"department":["\u041a\u043d\u0438\u0433\u0438","\u0424\u0438\u043b\u044c\u043c\u044b, \u043c\u0443\u0437\u044b\u043a\u0430 \u0438 \u0438\u0433\u0440\u044b","\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u0438\u043a\u0430 \u0438 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u044b","\u0414\u043e\u043c, \u0441\u0430\u0434 \u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442","\u0411\u0430\u043a\u0430\u043b\u0435\u044f, \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u0435 \u0438 \u043a\u0440\u0430\u0441\u043e\u0442\u0430","\u0418\u0433\u0440\u0443\u0448\u043a\u0438, \u0434\u0435\u0442\u0441\u043a\u043e\u0435 \u0438 \u0434\u043b\u044f \u043c\u0430\u043b\u044b\u0448\u0435\u0439","\u041e\u0434\u0435\u0436\u0434\u0430, \u043e\u0431\u0443\u0432\u044c \u0438 \u0443\u043a\u0440\u0430\u0448\u0435\u043d\u0438\u044f","\u0421\u043f\u043e\u0440\u0442 \u0438 \u0442\u0443\u0440\u0438\u0437\u043c","\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044c\u043d\u043e\u0435 \u0438 \u043f\u0440\u043e\u043c\u044b\u0448\u043b\u0435\u043d\u043d\u043e\u0435"],"product_name":{"adjective":["\u041c\u0430\u043b\u0435\u043d\u044c\u043a\u0438\u0439","\u042d\u0440\u0433\u043e\u043d\u043e\u043c\u0438\u0447\u043d\u044b\u0439","\u0413\u0440\u0443\u0431\u044b\u0439","\u0418\u043d\u0442\u0435\u043b\u043b\u0435\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u0439","\u0412\u0435\u043b\u0438\u043a\u043e\u043b\u0435\u043f\u043d\u044b\u0439","\u041d\u0435\u0432\u0435\u0440\u043e\u044f\u0442\u043d\u044b\u0439","\u0424\u0430\u043d\u0442\u0430\u0441\u0442\u0438\u0447\u0435\u0441\u043a\u0438\u0439","\u041f\u0440\u0430\u043a\u0442\u0447\u0438\u043d\u044b\u0439","\u041b\u043e\u0441\u043d\u044f\u0449\u0438\u0439\u0441\u044f","\u041f\u043e\u0442\u0440\u044f\u0441\u0430\u044e\u0449\u0438\u0439"],"material":["\u0421\u0442\u0430\u043b\u044c\u043d\u043e\u0439","\u0414\u0435\u0440\u0435\u0432\u044f\u043d\u043d\u044b\u0439","\u0411\u0435\u0442\u043e\u043d\u043d\u044b\u0439","\u041f\u043b\u0430\u0441\u0442\u0438\u043a\u043e\u0432\u044b\u0439","\u0425\u043b\u043e\u043f\u043a\u043e\u0432\u044b\u0439","\u0413\u0440\u0430\u043d\u0438\u0442\u043d\u044b\u0439","\u0420\u0435\u0437\u0438\u043d\u043e\u0432\u044b\u0439"],"product":["\u0421\u0442\u0443\u043b","\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0438\u043b\u044c","\u041a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440","\u0411\u0435\u0440\u0435\u0442","\u041a\u0443\u043b\u043e\u043d","\u0421\u0442\u043e\u043b","\u0421\u0432\u0438\u0442\u0435\u0440","\u0420\u0435\u043c\u0435\u043d\u044c","\u0411\u043e\u0442\u0438\u043d\u043e\u043a"]}}}},"fa":{"faker":{"name":{"first_name":["\u0622\u0628\u0627\u0646 \u062f\u062e\u062a","\u0622\u0628\u062a\u06cc\u0646","\u0622\u062a\u0648\u0633\u0627","\u0622\u0641\u0631","\u0622\u0641\u0631\u0647 \u062f\u062e\u062a","\u0622\u0630\u0631\u0646\u0648\u0634\u200c","\u0622\u0630\u06cc\u0646","\u0622\u0631\u0627\u0647","\u0622\u0631\u0632\u0648","\u0622\u0631\u0634","\u0622\u0631\u062a\u06cc\u0646","\u0622\u0631\u062a\u0627\u0645","\u0622\u0631\u062a\u0645\u0646","\u0622\u0631\u0634\u0627\u0645","\u0622\u0631\u0645\u0627\u0646","\u0622\u0631\u0645\u06cc\u0646","\u0622\u0631\u0645\u06cc\u062a\u0627","\u0622\u0631\u06cc\u0627 \u0641\u0631","\u0622\u0631\u06cc\u0627","\u0622\u0631\u06cc\u0627 \u0645\u0647\u0631","\u0622\u0631\u06cc\u0646","\u0622\u0632\u0627\u062f\u0647","\u0622\u0632\u0631\u0645","\u0622\u0632\u0631\u0645\u062f\u062e\u062a","\u0622\u0632\u06cc\u062a\u0627","\u0622\u0646\u0627\u0647\u06cc\u062a\u0627","\u0622\u0648\u0646\u06af","\u0622\u0647\u0648","\u0622\u06cc\u062f\u0627","\u0627\u062a\u0633\u0632","\u0627\u062e\u062a\u0631","\u0627\u0631\u062f","\u0627\u0631\u062f \u0634\u06cc\u0631","\u0627\u0631\u062f\u0648\u0627\u0646","\u0627\u0631\u0698\u0646","\u0627\u0631\u0698\u0646\u06af","\u0627\u0631\u0633\u0644\u0627\u0646","\u0627\u0631\u063a\u0648\u0627\u0646","\u0627\u0631\u0645\u063a\u0627\u0646","\u0627\u0631\u0646\u0648\u0627\u0632","\u0627\u0631\u0648\u0627\u0646\u0647","\u0627\u0633\u062a\u0631","\u0627\u0633\u0641\u0646\u062f\u06cc\u0627\u0631","\u0627\u0634\u06a9\u0627\u0646","\u0627\u0634\u06a9\u0628\u0648\u0633","\u0627\u0641\u0633\u0627\u0646\u0647","\u0627\u0641\u0633\u0648\u0646","\u0627\u0641\u0634\u06cc\u0646","\u0627\u0645\u06cc\u062f","\u0627\u0646\u0648\u0634 (\u200c \u0622\u0646\u0648\u0634\u0627 )","\u0627\u0646\u0648\u0634\u0631\u0648\u0627\u0646","\u0627\u0648\u0631\u0646\u06af","\u0627\u0648\u0698\u0646","\u0627\u0648\u0633\u062a\u0627","\u0627\u0647\u0648\u0631\u0627","\u0627\u06cc\u0627\u0632","\u0627\u06cc\u0631\u0627\u0646","\u0627\u06cc\u0631\u0627\u0646\u062f\u062e\u062a","\u0627\u06cc\u0631\u062c","\u0627\u06cc\u0632\u062f\u06cc\u0627\u0631","\u0628\u0627\u0628\u06a9","\u0628\u0627\u067e\u0648\u06a9","\u0628\u0627\u0631\u0628\u062f","\u0628\u0627\u0631\u0645\u0627\u0646","\u0628\u0627\u0645\u062f\u0627\u062f","\u0628\u0627\u0645\u0634\u0627\u062f","\u0628\u0627\u0646\u0648","\u0628\u062e\u062a\u06cc\u0627\u0631","\u0628\u0631\u0627\u0646\u0648\u0634","\u0628\u0631\u062f\u06cc\u0627","\u0628\u0631\u0632\u0648","\u0628\u0631\u0632\u0648\u06cc\u0647","\u0628\u0631\u0632\u06cc\u0646","\u0628\u0631\u0645\u06a9","\u0628\u0632\u0631\u06af\u0645\u0647\u0631","\u0628\u0646\u0641\u0634\u0647","\u0628\u0648\u0698\u0627\u0646","\u0628\u0648\u06cc\u0627\u0646","\u0628\u0647\u0627\u0631","\u0628\u0647\u0627\u0631\u06a9","\u0628\u0647\u0627\u0631\u0647","\u0628\u0647\u062a\u0627\u0634","\u0628\u0647\u062f\u0627\u062f","\u0628\u0647\u0631\u0627\u0645","\u0628\u0647\u062f\u06cc\u0633","\u0628\u0647\u0631\u062e","\u0628\u0647\u0631\u0646\u06af","\u0628\u0647\u0631\u0648\u0632","\u0628\u0647\u0632\u0627\u062f","\u0628\u0647\u0634\u0627\u062f","\u0628\u0647\u0645\u0646","\u0628\u0647\u0646\u0627\u0632","\u0628\u0647\u0646\u0627\u0645","\u0628\u0647\u0646\u0648\u062f","\u0628\u0647\u0646\u0648\u0634","\u0628\u06cc\u062a\u0627","\u0628\u06cc\u0698\u0646","\u067e\u0627\u0631\u0633\u0627","\u067e\u0627\u06a9\u0627\u0646","\u067e\u0627\u06a9\u062a\u0646","\u067e\u0627\u06a9\u062f\u062e\u062a","\u067e\u0627\u0646\u062a\u0647 \u0622","\u067e\u062f\u0631\u0627\u0645","\u067e\u0631\u062a\u0648","\u067e\u0631\u0634\u0646\u06af","\u067e\u0631\u062a\u0648","\u067e\u0631\u0633\u062a\u0648","\u067e\u0631\u0648\u06cc\u0632","\u067e\u0631\u062f\u06cc\u0633","\u067e\u0631\u0647\u0627\u0645","\u067e\u0698\u0645\u0627\u0646","\u067e\u0698\u0648\u0627","\u067e\u0631\u0646\u06cc\u0627","\u067e\u0634\u0646\u06af","\u067e\u0631\u0648\u0627\u0646\u0647","\u067e\u0631\u0648\u06cc\u0646","\u067e\u0631\u06cc","\u067e\u0631\u06cc\u0686\u0647\u0631","\u067e\u0631\u06cc\u062f\u062e\u062a","\u067e\u0631\u06cc\u0633\u0627","\u067e\u0631\u0646\u0627\u0632","\u067e\u0631\u06cc\u0648\u0634","\u067e\u0631\u06cc\u0627","\u067e\u0648\u067e\u06a9","\u067e\u0648\u0631\u0627\u0646","\u067e\u0648\u0631\u0627\u0646\u062f\u062e\u062a","\u067e\u0648\u0631\u06cc\u0627","\u067e\u0648\u0644\u0627\u062f","\u067e\u0648\u06cc\u0627","\u067e\u0648\u0646\u0647","\u067e\u06cc\u0627\u0645","\u067e\u06cc\u0631\u0648\u0632","\u067e\u06cc\u0645\u0627\u0646","\u062a\u0627\u0628\u0627\u0646","\u062a\u0627\u0628\u0627\u0646\u062f\u062e\u062a","\u062a\u0627\u062c\u06cc","\u062a\u0627\u0631\u0627","\u062a\u0627\u0648\u06cc\u0627\u0631","\u062a\u0631\u0627\u0646\u0647","\u062a\u0646\u0627\u0632","\u062a\u0648\u0631\u0627\u0646","\u062a\u0648\u0631\u0627\u0646\u062f\u062e\u062a","\u062a\u0648\u0631\u062c","\u062a\u0648\u0631\u062a\u06a9","\u062a\u0648\u0641\u0627\u0646","\u062a\u0648\u0698\u0627\u0644","\u062a\u06cc\u0631 \u062f\u0627\u062f","\u062a\u06cc\u0646\u0627","\u062a\u06cc\u0646\u0648","\u062c\u0627\u0628\u0627\u0646","\u062c\u0627\u0645\u06cc\u0646","\u062c\u0627\u0648\u06cc\u062f","\u062c\u0631\u06cc\u0631\u0647","\u062c\u0645\u0634\u06cc\u062f","\u062c\u0648\u0627\u0646","\u062c\u0648\u06cc\u0627","\u062c\u0647\u0627\u0646","\u062c\u0647\u0627\u0646\u0628\u062e\u062a","\u062c\u0647\u0627\u0646\u0628\u062e\u0634","\u062c\u0647\u0627\u0646\u062f\u0627\u0631","\u062c\u0647\u0627\u0646\u06af\u06cc\u0631","\u062c\u0647\u0627\u0646 \u0628\u0627\u0646\u0648","\u062c\u0647\u0627\u0646\u062f\u062e\u062a","\u062c\u0647\u0627\u0646 \u0646\u0627\u0632","\u062c\u06cc\u0631\u0627\u0646","\u0686\u0627\u0628\u06a9","\u0686\u0627\u0644\u0627\u06a9","\u0686\u0627\u0648\u0634","\u0686\u062a\u0631\u0627","\u0686\u0648\u0628\u06cc\u0646","\u0686\u0647\u0631\u0632\u0627\u062f","\u062e\u0627\u0648\u0631\u062f\u062e\u062a","\u062e\u062f\u0627\u062f\u0627\u062f","\u062e\u062f\u0627\u06cc\u0627\u0631","\u062e\u0631\u0645","\u062e\u0631\u0645\u062f\u062e\u062a","\u062e\u0633\u0631\u0648","\u062e\u0634\u0627\u06cc\u0627\u0631","\u062e\u0648\u0631\u0634\u06cc\u062f","\u062f\u0627\u062f\u0645\u0647\u0631","\u062f\u0627\u0631\u0627","\u062f\u0627\u0631\u0627\u0628","\u062f\u0627\u0631\u06cc\u0627","\u062f\u0627\u0631\u06cc\u0648\u0634","\u062f\u0627\u0646\u0648\u0634","\u062f\u0627\u0648\u0631\u200c","\u062f\u0627\u06cc\u0627\u0646","\u062f\u0631\u06cc\u0627","\u062f\u0644 \u0622\u0631\u0627","\u062f\u0644 \u0622\u0648\u06cc\u0632","\u062f\u0644\u0627\u0631\u0627\u0645","\u062f\u0644 \u0627\u0646\u06af\u06cc\u0632","\u062f\u0644\u0628\u0631","\u062f\u0644\u0628\u0646\u062f","\u062f\u0644\u0631\u0628\u0627","\u062f\u0644\u0634\u0627\u062f","\u062f\u0644\u06a9\u0634","\u062f\u0644\u0646\u0627\u0632","\u062f\u0644\u0646\u0648\u0627\u0632","\u062f\u0648\u0631\u0634\u0627\u0633\u0628","\u062f\u0646\u06cc\u0627","\u062f\u06cc\u0627\u0627\u06a9\u0648","\u062f\u06cc\u0627\u0646\u0648\u0634","\u062f\u06cc\u0628\u0627","\u062f\u06cc\u0628\u0627 \u062f\u062e\u062a","\u0631\u0627\u0628\u0648","\u0631\u0627\u0628\u06cc\u0646","\u0631\u0627\u062f\u0628\u0627\u0646\u0648","\u0631\u0627\u062f\u0645\u0627\u0646","\u0631\u0627\u0632\u0628\u0627\u0646","\u0631\u0627\u0698\u0627\u0646\u0647","\u0631\u0627\u0633\u0627","\u0631\u0627\u0645\u062a\u06cc\u0646","\u0631\u0627\u0645\u0634","\u0631\u0627\u0645\u0634\u06af\u0631","\u0631\u0627\u0645\u0648\u0646\u0627","\u0631\u0627\u0645\u06cc\u0627\u0631","\u0631\u0627\u0645\u06cc\u0644\u0627","\u0631\u0627\u0645\u06cc\u0646","\u0631\u0627\u0648\u06cc\u0627\u0631","\u0631\u0698\u06cc\u0646\u0627","\u0631\u062e\u067e\u0627\u06a9","\u0631\u062e\u0633\u0627\u0631","\u0631\u062e\u0634\u0627\u0646\u0647","\u0631\u062e\u0634\u0646\u062f\u0647","\u0631\u0632\u0645\u06cc\u0627\u0631","\u0631\u0633\u062a\u0645","\u0631\u06a9\u0633\u0627\u0646\u0627","\u0631\u0648\u0628\u06cc\u0646\u0627","\u0631\u0648\u062f\u0627\u0628\u0647","\u0631\u0648\u0632\u0628\u0647","\u0631\u0648\u0634\u0646\u06a9","\u0631\u0648\u0646\u0627\u06a9","\u0631\u0647\u0627\u0645","\u0631\u0647\u06cc","\u0631\u06cc\u0628\u0627\u0631","\u0631\u0627\u0633\u067e\u06cc\u0646\u0627","\u0632\u0627\u062f\u0628\u062e\u062a","\u0632\u0627\u062f \u0628\u0647","\u0632\u0627\u062f \u0686\u0647\u0631","\u0632\u0627\u062f \u0641\u0631","\u0632\u0627\u0644","\u0632\u0627\u062f\u0645\u0627\u0633\u0628","\u0632\u0627\u0648\u0627","\u0632\u0631\u062f\u0634\u062a","\u0632\u0631\u0646\u06af\u0627\u0631","\u0632\u0631\u06cc","\u0632\u0631\u06cc\u0646","\u0632\u0631\u06cc\u0646\u0647","\u0632\u0645\u0627\u0646\u0647","\u0632\u0648\u0646\u0627","\u0632\u06cc\u0628\u0627","\u0632\u06cc\u0628\u0627\u0631","\u0632\u06cc\u0645\u0627","\u0632\u06cc\u0646\u0648","\u0698\u0627\u0644\u0647","\u0698\u0627\u0644\u0627\u0646","\u0698\u06cc\u0627\u0631","\u0698\u06cc\u0646\u0627","\u0698\u06cc\u0648\u0627\u0631","\u0633\u0627\u0631\u0627","\u0633\u0627\u0631\u06a9","\u0633\u0627\u0631\u0646\u06af","\u0633\u0627\u0631\u0647","\u0633\u0627\u0633\u0627\u0646","\u0633\u0627\u063a\u0631","\u0633\u0627\u0645","\u0633\u0627\u0645\u0627\u0646","\u0633\u0627\u0646\u0627","\u0633\u0627\u0646\u0627\u0632","\u0633\u0627\u0646\u06cc\u0627\u0631","\u0633\u0627\u0648\u06cc\u0632","\u0633\u0627\u0647\u06cc","\u0633\u0627\u06cc\u0646\u0627","\u0633\u0627\u06cc\u0647","\u0633\u067e\u0646\u062a\u0627","\u0633\u067e\u0646\u062f","\u0633\u067e\u0647\u0631","\u0633\u067e\u0647\u0631\u062f\u0627\u062f","\u0633\u067e\u06cc\u062f\u0627\u0631","\u0633\u067e\u06cc\u062f \u0628\u0627\u0646\u0648","\u0633\u067e\u06cc\u062f\u0647","\u0633\u062a\u0627\u0631\u0647","\u0633\u062a\u06cc","\u0633\u0631\u0627\u0641\u0631\u0627\u0632","\u0633\u0631\u0648\u0631","\u0633\u0631\u0648\u0634","\u0633\u0631\u0648\u0631","\u0633\u0648\u0628\u0627","\u0633\u0648\u0628\u0627\u0631","\u0633\u0646\u0628\u0644\u0647","\u0633\u0648\u062f\u0627\u0628\u0647","\u0633\u0648\u0631\u06cc","\u0633\u0648\u0631\u0646","\u0633\u0648\u0631\u0646\u0627","\u0633\u0648\u0632\u0627\u0646","\u0633\u0648\u0632\u0647","\u0633\u0648\u0633\u0646","\u0633\u0648\u0645\u0627\u0631","\u0633\u0648\u0644\u0627\u0646","\u0633\u0648\u0644\u0645\u0627\u0632","\u0633\u0648\u06af\u0646\u062f","\u0633\u0647\u0631\u0627\u0628","\u0633\u0647\u0631\u0647","\u0633\u0647\u0646\u062f","\u0633\u06cc\u0627\u0645\u06a9","\u0633\u06cc\u0627\u0648\u0634","\u0633\u06cc\u0628\u0648\u0628\u0647 \u200c","\u0633\u06cc\u0645\u0627","\u0633\u06cc\u0645\u062f\u062e\u062a","\u0633\u06cc\u0646\u0627","\u0633\u06cc\u0645\u06cc\u0646","\u0633\u06cc\u0645\u06cc\u0646 \u062f\u062e\u062a","\u0634\u0627\u067e\u0631\u06a9","\u0634\u0627\u062f\u06cc","\u0634\u0627\u062f\u0645\u0647\u0631","\u0634\u0627\u0631\u0627\u0646","\u0634\u0627\u0647\u067e\u0648\u0631","\u0634\u0627\u0647\u062f\u062e\u062a","\u0634\u0627\u0647\u0631\u062e","\u0634\u0627\u0647\u06cc\u0646","\u0634\u0627\u0647\u06cc\u0646\u062f\u062e\u062a","\u0634\u0627\u06cc\u0633\u062a\u0647","\u0634\u0628\u0627\u0647\u0646\u06af","\u0634\u0628 \u0628\u0648","\u0634\u0628\u062f\u06cc\u0632","\u0634\u0628\u0646\u0645","\u0634\u0631\u0627\u0631\u0647","\u0634\u0631\u0645\u06cc\u0646","\u0634\u0631\u0648\u06cc\u0646","\u0634\u06a9\u0648\u0641\u0647","\u0634\u06a9\u0641\u062a\u0647","\u0634\u0645\u0634\u0627\u062f","\u0634\u0645\u06cc\u0646","\u0634\u0648\u0627\u0646","\u0634\u0645\u06cc\u0644\u0627","\u0634\u0648\u0631\u0627\u0646\u06af\u06cc\u0632","\u0634\u0648\u0631\u06cc","\u0634\u0647\u0627\u0628","\u0634\u0647\u0628\u0627\u0631","\u0634\u0647\u0628\u0627\u0632","\u0634\u0647\u0628\u0627\u0644","\u0634\u0647\u067e\u0631","\u0634\u0647\u062f\u0627\u062f","\u0634\u0647\u0631\u0622\u0631\u0627","\u0634\u0647\u0631\u0627\u0645","\u0634\u0647\u0631\u0628\u0627\u0646\u0648","\u0634\u0647\u0631\u0632\u0627\u062f","\u0634\u0647\u0631\u0646\u0627\u0632","\u0634\u0647\u0631\u0646\u0648\u0634","\u0634\u0647\u0631\u0647","\u0634\u0647\u0631\u06cc\u0627\u0631","\u0634\u0647\u0631\u0632\u0627\u062f","\u0634\u0647\u0644\u0627","\u0634\u0647\u0646\u0648\u0627\u0632","\u0634\u0647\u06cc\u0646","\u0634\u06cc\u0628\u0627","\u0634\u06cc\u062f\u0627","\u0634\u06cc\u062f\u0647","\u0634\u06cc\u0631\u062f\u0644","\u0634\u06cc\u0631\u0632\u0627\u062f","\u0634\u06cc\u0631\u0646\u06af","\u0634\u06cc\u0631\u0648","\u0634\u06cc\u0631\u06cc\u0646 \u062f\u062e\u062a","\u0634\u06cc\u0645\u0627","\u0634\u06cc\u0646\u0627","\u0634\u06cc\u0631\u06cc\u0646","\u0634\u06cc\u0648\u0627","\u0637\u0648\u0633","\u0637\u0648\u0637\u06cc","\u0637\u0647\u0645\u0627\u0633\u0628","\u0637\u0647\u0645\u0648\u0631\u062b","\u063a\u0648\u063a\u0627","\u063a\u0646\u0686\u0647","\u0641\u062a\u0627\u0646\u0647","\u0641\u062f\u0627","\u0641\u0631\u0627\u0632","\u0641\u0631\u0627\u0645\u0631\u0632","\u0641\u0631\u0627\u0646\u06a9","\u0641\u0631\u0627\u0647\u0627\u0646","\u0641\u0631\u0628\u062f","\u0641\u0631\u0628\u063a","\u0641\u0631\u062c\u0627\u062f","\u0641\u0631\u062e","\u0641\u0631\u062e \u067e\u06cc","\u0641\u0631\u062e \u062f\u0627\u062f","\u0641\u0631\u062e \u0631\u0648","\u0641\u0631\u062e \u0632\u0627\u062f","\u0641\u0631\u062e \u0644\u0642\u0627","\u0641\u0631\u062e \u0645\u0647\u0631","\u0641\u0631\u062f\u0627\u062f","\u0641\u0631\u062f\u06cc\u0633","\u0641\u0631\u06cc\u0646","\u0641\u0631\u0632\u0627\u062f","\u0641\u0631\u0632\u0627\u0645","\u0641\u0631\u0632\u0627\u0646","\u0641\u0631\u0632\u0627\u0646\u0647","\u0641\u0631\u0632\u06cc\u0646","\u0641\u0631\u0634\u0627\u062f","\u0641\u0631\u0634\u062a\u0647","\u0641\u0631\u0634\u06cc\u062f","\u0641\u0631\u0645\u0627\u0646","\u0641\u0631\u0646\u0627\u0632","\u0641\u0631\u0646\u06af\u06cc\u0633","\u0641\u0631\u0646\u0648\u062f","\u0641\u0631\u0646\u0648\u0634","\u0641\u0631\u0646\u06cc\u0627","\u0641\u0631\u0648\u062a\u0646","\u0641\u0631\u0648\u062f","\u0641\u0631\u0648\u0632","\u0641\u0631\u0648\u0632\u0627\u0646","\u0641\u0631\u0648\u0632\u0634","\u0641\u0631\u0648\u0632\u0646\u062f\u0647","\u0641\u0631\u0648\u063a","\u0641\u0631\u0647\u0627\u062f","\u0641\u0631\u0647\u0646\u06af","\u0641\u0631\u0647\u0648\u062f","\u0641\u0631\u0628\u0627\u0631","\u0641\u0631\u06cc\u0628\u0627","\u0641\u0631\u06cc\u062f","\u0641\u0631\u06cc\u062f\u062e\u062a","\u0641\u0631\u06cc\u062f\u0648\u0646","\u0641\u0631\u06cc\u0645\u0627\u0646","\u0641\u0631\u06cc\u0646\u0627\u0632","\u0641\u0631\u06cc\u0646\u0648\u0634","\u0641\u0631\u06cc\u0648\u0634","\u0641\u06cc\u0631\u0648\u0632","\u0641\u06cc\u0631\u0648\u0632\u0647","\u0642\u0627\u0628\u0648\u0633","\u0642\u0628\u0627\u062f","\u0642\u062f\u0633\u06cc","\u06a9\u0627\u0628\u0627\u0646","\u06a9\u0627\u0628\u0648\u06a9","\u06a9\u0627\u0631\u0627","\u06a9\u0627\u0631\u0648","\u06a9\u0627\u0631\u0627\u06a9\u0648","\u06a9\u0627\u0645\u0628\u062e\u062a","\u06a9\u0627\u0645\u0628\u062e\u0634","\u06a9\u0627\u0645\u0628\u06cc\u0632","\u06a9\u0627\u0645\u062c\u0648","\u06a9\u0627\u0645\u062f\u06cc\u0646","\u06a9\u0627\u0645\u0631\u0627\u0646","\u06a9\u0627\u0645\u0631\u0627\u0648\u0627","\u06a9\u0627\u0645\u06a9","\u06a9\u0627\u0645\u0646\u0648\u0634","\u06a9\u0627\u0645\u06cc\u0627\u0631","\u06a9\u0627\u0646\u06cc\u0627\u0631","\u06a9\u0627\u0648\u0648\u0633","\u06a9\u0627\u0648\u0647","\u06a9\u062a\u0627\u06cc\u0648\u0646","\u06a9\u0631\u0634\u0645\u0647","\u06a9\u0633\u0631\u06cc","\u06a9\u0644\u0627\u0644\u0647","\u06a9\u0645\u0628\u0648\u062c\u06cc\u0647","\u06a9\u0648\u0634\u0627","\u06a9\u0647\u0628\u062f","\u06a9\u0647\u0631\u0627\u0645","\u06a9\u0647\u0632\u0627\u062f","\u06a9\u06cc\u0627\u0631\u0634","\u06a9\u06cc\u0627\u0646","\u06a9\u06cc\u0627\u0646\u0627","\u06a9\u06cc\u0627\u0646\u0686\u0647\u0631","\u06a9\u06cc\u0627\u0646\u062f\u062e\u062a","\u06a9\u06cc\u0627\u0646\u0648\u0634","\u06a9\u06cc\u0627\u0648\u0634","\u06a9\u06cc\u062e\u0633\u0631\u0648","\u06a9\u06cc\u0642\u0628\u0627\u062f","\u06a9\u06cc\u06a9\u0627\u0648\u0648\u0633","\u06a9\u06cc\u0648\u0627\u0646","\u06a9\u06cc\u0648\u0627\u0646 \u062f\u062e\u062a","\u06a9\u06cc\u0648\u0645\u0631\u062b","\u06a9\u06cc\u0647\u0627\u0646","\u06a9\u06cc\u0627\u0646\u062f\u062e\u062a","\u06a9\u06cc\u0647\u0627\u0646\u0647","\u06af\u0631\u062f \u0622\u0641\u0631\u06cc\u062f","\u06af\u0631\u062f\u0627\u0646","\u06af\u0631\u0634\u0627","\u06af\u0631\u0634\u0627\u0633\u0628","\u06af\u0631\u0634\u06cc\u0646","\u06af\u0631\u06af\u06cc\u0646","\u06af\u0632\u0644","\u06af\u0634\u062a\u0627\u0633\u0628","\u06af\u0634\u0633\u0628","\u06af\u0634\u0633\u0628 \u0628\u0627\u0646\u0648","\u06af\u0644","\u06af\u0644 \u0622\u0630\u06cc\u0646","\u06af\u0644 \u0622\u0631\u0627\u200c","\u06af\u0644\u0627\u0631\u0647","\u06af\u0644 \u0627\u0641\u0631\u0648\u0632","\u06af\u0644\u0627\u0644\u0647","\u06af\u0644 \u0627\u0646\u062f\u0627\u0645","\u06af\u0644\u0627\u0648\u06cc\u0632","\u06af\u0644\u0628\u0627\u062f","\u06af\u0644\u0628\u0627\u0631","\u06af\u0644\u0628\u0627\u0645","\u06af\u0644\u0628\u0627\u0646","\u06af\u0644\u0628\u0627\u0646\u0648","\u06af\u0644\u0628\u0631\u06af","\u06af\u0644\u0628\u0648","\u06af\u0644\u0628\u0647\u0627\u0631","\u06af\u0644\u0628\u06cc\u0632","\u06af\u0644\u067e\u0627\u0631\u0647","\u06af\u0644\u067e\u0631","\u06af\u0644\u067e\u0631\u06cc","\u06af\u0644\u067e\u0648\u0634","\u06af\u0644 \u067e\u0648\u0646\u0647","\u06af\u0644\u0686\u06cc\u0646","\u06af\u0644\u062f\u062e\u062a","\u06af\u0644\u062f\u06cc\u0633","\u06af\u0644\u0631\u0628\u0627","\u06af\u0644\u0631\u062e","\u06af\u0644\u0631\u0646\u06af","\u06af\u0644\u0631\u0648","\u06af\u0644\u0634\u0646","\u06af\u0644\u0631\u06cc\u0632","\u06af\u0644\u0632\u0627\u062f","\u06af\u0644\u0632\u0627\u0631","\u06af\u0644\u0633\u0627","\u06af\u0644\u0634\u06cc\u062f","\u06af\u0644\u0646\u0627\u0631","\u06af\u0644\u0646\u0627\u0632","\u06af\u0644\u0646\u0633\u0627","\u06af\u0644\u0646\u0648\u0627\u0632","\u06af\u0644\u0646\u0648\u0634","\u06af\u0644\u06cc","\u06af\u0648\u062f\u0631\u0632","\u06af\u0648\u0645\u0627\u062a\u0648","\u06af\u0647\u0631 \u0686\u0647\u0631","\u06af\u0648\u0647\u0631 \u0646\u0627\u0632","\u06af\u06cc\u062a\u06cc","\u06af\u06cc\u0633\u0648","\u06af\u06cc\u0644\u062f\u0627","\u06af\u06cc\u0648","\u0644\u0627\u062f\u0646","\u0644\u0627\u0644\u0647","\u0644\u0627\u0644\u0647 \u0631\u062e","\u0644\u0627\u0644\u0647 \u062f\u062e\u062a","\u0644\u0628\u062e\u0646\u062f","\u0644\u0642\u0627\u0621","\u0644\u0648\u0645\u0627\u0646\u0627","\u0644\u0647\u0631\u0627\u0633\u0628","\u0645\u0627\u0631\u0627\u0644","\u0645\u0627\u0631\u06cc","\u0645\u0627\u0632\u06cc\u0627\u0631","\u0645\u0627\u06a9\u0627\u0646","\u0645\u0627\u0645\u06a9","\u0645\u0627\u0646\u0627","\u0645\u0627\u0646\u062f\u0627\u0646\u0627","\u0645\u0627\u0646\u0648\u0634","\u0645\u0627\u0646\u06cc","\u0645\u0627\u0646\u06cc\u0627","\u0645\u0627\u0647\u0627\u0646","\u0645\u0627\u0647\u0627\u0646\u062f\u062e\u062a","\u0645\u0627\u0647 \u0628\u0631\u0632\u06cc\u0646","\u0645\u0627\u0647 \u062c\u0647\u0627\u0646","\u0645\u0627\u0647\u0686\u0647\u0631","\u0645\u0627\u0647\u062f\u062e\u062a","\u0645\u0627\u0647\u0648\u0631","\u0645\u0627\u0647\u0631\u062e","\u0645\u0627\u0647\u0632\u0627\u062f","\u0645\u0631\u062f\u0622\u0648\u06cc\u0632","\u0645\u0631\u062f\u0627\u0633","\u0645\u0631\u0632\u0628\u0627\u0646","\u0645\u0631\u0645\u0631","\u0645\u0632\u062f\u06a9","\u0645\u0698\u062f\u0647","\u0645\u0698\u06af\u0627\u0646","\u0645\u0633\u062a\u0627\u0646","\u0645\u0633\u062a\u0627\u0646\u0647","\u0645\u0634\u06a9\u0627\u0646\u062f\u062e\u062a","\u0645\u0634\u06a9\u0646\u0627\u0632","\u0645\u0634\u06a9\u06cc\u0646 \u062f\u062e\u062a","\u0645\u0646\u06cc\u0698\u0647","\u0645\u0646\u0648\u0686\u0647\u0631","\u0645\u0647\u0628\u0627\u0646\u0648","\u0645\u0647\u0628\u062f","\u0645\u0647 \u062f\u0627\u062f","\u0645\u0647\u062a\u0627\u0628","\u0645\u0647\u062f\u06cc\u0633","\u0645\u0647 \u062c\u0628\u06cc\u0646","\u0645\u0647 \u062f\u062e\u062a","\u0645\u0647\u0631 \u0622\u0630\u0631","\u0645\u0647\u0631 \u0622\u0631\u0627","\u0645\u0647\u0631 \u0622\u0633\u0627","\u0645\u0647\u0631 \u0622\u0641\u0627\u0642","\u0645\u0647\u0631 \u0627\u0641\u0631\u06cc\u0646","\u0645\u0647\u0631\u0622\u0628","\u0645\u0647\u0631\u062f\u0627\u062f","\u0645\u0647\u0631 \u0627\u0641\u0632\u0648\u0646","\u0645\u0647\u0631\u0627\u0645","\u0645\u0647\u0631\u0627\u0646","\u0645\u0647\u0631\u0627\u0646\u062f\u062e\u062a","\u0645\u0647\u0631\u0627\u0646\u062f\u06cc\u0634","\u0645\u0647\u0631\u0627\u0646\u0641\u0631","\u0645\u0647\u0631\u0627\u0646\u06af\u06cc\u0632","\u0645\u0647\u0631\u062f\u0627\u062f","\u0645\u0647\u0631 \u062f\u062e\u062a","\u0645\u0647\u0631\u0632\u0627\u062f\u0647 \u200c","\u0645\u0647\u0631\u0646\u0627\u0632","\u0645\u0647\u0631\u0646\u0648\u0634","\u0645\u0647\u0631\u0646\u06a9\u0627\u0631","\u0645\u0647\u0631\u0646\u06cc\u0627","\u0645\u0647\u0631\u0648\u0632","\u0645\u0647\u0631\u06cc","\u0645\u0647\u0631\u06cc\u0627\u0631","\u0645\u0647\u0633\u0627","\u0645\u0647\u0633\u062a\u06cc","\u0645\u0647 \u0633\u06cc\u0645\u0627","\u0645\u0647\u0634\u0627\u062f","\u0645\u0647\u0634\u06cc\u062f","\u0645\u0647\u0646\u0627\u0645","\u0645\u0647\u0646\u0627\u0632","\u0645\u0647\u0646\u0648\u0634","\u0645\u0647\u0648\u0634","\u0645\u0647\u06cc\u0627\u0631","\u0645\u0647\u06cc\u0646","\u0645\u0647\u06cc\u0646 \u062f\u062e\u062a","\u0645\u06cc\u062a\u0631\u0627","\u0645\u06cc\u062e\u06a9","\u0645\u06cc\u0646\u0627","\u0645\u06cc\u0646\u0627 \u062f\u062e\u062a","\u0645\u06cc\u0646\u0648","\u0645\u06cc\u0646\u0648\u062f\u062e\u062a","\u0645\u06cc\u0646\u0648 \u0641\u0631","\u0646\u0627\u062f\u0631","\u0646\u0627\u0632 \u0622\u0641\u0631\u06cc\u0646","\u0646\u0627\u0632\u0628\u0627\u0646\u0648","\u0646\u0627\u0632\u067e\u0631\u0648\u0631","\u0646\u0627\u0632\u0686\u0647\u0631","\u0646\u0627\u0632\u0641\u0631","\u0646\u0627\u0632\u0644\u06cc","\u0646\u0627\u0632\u06cc","\u0646\u0627\u0632\u06cc\u062f\u062e\u062a","\u0646\u0627\u0645\u0648\u0631","\u0646\u0627\u0647\u06cc\u062f","\u0646\u062f\u0627","\u0646\u0631\u0633\u06cc","\u0646\u0631\u06af\u0633","\u0646\u0631\u0645\u06a9","\u0646\u0631\u0645\u06cc\u0646","\u0646\u0631\u06cc\u0645\u0627\u0646","\u0646\u0633\u062a\u0631\u0646","\u0646\u0633\u0631\u06cc\u0646","\u0646\u0633\u0631\u06cc\u0646 \u062f\u062e\u062a","\u0646\u0633\u0631\u06cc\u0646 \u0646\u0648\u0634","\u0646\u06a9\u06cc\u0633\u0627","\u0646\u06af\u0627\u0631","\u0646\u06af\u0627\u0631\u0647","\u0646\u06af\u0627\u0631\u06cc\u0646","\u0646\u06af\u06cc\u0646","\u0646\u0648\u0627","\u0646\u0648\u0634","\u0646\u0648\u0634 \u0622\u0630\u0631","\u0646\u0648\u0634 \u0622\u0648\u0631","\u0646\u0648\u0634\u0627","\u0646\u0648\u0634 \u0622\u0641\u0631\u06cc\u0646","\u0646\u0648\u0634\u062f\u062e\u062a","\u0646\u0648\u0634\u0631\u0648\u0627\u0646","\u0646\u0648\u0634\u0641\u0631","\u0646\u0648\u0634\u0646\u0627\u0632","\u0646\u0648\u0634\u06cc\u0646","\u0646\u0648\u06cc\u062f","\u0646\u0648\u06cc\u0646","\u0646\u0648\u06cc\u0646 \u062f\u062e\u062a","\u0646\u06cc\u0634 \u0627","\u0646\u06cc\u06a9 \u0628\u06cc\u0646","\u0646\u06cc\u06a9 \u067e\u06cc","\u0646\u06cc\u06a9 \u0686\u0647\u0631","\u0646\u06cc\u06a9 \u062e\u0648\u0627\u0647","\u0646\u06cc\u06a9\u062f\u0627\u062f","\u0646\u06cc\u06a9\u062f\u062e\u062a","\u0646\u06cc\u06a9\u062f\u0644","\u0646\u06cc\u06a9\u0632\u0627\u062f","\u0646\u06cc\u0644\u0648\u0641\u0631","\u0646\u06cc\u0645\u0627","\u0648\u0627\u0645\u0642","\u0648\u0631\u062c\u0627\u0648\u0646\u062f","\u0648\u0631\u06cc\u0627","\u0648\u0634\u0645\u06af\u06cc\u0631","\u0648\u0647\u0631\u0632","\u0648\u0647\u0633\u0648\u062f\u0627\u0646","\u0648\u06cc\u062f\u0627","\u0648\u06cc\u0633","\u0648\u06cc\u0634\u062a\u0627\u0633\u0628","\u0648\u06cc\u06af\u0646","\u0647\u0698\u06cc\u0631","\u0647\u062e\u0627\u0645\u0646\u0634","\u0647\u0631\u0628\u062f( \u0647\u06cc\u0631\u0628\u062f )","\u0647\u0631\u0645\u0632","\u0647\u0645\u0627\u06cc\u0648\u0646","\u0647\u0645\u0627","\u0647\u0645\u0627\u062f\u062e\u062a","\u0647\u0645\u062f\u0645","\u0647\u0645\u0631\u0627\u0632","\u0647\u0645\u0631\u0627\u0647","\u0647\u0646\u06af\u0627\u0645\u0647","\u0647\u0648\u062a\u0646","\u0647\u0648\u0631","\u0647\u0648\u0631\u062a\u0627\u0634","\u0647\u0648\u0631\u0686\u0647\u0631","\u0647\u0648\u0631\u062f\u0627\u062f","\u0647\u0648\u0631\u062f\u062e\u062a","\u0647\u0648\u0631\u0632\u0627\u062f","\u0647\u0648\u0631\u0645\u0646\u062f","\u0647\u0648\u0631\u0648\u0634","\u0647\u0648\u0634\u0646\u06af","\u0647\u0648\u0634\u06cc\u0627\u0631","\u0647\u0648\u0645\u0627\u0646","\u0647\u0648\u0645\u0646","\u0647\u0648\u0646\u0627\u0645","\u0647\u0648\u06cc\u062f\u0627","\u0647\u06cc\u062a\u0627\u0633\u0628","\u0647\u06cc\u0631\u0645\u0646\u062f","\u0647\u06cc\u0645\u0627","\u0647\u06cc\u0648\u0627","\u06cc\u0627\u062f\u06af\u0627\u0631","\u06cc\u0627\u0633\u0645\u0646 ( \u06cc\u0627\u0633\u0645\u06cc\u0646 )","\u06cc\u0627\u0634\u0627\u0631","\u06cc\u0627\u0648\u0631","\u06cc\u0632\u062f\u0627\u0646","\u06cc\u06af\u0627\u0646\u0647","\u06cc\u0648\u0634\u06cc\u062a\u0627"],"last_name":["\u0639\u0627\u0631\u0641","\u0639\u0627\u0634\u0648\u0631\u06cc","\u0639\u0627\u0644\u06cc","\u0639\u0628\u0627\u062f\u06cc","\u0639\u0628\u062f\u0627\u0644\u06a9\u0631\u06cc\u0645\u06cc","\u0639\u0628\u062f\u0627\u0644\u0645\u0644\u06a9\u06cc","\u0639\u0631\u0627\u0642\u06cc","\u0639\u0632\u06cc\u0632\u06cc","\u0639\u0635\u0627\u0631","\u0639\u0642\u06cc\u0644\u06cc","\u0639\u0644\u0645","\u0639\u0644\u0645\u200c\u0627\u0644\u0647\u062f\u06cc","\u0639\u0644\u06cc \u0639\u0633\u06af\u0631\u06cc","\u0639\u0644\u06cc\u200c\u0622\u0628\u0627\u062f\u06cc","\u0639\u0644\u06cc\u0627","\u0639\u0644\u06cc\u200c\u067e\u0648\u0631","\u0639\u0644\u06cc\u200c\u0632\u0645\u0627\u0646\u06cc","\u0639\u0646\u0627\u06cc\u062a","\u063a\u0636\u0646\u0641\u0631\u06cc","\u063a\u0646\u06cc","\u0641\u0627\u0631\u0633\u06cc","\u0641\u0627\u0637\u0645\u06cc","\u0641\u0627\u0646\u06cc","\u0641\u062a\u0627\u062d\u06cc","\u0641\u0631\u0627\u0645\u0631\u0632\u06cc","\u0641\u0631\u062c","\u0641\u0631\u0634\u06cc\u062f\u0648\u0631\u062f","\u0641\u0631\u0645\u0627\u0646\u0641\u0631\u0645\u0627\u0626\u06cc\u0627\u0646","\u0641\u0631\u0648\u062a\u0646","\u0641\u0631\u0647\u0646\u06af","\u0641\u0631\u06cc\u0627\u062f","\u0641\u0646\u0627\u06cc\u06cc","\u0641\u0646\u06cc\u200c\u0632\u0627\u062f\u0647","\u0641\u0648\u0644\u0627\u062f\u0648\u0646\u062f","\u0641\u0647\u0645\u06cc\u062f\u0647","\u0642\u0627\u0636\u06cc","\u0642\u0627\u0646\u0639\u06cc","\u0642\u0627\u0646\u0648\u0646\u06cc","\u0642\u0645\u06cc\u0634\u06cc","\u0642\u0646\u0628\u0631\u06cc","\u0642\u0647\u0631\u0645\u0627\u0646","\u0642\u0647\u0631\u0645\u0627\u0646\u06cc","\u0642\u0647\u0631\u0645\u0627\u0646\u06cc\u0627\u0646","\u0642\u0647\u0633\u062a\u0627\u0646\u06cc","\u06a9\u0627\u0634\u06cc","\u06a9\u0627\u06a9\u0627\u0648\u0646\u062f","\u06a9\u0627\u0645\u06a9\u0627\u0631","\u06a9\u0627\u0645\u0644\u06cc","\u06a9\u0627\u0648\u06cc\u0627\u0646\u06cc","\u06a9\u062f\u06cc\u0648\u0631","\u06a9\u0631\u062f\u0628\u0686\u0647","\u06a9\u0631\u0645\u0627\u0646\u06cc","\u06a9\u0631\u06cc\u0645\u06cc","\u06a9\u0644\u0628\u0627\u0633\u06cc","\u06a9\u0645\u0627\u0644\u06cc","\u06a9\u0648\u0634\u06a9\u06cc","\u06a9\u0647\u0646\u0645\u0648\u06cc\u06cc","\u06a9\u06cc\u0627\u0646","\u06a9\u06cc\u0627\u0646\u06cc (\u0646\u0627\u0645 \u062e\u0627\u0646\u0648\u0627\u062f\u06af\u06cc)","\u06a9\u06cc\u0645\u06cc\u0627\u06cc\u06cc","\u06af\u0644 \u0645\u062d\u0645\u062f\u06cc","\u06af\u0644\u067e\u0627\u06cc\u06af\u0627\u0646\u06cc","\u06af\u0646\u062c\u06cc","\u0644\u0627\u062c\u0648\u0631\u062f\u06cc","\u0644\u0627\u0686\u06cc\u0646\u06cc","\u0644\u0627\u0647\u0648\u062a\u06cc","\u0644\u0646\u06a9\u0631\u0627\u0646\u06cc","\u0644\u0648\u06a9\u0633","\u0645\u062c\u0627\u0647\u062f","\u0645\u062c\u062a\u0628\u0627\u06cc\u06cc","\u0645\u062c\u062a\u0628\u0648\u06cc","\u0645\u062c\u062a\u0647\u062f \u0634\u0628\u0633\u062a\u0631\u06cc","\u0645\u062c\u062a\u0647\u062f\u06cc","\u0645\u062c\u0631\u062f","\u0645\u062d\u062c\u0648\u0628","\u0645\u062d\u062c\u0648\u0628\u06cc","\u0645\u062d\u062f\u062b\u06cc","\u0645\u062d\u0645\u062f\u0631\u0636\u0627\u06cc\u06cc","\u0645\u062d\u0645\u062f\u06cc","\u0645\u062f\u062f\u06cc","\u0645\u0631\u0627\u062f\u062e\u0627\u0646\u06cc","\u0645\u0631\u062a\u0636\u0648\u06cc","\u0645\u0633\u062a\u0648\u0641\u06cc","\u0645\u0634\u0627","\u0645\u0635\u0627\u062d\u0628","\u0645\u0635\u0628\u0627\u062d","\u0645\u0635\u0628\u0627\u062d\u200c\u0632\u0627\u062f\u0647","\u0645\u0637\u0647\u0631\u06cc","\u0645\u0638\u0641\u0631","\u0645\u0639\u0627\u0631\u0641","\u0645\u0639\u0631\u0648\u0641","\u0645\u0639\u06cc\u0646","\u0645\u0641\u062a\u0627\u062d","\u0645\u0641\u062a\u062d","\u0645\u0642\u062f\u0645","\u0645\u0644\u0627\u06cc\u0631\u06cc","\u0645\u0644\u06a9","\u0645\u0644\u06a9\u06cc\u0627\u0646","\u0645\u0646\u0648\u0686\u0647\u0631\u06cc","\u0645\u0648\u062d\u062f","\u0645\u0648\u0633\u0648\u06cc","\u0645\u0648\u0633\u0648\u06cc\u0627\u0646","\u0645\u0647\u0627\u062c\u0631\u0627\u0646\u06cc","\u0645\u0647\u062f\u06cc\u200c\u067e\u0648\u0631","\u0645\u06cc\u0631\u0628\u0627\u0642\u0631\u06cc","\u0645\u06cc\u0631\u062f\u0627\u0645\u0627\u062f\u06cc","\u0645\u06cc\u0631\u0632\u0627\u062f\u0647","\u0645\u06cc\u0631\u0633\u067e\u0627\u0633\u06cc","\u0645\u06cc\u0632\u0628\u0627\u0646\u06cc","\u0646\u0627\u0638\u0631\u06cc","\u0646\u0627\u0645\u0648\u0631","\u0646\u062c\u0641\u06cc","\u0646\u062f\u0648\u0634\u0646","\u0646\u0631\u0627\u0642\u06cc","\u0646\u0639\u0645\u062a\u200c\u0632\u0627\u062f\u0647","\u0646\u0642\u062f\u06cc","\u0646\u0642\u06cc\u0628\u200c\u0632\u0627\u062f\u0647","\u0646\u0648\u0627\u0628","\u0646\u0648\u0628\u062e\u062a","\u0646\u0648\u0628\u062e\u062a\u06cc","\u0646\u0647\u0627\u0648\u0646\u062f\u06cc","\u0646\u06cc\u0634\u0627\u0628\u0648\u0631\u06cc","\u0646\u06cc\u0644\u0648\u0641\u0631\u06cc","\u0648\u0627\u062b\u0642\u06cc","\u0648\u0627\u0639\u0638","\u0648\u0627\u0639\u0638\u200c\u0632\u0627\u062f\u0647","\u0648\u0627\u0639\u0638\u06cc","\u0648\u06a9\u06cc\u0644\u06cc","\u0647\u0627\u0634\u0645\u06cc","\u0647\u0627\u0634\u0645\u06cc \u0631\u0641\u0633\u0646\u062c\u0627\u0646\u06cc","\u0647\u0627\u0634\u0645\u06cc\u0627\u0646","\u0647\u0627\u0645\u0648\u0646","\u0647\u062f\u0627\u06cc\u062a","\u0647\u0631\u0627\u062a\u06cc","\u0647\u0631\u0648\u06cc","\u0647\u0645\u0627\u06cc\u0648\u0646","\u0647\u0645\u062a","\u0647\u0645\u062f\u0627\u0646\u06cc","\u0647\u0648\u0634\u06cc\u0627\u0631","\u0647\u0648\u0645\u0646","\u06cc\u0627\u062d\u0642\u06cc","\u06cc\u0627\u062f\u06af\u0627\u0631","\u06cc\u062b\u0631\u0628\u06cc","\u06cc\u0644\u062f\u0627"],"prefix":["\u0622\u0642\u0627\u06cc","\u062e\u0627\u0646\u0645","\u062f\u06a9\u062a\u0631"]}}},"fr":{"faker":{"address":{"building_number":["####","###","##","#"],"street_prefix":["All\u00e9e, Voie","Rue","Avenue","Boulevard","Quai","Passage","Impasse","Place"],"secondary_address":["Apt. ###","# \u00e9tage"],"postcode":["#####"],"state":["Alsace","Aquitaine","Auvergne","Basse-Normandie","Bourgogne","Bretagne","Centre","Champagne-Ardenne","Corse","Franche-Comt\u00e9","Haute-Normandie","\u00cele-de-France","Languedoc-Roussillon","Limousin","Lorraine","Midi-Pyr\u00e9n\u00e9es","Nord-Pas-de-Calais","Pays de la Loire","Picardie","Poitou-Charentes","Provence-Alpes-C\u00f4te d'Azur","Rh\u00f4ne-Alpes"],"city_name":["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille13","Rennes","Reims","Le Havre","Saint-\u00c9tienne","Toulon","Grenoble","Dijon","Angers","Saint-Denis","Villeurbanne","Le Mans","Aix-en-Provence","Brest","N\u00eemes","Limoges","Clermont-Ferrand","Tours","Amiens","Metz","Perpignan","Besan\u00e7on","Orl\u00e9ans","Boulogne-Billancourt","Mulhouse","Rouen","Caen","Nancy","Saint-Denis","Saint-Paul","Montreuil","Argenteuil","Roubaix","Dunkerque14","Tourcoing","Nanterre","Avignon","Cr\u00e9teil","Poitiers","Fort-de-France","Courbevoie","Versailles","Vitry-sur-Seine","Colombes","Pau","Aulnay-sous-Bois","Asni\u00e8res-sur-Seine","Rueil-Malmaison","Saint-Pierre","Antibes","Saint-Maur-des-Foss\u00e9s","Champigny-sur-Marne","La Rochelle","Aubervilliers","Calais","Cannes","Le Tampon","B\u00e9ziers","Colmar","Bourges","Drancy","M\u00e9rignac","Saint-Nazaire","Valence","Ajaccio","Issy-les-Moulineaux","Villeneuve-d'Ascq","Levallois-Perret","Noisy-le-Grand","Quimper","La Seyne-sur-Mer","Antony","Troyes","Neuilly-sur-Seine","Sarcelles","Les Abymes","V\u00e9nissieux","Clichy","Lorient","Pessac","Ivry-sur-Seine","Cergy","Cayenne","Niort","Chamb\u00e9ry","Montauban","Saint-Quentin","Villejuif","Hy\u00e8res","Beauvais","Cholet"],"city":["#{city_name}"],"street_suffix":["de l'Abbaye","Adolphe Mille","d'Al\u00e9sia","d'Argenteuil","d'Assas","du Bac","de Paris","La Bo\u00e9tie","Bonaparte","de la B\u00fbcherie","de Caumartin","Charlemagne","du Chat-qui-P\u00eache","de la Chauss\u00e9e-d'Antin","du Dahomey","Dauphine","Delesseux","du Faubourg Saint-Honor\u00e9","du Faubourg-Saint-Denis","de la Ferronnerie","des Francs-Bourgeois","des Grands Augustins","de la Harpe","du Havre","de la Huchette","Joubert","Laffitte","Lepic","des Lombards","Marcadet","Moli\u00e8re","Monsieur-le-Prince","de Montmorency","Montorgueil","Mouffetard","de Nesle","Oberkampf","de l'Od\u00e9on","d'Orsel","de la Paix","des Panoramas","Pastourelle","Pierre Charron","de la Pompe","de Presbourg","de Provence","de Richelieu","de Rivoli","des Rosiers","Royale","d'Abbeville","Saint-Honor\u00e9","Saint-Bernard","Saint-Denis","Saint-Dominique","Saint-Jacques","Saint-S\u00e9verin","des Saussaies","de Seine","de Solf\u00e9rino","Du Sommerard","de Tilsitt","Vaneau","de Vaugirard","de la Victoire","Zadkine"],"street_name":["#{street_prefix} #{street_suffix}"],"street_address":["#{building_number} #{street_name}"],"default_country":["France"]},"company":{"suffix":["SARL","SA","EURL","SAS","SEM","SCOP","GIE","EI"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","asymmetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name} et #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.fr","hotmail.fr"],"domain_suffix":["com","fr","eu","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Enzo","Lucas","Mathis","Nathan","Thomas","Hugo","Th\u00e9o","Tom","Louis","Rapha\u00ebl","Cl\u00e9ment","L\u00e9o","Math\u00e9o","Maxime","Alexandre","Antoine","Yanis","Paul","Baptiste","Alexis","Gabriel","Arthur","Jules","Ethan","Noah","Quentin","Axel","Evan","Matt\u00e9o","Romain","Valentin","Maxence","Noa","Adam","Nicolas","Julien","Mael","Pierre","Rayan","Victor","Mohamed","Adrien","Kylian","Sacha","Benjamin","L\u00e9a","Clara","Manon","Chlo\u00e9","Camille","Ines","Sarah","Jade","Lola","Ana\u00efs","Lucie","Oc\u00e9ane","Lilou","Marie","Eva","Romane","Lisa","Zoe","Julie","Mathilde","Louise","Juliette","Cl\u00e9mence","C\u00e9lia","Laura","Lena","Ma\u00eblys","Charlotte","Ambre","Maeva","Pauline","Lina","Jeanne","Lou","No\u00e9mie","Justine","Louna","Elisa","Alice","Emilie","Carla","Ma\u00eblle","Alicia","M\u00e9lissa"],"last_name":["Martin","Bernard","Dubois","Thomas","Robert","Richard","Petit","Durand","Leroy","Moreau","Simon","Laurent","Lefebvre","Michel","Garcia","David","Bertrand","Roux","Vincent","Fournier","Morel","Girard","Andre","Lefevre","Mercier","Dupont","Lambert","Bonnet","Francois","Martinez","Legrand","Garnier","Faure","Rousseau","Blanc","Guerin","Muller","Henry","Roussel","Nicolas","Perrin","Morin","Mathieu","Clement","Gauthier","Dumont","Lopez","Fontaine","Chevalier","Robin","Masson","Sanchez","Gerard","Nguyen","Boyer","Denis","Lemaire","Duval","Joly","Gautier","Roger","Roche","Roy","Noel","Meyer","Lucas","Meunier","Jean","Perez","Marchand","Dufour","Blanchard","Marie","Barbier","Brun","Dumas","Brunet","Schmitt","Leroux","Colin","Fernandez","Pierre","Renard","Arnaud","Rolland","Caron","Aubert","Giraud","Leclerc","Vidal","Bourgeois","Renaud","Lemoine","Picard","Gaillard","Philippe","Leclercq","Lacroix","Fabre","Dupuis","Olivier","Rodriguez","Da silva","Hubert","Louis","Charles","Guillot","Riviere","Le gall","Guillaume","Adam","Rey","Moulin","Gonzalez","Berger","Lecomte","Menard","Fleury","Deschamps","Carpentier","Julien","Benoit","Paris","Maillard","Marchal","Aubry","Vasseur","Le roux","Renault","Jacquet","Collet","Prevost","Poirier","Charpentier","Royer","Huet","Baron","Dupuy","Pons","Paul","Laine","Carre","Breton","Remy","Schneider","Perrot","Guyot","Barre","Marty","Cousin"],"prefix":["M","Mme","Mlle","Dr","Prof"],"title":{"job":["Superviseur","Executif","Manager","Ingenieur","Specialiste","Directeur","Coordinateur","Administrateur","Architecte","Analyste","Designer","Technicien","Developpeur","Producteur","Consultant","Assistant","Agent","Stagiaire"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name}","#{last_name} #{first_name}"]},"phone_number":{"formats":["01########","02########","03########","04########","05########","06########","07########","+33 1########","+33 2########","+33 3########","+33 4########","+33 5########","+33 6########","+33 7########"]}}},"en-IND":{"faker":{"name":{"first_name":["Aadrika","Aanandinii","Aaratrika","Aarya","Arya","Aashritha","Aatmaja","Atmaja","Abhaya","Adwitiya","Agrata","Ahilya","Ahalya","Aishani","Akshainie","Akshata","Akshita","Akula","Ambar","Amodini","Amrita","Amritambu","Anala","Anamika","Ananda","Anandamayi","Ananta","Anila","Anjali","Anjushri","Anjushree","Annapurna","Anshula","Anuja","Anusuya","Anasuya","Anasooya","Anwesha","Apsara","Aruna","Asha","Aasa","Aasha","Aslesha","Atreyi","Atreyee","Avani","Abani","Avantika","Ayushmati","Baidehi","Vaidehi","Bala","Baala","Balamani","Basanti","Vasanti","Bela","Bhadra","Bhagirathi","Bhagwanti","Bhagwati","Bhamini","Bhanumati","Bhaanumati","Bhargavi","Bhavani","Bhilangana","Bilwa","Bilva","Buddhana","Chakrika","Chanda","Chandi","Chandni","Chandini","Chandani","Chandra","Chandira","Chandrabhaga","Chandrakala","Chandrakin","Chandramani","Chandrani","Chandraprabha","Chandraswaroopa","Chandravati","Chapala","Charumati","Charvi","Chatura","Chitrali","Chitramala","Chitrangada","Daksha","Dakshayani","Damayanti","Darshwana","Deepali","Dipali","Deeptimoyee","Deeptimayee","Devangana","Devani","Devasree","Devi","Daevi","Devika","Daevika","Dhaanyalakshmi","Dhanalakshmi","Dhana","Dhanadeepa","Dhara","Dharani","Dharitri","Dhatri","Diksha","Deeksha","Divya","Draupadi","Dulari","Durga","Durgeshwari","Ekaparnika","Elakshi","Enakshi","Esha","Eshana","Eshita","Gautami","Gayatri","Geeta","Geetanjali","Gitanjali","Gemine","Gemini","Girja","Girija","Gita","Hamsini","Harinakshi","Harita","Heema","Himadri","Himani","Hiranya","Indira","Jaimini","Jaya","Jyoti","Jyotsana","Kali","Kalinda","Kalpana","Kalyani","Kama","Kamala","Kamla","Kanchan","Kanishka","Kanti","Kashyapi","Kumari","Kumuda","Lakshmi","Laxmi","Lalita","Lavanya","Leela","Lila","Leela","Madhuri","Malti","Malati","Mandakini","Mandaakin","Mangala","Mangalya","Mani","Manisha","Manjusha","Meena","Mina","Meenakshi","Minakshi","Menka","Menaka","Mohana","Mohini","Nalini","Nikita","Ojaswini","Omana","Oormila","Urmila","Opalina","Opaline","Padma","Parvati","Poornima","Purnima","Pramila","Prasanna","Preity","Prema","Priya","Priyala","Pushti","Radha","Rageswari","Rageshwari","Rajinder","Ramaa","Rati","Rita","Rohana","Rukhmani","Rukmin","Rupinder","Sanya","Sarada","Sharda","Sarala","Sarla","Saraswati","Sarisha","Saroja","Shakti","Shakuntala","Shanti","Sharmila","Shashi","Shashikala","Sheela","Shivakari","Shobhana","Shresth","Shresthi","Shreya","Shreyashi","Shridevi","Shrishti","Shubha","Shubhaprada","Siddhi","Sitara","Sloka","Smita","Smriti","Soma","Subhashini","Subhasini","Sucheta","Sudeva","Sujata","Sukanya","Suma","Suma","Sumitra","Sunita","Suryakantam","Sushma","Swara","Swarnalata","Sweta","Shwet","Tanirika","Tanushree","Tanushri","Tanushri","Tanya","Tara","Trisha","Uma","Usha","Vaijayanti","Vaijayanthi","Baijayanti","Vaishvi","Vaishnavi","Vaishno","Varalakshmi","Vasudha","Vasundhara","Veda","Vedanshi","Vidya","Vimala","Vrinda","Vrund","Aadi","Aadidev","Aadinath","Aaditya","Aagam","Aagney","Aamod","Aanandaswarup","Anand Swarup","Aanjaneya","Anjaneya","Aaryan","Aryan","Aatmaj","Aatreya","Aayushmaan","Aayushman","Abhaidev","Abhaya","Abhirath","Abhisyanta","Acaryatanaya","Achalesvara","Acharyanandana","Acharyasuta","Achintya","Achyut","Adheesh","Adhiraj","Adhrit","Adikavi","Adinath","Aditeya","Aditya","Adityanandan","Adityanandana","Adripathi","Advaya","Agasti","Agastya","Agneya","Aagneya","Agnimitra","Agniprava","Agnivesh","Agrata","Ajit","Ajeet","Akroor","Akshaj","Akshat","Akshayakeerti","Alok","Aalok","Amaranaath","Amarnath","Amaresh","Ambar","Ameyatma","Amish","Amogh","Amrit","Anaadi","Anagh","Anal","Anand","Aanand","Anang","Anil","Anilaabh","Anilabh","Anish","Ankal","Anunay","Anurag","Anuraag","Archan","Arindam","Arjun","Arnesh","Arun","Ashlesh","Ashok","Atmanand","Atmananda","Avadhesh","Baalaaditya","Baladitya","Baalagopaal","Balgopal","Balagopal","Bahula","Bakula","Bala","Balaaditya","Balachandra","Balagovind","Bandhu","Bandhul","Bankim","Bankimchandra","Bhadrak","Bhadraksh","Bhadran","Bhagavaan","Bhagvan","Bharadwaj","Bhardwaj","Bharat","Bhargava","Bhasvan","Bhaasvan","Bhaswar","Bhaaswar","Bhaumik","Bhaves","Bheeshma","Bhisham","Bhishma","Bhima","Bhoj","Bhramar","Bhudev","Bhudeva","Bhupati","Bhoopati","Bhoopat","Bhupen","Bhushan","Bhooshan","Bhushit","Bhooshit","Bhuvanesh","Bhuvaneshwar","Bilva","Bodhan","Brahma","Brahmabrata","Brahmanandam","Brahmaanand","Brahmdev","Brajendra","Brajesh","Brijesh","Birjesh","Budhil","Chakor","Chakradhar","Chakravartee","Chakravarti","Chanakya","Chaanakya","Chandak","Chandan","Chandra","Chandraayan","Chandrabhan","Chandradev","Chandraketu","Chandramauli","Chandramohan","Chandran","Chandranath","Chapal","Charak","Charuchandra","Chaaruchandra","Charuvrat","Chatur","Chaturaanan","Chaturbhuj","Chetan","Chaten","Chaitan","Chetanaanand","Chidaakaash","Chidaatma","Chidambar","Chidambaram","Chidananda","Chinmayanand","Chinmayananda","Chiranjeev","Chiranjeeve","Chitraksh","Daiwik","Daksha","Damodara","Dandak","Dandapaani","Darshan","Datta","Dayaamay","Dayamayee","Dayaananda","Dayaanidhi","Kin","Deenabandhu","Deepan","Deepankar","Dipankar","Deependra","Dipendra","Deepesh","Dipesh","Deeptanshu","Deeptendu","Diptendu","Deeptiman","Deeptimoy","Deeptimay","Dev","Deb","Devadatt","Devagya","Devajyoti","Devak","Devdan","Deven","Devesh","Deveshwar","Devi","Devvrat","Dhananjay","Dhanapati","Dhanpati","Dhanesh","Dhanu","Dhanvin","Dharmaketu","Dhruv","Dhyanesh","Dhyaneshwar","Digambar","Digambara","Dinakar","Dinkar","Dinesh","Divaakar","Divakar","Deevakar","Divjot","Dron","Drona","Dwaipayan","Dwaipayana","Eekalabya","Ekalavya","Ekaksh","Ekaaksh","Ekaling","Ekdant","Ekadant","Gajaadhar","Gajadhar","Gajbaahu","Gajabahu","Ganak","Ganaka","Ganapati","Gandharv","Gandharva","Ganesh","Gangesh","Garud","Garuda","Gati","Gatik","Gaurang","Gauraang","Gauranga","Gouranga","Gautam","Gautama","Goutam","Ghanaanand","Ghanshyam","Ghanashyam","Giri","Girik","Girika","Girindra","Giriraaj","Giriraj","Girish","Gopal","Gopaal","Gopi","Gopee","Gorakhnath","Gorakhanatha","Goswamee","Goswami","Gotum","Gautam","Govinda","Gobinda","Gudakesha","Gudakesa","Gurdev","Guru","Hari","Harinarayan","Harit","Himadri","Hiranmay","Hiranmaya","Hiranya","Inder","Indra","Indra","Jagadish","Jagadisha","Jagathi","Jagdeep","Jagdish","Jagmeet","Jahnu","Jai","Javas","Jay","Jitendra","Jitender","Jyotis","Kailash","Kama","Kamalesh","Kamlesh","Kanak","Kanaka","Kannan","Kannen","Karan","Karthik","Kartik","Karunanidhi","Kashyap","Kiran","Kirti","Keerti","Krishna","Krishnadas","Krishnadasa","Kumar","Lai","Lakshman","Laxman","Lakshmidhar","Lakshminath","Lal","Laal","Mahendra","Mohinder","Mahesh","Maheswar","Mani","Manik","Manikya","Manoj","Marut","Mayoor","Meghnad","Meghnath","Mohan","Mukesh","Mukul","Nagabhushanam","Nanda","Narayan","Narendra","Narinder","Naveen","Navin","Nawal","Naval","Nimit","Niranjan","Nirbhay","Niro","Param","Paramartha","Pran","Pranay","Prasad","Prathamesh","Prayag","Prem","Puneet","Purushottam","Rahul","Raj","Rajan","Rajendra","Rajinder","Rajiv","Rakesh","Ramesh","Rameshwar","Ranjit","Ranjeet","Ravi","Ritesh","Rohan","Rohit","Rudra","Sachin","Sameer","Samir","Sanjay","Sanka","Sarvin","Satish","Satyen","Shankar","Shantanu","Shashi","Sher","Shiv","Siddarth","Siddhran","Som","Somu","Somnath","Subhash","Subodh","Suman","Suresh","Surya","Suryakant","Suryakanta","Sushil","Susheel","Swami","Swapnil","Tapan","Tara","Tarun","Tej","Tejas","Trilochan","Trilochana","Trilok","Trilokesh","Triloki","Triloki Nath","Trilokanath","Tushar","Udai","Udit","Ujjawal","Ujjwal","Umang","Upendra","Uttam","Vasudev","Vasudeva","Vedang","Vedanga","Vidhya","Vidur","Vidhur","Vijay","Vimal","Vinay","Vishnu","Bishnu","Vishwamitra","Vyas","Yogendra","Yoginder","Yogesh"],"last_name":["Abbott","Achari","Acharya","Adiga","Agarwal","Ahluwalia","Ahuja","Arora","Asan","Bandopadhyay","Banerjee","Bharadwaj","Bhat","Butt","Bhattacharya","Bhattathiri","Chaturvedi","Chattopadhyay","Chopra","Desai","Deshpande","Devar","Dhawan","Dubashi","Dutta","Dwivedi","Embranthiri","Ganaka","Gandhi","Gill","Gowda","Guha","Guneta","Gupta","Iyer","Iyengar","Jain","Jha","Johar","Joshi","Kakkar","Kaniyar","Kapoor","Kaul","Kaur","Khan","Khanna","Khatri","Kocchar","Mahajan","Malik","Marar","Menon","Mehra","Mehrotra","Mishra","Mukhopadhyay","Nayar","Naik","Nair","Nambeesan","Namboothiri","Nehru","Pandey","Panicker","Patel","Patil","Pilla","Pillai","Pothuvaal","Prajapat","Rana","Reddy","Saini","Sethi","Shah","Sharma","Shukla","Singh","Sinha","Somayaji","Tagore","Talwar","Tandon","Trivedi","Varrier","Varma","Varman","Verma"]},"address":{"postcode":["?#? #?#"],"state":["Andra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu","Tripura","Uttaranchal","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadar and Nagar Haveli","Daman and Diu","Delhi","Lakshadweep","Pondicherry"],"state_abbr":["AP","AR","AS","BR","CG","DL","GA","GJ","HR","HP","JK","JS","KA","KL","MP","MH","MN","ML","MZ","NL","OR","PB","RJ","SK","TN","TR","UK","UP","WB","AN","CH","DN","DD","LD","PY"],"default_country":["India","Indian Republic","Bharat","Hindustan"]},"internet":{"free_email":["gmail.com","yahoo.co.in","hotmail.com"],"domain_suffix":["in","com","biz","info","name","net","org","co.in"]},"company":{"suffix":["Pvt Ltd","Limited","Ltd","and Sons","Corp","Group","Brothers"]},"phone_number":{"formats":["+91###-###-####","+91##########","+91-###-#######"]}}},"pl":{"faker":{"name":{"first_name":["Aaron","Abraham","Adam","Adrian","Atanazy","Agaton","Alan","Albert","Aleksander","Aleksy","Alfred","Alwar","Ambro\u017cy","Anatol","Andrzej","Antoni","Apollinary","Apollo","Arkady","Arkadiusz","Archibald","Arystarch","Arnold","Arseniusz","Artur","August","Baldwin","Bazyli","Benedykt","Beniamin","Bernard","Bertrand","Bertram","Borys","Brajan","Bruno","Cezary","Cecyliusz","Karol","Krystian","Krzysztof","Klarencjusz","Klaudiusz","Klemens","Konrad","Konstanty","Konstantyn","Kornel","Korneliusz","Korneli","Cyryl","Cyrus","Damian","Daniel","Dariusz","Dawid","Dionizy","Demetriusz","Dominik","Donald","Dorian","Edgar","Edmund","Edward","Edwin","Efrem","Efraim","Eliasz","Eleazar","Emil","Emanuel","Erast","Ernest","Eugeniusz","Eustracjusz","Fabian","Feliks","Florian","Franciszek","Fryderyk","Gabriel","Gedeon","Galfryd","Jerzy","Gerald","Gerazym","Gilbert","Gonsalwy","Grzegorz","Gwido","Harald","Henryk","Herbert","Herman","Hilary","Horacy","Hubert","Hugo","Ignacy","Igor","Hilarion","Innocenty","Hipolit","Ireneusz","Erwin","Izaak","Izajasz","Izydor","Jakub","Jeremi","Jeremiasz","Hieronim","Gerald","Joachim","Jan","Janusz","Jonatan","J\u00f3zef","Jozue","Julian","Juliusz","Justyn","Kalistrat","Kazimierz","Wawrzyniec","Laurenty","Laurencjusz","\u0141azarz","Leon","Leonard","Leonid","Leon","Ludwik","\u0141ukasz","Lucjan","Magnus","Makary","Marceli","Marek","Marcin","Mateusz","Maurycy","Maksym","Maksymilian","Micha\u0142","Miron","Modest","Moj\u017cesz","Natan","Natanael","Nazariusz","Nazary","Nestor","Miko\u0142aj","Nikodem","Olaf","Oleg","Oliwier","Onufry","Orestes","Oskar","Ansgary","Osmund","Pankracy","Pantaleon","Patryk","Patrycjusz","Patrycy","Pawe\u0142","Piotr","Filemon","Filip","Platon","Polikarp","Porfiry","Porfiriusz","Prokles","Prokul","Prokop","Kwintyn","Randolf","Rafa\u0142","Rajmund","Reginald","Rajnold","Ryszard","Robert","Roderyk","Roger","Roland","Roman","Romeo","Reginald","Rudolf","Samson","Samuel","Salwator","Sebastian","Serafin","Sergiusz","Seweryn","Zygmunt","Sylwester","Szymon","Salomon","Spirydion","Stanis\u0142aw","Szczepan","Stefan","Terencjusz","Teodor","Tomasz","Tymoteusz","Tobiasz","Walenty","Walentyn","Walerian","Walery","Wiktor","Wincenty","Witalis","W\u0142odzimierz","W\u0142adys\u0142aw","B\u0142a\u017cej","Walter","Walgierz","Wac\u0142aw","Wilfryd","Wilhelm","Ksawery","Ksenofont","Jerzy","Zachariasz","Zachary","Ada","Adelajda","Agata","Agnieszka","Agrypina","Aida","Aleksandra","Alicja","Alina","Amanda","Anastazja","Angela","And\u017celika","Angelina","Anna","Hanna","\u2014","Antonina","Ariadna","Aurora","Barbara","Beatrycze","Berta","Brygida","Kamila","Karolina","Karolina","Kornelia","Katarzyna","Cecylia","Karolina","Chloe","Krystyna","Klara","Klaudia","Klementyna","Konstancja","Koralia","Daria","Diana","Dina","Dorota","Edyta","Eleonora","Eliza","El\u017cbieta","Izabela","Elwira","Emilia","Estera","Eudoksja","Eudokia","Eugenia","Ewa","Ewelina","Ferdynanda","Florencja","Franciszka","Gabriela","Gertruda","Gloria","Gracja","Jadwiga","Helena","Henryka","Nadzieja","Ida","Ilona","Helena","Irena","Irma","Izabela","Izolda","Jakubina","Joanna","Janina","\u017baneta","Joanna","Ginewra","J\u00f3zefina","Judyta","Julia","Julia","Julita","Justyna","Kira","Cyra","Kleopatra","Larysa","Laura","Laurencja","Laurentyna","Lea","Leila","Eleonora","Liliana","Lilianna","Lilia","Lilla","Liza","Eliza","Laura","Ludwika","Luiza","\u0141ucja","Lucja","Lidia","Amabela","Magdalena","Malwina","Ma\u0142gorzata","Greta","Marianna","Maryna","Marta","Martyna","Maria","Matylda","Maja","Maja","Melania","Michalina","Monika","Nadzieja","Noemi","Natalia","Nikola","Nina","Olga","Olimpia","Oliwia","Ofelia","Patrycja","Paula","Pelagia","Penelopa","Filipa","Paulina","Rachela","Rebeka","Regina","Renata","Rozalia","R\u00f3\u017ca","Roksana","Rufina","Ruta","Sabina","Sara","Serafina","Sybilla","Sylwia","Zofia","Stella","Stefania","Zuzanna","Tamara","Tacjana","Tekla","Teodora","Teresa","Walentyna","Waleria","Wanesa","Wiara","Weronika","Wiktoria","Wirginia","Bibiana","Bibianna","Wanda","Wilhelmina","Ksawera","Ksenia","Zoe"],"last_name":["Adamczak","Adamczyk","Adamek","Adamiak","Adamiec","Adamowicz","Adamski","Adamus","Aleksandrowicz","Andrzejczak","Andrzejewski","Antczak","Augustyn","Augustyniak","Bagi\u0144ski","Balcerzak","Banach","Banasiak","Banasik","Bana\u015b","Baran","Baranowski","Bara\u0144ski","Bartczak","Bartkowiak","Bartnik","Bartosik","Bednarczyk","Bednarek","Bednarski","Bednarz","Bia\u0142as","Bia\u0142ek","Bia\u0142kowski","Bielak","Bielawski","Bielecki","Bielski","Bieniek","Biernacki","Biernat","Bie\u0144kowski","Bilski","Bober","Bochenek","Bogucki","Bogusz","Borek","Borkowski","Borowiec","Borowski","Bo\u017cek","Broda","Brzezi\u0144ski","Brzozowski","Buczek","Buczkowski","Buczy\u0144ski","Budzi\u0144ski","Budzy\u0144ski","Bujak","Bukowski","Burzy\u0144ski","B\u0105k","B\u0105kowski","B\u0142aszczak","B\u0142aszczyk","Cebula","Chmiel","Chmielewski","Chmura","Chojnacki","Chojnowski","Cholewa","Chrzanowski","Chudzik","Cichocki","Cicho\u0144","Cichy","Ciesielski","Cie\u015bla","Cie\u015blak","Cie\u015blik","Ciszewski","Cybulski","Cygan","Czaja","Czajka","Czajkowski","Czapla","Czarnecki","Czech","Czechowski","Czekaj","Czerniak","Czerwi\u0144ski","Czy\u017c","Czy\u017cewski","Dec","Dobosz","Dobrowolski","Dobrzy\u0144ski","Domaga\u0142a","Doma\u0144ski","Dominiak","Drabik","Drozd","Drozdowski","Drzewiecki","Dr\u00f3\u017cd\u017c","Dubiel","Duda","Dudek","Dudziak","Dudzik","Dudzi\u0144ski","Duszy\u0144ski","Dziedzic","Dziuba","D\u0105bek","D\u0105bkowski","D\u0105browski","D\u0119bowski","D\u0119bski","D\u0142ugosz","Falkowski","Fija\u0142kowski","Filipek","Filipiak","Filipowicz","Flak","Flis","Florczak","Florek","Frankowski","Fr\u0105ckowiak","Fr\u0105czek","Fr\u0105tczak","Furman","Gadomski","Gajda","Gajewski","Gawe\u0142","Gawlik","Gawron","Gawro\u0144ski","Ga\u0142ka","Ga\u0142\u0105zka","Gil","Godlewski","Golec","Go\u0142\u0105b","Go\u0142\u0119biewski","Go\u0142\u0119biowski","Grabowski","Graczyk","Grochowski","Grudzie\u0144","Gruszczy\u0144ski","Gruszka","Grzegorczyk","Grzelak","Grzesiak","Grzesik","Grze\u015bkowiak","Grzyb","Grzybowski","Grzywacz","Gutowski","Guzik","Gw\u00f3\u017ad\u017a","G\u00f3ra","G\u00f3ral","G\u00f3recki","G\u00f3rka","G\u00f3rniak","G\u00f3rny","G\u00f3rski","G\u0105sior","G\u0105siorowski","G\u0142ogowski","G\u0142owacki","G\u0142\u0105b","Hajduk","Herman","Iwa\u0144ski","Izdebski","Jab\u0142o\u0144ski","Jackowski","Jagielski","Jagie\u0142\u0142o","Jagodzi\u0144ski","Jakubiak","Jakubowski","Janas","Janiak","Janicki","Janik","Janiszewski","Jankowiak","Jankowski","Janowski","Janus","Janusz","Januszewski","Jaros","Jarosz","Jarz\u0105bek","Jasi\u0144ski","Jastrz\u0119bski","Jaworski","Ja\u015bkiewicz","Jezierski","Jurek","Jurkiewicz","Jurkowski","Juszczak","J\u00f3\u017awiak","J\u00f3\u017awik","J\u0119drzejczak","J\u0119drzejczyk","J\u0119drzejewski","Kacprzak","Kaczmarczyk","Kaczmarek","Kaczmarski","Kaczor","Kaczorowski","Kaczy\u0144ski","Kaleta","Kalinowski","Kalisz","Kami\u0144ski","Kania","Kaniewski","Kapusta","Kara\u015b","Karczewski","Karpi\u0144ski","Karwowski","Kasperek","Kasprzak","Kasprzyk","Kaszuba","Kawa","Kawecki","Ka\u0142u\u017ca","Ka\u017amierczak","Kie\u0142basa","Kisiel","Kita","Klimczak","Klimek","Kmiecik","Kmie\u0107","Knapik","Kobus","Kogut","Kolasa","Komorowski","Konieczna","Konieczny","Konopka","Kopczy\u0144ski","Koper","Kope\u0107","Korzeniowski","Kos","Kosi\u0144ski","Kosowski","Kostecki","Kostrzewa","Kot","Kotowski","Kowal","Kowalczuk","Kowalczyk","Kowalewski","Kowalik","Kowalski","Koza","Kozak","Kozie\u0142","Kozio\u0142","Koz\u0142owski","Ko\u0142akowski","Ko\u0142odziej","Ko\u0142odziejczyk","Ko\u0142odziejski","Krajewski","Krakowiak","Krawczyk","Krawiec","Kruk","Krukowski","Krupa","Krupi\u0144ski","Kruszewski","Krysiak","Krzemi\u0144ski","Krzy\u017canowski","Kr\u00f3l","Kr\u00f3likowski","Ksi\u0105\u017cek","Kubacki","Kubiak","Kubica","Kubicki","Kubik","Kuc","Kucharczyk","Kucharski","Kuchta","Kuci\u0144ski","Kuczy\u0144ski","Kujawa","Kujawski","Kula","Kulesza","Kulig","Kulik","Kuli\u0144ski","Kurek","Kurowski","Ku\u015b","Kwa\u015bniewski","Kwiatkowski","Kwiecie\u0144","Kwieci\u0144ski","K\u0119dzierski","K\u0119dziora","K\u0119pa","K\u0142os","K\u0142osowski","Lach","Laskowski","Lasota","Lech","Lenart","Lesiak","Leszczy\u0144ski","Lewandowski","Lewicki","Le\u015bniak","Le\u015bniewski","Lipi\u0144ski","Lipka","Lipski","Lis","Lisiecki","Lisowski","Maciejewski","Maci\u0105g","Mackiewicz","Madej","Maj","Majcher","Majchrzak","Majewski","Majka","Makowski","Malec","Malicki","Malinowski","Maliszewski","Marchewka","Marciniak","Marcinkowski","Marczak","Marek","Markiewicz","Markowski","Marsza\u0142ek","Marzec","Mas\u0142owski","Matusiak","Matuszak","Matuszewski","Matysiak","Mazur","Mazurek","Mazurkiewicz","Ma\u0107kowiak","Ma\u0142ecki","Ma\u0142ek","Ma\u015blanka","Michalak","Michalczyk","Michalik","Michalski","Micha\u0142ek","Micha\u0142owski","Mielczarek","Mierzejewski","Mika","Miko\u0142ajczak","Miko\u0142ajczyk","Mikulski","Milczarek","Milewski","Miller","Misiak","Misztal","Mi\u015bkiewicz","Modzelewski","Molenda","Morawski","Motyka","Mroczek","Mroczkowski","Mrozek","Mr\u00f3z","Mucha","Murawski","Musia\u0142","Muszy\u0144ski","M\u0142ynarczyk","Napiera\u0142a","Nawrocki","Nawrot","Niedziela","Niedzielski","Nied\u017awiecki","Niemczyk","Niemiec","Niewiadomski","Noga","Nowacki","Nowaczyk","Nowak","Nowakowski","Nowicki","Nowi\u0144ski","Olczak","Olejniczak","Olejnik","Olszewski","Orzechowski","Or\u0142owski","Osi\u0144ski","Ossowski","Ostrowski","Owczarek","Paczkowski","Paj\u0105k","Paku\u0142a","Paluch","Panek","Partyka","Pasternak","Paszkowski","Pawelec","Pawlak","Pawlicki","Pawlik","Pawlikowski","Paw\u0142owski","Pa\u0142ka","Piasecki","Piechota","Piekarski","Pietras","Pietruszka","Pietrzak","Pietrzyk","Pilarski","Pilch","Piotrowicz","Piotrowski","Piwowarczyk","Pi\u00f3rkowski","Pi\u0105tek","Pi\u0105tkowski","Pi\u0142at","Pluta","Podg\u00f3rski","Polak","Pop\u0142awski","Por\u0119bski","Prokop","Prus","Przybylski","Przybysz","Przyby\u0142","Przyby\u0142a","Ptak","Puchalski","Pytel","P\u0142onka","Raczy\u0144ski","Radecki","Radomski","Rak","Rakowski","Ratajczak","Robak","Rogala","Rogalski","Rogowski","Rojek","Romanowski","Rosa","Rosiak","Rosi\u0144ski","Ruci\u0144ski","Rudnicki","Rudzi\u0144ski","Rudzki","Rusin","Rutkowski","Rybak","Rybarczyk","Rybicki","Rzepka","R\u00f3\u017ca\u0144ski","R\u00f3\u017cycki","Sadowski","Sawicki","Serafin","Siedlecki","Sienkiewicz","Sieradzki","Sikora","Sikorski","Sitek","Siwek","Skalski","Skiba","Skibi\u0144ski","Skoczylas","Skowron","Skowronek","Skowro\u0144ski","Skrzypczak","Skrzypek","Sk\u00f3ra","Smoli\u0144ski","Sobczak","Sobczyk","Sobieraj","Sobolewski","Socha","Sochacki","Soko\u0142owski","Sok\u00f3\u0142","Sosnowski","Sowa","Sowi\u0144ski","So\u0142tys","So\u0142tysiak","Sroka","Stachowiak","Stachowicz","Stachura","Stachurski","Stanek","Staniszewski","Stanis\u0142awski","Stankiewicz","Stasiak","Staszewski","Stawicki","Stec","Stefaniak","Stefa\u0144ski","Stelmach","Stolarczyk","Stolarski","Strzelczyk","Strzelecki","St\u0119pie\u0144","St\u0119pniak","Surma","Suski","Szafra\u0144ski","Szatkowski","Szczepaniak","Szczepanik","Szczepa\u0144ski","Szczerba","Szcze\u015bniak","Szczygie\u0142","Szcz\u0119sna","Szcz\u0119sny","Szel\u0105g","Szewczyk","Szostak","Szulc","Szwarc","Szwed","Szyd\u0142owski","Szyma\u0144ski","Szymczak","Szymczyk","Szymkowiak","Szyszka","S\u0142awi\u0144ski","S\u0142owik","S\u0142owi\u0144ski","Tarnowski","Tkaczyk","Tokarski","Tomala","Tomaszewski","Tomczak","Tomczyk","Tracz","Trojanowski","Trzci\u0144ski","Trzeciak","Turek","Twardowski","Urban","Urbanek","Urbaniak","Urbanowicz","Urba\u0144czyk","Urba\u0144ski","Walczak","Walkowiak","Warcho\u0142","Wasiak","Wasilewski","Wawrzyniak","Weso\u0142owski","Wieczorek","Wierzbicki","Wilczek","Wilczy\u0144ski","Wilk","Winiarski","Witczak","Witek","Witkowski","Wi\u0105cek","Wi\u0119cek","Wi\u0119ckowski","Wi\u015bniewski","Wnuk","Wojciechowski","Wojtas","Wojtasik","Wojtczak","Wojtkowiak","Wolak","Woli\u0144ski","Wolny","Wolski","Wo\u015b","Wo\u017aniak","Wrona","Wro\u0144ski","Wr\u00f3bel","Wr\u00f3blewski","Wypych","Wysocki","Wyszy\u0144ski","W\u00f3jcicki","W\u00f3jcik","W\u00f3jtowicz","W\u0105sik","W\u0119grzyn","W\u0142odarczyk","W\u0142odarski","Zaborowski","Zab\u0142ocki","Zag\u00f3rski","Zaj\u0105c","Zaj\u0105czkowski","Zakrzewski","Zalewski","Zaremba","Zarzycki","Zar\u0119ba","Zawada","Zawadzki","Zdunek","Zieli\u0144ski","Zielonka","Zi\u00f3\u0142kowski","Zi\u0119ba","Zi\u0119tek","Zwoli\u0144ski","Zych","Zygmunt","\u0141api\u0144ski","\u0141uczak","\u0141ukasiewicz","\u0141ukasik","\u0141ukaszewski","\u015aliwa","\u015aliwi\u0144ski","\u015alusarczyk","\u015awiderski","\u015awierczy\u0144ski","\u015awi\u0105tek","\u017bak","\u017bebrowski","\u017bmuda","\u017buk","\u017bukowski","\u017burawski","\u017burek","\u017by\u0142a"],"prefix":["Pan","Pani"],"title":{"descriptor":["Lead","Senior","Direct","Corporate","Dynamic","Future","Product","National","Regional","District","Central","Global","Customer","Investor","Dynamic","International","Legacy","Forward","Internal","Human","Chief","Principal"],"level":["Solutions","Program","Brand","Security","Research","Marketing","Directives","Implementation","Integration","Functionality","Response","Paradigm","Tactics","Identity","Markets","Group","Division","Applications","Optimization","Operations","Infrastructure","Intranet","Communications","Web","Branding","Quality","Assurance","Mobility","Accounts","Data","Creative","Configuration","Accountability","Interactions","Factors","Usability","Metrics"],"job":["Supervisor","Associate","Executive","Liason","Officer","Manager","Engineer","Specialist","Director","Coordinator","Administrator","Architect","Analyst","Designer","Planner","Orchestrator","Technician","Developer","Producer","Consultant","Assistant","Facilitator","Agent","Representative","Strategist"]},"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"address":{"country":["Afganistan","Albania","Algieria","Andora","Angola","Antigua i Barbuda","Arabia Saudyjska","Argentyna","Armenia","Australia","Austria","Azerbejd\u017can","Bahamy","Bahrajn","Bangladesz","Barbados","Belgia","Belize","Benin","Bhutan","Bia\u0142oru\u015b","Birma","Boliwia","Sucre","Bo\u015bnia i Hercegowina","Botswana","Brazylia","Brunei","Bu\u0142garia","Burkina Faso","Burundi","Chile","Chiny","Chorwacja","Cypr","Czad","Czarnog\u00f3ra","Czechy","Dania","Demokratyczna Republika Konga","Dominika","Dominikana","D\u017cibuti","Egipt","Ekwador","Erytrea","Estonia","Etiopia","Fid\u017ci","Filipiny","Finlandia","Francja","Gabon","Gambia","Ghana","Grecja","Grenada","Gruzja","Gujana","Gwatemala","Gwinea","Gwinea Bissau","Gwinea R\u00f3wnikowa","Haiti","Hiszpania","Holandia","Haga","Honduras","Indie","Indonezja","Irak","Iran","Irlandia","Islandia","Izrael","Jamajka","Japonia","Jemen","Jordania","Kambod\u017ca","Kamerun","Kanada","Katar","Kazachstan","Kenia","Kirgistan","Kiribati","Kolumbia","Komory","Kongo","Korea Po\u0142udniowa","Korea P\u00f3\u0142nocna","Kostaryka","Kuba","Kuwejt","Laos","Lesotho","Liban","Liberia","Libia","Liechtenstein","Litwa","Luksemburg","\u0141otwa","Macedonia","Madagaskar","Malawi","Malediwy","Malezja","Mali","Malta","Maroko","Mauretania","Mauritius","Meksyk","Mikronezja","Mo\u0142dawia","Monako","Mongolia","Mozambik","Namibia","Nauru","Nepal","Niemcy","Niger","Nigeria","Nikaragua","Norwegia","Nowa Zelandia","Oman","Pakistan","Palau","Panama","Papua-Nowa Gwinea","Paragwaj","Peru","Polska","322 575","Portugalia","Republika Po\u0142udniowej Afryki","Republika \u015arodkowoafryka\u0144ska","Republika Zielonego Przyl\u0105dka","Rosja","Rumunia","Rwanda","Saint Kitts i Nevis","Saint Lucia","Saint Vincent i Grenadyny","Salwador","Samoa","San Marino","Senegal","Serbia","Seszele","Sierra Leone","Singapur","S\u0142owacja","S\u0142owenia","Somalia","Sri Lanka","Stany Zjednoczone","Suazi","Sudan","Sudan Po\u0142udniowy","Surinam","Syria","Szwajcaria","Szwecja","Tad\u017cykistan","Tajlandia","Tanzania","Timor Wschodni","Togo","Tonga","Trynidad i Tobago","Tunezja","Turcja","Turkmenistan","Tuvalu","Funafuti","Uganda","Ukraina","Urugwaj",2008,"Uzbekistan","Vanuatu","Watykan","Wenezuela","W\u0119gry","Wielka Brytania","Wietnam","W\u0142ochy","Wybrze\u017ce Ko\u015bci S\u0142oniowej","Wyspy Marshalla","Wyspy Salomona","Wyspy \u015awi\u0119tego Tomasza i Ksi\u0105\u017c\u0119ca","Zambia","Zimbabwe","Zjednoczone Emiraty Arabskie"],"building_number":["#####","####","###"],"street_prefix":["ul.","al."],"secondary_address":["Apt. ###","Suite ###"],"postcode":["##-###"],"state":["Dolno\u015bl\u0105skie","Kujawsko-pomorskie","Lubelskie","Lubuskie","\u0141\u00f3dzkie","Ma\u0142opolskie","Mazowieckie","Opolskie","Podkarpackie","Podlaskie","Pomorskie","\u015al\u0105skie","\u015awi\u0119tokrzyskie","Warmi\u0144sko-mazurskie","Wielkopolskie","Zachodniopomorskie"],"state_abbr":["D\u015a","KP","LB","LS","\u0141D","MP","MZ","OP","PK","PL","PM","\u015aL","\u015aK","WM","WP","ZP"],"city_name":["Aleksandr\u00f3w Kujawski","Aleksandr\u00f3w \u0141\u00f3dzki","Alwernia","Andrych\u00f3w","Annopol","August\u00f3w","Babimost","Babor\u00f3w","Baran\u00f3w Sandomierski","Barcin","Barczewo","Bardo","Barlinek","Bartoszyce","Barwice","Be\u0142chat\u00f3w","Be\u0142\u017cyce","B\u0119dzin","Bia\u0142a","Bia\u0142a Piska","Bia\u0142a Podlaska","Bia\u0142a Rawska","Bia\u0142obrzegi","Bia\u0142ogard","Bia\u0142y B\u00f3r","Bia\u0142ystok","Biecz","Bielawa","Bielsk Podlaski","Bielsko-Bia\u0142a","Bieru\u0144","Bierut\u00f3w","Bie\u017cu\u0144","Bi\u0142goraj","Biskupiec","Bisztynek","Blachownia","B\u0142aszki","B\u0142a\u017cowa","B\u0142onie","Bobolice","Bobowa","Bochnia","Bodzentyn","Bogatynia","Boguchwa\u0142a","Bogusz\u00f3w-Gorce","Bojanowo","Boles\u0142awiec","Bolk\u00f3w","Borek Wielkopolski","Borne Sulinowo","Braniewo","Bra\u0144sk","Brodnica","Brok","Brusy","Brwin\u00f3w","Brzeg","Brzeg Dolny","Brzesko","Brzeszcze","Brze\u015b\u0107 Kujawski","Brzeziny","Brzostek","Brzoz\u00f3w","Buk","Bukowno","Busko-Zdr\u00f3j","Bychawa","Byczyna","Bydgoszcz","Bystrzyca K\u0142odzka","Bytom","Bytom Odrza\u0144ski","Byt\u00f3w","Cedynia","Che\u0142m","Che\u0142mek","Che\u0142mno","Che\u0142m\u017ca","Ch\u0119ciny","Chmielnik","Chocian\u00f3w","Chociwel","Chodecz","Chodzie\u017c","Chojna","Chojnice","Chojn\u00f3w","Choroszcz","Chorzele","Chorz\u00f3w","Choszczno","Chrzan\u00f3w","Ciechanowiec","Ciechan\u00f3w","Ciechocinek","Cieszan\u00f3w","Cieszyn","Ci\u0119\u017ckowice","Cybinka","Czaplinek","Czarna Bia\u0142ostocka","Czarna Woda","Czarne","Czarnk\u00f3w","Czch\u00f3w","Czechowice-Dziedzice","Czelad\u017a","Czempi\u0144","Czerniejewo","Czersk","Czerwie\u0144sk","Czerwionka-Leszczyny","Cz\u0119stochowa","Cz\u0142opa","Cz\u0142uch\u00f3w","Czy\u017cew","\u0106miel\u00f3w","Daleszyce","Dar\u0142owo","D\u0105bie","D\u0105browa Bia\u0142ostocka","D\u0105browa G\u00f3rnicza","D\u0105browa Tarnowska","Debrzno","D\u0119bica","D\u0119blin","D\u0119bno","Dobczyce","Dobiegniew","Dobra (powiat \u0142obeski)","Dobra (powiat turecki)","Dobre Miasto","Dobrodzie\u0144","Dobrzany","Dobrzy\u0144 nad Wis\u0142\u0105","Dolsk","Drawno","Drawsko Pomorskie","Drezdenko","Drobin","Drohiczyn","Drzewica","Dukla","Duszniki-Zdr\u00f3j","Dyn\u00f3w","Dzia\u0142dowo","Dzia\u0142oszyce","Dzia\u0142oszyn","Dzierzgo\u0144","Dzier\u017coni\u00f3w","Dziwn\u00f3w","Elbl\u0105g","E\u0142k","Frampol","Frombork","Garwolin","G\u0105bin","Gda\u0144sk","Gdynia","Gi\u017cycko","Glinojeck","Gliwice","G\u0142og\u00f3w","G\u0142og\u00f3w Ma\u0142opolski","G\u0142og\u00f3wek","G\u0142owno","G\u0142ubczyce","G\u0142ucho\u0142azy","G\u0142uszyca","Gniew","Gniewkowo","Gniezno","Gogolin","Golczewo","Goleni\u00f3w","Golina","Golub-Dobrzy\u0144","Go\u0142a\u0144cz","Go\u0142dap","Goni\u0105dz","Gorlice","Gorz\u00f3w \u015al\u0105ski","Gorz\u00f3w Wielkopolski","Gostynin","Gosty\u0144","Go\u015bcino","Gozdnica","G\u00f3ra","G\u00f3ra Kalwaria","G\u00f3rowo I\u0142aweckie","G\u00f3rzno","Grab\u00f3w nad Prosn\u0105","Grajewo","Grodk\u00f3w","Grodzisk Mazowiecki","Grodzisk Wielkopolski","Gr\u00f3jec","Grudzi\u0105dz","Gryb\u00f3w","Gryfice","Gryfino","Gryf\u00f3w \u015al\u0105ski","Gubin","Hajn\u00f3wka","Halin\u00f3w","Hel","Hrubiesz\u00f3w","I\u0142awa","I\u0142owa","I\u0142\u017ca","Imielin","Inowroc\u0142aw","I\u0144sko","Iwonicz-Zdr\u00f3j","Izbica Kujawska","Jab\u0142onowo Pomorskie","Janikowo","Janowiec Wielkopolski","Jan\u00f3w Lubelski","Jarocin","Jaros\u0142aw","Jasie\u0144","Jas\u0142o","Jastarnia","Jastrowie","Jastrz\u0119bie-Zdr\u00f3j","Jawor","Jaworzno","Jaworzyna \u015al\u0105ska","Jedlicze","Jedlina-Zdr\u00f3j","Jedwabne","Jelcz-Laskowice","Jelenia G\u00f3ra","Jeziorany","J\u0119drzej\u00f3w","Jordan\u00f3w","J\u00f3zef\u00f3w (powiat bi\u0142gorajski)","J\u00f3zef\u00f3w (powiat otwocki)","Jutrosin","Kalety","Kalisz","Kalisz Pomorski","Kalwaria Zebrzydowska","Ka\u0142uszyn","Kamienna G\u00f3ra","Kamie\u0144 Kraje\u0144ski","Kamie\u0144 Pomorski","Kamie\u0144sk","Ka\u0144czuga","Karczew","Kargowa","Karlino","Karpacz","Kartuzy","Katowice","Kazimierz Dolny","Kazimierza Wielka","K\u0105ty Wroc\u0142awskie","Kcynia","K\u0119dzierzyn-Ko\u017ale","K\u0119pice","K\u0119pno","K\u0119trzyn","K\u0119ty","Kielce","Kietrz","Kisielice","Kleczew","Kleszczele","Kluczbork","K\u0142ecko","K\u0142obuck","K\u0142odawa","K\u0142odzko","Knur\u00f3w","Knyszyn","Kobylin","Koby\u0142ka","Kock","Kolbuszowa","Kolno","Kolonowskie","Koluszki","Ko\u0142aczyce","Ko\u0142o","Ko\u0142obrzeg","Koniecpol","Konin","Konstancin-Jeziorna","Konstantyn\u00f3w \u0141\u00f3dzki","Ko\u0144skie","Koprzywnica","Korfant\u00f3w","Koronowo","Korsze","Kos\u00f3w Lacki","Kostrzyn","Kostrzyn nad Odr\u0105","Koszalin","Ko\u015bcian","Ko\u015bcierzyna","Kowal","Kowalewo Pomorskie","Kowary","Kozieg\u0142owy","Kozienice","Ko\u017amin Wielkopolski","Ko\u017cuch\u00f3w","K\u00f3rnik","Krajenka","Krak\u00f3w","Krapkowice","Krasnobr\u00f3d","Krasnystaw","Kra\u015bnik","Krobia","Krosno","Krosno Odrza\u0144skie","Kro\u015bniewice","Krotoszyn","Kruszwica","Krynica Morska","Krynica-Zdr\u00f3j","Krynki","Krzanowice","Krzepice","Krzeszowice","Krzywi\u0144","Krzy\u017c Wielkopolski","Ksi\u0105\u017c Wielkopolski","Kudowa-Zdr\u00f3j","Kun\u00f3w","Kutno","Ku\u017ania Raciborska","Kwidzyn","L\u0105dek-Zdr\u00f3j","Legionowo","Legnica","Lesko","Leszno","Le\u015bna","Le\u015bnica","Lewin Brzeski","Le\u017cajsk","L\u0119bork","L\u0119dziny","Libi\u0105\u017c","Lidzbark","Lidzbark Warmi\u0144ski","Limanowa","Lipiany","Lipno","Lipsk","Lipsko","Lubacz\u00f3w","Luba\u0144","Lubart\u00f3w","Lubawa","Lubawka","Lubie\u0144 Kujawski","Lubin","Lublin","Lubliniec","Lubniewice","Lubomierz","Lubo\u0144","Lubraniec","Lubsko","Lw\u00f3wek","Lw\u00f3wek \u015al\u0105ski","\u0141abiszyn","\u0141a\u0144cut","\u0141apy","\u0141asin","\u0141ask","\u0141askarzew","\u0141aszcz\u00f3w","\u0141aziska G\u00f3rne","\u0141azy","\u0141eba","\u0141\u0119czna","\u0141\u0119czyca","\u0141\u0119knica","\u0141obez","\u0141ob\u017cenica","\u0141och\u00f3w","\u0141omianki","\u0141om\u017ca","\u0141osice","\u0141owicz","\u0141\u00f3d\u017a","\u0141uk\u00f3w","Mak\u00f3w Mazowiecki","Mak\u00f3w Podhala\u0144ski","Malbork","Ma\u0142ogoszcz","Ma\u0142omice","Margonin","Marki","Maszewo","Miasteczko \u015al\u0105skie","Miastko","Micha\u0142owo","Miech\u00f3w","Miejska G\u00f3rka","Mielec","Mierosz\u00f3w","Mieszkowice","Mi\u0119dzyb\u00f3rz","Mi\u0119dzych\u00f3d","Mi\u0119dzylesie","Mi\u0119dzyrzec Podlaski","Mi\u0119dzyrzecz","Mi\u0119dzyzdroje","Miko\u0142ajki","Miko\u0142\u00f3w","Mikstat","Milan\u00f3wek","Milicz","Mi\u0142akowo","Mi\u0142om\u0142yn","Mi\u0142os\u0142aw","Mi\u0144sk Mazowiecki","Miros\u0142awiec","Mirsk","M\u0142awa","M\u0142ynary","Mogielnica","Mogilno","Mo\u0144ki","Mor\u0105g","Mordy","Mory\u0144","Mosina","Mr\u0105gowo","Mrocza","Mszana Dolna","Mszczon\u00f3w","Murowana Go\u015blina","Muszyna","Mys\u0142owice","Myszk\u00f3w","Myszyniec","My\u015blenice","My\u015blib\u00f3rz","Nak\u0142o nad Noteci\u0105","Na\u0142\u0119cz\u00f3w","Namys\u0142\u00f3w","Narol","Nasielsk","Nekla","Nidzica","Niemcza","Niemodlin","Niepo\u0142omice","Nieszawa","Nisko","Nowa D\u0119ba","Nowa Ruda","Nowa Sarzyna","Nowa S\u00f3l","Nowe","Nowe Brzesko","Nowe Miasteczko","Nowe Miasto Lubawskie","Nowe Miasto nad Pilic\u0105","Nowe Skalmierzyce","Nowe Warpno","Nowogard","Nowogrodziec","Nowogr\u00f3d","Nowogr\u00f3d Bobrza\u0144ski","Nowy Dw\u00f3r Gda\u0144ski","Nowy Dw\u00f3r Mazowiecki","Nowy S\u0105cz","Nowy Staw","Nowy Targ","Nowy Tomy\u015bl","Nowy Wi\u015bnicz","Nysa","Oborniki","Oborniki \u015al\u0105skie","Obrzycko","Odolan\u00f3w","Ogrodzieniec","Okonek","Olecko","Olesno","Oleszyce","Ole\u015bnica","Olkusz","Olsztyn","Olsztynek","Olszyna","O\u0142awa","Opalenica","Opat\u00f3w","Opoczno","Opole","Opole Lubelskie","Orneta","Orzesze","Orzysz","Osieczna","Osiek","Ostro\u0142\u0119ka","Ostror\u00f3g","Ostrowiec \u015awi\u0119tokrzyski","Ostr\u00f3da","Ostr\u00f3w Lubelski","Ostr\u00f3w Mazowiecka","Ostr\u00f3w Wielkopolski","Ostrzesz\u00f3w","O\u015bno Lubuskie","O\u015bwi\u0119cim","Otmuch\u00f3w","Otwock","Ozimek","Ozork\u00f3w","O\u017car\u00f3w","O\u017car\u00f3w Mazowiecki","Pabianice","Paczk\u00f3w","Paj\u0119czno","Pako\u015b\u0107","Parczew","Pas\u0142\u0119k","Pasym","Pelplin","Pe\u0142czyce","Piaseczno","Piaski","Piast\u00f3w","Piechowice","Piekary \u015al\u0105skie","Pieni\u0119\u017cno","Pie\u0144sk","Pieszyce","Pilawa","Pilica","Pilzno","Pi\u0142a","Pi\u0142awa G\u00f3rna","Pi\u0144cz\u00f3w","Pionki","Piotrk\u00f3w Kujawski","Piotrk\u00f3w Trybunalski","Pisz","Piwniczna-Zdr\u00f3j","Pleszew","P\u0142ock","P\u0142o\u0144sk","P\u0142oty","Pniewy","Pobiedziska","Podd\u0119bice","Podkowa Le\u015bna","Pogorzela","Polanica-Zdr\u00f3j","Polan\u00f3w","Police","Polkowice","Po\u0142aniec","Po\u0142czyn-Zdr\u00f3j","Poniatowa","Poniec","Por\u0119ba","Pozna\u0144","Prabuty","Praszka","Prochowice","Proszowice","Pr\u00f3szk\u00f3w","Pruchnik","Prudnik","Prusice","Pruszcz Gda\u0144ski","Pruszk\u00f3w","Przasnysz","Przec\u0142aw","Przedb\u00f3rz","Przedecz","Przemk\u00f3w","Przemy\u015bl","Przeworsk","Przysucha","Pszczyna","Psz\u00f3w","Puck","Pu\u0142awy","Pu\u0142tusk","Puszczykowo","Pyrzyce","Pyskowice","Pyzdry","Rabka-Zdr\u00f3j","Raci\u0105\u017c","Racib\u00f3rz","Radk\u00f3w","Radlin","Rad\u0142\u00f3w","Radom","Radomsko","Radomy\u015bl Wielki","Radymno","Radziej\u00f3w","Radzionk\u00f3w","Radzymin","Radzy\u0144 Che\u0142mi\u0144ski","Radzy\u0144 Podlaski","Rajgr\u00f3d","Rakoniewice","Raszk\u00f3w","Rawa Mazowiecka","Rawicz","Recz","Reda","Rejowiec Fabryczny","Resko","Reszel","Rogo\u017ano","Ropczyce","R\u00f3\u017can","Ruciane-Nida","Ruda \u015al\u0105ska","Rudnik nad Sanem","Rumia","Rybnik","Rychwa\u0142","Rydu\u0142towy","Rydzyna","Ryglice","Ryki","Ryman\u00f3w","Ryn","Rypin","Rzepin","Rzesz\u00f3w","Rzg\u00f3w","Sandomierz","Sanok","Sejny","Serock","S\u0119dzisz\u00f3w","S\u0119dzisz\u00f3w Ma\u0142opolski","S\u0119popol","S\u0119p\u00f3lno Kraje\u0144skie","Sian\u00f3w","Siechnice","Siedlce","Siemianowice \u015al\u0105skie","Siemiatycze","Sieniawa","Sieradz","Sierak\u00f3w","Sierpc","Siewierz","Skalbmierz","Ska\u0142a","Skarszewy","Skaryszew","Skar\u017cysko-Kamienna","Skawina","Sk\u0119pe","Skierniewice","Skocz\u00f3w","Skoki","Sk\u00f3rcz","Skwierzyna","S\u0142awa","S\u0142awk\u00f3w","S\u0142awno","S\u0142omniki","S\u0142ubice","S\u0142upca","S\u0142upsk","Sob\u00f3tka","Sochaczew","Soko\u0142\u00f3w Ma\u0142opolski","Soko\u0142\u00f3w Podlaski","Sok\u00f3\u0142ka","Solec Kujawski","Sompolno","Sopot","Sosnowiec","So\u015bnicowice","Stalowa Wola","Starachowice","Stargard Szczeci\u0144ski","Starogard Gda\u0144ski","Stary S\u0105cz","Stasz\u00f3w","Stawiski","Stawiszyn","St\u0105pork\u00f3w","St\u0119szew","Stoczek \u0141ukowski","Stronie \u015al\u0105skie","Strumie\u0144","Stryk\u00f3w","Strzegom","Strzelce Kraje\u0144skie","Strzelce Opolskie","Strzelin","Strzelno","Strzy\u017c\u00f3w","Sucha Beskidzka","Sucha\u0144","Suchedni\u00f3w","Suchowola","Sulech\u00f3w","Sulej\u00f3w","Sulej\u00f3wek","Sul\u0119cin","Sulmierzyce","Su\u0142kowice","Supra\u015bl","Sura\u017c","Susz","Suwa\u0142ki","Swarz\u0119dz","Syc\u00f3w","Szadek","Szamocin","Szamotu\u0142y","Szczawnica","Szczawno-Zdr\u00f3j","Szczebrzeszyn","Szczecin","Szczecinek","Szczekociny","Szczucin","Szczuczyn","Szczyrk","Szczytna","Szczytno","Szepietowo","Szklarska Por\u0119ba","Szlichtyngowa","Szprotawa","Sztum","Szubin","Szyd\u0142owiec","\u015acinawa","\u015alesin","\u015amigiel","\u015arem","\u015aroda \u015al\u0105ska","\u015aroda Wielkopolska","\u015awi\u0105tniki G\u00f3rne","\u015awidnica","\u015awidnik","\u015awidwin","\u015awiebodzice","\u015awiebodzin","\u015awiecie","\u015awierad\u00f3w-Zdr\u00f3j","\u015awierzawa","\u015awi\u0119toch\u0142owice","\u015awinouj\u015bcie","Tarczyn","Tarnobrzeg","Tarnogr\u00f3d","Tarnowskie G\u00f3ry","Tarn\u00f3w","Tczew","Terespol","T\u0142uszcz","Tolkmicko","Tomasz\u00f3w Lubelski","Tomasz\u00f3w Mazowiecki","Toru\u0144","Torzym","Toszek","Trzcianka","Trzciel","Trzci\u0144sko-Zdr\u00f3j","Trzebiat\u00f3w","Trzebinia","Trzebnica","Trzemeszno","Tuchola","Tuch\u00f3w","Tuczno","Tuliszk\u00f3w","Turek","Tuszyn","Twardog\u00f3ra","Tychowo","Tychy","Tyczyn","Tykocin","Tyszowce","Ujazd","Uj\u015bcie","Ulan\u00f3w","Uniej\u00f3w","Ustka","Ustro\u0144","Ustrzyki Dolne","Wadowice","Wa\u0142brzych","Wa\u0142cz","Warka","Warszawa","Warta","Wasilk\u00f3w","W\u0105brze\u017ano","W\u0105chock","W\u0105growiec","W\u0105sosz","Wejherowo","W\u0119gliniec","W\u0119gorzewo","W\u0119gorzyno","W\u0119gr\u00f3w","Wi\u0105z\u00f3w","Wiele\u0144","Wielichowo","Wieliczka","Wielu\u0144","Wierusz\u00f3w","Wi\u0119cbork","Wilamowice","Wis\u0142a","Witkowo","Witnica","Wle\u0144","W\u0142adys\u0142awowo","W\u0142oc\u0142awek","W\u0142odawa","W\u0142oszczowa","Wodzis\u0142aw \u015al\u0105ski","Wojciesz\u00f3w","Wojkowice","Wojnicz","Wolb\u00f3rz","Wolbrom","Wolin","Wolsztyn","Wo\u0142czyn","Wo\u0142omin","Wo\u0142\u00f3w","Wo\u017aniki","Wroc\u0142aw","Wronki","Wrze\u015bnia","Wschowa","Wyrzysk","Wysoka","Wysokie Mazowieckie","Wyszk\u00f3w","Wyszogr\u00f3d","Wy\u015bmierzyce","Zab\u0142ud\u00f3w","Zabrze","Zag\u00f3r\u00f3w","Zag\u00f3rz","Zakliczyn","Zakopane","Zakroczym","Zalewo","Zambr\u00f3w","Zamo\u015b\u0107","Zator","Zawadzkie","Zawichost","Zawid\u00f3w","Zawiercie","Z\u0105bki","Z\u0105bkowice \u015al\u0105skie","Zb\u0105szynek","Zb\u0105szy\u0144","Zduny","Zdu\u0144ska Wola","Zdzieszowice","Zel\u00f3w","Zgierz","Zgorzelec","Zielona G\u00f3ra","Zielonka","Zi\u0119bice","Z\u0142ocieniec","Z\u0142oczew","Z\u0142otoryja","Z\u0142ot\u00f3w","Z\u0142oty Stok","Zwierzyniec","Zwole\u0144","\u017babno","\u017baga\u0144","\u017barki","\u017bar\u00f3w","\u017bary","\u017belech\u00f3w","\u017berk\u00f3w","\u017bmigr\u00f3d","\u017bnin","\u017bory","\u017bukowo","\u017buromin","\u017bychlin","\u017byrard\u00f3w","\u017bywiec"],"city":["#{city_name}"],"street_name":["#{street_prefix} #{Name.last_name}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Polska"]},"company":{"suffix":["Inc","and Sons","LLC","Group"],"buzzwords":[["Adaptive","Advanced","Ameliorated","Assimilated","Automated","Balanced","Business-focused","Centralized","Cloned","Compatible","Configurable","Cross-group","Cross-platform","Customer-focused","Customizable","Decentralized","De-engineered","Devolved","Digitized","Distributed","Diverse","Down-sized","Enhanced","Enterprise-wide","Ergonomic","Exclusive","Expanded","Extended","Face to face","Focused","Front-line","Fully-configurable","Function-based","Fundamental","Future-proofed","Grass-roots","Horizontal","Implemented","Innovative","Integrated","Intuitive","Inverse","Managed","Mandatory","Monitored","Multi-channelled","Multi-lateral","Multi-layered","Multi-tiered","Networked","Object-based","Open-architected","Open-source","Operative","Optimized","Optional","Organic","Organized","Persevering","Persistent","Phased","Polarised","Pre-emptive","Proactive","Profit-focused","Profound","Programmable","Progressive","Public-key","Quality-focused","Reactive","Realigned","Re-contextualized","Re-engineered","Reduced","Reverse-engineered","Right-sized","Robust","Seamless","Secured","Self-enabling","Sharable","Stand-alone","Streamlined","Switchable","Synchronised","Synergistic","Synergized","Team-oriented","Total","Triple-buffered","Universal","Up-sized","Upgradable","User-centric","User-friendly","Versatile","Virtual","Visionary","Vision-oriented"],["24 hour","24/7","3rd generation","4th generation","5th generation","6th generation","actuating","analyzing","asymmetric","asynchronous","attitude-oriented","background","bandwidth-monitored","bi-directional","bifurcated","bottom-line","clear-thinking","client-driven","client-server","coherent","cohesive","composite","context-sensitive","contextually-based","content-based","dedicated","demand-driven","didactic","directional","discrete","disintermediate","dynamic","eco-centric","empowering","encompassing","even-keeled","executive","explicit","exuding","fault-tolerant","foreground","fresh-thinking","full-range","global","grid-enabled","heuristic","high-level","holistic","homogeneous","human-resource","hybrid","impactful","incremental","intangible","interactive","intermediate","leading edge","local","logistical","maximized","methodical","mission-critical","mobile","modular","motivating","multimedia","multi-state","multi-tasking","national","needs-based","neutral","next generation","non-volatile","object-oriented","optimal","optimizing","radical","real-time","reciprocal","regional","responsive","scalable","secondary","solution-oriented","stable","static","systematic","systemic","system-worthy","tangible","tertiary","transitional","uniform","upward-trending","user-facing","value-added","web-enabled","well-modulated","zero administration","zero defect","zero tolerance"],["ability","access","adapter","algorithm","alliance","analyzer","application","approach","architecture","archive","artificial intelligence","array","attitude","benchmark","budgetary management","capability","capacity","challenge","circuit","collaboration","complexity","concept","conglomeration","contingency","core","customer loyalty","database","data-warehouse","definition","emulation","encoding","encryption","extranet","firmware","flexibility","focus group","forecast","frame","framework","function","functionalities","Graphic Interface","groupware","Graphical User Interface","hardware","help-desk","hierarchy","hub","implementation","info-mediaries","infrastructure","initiative","installation","instruction set","interface","internet solution","intranet","knowledge user","knowledge base","local area network","leverage","matrices","matrix","methodology","middleware","migration","model","moderator","monitoring","moratorium","neural-net","open architecture","open system","orchestration","paradigm","parallelism","policy","portal","pricing structure","process improvement","product","productivity","project","projection","protocol","secured line","service-desk","software","solution","standardization","strategy","structure","success","superstructure","support","synergy","system engine","task-force","throughput","time-frame","toolset","utilisation","website","workforce"]],"bs":[["implement","utilize","integrate","streamline","optimize","evolve","transform","embrace","enable","orchestrate","leverage","reinvent","aggregate","architect","enhance","incentivize","morph","empower","envisioneer","monetize","harness","facilitate","seize","disintermediate","synergize","strategize","deploy","brand","grow","target","syndicate","synthesize","deliver","mesh","incubate","engage","maximize","benchmark","expedite","reintermediate","whiteboard","visualize","repurpose","innovate","scale","unleash","drive","extend","engineer","revolutionize","generate","exploit","transition","e-enable","iterate","cultivate","matrix","productize","redefine","recontextualize"],["clicks-and-mortar","value-added","vertical","proactive","robust","revolutionary","scalable","leading-edge","innovative","intuitive","strategic","e-business","mission-critical","sticky","one-to-one","24/7","end-to-end","global","B2B","B2C","granular","frictionless","virtual","viral","dynamic","24/365","best-of-breed","killer","magnetic","bleeding-edge","web-enabled","interactive","dot-com","sexy","back-end","real-time","efficient","front-end","distributed","seamless","extensible","turn-key","world-class","open-source","cross-platform","cross-media","synergistic","bricks-and-clicks","out-of-the-box","enterprise","integrated","impactful","wireless","transparent","next-generation","cutting-edge","user-centric","visionary","customized","ubiquitous","plug-and-play","collaborative","compelling","holistic","rich"],["synergies","web-readiness","paradigms","markets","partnerships","infrastructures","platforms","initiatives","channels","eyeballs","communities","ROI","solutions","e-tailers","e-services","action-items","portals","niches","technologies","content","vortals","supply-chains","convergence","relationships","architectures","interfaces","e-markets","e-commerce","systems","bandwidth","infomediaries","models","mindshare","deliverables","users","schemas","networks","applications","metrics","e-business","functionalities","experiences","web services","methodologies"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} and #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","pl","com.pl","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"phone_number":{"formats":["12-###-##-##","13-###-##-##","14-###-##-##","15-###-##-##","16-###-##-##","17-###-##-##","18-###-##-##","22-###-##-##","23-###-##-##","24-###-##-##","25-###-##-##","29-###-##-##","32-###-##-##","33-###-##-##","34-###-##-##","41-###-##-##","42-###-##-##","43-###-##-##","44-###-##-##","46-###-##-##","48-###-##-##","52-###-##-##","54-###-##-##","55-###-##-##","56-###-##-##","58-###-##-##","59-###-##-##","61-###-##-##","62-###-##-##","63-###-##-##","65-###-##-##","67-###-##-##","68-###-##-##","71-###-##-##","74-###-##-##","75-###-##-##","76-###-##-##","77-###-##-##","81-###-##-##","82-###-##-##","83-###-##-##","84-###-##-##","85-###-##-##","86-###-##-##","87-###-##-##","89-###-##-##","91-###-##-##","94-###-##-##","95-###-##-##"]},"cell_phone":{"formats":["50-###-##-##","51-###-##-##","53-###-##-##","57-###-##-##","60-###-##-##","66-###-##-##","69-###-##-##","72-###-##-##","73-###-##-##","78-###-##-##","79-###-##-##","88-###-##-##"]}}},"nl":{"faker":{"address":{"city_prefix":["Noord","Oost","West","Zuid","Nieuw","Oud"],"city_suffix":["dam","berg"," aan de Rijn"," aan de IJssel","swaerd","endrecht","recht","ambacht","enmaes","wijk","sland","stroom","sluus","dijk","dorp","burg","veld","sluis","koop","lek","hout","geest","kerk","woude","hoven","hoten","ingen","plas","meer"],"city":["#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}","#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.last_name}#{city_suffix}"],"country":["Afghanistan","Akrotiri","Albani\u00eb","Algerije","Amerikaanse Maagdeneilanden","Amerikaans-Samoa","Andorra","Angola","Anguilla","Antarctica","Antigua en Barbuda","Arctic Ocean","Argentini\u00eb","Armeni\u00eb","Aruba","Ashmore and Cartier Islands","Atlantic Ocean","Australi\u00eb","Azerbeidzjan","Bahama's","Bahrein","Bangladesh","Barbados","Belarus","Belgi\u00eb","Belize","Benin","Bermuda","Bhutan","Bolivi\u00eb","Bosni\u00eb-Herzegovina","Botswana","Bouvet Island","Brazili\u00eb","British Indian Ocean Territory","Britse Maagdeneilanden","Brunei","Bulgarije","Burkina Faso","Burundi","Cambodja","Canada","Caymaneilanden","Centraal-Afrikaanse Republiek","Chili","China","Christmas Island","Clipperton Island","Cocos (Keeling) Islands","Colombia","Comoren (Unie)","Congo (Democratische Republiek)","Congo (Volksrepubliek)","Cook","Coral Sea Islands","Costa Rica","Cuba","Cyprus","Denemarken","Dhekelia","Djibouti","Dominica","Dominicaanse Republiek","Duitsland","Ecuador","Egypte","El Salvador","Equatoriaal-Guinea","Eritrea","Estland","Ethiopi\u00eb","European Union","Falkland","Faroe Islands","Fiji","Filipijnen","Finland","Frankrijk","Frans-Polynesi\u00eb","French Southern and Antarctic Lands","Gabon","Gambia","Gaza Strip","Georgi\u00eb","Ghana","Gibraltar","Grenada","Griekenland","Groenland","Guam","Guatemala","Guernsey","Guinea","Guinee-Bissau","Guyana","Ha\u00efti","Heard Island and McDonald Islands","Heilige Stoel","Honduras","Hongarije","Hongkong","Ierland","IJsland","India","Indian Ocean","Indonesi\u00eb","Irak","Iran","Isle of Man","Isra\u00ebl","Itali\u00eb","Ivoorkust","Jamaica","Jan Mayen","Japan","Jemen","Jersey","Jordani\u00eb","Kaapverdi\u00eb","Kameroen","Kazachstan","Kenia","Kirgizstan","Kiribati","Koeweit","Kroati\u00eb","Laos","Lesotho","Letland","Libanon","Liberia","Libi\u00eb","Liechtenstein","Litouwen","Luxemburg","Macao","Macedoni\u00eb","Madagaskar","Malawi","Maldiven","Maleisi\u00eb","Mali","Malta","Marokko","Marshall Islands","Mauritani\u00eb","Mauritius","Mayotte","Mexico","Micronesia, Federated States of","Moldavi\u00eb","Monaco","Mongoli\u00eb","Montenegro","Montserrat","Mozambique","Myanmar","Namibi\u00eb","Nauru","Navassa Island","Nederland","Nederlandse Antillen","Nepal","Ngwane","Nicaragua","Nieuw-Caledoni\u00eb","Nieuw-Zeeland","Niger","Nigeria","Niue","Noordelijke Marianen","Noord-Korea","Noorwegen","Norfolk Island","Oekra\u00efne","Oezbekistan","Oman","Oostenrijk","Pacific Ocean","Pakistan","Palau","Panama","Papoea-Nieuw-Guinea","Paracel Islands","Paraguay","Peru","Pitcairn","Polen","Portugal","Puerto Rico","Qatar","Roemeni\u00eb","Rusland","Rwanda","Saint Helena","Saint Lucia","Saint Vincent en de Grenadines","Saint-Pierre en Miquelon","Salomon","Samoa","San Marino","S\u00e3o Tom\u00e9 en Principe","Saudi-Arabi\u00eb","Senegal","Servi\u00eb","Seychellen","Sierra Leone","Singapore","Sint-Kitts en Nevis","Sloveni\u00eb","Slowakije","Soedan","Somali\u00eb","South Georgia and the South Sandwich Islands","Southern Ocean","Spanje","Spratly Islands","Sri Lanka","Suriname","Svalbard","Syri\u00eb","Tadzjikistan","Taiwan","Tanzania","Thailand","Timor Leste","Togo","Tokelau","Tonga","Trinidad en Tobago","Tsjaad","Tsjechi\u00eb","Tunesi\u00eb","Turkije","Turkmenistan","Turks-en Caicoseilanden","Tuvalu","Uganda","Uruguay","Vanuatu","Venezuela","Verenigd Koninkrijk","Verenigde Arabische Emiraten","Verenigde Staten van Amerika","Vietnam","Wake Island","Wallis en Futuna","Wereld","West Bank","Westelijke Sahara","Zambia","Zimbabwe","Zuid-Afrika","Zuid-Korea","Zweden","Zwitserland"],"building_number":["#","##","###","###a","###b","###c","### I","### II","### III"],"street_suffix":["straat","laan","weg","plantsoen","park"],"secondary_address":["1 hoog","2 hoog","3 hoog"],"street_name":["#{Name.first_name}#{street_suffix}","#{Name.last_name}#{street_suffix}"],"street_address":["#{street_name} #{building_number}"],"postcode":["#### ??"],"state":["Noord-Holland","Zuid-Holland","Utrecht","Zeeland","Overijssel","Gelderland","Drenthe","Friesland","Groningen","Noord-Braband","Limburg"],"default_country":["Nederland"]},"company":{"suffix":["BV","V.O.F.","Group","en Zonen"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["nl","com","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"],"supplemental":["abbas","abduco","abeo","abscido","absconditus","absens","absorbeo","absque","abstergo","absum","abundans","abutor","accedo","accendo","acceptus","accipio","accommodo","accusator","acer","acerbitas","acervus","acidus","acies","acquiro","acsi","adamo","adaugeo","addo","adduco","ademptio","adeo","adeptio","adfectus","adfero","adficio","adflicto","adhaero","adhuc","adicio","adimpleo","adinventitias","adipiscor","adiuvo","administratio","admiratio","admitto","admoneo","admoveo","adnuo","adopto","adsidue","adstringo","adsuesco","adsum","adulatio","adulescens","adultus","aduro","advenio","adversus","advoco","aedificium","aeger","aegre","aegrotatio","aegrus","aeneus","aequitas","aequus","aer","aestas","aestivus","aestus","aetas","aeternus","ager","aggero","aggredior","agnitio","agnosco","ago","ait","aiunt","alienus","alii","alioqui","aliqua","alius","allatus","alo","alter","altus","alveus","amaritudo","ambitus","ambulo","amicitia","amiculum","amissio","amita","amitto","amo","amor","amoveo","amplexus","amplitudo","amplus","ancilla","angelus","angulus","angustus","animadverto","animi","animus","annus","anser","ante","antea","antepono","antiquus","aperio","aperte","apostolus","apparatus","appello","appono","appositus","approbo","apto","aptus","apud","aqua","ara","aranea","arbitro","arbor","arbustum","arca","arceo","arcesso","arcus","argentum","argumentum","arguo","arma","armarium","armo","aro","ars","articulus","artificiose","arto","arx","ascisco","ascit","asper","aspicio","asporto","assentator","astrum","atavus","ater","atqui","atrocitas","atrox","attero","attollo","attonbitus","auctor","auctus","audacia","audax","audentia","audeo","audio","auditor","aufero","aureus","auris","aurum","aut","autem","autus","auxilium","avaritia","avarus","aveho","averto","avoco","baiulus","balbus","barba","bardus","basium","beatus","bellicus","bellum","bene","beneficium","benevolentia","benigne","bestia","bibo","bis","blandior","bonus","bos","brevis","cado","caecus","caelestis","caelum","calamitas","calcar","calco","calculus","callide","campana","candidus","canis","canonicus","canto","capillus","capio","capitulus","capto","caput","carbo","carcer","careo","caries","cariosus","caritas","carmen","carpo","carus","casso","caste","casus","catena","caterva","cattus","cauda","causa","caute","caveo","cavus","cedo","celebrer","celer","celo","cena","cenaculum","ceno","censura","centum","cerno","cernuus","certe","certo","certus","cervus","cetera","charisma","chirographum","cibo","cibus","cicuta","cilicium","cimentarius","ciminatio","cinis","circumvenio","cito","civis","civitas","clam","clamo","claro","clarus","claudeo","claustrum","clementia","clibanus","coadunatio","coaegresco","coepi","coerceo","cogito","cognatus","cognomen","cogo","cohaero","cohibeo","cohors","colligo","colloco","collum","colo","color","coma","combibo","comburo","comedo","comes","cometes","comis","comitatus","commemoro","comminor","commodo","communis","comparo","compello","complectus","compono","comprehendo","comptus","conatus","concedo","concido","conculco","condico","conduco","confero","confido","conforto","confugo","congregatio","conicio","coniecto","conitor","coniuratio","conor","conqueror","conscendo","conservo","considero","conspergo","constans","consuasor","contabesco","contego","contigo","contra","conturbo","conventus","convoco","copia","copiose","cornu","corona","corpus","correptius","corrigo","corroboro","corrumpo","coruscus","cotidie","crapula","cras","crastinus","creator","creber","crebro","credo","creo","creptio","crepusculum","cresco","creta","cribro","crinis","cruciamentum","crudelis","cruentus","crur","crustulum","crux","cubicularis","cubitum","cubo","cui","cuius","culpa","culpo","cultellus","cultura","cum","cunabula","cunae","cunctatio","cupiditas","cupio","cuppedia","cupressus","cur","cura","curatio","curia","curiositas","curis","curo","curriculum","currus","cursim","curso","cursus","curto","curtus","curvo","curvus","custodia","damnatio","damno","dapifer","debeo","debilito","decens","decerno","decet","decimus","decipio","decor","decretum","decumbo","dedecor","dedico","deduco","defaeco","defendo","defero","defessus","defetiscor","deficio","defigo","defleo","defluo","defungo","degenero","degero","degusto","deinde","delectatio","delego","deleo","delibero","delicate","delinquo","deludo","demens","demergo","demitto","demo","demonstro","demoror","demulceo","demum","denego","denique","dens","denuncio","denuo","deorsum","depereo","depono","depopulo","deporto","depraedor","deprecator","deprimo","depromo","depulso","deputo","derelinquo","derideo","deripio","desidero","desino","desipio","desolo","desparatus","despecto","despirmatio","infit","inflammatio","paens","patior","patria","patrocinor","patruus","pauci","paulatim","pauper","pax","peccatus","pecco","pecto","pectus","pecunia","pecus","peior","pel","ocer","socius","sodalitas","sol","soleo","solio","solitudo","solium","sollers","sollicito","solum","solus","solutio","solvo","somniculosus","somnus","sonitus","sono","sophismata","sopor","sordeo","sortitus","spargo","speciosus","spectaculum","speculum","sperno","spero","spes","spiculum","spiritus","spoliatio","sponte","stabilis","statim","statua","stella","stillicidium","stipes","stips","sto","strenuus","strues","studio","stultus","suadeo","suasoria","sub","subito","subiungo","sublime","subnecto","subseco","substantia","subvenio","succedo","succurro","sufficio","suffoco","suffragium","suggero","sui","sulum","sum","summa","summisse","summopere","sumo","sumptus","supellex","super","suppellex","supplanto","suppono","supra","surculus","surgo","sursum","suscipio","suspendo","sustineo","suus","synagoga","tabella","tabernus","tabesco","tabgo","tabula","taceo","tactus","taedium","talio","talis","talus","tam","tamdiu","tamen","tametsi","tamisium","tamquam","tandem","tantillus","tantum","tardus","tego","temeritas","temperantia","templum","temptatio","tempus","tenax","tendo","teneo","tener","tenuis","tenus","tepesco","tepidus","ter","terebro","teres","terga","tergeo","tergiversatio","tergo","tergum","termes","terminatio","tero","terra","terreo","territo","terror","tersus","tertius","testimonium","texo","textilis","textor","textus","thalassinus","theatrum","theca","thema","theologus","thermae","thesaurus","thesis","thorax","thymbra","thymum","tibi","timidus","timor","titulus","tolero","tollo","tondeo","tonsor","torqueo","torrens","tot","totidem","toties","totus","tracto","trado","traho","trans","tredecim","tremo","trepide","tres","tribuo","tricesimus","triduana","triginta","tripudio","tristis","triumphus","trucido","truculenter","tubineus","tui","tum","tumultus","tunc","turba","turbo","turpe","turpis","tutamen","tutis","tyrannus","uberrime","ubi","ulciscor","ullus","ulterius","ultio","ultra","umbra","umerus","umquam","una","unde","undique","universe","unus","urbanus","urbs","uredo","usitas","usque","ustilo","ustulo","usus","uter","uterque","utilis","utique","utor","utpote","utrimque","utroque","utrum","uxor","vaco","vacuus","vado","vae","valde","valens","valeo","valetudo","validus","vallum","vapulus","varietas","varius","vehemens","vel","velociter","velum","velut","venia","venio","ventito","ventosus","ventus","venustas","ver","verbera","verbum","vere","verecundia","vereor","vergo","veritas","vero","versus","verto","verumtamen","verus","vesco","vesica","vesper","vespillo","vester","vestigium","vestrum","vetus","via","vicinus","vicissitudo","victoria","victus","videlicet","video","viduata","viduo","vigilo","vigor","vilicus","vilis","vilitas","villa","vinco","vinculum","vindico","vinitor","vinum","vir","virga","virgo","viridis","viriliter","virtus","vis","viscus","vita","vitiosus","vitium","vito","vivo","vix","vobis","vociferor","voco","volaticus","volo","volubilis","voluntarius","volup","volutabrum","volva","vomer","vomica","vomito","vorago","vorax","voro","vos","votum","voveo","vox","vulariter","vulgaris","vulgivagus","vulgo","vulgus","vulnero","vulnus","vulpes","vulticulus","vultuosus","xiphias"]},"name":{"first_name":["Amber","Anna","Anne","Anouk","Bas","Bram","Britt","Daan","Emma","Eva","Femke","Finn","Fleur","Iris","Isa","Jan","Jasper","Jayden","Jesse","Johannes","Julia","Julian","Kevin","Lars","Lieke","Lisa","Lotte","Lucas","Luuk","Maud","Max","Mike","Milan","Nick","Niels","Noa","Rick","Roos","Ruben","Sander","Sanne","Sem","Sophie","Stijn","Sven","Thijs","Thijs","Thomas","Tim","Tom"],"tussenvoegsel":["van","van de","van den","van 't","van het","de","den"],"last_name":["Bakker","Beek","Berg","Boer","Bos","Bosch","Brink","Broek","Brouwer","Bruin","Dam","Dekker","Dijk","Dijkstra","Graaf","Groot","Haan","Hendriks","Heuvel","Hoek","Jacobs","Jansen","Janssen","Jong","Klein","Kok","Koning","Koster","Leeuwen","Linden","Maas","Meer","Meijer","Mulder","Peters","Ruiter","Schouten","Smit","Smits","Stichting","Veen","Ven","Vermeulen","Visser","Vliet","Vos","Vries","Wal","Willems","Wit"],"prefix":["Dhr.","Mevr. Dr.","Bsc","Msc","Prof."],"suffix":["Jr.","Sr.","I","II","III","IV","V"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{tussenvoegsel} #{last_name}","#{first_name} #{tussenvoegsel} #{last_name}"]},"phone_number":{"formats":["(####) ######","##########","06########","06 #### ####"]}}},"de-CH":{"faker":{"address":{"country_code":["CH","CH","CH","DE","AT","US","LI","US","HK","VN"],"postcode":["1###","2###","3###","4###","5###","6###","7###","8###","9###"],"default_country":["Schweiz"]},"company":{"suffix":["AG","GmbH","und S\u00f6hne","und Partner","& Co.","Gruppe","LLC","Inc."],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} und #{Name.last_name}"]},"internet":{"domain_suffix":["com","net","biz","ch","de","li","at","ch","ch"]},"phone_number":{"formats":["0800 ### ###","0800 ## ## ##","0## ### ## ##","0## ### ## ##","+41 ## ### ## ##","0900 ### ###","076 ### ## ##","+4178 ### ## ##","0041 79 ### ## ##"]}}},"en-CA":{"faker":{"address":{"postcode":["?#? #?#","?#?#?#"],"state":["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Nova Scotia","Northwest Territories","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"],"state_abbr":["AB","BC","MB","NB","NL","NS","NU","NT","ON","PE","QC","SK","YK"],"default_country":["Canada"]},"internet":{"free_email":["gmail.com","yahoo.ca","hotmail.com"],"domain_suffix":["ca","com","biz","info","name","net","org"]},"phone_number":{"formats":["###-###-####","(###)###-####","###.###.####","1-###-###-####","###-###-#### x###","(###)###-#### x###","1-###-###-#### x###","###.###.#### x###","###-###-#### x####","(###)###-#### x####","1-###-###-#### x####","###.###.#### x####","###-###-#### x#####","(###)###-#### x#####","1-###-###-#### x#####","###.###.#### x#####"]}}},"ko":{"faker":{"address":{"postcode":["###-###"],"state":["\uac15\uc6d0","\uacbd\uae30","\uacbd\ub0a8","\uacbd\ubd81","\uad11\uc8fc","\ub300\uad6c","\ub300\uc804","\ubd80\uc0b0","\uc11c\uc6b8","\uc6b8\uc0b0","\uc778\ucc9c","\uc804\ub0a8","\uc804\ubd81","\uc81c\uc8fc","\ucda9\ub0a8","\ucda9\ubd81","\uc138\uc885"],"state_abbr":["\uac15\uc6d0","\uacbd\uae30","\uacbd\ub0a8","\uacbd\ubd81","\uad11\uc8fc","\ub300\uad6c","\ub300\uc804","\ubd80\uc0b0","\uc11c\uc6b8","\uc6b8\uc0b0","\uc778\ucc9c","\uc804\ub0a8","\uc804\ubd81","\uc81c\uc8fc","\ucda9\ub0a8","\ucda9\ubd81","\uc138\uc885"],"city_suffix":["\uad6c","\uc2dc","\uad70"],"city_name":["\uac15\ub989","\uc591\uc591","\uc778\uc81c","\uad11\uc8fc","\uad6c\ub9ac","\ubd80\ucc9c","\ubc00\uc591","\ud1b5\uc601","\ucc3d\uc6d0","\uac70\ucc3d","\uace0\uc131","\uc591\uc0b0","\uae40\ucc9c","\uad6c\ubbf8","\uc601\uc8fc","\uad11\uc0b0","\ub0a8","\ubd81","\uace0\ucc3d","\uad70\uc0b0","\ub0a8\uc6d0","\ub3d9\uc791","\ub9c8\ud3ec","\uc1a1\ud30c","\uc6a9\uc0b0","\ubd80\ud3c9","\uac15\ud654","\uc218\uc131"],"city":["#{city_name}#{city_suffix}"],"street_root":["\uc0c1\uacc4","\ud654\uace1","\uc2e0\uc815","\ubaa9","\uc7a0\uc2e4","\uba74\ubaa9","\uc8fc\uc548","\uc548\uc591","\uc911","\uc815\uc655","\uad6c\ub85c","\uc2e0\uc6d4","\uc5f0\uc0b0","\ubd80\ud3c9","\ucc3d","\ub9cc\uc218","\uc911\uacc4","\uac80\ub2e8","\uc2dc\ud765","\uc0c1\ub3c4","\ubc29\ubc30","\uc7a5\uc720","\uc0c1","\uad11\uba85","\uc2e0\uae38","\ud589\uc2e0","\ub300\uba85","\ub3d9\ud0c4"],"street_suffix":["\uc74d","\uba74","\ub3d9"],"street_name":["#{street_root}#{street_suffix}"]},"phone_number":{"formats":["0#-#####-####","0##-###-####","0##-####-####"]},"company":{"suffix":["\uc5f0\uad6c\uc18c","\uac8c\uc784\uc988","\uadf8\ub8f9","\uc804\uc790","\ubb3c\uc0b0","\ucf54\ub9ac\uc544"],"prefix":["\uc8fc\uc2dd\ud68c\uc0ac","\ud55c\uad6d"],"name":["#{prefix} #{Name.first_name}","#{Name.first_name} #{suffix}"]},"internet":{"free_email":["gmail.com","yahoo.co.kr","hanmail.net","naver.com"],"domain_suffix":["co.kr","com","biz","info","ne.kr","net","or.kr","org"]},"lorem":{"words":["\uad6d\uac00\ub294","\ubc95\ub960\uc774","\uc815\ud558\ub294","\ubc14\uc5d0","\uc758\ud558\uc5ec","\uc7ac\uc678\uad6d\ubbfc\uc744","\ubcf4\ud638\ud560","\uc758\ubb34\ub97c","\uc9c4\ub2e4.","\ubaa8\ub4e0","\uad6d\ubbfc\uc740","\uc2e0\uccb4\uc758","\uc790\uc720\ub97c","\uac00\uc9c4\ub2e4.","\uad6d\uac00\ub294","\uc804\ud1b5\ubb38\ud654\uc758","\uacc4\uc2b9\u00b7\ubc1c\uc804\uacfc","\ubbfc\uc871\ubb38\ud654\uc758","\ucc3d\ub2ec\uc5d0","\ub178\ub825\ud558\uc5ec\uc57c","\ud55c\ub2e4.","\ud1b5\uc2e0\u00b7\ubc29\uc1a1\uc758","\uc2dc\uc124\uae30\uc900\uacfc","\uc2e0\ubb38\uc758","\uae30\ub2a5\uc744","\ubcf4\uc7a5\ud558\uae30","\uc704\ud558\uc5ec","\ud544\uc694\ud55c","\uc0ac\ud56d\uc740","\ubc95\ub960\ub85c","\uc815\ud55c\ub2e4.","\ud5cc\ubc95\uc5d0","\uc758\ud558\uc5ec","\uccb4\uacb0\u00b7\uacf5\ud3ec\ub41c","\uc870\uc57d\uacfc","\uc77c\ubc18\uc801\uc73c\ub85c","\uc2b9\uc778\ub41c","\uad6d\uc81c\ubc95\uaddc\ub294","\uad6d\ub0b4\ubc95\uacfc","\uac19\uc740","\ud6a8\ub825\uc744","\uac00\uc9c4\ub2e4.","\ub2e4\ub9cc,","\ud604\ud589\ubc94\uc778\uc778","\uacbd\uc6b0\uc640","\uc7a5\uae30","3\ub144","\uc774\uc0c1\uc758","\ud615\uc5d0","\ud574\ub2f9\ud558\ub294","\uc8c4\ub97c","\ubc94\ud558\uace0","\ub3c4\ud53c","\ub610\ub294","\uc99d\uac70\uc778\uba78\uc758","\uc5fc\ub824\uac00","\uc788\uc744","\ub54c\uc5d0\ub294","\uc0ac\ud6c4\uc5d0","\uc601\uc7a5\uc744","\uccad\uad6c\ud560","\uc218","\uc788\ub2e4.","\uc800\uc791\uc790\u00b7\ubc1c\uba85\uac00\u00b7\uacfc\ud559\uae30\uc220\uc790\uc640","\uc608\uc220\uac00\uc758","\uad8c\ub9ac\ub294","\ubc95\ub960\ub85c\uc368","\ubcf4\ud638\ud55c\ub2e4.","\ud615\uc0ac\ud53c\uace0\uc778\uc740","\uc720\uc8c4\uc758","\ud310\uacb0\uc774","\ud655\uc815\ub420","\ub54c\uae4c\uc9c0\ub294","\ubb34\uc8c4\ub85c","\ucd94\uc815\ub41c\ub2e4.","\ubaa8\ub4e0","\uad6d\ubbfc\uc740","\ud589\uc704\uc2dc\uc758","\ubc95\ub960\uc5d0","\uc758\ud558\uc5ec","\ubc94\uc8c4\ub97c","\uad6c\uc131\ud558\uc9c0","\uc544\ub2c8\ud558\ub294","\ud589\uc704\ub85c","\uc18c\ucd94\ub418\uc9c0","\uc544\ub2c8\ud558\uba70,","\ub3d9\uc77c\ud55c","\ubc94\uc8c4\uc5d0","\ub300\ud558\uc5ec","\uac70\ub4ed","\ucc98\ubc8c\ubc1b\uc9c0","\uc544\ub2c8\ud55c\ub2e4.","\uad6d\uac00\ub294","\ud3c9\uc0dd\uad50\uc721\uc744","\uc9c4\ud765\ud558\uc5ec\uc57c","\ud55c\ub2e4.","\ubaa8\ub4e0","\uad6d\ubbfc\uc740","\uc0ac\uc0dd\ud65c\uc758","\ube44\ubc00\uacfc","\uc790\uc720\ub97c","\uce68\ud574\ubc1b\uc9c0","\uc544\ub2c8\ud55c\ub2e4.","\uc758\ubb34\uad50\uc721\uc740","\ubb34\uc0c1\uc73c\ub85c","\ud55c\ub2e4.","\uc800\uc791\uc790\u00b7\ubc1c\uba85\uac00\u00b7\uacfc\ud559\uae30\uc220\uc790\uc640","\uc608\uc220\uac00\uc758","\uad8c\ub9ac\ub294","\ubc95\ub960\ub85c\uc368","\ubcf4\ud638\ud55c\ub2e4.","\uad6d\uac00\ub294","\ubaa8\uc131\uc758","\ubcf4\ud638\ub97c","\uc704\ud558\uc5ec","\ub178\ub825\ud558\uc5ec\uc57c","\ud55c\ub2e4.","\ud5cc\ubc95\uc5d0","\uc758\ud558\uc5ec","\uccb4\uacb0\u00b7\uacf5\ud3ec\ub41c","\uc870\uc57d\uacfc","\uc77c\ubc18\uc801\uc73c\ub85c","\uc2b9\uc778\ub41c","\uad6d\uc81c\ubc95\uaddc\ub294","\uad6d\ub0b4\ubc95\uacfc","\uac19\uc740","\ud6a8\ub825\uc744","\uac00\uc9c4\ub2e4."]},"name":{"last_name":["\uae40","\uc774","\ubc15","\ucd5c","\uc815","\uac15","\uc870","\uc724","\uc7a5","\uc784","\uc624","\ud55c","\uc2e0","\uc11c","\uad8c","\ud669","\uc548","\uc1a1","\ub958","\ud64d"],"first_name":["\uc11c\uc5f0","\ubbfc\uc11c","\uc11c\ud604","\uc9c0\uc6b0","\uc11c\uc724","\uc9c0\ubbfc","\uc218\ube48","\ud558\uc740","\uc608\uc740","\uc724\uc11c","\ubbfc\uc900","\uc9c0\ud6c4","\uc9c0\ud6c8","\uc900\uc11c","\ud604\uc6b0","\uc608\uc900","\uac74\uc6b0","\ud604\uc900","\ubbfc\uc7ac","\uc6b0\uc9c4","\uc740\uc8fc"],"name":["#{last_name} #{first_name}"]}},"surveyor":{"take_these_surveys":"\uc124\ubb38\uc5d0 \ub2f5\uc744 \ud558\uc154\ub3c4 \uc88b\uc2b5\ub2c8\ub2e4","take_it":"\ub2f5\uc744 \ud558\uc2ed\uc2dc\uc694","completed_survey":"\uc644\ub8cc\ub41c \uc124\ubb38","unable_to_find_your_responses":"\uc124\ubb38\uc5d0 \ub300\ud55c \ub2f5\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4","unable_to_update_survey":"\uc124\ubb38\uc744 \uc5c5\ub370\uc774\ud2b8 \ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4","unable_to_find_that_survey":"\uc774 \uc124\ubb38\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4","survey_started_success":"\uc124\ubb38 \uc870\uc0ac\uac00 \uc131\uacf5\uc801\uc73c\ub85c \uc2dc\uc791\ub418\uc5c8\uc2b5\ub2c8\ub2e4","click_here_to_finish":"\uc885\ub8cc \ud558\ub824\uba74 \uc5ec\uae30\ub97c \ub204\ub974\uc2ed\uc2dc\uc694","previous_section":"&laquo; \uc774\uc804 \ud56d\ubaa9\uc73c\ub85c","next_section":"\ub2e4\uc74c \ud56d\ubaa9\uc73c\ub85c &raquo;","select_one":"\ud558\ub098\ub97c \uc120\ud0dd\ud558\uc2ed\uc2dc\uc694","sections":"\ud56d\ubaa9","language":"\uc5b8\uc5b4"}},"ja":{"faker":{"address":{"postcode":["###-####"],"state":["\u5317\u6d77\u9053","\u9752\u68ee\u770c","\u5ca9\u624b\u770c","\u5bae\u57ce\u770c","\u79cb\u7530\u770c","\u5c71\u5f62\u770c","\u798f\u5cf6\u770c","\u8328\u57ce\u770c","\u6803\u6728\u770c","\u7fa4\u99ac\u770c","\u57fc\u7389\u770c","\u5343\u8449\u770c","\u6771\u4eac\u90fd","\u795e\u5948\u5ddd\u770c","\u65b0\u6f5f\u770c","\u5bcc\u5c71\u770c","\u77f3\u5ddd\u770c","\u798f\u4e95\u770c","\u5c71\u68a8\u770c","\u9577\u91ce\u770c","\u5c90\u961c\u770c","\u9759\u5ca1\u770c","\u611b\u77e5\u770c","\u4e09\u91cd\u770c","\u6ecb\u8cc0\u770c","\u4eac\u90fd\u5e9c","\u5927\u962a\u5e9c","\u5175\u5eab\u770c","\u5948\u826f\u770c","\u548c\u6b4c\u5c71\u770c","\u9ce5\u53d6\u770c","\u5cf6\u6839\u770c","\u5ca1\u5c71\u770c","\u5e83\u5cf6\u770c","\u5c71\u53e3\u770c","\u5fb3\u5cf6\u770c","\u9999\u5ddd\u770c","\u611b\u5a9b\u770c","\u9ad8\u77e5\u770c","\u798f\u5ca1\u770c","\u4f50\u8cc0\u770c","\u9577\u5d0e\u770c","\u718a\u672c\u770c","\u5927\u5206\u770c","\u5bae\u5d0e\u770c","\u9e7f\u5150\u5cf6\u770c","\u6c96\u7e04\u770c"],"state_abbr":["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47"],"city_prefix":["\u5317","\u6771","\u897f","\u5357","\u65b0","\u6e56","\u6e2f"],"city_suffix":["\u5e02","\u533a","\u753a","\u6751"],"city":["#{city_prefix}#{Name.first_name}#{city_suffix}","#{Name.first_name}#{city_suffix}","#{city_prefix}#{Name.last_name}#{city_suffix}","#{Name.last_name}#{city_suffix}"],"street_name":["#{Name.first_name}#{street_suffix}","#{Name.last_name}#{street_suffix}"]},"phone_number":{"formats":["0####-#-####","0###-##-####","0##-###-####","0#-####-####"]},"cell_phone":{"formats":["090-####-####","080-####-####","070-####-####"]},"name":{"last_name":["\u4f50\u85e4","\u9234\u6728","\u9ad8\u6a4b","\u7530\u4e2d","\u6e21\u8fba","\u4f0a\u85e4","\u5c71\u672c","\u4e2d\u6751","\u5c0f\u6797","\u52a0\u85e4","\u5409\u7530","\u5c71\u7530","\u4f50\u3005\u6728","\u5c71\u53e3","\u658e\u85e4","\u677e\u672c","\u4e95\u4e0a","\u6728\u6751","\u6797","\u6e05\u6c34"],"first_name":["\u5927\u7fd4","\u84ee","\u98af\u592a","\u6a39","\u5927\u548c","\u967d\u7fd4","\u9678\u6597","\u592a\u4e00","\u6d77\u7fd4","\u84bc\u7a7a","\u7ffc","\u967d\u83dc","\u7d50\u611b","\u7d50\u8863","\u674f","\u8389\u5b50","\u7f8e\u7fbd","\u7d50\u83dc","\u5fc3\u611b","\u611b\u83dc","\u7f8e\u54b2"],"name":["#{last_name} #{first_name}"]}}},"en-AU":{"faker":{"name":{"first_name":["William","Jack","Oliver","Joshua","Thomas","Lachlan","Cooper","Noah","Ethan","Lucas","James","Samuel","Jacob","Liam","Alexander","Benjamin","Max","Isaac","Daniel","Riley","Ryan","Charlie","Tyler","Jake","Matthew","Xavier","Harry","Jayden","Nicholas","Harrison","Levi","Luke","Adam","Henry","Aiden","Dylan","Oscar","Michael","Jackson","Logan","Joseph","Blake","Nathan","Connor","Elijah","Nate","Archie","Bailey","Marcus","Cameron","Jordan","Zachary","Caleb","Hunter","Ashton","Toby","Aidan","Hayden","Mason","Hamish","Edward","Angus","Eli","Sebastian","Christian","Patrick","Andrew","Anthony","Luca","Kai","Beau","Alex","George","Callum","Finn","Zac","Mitchell","Jett","Jesse","Gabriel","Leo","Declan","Charles","Jasper","Jonathan","Aaron","Hugo","David","Christopher","Chase","Owen","Justin","Ali","Darcy","Lincoln","Cody","Phoenix","Sam","John","Joel","Isabella","Ruby","Chloe","Olivia","Charlotte","Mia","Lily","Emily","Ella","Sienna","Sophie","Amelia","Grace","Ava","Zoe","Emma","Sophia","Matilda","Hannah","Jessica","Lucy","Georgia","Sarah","Abigail","Zara","Eva","Scarlett","Jasmine","Chelsea","Lilly","Ivy","Isla","Evie","Isabelle","Maddison","Layla","Summer","Annabelle","Alexis","Elizabeth","Bella","Holly","Lara","Madison","Alyssa","Maya","Tahlia","Claire","Hayley","Imogen","Jade","Ellie","Sofia","Addison","Molly","Phoebe","Alice","Savannah","Gabriella","Kayla","Mikayla","Abbey","Eliza","Willow","Alexandra","Poppy","Samantha","Stella","Amy","Amelie","Anna","Piper","Gemma","Isabel","Victoria","Stephanie","Caitlin","Heidi","Paige","Rose","Amber","Audrey","Claudia","Taylor","Madeline","Angelina","Natalie","Charli","Lauren","Ashley","Violet","Mackenzie","Abby","Skye","Lillian","Alana","Lola","Leah","Eve","Kiara"],"last_name":["Smith","Jones","Williams","Brown","Wilson","Taylor","Johnson","White","Martin","Anderson","Thompson","Nguyen","Thomas","Walker","Harris","Lee","Ryan","Robinson","Kelly","King","Davis","Wright","Evans","Roberts","Green","Hall","Wood","Jackson","Clarke","Patel","Khan","Lewis","James","Phillips","Mason","Mitchell","Rose","Davies","Rodriguez","Cox","Alexander","Garden","Campbell","Johnston","Moore","Smyth","O'neill","Doherty","Stewart","Quinn","Murphy","Graham","Mclaughlin","Hamilton","Murray","Hughes","Robertson","Thomson","Scott","Macdonald","Reid","Clark","Ross","Young","Watson","Paterson","Morrison","Morgan","Griffiths","Edwards","Rees","Jenkins","Owen","Price","Moss","Richards","Abbott","Adams","Armstrong","Bahringer","Bailey","Barrows","Bartell","Bartoletti","Barton","Bauch","Baumbach","Bayer","Beahan","Beatty","Becker","Beier","Berge","Bergstrom","Bode","Bogan","Borer","Bosco","Botsford","Boyer","Boyle","Braun","Bruen","Carroll","Carter","Cartwright","Casper","Cassin","Champlin","Christiansen","Cole","Collier","Collins","Connelly","Conroy","Corkery","Cormier","Corwin","Cronin","Crooks","Cruickshank","Cummings","D'amore","Daniel","Dare","Daugherty","Dickens","Dickinson","Dietrich","Donnelly","Dooley","Douglas","Doyle","Durgan","Ebert","Emard","Emmerich","Erdman","Ernser","Fadel","Fahey","Farrell","Fay","Feeney","Feil","Ferry","Fisher","Flatley","Gibson","Gleason","Glover","Goldner","Goodwin","Grady","Grant","Greenfelder","Greenholt","Grimes","Gutmann","Hackett","Hahn","Haley","Hammes","Hand","Hane","Hansen","Harber","Hartmann","Harvey","Hayes","Heaney","Heathcote","Heller","Hermann","Hermiston","Hessel","Hettinger","Hickle","Hill","Hills","Hoppe","Howe","Howell","Hudson","Huel","Hyatt","Jacobi","Jacobs","Jacobson","Jerde","Johns","Keeling","Kemmer","Kessler","Kiehn","Kirlin","Klein","Koch","Koelpin","Kohler","Koss","Kovacek","Kreiger","Kris","Kuhlman","Kuhn","Kulas","Kunde","Kutch","Lakin","Lang","Langworth","Larkin","Larson","Leannon","Leffler","Little","Lockman","Lowe","Lynch","Mann","Marks","Marvin","Mayer","Mccullough","Mcdermott","Mckenzie","Miller","Mills","Monahan","Morissette","Mueller","Muller","Nader","Nicolas","Nolan","O'connell","O'conner","O'hara","O'keefe","Olson","O'reilly","Parisian","Parker","Quigley","Reilly","Reynolds","Rice","Ritchie","Rohan","Rolfson","Rowe","Russel","Rutherford","Sanford","Sauer","Schmidt","Schmitt","Schneider","Schroeder","Schultz","Shields","Smitham","Spencer","Stanton","Stark","Stokes","Swift","Tillman","Towne","Tremblay","Tromp","Turcotte","Turner","Walsh","Walter","Ward","Waters","Weber","Welch","West","Wilderman","Wilkinson","Williamson","Windler","Wolf"]},"company":{"suffix":["Pty Ltd","and Sons","Corp","Group","Brothers","Partners"]},"internet":{"domain_suffix":["com.au","com","net.au","net","org.au","org"]},"address":{"state_abbr":["NSW","QLD","NT","SA","WA","TAS","ACT","VIC"],"state":["New South Wales","Queensland","Northern Territory","South Australia","Western Australia","Tasmania","Australian Capital Territory","Victoria"],"postcode":["0###","2###","3###","4###","5###","6###","7###"],"building_number":["####","###","##"],"street_suffix":["Avenue","Boulevard","Circle","Circuit","Court","Crescent","Crest","Drive","Estate Dr","Grove","Hill","Island","Junction","Knoll","Lane","Loop","Mall","Manor","Meadow","Mews","Parade","Parkway","Pass","Place","Plaza","Ridge","Road","Run","Square","Station St","Street","Summit","Terrace","Track","Trail","View Rd","Way"],"default_country":["Australia"]},"phone_number":{"formats":["0# #### ####","+61 # #### ####","04## ### ###","+61 4## ### ###"]}}},"vi":{"faker":{"address":{"city_root":["B\u1eafc Giang","B\u1eafc K\u1ea1n","B\u1eafc Ninh","Cao B\u1eb1ng","\u0110i\u1ec7n Bi\u00ean","H\u00e0 Giang","H\u00e0 Nam","H\u00e0 T\u00e2y","H\u1ea3i D\u01b0\u01a1ng","TP H\u1ea3i Ph\u00f2ng","H\u00f2a B\u00ecnh","H\u01b0ng Y\u00ean","Lai Ch\u00e2u","L\u00e0o Cai","L\u1ea1ng S\u01a1n","Nam \u0110\u1ecbnh","Ninh B\u00ecnh","Ph\u00fa Th\u1ecd","Qu\u1ea3ng Ninh","S\u01a1n La","Th\u00e1i B\u00ecnh","Th\u00e1i Nguy\u00ean","Tuy\u00ean Quang","V\u0129nh Ph\u00fac","Y\u00ean B\u00e1i","TP \u0110\u00e0 N\u1eb5ng","B\u00ecnh \u0110\u1ecbnh","\u0110\u1eafk L\u1eafk","\u0110\u1eafk N\u00f4ng","Gia Lai","H\u00e0 T\u0129nh","Kh\u00e1nh H\u00f2a","Kon Tum","Ngh\u1ec7 An","Ph\u00fa Y\u00ean","Qu\u1ea3ng B\u00ecnh","Qu\u1ea3ng Nam","Qu\u1ea3ng Ng\u00e3i","Qu\u1ea3ng Tr\u1ecb","Thanh H\u00f3a","Th\u1eeba Thi\u00ean Hu\u1ebf","TP TP. H\u1ed3 Ch\u00ed Minh","An Giang","B\u00e0 R\u1ecba V\u0169ng T\u00e0u","B\u1ea1c Li\u00eau","B\u1ebfn Tre","B\u00ecnh D\u01b0\u01a1ng","B\u00ecnh Ph\u01b0\u1edbc","B\u00ecnh Thu\u1eadn","C\u00e0 Mau","TP C\u1ea7n Th\u01a1","\u0110\u1ed3ng Nai","\u0110\u1ed3ng Th\u00e1p","H\u1eadu Giang","Ki\u00ean Giang","L\u00e2m \u0110\u1ed3ng","Long An","Ninh Thu\u1eadn","S\u00f3c Tr\u0103ng","T\u00e2y Ninh","Ti\u1ec1n Giang","Tr\u00e0 Vinh","V\u0129nh Long"],"city":["#{city_root}"],"postcode":"/[A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}/","county":["Avon","Bedfordshire","Berkshire","Borders","Buckinghamshire","Cambridgeshire","Central","Cheshire","Cleveland","Clwyd","Cornwall","County Antrim","County Armagh","County Down","County Fermanagh","County Londonderry","County Tyrone","Cumbria","Derbyshire","Devon","Dorset","Dumfries and Galloway","Durham","Dyfed","East Sussex","Essex","Fife","Gloucestershire","Grampian","Greater Manchester","Gwent","Gwynedd County","Hampshire","Herefordshire","Hertfordshire","Highlands and Islands","Humberside","Isle of Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Lothian","Merseyside","Mid Glamorgan","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Powys","Rutland","Shropshire","Somerset","South Glamorgan","South Yorkshire","Staffordshire","Strathclyde","Suffolk","Surrey","Tayside","Tyne and Wear","Vi\u1ec7t Nam","Warwickshire","West Glamorgan","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire"],"default_country":["Vi\u1ec7t Nam"]},"internet":{"domain_suffix":["com","net","info","vn","com.vn"]},"phone_number":{"formats":["01#### #####","01### ######","01#1 ### ####","011# ### ####","02# #### ####","03## ### ####","055 #### ####","056 #### ####","0800 ### ####","08## ### ####","09## ### ####","016977 ####","01### #####","0500 ######","0800 ######"]},"cell_phone":{"formats":["074## ######","075## ######","076## ######","077## ######","078## ######","079## ######"]},"name":{"first_name":["Ph\u1ea1m","Nguy\u1ec5n","Tr\u1ea7n","L\u00ea","L\u00fd","Ho\u00e0ng","Phan","V\u0169","T\u0103ng","\u0110\u1eb7ng","B\u00f9i","\u0110\u1ed7","H\u1ed3","Ng\u00f4","D\u01b0\u01a1ng","\u0110\u00e0o","\u0110o\u00e0n","V\u01b0\u01a1ng","Tr\u1ecbnh","\u0110inh","L\u00e2m","Ph\u00f9ng","Mai","T\u00f4","Tr\u01b0\u01a1ng","H\u00e0"],"last_name":["Nam","Trung","Thanh","Th\u1ecb","V\u0103n","D\u01b0\u01a1ng","T\u0103ng","Qu\u1ed1c","Nh\u01b0","Ph\u1ea1m","Nguy\u1ec5n","Tr\u1ea7n","L\u00ea","L\u00fd","Ho\u00e0ng","Phan","V\u0169","T\u0103ng","\u0110\u1eb7ng","B\u00f9i","\u0110\u1ed7","H\u1ed3","Ng\u00f4","D\u01b0\u01a1ng","\u0110\u00e0o","\u0110o\u00e0n","V\u01b0\u01a1ng","Tr\u1ecbnh","\u0110inh","L\u00e2m","Ph\u00f9ng","Mai","T\u00f4","Tr\u01b0\u01a1ng","H\u00e0","Vinh","Nhung","H\u00f2a","Ti\u1ebfn","T\u00e2m","B\u1eedu","Loan","Hi\u1ec1n","H\u1ea3i","V\u00e2n","Kha","Minh","Nh\u00e2n","Tri\u1ec7u","Tu\u00e2n","H\u1eefu","\u0110\u1ee9c","Ph\u00fa","Khoa","Th\u1eafgn","S\u01a1n","Dung","T\u00fa","Trinh","Th\u1ea3o","Sa","Kim","Long","Thi","C\u01b0\u1eddng","Ng\u1ecdc","Sinh","Khang","Phong","Th\u1eafm","Thu","Th\u1ee7y","Nh\u00e0n"],"name":["#{first_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name} #{last_name}"]},"company":{"prefix":["C\u00f4ng ty","Cty TNHH","Cty","C\u1eeda h\u00e0ng","Trung t\u00e2m","Chi nh\u00e1nh"],"name":["#{prefix} #{Name.last_name}"]},"lorem":{"words":["\u0111\u00e3","\u0111ang","\u1eeb","\u1edd","\u00e1","kh\u00f4ng","bi\u1ebft","g\u00ec","h\u1ebft","\u0111\u00e2u","nha","th\u1ebf","th\u00ec","l\u00e0","\u0111\u00e1nh","\u0111\u00e1","\u0111\u1eadp","ph\u00e1","vi\u1ebft","v\u1ebd","t\u00f4","thu\u00ea","m\u01b0\u1edbn","m\u01b0\u1ee3n","mua","m\u1ed9t","hai","ba","b\u1ed1n","n\u0103m","s\u00e1u","b\u1ea3y","t\u00e1m","ch\u00edn","m\u01b0\u1eddi","th\u00f4i","vi\u1ec7c","ngh\u1ec9","l\u00e0m","nh\u00e0","c\u1eeda","xe","\u0111\u1ea1p","\u00e1c","\u0111\u1ed9c","kho\u1ea3ng","khoan","thuy\u1ec1n","t\u00e0u","b\u00e8","l\u1ea7u","xanh","\u0111\u1ecf","t\u00edm","v\u00e0ng","kim","ch\u1ec9","kh\u00e2u","may","v\u00e1","em","anh","y\u00eau","th\u01b0\u01a1ng","th\u00edch","con","c\u00e1i","b\u00e0n","gh\u1ebf","t\u1ee7","qu\u1ea7n","\u00e1o","n\u00f3n","d\u00e9p","gi\u00e0y","l\u1ed7i","\u0111\u01b0\u1ee3c","gh\u00e9t","gi\u1ebft","ch\u1ebft","h\u1ebft","t\u00f4i","b\u1ea1n","tui","tr\u1eddi","tr\u0103ng","m\u00e2y","gi\u00f3","m\u00e1y","h\u00e0ng","h\u00f3a","leo","n\u00fai","b\u01a1i","bi\u1ec3n","ch\u00ecm","xu\u1ed3ng","n\u01b0\u1edbc","ng\u1ecdt","ru\u1ed9ng","\u0111\u1ed3ng","qu\u00ea","h\u01b0\u01a1ng"]}}},"en-BORK":{"faker":{"lorem":{"words":["Boot","I","Nu","Nur","Tu","Um","a","becoose-a","boot","bork","burn","chuuses","cumplete-a","cun","cunseqooences","curcoomstunces","dee","deeslikes","denuoonceeng","desures","du","eccuoont","ectooel","edfuntege-a","efueeds","egeeen","ell","ere-a","feend","foolt","frum","geefe-a","gesh","greet","heem","heppeeness","hes","hoo","hoomun","idea","ifer","in","incuoonter","injuy","itselff","ixcept","ixemple-a","ixerceese-a","ixpleeen","ixplurer","ixpuoond","ixtremely","knoo","lebureeuoos","lufes","meestekee","mester-booeelder","moost","mun","nu","nut","oobteeen","oocceseeunelly","ooccoor","ooff","oone-a","oor","peeen","peeenffool","physeecel","pleesoore-a","poorsooe-a","poorsooes","preeesing","prucoore-a","prudooces","reeght","reshunelly","resooltunt","sume-a","teecheengs","teke-a","thees","thet","thuse-a","treefiel","troot","tu","tueel","und","undertekes","unnuyeeng","uny","unyune-a","us","veell","veet","ves","vheech","vhu","yuoo","zee","zeere-a"]}}},"nep":{"faker":{"name":{"first_name":["Aarav","Ajita","Amit","Amita","Amrit","Arijit","Ashmi","Asmita","Bibek","Bijay","Bikash","Bina","Bishal","Bishnu","Buddha","Deepika","Dipendra","Gagan","Ganesh","Khem","Krishna","Laxmi","Manisha","Nabin","Nikita","Niraj","Nischal","Padam","Pooja","Prabin","Prakash","Prashant","Prem","Purna","Rajendra","Rajina","Raju","Rakesh","Ranjan","Ratna","Sagar","Sandeep","Sanjay","Santosh","Sarita","Shilpa","Shirisha","Shristi","Siddhartha","Subash","Sumeet","Sunita","Suraj","Susan","Sushant"],"last_name":["Adhikari","Aryal","Baral","Basnet","Bastola","Basynat","Bhandari","Bhattarai","Chettri","Devkota","Dhakal","Dongol","Ghale","Gurung","Gyawali","Hamal","Jung","KC","Kafle","Karki","Khadka","Koirala","Lama","Limbu","Magar","Maharjan","Niroula","Pandey","Pradhan","Rana","Raut","Sai","Shai","Shakya","Sherpa","Shrestha","Subedi","Tamang","Thapa"]},"address":{"postcode":[0],"state":["Baglung","Banke","Bara","Bardiya","Bhaktapur","Bhojupu","Chitwan","Dailekh","Dang","Dhading","Dhankuta","Dhanusa","Dolakha","Dolpha","Gorkha","Gulmi","Humla","Ilam","Jajarkot","Jhapa","Jumla","Kabhrepalanchok","Kalikot","Kapilvastu","Kaski","Kathmandu","Lalitpur","Lamjung","Manang","Mohottari","Morang","Mugu","Mustang","Myagdi","Nawalparasi","Nuwakot","Palpa","Parbat","Parsa","Ramechhap","Rauswa","Rautahat","Rolpa","Rupandehi","Sankhuwasabha","Sarlahi","Sindhuli","Sindhupalchok","Sunsari","Surket","Syangja","Tanahu","Terhathum"],"city":["Bhaktapur","Biratnagar","Birendranagar","Birgunj","Butwal","Damak","Dharan","Gaur","Gorkha","Hetauda","Itahari","Janakpur","Kathmandu","Lahan","Nepalgunj","Pokhara"],"default_country":["Nepal"]},"internet":{"free_email":["worldlink.com.np","gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["np","com","info","net","org"]},"company":{"suffix":["Pvt Ltd","Group","Ltd","Limited"]},"phone_number":{"formats":["##-#######","+977-#-#######","+977########"]}}},"es":{"faker":{"address":{"city_prefix":["Parla","Telde","Baracaldo","San Fernando","Torrevieja","Lugo","Santiago de Compostela","Gerona","C\u00e1ceres","Lorca","Coslada","Talavera de la Reina","El Puerto de Santa Mar\u00eda","Cornell\u00e1 de Llobregat","Avil\u00e9s","Palencia","Gecho","Orihuela","Pontevedra","Pozuelo de Alarc\u00f3n","Toledo","El Ejido","Guadalajara","Gand\u00eda","Ceuta","Ferrol","Chiclana de la Frontera","Manresa","Roquetas de Mar","Ciudad Real","Rub\u00ed","Benidorm","San Sebast\u00edan de los Reyes","Ponferrada","Zamora","Alcal\u00e1 de Guadaira","Fuengirola","Mijas","Sanl\u00facar de Barrameda","La L\u00ednea de la Concepci\u00f3n","Majadahonda","Sagunto","El Prat de LLobregat","Viladecans","Linares","Alcoy","Ir\u00fan","Estepona","Torremolinos","Rivas-Vaciamadrid","Molina de Segura","Paterna","Granollers","Santa Luc\u00eda de Tirajana","Motril","Cerda\u00f1ola del Vall\u00e9s","Arrecife","Segovia","Torrelavega","Elda","M\u00e9rida","\u00c1vila","Valdemoro","Cuenta","Collado Villalba","Benalm\u00e1dena","Mollet del Vall\u00e9s","Puertollano","Madrid","Barcelona","Valencia","Sevilla","Zaragoza","M\u00e1laga","Murcia","Palma de Mallorca","Las Palmas de Gran Canaria","Bilbao","C\u00f3rdoba","Alicante","Valladolid","Vigo","Gij\u00f3n","Hospitalet de LLobregat","La Coru\u00f1a","Granada","Vitoria","Elche","Santa Cruz de Tenerife","Oviedo","Badalona","Cartagena","M\u00f3stoles","Jerez de la Frontera","Tarrasa","Sabadell","Alcal\u00e1 de Henares","Pamplona","Fuenlabrada","Almer\u00eda","San Sebasti\u00e1n","Legan\u00e9s","Santander","Burgos","Castell\u00f3n de la Plana","Alcorc\u00f3n","Albacete","Getafe","Salamanca","Huelva","Logro\u00f1o","Badajoz","San Cristr\u00f3bal de la Laguna","Le\u00f3n","Tarragona","C\u00e1diz","L\u00e9rida","Marbella","Matar\u00f3","Dos Hermanas","Santa Coloma de Gramanet","Ja\u00e9n","Algeciras","Torrej\u00f3n de Ardoz","Orense","Alcobendas","Reus","Calahorra","Inca"],"country":["Afganist\u00e1n","Albania","Argelia","Andorra","Angola","Argentina","Armenia","Aruba","Australia","Austria","Azerbay\u00e1n","Bahamas","Barein","Bangladesh","Barbados","Bielorusia","B\u00e9lgica","Belice","Bermuda","But\u00e1n","Bolivia","Bosnia Herzegovina","Botswana","Brasil","Bulgaria","Burkina Faso","Burundi","Camboya","Camer\u00fan","Canada","Cabo Verde","Islas Caim\u00e1n","Chad","Chile","China","Isla de Navidad","Colombia","Comodos","Congo","Costa Rica","Costa de Marfil","Croacia","Cuba","Chipre","Rep\u00fablica Checa","Dinamarca","Dominica","Rep\u00fablica Dominicana","Ecuador","Egipto","El Salvador","Guinea Ecuatorial","Eritrea","Estonia","Etiop\u00eda","Islas Faro","Fiji","Finlandia","Francia","Gab\u00f3n","Gambia","Georgia","Alemania","Ghana","Grecia","Groenlandia","Granada","Guadalupe","Guam","Guatemala","Guinea","Guinea-Bisau","Guayana","Haiti","Honduras","Hong Kong","Hungria","Islandia","India","Indonesia","Iran","Irak","Irlanda","Italia","Jamaica","Jap\u00f3n","Jordania","Kazajistan","Kenia","Kiribati","Corea","Kuwait","Letonia","L\u00edbano","Liberia","Liechtenstein","Lituania","Luxemburgo","Macao","Macedonia","Madagascar","Malawi","Malasia","Maldivas","Mali","Malta","Martinica","Mauritania","M\u00e9jico","Micronesia","Moldavia","M\u00f3naco","Mongolia","Montenegro","Montserrat","Marruecos","Mozambique","Namibia","Nauru","Nepal","Holanda","Nueva Zelanda","Nicaragua","Niger","Nigeria","Noruega","Om\u00e1n","Pakistan","Panam\u00e1","Pap\u00faa Nueva Guinea","Paraguay","Per\u00fa","Filipinas","Poland","Portugal","Puerto Rico","Rusia","Ruanda","Samoa","San Marino","Santo Tom\u00e9 y Principe","Arabia Saud\u00ed","Senegal","Serbia","Seychelles","Sierra Leona","Singapur","Eslovaquia","Eslovenia","Somalia","Espa\u00f1a","Sri Lanka","Sud\u00e1n","Suriname","Suecia","Suiza","Siria","Taiwan","Tajikistan","Tanzania","Tailandia","Timor-Leste","Togo","Tonga","Trinidad y Tobago","Tunez","Turquia","Uganda","Ucrania","Emiratos \u00c1rabes Unidos","Reino Unido","Estados Unidos de Am\u00e9rica","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"],"building_number":[" s/n.",", #",", ##"," #"," ##"],"street_suffix":["Aldea","Apartamento","Arrabal","Arroyo","Avenida","Bajada","Barranco","Barrio","Bloque","Calle","Calleja","Camino","Carretera","Caserio","Colegio","Colonia","Conjunto","Cuesta","Chalet","Edificio","Entrada","Escalinata","Explanada","Extramuros","Extrarradio","Ferrocarril","Glorieta","Gran Subida","Grupo","Huerta","Jardines","Lado","Lugar","Manzana","Mas\u00eda","Mercado","Monte","Muelle","Municipio","Parcela","Parque","Partida","Pasaje","Paseo","Plaza","Poblado","Pol\u00edgono","Prolongaci\u00f3n","Puente","Puerta","Quinta","Ramal","Rambla","Rampa","Riera","Rinc\u00f3n","Ronda","Rua","Salida","Sector","Secci\u00f3n","Senda","Solar","Subida","Terrenos","Torrente","Traves\u00eda","Urbanizaci\u00f3n","V\u00eda","V\u00eda P\u00fablica"],"secondary_address":["Esc. ###","Puerta ###"],"postcode":["#####"],"province":["\u00c1lava","Albacete","Alicante","Almer\u00eda","Asturias","\u00c1vila","Badajoz","Barcelona","Burgos","Cantabria","Castell\u00f3n","Ciudad Real","Cuenca","C\u00e1ceres","C\u00e1diz","C\u00f3rdoba","Gerona","Granada","Guadalajara","Guip\u00fazcoa","Huelva","Huesca","Islas Baleares","Ja\u00e9n","La Coru\u00f1a","La Rioja","Las Palmas","Le\u00f3n","Lugo","l\u00e9rida","Madrid","Murcia","M\u00e1laga","Navarra","Orense","Palencia","Pontevedra","Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel","Toledo","Valencia","Valladolid","Vizcaya","Zamora","Zaragoza"],"state":["Andaluc\u00eda","Arag\u00f3n","Principado de Asturias","Baleares","Canarias","Cantabria","Castilla-La Mancha","Castilla y Le\u00f3n","Catalu\u00f1a","Comunidad Valenciana","Extremadura","Galicia","La Rioja","Comunidad de Madrid","Navarra","Pa\u00eds Vasco","Regi\u00f3n de Murcia"],"state_abbr":["And","Ara","Ast","Bal","Can","Cbr","Man","Leo","Cat","Com","Ext","Gal","Rio","Mad","Nav","Vas","Mur"],"time_zone":["Pac\u00edfico/Midway","Pac\u00edfico/Pago_Pago","Pac\u00edfico/Honolulu","America/Juneau","America/Los_Angeles","America/Tijuana","America/Denver","America/Phoenix","America/Chihuahua","America/Mazatlan","America/Chicago","America/Regina","America/Mexico_City","America/Mexico_City","America/Monterrey","America/Guatemala","America/New_York","America/Indiana/Indianapolis","America/Bogota","America/Lima","America/Lima","America/Halifax","America/Caracas","America/La_Paz","America/Santiago","America/St_Johns","America/Sao_Paulo","America/Argentina/Buenos_Aires","America/Guyana","America/Godthab","Atlantic/South_Georgia","Atlantic/Azores","Atlantic/Cape_Verde","Europa/Dublin","Europa/London","Europa/Lisbon","Europa/London","Africa/Casablanca","Africa/Monrovia","Etc/UTC","Europa/Belgrade","Europa/Bratislava","Europa/Budapest","Europa/Ljubljana","Europa/Prague","Europa/Sarajevo","Europa/Skopje","Europa/Warsaw","Europa/Zagreb","Europa/Brussels","Europa/Copenhagen","Europa/Madrid","Europa/Paris","Europa/Amsterdam","Europa/Berlin","Europa/Berlin","Europa/Rome","Europa/Stockholm","Europa/Vienna","Africa/Algiers","Europa/Bucharest","Africa/Cairo","Europa/Helsinki","Europa/Kiev","Europa/Riga","Europa/Sofia","Europa/Tallinn","Europa/Vilnius","Europa/Athens","Europa/Istanbul","Europa/Minsk","Asia/Jerusalen","Africa/Harare","Africa/Johannesburg","Europa/Mosc\u00fa","Europa/Mosc\u00fa","Europa/Mosc\u00fa","Asia/Kuwait","Asia/Riyadh","Africa/Nairobi","Asia/Baghdad","Asia/Tehran","Asia/Muscat","Asia/Muscat","Asia/Baku","Asia/Tbilisi","Asia/Yerevan","Asia/Kabul","Asia/Yekaterinburg","Asia/Karachi","Asia/Karachi","Asia/Tashkent","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kolkata","Asia/Kathmandu","Asia/Dhaka","Asia/Dhaka","Asia/Colombo","Asia/Almaty","Asia/Novosibirsk","Asia/Rangoon","Asia/Bangkok","Asia/Bangkok","Asia/Jakarta","Asia/Krasnoyarsk","Asia/Shanghai","Asia/Chongqing","Asia/Hong_Kong","Asia/Urumqi","Asia/Kuala_Lumpur","Asia/Singapore","Asia/Taipei","Australia/Perth","Asia/Irkutsk","Asia/Ulaanbaatar","Asia/Seoul","Asia/Tokyo","Asia/Tokyo","Asia/Tokyo","Asia/Yakutsk","Australia/Darwin","Australia/Adelaide","Australia/Melbourne","Australia/Melbourne","Australia/Sydney","Australia/Brisbane","Australia/Hobart","Asia/Vladivostok","Pac\u00edfico/Guam","Pac\u00edfico/Port_Moresby","Asia/Magadan","Asia/Magadan","Pac\u00edfico/Noumea","Pac\u00edfico/Fiji","Asia/Kamchatka","Pac\u00edfico/Majuro","Pac\u00edfico/Auckland","Pac\u00edfico/Auckland","Pac\u00edfico/Tongatapu","Pac\u00edfico/Fakaofo","Pac\u00edfico/Apia"],"city":["#{city_prefix}"],"street_name":["#{street_suffix} #{Name.first_name}","#{street_suffix} #{Name.first_name} #{Name.last_name}"],"street_address":["#{street_name}#{building_number}","#{street_name}#{building_number} #{secondary_address}"],"default_country":["Espa\u00f1a"]},"company":{"suffix":["S.L.","e Hijos","S.A.","Hermanos"],"buzzwords":[["habilidad","acceso","adaptador","algoritmo","alianza","analista","aplicaci\u00f3n","enfoque","arquitectura","archivo","inteligencia artificial","array","actitud","medici\u00f3n","gesti\u00f3n presupuestaria","capacidad","desaf\u00edo","circuito","colaboraci\u00f3n","complejidad","concepto","conglomeraci\u00f3n","contingencia","n\u00facleo","fidelidad","base de datos","data-warehouse","definici\u00f3n","emulaci\u00f3n","codificar","encriptar","extranet","firmware","flexibilidad","focus group","previsi\u00f3n","base de trabajo","funci\u00f3n","funcionalidad","Interfaz Gr\u00e1fica","groupware","Interfaz gr\u00e1fico de usuario","hardware","Soporte","jerarqu\u00eda","conjunto","implementaci\u00f3n","infraestructura","iniciativa","instalaci\u00f3n","conjunto de instrucciones","interfaz","intranet","base del conocimiento","red de area local","aprovechar","matrices","metodolog\u00edas","middleware","migraci\u00f3n","modelo","moderador","monitorizar","arquitectura abierta","sistema abierto","orquestar","paradigma","paralelismo","pol\u00edtica","portal","estructura de precios","proceso de mejora","producto","productividad","proyecto","proyecci\u00f3n","protocolo","l\u00ednea segura","software","soluci\u00f3n","estandardizaci\u00f3n","estrategia","estructura","\u00e9xito","superestructura","soporte","sinergia","mediante","marco de tiempo","caja de herramientas","utilizaci\u00f3n","website","fuerza de trabajo"],["24 horas","24/7","3rd generaci\u00f3n","4th generaci\u00f3n","5th generaci\u00f3n","6th generaci\u00f3n","analizada","asim\u00e9trica","as\u00edncrona","monitorizada por red","bidireccional","bifurcada","generada por el cliente","cliente servidor","coherente","cohesiva","compuesto","sensible al contexto","basado en el contexto","basado en contenido","dedicada","generado por la demanda","didactica","direccional","discreta","din\u00e1mica","potenciada","acompasada","ejecutiva","expl\u00edcita","tolerante a fallos","innovadora","amplio \u00e1banico","global","heur\u00edstica","alto nivel","hol\u00edstica","homog\u00e9nea","hibrida","incremental","intangible","interactiva","intermedia","local","log\u00edstica","maximizada","met\u00f3dica","misi\u00f3n cr\u00edtica","m\u00f3bil","modular","motivadora","multimedia","multiestado","multitarea","nacional","basado en necesidades","neutral","nueva generaci\u00f3n","no-vol\u00e1til","orientado a objetos","\u00f3ptima","optimizada","radical","tiempo real","rec\u00edproca","regional","escalable","secundaria","orientada a soluciones","estable","estatica","sistem\u00e1tica","sist\u00e9mica","tangible","terciaria","transicional","uniforme","valor a\u00f1adido","v\u00eda web","defectos cero","tolerancia cero"],["Adaptativo","Avanzado","Asimilado","Automatizado","Equilibrado","Centrado en el negocio","Centralizado","Clonado","Compatible","Configurable","Multi grupo","Multi plataforma","Centrado en el usuario","Configurable","Descentralizado","Digitalizado","Distribuido","Diverso","Reducido","Mejorado","Para toda la empresa","Ergonomico","Exclusivo","Expandido","Extendido","Cara a cara","Enfocado","Totalmente configurable","Fundamental","Or\u00edgenes","Horizontal","Implementado","Innovador","Integrado","Intuitivo","Inverso","Gestionado","Obligatorio","Monitorizado","Multi canal","Multi lateral","Multi capa","En red","Orientado a objetos","Open-source","Operativo","Optimizado","Opcional","Organico","Organizado","Perseverando","Persistente","en fases","Polarizado","Pre-emptivo","Proactivo","Enfocado a benficios","Profundo","Programable","Progresivo","Public-key","Enfocado en la calidad","Reactivo","Realineado","Re-contextualizado","Re-implementado","Reducido","Ingenieria inversa","Robusto","F\u00e1cil","Seguro","Auto proporciona","Compartible","Intercambiable","Sincronizado","Orientado a equipos","Total","Universal","Mejorado","Actualizable","Centrado en el usuario","Amigable","Versatil","Virtual","Visionario"]],"name":["#{Name.last_name} #{suffix}","#{Name.last_name} y #{Name.last_name}","#{Name.last_name} #{Name.last_name} #{suffix}","#{Name.last_name}, #{Name.last_name} y #{Name.last_name} Asociados"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","es","info","com.es","org"]},"name":{"first_name":["Ad\u00e1n","Agust\u00edn","Alberto","Alejandro","Alfonso","Alfredo","Andr\u00e9s","Antonio","Armando","Arturo","Benito","Benjam\u00edn","Bernardo","Carlos","C\u00e9sar","Claudio","Clemente","Cristian","Cristobal","Daniel","David","Diego","Eduardo","Emilio","Enrique","Ernesto","Esteban","Federico","Felipe","Fernando","Francisco","Gabriel","Gerardo","Germ\u00e1n","Gilberto","Gonzalo","Gregorio","Guillermo","Gustavo","Hern\u00e1n","Homero","Horacio","Hugo","Ignacio","Jacobo","Jaime","Javier","Jer\u00f3nimo","Jes\u00fas","Joaqu\u00edn","Jorge","Jorge Luis","Jos\u00e9","Jos\u00e9 Eduardo","Jos\u00e9 Emilio","Jos\u00e9 Luis","Jos\u00e9 Mar\u00eda","Juan","Juan Carlos","Julio","Julio C\u00e9sar","Lorenzo","Lucas","Luis","Luis Miguel","Manuel","Marco Antonio","Marcos","Mariano","Mario","Mart\u00edn","Mateo","Miguel","Miguel \u00c1ngel","Nicol\u00e1s","Octavio","\u00d3scar","Pablo","Patricio","Pedro","Rafael","Ramiro","Ram\u00f3n","Ra\u00fal","Ricardo","Roberto","Rodrigo","Rub\u00e9n","Salvador","Samuel","Sancho","Santiago","Sergio","Teodoro","Timoteo","Tom\u00e1s","Vicente","V\u00edctor","Adela","Adriana","Alejandra","Alicia","Amalia","Ana","Ana Luisa","Ana Mar\u00eda","Andrea","Anita","\u00c1ngela","Antonia","Ariadna","Barbara","Beatriz","Berta","Blanca","Caridad","Carla","Carlota","Carmen","Carolina","Catalina","Cecilia","Clara","Claudia","Concepci\u00f3n","Conchita","Cristina","Daniela","D\u00e9bora","Diana","Dolores","Lola","Dorotea","Elena","Elisa","Eloisa","Elsa","Elvira","Emilia","Esperanza","Estela","Ester","Eva","Florencia","Francisca","Gabriela","Gloria","Graciela","Guadalupe","Guillermina","In\u00e9s","Irene","Isabel","Isabela","Josefina","Juana","Julia","Laura","Leonor","Leticia","Lilia","Lorena","Lourdes","Lucia","Luisa","Luz","Magdalena","Manuela","Marcela","Margarita","Mar\u00eda","Mar\u00eda del Carmen","Mar\u00eda Cristina","Mar\u00eda Elena","Mar\u00eda Eugenia","Mar\u00eda Jos\u00e9","Mar\u00eda Luisa","Mar\u00eda Soledad","Mar\u00eda Teresa","Mariana","Maricarmen","Marilu","Marisol","Marta","Mayte","Mercedes","Micaela","M\u00f3nica","Natalia","Norma","Olivia","Patricia","Pilar","Ramona","Raquel","Rebeca","Reina","Rocio","Rosa","Rosalia","Rosario","Sara","Silvia","Sofia","Soledad","Sonia","Susana","Teresa","Ver\u00f3nica","Victoria","Virginia","Yolanda"],"last_name":["Abeyta","Abrego","Abreu","Acevedo","Acosta","Acu\u00f1a","Adame","Adorno","Agosto","Aguayo","\u00c1guilar","Aguilera","Aguirre","Alanis","Alaniz","Alarc\u00f3n","Alba","Alcala","Alc\u00e1ntar","Alcaraz","Alejandro","Alem\u00e1n","Alfaro","Alicea","Almanza","Almaraz","Almonte","Alonso","Alonzo","Altamirano","Alva","Alvarado","Alvarez","Amador","Amaya","Anaya","Anguiano","Angulo","Aparicio","Apodaca","Aponte","Arag\u00f3n","Ara\u00f1a","Aranda","Arce","Archuleta","Arellano","Arenas","Arevalo","Arguello","Arias","Armas","Armend\u00e1riz","Armenta","Armijo","Arredondo","Arreola","Arriaga","Arroyo","Arteaga","Atencio","\u00c1valos","\u00c1vila","Avil\u00e9s","Ayala","Baca","Badillo","B\u00e1ez","Baeza","Bahena","Balderas","Ballesteros","Banda","Ba\u00f1uelos","Barajas","Barela","Barrag\u00e1n","Barraza","Barrera","Barreto","Barrientos","Barrios","Batista","Becerra","Beltr\u00e1n","Benavides","Benav\u00eddez","Ben\u00edtez","Berm\u00fadez","Bernal","Berr\u00edos","B\u00e9tancourt","Blanco","Bonilla","Borrego","Botello","Bravo","Briones","Brise\u00f1o","Brito","Bueno","Burgos","Bustamante","Bustos","Caballero","Cab\u00e1n","Cabrera","Cadena","Caldera","Calder\u00f3n","Calvillo","Camacho","Camarillo","Campos","Canales","Candelaria","Cano","Cant\u00fa","Caraballo","Carbajal","Cardenas","Cardona","Carmona","Carranza","Carrasco","Carrasquillo","Carre\u00f3n","Carrera","Carrero","Carrillo","Carrion","Carvajal","Casanova","Casares","Cas\u00e1rez","Casas","Casillas","Casta\u00f1eda","Castellanos","Castillo","Castro","Cavazos","Cazares","Ceballos","Cedillo","Ceja","Centeno","Cepeda","Cerda","Cervantes","Cerv\u00e1ntez","Chac\u00f3n","Chapa","Chavarr\u00eda","Ch\u00e1vez","Cintr\u00f3n","Cisneros","Collado","Collazo","Col\u00f3n","Colunga","Concepci\u00f3n","Contreras","Cordero","C\u00f3rdova","Cornejo","Corona","Coronado","Corral","Corrales","Correa","Cort\u00e9s","Cortez","Cotto","Covarrubias","Crespo","Cruz","Cuellar","Curiel","D\u00e1vila","de Anda","de Jes\u00fas","Delacr\u00faz","Delafuente","Delagarza","Delao","Delapaz","Delarosa","Delatorre","Dele\u00f3n","Delgadillo","Delgado","Delr\u00edo","Delvalle","D\u00edaz","Dom\u00ednguez","Dom\u00ednquez","Duarte","Due\u00f1as","Duran","Echevarr\u00eda","Elizondo","Enr\u00edquez","Escalante","Escamilla","Escobar","Escobedo","Esparza","Espinal","Espino","Espinosa","Espinoza","Esquibel","Esquivel","Est\u00e9vez","Estrada","Fajardo","Far\u00edas","Feliciano","Fern\u00e1ndez","Ferrer","Fierro","Figueroa","Flores","Fl\u00f3rez","Fonseca","Franco","Fr\u00edas","Fuentes","Gait\u00e1n","Galarza","Galindo","Gallardo","Gallegos","Galv\u00e1n","G\u00e1lvez","Gamboa","Gamez","Gaona","Garay","Garc\u00eda","Garibay","Garica","Garrido","Garza","Gast\u00e9lum","Gayt\u00e1n","Gil","Gir\u00f3n","God\u00ednez","Godoy","G\u00f3mez","Gonzales","Gonz\u00e1lez","Gollum","Gracia","Granado","Granados","Griego","Grijalva","Guajardo","Guardado","Guerra","Guerrero","Guevara","Guillen","Gurule","Guti\u00e9rrez","Guzm\u00e1n","Haro","Henr\u00edquez","Heredia","Hern\u00e1dez","Hernandes","Hern\u00e1ndez","Herrera","Hidalgo","Hinojosa","Holgu\u00edn","Huerta","Hurtado","Ibarra","Iglesias","Irizarry","Jaime","Jaimes","J\u00e1quez","Jaramillo","Jasso","Jim\u00e9nez","Jim\u00ednez","Ju\u00e1rez","Jurado","Laboy","Lara","Laureano","Leal","Lebr\u00f3n","Ledesma","Leiva","Lemus","Le\u00f3n","Lerma","Leyva","Lim\u00f3n","Linares","Lira","Llamas","Loera","Lomeli","Longoria","L\u00f3pez","Lovato","Loya","Lozada","Lozano","Lucero","Lucio","Luevano","Lugo","Luna","Mac\u00edas","Madera","Madrid","Madrigal","Maestas","Maga\u00f1a","Malave","Maldonado","Manzanares","Mares","Mar\u00edn","M\u00e1rquez","Marrero","Marroqu\u00edn","Mart\u00ednez","Mascare\u00f1as","Mata","Mateo","Mat\u00edas","Matos","Maya","Mayorga","Medina","Medrano","Mej\u00eda","Mel\u00e9ndez","Melgar","Mena","Menchaca","M\u00e9ndez","Mendoza","Men\u00e9ndez","Meraz","Mercado","Merino","Mesa","Meza","Miramontes","Miranda","Mireles","Mojica","Molina","Mondrag\u00f3n","Monroy","Montalvo","Monta\u00f1ez","Monta\u00f1o","Montemayor","Montenegro","Montero","Montes","Montez","Montoya","Mora","Morales","Moreno","Mota","Moya","Mungu\u00eda","Mu\u00f1iz","Mu\u00f1oz","Murillo","Muro","N\u00e1jera","Naranjo","Narv\u00e1ez","Nava","Navarrete","Navarro","Nazario","Negrete","Negr\u00f3n","Nev\u00e1rez","Nieto","Nieves","Ni\u00f1o","Noriega","N\u00fa\u00f1ez","Ocampo","Ocasio","Ochoa","Ojeda","Olivares","Oliv\u00e1rez","Olivas","Olivera","Olivo","Olmos","Olvera","Ontiveros","Oquendo","Ord\u00f3\u00f1ez","Orellana","Ornelas","Orosco","Orozco","Orta","Ortega","Ortiz","Osorio","Otero","Ozuna","Pab\u00f3n","Pacheco","Padilla","Padr\u00f3n","P\u00e1ez","Pagan","Palacios","Palomino","Palomo","Pantoja","Paredes","Parra","Partida","Pati\u00f1o","Paz","Pedraza","Pedroza","Pelayo","Pe\u00f1a","Perales","Peralta","Perea","Peres","P\u00e9rez","Pichardo","Pi\u00f1a","Pineda","Pizarro","Polanco","Ponce","Porras","Portillo","Posada","Prado","Preciado","Prieto","Puente","Puga","Pulido","Quesada","Quezada","Qui\u00f1ones","Qui\u00f1\u00f3nez","Quintana","Quintanilla","Quintero","Quiroz","Rael","Ram\u00edrez","Ram\u00f3n","Ramos","Rangel","Rasc\u00f3n","Raya","Razo","Regalado","Rend\u00f3n","Renter\u00eda","Res\u00e9ndez","Reyes","Reyna","Reynoso","Rico","Rinc\u00f3n","Riojas","R\u00edos","Rivas","Rivera","Rivero","Robledo","Robles","Rocha","Rodarte","Rodr\u00edgez","Rodr\u00edguez","Rodr\u00edquez","Rojas","Rojo","Rold\u00e1n","Rol\u00f3n","Romero","Romo","Roque","Rosado","Rosales","Rosario","Rosas","Roybal","Rubio","Ruelas","Ruiz","Saavedra","S\u00e1enz","Saiz","Salas","Salazar","Salcedo","Salcido","Salda\u00f1a","Saldivar","Salgado","Salinas","Samaniego","Sanabria","Sanches","S\u00e1nchez","Sandoval","Santacruz","Santana","Santiago","Santill\u00e1n","Sarabia","Sauceda","Saucedo","Sedillo","Segovia","Segura","Sep\u00falveda","Serna","Serrano","Serrato","Sevilla","Sierra","Sisneros","Solano","Sol\u00eds","Soliz","Solorio","Solorzano","Soria","Sosa","Sotelo","Soto","Su\u00e1rez","Tafoya","Tamayo","Tamez","Tapia","Tejada","Tejeda","T\u00e9llez","Tello","Ter\u00e1n","Terrazas","Tijerina","Tirado","Toledo","Toro","Torres","T\u00f3rrez","Tovar","Trejo","Trevi\u00f1o","Trujillo","Ulibarri","Ulloa","Urbina","Ure\u00f1a","Ur\u00edas","Uribe","Urrutia","Vaca","Valadez","Vald\u00e9s","Valdez","Valdivia","Valencia","Valent\u00edn","Valenzuela","Valladares","Valle","Vallejo","Valles","Valverde","Vanegas","Varela","Vargas","V\u00e1squez","V\u00e1zquez","Vega","Vela","Velasco","Vel\u00e1squez","Vel\u00e1zquez","V\u00e9lez","V\u00e9liz","Venegas","Vera","Verdugo","Verduzco","Vergara","Viera","Vigil","Villa","Villag\u00f3mez","Villalobos","Villalpando","Villanueva","Villareal","Villarreal","Villase\u00f1or","Villegas","Y\u00e1\u00f1ez","Ybarra","Zambrano","Zamora","Zamudio","Zapata","Zaragoza","Zarate","Zavala","Zayas","Zelaya","Zepeda","Z\u00fa\u00f1iga"],"prefix":["Sr.","Sra.","Sta."],"suffix":["Jr.","Sr.","I","II","III","IV","V","MD","DDS","PhD","DVM"],"title":{"descriptor":["Jefe","Senior","Directo","Corporativo","Din\u00e1nmico","Futuro","Producto","Nacional","Regional","Distrito","Central","Global","Cliente","Inversor","International","Heredado","Adelante","Interno","Humano","Gerente","Director"],"level":["Soluciones","Programa","Marca","Seguridada","Investigaci\u00f3n","Marketing","Normas","Implementaci\u00f3n","Integraci\u00f3n","Funcionalidad","Respuesta","Paradigma","T\u00e1cticas","Identidad","Mercados","Grupo","Divisi\u00f3n","Aplicaciones","Optimizaci\u00f3n","Operaciones","Infraestructura","Intranet","Comunicaciones","Web","Calidad","Seguro","Mobilidad","Cuentas","Datos","Creativo","Configuraci\u00f3n","Contabilidad","Interacciones","Factores","Usabilidad","M\u00e9tricas"],"job":["Supervisor","Asociado","Ejecutivo","Relacciones","Oficial","Gerente","Ingeniero","Especialista","Director","Coordinador","Administrador","Arquitecto","Analista","Dise\u00f1ador","Planificador","T\u00e9cnico","Funcionario","Desarrollador","Productor","Consultor","Asistente","Facilitador","Agente","Representante","Estratega"]},"name":["#{prefix} #{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name} #{last_name}"]},"phone_number":{"formats":["9##-###-###","9##.###.###","9## ### ###","9########"]},"cell_phone":{"formats":["6##-###-###","6##.###.###","6## ### ###","6########"]}},"surveyor":{"take_these_surveys":"Bienvenido, usted puede tomar estas encuestas","take_it":"Tomar","completed_survey":"Encuesta completada","unable_to_find_your_responses":"No se puede encontrar sus respuestas a la encuesta","unable_to_update_survey":"No se puede actualizar la encuesta","unable_to_find_that_survey":"No se puede encontrar la encuesta","survey_started_success":"Encuesta iniciada correctamente","click_here_to_finish":"Haga clic aqu\u00ed para terminar","previous_section":"&laquo; Secci\u00f3n anterior","next_section":"Secci\u00f3n siguiente &raquo;","select_one":"Seleccione una ...","sections":"Secciones","language":"Idioma"},"surveys":{"dass":{"name":"DASS","questions":[null,"Me cost\u00f3 mucho relajarme.","Me di cuenta que tenia la boca seca.","No pod\u00eda sentir ning\u00fan sentimiento positivo.","Se me hizo dif\u00edcil respirar.","Se me hizo dif\u00edcil tomar la iniciativa para hacer cosas.","Reaccion\u00e9 exageradamente en ciertas situaciones.","Sent\u00ed que mis manos temblaban.","Sent\u00ed que tenia muchos nervios.","Estaba preocupado por situaciones en las cuales pod\u00eda tener p\u00e1nico o en las que podr\u00eda hacer el rid\u00edculo.","Sent\u00ed que no tenia nada por que vivir.","Not\u00e9 que me agitaba.","Se me hizo dif\u00edcil relajarme.","Me sent\u00ed triste y deprimido.","No toler\u00e9 nada que no me permitiera continuar con lo que estaba haciendo.","Sent\u00ed que estaba al punto de p\u00e1nico.","No me pude entusiasmar por nada.","Sent\u00ed que val\u00eda muy poco como persona.","Sent\u00ed que estaba muy irritable.","Sent\u00ed los latidos de mi coraz\u00f3n a pesar de no haber hecho ning\u00fan esfuerzo f\u00edsico.","Tuve miedo sin raz\u00f3n.","Sent\u00ed que la vida no tenia ning\u00fan sentido.","M\u00e9r fannst erfitt a\u00f0 n\u00e1 m\u00e9r ni\u00f0ur*.","\u00c9g \u00e1tti erfitt me\u00f0 a\u00f0 kyngja*.","No sent\u00ed placer por las cosas que estaba haciendo.","\u00c9g var\u00f0 var vi\u00f0 hjartsl\u00e1ttinn \u00ed m\u00e9r \u00fe\u00f3 \u00e9g hef\u00f0i ekki reynt \u00e1 mig (t.d.hra\u00f0ari hjartsl\u00e1ttur, hjarta\u00f0 sleppti \u00far slagi)*.","Estuve triste y deprimido/a","Me sent\u00ed muy molesto/a, enfadado/a","Me sent\u00ed aterrorizado/a","Me result\u00f3 dificil calmarme cuando algo me molestaba.","\u00c9g var hr\u00e6dd(ur) um a\u00f0 \u201eklikka \u00e1\u201c sm\u00e1v\u00e6gilegu verki sem \u00e9g var ekki kunnug(ur)*.","No me interes\u00e9 por nada.","Me cost\u00f3 tolerar las interrupciones sobre lo que estaba haciendo.","Estuve muy nervioso/a.","Me sent\u00ed casi sin valor.","Me alteraba cuando algo me imped\u00eda continuar con lo que estaba haciendo.","Tuve miedo","No vi nada en el futuro que me diera esperanza.","Me pareci\u00f3 que la vida no ten\u00eda sentido.","Estaba irritado/a","Esta preocupado/a por las situaciones en las que tuve una crisis de ansiedad(p\u00e1nco) y hacer el rid\u00edculo","Me sent\u00eda d\u00e9bil(p.e. las manos).","M\u00e9r fannst erfitt a\u00f0 hleypa \u00ed mig krafti til a\u00f0 gera hluti*."],"answers":["Nada aplicable a m\u00ed","Aplicable a m\u00ed en alg\u00fan grado, o una peque\u00f1a parte del tiempo","Aplicable a m\u00ed en un grado considerable, o una buena parte del tiempo","Muy aplicable a m\u00ed, o aplicable la mayor parte del tiempo"],"terms":{"depression":"depresi\u00f3n","stress":"stress","anxiety":"ansiedad","normal":"normal","moderate":"moderado","severe":"severo","extremely_severe":"extremadamente severo"}},"ysr-syndrome-scale":{"name":"Autoinforme para j\u00f3venes(YSR)","terms":{"clinical":"por encima del l\u00edmite","borderline":"en el l\u00edmite","raw_score_mean":"promedio","other_problems":"otros problemas","aggressive_behaviour":"comportamiento agresivo","rule_breaking_behaviour":"desobediencia","attention_problems":"problemas de atenci\u00f3n","thought_problems":"problemas para pensar*","somatic_complaints":"malestar som\u00e1tico","withdrawn_or_depressed":"depresi\u00f3n","anxious_or_depressed":"ansiedad/ depresi\u00f3n","social_problems":"problemas sociales","externalizing":"problemas de comportamiento (externos)","internalizing":"aislamiento","total":"total"},"questions":[null,"Tengo una actitud infantil para mi edad","Bebo alcohol sin consentimiento de mis padres","Discuto mucho","No termino los proyectos que empiezo","\u00dea\u00f0 er f\u00e1tt sem \u00e9g hef \u00e1n\u00e6gju af*","Me encantan los animales","Soy orgulloso, sj\u00e1lfh\u00e6lin(n)*","Me resulta dif\u00edcil concentrarme","No puedo dejar de pensar ciertos pensamientos / obsesi\u00f3n","Me resulta dif\u00edcil estar quieto","Soy demasiado dependiente de los adultos","Me siento solo","Me siento confundido o desorientado","Lloro mucho","Soy bastante honesto","\u00c9g er vondur vi\u00f0 a\u00f0ra*","A menudo siento como si estuviera en las nubes","Intencionadamente he tratado de lastimarme y de matarme*","Trato de llamar la atenci\u00f3n","\u00c9g ey\u00f0ilegg eigin eigur*","Destruyo las propiedades de otros","No obedezco a mis padres","No obedezco en la escuela","No como lo suficiente para mi edad","Me llevo bien con otros ni\u00f1os","No me siento culpable despu\u00e9s de hacer algo que no deber\u00eda hacer","Tengo celos de los dem\u00e1s","Rompo las reglas en el hogar, la escuela o en otros lugares","\u00c9g hr\u00e6\u00f0ist sum d\u00fdr, a\u00f0st\u00e6\u00f0ur e\u00f0a sta\u00f0i anna\u00f0 en sk\u00f3la (l\u00fdstu)*","Tengo miedo de ir a la escuela","Tengo miedo de pensar o hacer algo malo","Soy perfeccionista","Siento que nadie me quiere","M\u00e9r finnst a\u00f0rir ofs\u00e6kja mig*","Me siento inferior a los dem\u00e1s","Me lastimo a menudo de manera accidental","Me peleo mucho","Hago muchas burlas","Me junto con j\u00f3venes que se meten en problemas","A menudo oigo sonidos o voces que otras personas no parecen escuchar","A menudo hago cosas sin pensar","Prefiero estar solo a estar con otras personas","Miento o enga\u00f1o","Me muerdo las u\u00f1as","A menudo me siento nervioso o excitado","Hlutar l\u00edkama m\u00edns kippast til e\u00f0a \u00e9g f\u00e6 taugaviprur/k\u00e6ki (l\u00fdstu)* Tengo convulsiones","Tego pesadillas","A otros ni\u00f1os no les gusta estar conmigo","Puedo hacer ciertas cosas mejor que la mayor\u00eda de los dem\u00e1s","Tengo mucho miedo o ansiedad","Me mareo","Me siento culpable","Como demasiado","Me siento cansado/a","Estoy gordo/a","Tengo problemas f\u00edsicos sin explicaci\u00f3n m\u00e9dica","\u00c9g r\u00e6\u00f0st (l\u00edkamlega) \u00e1 anna\u00f0 f\u00f3lk*","\u00c9g kroppa \u00ed h\u00fa\u00f0 e\u00f0a a\u00f0ra l\u00edkamshluta (l\u00fdstu)* (Me ara\u00f1o la piel u otras partes del cuerpo)","Puedo ser amable","Me gusta probar cosas nuevas","Tengo dificultades para aprender","Tengo una mala coordinaci\u00f3n, soy torpe","Prefiero estar con ni\u00f1os mayores que con mis compa\u00f1eros","Prefiero estar con ni\u00f1os menores que estar con mis compa\u00f1eros","Me niego a hablar","Repito ciertas conductas una y otra vez, (l\u00fdstu)","\u00c9g str\u00fdk a\u00f0 heiman*","Grito mucho","\u00c9g er dul(ur) og pukrast me\u00f0 hlutina*","Veo cosas que otros no son capaces de ver (l\u00fdstu)","Soy t\u00edmido*","\u00c9g kveiki \u00ed*","Tengo facilidad para los trabajos manuales","Hago el payaso para atraer la atenci\u00f3n hacia mi","Soy demasiado t\u00edmido","Duermo menos que la mayor\u00eda de la gente","Duermo m\u00e1s que la mayor\u00eda de la gente de d\u00eda o de noche (l\u00fdstu)","Me resulta dif\u00edcil concentrarme y piero la concentraci\u00f3n muy f\u00e1cilmente","Tengo dificultad para hablar o comunicarme (l\u00fdstu)","\u00c9g stend \u00e1 r\u00e9tti m\u00ednum * (Soy inquieto)","Robo en casa","Robo en otros lugares fuera de mi casa (l\u00fdstu)","\u00c9g safna a\u00f0 m\u00e9r drasli sem \u00e9g hef enga \u00fe\u00f6rf fyrir (l\u00fdstu)*","Tengo comportamientos que para otras personas resultan extra\u00f1as (l\u00fdstu)","Pienso cosas que para otras personas resultan extra\u00f1as (l\u00fdstu)","Soy terco/a","Tengo cambios de estado de \u00e1nimo repentinos","Me gusta estar con otras personas","Soy c\u00ednico/a","\u00c9g bl\u00f3ta e\u00f0a kl\u00e6mist*","He pensado en suicidarme","Me gusta hacer reir a los dem\u00e1s","Hablo demasiado","Soy muy travieso/a","Tengo mucho temparamento","\u00c9g hugsa of miki\u00f0 um kynfer\u00f0ism\u00e1l*","Odio hacer da\u00f1o a la gente","Me gusta ayudar a los dem\u00e1s","Fumo (uso oral o inhalado)","Tengo problemas para dormir (l\u00fdstu)","Me salto las clases en la escuela e\u00f0a sleppi \u00far t\u00edmum*","No tengo paciencia","Me siento infeliz, triste y deprimido","Soy m\u00e1s fuerte que otros ni\u00f1os","Tomos drogas o medicamentos no preescritos (no se incluye el tabaco o el alcohol) (l\u00fdstu)","Trato de ser justo/a con los dem\u00e1s","Me gusta gastar bromas","Me tomo la vida a la ligera","Me gusta ayudar a otras personas cuando lo necesitan","Me gustar\u00eda ser del sexo opuesto","Trato de no relacionarme con otras personas","Me preocupo a menudo"],"answers":["No es cierto","Un poco cierto","Absolutamiente cierto"]},"adhd-rating-scale":{"age":"Edad","name":"Escala TDAH","terms":{"average":"promedio","inattention":"d\u00e9ficit de atenci\u00f3n","impulsivity_hyperactivity":"impulsividad/hiperactividad","total":"total","standard_deviation_from_average":"s fr\u00e1 m*","age":"Seleccione la edad"},"questions":[null,"Hugar illa a\u00f0 sm\u00e1atri\u00f0um og gerir flj\u00f3tf\u00e6rnislegar villur \u00e1 sk\u00f3laverkefnum.","Er miki\u00f0 me\u00f0 hendur og f\u00e6tur \u00e1 hreyfingu e\u00f0a i\u00f0ar \u00ed s\u00e6ti.","Dificultad para mantener la atenci\u00f3n en sus tareas o en los juegos.","Abandona su asiento en clase o en otros lugares en los que deber\u00eda de permanecer sentado.","Parece no escuchar cuando se le habla.","Hleypur um e\u00f0a pr\u00edlar \u00f3h\u00f3flega vi\u00f0 a\u00f0st\u00e6\u00f0ur \u00fear sem sl\u00edkt \u00e1 ekki vi\u00f0 (Corre o \u00bftrepa? demasiado en situaciones en las que no deber\u00eda).","Fylgir oft ekki fyrirm\u00e6lum til enda og l\u00fdkur ekki vi\u00f0 verkefni. (A menudo no atiende a las instrucciones y no completa la tarea)","Dificultad para mantener silencio durante los juegos o tareas.","Dificultad para organizar tareas y actividades.","Er \u00e1 \u201cfleygifer\u00f0\u201d e\u00f0a er \u201ceins og \u00feeytispjald\u201d*.","Evita retos (p.e. proyectos y tareas de las escuela) que requieren mucho trabajo mental.","Habla desproporcionadamente alto.","Pierde la cosas que necesita para la realizaci\u00f3n de las tareas o actividades.","Interrumpe antes de la finalizaci\u00f3n de las preguntas.","Se distrae f\u00e1cilmente ante est\u00edmulos externos.","Dificultad para esperar su turno.","Es olvidadizo/a en sus actividades de la vida diaria.","Interrumpe o entrar en las conversaciones y juegos."],"answers":["nunca/raramente","a veces","habitualmente","muy habitualmente"]},"terms":{"age":"A\u00f1os","male":"masculino","female":"femenino","average":"Promedio","standard_deviation":"Desviaci\u00f3n t\u00edpica","respondent":{"parent":"padres","teacher":"profesor"},"norm_reference":{"title":"T\u00edtulo","group":"grupo","teacher":"profesor","parent":"padres"}},"respondent_registration":{"name":"Perfil b\u00e1sico"},"messages":{"question_list_failed":"Error al obtener las preguntas de la lista %{name}","charts_not_found":"No se han podido obtener los gr\u00e1ficos"},"sdq":{"name":"Cuestionario de Fortalezas y Debilidades (SDQ)","terms":{"normal":"normal","borderline":"l\u00edmite","abnormal":"anormal","emotional":"problemas emocionales","conduct":"problemas de conducta","hyperactivity_inattention":"hiperactividad","peer_problem":"problemas de comunicaci\u00f3n","prosocial_behaviour":"conducta prosocial","total":"total","impact_supplement":"preguntas adocionales*"},"questions":[null,"Tiene en cuenta los sentimientos de los dem\u00e1s","Inquieto, hiperactivo, no puede quedarse quieto por mucho tiempo","Se queja con frecuencia de dolores de cabeza, dolores de est\u00f3mago o n\u00e1useas","Comparte frecuentemente con otros ni\u00f1os (golosinas, juguetes, l\u00e1pices, etc.)","Propenso a ataques de temperamento, es irascible y pol\u00e9mico","Es m\u00e1s bien solitario","Generalmente obediente, por lo general hace lo que le piden los adultos","Tiene muchas preocupaciones, a menudo parece preocupado","Hj\u00e1lpsamur/s\u00f6m ef einhver mei\u00f0ir sig, er \u00ed uppn\u00e1mi e\u00f0a l\u00ed\u00f0ur illa*","Est\u00e1 continuamente movi\u00e9ndose","Tiene por lo menos un amigo","Pelea con frecuencia con otros ni\u00f1os","Se siente a menudo infeliz","En general muy querido por otros ni\u00f1os","Se distrae con facilidad","Es inseguro o dependiente de sus padres","Amable con los ni\u00f1os m\u00e1s peque\u00f1os","A menudo miente o enga\u00f1a","Otros ni\u00f1os se meten con \u00e9l","A menudo se ofrece para ayudar a otros (padres, maestros, otros ni\u00f1os)","Hugsar \u00e1\u00f0ur en hann/h\u00fan framkv\u00e6mir","Piensa las cosas antes de hacerlas","Se lleva mejor con adultos que con otros ni\u00f1os","Tiene muchos miedos, se austa con facilidad","Termina lo que empieza"],"answers":["No es cierto","Un poco cierto","Absolutamente cierto"]}},"views":{"entry_field_sections":{"list":{"drag_and_drop":"Arrastra la pregunta aqu\u00ed"}},"responder_items":{"select_respondents":"Selecciona encuestado","select_entry_sets":"Selecciona cuestionario","requests":{"name":"Requests","submit":"Enviar nueva solicitud","have_sent":"La nueva solicitud ha sido enviada","sent":"solicitud enviada","for":"Fecha l\u00edmite %{date}","sent_another":"Seleccione la fecha l\u00edmite de respuesta de la solicitud","error":"Error !","contact_admin":"Contacte con el administrador del sistema.","no_uncompleted":"No hay solicitudes pendientes"}},"help_page":{"content":{"slides":[{"title":"Title 1","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 2","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 3","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 4","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]}]}},"landing_page":{"content":{"features":[{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."},{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."},{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."}]},"partial":{"apply":{"express_interest":"Reg\u00edstrate para recibir las noticias del proyecto."},"footer":{"copyright":"Todos los derecho reservados"},"header":{"stripes":["Sta\u00f0la\u00f0ir listar*","Cuestionarios","Comunicaci\u00f3n","Estad\u00edsticas*","Seguridad"],"sub_header":"Facilita la recogida y el an\u00e1lisis de los datos cl\u00ednicos."}}},"401_page":{"content":{"unauthorized":"No autorizado","message":"No estas autorizado para acceder a este contenido, contacto con el administrador. Usa el bot\u00f3n <b>Atr\u00e1s</b> del navegador para volver a la p\u00e1gina anterior","go_homepage":"O tambi\u00e9n podr\u00edas volver a la p\u00e1gina de inicio:","button_home":"Volver a la p\u00e1gina de inicio","go_loginpage":"O tambi\u00e9n podr\u00edas iniciar sesi\u00f3n:"}},"browser_update":{"content":{"ups":"\u00daps...!","alert_message":"Para reducir el coste de desarrollo de Qodiag, Internet Explorer y versiones antiguas de otros navegadores no estan soportadas. Por favor, actualice su navegador (vea las instrucciones m\u00e1s abajo) e int\u00e9ntelo de nuevo","election":"Elija entre","instruction":"y siga las instrucciones de instalaci\u00f3n.","update":"Si usted ya dispone del navegador, por favor, actualicelo siguendo los siguientes pasos.","step1":"1. Vaya a Acerca de","step2":"2. Haga clic en \"Update now\"","login":"Inicie sesi\u00f3n en  www.qodiag.com"}},"profiles":{"parent_not_found":"Padre/Madre no encontrado","upload_image":"Subir imagen"},"application":{"partial":{"alert_login_as":{"attention":"Atenci\u00f3n","message":"Ha iniciado sesi\u00f3n como el encuestado de un paciente. Para volver a la sesi\u00f3n como caretaker, Por favor, haz clic en el enlace siguiente"}}},"users":{"content":{"uncompleted_requests":"Solicitudes no completadas","completed_requests":"Solicitudes completadas","login_as":"Iniciar sesi\u00f3n como"}}},"errors":{"messages":{"not_found":"no encontrado","already_confirmed":"ya fue confirmado","not_locked":"no estaba bloqueado"}},"devise":{"failure":{"unauthenticated":"Necesitas hacer login o registrarte antes de continuar.","unconfirmed":"Debes de confirmar tu cuenta antes de continuar.","locked":"Tu cuenta esta bloqueada.","invalid":"Correo electr\u00f3nico o contrase\u00f1a inv\u00e1lida.","invalid_token":"Identificador de autentificaci\u00f3n inv\u00e1lido.","timeout":" Tu sesi\u00f3n ha expirado, Por favor haz login otra vez para continuar.","inactive":"Tu cuenta no ha sido activada a\u00fan.","user":{"not_found_in_database":"Correo electr\u00f3nico o contrase\u00f1a incorrecta"}},"sessions":{"sign_up":"Registrarse","sign_in":"Entrar","signed_in":"Has entrado exitosamente.","signed_out":"Has salido exitosamente.","signed_in_as":"Has accedido como","sign_out":"Salir"},"passwords":{"send_instructions":"Recibir\u00e1s un correo electr\u00f3nico con las instrucciones sobre como resetear tu contrase\u00f1a en unos pocos minutos.","updated":"Tu contrase\u00f1a ha sido cambiada exitosamente. Ya has accedido a tu cuenta.","change_password":"Cambia tu contrase\u00f1a","send_reset":"Env\u00edame las instrucciones sobre como resetar mi contrase\u00f1a"},"confirmations":{"send_instructions":"Recibir\u00e1s un correo electr\u00f3nico con las instrucciones sobre como confirmar tu cuenta en unos pocos minutos.","confirmed":"Tu cuenta ha sido confirmada exitosamente. Ya has accedido a tu cuenta.","resend_instructions":"Reenviar las instrucciones de confirmaci\u00f3n","not_received":"\u00bfNo has recibido las instrucciones de confirmaci\u00f3n?"},"registrations":{"signed_up":"Te has registrado exitosamente. Si estaba habilitado, recibir\u00e1s un correo electr\u00f3nico de confirmaci\u00f3n.","updated":"Has actualizado tu cuenta exitosamente.","destroyed":"\u00a1Adi\u00f3s! Tu cuenta ha sido eliminada exitosamente. Esperamos verte pronto.","pre_registration":"Muchas gracias por su inter\u00e9s, le hemos enviado un correo a %{email}","blank_email":"El correo electr\u00f3nico es obligatorio","tips":["(D\u00e9jalo en blanco si no quieres cambiarlo)","(Necesitaremos tu contrase\u00f1a actual para confirmar tus cambios)","\u00bfDescontento? "],"cancel_account":"Cancelar mi cuenta"},"unlocks":{"send_instructions":"Recibir\u00e1s un correo electr\u00f3nico con las instrucciones sobre como desbloquear tu cuenta en unos pocos minutos.","unlocked":"Tu cuenta ha sido desbloqueada exitosamente. Ya has accedido a tu cuenta.","not_received":"\u00bfNo has recibido las instrucciones de desbloqueo?","resend_instructions":"Reenviar las instrucciones de desbloqueo"},"mailer":{"confirmation_instructions":{"subject":"Instrucciones de confirmaci\u00f3n","user_subject":"Instrucciones de confirmaci\u00f3n","greeting":"Bienvenido %{name}!","body":["Puedes confirmar tu cuenta a trav\u00e9s del enlace que escontrar\u00e1s m\u00e1s abajo:"],"link":{"confirm":"Confirmar mi cuenta"}},"invitation_instructions":{"user_subject":"Qodiag- Nuevo registro","body":{"greeting":"Hola %{name}","text":"Por favor finalice el registro siguiendo el siguiente enlace","regards":"Saludos cordiales"}},"reset_password_instructions":{"subject":"Instrucciones de reseteo de la contrase\u00f1a CAMBIADAS","greeting":"Hola %{name}!","body":["Alguien ha solicitado un enlace para cambiar tu contrase\u00f1a, y puedes hacerlo a trav\u00e9s del enlace que encontrar\u00e1s m\u00e1s abajo","Si no lo has solicitado, por favor, ignora este correo electr\u00f3nico.","Tu contrase\u00f1a no se modificar\u00e1 hasta que accedas al enlace que encontrar\u00e1s m\u00e1s abajo y lo cambies."],"link":{"change_password":"Cambiar mi contrase\u00f1a"}},"unlock_instructions":{"subject":"Instrucciones de desbloqueo","greeting":"Hola %{name}!","body":["Tu cuenta ha sido bloqueada debido a un excesivo n\u00famero de intentos fallidos de acceso.","Haz click en el enlace que encontrar\u00e1s m\u00e1s abajo para desbloquear tu cuenta:"],"link":{"unlock":"Desbloquear mu cuenta"}}},"invitations":{"send_instructions":"Se ha enviado una invitaci\u00f3n de registro al correo electr\u00f3nico %{email}","invitation_token_invalid":"La solicitud de registro es inv\u00e1lida","updated":"La contrase\u00f1a ha sido guardada. Ya has accedido a tu cuenta."},"messages":{"use_password_received":"Por favor, inicia sesi\u00f3n con la contrase\u00f1a que has recibido por correo electr\u00f3nico."}},"entry_set":{"model_name":"Cuestionario","model_name_accusative":"Cuestionario","model_name_plural":"Cuestionarios","description":"Descripci\u00f3n","messages":{"question_saved":"Spurningu b\u00e6tt vi\u00f0","question_edited":"Spurningu breytt vi\u00f0","confirm_delte_question":"Ertu viss um a\u00f0 \u00fe\u00fa viljir ey\u00f0a \u00feessari spurningu","entry_set_saved":"F\u00e6rsla hefur vistast"}},"responder_item":{"deadline":"Fecha l\u00edmite","respondent":"Encuestado","entry_set":"Cuestionario","registration":"Registro","registrations":"Registro","registration_items":{"client_registration":"Nuevo registro"},"survey_items":{"hsq-r":"W.B. Escala de depresi\u00f3n*","quiz":"Test","rating-scale":"Escala TDAH"},"status":{"completed":"Completados","uncompleted":"Pendientes"},"headers":{"name":"Nombre","patient":"Paciente","due_date":"Fecha l\u00edmite"}},"user":{"email":"Correo electr\u00f3nico","password":"Contrase\u00f1a","password_confirmation":"Repetir contrase\u00f1a","sign_in":"Entrar","forgotten_password":"\u00bfOlvid\u00f3 su contrase\u00f1a?"},"role":{"super_admin":"Super admin","caretaker":"Cuidador/Asistente*","client":"Paciente"},"person":{"name":"Nombre","firstname":"Nombre","lastname":"Segundo nombre","dateofbirth":"Fecha de nacimiento","cpr":"Kennitala*","full_cpr":"Kennitala*","mobilephone":"M\u00f3vil","workphone":"Tel\u00e9fono del trabajo","occupation":"Ocupaci\u00f3n","workplace":"Lugar de trabajo","yearofbirth":"A\u00f1o de nacimiento","boy":"Chico","girl":"Chica","male":"Masculino","female":"Femenino","sex":"Sexo","avatar":"Foto"},"relationship":{"parent":"El tutor es uno de los padres","guardian":"El tutor tiene la custodia*","not_guardian":"No tiene la custodia","not_spouse":"No tiene esposa*","is_spouse":"Er n\u00faverandi maki tengili\u00f0s*","spouse_start":"Samband h\u00f3fst*","spouse_end":"Sambandi lauk*","guardian_start":"T\u00f3k vi\u00f0 forr\u00e6\u00f0i*","guardian_end":"Forr\u00e6\u00f0i lauk*"},"address":{"street_1":"Direcci\u00f3n","street_2":"Direcci\u00f3n","zip_code":"C\u00f3digo postal","town":"Ciudad","home_phone":"Tel\u00e9fono 2","phone":"Tel\u00e9fono 1"},"forms":{"full_siblings":"Hermanos","half_siblings":"Hermanastros","inverse_half_siblings":"H\u00e1lf systkin - B\u00f6rn hins foreldris*","foster_siblings":"Hermanos adoptivos","relations":"Relaciones","information_from_national_registry":"Informaci\u00f3n del Registro Nacional","family_from_national_registry":"Fylla \u00fat uppl\u00fdsingar mi\u00f0a\u00f0 vi\u00f0 uppl\u00fdsingar fr\u00e1 \u00dej\u00f3\u00f0skr\u00e1","personal_info":"Informaci\u00f3n personal","personal_info_parent1":"Informaci\u00f3n personal del padre/madre","personal_info_parent2":"Informaci\u00f3n personal del padre/madre","address_info":"Heimilisfang","parent_guardian":"Padres/Tutores","client":"paciente","guardian_invitation":{"name":"Solicitud de inscripci\u00f3n","steps":{"guardian_info":"Padre/Tutor","patient_info":"Informaci\u00f3n del paciente"}},"respondent_registration":{"name":"Informaci\u00f3n b\u00e1sica","steps":{"contact_info":"Datos de contacto (tel\u00e9fono, direcci\u00f3n, etc.)","subject_parent":"Padre/madre"}},"pre_registration_as_guardian_and_parent":{"steps":{"subject":"Paciente","contact_info":"Datos de contacto del paciente","subject_parent":"Padres del paciente","subject_siblings":"Hermanos del paciente"}},"pre_registration_as_guardian":{"steps":{"subject":"Paciente","contact_info":"Datos de contacto del paciente","subject_parent":"Padres del paciente","subject_siblings":"Hermanos del paciente"}}},"navigation":{"home":"Inicio","settings":"configuraci\u00f3n"},"page_errors":{"error_401":"No tiene los permisos suficientes para acceder a este recurso"},"number":{"format":{"separator":",","delimiter":".","precision":2},"currency":{"format":{"format":"%u %n","unit":"\u20ac"}},"human":{"format":{"delimiter":"","precision":1},"storage_units":{"format":"%n %u","units":{"byte":{"one":"byte","other":"byte"},"kb":"KB","mb":"MB","gb":"GB","tb":"TB"}}}},"date":{"formats":{"default":"%d.%m.%Y","short":"%e. %b","long":"%e. %B %Y"},"day_names":["domingo","lunes","martes","mi\u00e9rcoles","jueves","viernes","s\u00e1bado"],"abbr_day_names":["dom","lun","mar","mie","jue","vie","s\u00e1b"],"month_names":[null,"enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],"abbr_month_names":[null,"ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],"order":"day :month :year"},"time":{"formats":{"default":"%A %e. %B %Y kl. %H:%M","time":"%H:%M","short":"%e. %B %Y","long":"%A %e. %B %Y kl. %H:%M","abbr_month":"%b"},"am":"","pm":""},"support":{"array":{"sentence_connector":"y","words_connector":", ","two_words_connector":" y ","last_word_connector":" y ","skip_last_comma":true}},"datetime":{"distance_in_words":{"half_a_minute":"medio minuto","less_than_x_seconds":{"one":"menos de un segundo","other":"menos de %{count} segundos"},"x_seconds":{"one":"1 segundo","other":"%{count} segundos"},"less_than_x_minutes":{"one":"menos de 1 minuto","other":"menos de %{count} minutos"},"x_minutes":{"one":"1 minuto","other":"%{count} minutos"},"about_x_hours":{"one":"aprox. 1 hora*","other":"aprox. %{count} horas"},"x_days":{"one":"1 d\u00eda","other":"%{count} d\u00edas"},"about_x_months":{"one":"aprox. 1 mes","other":"aprox. %{count} meses"},"x_months":{"one":"1 mes","other":"%{count} meses"},"about_x_years":{"one":"aprox. 1 a\u00f1o","other":"aprox. %{count} a\u00f1os"},"over_x_years":{"one":"m\u00e1s de 1 a\u00f1o","other":"m\u00e1s de %{count} a\u00f1os"}}},"activerecord":{"models":{"user":"usuario","role":"rol","person":"persona","resopnder_item":"registro*"},"attributes":{"user":{"email":"correo electr\u00f3nico","password":"contrase\u00f1a","password_confirmation":"repetir contrase\u00f1a"},"role":{"name":"rol"},"person":{"firstname":"nombre","lastname":"segundo nombre","cpr":"kennitala*","sex":"sexo","full_cpr":"kennitala*"},"relationship":{"relation_id":"relation_id","name":"relacion"},"responder_item":{"completed":"completado","deadline":"fecha l\u00edmite"}},"errors":{"template":{"header":{"one":"No se ha podido guardar el/la %{model} debido a un error.","other":"No se ha podido guardar el/la %{model} debido a %{count} errores."},"body":"Upp kom vandam\u00e1l \u00ed eftirfarandi d\u00e1lkum:"},"messages":{"inclusion":"no esta en la lista","exclusion":"esta reservado/a","invalid":"es inv\u00e1lido/a","record_invalid":"es inv\u00e1lido/a","confirmation":"no coincide con la confirmaci\u00f3n","accepted":"tiene que ser aceptado/a","empty":"no puede ser vac\u00edo","blank":"obligatorio","too_long":"demasiado largo, el n\u00famero m\u00e1ximo de caracteres es %{count}","too_short":"demasiado corto, el n\u00famero m\u00ednimi de caracteres es %{count}","wrong_length":"longitud incorrecta, el n\u00famero exacto de caracteres es %{count}","taken":"ya esta en uso","not_a_number":"no es un n\u00famero","greater_than":"debe ser mayor que %{count}","greater_than_or_equal_to":"debe ser mayor o igual que %{count}","equal_to":"debe ser igual a %{count}","less_than":"debe ser menor que %{count}","less_than_or_equal_to":"debe ser menor o igual que %{count}","odd":"debe ser un n\u00famero impar","even":"debe ser un n\u00famero par","not_equal":"Este valor debe de ser igual al valor del campo %{field}"}},"sucess":{"messages":{"saved":"El/la %{model} ha sido guardado"}},"confirm":{"messages":{"deleted":"\u00bfEst\u00e1s seguro de que quieres eliminar el/la %{model}?"}}},"terms":{"child":"Ni\u00f1o/a","boy":"Chico","girl":"Chica","sex":{"male":"Masculino","female":"Femenino"},"father":"Padre","mother":"Madre","parent":"Padre/Madre","parents":"Padres","patient":"Hito*","client":{"one":"Paciente","other":"Paciente"},"spouse":"Esposa","spouses":"Esposas","ex_spouse":"Ex-esposa","current_spouse":"Esposa actual","relationship_start":"Inicio de la relaci\u00f3n","relationship_end":"Fin de la relaci\u00f3n","guardianship_start":"Incio de la tutorizaci\u00f3n","guardianship_end":"Fin de la tutorizaci\u00f3n","guardianship":"Tutorizaci\u00f3n","guardian":"Tutor","siblings":"Hermanos","sibling":"Hermano/a","half_sibling":"Hermanastro/a","foster_sibling":"Hermano/a adoptivo/a","register":{"mother":"Crear madre","father":"Crear padre"},"personal_information":"Informaci\u00f3n personal","occupational_information":"Informaci\u00f3n laboral","contact_information":"Direcci\u00f3n y tel\u00e9fono","total":"total","y":" y ","or":"o","onCap":"En","help":"Ayuda","setup":"Configuraci\u00f3n","go_back":"Volver!","sure":"\u00bfEstas seguro?","type_something":"Escriba algo....","title":"T\u00edtulo","step":"paso","new":"nuevo","edit":"editar","update":"actualizar","in":"en ","public":"P\u00fablico","name":"Nombre","due_date":"Fecha l\u00edmite","edit_information":"Editar informaci\u00f3n","add_information":"A\u00f1adir informaci\u00f3n","empty_select":"Seleccione una opci\u00f3n...","type":"Tipo","time_to_words":{"until":"hasta","ago":"hace","expires":"finaliza","expired":"finalizado/a","submitted":"enviado/a","no_submitted":"no enviado/a"},"today":"hoy","question":"Pregunta","history":"Historia","timeline":"L\u00ednea de tiempo","ago":"","lists":"Listas","empty":"Vac\u00edo/a","username":"Nombre de usuario","access_count":"N\u00famero de accesos","last_access":"\u00daltimo acceso","first_access":"Primer acceso","show":"Mostrar","back":"Volver","surveys":"Encuentas"},"marionette":{"errors":{"error_in_function":"Error en %{function}","model_not_found":"No se ha encontrado ning\u00fan modelo en el formulario ContentView","model_not_saved":"Error: no se ha podido guardar el/la %{model}","invalid_loading_type":"Valor de loadingType inv\u00e1lido","url_not_found":"Se ha de especificar la propiedad o la funci\u00f3n 'url'","template_not_found":"\u00a1Template %{template} no encontrado!","schema_nested_model_not_found":"No se ha encontrado la opci\u00f3n requerida 'schema.model' parar el editor NestedModel","schema_model_not_found":"Schema Model no encontrado"}},"actions":{"save":"Guardar","add_spouse":"Crear esposa","add_guardian":"Crear tutor","remove":"Eliminar","create":"Crear","add":"A\u00f1adir","cancel":"Cancelar","sign_up":"Registrarse","sign_in":"Entrar","sign_out":"Salir","log_in":"Entrar","register":"Registrarse*","finish":"Finalizar","send":"Enviar","upload":"Subir","request_survey":"Enviar encuenta","invite_clients":"Invitar pacientes","save_and_continue":"Guardar y continuar","continue":"Continuar","save_and_complete":"Guardar y completar","new_list":"Crear una nueva lista","add_parent":"A\u00f1adir padre","edit_avatar":"Editar avatar","edit_information":"Editar informaci\u00f3n personal","add_comment":"A\u00f1adir comentario","minor":"Menor de edad","adult":"Adulto","new_question":"Nueva pregunta","add_section":"Nueva section"}},"de":{"faker":{"address":{"city_prefix":["Nord","Ost","West","S\u00fcd","Neu","Alt","Bad"],"city_suffix":["stadt","dorf","land","scheid","burg"],"country":["\u00c4gypten","\u00c4quatorialguinea","\u00c4thiopien","\u00d6sterreich","Afghanistan","Albanien","Algerien","Amerikanisch-Samoa","Amerikanische Jungferninseln","Andorra","Angola","Anguilla","Antarktis","Antigua und Barbuda","Argentinien","Armenien","Aruba","Aserbaidschan","Australien","Bahamas","Bahrain","Bangladesch","Barbados","Belarus","Belgien","Belize","Benin","die Bermudas","Bhutan","Bolivien","Bosnien und Herzegowina","Botsuana","Bouvetinsel","Brasilien","Britische Jungferninseln","Britisches Territorium im Indischen Ozean","Brunei Darussalam","Bulgarien","Burkina Faso","Burundi","Chile","China","Cookinseln","Costa Rica","D\u00e4nemark","Demokratische Republik Kongo","Demokratische Volksrepublik Korea","Deutschland","Dominica","Dominikanische Republik","Dschibuti","Ecuador","El Salvador","Eritrea","Estland","F\u00e4r\u00f6er","Falklandinseln","Fidschi","Finnland","Frankreich","Franz\u00f6sisch-Guayana","Franz\u00f6sisch-Polynesien","Franz\u00f6sische Gebiete im s\u00fcdlichen Indischen Ozean","Gabun","Gambia","Georgien","Ghana","Gibraltar","Gr\u00f6nland","Grenada","Griechenland","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Heard und McDonaldinseln","Honduras","Hongkong","Indien","Indonesien","Irak","Iran","Irland","Island","Israel","Italien","Jamaika","Japan","Jemen","Jordanien","Jugoslawien","Kaimaninseln","Kambodscha","Kamerun","Kanada","Kap Verde","Kasachstan","Katar","Kenia","Kirgisistan","Kiribati","Kleinere amerikanische \u00dcberseeinseln","Kokosinseln","Kolumbien","Komoren","Kongo","Kroatien","Kuba","Kuwait","Laos","Lesotho","Lettland","Libanon","Liberia","Libyen","Liechtenstein","Litauen","Luxemburg","Macau","Madagaskar","Malawi","Malaysia","Malediven","Mali","Malta","ehemalige jugoslawische Republik Mazedonien","Marokko","Marshallinseln","Martinique","Mauretanien","Mauritius","Mayotte","Mexiko","Mikronesien","Monaco","Mongolei","Montserrat","Mosambik","Myanmar","N\u00f6rdliche Marianen","Namibia","Nauru","Nepal","Neukaledonien","Neuseeland","Nicaragua","Niederl\u00e4ndische Antillen","Niederlande","Niger","Nigeria","Niue","Norfolkinsel","Norwegen","Oman","Osttimor","Pakistan","Palau","Panama","Papua-Neuguinea","Paraguay","Peru","Philippinen","Pitcairninseln","Polen","Portugal","Puerto Rico","R\u00e9union","Republik Korea","Republik Moldau","Ruanda","Rum\u00e4nien","Russische F\u00f6deration","S\u00e3o Tom\u00e9 und Pr\u00edncipe","S\u00fcdafrika","S\u00fcdgeorgien und S\u00fcdliche Sandwichinseln","Salomonen","Sambia","Samoa","San Marino","Saudi-Arabien","Schweden","Schweiz","Senegal","Seychellen","Sierra Leone","Simbabwe","Singapur","Slowakei","Slowenien","Somalien","Spanien","Sri Lanka","St. Helena","St. Kitts und Nevis","St. Lucia","St. Pierre und Miquelon","St. Vincent und die Grenadinen","Sudan","Surinam","Svalbard und Jan Mayen","Swasiland","Syrien","T\u00fcrkei","Tadschikistan","Taiwan","Tansania","Thailand","Togo","Tokelau","Tonga","Trinidad und Tobago","Tschad","Tschechische Republik","Tunesien","Turkmenistan","Turks- und Caicosinseln","Tuvalu","Uganda","Ukraine","Ungarn","Uruguay","Usbekistan","Vanuatu","Vatikanstadt","Venezuela","Vereinigte Arabische Emirate","Vereinigte Staaten","Vereinigtes K\u00f6nigreich","Vietnam","Wallis und Futuna","Weihnachtsinsel","Westsahara","Zentralafrikanische Republik","Zypern"],"street_root":["Ackerweg","Adalbert-Stifter-Str.","Adalbertstr.","Adolf-Baeyer-Str.","Adolf-Kaschny-Str.","Adolf-Reichwein-Str.","Adolfsstr.","Ahornweg","Ahrstr.","Akazienweg","Albert-Einstein-Str.","Albert-Schweitzer-Str.","Albertus-Magnus-Str.","Albert-Zarthe-Weg","Albin-Edelmann-Str.","Albrecht-Haushofer-Str.","Aldegundisstr.","Alexanderstr.","Alfred-Delp-Str.","Alfred-Kubin-Str.","Alfred-Stock-Str.","Alkenrather Str.","Allensteiner Str.","Alsenstr.","Alt Steinb\u00fccheler Weg","Alte Garten","Alte Heide","Alte Landstr.","Alte Ziegelei","Altenberger Str.","Altenhof","Alter Grenzweg","Altstadtstr.","Am Alten Gaswerk","Am Alten Schafstall","Am Arenzberg","Am Benthal","Am Birkenberg","Am Blauen Berg","Am Borsberg","Am Brungen","Am B\u00fcchelter Hof","Am Buttermarkt","Am Ehrenfriedhof","Am Eselsdamm","Am Falkenberg","Am Frankenberg","Am Gesundheitspark","Am Gierlichshof","Am Graben","Am Hagelkreuz","Am Hang","Am Heidkamp","Am Hemmelrather Hof","Am Hofacker","Am Hohen Ufer","Am H\u00f6llers Eck","Am H\u00fchnerberg","Am J\u00e4gerhof","Am Junkernkamp","Am Kemperstiegel","Am Kettnersbusch","Am Kiesberg","Am Kl\u00f6sterchen","Am Knechtsgraben","Am K\u00f6llerweg","Am K\u00f6ttersbach","Am Kreispark","Am Kronefeld","Am K\u00fcchenhof","Am K\u00fchnsbusch","Am Lindenfeld","Am M\u00e4rchen","Am Mittelberg","Am M\u00f6nchshof","Am M\u00fchlenbach","Am Neuenhof","Am Nonnenbruch","Am Plattenbusch","Am Quettinger Feld","Am Rosenh\u00fcgel","Am Sandberg","Am Scherfenbrand","Am Schokker","Am Silbersee","Am Sonnenhang","Am Sportplatz","Am Stadtpark","Am Steinberg","Am Telegraf","Am Thelenhof","Am Vogelkreuz","Am Vogelsang","Am Vogelsfeldchen","Am Wambacher Hof","Am Wasserturm","Am Weidenbusch","Am Weiher","Am Weingarten","Am Werth","Amselweg","An den Irlen","An den Rheinauen","An der Bergerweide","An der Dingbank","An der Evangelischen Kirche","An der Evgl. Kirche","An der Feldgasse","An der Fettehenne","An der Kante","An der Laach","An der Lehmkuhle","An der Lichtenburg","An der Luisenburg","An der Robertsburg","An der Schmitten","An der Schusterinsel","An der Steinr\u00fctsch","An St. Andreas","An St. Remigius","Andreasstr.","Ankerweg","Annette-Kolb-Str.","Apenrader Str.","Arnold-Ohletz-Str.","Atzlenbacher Str.","Auerweg","Auestr.","Auf dem Acker","Auf dem Blahnenhof","Auf dem Bohnb\u00fcchel","Auf dem Bruch","Auf dem End","Auf dem Forst","Auf dem Herberg","Auf dem Lehn","Auf dem Stein","Auf dem Weierberg","Auf dem Weiherhahn","Auf den Reien","Auf der Donnen","Auf der Grie\u00dfe","Auf der Ohmer","Auf der Weide","Auf'm Berg","Auf'm Kamp","Augustastr.","August-Kekul\u00e9-Str.","A.-W.-v.-Hofmann-Str.","Bahnallee","Bahnhofstr.","Baltrumstr.","Bamberger Str.","Baumberger Str.","Bebelstr.","Beckers K\u00e4mpchen","Beerenstr.","Beethovenstr.","Behringstr.","Bendenweg","Bensberger Str.","Benzstr.","Bergische Landstr.","Bergstr.","Berliner Platz","Berliner Str.","Bernhard-Letterhaus-Str.","Bernhard-Lichtenberg-Str.","Bernhard-Ridder-Str.","Bernsteinstr.","Bertha-Middelhauve-Str.","Bertha-von-Suttner-Str.","Bertolt-Brecht-Str.","Berzeliusstr.","Bielertstr.","Biesenbach","Billrothstr.","Birkenbergstr.","Birkengartenstr.","Birkenweg","Bismarckstr.","Bitterfelder Str.","Blankenburg","Blaukehlchenweg","Bl\u00fctenstr.","Boberstr.","B\u00f6cklerstr.","Bodelschwinghstr.","Bodestr.","Bogenstr.","Bohnenkampsweg","Bohofsweg","Bonifatiusstr.","Bonner Str.","Borkumstr.","Bornheimer Str.","Borsigstr.","Borussiastr.","Bracknellstr.","Brahmsweg","Brandenburger Str.","Breidenbachstr.","Breslauer Str.","Bruchhauser Str.","Br\u00fcckenstr.","Brucknerstr.","Br\u00fcder-Bonhoeffer-Str.","Buchenweg","B\u00fcrgerbuschweg","Burgloch","Burgplatz","Burgstr.","Burgweg","B\u00fcrriger Weg","Burscheider Str.","Buschk\u00e4mpchen","Butterheider Str.","Carl-Duisberg-Platz","Carl-Duisberg-Str.","Carl-Leverkus-Str.","Carl-Maria-von-Weber-Platz","Carl-Maria-von-Weber-Str.","Carlo-Mierendorff-Str.","Carl-Rumpff-Str.","Carl-von-Ossietzky-Str.","Charlottenburger Str.","Christian-He\u00df-Str.","Claasbruch","Clemens-Winkler-Str.","Concordiastr.","Cranachstr.","Dahlemer Str.","Daimlerstr.","Damaschkestr.","Danziger Str.","Debengasse","Dechant-Fein-Str.","Dechant-Krey-Str.","Deichtorstr.","Dh\u00fcnnberg","Dh\u00fcnnstr.","Dianastr.","Diedenhofener Str.","Diepental","Diepenthaler Str.","Dieselstr.","Dillinger Str.","Distelkamp","Dohrgasse","Domblick","D\u00f6nhoffstr.","Dornierstr.","Drachenfelsstr.","Dr.-August-Blank-Str.","Dresdener Str.","Driescher Hecke","Drosselweg","Dudweilerstr.","D\u00fcnenweg","D\u00fcnfelder Str.","D\u00fcnnwalder Grenzweg","D\u00fcppeler Str.","D\u00fcrerstr.","D\u00fcrscheider Weg","D\u00fcsseldorfer Str.","Edelrather Weg","Edmund-Husserl-Str.","Eduard-Spranger-Str.","Ehrlichstr.","Eichenkamp","Eichenweg","Eidechsenweg","Eifelstr.","Eifgenstr.","Eintrachtstr.","Elbestr.","Elisabeth-Langg\u00e4sser-Str.","Elisabethstr.","Elisabeth-von-Thadden-Str.","Elisenstr.","Elsa-Br\u00e4ndstr\u00f6m-Str.","Elsbachstr.","Else-Lasker-Sch\u00fcler-Str.","Elsterstr.","Emil-Fischer-Str.","Emil-Nolde-Str.","Engelbertstr.","Engstenberger Weg","Entenpfuhl","Erbelegasse","Erftstr.","Erfurter Str.","Erich-Heckel-Str.","Erich-Klausener-Str.","Erich-Ollenhauer-Str.","Erlenweg","Ernst-Bloch-Str.","Ernst-Ludwig-Kirchner-Str.","Erzbergerstr.","Eschenallee","Eschenweg","Esmarchstr.","Espenweg","Euckenstr.","Eulengasse","Eulenkamp","Ewald-Flamme-Str.","Ewald-R\u00f6ll-Str.","F\u00e4hrstr.","Farnweg","Fasanenweg","Fa\u00dfbacher Hof","Felderstr.","Feldkampstr.","Feldsiefer Weg","Feldsiefer Wiesen","Feldstr.","Feldtorstr.","Felix-von-Roll-Str.","Ferdinand-Lassalle-Str.","Fester Weg","Feuerbachstr.","Feuerdornweg","Fichtenweg","Fichtestr.","Finkelsteinstr.","Finkenweg","Fixheider Str.","Flabbenh\u00e4uschen","Flensburger Str.","Fliederweg","Florastr.","Florianweg","Flotowstr.","Flurstr.","F\u00f6hrenweg","Fontanestr.","Forellental","Fortunastr.","Franz-Esser-Str.","Franz-Hitze-Str.","Franz-Kail-Str.","Franz-Marc-Str.","Freiburger Str.","Freiheitstr.","Freiherr-vom-Stein-Str.","Freudenthal","Freudenthaler Weg","Fridtjof-Nansen-Str.","Friedenberger Str.","Friedensstr.","Friedhofstr.","Friedlandstr.","Friedlieb-Ferdinand-Runge-Str.","Friedrich-Bayer-Str.","Friedrich-Bergius-Platz","Friedrich-Ebert-Platz","Friedrich-Ebert-Str.","Friedrich-Engels-Str.","Friedrich-List-Str.","Friedrich-Naumann-Str.","Friedrich-Sert\u00fcrner-Str.","Friedrichstr.","Friedrich-Weskott-Str.","Friesenweg","Frischenberg","Fritz-Erler-Str.","Fritz-Henseler-Str.","Fr\u00f6belstr.","F\u00fcrstenbergplatz","F\u00fcrstenbergstr.","Gabriele-M\u00fcnter-Str.","Gartenstr.","Gebhardstr.","Geibelstr.","Gellertstr.","Georg-von-Vollmar-Str.","Gerhard-Domagk-Str.","Gerhart-Hauptmann-Str.","Gerichtsstr.","Geschwister-Scholl-Str.","Gezelinallee","Gierener Weg","Ginsterweg","Gisbert-Cremer-Str.","Gl\u00fccksburger Str.","Gluckstr.","Gneisenaustr.","Goetheplatz","Goethestr.","Golo-Mann-Str.","G\u00f6rlitzer Str.","G\u00f6rresstr.","Graebestr.","Graf-Galen-Platz","Gregor-Mendel-Str.","Greifswalder Str.","Grillenweg","Gronenborner Weg","Gro\u00dfe Kirchstr.","Grunder Wiesen","Grunderm\u00fchle","Grunderm\u00fchlenhof","Grunderm\u00fchlenweg","Gr\u00fcner Weg","Grunewaldstr.","Gr\u00fcnstr.","G\u00fcnther-Weisenborn-Str.","Gustav-Freytag-Str.","Gustav-Heinemann-Str.","Gustav-Radbruch-Str.","Gut Reuschenberg","Gutenbergstr.","Haberstr.","Habichtgasse","Hafenstr.","Hagenauer Str.","Hahnenblecher","Halenseestr.","Halfenleimbach","Hallesche Str.","Halligstr.","Hamberger Str.","Hammerweg","H\u00e4ndelstr.","Hannah-H\u00f6ch-Str.","Hans-Arp-Str.","Hans-Gerhard-Str.","Hans-Sachs-Str.","Hans-Schlehahn-Str.","Hans-von-Dohnanyi-Str.","Hardenbergstr.","Haselweg","Hauptstr.","Haus-Vorster-Str.","Hauweg","Havelstr.","Havensteinstr.","Haydnstr.","Hebbelstr.","Heckenweg","Heerweg","Hegelstr.","Heidberg","Heideh\u00f6he","Heidestr.","Heimst\u00e4ttenweg","Heinrich-B\u00f6ll-Str.","Heinrich-Br\u00fcning-Str.","Heinrich-Claes-Str.","Heinrich-Heine-Str.","Heinrich-H\u00f6rlein-Str.","Heinrich-L\u00fcbke-Str.","Heinrich-L\u00fctzenkirchen-Weg","Heinrichstr.","Heinrich-Strerath-Str.","Heinrich-von-Kleist-Str.","Heinrich-von-Stephan-Str.","Heisterbachstr.","Helenenstr.","Helmestr.","Hemmelrather Weg","Henry-T.-v.-B\u00f6ttinger-Str.","Herderstr.","Heribertstr.","Hermann-Ehlers-Str.","Hermann-Hesse-Str.","Hermann-K\u00f6nig-Str.","Hermann-L\u00f6ns-Str.","Hermann-Milde-Str.","Hermann-N\u00f6rrenberg-Str.","Hermann-von-Helmholtz-Str.","Hermann-Waibel-Str.","Herzogstr.","Heymannstr.","Hindenburgstr.","Hirzenberg","Hitdorfer Kirchweg","Hitdorfer Str.","H\u00f6fer M\u00fchle","H\u00f6fer Weg","Hohe Str.","H\u00f6henstr.","H\u00f6ltgestal","Holunderweg","Holzer Weg","Holzer Wiesen","Hornpottweg","Hubertusweg","Hufelandstr.","Hufer Weg","Humboldtstr.","Hummelsheim","Hummelweg","Humperdinckstr.","H\u00fcscheider G\u00e4rten","H\u00fcscheider Str.","H\u00fctte","Ilmstr.","Im Bergischen Heim","Im Bruch","Im Buchenhain","Im B\u00fchl","Im Burgfeld","Im Dorf","Im Eisholz","Im Friedenstal","Im Frohental","Im Grunde","Im Hederichsfeld","Im J\u00fccherfeld","Im Kalkfeld","Im Kirberg","Im Kirchfeld","Im Kreuzbruch","Im M\u00fchlenfeld","Im Nesselrader Kamp","Im Oberdorf","Im Oberfeld","Im Rosengarten","Im Rottland","Im Scheffengarten","Im Staderfeld","Im Steinfeld","Im Weidenblech","Im Winkel","Im Ziegelfeld","Imbach","Imbacher Weg","Immenweg","In den Blechenh\u00f6fen","In den Dehlen","In der Birkenau","In der Dasladen","In der Felderh\u00fctten","In der Hartmannswiese","In der H\u00f6hle","In der Schaafsdellen","In der Wasserkuhl","In der W\u00fcste","In Holzhausen","Insterstr.","Jacob-Fr\u00f6hlen-Str.","J\u00e4gerstr.","Jahnstr.","Jakob-Eulenberg-Weg","Jakobistr.","Jakob-Kaiser-Str.","Jenaer Str.","Johannes-Baptist-Str.","Johannes-Dott-Str.","Johannes-Popitz-Str.","Johannes-Wislicenus-Str.","Johannisburger Str.","Johann-Janssen-Str.","Johann-Wirtz-Weg","Josefstr.","J\u00fcch","Julius-Doms-Str.","Julius-Leber-Str.","Kaiserplatz","Kaiserstr.","Kaiser-Wilhelm-Allee","Kalkstr.","K\u00e4mpchenstr.","K\u00e4mpenwiese","K\u00e4mper Weg","Kamptalweg","Kanalstr.","Kandinskystr.","Kantstr.","Kapellenstr.","Karl-Arnold-Str.","Karl-Bosch-Str.","Karl-B\u00fcckart-Str.","Karl-Carstens-Ring","Karl-Friedrich-Goerdeler-Str.","Karl-Jaspers-Str.","Karl-K\u00f6nig-Str.","Karl-Krekeler-Str.","Karl-Marx-Str.","Karlstr.","Karl-Ulitzka-Str.","Karl-Wichmann-Str.","Karl-Wingchen-Str.","K\u00e4senbrod","K\u00e4the-Kollwitz-Str.","Katzbachstr.","Kerschensteinerstr.","Kiefernweg","Kieler Str.","Kieselstr.","Kiesweg","Kinderhausen","Kleiberweg","Kleine Kirchstr.","Kleingansweg","Kleinheider Weg","Klief","Kneippstr.","Knochenbergsweg","Kochergarten","Kocherstr.","Kockelsberg","Kolberger Str.","Kolmarer Str.","K\u00f6lner Gasse","K\u00f6lner Str.","Kolpingstr.","K\u00f6nigsberger Platz","Konrad-Adenauer-Platz","K\u00f6penicker Str.","Kopernikusstr.","K\u00f6rnerstr.","K\u00f6schenberg","K\u00f6ttershof","Kreuzbroicher Str.","Kreuzkamp","Krummer Weg","Kruppstr.","Kuhlmannweg","Kump","Kumper Weg","Kunstfeldstr.","K\u00fcppersteger Str.","Kursiefen","Kursiefer Weg","Kurtekottenweg","Kurt-Schumacher-Ring","Kyllstr.","Langenfelder Str.","L\u00e4ngsleimbach","L\u00e4rchenweg","Legienstr.","Lehner M\u00fchle","Leichlinger Str.","Leimbacher Hof","Leinestr.","Leineweberstr.","Leipziger Str.","Lerchengasse","Lessingstr.","Libellenweg","Lichstr.","Liebigstr.","Lindenstr.","Lingenfeld","Linienstr.","Lippe","L\u00f6chergraben","L\u00f6fflerstr.","Loheweg","Lohrbergstr.","Lohrstr.","L\u00f6hstr.","Lortzingstr.","L\u00f6tzener Str.","L\u00f6wenburgstr.","Lucasstr.","Ludwig-Erhard-Platz","Ludwig-Girtler-Str.","Ludwig-Knorr-Str.","Luisenstr.","Lupinenweg","Lurchenweg","L\u00fctzenkirchener Str.","Lycker Str.","Maashofstr.","Manforter Str.","Marc-Chagall-Str.","Maria-Dresen-Str.","Maria-Terwiel-Str.","Marie-Curie-Str.","Marienburger Str.","Mariendorfer Str.","Marienwerderstr.","Marie-Schlei-Str.","Marktplatz","Markusweg","Martin-Buber-Str.","Martin-Heidegger-Str.","Martin-Luther-Str.","Masurenstr.","Mathildenweg","Maurinusstr.","Mauspfad","Max-Beckmann-Str.","Max-Delbr\u00fcck-Str.","Max-Ernst-Str.","Max-Holthausen-Platz","Max-Horkheimer-Str.","Max-Liebermann-Str.","Max-Pechstein-Str.","Max-Planck-Str.","Max-Scheler-Str.","Max-Sch\u00f6nenberg-Str.","Maybachstr.","Meckhofer Feld","Meisenweg","Memelstr.","Menchendahler Str.","Mendelssohnstr.","Merziger Str.","Mettlacher Str.","Metzer Str.","Michaelsweg","Miselohestr.","Mittelstr.","Mohlenstr.","Moltkestr.","Monheimer Str.","Montanusstr.","Montessoriweg","Moosweg","Morsbroicher Str.","Moselstr.","Moskauer Str.","Mozartstr.","M\u00fchlenweg","Muhrgasse","Muldestr.","M\u00fclhausener Str.","M\u00fclheimer Str.","M\u00fcnsters G\u00e4\u00dfchen","M\u00fcnzstr.","M\u00fcritzstr.","Myliusstr.","Nachtigallenweg","Nauener Str.","Nei\u00dfestr.","Nelly-Sachs-Str.","Netzestr.","Neuendriesch","Neuenhausgasse","Neuenkamp","Neujudenhof","Neukronenberger Str.","Neustadtstr.","Nicolai-Hartmann-Str.","Niederblecher","Niederfeldstr.","Nietzschestr.","Nikolaus-Gro\u00df-Str.","Nobelstr.","Norderneystr.","Nordstr.","Ober dem Hof","Obere Lindenstr.","Obere Str.","Ober\u00f6lbach","Odenthaler Str.","Oderstr.","Okerstr.","Olof-Palme-Str.","Ophovener Str.","Opladener Platz","Opladener Str.","Ortelsburger Str.","Oskar-Moll-Str.","Oskar-Schlemmer-Str.","Oststr.","Oswald-Spengler-Str.","Otto-Dix-Str.","Otto-Grimm-Str.","Otto-Hahn-Str.","Otto-M\u00fcller-Str.","Otto-Stange-Str.","Ottostr.","Otto-Varnhagen-Str.","Otto-Wels-Str.","Ottweilerstr.","Oulustr.","Overfeldweg","Pappelweg","Paracelsusstr.","Parkstr.","Pastor-Louis-Str.","Pastor-Scheibler-Str.","Pastorskamp","Paul-Klee-Str.","Paul-L\u00f6be-Str.","Paulstr.","Peenestr.","Pescher Busch","Peschstr.","Pestalozzistr.","Peter-Grie\u00df-Str.","Peter-Joseph-Lenn\u00e9-Str.","Peter-Neuenheuser-Str.","Petersbergstr.","Peterstr.","Pfarrer-Jekel-Str.","Pfarrer-Klein-Str.","Pfarrer-R\u00f6hr-Str.","Pfeilshofstr.","Philipp-Ott-Str.","Piet-Mondrian-Str.","Platanenweg","Pommernstr.","Porschestr.","Poststr.","Potsdamer Str.","Pregelstr.","Prie\u00dfnitzstr.","P\u00fctzdelle","Quarzstr.","Quettinger Str.","Rat-Deycks-Str.","Rathenaustr.","Ratherk\u00e4mp","Ratiborer Str.","Raushofstr.","Regensburger Str.","Reinickendorfer Str.","Renkgasse","Rennbaumplatz","Rennbaumstr.","Reuschenberger Str.","Reusrather Str.","Reuterstr.","Rheinallee","Rheindorfer Str.","Rheinstr.","Rhein-Wupper-Platz","Richard-Wagner-Str.","Rilkestr.","Ringstr.","Robert-Blum-Str.","Robert-Koch-Str.","Robert-Medenwald-Str.","Rolandstr.","Romberg","R\u00f6ntgenstr.","Roonstr.","Ropenstall","Ropenstaller Weg","Rosenthal","Rostocker Str.","Rotdornweg","R\u00f6ttgerweg","R\u00fcckertstr.","Rudolf-Breitscheid-Str.","Rudolf-Mann-Platz","Rudolf-Stracke-Str.","Ruhlachplatz","Ruhlachstr.","R\u00fcttersweg","Saalestr.","Saarbr\u00fccker Str.","Saarlauterner Str.","Saarstr.","Salamanderweg","Samlandstr.","Sanddornstr.","Sandstr.","Sauerbruchstr.","Sch\u00e4fersh\u00fctte","Scharnhorststr.","Scheffershof","Scheidemannstr.","Schellingstr.","Schenkendorfstr.","Schie\u00dfbergstr.","Schillerstr.","Schlangenhecke","Schlebuscher Heide","Schlebuscher Str.","Schlebuschrath","Schlehdornstr.","Schleiermacherstr.","Schlo\u00dfstr.","Schmalenbruch","Schnepfenflucht","Sch\u00f6ffenweg","Sch\u00f6llerstr.","Sch\u00f6ne Aussicht","Sch\u00f6neberger Str.","Schopenhauerstr.","Schubertplatz","Schubertstr.","Schulberg","Schulstr.","Schumannstr.","Schwalbenweg","Schwarzastr.","Sebastianusweg","Semmelweisstr.","Siebelplatz","Siemensstr.","Solinger Str.","Sonderburger Str.","Spandauer Str.","Speestr.","Sperberweg","Sperlingsweg","Spitzwegstr.","Sporrenberger M\u00fchle","Spreestr.","St. Ingberter Str.","Starenweg","Stauffenbergstr.","Stefan-Zweig-Str.","Stegerwaldstr.","Steglitzer Str.","Steinb\u00fccheler Feld","Steinb\u00fccheler Str.","Steinstr.","Steinweg","Stephan-Lochner-Str.","Stephanusstr.","Stettiner Str.","Stixchesstr.","St\u00f6ckenstr.","Stralsunder Str.","Stra\u00dfburger Str.","Stresemannplatz","Strombergstr.","Stromstr.","St\u00fcttekofener Str.","Sudestr.","S\u00fcrderstr.","Syltstr.","Talstr.","Tannenbergstr.","Tannenweg","Taubenweg","Teitscheider Weg","Telegrafenstr.","Teltower Str.","Tempelhofer Str.","Theodor-Adorno-Str.","Theodor-Fliedner-Str.","Theodor-Gierath-Str.","Theodor-Haubach-Str.","Theodor-Heuss-Ring","Theodor-Storm-Str.","Theodorstr.","Thomas-Dehler-Str.","Thomas-Morus-Str.","Thomas-von-Aquin-Str.","T\u00f6nges Feld","Torstr.","Treptower Str.","Treuburger Str.","Uhlandstr.","Ulmenweg","Ulmer Str.","Ulrichstr.","Ulrich-von-Hassell-Str.","Umlag","Unstrutstr.","Unter dem Schildchen","Unter\u00f6lbach","Unterstr.","Uppersberg","Van\\'t-Hoff-Str.","Veit-Sto\u00df-Str.","Vereinsstr.","Viktor-Meyer-Str.","Vincent-van-Gogh-Str.","Virchowstr.","Voigtslach","Volhardstr.","V\u00f6lklinger Str.","Von-Brentano-Str.","Von-Diergardt-Str.","Von-Eichendorff-Str.","Von-Ketteler-Str.","Von-Knoeringen-Str.","Von-Pettenkofer-Str.","Von-Siebold-Str.","Wacholderweg","Waldstr.","Walter-Flex-Str.","Walter-Hempel-Str.","Walter-Hochapfel-Str.","Walter-Nernst-Str.","Wannseestr.","Warnowstr.","Warthestr.","Weddigenstr.","Weichselstr.","Weidenstr.","Weidfeldstr.","Weiherfeld","Weiherstr.","Weinh\u00e4user Str.","Wei\u00dfdornweg","Wei\u00dfenseestr.","Weizkamp","Werftstr.","Werkst\u00e4ttenstr.","Werner-Heisenberg-Str.","Werrastr.","Weyerweg","Widdauener Str.","Wiebertshof","Wiehbachtal","Wiembachallee","Wiesdorfer Platz","Wiesenstr.","Wilhelm-Busch-Str.","Wilhelm-Hastrich-Str.","Wilhelm-Leuschner-Str.","Wilhelm-Liebknecht-Str.","Wilhelmsgasse","Wilhelmstr.","Willi-Baumeister-Str.","Willy-Brandt-Ring","Winand-Rossi-Str.","Windthorststr.","Winkelweg","Winterberg","Wittenbergstr.","Wolf-Vostell-Str.","Wolkenburgstr.","Wupperstr.","Wuppertalstr.","W\u00fcstenhof","Yitzhak-Rabin-Str.","Zauberkuhle","Zedernweg","Zehlendorfer Str.","Zehntenweg","Zeisigweg","Zeppelinstr.","Zschopaustr.","Zum Claash\u00e4uschen","Z\u00fcndh\u00fctchenweg","Zur Alten Brauerei","Zur alten Fabrik"],"building_number":["###","##","#","##a","##b","##c"],"secondary_address":["Apt. ###","Zimmer ###","# OG"],"postcode":["#####","#####"],"state":["Baden-W\u00fcrttemberg","Bayern","Berlin","Brandenburg","Bremen","Hamburg","Hessen","Mecklenburg-Vorpommern","Niedersachsen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Th\u00fcringen"],"state_abbr":["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"],"city":["#{city_prefix} #{Name.first_name}#{city_suffix}","#{city_prefix} #{Name.first_name}","#{Name.first_name}#{city_suffix}","#{Name.last_name}#{city_suffix}"],"street_name":["#{street_root}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Deutschland"]},"company":{"suffix":["GmbH","AG","Gruppe","KG","GmbH & Co. KG","UG","OHG"],"legal_form":["GmbH","AG","Gruppe","KG","GmbH & Co. KG","UG","OHG"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} und #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com"],"domain_suffix":["com","info","name","net","org","de","ch"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"]},"name":{"first_name":["Aaron","Abdul","Abdullah","Adam","Adrian","Adriano","Ahmad","Ahmed","Ahmet","Alan","Albert","Alessandro","Alessio","Alex","Alexander","Alfred","Ali","Amar","Amir","Amon","Andre","Andreas","Andrew","Angelo","Ansgar","Anthony","Anton","Antonio","Arda","Arian","Armin","Arne","Arno","Arthur","Artur","Arved","Arvid","Ayman","Baran","Baris","Bastian","Batuhan","Bela","Ben","Benedikt","Benjamin","Bennet","Bennett","Benno","Bent","Berat","Berkay","Bernd","Bilal","Bjarne","Bj\u00f6rn","Bo","Boris","Brandon","Brian","Bruno","Bryan","Burak","Calvin","Can","Carl","Carlo","Carlos","Caspar","Cedric","Cedrik","Cem","Charlie","Chris","Christian","Christiano","Christoph","Christopher","Claas","Clemens","Colin","Collin","Conner","Connor","Constantin","Corvin","Curt","Damian","Damien","Daniel","Danilo","Danny","Darian","Dario","Darius","Darren","David","Davide","Davin","Dean","Deniz","Dennis","Denny","Devin","Diego","Dion","Domenic","Domenik","Dominic","Dominik","Dorian","Dustin","Dylan","Ecrin","Eddi","Eddy","Edgar","Edwin","Efe","Ege","Elia","Eliah","Elias","Elijah","Emanuel","Emil","Emilian","Emilio","Emir","Emirhan","Emre","Enes","Enno","Enrico","Eren","Eric","Erik","Etienne","Fabian","Fabien","Fabio","Fabrice","Falk","Felix","Ferdinand","Fiete","Filip","Finlay","Finley","Finn","Finnley","Florian","Francesco","Franz","Frederic","Frederick","Frederik","Friedrich","Fritz","Furkan","Fynn","Gabriel","Georg","Gerrit","Gian","Gianluca","Gino","Giuliano","Giuseppe","Gregor","Gustav","Hagen","Hamza","Hannes","Hanno","Hans","Hasan","Hassan","Hauke","Hendrik","Hennes","Henning","Henri","Henrick","Henrik","Henry","Hugo","Hussein","Ian","Ibrahim","Ilias","Ilja","Ilyas","Immanuel","Ismael","Ismail","Ivan","Iven","Jack","Jacob","Jaden","Jakob","Jamal","James","Jamie","Jan","Janek","Janis","Janne","Jannek","Jannes","Jannik","Jannis","Jano","Janosch","Jared","Jari","Jarne","Jarno","Jaron","Jason","Jasper","Jay","Jayden","Jayson","Jean","Jens","Jeremias","Jeremie","Jeremy","Jermaine","Jerome","Jesper","Jesse","Jim","Jimmy","Joe","Joel","Joey","Johann","Johannes","John","Johnny","Jon","Jona","Jonah","Jonas","Jonathan","Jonte","Joost","Jordan","Joris","Joscha","Joschua","Josef","Joseph","Josh","Joshua","Josua","Juan","Julian","Julien","Julius","Juri","Justin","Justus","Kaan","Kai","Kalle","Karim","Karl","Karlo","Kay","Keanu","Kenan","Kenny","Keno","Kerem","Kerim","Kevin","Kian","Kilian","Kim","Kimi","Kjell","Klaas","Klemens","Konrad","Konstantin","Koray","Korbinian","Kurt","Lars","Lasse","Laurence","Laurens","Laurenz","Laurin","Lean","Leander","Leandro","Leif","Len","Lenn","Lennard","Lennart","Lennert","Lennie","Lennox","Lenny","Leo","Leon","Leonard","Leonardo","Leonhard","Leonidas","Leopold","Leroy","Levent","Levi","Levin","Lewin","Lewis","Liam","Lian","Lias","Lino","Linus","Lio","Lion","Lionel","Logan","Lorenz","Lorenzo","Loris","Louis","Luan","Luc","Luca","Lucas","Lucian","Lucien","Ludwig","Luis","Luiz","Luk","Luka","Lukas","Luke","Lutz","Maddox","Mads","Magnus","Maik","Maksim","Malik","Malte","Manuel","Marc","Marcel","Marco","Marcus","Marek","Marian","Mario","Marius","Mark","Marko","Markus","Marlo","Marlon","Marten","Martin","Marvin","Marwin","Mateo","Mathis","Matis","Mats","Matteo","Mattes","Matthias","Matthis","Matti","Mattis","Maurice","Max","Maxim","Maximilian","Mehmet","Meik","Melvin","Merlin","Mert","Michael","Michel","Mick","Miguel","Mika","Mikail","Mike","Milan","Milo","Mio","Mirac","Mirco","Mirko","Mohamed","Mohammad","Mohammed","Moritz","Morten","Muhammed","Murat","Mustafa","Nathan","Nathanael","Nelson","Neo","Nevio","Nick","Niclas","Nico","Nicolai","Nicolas","Niels","Nikita","Niklas","Niko","Nikolai","Nikolas","Nils","Nino","Noah","Noel","Norman","Odin","Oke","Ole","Oliver","Omar","Onur","Oscar","Oskar","Pascal","Patrice","Patrick","Paul","Peer","Pepe","Peter","Phil","Philip","Philipp","Pierre","Piet","Pit","Pius","Quentin","Quirin","Rafael","Raik","Ramon","Raphael","Rasmus","Raul","Rayan","Ren\u00e9","Ricardo","Riccardo","Richard","Rick","Rico","Robert","Robin","Rocco","Roman","Romeo","Ron","Ruben","Ryan","Said","Salih","Sam","Sami","Sammy","Samuel","Sandro","Santino","Sascha","Sean","Sebastian","Selim","Semih","Shawn","Silas","Simeon","Simon","Sinan","Sky","Stefan","Steffen","Stephan","Steve","Steven","Sven","S\u00f6nke","S\u00f6ren","Taha","Tamino","Tammo","Tarik","Tayler","Taylor","Teo","Theo","Theodor","Thies","Thilo","Thomas","Thorben","Thore","Thorge","Tiago","Til","Till","Tillmann","Tim","Timm","Timo","Timon","Timothy","Tino","Titus","Tizian","Tjark","Tobias","Tom","Tommy","Toni","Tony","Torben","Tore","Tristan","Tyler","Tyron","Umut","Valentin","Valentino","Veit","Victor","Viktor","Vin","Vincent","Vito","Vitus","Wilhelm","Willi","William","Willy","Xaver","Yannic","Yannick","Yannik","Yannis","Yasin","Youssef","Yunus","Yusuf","Yven","Yves","\u00d6mer","Aaliyah","Abby","Abigail","Ada","Adelina","Adriana","Aileen","Aimee","Alana","Alea","Alena","Alessa","Alessia","Alexa","Alexandra","Alexia","Alexis","Aleyna","Alia","Alica","Alice","Alicia","Alina","Alisa","Alisha","Alissa","Aliya","Aliyah","Allegra","Alma","Alyssa","Amalia","Amanda","Amelia","Amelie","Amina","Amira","Amy","Ana","Anabel","Anastasia","Andrea","Angela","Angelina","Angelique","Anja","Ann","Anna","Annabel","Annabell","Annabelle","Annalena","Anne","Anneke","Annelie","Annemarie","Anni","Annie","Annika","Anny","Anouk","Antonia","Arda","Ariana","Ariane","Arwen","Ashley","Asya","Aurelia","Aurora","Ava","Ayleen","Aylin","Ayse","Azra","Betty","Bianca","Bianka","Caitlin","Cara","Carina","Carla","Carlotta","Carmen","Carolin","Carolina","Caroline","Cassandra","Catharina","Catrin","Cecile","Cecilia","Celia","Celina","Celine","Ceyda","Ceylin","Chantal","Charleen","Charlotta","Charlotte","Chayenne","Cheyenne","Chiara","Christin","Christina","Cindy","Claire","Clara","Clarissa","Colleen","Collien","Cora","Corinna","Cosima","Dana","Daniela","Daria","Darleen","Defne","Delia","Denise","Diana","Dilara","Dina","Dorothea","Ecrin","Eda","Eileen","Ela","Elaine","Elanur","Elea","Elena","Eleni","Eleonora","Eliana","Elif","Elina","Elisa","Elisabeth","Ella","Ellen","Elli","Elly","Elsa","Emelie","Emely","Emilia","Emilie","Emily","Emma","Emmely","Emmi","Emmy","Enie","Enna","Enya","Esma","Estelle","Esther","Eva","Evelin","Evelina","Eveline","Evelyn","Fabienne","Fatima","Fatma","Felicia","Felicitas","Felina","Femke","Fenja","Fine","Finia","Finja","Finnja","Fiona","Flora","Florentine","Francesca","Franka","Franziska","Frederike","Freya","Frida","Frieda","Friederike","Giada","Gina","Giulia","Giuliana","Greta","Hailey","Hana","Hanna","Hannah","Heidi","Helen","Helena","Helene","Helin","Henriette","Henrike","Hermine","Ida","Ilayda","Imke","Ina","Ines","Inga","Inka","Irem","Isa","Isabel","Isabell","Isabella","Isabelle","Ivonne","Jacqueline","Jamie","Jamila","Jana","Jane","Janin","Janina","Janine","Janna","Janne","Jara","Jasmin","Jasmina","Jasmine","Jella","Jenna","Jennifer","Jenny","Jessica","Jessy","Jette","Jil","Jill","Joana","Joanna","Joelina","Joeline","Joelle","Johanna","Joleen","Jolie","Jolien","Jolin","Jolina","Joline","Jona","Jonah","Jonna","Josefin","Josefine","Josephin","Josephine","Josie","Josy","Joy","Joyce","Judith","Judy","Jule","Julia","Juliana","Juliane","Julie","Julienne","Julika","Julina","Juna","Justine","Kaja","Karina","Karla","Karlotta","Karolina","Karoline","Kassandra","Katarina","Katharina","Kathrin","Katja","Katrin","Kaya","Kayra","Kiana","Kiara","Kim","Kimberley","Kimberly","Kira","Klara","Korinna","Kristin","Kyra","Laila","Lana","Lara","Larissa","Laura","Laureen","Lavinia","Lea","Leah","Leana","Leandra","Leann","Lee","Leila","Lena","Lene","Leni","Lenia","Lenja","Lenya","Leona","Leoni","Leonie","Leonora","Leticia","Letizia","Levke","Leyla","Lia","Liah","Liana","Lili","Lilia","Lilian","Liliana","Lilith","Lilli","Lillian","Lilly","Lily","Lina","Linda","Lindsay","Line","Linn","Linnea","Lisa","Lisann","Lisanne","Liv","Livia","Liz","Lola","Loreen","Lorena","Lotta","Lotte","Louisa","Louise","Luana","Luca","Lucia","Lucie","Lucienne","Lucy","Luisa","Luise","Luka","Luna","Luzie","Lya","Lydia","Lyn","Lynn","Madeleine","Madita","Madleen","Madlen","Magdalena","Maike","Mailin","Maira","Maja","Malena","Malia","Malin","Malina","Mandy","Mara","Marah","Mareike","Maren","Maria","Mariam","Marie","Marieke","Mariella","Marika","Marina","Marisa","Marissa","Marit","Marla","Marleen","Marlen","Marlena","Marlene","Marta","Martha","Mary","Maryam","Mathilda","Mathilde","Matilda","Maxi","Maxima","Maxine","Maya","Mayra","Medina","Medine","Meike","Melanie","Melek","Melike","Melina","Melinda","Melis","Melisa","Melissa","Merle","Merve","Meryem","Mette","Mia","Michaela","Michelle","Mieke","Mila","Milana","Milena","Milla","Mina","Mira","Miray","Miriam","Mirja","Mona","Monique","Nadine","Nadja","Naemi","Nancy","Naomi","Natalia","Natalie","Nathalie","Neele","Nela","Nele","Nelli","Nelly","Nia","Nicole","Nika","Nike","Nikita","Nila","Nina","Nisa","Noemi","Nora","Olivia","Patricia","Patrizia","Paula","Paulina","Pauline","Penelope","Philine","Phoebe","Pia","Rahel","Rania","Rebecca","Rebekka","Riana","Rieke","Rike","Romina","Romy","Ronja","Rosa","Rosalie","Ruby","Sabrina","Sahra","Sally","Salome","Samantha","Samia","Samira","Sandra","Sandy","Sanja","Saphira","Sara","Sarah","Saskia","Selin","Selina","Selma","Sena","Sidney","Sienna","Silja","Sina","Sinja","Smilla","Sofia","Sofie","Sonja","Sophia","Sophie","Soraya","Stefanie","Stella","Stephanie","Stina","Sude","Summer","Susanne","Svea","Svenja","Sydney","Tabea","Talea","Talia","Tamara","Tamia","Tamina","Tanja","Tara","Tarja","Teresa","Tessa","Thalea","Thalia","Thea","Theresa","Tia","Tina","Tomke","Tuana","Valentina","Valeria","Valerie","Vanessa","Vera","Veronika","Victoria","Viktoria","Viola","Vivian","Vivien","Vivienne","Wibke","Wiebke","Xenia","Yara","Yaren","Yasmin","Ylvi","Ylvie","Yvonne","Zara","Zehra","Zeynep","Zoe","Zoey","Zo\u00e9"],"last_name":["Abel","Abicht","Abraham","Abramovic","Abt","Achilles","Achkinadze","Ackermann","Adam","Adams","Ade","Agostini","Ahlke","Ahrenberg","Ahrens","Aigner","Albert","Albrecht","Alexa","Alexander","Alizadeh","Allgeyer","Amann","Amberg","Anding","Anggreny","Apitz","Arendt","Arens","Arndt","Aryee","Aschenbroich","Assmus","Astafei","Auer","Axmann","Baarck","Bachmann","Badane","Bader","Baganz","Bahl","Bak","Balcer","Balck","Balkow","Balnuweit","Balzer","Banse","Barr","Bartels","Barth","Barylla","Baseda","Battke","Bauer","Bauermeister","Baumann","Baumeister","Bauschinger","Bauschke","Bayer","Beavogui","Beck","Beckel","Becker","Beckmann","Bedewitz","Beele","Beer","Beggerow","Beh","Behr","Behrenbruch","Belz","Bender","Benecke","Benner","Benninger","Benzing","Berends","Berger","Berner","Berning","Bertenbreiter","Best","Bethke","Betz","Beushausen","Beutelspacher","Beyer","Biba","Bichler","Bickel","Biedermann","Bieler","Bielert","Bienasch","Bienias","Biesenbach","Bigdeli","Birkemeyer","Bittner","Blank","Blaschek","Blassneck","Bloch","Blochwitz","Blockhaus","Blum","Blume","Bock","Bode","Bogdashin","Bogenrieder","Bohge","Bolm","Borgschulze","Bork","Bormann","Bornscheuer","Borrmann","Borsch","Boruschewski","Bos","Bosler","Bourrouag","Bouschen","Boxhammer","Boyde","Bozsik","Brand","Brandenburg","Brandis","Brandt","Brauer","Braun","Brehmer","Breitenstein","Bremer","Bremser","Brenner","Brettschneider","Breu","Breuer","Briesenick","Bringmann","Brinkmann","Brix","Broening","Brosch","Bruckmann","Bruder","Bruhns","Brunner","Bruns","Br\u00e4utigam","Br\u00f6mme","Br\u00fcggmann","Buchholz","Buchrucker","Buder","Bultmann","Bunjes","Burger","Burghagen","Burkhard","Burkhardt","Burmeister","Busch","Buschbaum","Busemann","Buss","Busse","Bussmann","Byrd","B\u00e4cker","B\u00f6hm","B\u00f6nisch","B\u00f6rgeling","B\u00f6rner","B\u00f6ttner","B\u00fcchele","B\u00fchler","B\u00fcker","B\u00fcngener","B\u00fcrger","B\u00fcrklein","B\u00fcscher","B\u00fcttner","Camara","Carlowitz","Carlsohn","Caspari","Caspers","Chapron","Christ","Cierpinski","Clarius","Cleem","Cleve","Co","Conrad","Cordes","Cornelsen","Cors","Cotthardt","Crews","Cronj\u00e4ger","Crosskofp","Da","Dahm","Dahmen","Daimer","Damaske","Danneberg","Danner","Daub","Daubner","Daudrich","Dauer","Daum","Dauth","Dautzenberg","De","Decker","Deckert","Deerberg","Dehmel","Deja","Delonge","Demut","Dengler","Denner","Denzinger","Derr","Dertmann","Dethloff","Deuschle","Dieckmann","Diedrich","Diekmann","Dienel","Dies","Dietrich","Dietz","Dietzsch","Diezel","Dilla","Dingelstedt","Dippl","Dittmann","Dittmar","Dittmer","Dix","Dobbrunz","Dobler","Dohring","Dolch","Dold","Dombrowski","Donie","Doskoczynski","Dragu","Drechsler","Drees","Dreher","Dreier","Dreissigacker","Dressler","Drews","Duma","Dutkiewicz","Dyett","Dylus","D\u00e4chert","D\u00f6bel","D\u00f6ring","D\u00f6rner","D\u00f6rre","D\u00fcck","Eberhard","Eberhardt","Ecker","Eckhardt","Edorh","Effler","Eggenmueller","Ehm","Ehmann","Ehrig","Eich","Eichmann","Eifert","Einert","Eisenlauer","Ekpo","Elbe","Eleyth","Elss","Emert","Emmelmann","Ender","Engel","Engelen","Engelmann","Eplinius","Erdmann","Erhardt","Erlei","Erm","Ernst","Ertl","Erwes","Esenwein","Esser","Evers","Everts","Ewald","Fahner","Faller","Falter","Farber","Fassbender","Faulhaber","Fehrig","Feld","Felke","Feller","Fenner","Fenske","Feuerbach","Fietz","Figl","Figura","Filipowski","Filsinger","Fincke","Fink","Finke","Fischer","Fitschen","Fleischer","Fleischmann","Floder","Florczak","Flore","Flottmann","Forkel","Forst","Frahmeke","Frank","Franke","Franta","Frantz","Franz","Franzis","Franzmann","Frauen","Frauendorf","Freigang","Freimann","Freimuth","Freisen","Frenzel","Frey","Fricke","Fried","Friedek","Friedenberg","Friedmann","Friedrich","Friess","Frisch","Frohn","Frosch","Fuchs","Fuhlbr\u00fcgge","Fusenig","Fust","F\u00f6rster","Gaba","Gabius","Gabler","Gadschiew","Gakst\u00e4dter","Galander","Gamlin","Gamper","Gangnus","Ganzmann","Garatva","Gast","Gastel","Gatzka","Gauder","Gebhardt","Geese","Gehre","Gehrig","Gehring","Gehrke","Geiger","Geisler","Geissler","Gelling","Gens","Gerbennow","Gerdel","Gerhardt","Gerschler","Gerson","Gesell","Geyer","Ghirmai","Ghosh","Giehl","Gierisch","Giesa","Giesche","Gilde","Glatting","Goebel","Goedicke","Goldbeck","Goldfuss","Goldkamp","Goldk\u00fchle","Goller","Golling","Gollnow","Golomski","Gombert","Gotthardt","Gottschalk","Gotz","Goy","Gradzki","Graf","Grams","Grasse","Gratzky","Grau","Greb","Green","Greger","Greithanner","Greschner","Griem","Griese","Grimm","Gromisch","Gross","Grosser","Grossheim","Grosskopf","Grothaus","Grothkopp","Grotke","Grube","Gruber","Grundmann","Gruning","Gruszecki","Gr\u00f6ss","Gr\u00f6tzinger","Gr\u00fcn","Gr\u00fcner","Gummelt","Gunkel","Gunther","Gutjahr","Gutowicz","Gutschank","G\u00f6bel","G\u00f6ckeritz","G\u00f6hler","G\u00f6rlich","G\u00f6rmer","G\u00f6tz","G\u00f6tzelmann","G\u00fcldemeister","G\u00fcnther","G\u00fcnz","G\u00fcrbig","Haack","Haaf","Habel","Hache","Hackbusch","Hackelbusch","Hadfield","Hadwich","Haferkamp","Hahn","Hajek","Hallmann","Hamann","Hanenberger","Hannecker","Hanniske","Hansen","Hardy","Hargasser","Harms","Harnapp","Harter","Harting","Hartlieb","Hartmann","Hartwig","Hartz","Haschke","Hasler","Hasse","Hassfeld","Haug","Hauke","Haupt","Haverney","Heberstreit","Hechler","Hecht","Heck","Hedermann","Hehl","Heidelmann","Heidler","Heinemann","Heinig","Heinke","Heinrich","Heinze","Heiser","Heist","Hellmann","Helm","Helmke","Helpling","Hengmith","Henkel","Hennes","Henry","Hense","Hensel","Hentel","Hentschel","Hentschke","Hepperle","Herberger","Herbrand","Hering","Hermann","Hermecke","Herms","Herold","Herrmann","Herschmann","Hertel","Herweg","Herwig","Herzenberg","Hess","Hesse","Hessek","Hessler","Hetzler","Heuck","Heydem\u00fcller","Hiebl","Hildebrand","Hildenbrand","Hilgendorf","Hillard","Hiller","Hingsen","Hingst","Hinrichs","Hirsch","Hirschberg","Hirt","Hodea","Hoffman","Hoffmann","Hofmann","Hohenberger","Hohl","Hohn","Hohnheiser","Hold","Holdt","Holinski","Holl","Holtfreter","Holz","Holzdeppe","Holzner","Hommel","Honz","Hooss","Hoppe","Horak","Horn","Horna","Hornung","Hort","Howard","Huber","Huckestein","Hudak","Huebel","Hugo","Huhn","Hujo","Huke","Huls","Humbert","Huneke","Huth","H\u00e4ber","H\u00e4fner","H\u00f6cke","H\u00f6ft","H\u00f6hne","H\u00f6nig","H\u00f6rdt","H\u00fcbenbecker","H\u00fcbl","H\u00fcbner","H\u00fcgel","H\u00fcttcher","H\u00fctter","Ibe","Ihly","Illing","Isak","Isekenmeier","Itt","Jacob","Jacobs","Jagusch","Jahn","Jahnke","Jakobs","Jakubczyk","Jambor","Jamrozy","Jander","Janich","Janke","Jansen","Jarets","Jaros","Jasinski","Jasper","Jegorov","Jellinghaus","Jeorga","Jerschabek","Jess","John","Jonas","Jossa","Jucken","Jung","Jungbluth","Jungton","Just","J\u00fcrgens","Kaczmarek","Kaesmacher","Kahl","Kahlert","Kahles","Kahlmeyer","Kaiser","Kalinowski","Kallabis","Kallensee","Kampf","Kampschulte","Kappe","Kappler","Karhoff","Karrass","Karst","Karsten","Karus","Kass","Kasten","Kastner","Katzinski","Kaufmann","Kaul","Kausemann","Kawohl","Kazmarek","Kedzierski","Keil","Keiner","Keller","Kelm","Kempe","Kemper","Kempter","Kerl","Kern","Kesselring","Kesselschl\u00e4ger","Kette","Kettenis","Keutel","Kick","Kiessling","Kinadeter","Kinzel","Kinzy","Kirch","Kirst","Kisabaka","Klaas","Klabuhn","Klapper","Klauder","Klaus","Kleeberg","Kleiber","Klein","Kleinert","Kleininger","Kleinmann","Kleinsteuber","Kleiss","Klemme","Klimczak","Klinger","Klink","Klopsch","Klose","Kloss","Kluge","Kluwe","Knabe","Kneifel","Knetsch","Knies","Knippel","Knobel","Knoblich","Knoll","Knorr","Knorscheidt","Knut","Kobs","Koch","Kochan","Kock","Koczulla","Koderisch","Koehl","Koehler","Koenig","Koester","Kofferschlager","Koha","Kohle","Kohlmann","Kohnle","Kohrt","Koj","Kolb","Koleiski","Kolokas","Komoll","Konieczny","Konig","Konow","Konya","Koob","Kopf","Kosenkow","Koster","Koszewski","Koubaa","Kovacs","Kowalick","Kowalinski","Kozakiewicz","Krabbe","Kraft","Kral","Kramer","Krauel","Kraus","Krause","Krauspe","Kreb","Krebs","Kreissig","Kresse","Kreutz","Krieger","Krippner","Krodinger","Krohn","Krol","Kron","Krueger","Krug","Kruger","Krull","Kruschinski","Kr\u00e4mer","Kr\u00f6ckert","Kr\u00f6ger","Kr\u00fcger","Kubera","Kufahl","Kuhlee","Kuhnen","Kulimann","Kulma","Kumbernuss","Kummle","Kunz","Kupfer","Kupprion","Kuprion","Kurnicki","Kurrat","Kurschilgen","Kuschewitz","Kuschmann","Kuske","Kustermann","Kutscherauer","Kutzner","Kwadwo","K\u00e4hler","K\u00e4ther","K\u00f6hler","K\u00f6hrbr\u00fcck","K\u00f6hre","K\u00f6lotzei","K\u00f6nig","K\u00f6pernick","K\u00f6seoglu","K\u00fahn","K\u00fahnert","K\u00fchn","K\u00fchnel","K\u00fchnemund","K\u00fchnert","K\u00fchnke","K\u00fcsters","K\u00fcter","Laack","Lack","Ladewig","Lakomy","Lammert","Lamos","Landmann","Lang","Lange","Langfeld","Langhirt","Lanig","Lauckner","Lauinger","Laur\u00e9n","Lausecker","Laux","Laws","Lax","Leberer","Lehmann","Lehner","Leibold","Leide","Leimbach","Leipold","Leist","Leiter","Leiteritz","Leitheim","Leiwesmeier","Lenfers","Lenk","Lenz","Lenzen","Leo","Lepthin","Lesch","Leschnik","Letzelter","Lewin","Lewke","Leyckes","Lg","Lichtenfeld","Lichtenhagen","Lichtl","Liebach","Liebe","Liebich","Liebold","Lieder","Liensh\u00f6ft","Linden","Lindenberg","Lindenmayer","Lindner","Linke","Linnenbaum","Lippe","Lipske","Lipus","Lischka","Lobinger","Logsch","Lohmann","Lohre","Lohse","Lokar","Loogen","Lorenz","Losch","Loska","Lott","Loy","Lubina","Ludolf","Lufft","Lukoschek","Lutje","Lutz","L\u00f6ser","L\u00f6wa","L\u00fcbke","Maak","Maczey","Madetzky","Madubuko","Mai","Maier","Maisch","Malek","Malkus","Mallmann","Malucha","Manns","Manz","Marahrens","Marchewski","Margis","Markowski","Marl","Marner","Marquart","Marschek","Martel","Marten","Martin","Marx","Marxen","Mathes","Mathies","Mathiszik","Matschke","Mattern","Matthes","Matula","Mau","Maurer","Mauroff","May","Maybach","Mayer","Mebold","Mehl","Mehlhorn","Mehlorn","Meier","Meisch","Meissner","Meloni","Melzer","Menga","Menne","Mensah","Mensing","Merkel","Merseburg","Mertens","Mesloh","Metzger","Metzner","Mewes","Meyer","Michallek","Michel","Mielke","Mikitenko","Milde","Minah","Mintzlaff","Mockenhaupt","Moede","Moedl","Moeller","Moguenara","Mohr","Mohrhard","Molitor","Moll","Moller","Molzan","Montag","Moormann","Mordhorst","Morgenstern","Morhelfer","Moritz","Moser","Motchebon","Motzenbb\u00e4cker","Mrugalla","Muckenthaler","Mues","Muller","Mulrain","M\u00e4chtig","M\u00e4der","M\u00f6cks","M\u00f6genburg","M\u00f6hsner","M\u00f6ldner","M\u00f6llenbeck","M\u00f6ller","M\u00f6llinger","M\u00f6rsch","M\u00fchleis","M\u00fcller","M\u00fcnch","Nabein","Nabow","Nagel","Nannen","Nastvogel","Nau","Naubert","Naumann","Ne","Neimke","Nerius","Neubauer","Neubert","Neuendorf","Neumair","Neumann","Neupert","Neurohr","Neuschwander","Newton","Ney","Nicolay","Niedermeier","Nieklauson","Niklaus","Nitzsche","Noack","Nodler","Nolte","Normann","Norris","Northoff","Nowak","Nussbeck","Nwachukwu","Nytra","N\u00f6h","Oberem","Obergf\u00f6ll","Obermaier","Ochs","Oeser","Olbrich","Onnen","Ophey","Oppong","Orth","Orthmann","Oschkenat","Osei","Osenberg","Ostendarp","Ostwald","Otte","Otto","Paesler","Pajonk","Pallentin","Panzig","Paschke","Patzwahl","Paukner","Peselman","Peter","Peters","Petzold","Pfeiffer","Pfennig","Pfersich","Pfingsten","Pflieger","Pfl\u00fcgner","Philipp","Pichlmaier","Piesker","Pietsch","Pingpank","Pinnock","Pippig","Pitschugin","Plank","Plass","Platzer","Plauk","Plautz","Pletsch","Plotzitzka","Poehn","Poeschl","Pogorzelski","Pohl","Pohland","Pohle","Polifka","Polizzi","Pollm\u00e4cher","Pomp","Ponitzsch","Porsche","Porth","Poschmann","Poser","Pottel","Prah","Prange","Prediger","Pressler","Preuk","Preuss","Prey","Priemer","Proske","Pusch","P\u00f6che","P\u00f6ge","Raabe","Rabenstein","Rach","Radtke","Rahn","Ranftl","Rangen","Ranz","Rapp","Rath","Rau","Raubuch","Raukuc","Rautenkranz","Rehwagen","Reiber","Reichardt","Reichel","Reichling","Reif","Reifenrath","Reimann","Reinberg","Reinelt","Reinhardt","Reinke","Reitze","Renk","Rentz","Renz","Reppin","Restle","Restorff","Retzke","Reuber","Reumann","Reus","Reuss","Reusse","Rheder","Rhoden","Richards","Richter","Riedel","Riediger","Rieger","Riekmann","Riepl","Riermeier","Riester","Riethm\u00fcller","Rietm\u00fcller","Rietscher","Ringel","Ringer","Rink","Ripken","Ritosek","Ritschel","Ritter","Rittweg","Ritz","Roba","Rockmeier","Rodehau","Rodowski","Roecker","Roggatz","Rohl\u00e4nder","Rohrer","Rokossa","Roleder","Roloff","Roos","Rosbach","Roschinsky","Rose","Rosenauer","Rosenbauer","Rosenthal","Rosksch","Rossberg","Rossler","Roth","Rother","Ruch","Ruckdeschel","Rumpf","Rupprecht","Ruth","Ryjikh","Ryzih","R\u00e4dler","R\u00e4ntsch","R\u00f6diger","R\u00f6se","R\u00f6ttger","R\u00fccker","R\u00fcdiger","R\u00fcter","Sachse","Sack","Saflanis","Sagafe","Sagonas","Sahner","Saile","Sailer","Salow","Salzer","Salzmann","Sammert","Sander","Sarvari","Sattelmaier","Sauer","Sauerland","Saumweber","Savoia","Scc","Schacht","Schaefer","Schaffarzik","Schahbasian","Scharf","Schedler","Scheer","Schelk","Schellenbeck","Schembera","Schenk","Scherbarth","Scherer","Schersing","Scherz","Scheurer","Scheuring","Scheytt","Schielke","Schieskow","Schildhauer","Schilling","Schima","Schimmer","Schindzielorz","Schirmer","Schirrmeister","Schlachter","Schlangen","Schlawitz","Schlechtweg","Schley","Schlicht","Schlitzer","Schmalzle","Schmid","Schmidt","Schmidtchen","Schmitt","Schmitz","Schmuhl","Schneider","Schnelting","Schnieder","Schniedermeier","Schn\u00fcrer","Schoberg","Scholz","Schonberg","Schondelmaier","Schorr","Schott","Schottmann","Schouren","Schrader","Schramm","Schreck","Schreiber","Schreiner","Schreiter","Schroder","Schr\u00f6der","Schuermann","Schuff","Schuhaj","Schuldt","Schult","Schulte","Schultz","Schultze","Schulz","Schulze","Schumacher","Schumann","Schupp","Schuri","Schuster","Schwab","Schwalm","Schwanbeck","Schwandke","Schwanitz","Schwarthoff","Schwartz","Schwarz","Schwarzer","Schwarzkopf","Schwarzmeier","Schwatlo","Schweisfurth","Schwennen","Schwerdtner","Schwidde","Schwirkschlies","Schwuchow","Sch\u00e4fer","Sch\u00e4ffel","Sch\u00e4ffer","Sch\u00e4ning","Sch\u00f6ckel","Sch\u00f6nball","Sch\u00f6nbeck","Sch\u00f6nberg","Sch\u00f6nebeck","Sch\u00f6nenberger","Sch\u00f6nfeld","Sch\u00f6nherr","Sch\u00f6nlebe","Sch\u00f6tz","Sch\u00fcler","Sch\u00fcppel","Sch\u00fctz","Sch\u00fctze","Seeger","Seelig","Sehls","Seibold","Seidel","Seiders","Seigel","Seiler","Seitz","Semisch","Senkel","Sewald","Siebel","Siebert","Siegling","Sielemann","Siemon","Siener","Sievers","Siewert","Sihler","Sillah","Simon","Sinnhuber","Sischka","Skibicki","Sladek","Slotta","Smieja","Soboll","Sokolowski","Soller","Sollner","Sommer","Somssich","Sonn","Sonnabend","Spahn","Spank","Spelmeyer","Spiegelburg","Spielvogel","Spinner","Spitzm\u00fcller","Splinter","Sporrer","Sprenger","Sp\u00f6ttel","Stahl","Stang","Stanger","Stauss","Steding","Steffen","Steffny","Steidl","Steigauf","Stein","Steinecke","Steinert","Steinkamp","Steinmetz","Stelkens","Stengel","Stengl","Stenzel","Stepanov","Stephan","Stern","Steuk","Stief","Stifel","Stoll","Stolle","Stolz","Storl","Storp","Stoutjesdijk","Stratmann","Straub","Strausa","Streck","Streese","Strege","Streit","Streller","Strieder","Striezel","Strogies","Strohschank","Strunz","Strutz","Stube","St\u00f6ckert","St\u00f6ppler","St\u00f6wer","St\u00fcrmer","Suffa","Sujew","Sussmann","Suthe","Sutschet","Swillims","Szendrei","S\u00f6ren","S\u00fcrth","Tafelmeier","Tang","Tasche","Taufratshofer","Tegethof","Teichmann","Tepper","Terheiden","Terlecki","Teufel","Theele","Thieke","Thimm","Thiomas","Thomas","Thriene","Thr\u00e4nhardt","Thust","Thyssen","Th\u00f6ne","Tidow","Tiedtke","Tietze","Tilgner","Tillack","Timmermann","Tischler","Tischmann","Tittman","Tivontschik","Tonat","Tonn","Trampeli","Trauth","Trautmann","Travan","Treff","Tremmel","Tress","Tsamonikian","Tschiers","Tschirch","Tuch","Tucholke","Tudow","Tuschmo","T\u00e4chl","T\u00f6bben","T\u00f6pfer","Uhlemann","Uhlig","Uhrig","Uibel","Uliczka","Ullmann","Ullrich","Umbach","Umlauft","Umminger","Unger","Unterpaintner","Urban","Urbaniak","Urbansky","Urhig","Vahlensieck","Van","Vangermain","Vater","Venghaus","Verniest","Verzi","Vey","Viellehner","Vieweg","Voelkel","Vogel","Vogelgsang","Vogt","Voigt","Vokuhl","Volk","Volker","Volkmann","Von","Vona","Vontein","Wachenbrunner","Wachtel","Wagner","Waibel","Wakan","Waldmann","Wallner","Wallstab","Walter","Walther","Walton","Walz","Wanner","Wartenberg","Waschb\u00fcsch","Wassilew","Wassiluk","Weber","Wehrsen","Weidlich","Weidner","Weigel","Weight","Weiler","Weimer","Weis","Weiss","Weller","Welsch","Welz","Welzel","Weniger","Wenk","Werle","Werner","Werrmann","Wessel","Wessinghage","Weyel","Wezel","Wichmann","Wickert","Wiebe","Wiechmann","Wiegelmann","Wierig","Wiese","Wieser","Wilhelm","Wilky","Will","Willwacher","Wilts","Wimmer","Winkelmann","Winkler","Winter","Wischek","Wischer","Wissing","Wittich","Wittl","Wolf","Wolfarth","Wolff","Wollenberg","Wollmann","Woytkowska","Wujak","Wurm","Wyludda","W\u00f6lpert","W\u00f6schler","W\u00fchn","W\u00fcnsche","Zach","Zaczkiewicz","Zahn","Zaituc","Zandt","Zanner","Zapletal","Zauber","Zeidler","Zekl","Zender","Zeuch","Zeyen","Zeyhle","Ziegler","Zimanyi","Zimmer","Zimmermann","Zinser","Zintl","Zipp","Zipse","Zschunke","Zuber","Zwiener","Z\u00fcmsande","\u00d6stringer","\u00dcberacker"],"prefix":["Hr.","Fr.","Dr.","Prof. Dr."],"nobility_title_prefix":["zu","von","vom","von der"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{nobility_title_prefix} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["(0###) #########","(0####) #######","+49-###-#######","+49-####-########"]},"cell_phone":{"formats":["+49-1##-#######","+49-1###-########"]}}},"zh-CN":{"faker":{"address":{"city_prefix":["\u957f","\u4e0a","\u5357","\u897f","\u5317","\u8bf8","\u5b81","\u73e0","\u6b66","\u8861","\u6210","\u798f","\u53a6","\u8d35","\u5409","\u6d77","\u592a","\u6d4e","\u5b89","\u5409","\u5305"],"city_suffix":["\u6c99\u5e02","\u4eac\u5e02","\u5b81\u5e02","\u5b89\u5e02","\u4e61\u53bf","\u6d77\u5e02","\u7801\u5e02","\u6c49\u5e02","\u9633\u5e02","\u90fd\u5e02","\u5dde\u5e02","\u95e8\u5e02","\u9633\u5e02","\u53e3\u5e02","\u539f\u5e02","\u5357\u5e02","\u5fbd\u5e02","\u6797\u5e02","\u5934\u5e02"],"building_number":["#####","####","###","##","#"],"street_suffix":["\u5df7","\u8857","\u8def","\u6865","\u4fac","\u65c1","\u4e2d\u5fc3","\u680b"],"postcode":["######"],"state":["\u5317\u4eac\u5e02","\u4e0a\u6d77\u5e02","\u5929\u6d25\u5e02","\u91cd\u5e86\u5e02","\u9ed1\u9f99\u6c5f\u7701","\u5409\u6797\u7701","\u8fbd\u5b81\u7701","\u5185\u8499\u53e4","\u6cb3\u5317\u7701","\u65b0\u7586","\u7518\u8083\u7701","\u9752\u6d77\u7701","\u9655\u897f\u7701","\u5b81\u590f","\u6cb3\u5357\u7701","\u5c71\u4e1c\u7701","\u5c71\u897f\u7701","\u5b89\u5fbd\u7701","\u6e56\u5317\u7701","\u6e56\u5357\u7701","\u6c5f\u82cf\u7701","\u56db\u5ddd\u7701","\u8d35\u5dde\u7701","\u4e91\u5357\u7701","\u5e7f\u897f\u7701","\u897f\u85cf","\u6d59\u6c5f\u7701","\u6c5f\u897f\u7701","\u5e7f\u4e1c\u7701","\u798f\u5efa\u7701","\u53f0\u6e7e\u7701","\u6d77\u5357\u7701","\u9999\u6e2f","\u6fb3\u95e8"],"state_abbr":["\u4eac","\u6caa","\u6d25","\u6e1d","\u9ed1","\u5409","\u8fbd","\u8499","\u5180","\u65b0","\u7518","\u9752","\u9655","\u5b81","\u8c6b","\u9c81","\u664b","\u7696","\u9102","\u6e58","\u82cf","\u5ddd","\u9ed4","\u6ec7","\u6842","\u85cf","\u6d59","\u8d63","\u7ca4","\u95fd","\u53f0","\u743c","\u6e2f","\u6fb3"],"city":["#{city_prefix}#{city_suffix}"],"street_name":["#{Name.last_name}#{street_suffix}"],"street_address":["#{street_name}#{building_number}\u53f7"],"default_country":["\u4e2d\u56fd"]},"name":{"first_name":["\u738b","\u674e","\u5f20","\u5218","\u9648","\u6768","\u9ec4","\u5434","\u8d75","\u5468","\u5f90","\u5b59","\u9a6c","\u6731","\u80e1","\u6797","\u90ed","\u4f55","\u9ad8","\u7f57","\u90d1","\u6881","\u8c22","\u5b8b","\u5510","\u8bb8","\u9093","\u51af","\u97e9","\u66f9","\u66fe","\u5f6d","\u8427","\u8521","\u6f58","\u7530","\u8463","\u8881","\u4e8e","\u4f59","\u53f6","\u848b","\u675c","\u82cf","\u9b4f","\u7a0b","\u5415","\u4e01","\u6c88","\u4efb","\u59da","\u5362","\u5085","\u949f","\u59dc","\u5d14","\u8c2d","\u5ed6","\u8303","\u6c6a","\u9646","\u91d1","\u77f3","\u6234","\u8d3e","\u97e6","\u590f","\u90b1","\u65b9","\u4faf","\u90b9","\u718a","\u5b5f","\u79e6","\u767d","\u6c5f","\u960e","\u859b","\u5c39","\u6bb5","\u96f7","\u9ece","\u53f2","\u9f99","\u9676","\u8d3a","\u987e","\u6bdb","\u90dd","\u9f9a","\u90b5","\u4e07","\u94b1","\u4e25","\u8d56","\u8983","\u6d2a","\u6b66","\u83ab","\u5b54"],"last_name":["\u7ecd\u9f50","\u535a\u6587","\u6893\u6668","\u80e4\u7965","\u745e\u9716","\u660e\u54f2","\u5929\u7fca","\u51ef\u745e","\u5065\u96c4","\u8000\u6770","\u6f47\u7136","\u5b50\u6db5","\u8d8a\u5f6c","\u94b0\u8f69","\u667a\u8f89","\u81f4\u8fdc","\u4fca\u9a70","\u96e8\u6cfd","\u70e8\u78ca","\u665f\u777f","\u6587\u660a","\u4fee\u6d01","\u9ece\u6615","\u8fdc\u822a","\u65ed\u5c27","\u9e3f\u6d9b","\u4f1f\u797a","\u8363\u8f69","\u8d8a\u6cfd","\u6d69\u5b87","\u747e\u745c","\u7693\u8f69","\u64ce\u82cd","\u64ce\u5b87","\u5fd7\u6cfd","\u5b50\u8f69","\u777f\u6e0a","\u5f18\u6587","\u54f2\u701a","\u96e8\u6cfd","\u6977\u745e","\u5efa\u8f89","\u664b\u9e4f","\u5929\u78ca","\u7ecd\u8f89","\u6cfd\u6d0b","\u946b\u78ca","\u9e4f\u714a","\u660a\u5f3a","\u4f1f\u5bb8","\u535a\u8d85","\u541b\u6d69","\u5b50\u9a9e","\u9e4f\u6d9b","\u708e\u5f6c","\u9e64\u8f69","\u8d8a\u5f6c","\u98ce\u534e","\u9756\u742a","\u660e\u8f89","\u4f1f\u8bda","\u660e\u8f69","\u5065\u67cf","\u4fee\u6770","\u5fd7\u6cfd","\u5f18\u6587","\u5cfb\u7199","\u5609\u61ff","\u715c\u57ce","\u61ff\u8f69","\u70e8\u4f1f","\u82d1\u535a","\u4f1f\u6cfd","\u71a0\u5f64","\u9e3f\u714a","\u535a\u6d9b","\u70e8\u9716","\u70e8\u534e","\u715c\u797a","\u667a\u5bb8","\u6b63\u8c6a","\u660a\u7136","\u660e\u6770","\u7acb\u8bda","\u7acb\u8f69","\u7acb\u8f89","\u5cfb\u7199","\u5f18\u6587","\u71a0\u5f64","\u9e3f\u714a","\u70e8\u9716","\u54f2\u701a","\u946b\u9e4f","\u660a\u5929","\u601d\u806a","\u5c55\u9e4f","\u7b11\u611a","\u5fd7\u5f3a","\u70ab\u660e","\u96ea\u677e","\u601d\u6e90","\u667a\u6e0a","\u601d\u6dfc","\u6653\u5578","\u5929\u5b87","\u6d69\u7136","\u6587\u8f69","\u9e6d\u6d0b","\u632f\u5bb6","\u4e50\u9a79","\u6653\u535a","\u6587\u535a","\u660a\u7131","\u7acb\u679c","\u91d1\u946b","\u9526\u7a0b","\u5609\u7199","\u9e4f\u98de","\u5b50\u9ed8","\u601d\u8fdc","\u6d69\u8f69","\u8bed\u5802","\u806a\u5065","\u660e","\u6587","\u679c","\u601d","\u9e4f","\u9a70","\u6d9b","\u742a","\u6d69","\u822a","\u5f6c"],"name":["#{first_name}#{last_name}"]},"phone_number":{"formats":["###-########","####-########","###########"]}}},"en-GB":{"faker":{"address":{"postcode":"/[A-PR-UWYZ][A-HK-Y]?[0-9][ABEHMNPRVWXY0-9]? [0-9][ABD-HJLN-UW-Z]{2}/","county":["Avon","Bedfordshire","Berkshire","Borders","Buckinghamshire","Cambridgeshire","Central","Cheshire","Cleveland","Clwyd","Cornwall","County Antrim","County Armagh","County Down","County Fermanagh","County Londonderry","County Tyrone","Cumbria","Derbyshire","Devon","Dorset","Dumfries and Galloway","Durham","Dyfed","East Sussex","Essex","Fife","Gloucestershire","Grampian","Greater Manchester","Gwent","Gwynedd County","Hampshire","Herefordshire","Hertfordshire","Highlands and Islands","Humberside","Isle of Wight","Kent","Lancashire","Leicestershire","Lincolnshire","Lothian","Merseyside","Mid Glamorgan","Norfolk","North Yorkshire","Northamptonshire","Northumberland","Nottinghamshire","Oxfordshire","Powys","Rutland","Shropshire","Somerset","South Glamorgan","South Yorkshire","Staffordshire","Strathclyde","Suffolk","Surrey","Tayside","Tyne and Wear","Warwickshire","West Glamorgan","West Midlands","West Sussex","West Yorkshire","Wiltshire","Worcestershire"],"uk_country":["England","Scotland","Wales","Northern Ireland"],"default_country":["England","Scotland","Wales","Northern Ireland"]},"internet":{"domain_suffix":["co.uk","com","biz","info","name"]},"phone_number":{"formats":["01#### #####","01### ######","01#1 ### ####","011# ### ####","02# #### ####","03## ### ####","055 #### ####","056 #### ####","0800 ### ####","08## ### ####","09## ### ####","016977 ####","01### #####","0500 ######","0800 ######"]},"cell_phone":{"formats":["074## ######","075## ######","076## ######","077## ######","078## ######","079## ######"]}}},"nb-NO":{"faker":{"address":{"city_root":["Fet","Gjes","H\u00f8y","Inn","Fager","Lille","Lo","Mal","Nord","N\u00e6r","Sand","Sme","Stav","Stor","Tand","Ut","Vest"],"city_suffix":["berg","borg","by","b\u00f8","dal","eid","fjell","fjord","foss","grunn","hamn","havn","helle","mark","nes","odden","sand","sj\u00f8en","stad","strand","str\u00f8m","sund","vik","v\u00e6r","v\u00e5g","\u00f8","\u00f8y","\u00e5s"],"street_prefix":["\u00d8vre","Nedre","S\u00f8ndre","Gamle","\u00d8stre","Vestre"],"street_root":["Eike","Bj\u00f8rke","Gran","Vass","Furu","Litj","Lille","H\u00f8y","Fosse","Elve","Ku","Konvall","Soldugg","Hestemyr","Granitt","Hegge","Rogne","Fiol","Sol","Ting","Malm","Klokker","Preste","Dam","Geiterygg","Bekke","Berg","Kirke","Kors","Bru","Bl\u00e5veis","Torg","Sj\u00f8"],"street_suffix":["all\u00e9en","bakken","berget","br\u00e5ten","eggen","engen","ekra","faret","flata","gata","gjerdet","grenda","gropa","hagen","haugen","havna","holtet","h\u00f8gda","jordet","kollen","kroken","lia","lunden","lyngen","l\u00f8kka","marka","moen","myra","plassen","ringen","roa","r\u00f8a","skogen","skrenten","spranget","stien","stranda","stubben","stykket","svingen","tjernet","toppen","tunet","vollen","vika","\u00e5sen"],"common_street_suffix":["sgate","svei","s Gate","s Vei","gata","veien"],"building_number":["#","##"],"secondary_address":["Leil. ###","Oppgang A","Oppgang B"],"postcode":["####","####","####","0###"],"state":[""],"city":["#{city_root}#{city_suffix}"],"street_name":["#{street_root}#{street_suffix}","#{street_prefix} #{street_root}#{street_suffix}","#{Name.first_name}#{common_street_suffix}","#{Name.last_name}#{common_street_suffix}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Norge"]},"company":{"suffix":["Gruppen","AS","ASA","BA","RFH","og S\u00f8nner"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} og #{Name.last_name}"]},"internet":{"domain_suffix":["no","com","net","org"]},"name":{"first_name":["Emma","Sara","Thea","Ida","Julie","Nora","Emilie","Ingrid","Hanna","Maria","Sofie","Anna","Malin","Amalie","Vilde","Frida","Andrea","Tuva","Victoria","Mia","Karoline","Mathilde","Martine","Linnea","Marte","Hedda","Marie","Helene","Silje","Leah","Maja","Elise","Oda","Kristine","Aurora","Kaja","Camilla","Mari","Maren","Mina","Selma","Jenny","Celine","Eline","Sunniva","Natalie","Tiril","Synne","Sandra","Madeleine","Markus","Mathias","Kristian","Jonas","Andreas","Alexander","Martin","Sander","Daniel","Magnus","Henrik","Tobias","Kristoffer","Emil","Adrian","Sebastian","Marius","Elias","Fredrik","Thomas","Sondre","Benjamin","Jakob","Oliver","Lucas","Oskar","Nikolai","Filip","Mats","William","Erik","Simen","Ole","Eirik","Isak","Kasper","Noah","Lars","Joakim","Johannes","H\u00e5kon","Sindre","J\u00f8rgen","Herman","Anders","Jonathan","Even","Theodor","Mikkel","Aksel"],"feminine_name":["Emma","Sara","Thea","Ida","Julie","Nora","Emilie","Ingrid","Hanna","Maria","Sofie","Anna","Malin","Amalie","Vilde","Frida","Andrea","Tuva","Victoria","Mia","Karoline","Mathilde","Martine","Linnea","Marte","Hedda","Marie","Helene","Silje","Leah","Maja","Elise","Oda","Kristine","Aurora","Kaja","Camilla","Mari","Maren","Mina","Selma","Jenny","Celine","Eline","Sunniva","Natalie","Tiril","Synne","Sandra","Madeleine"],"masculine_name":["Markus","Mathias","Kristian","Jonas","Andreas","Alexander","Martin","Sander","Daniel","Magnus","Henrik","Tobias","Kristoffer","Emil","Adrian","Sebastian","Marius","Elias","Fredrik","Thomas","Sondre","Benjamin","Jakob","Oliver","Lucas","Oskar","Nikolai","Filip","Mats","William","Erik","Simen","Ole","Eirik","Isak","Kasper","Noah","Lars","Joakim","Johannes","H\u00e5kon","Sindre","J\u00f8rgen","Herman","Anders","Jonathan","Even","Theodor","Mikkel","Aksel"],"last_name":["Johansen","Hansen","Andersen","Kristiansen","Larsen","Olsen","Solberg","Andresen","Pedersen","Nilsen","Berg","Halvorsen","Karlsen","Svendsen","Jensen","Haugen","Martinsen","Eriksen","S\u00f8rensen","Johnsen","Myhrer","Johannessen","Nielsen","Hagen","Pettersen","Bakke","Skuterud","L\u00f8ken","Gundersen","Strand","J\u00f8rgensen","Kvarme","R\u00f8ed","S\u00e6ther","Stensrud","Moe","Kristoffersen","Jakobsen","Holm","Aas","Lie","Moen","Andreassen","Vedvik","Nguyen","Jacobsen","Torgersen","Ruud","Krogh","Christiansen","Bjerke","Aalerud","Borge","S\u00f8rlie","Berge","\u00d8stli","\u00d8deg\u00e5rd","Torp","Henriksen","Haukelids\u00e6ter","Fjeld","Danielsen","Aasen","Fredriksen","Dahl","Berntsen","Arnesen","Wold","Thoresen","Solheim","Skoglund","Bakken","Amundsen","Solli","Smogeli","Kristensen","Glosli","Fossum","Evensen","Eide","Carlsen","\u00d8stby","Vegge","Tangen","Smedsrud","Olstad","Lunde","Kleven","Huseby","Bj\u00f8rnstad","Ryan","Rasmussen","Nyg\u00e5rd","Nordskaug","Nordby","Mathisen","Hopland","Gran","Finstad","Edvardsen"],"prefix":["Dr.","Prof."],"suffix":["Jr.","Sr.","I","II","III","IV","V"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{feminine_name} #{feminine_name} #{last_name}","#{masculine_name} #{masculine_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["########","## ## ## ##","### ## ###","+47 ## ## ## ##"]}}},"pt-BR":{"faker":{"address":{"city_prefix":["Nova","Velha","Grande","Vila","Munic\u00edpio de"],"city_suffix":["do Descoberto","de Nossa Senhora","do Norte","do Sul"],"country":["Afeganist\u00e3o","Alb\u00e2nia","Alg\u00e9ria","Samoa","Andorra","Angola","Anguilla","Antigua and Barbada","Argentina","Arm\u00eania","Aruba","Austr\u00e1lia","\u00c1ustria","Alzerbaj\u00e3o","Bahamas","Bar\u00e9m","Bangladesh","Barbado","Belgrado","B\u00e9lgica","Belize","Benin","Bermuda","Bhutan","Bol\u00edvia","B\u00f4snia","Botuasuna","Bouvetoia","Brasil","Arquip\u00e9lago de Chagos","Ilhas Virgens","Brunei","Bulg\u00e1ria","Burkina Faso","Burundi","Camb\u00f3jia","Camar\u00f5es","Canad\u00e1","Cabo Verde","Ilhas Caiman","Rep\u00fablica da \u00c1frica Central","Chad","Chile","China","Ilhas Natal","Ilhas Cocos","Col\u00f4mbia","Comoros","Congo","Ilhas Cook","Costa Rica","Costa do Marfim","Cro\u00e1cia","Cuba","Cyprus","Rep\u00fablica Tcheca","Dinamarca","Djibouti","Dominica","Rep\u00fablica Dominicana","Equador","Egito","El Salvador","Guin\u00e9 Equatorial","Eritrea","Est\u00f4nia","Eti\u00f3pia","Ilhas Faroe","Malvinas","Fiji","Finl\u00e2ndia","Fran\u00e7a","Guin\u00e9 Francesa","Polin\u00e9sia Francesa","Gab\u00e3o","G\u00e2mbia","Georgia","Alemanha","Gana","Gibraltar","Gr\u00e9cia","Groel\u00e2ndia","Granada","Guadalupe","Guano","Guatemala","Guernsey","Guin\u00e9","Guin\u00e9-Bissau","Guiana","Haiti","Heard Island and McDonald Islands","Vaticano","Honduras","Hong Kong","Hungria","Iceland","\u00cdndia","Indon\u00e9sia","Ir\u00e3","Iraque","Irlanda","Ilha de Man","Israel","It\u00e1lia","Jamaica","Jap\u00e3o","Jersey","Jord\u00e2nia","Cazaquist\u00e3o","Qu\u00eania","Kiribati","Coreia do Norte","Coreia do Sul","Kuwait","Kyrgyz Republic","Rep\u00fablica Democr\u00e1tica de Lao People","Latvia","L\u00edbano","Lesotho","Lib\u00e9ria","Libyan Arab Jamahiriya","Liechtenstein","Litu\u00e2nia","Luxemburgo","Macao","Maced\u00f4nia","Madagascar","Malawi","Mal\u00e1sia","Maldives","Mali","Malta","Ilhas Marshall","Martinica","Maurit\u00e2nia","Mauritius","Mayotte","M\u00e9xico","Micron\u00e9sia","Moldova","M\u00f4naco","Mong\u00f3lia","Montenegro","Montserrat","Marrocos","Mo\u00e7ambique","Myanmar","Namibia","Nauru","Nepal","Antilhas Holandesas","Holanda","Nova Caledonia","Nova Zel\u00e2ndia","Nicar\u00e1gua","Nig\u00e9ria","Niue","Ilha Norfolk","Northern Mariana Islands","Noruega","Oman","Paquist\u00e3o","Palau","Territ\u00f3rio da Palestina","Panam\u00e1","Nova Guin\u00e9 Papua","Paraguai","Peru","Filipinas","Pol\u00f4nia","Portugal","Puerto Rico","Qatar","Rom\u00eania","R\u00fassia","Ruanda","S\u00e3o Bartolomeu","Santa Helena","Santa L\u00facia","Saint Martin","Saint Pierre and Miquelon","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tom\u00e9 e Pr\u00edncipe","Ar\u00e1bia Saudita","Senegal","S\u00e9rvia","Seychelles","Serra Leoa","Singapura","Eslov\u00e1quia","Eslov\u00eania","Ilhas Salom\u00e3o","Som\u00e1lia","\u00c1frica do Sul","South Georgia and the South Sandwich Islands","Spanha","Sri Lanka","Sud\u00e3o","Suriname","Svalbard & Jan Mayen Islands","Swaziland","Su\u00e9cia","Su\u00ed\u00e7a","S\u00edria","Taiwan","Tajiquist\u00e3o","Tanz\u00e2nia","Tail\u00e2ndia","Timor-Leste","Togo","Tokelau","Tonga","Trinid\u00e1 e Tobago","Tun\u00edsia","Turquia","Turcomenist\u00e3o","Turks and Caicos Islands","Tuvalu","Uganda","Ucr\u00e2nia","Emirados \u00c1rabes Unidos","Reino Unido","Estados Unidos da Am\u00e9rica","Estados Unidos das Ilhas Virgens","Uruguai","Uzbequist\u00e3o","Vanuatu","Venezuela","Vietn\u00e3","Wallis and Futuna","Sahara","Yemen","Z\u00e2mbia","Zimb\u00e1bue"],"building_number":["#####","####","###"],"street_suffix":["Rua","Avenida","Travessa","Ponte","Alameda","Marginal","Viela","Rodovia"],"secondary_address":["Apto. ###","Sobrado ##","Casa #","Lote ##","Quadra ##"],"postcode":["#####","#####-###"],"state":["Acre","Alagoas","Amap\u00e1","Amazonas","Bahia","Cear\u00e1","Distrito Federal","Esp\u00edrito Santo","Goi\u00e1s","Maranh\u00e3o","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Par\u00e1","Para\u00edba","Paran\u00e1","Pernambuco","Piau\u00ed","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rond\u00f4nia","Roraima","Santa Catarina","S\u00e3o Paulo","Sergipe","Tocantins"],"state_abbr":["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP"],"default_country":["Brasil"]},"company":{"suffix":["S.A.","LTDA","e Associados","Com\u00e9rcio"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} e #{Name.last_name}"]},"internet":{"free_email":["gmail.com","yahoo.com","hotmail.com","live.com","bol.com.br"],"domain_suffix":["br","com","biz","info","name","net","org"]},"lorem":{"words":["alias","consequatur","aut","perferendis","sit","voluptatem","accusantium","doloremque","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","et","quasi","architecto","beatae","vitae","dicta","sunt","explicabo","aspernatur","aut","odit","aut","fugit","sed","quia","consequuntur","magni","dolores","eos","qui","ratione","voluptatem","sequi","nesciunt","neque","dolorem","ipsum","quia","dolor","sit","amet","consectetur","adipisci","velit","sed","quia","non","numquam","eius","modi","tempora","incidunt","ut","labore","et","dolore","magnam","aliquam","quaerat","voluptatem","ut","enim","ad","minima","veniam","quis","nostrum","exercitationem","ullam","corporis","nemo","enim","ipsam","voluptatem","quia","voluptas","sit","suscipit","laboriosam","nisi","ut","aliquid","ex","ea","commodi","consequatur","quis","autem","vel","eum","iure","reprehenderit","qui","in","ea","voluptate","velit","esse","quam","nihil","molestiae","et","iusto","odio","dignissimos","ducimus","qui","blanditiis","praesentium","laudantium","totam","rem","voluptatum","deleniti","atque","corrupti","quos","dolores","et","quas","molestias","excepturi","sint","occaecati","cupiditate","non","provident","sed","ut","perspiciatis","unde","omnis","iste","natus","error","similique","sunt","in","culpa","qui","officia","deserunt","mollitia","animi","id","est","laborum","et","dolorum","fuga","et","harum","quidem","rerum","facilis","est","et","expedita","distinctio","nam","libero","tempore","cum","soluta","nobis","est","eligendi","optio","cumque","nihil","impedit","quo","porro","quisquam","est","qui","minus","id","quod","maxime","placeat","facere","possimus","omnis","voluptas","assumenda","est","omnis","dolor","repellendus","temporibus","autem","quibusdam","et","aut","consequatur","vel","illum","qui","dolorem","eum","fugiat","quo","voluptas","nulla","pariatur","at","vero","eos","et","accusamus","officiis","debitis","aut","rerum","necessitatibus","saepe","eveniet","ut","et","voluptates","repudiandae","sint","et","molestiae","non","recusandae","itaque","earum","rerum","hic","tenetur","a","sapiente","delectus","ut","aut","reiciendis","voluptatibus","maiores","doloribus","asperiores","repellat"]},"name":{"first_name":["Alessandro","Alessandra","Alexandre","Aline","Ant\u00f4nio","Breno","Bruna","Carlos","Carla","C\u00e9lia","Cec\u00edlia","C\u00e9sar","Danilo","Dalila","Deneval","Eduardo","Eduarda","Esther","El\u00edsio","F\u00e1bio","Fabr\u00edcio","Fabr\u00edcia","F\u00e9lix","Fel\u00edcia","Feliciano","Frederico","Fabiano","Gustavo","Guilherme","G\u00fabio","Heitor","H\u00e9lio","Hugo","Isabel","Isabela","\u00cdgor","Jo\u00e3o","Joana","J\u00falio C\u00e9sar","J\u00falio","J\u00falia","Jana\u00edna","Karla","Kl\u00e9ber","Lucas","Lorena","Lorraine","Larissa","Ladislau","Marcos","Meire","Marcelo","Marcela","Margarida","M\u00e9rcia","M\u00e1rcia","Marli","Morgana","Maria","Norberto","Nat\u00e1lia","Nataniel","N\u00fabia","Of\u00e9lia","Paulo","Paula","Pablo","Pedro","Raul","Rafael","Rafaela","Ricardo","Roberto","Roberta","S\u00edlvia","S\u00edlvia","Silas","Su\u00e9len","Sara","Salvador","Sirineu","Talita","Tertuliano","Vicente","V\u00edctor","Vit\u00f3ria","Yango","Yago","Yuri","Washington","Warley"],"last_name":["Silva","Souza","Carvalho","Santos","Reis","Xavier","Franco","Braga","Macedo","Batista","Barros","Moraes","Costa","Pereira","Carvalho","Melo","Saraiva","Nogueira","Oliveira","Martins","Moreira","Albuquerque"],"prefix":["Sr.","Sra.","Srta.","Dr."],"suffix":["Jr.","Neto","Filho"]},"phone_number":{"formats":["(##) ####-####","+55 (##) ####-####","(##) #####-####"]}}},"is":{"faker":{"address":{"city_root":["Fet","Gjes","H\u00f8y","Inn","Fager","Lille","Lo","Mal","Nord","N\u00e6r","Sand","Sme","Stav","Stor","Tand","Ut","Vest"],"city_suffix":["berg","borg","by","b\u00f8","dal","eid","fjell","fjord","foss","grunn","hamn","havn","helle","mark","nes","odden","sand","sj\u00f8en","stad","strand","str\u00f8m","sund","vik","v\u00e6r","v\u00e5g","\u00f8","\u00f8y","\u00e5s"],"street_prefix":["\u00d8vre","Nedre","S\u00f8ndre","Gamle","\u00d8stre","Vestre"],"street_root":["Eike","Bj\u00f8rke","Gran","Vass","Furu","Litj","Lille","H\u00f8y","Fosse","Elve","Ku","Konvall","Soldugg","Hestemyr","Granitt","Hegge","Rogne","Fiol","Sol","Ting","Malm","Klokker","Preste","Dam","Geiterygg","Bekke","Berg","Kirke","Kors","Bru","Bl\u00e5veis","Torg","Sj\u00f8"],"street_suffix":["all\u00e9en","bakken","berget","br\u00e5ten","eggen","engen","ekra","faret","flata","gata","gjerdet","grenda","gropa","hagen","haugen","havna","holtet","h\u00f8gda","jordet","kollen","kroken","lia","lunden","lyngen","l\u00f8kka","marka","moen","myra","plassen","ringen","roa","r\u00f8a","skogen","skrenten","spranget","stien","stranda","stubben","stykket","svingen","tjernet","toppen","tunet","vollen","vika","\u00e5sen"],"common_street_suffix":["sgate","svei","s Gate","s Vei","gata","veien"],"building_number":["#","##"],"secondary_address":["Leil. ###","Oppgang A","Oppgang B"],"postcode":["####","####","####","0###"],"state":[""],"city":["#{city_root}#{city_suffix}"],"street_name":["#{street_root}#{street_suffix}","#{street_prefix} #{street_root}#{street_suffix}","#{Name.first_name}#{common_street_suffix}","#{Name.last_name}#{common_street_suffix}"],"street_address":["#{street_name} #{building_number}"],"default_country":["Norge"]},"company":{"suffix":["Gruppen","AS","ASA","BA","RFH","og S\u00f8nner"],"name":["#{Name.last_name} #{suffix}","#{Name.last_name}-#{Name.last_name}","#{Name.last_name}, #{Name.last_name} og #{Name.last_name}"]},"internet":{"domain_suffix":["no","com","net","org"]},"name":{"first_name":["Emma","Sara"],"female_first_name":["Emma","Sara","Gu\u00f0r\u00fan","B\u00e1ra","Hafr\u00fan","Sigr\u00fan","Helena","Mar\u00eda","Sn\u00e6d\u00eds","Soff\u00eda","Sandra","Anna","Margr\u00e9t","Arna","Hildur","Hei\u00f0a","Halla","Agnes","Victor\u00eda","Au\u00f0ur","\u00c1rn\u00fd","Mathildur","Marta","Linda","\u00c1sa","Hedda","\u00c1sd\u00eds","Hugr\u00fan","Silja","Lilja","Begga","Berg\u00fe\u00f3ra","Birta","Bjargey","Aurora","Berglind","Kamilla","Birna","Maren","Selma","Bj\u00f6rg","D\u00f3ra","Dan\u00edella","El\u00edn","Kr\u00edst\u00edn","El\u00ednborg","Eva","Eygl\u00f3","Ester","Fj\u00f3la","Fanney","Fri\u00f0leif","Fr\u00ed\u00f0a","Ger\u00f0ur","Gr\u00e9ta","Gu\u00f0d\u00eds","Gunnur","Hanna","Hei\u00f0bj\u00f6rg","Hera","Hilda","Hj\u00f6rd\u00eds","J\u00f3d\u00eds","J\u00fal\u00eda","Jenn\u00fd","J\u00f3n\u00edna","J\u00f3hanna","Karen","Kidd\u00fd","Klara","Kata","L\u00e1ra","Lena","L\u00edsbet","Lea","L\u00f3a","\u00d3sk","Olga","Oddn\u00fd","P\u00e1la","R\u00e1n","R\u00f3sa","Rakel","Rebekka","Saga","Sif","Sign\u00fd","Svand\u00eds","Svala","Tinna","Unnur","Ur\u00f0ur"],"male_first_name":["Adam","A\u00f0albj\u00f6rn","Albert","Axel","\u00c1g\u00fast","Baldur","Benedikt","Baldvin","Birkir","Bj\u00f6rn","Dav\u00ed\u00f0","Dan\u00edel","Einar","Ey\u00fe\u00f3r","Fri\u00f0rik","Gar\u00f0ar","Geir","Gu\u00f0j\u00f3n","Gunnar","G\u00fastaf","Halld\u00f3r","Haf\u00fe\u00f3r","Hannes","Harald","Hei\u00f0ar","Heimir","\u00cdsak","Ingvar","\u00cdvar","Jens","Jakob","J\u00f3sef","J\u00fal\u00edus","J\u00f3n","J\u00f3hann","J\u00f3hannes","Karl","Kjartan","Kr\u00edstj\u00e1n","L\u00e1rus","L\u00fakas","Magn\u00fas","Margeir","Mar\u00edn\u00f3","Mark\u00fas","Matt\u00edas","\u00d3mar","\u00d3skar","P\u00e9tur","Ragnar","Reynir","R\u00fanar","Sam\u00fael","Sigurj\u00f3n","Sn\u00e6var","Sn\u00e6\u00fe\u00f3r","Stef\u00e1n","Steinar","Sverrir","S\u00e6var","T\u00f3mas","Unnar","Valdimar","Vi\u00f0ar","Vigf\u00fas","Victor","Vilhelm","\u00de\u00f3r"],"last_name":["Johansen","Hansen","Andersen","Kristiansen"],"prefix":["Dr.","Prof."],"suffix":["Jr.","Sr.","I","II","III","IV","V"],"name":["#{prefix} #{first_name} #{last_name}","#{first_name} #{last_name} #{suffix}","#{feminine_name} #{feminine_name} #{last_name}","#{masculine_name} #{masculine_name} #{last_name}","#{first_name} #{last_name} #{last_name}","#{first_name} #{last_name}"]},"phone_number":{"formats":["########","## ## ## ##","### ## ###","+47 ## ## ## ##"]}},"surveyor":{"take_these_surveys":"Velja spurningalista","take_it":"Fylla \u00fat spurningalista","completed_survey":"Sv\u00f6r hafa veri\u00f0 send","unable_to_find_your_responses":"Finn ekki ni\u00f0urst\u00f6\u00f0ur","unable_to_update_survey":"Ekki h\u00e6gt a\u00f0 uppf\u00e6ra sv\u00f6r","unable_to_find_that_survey":"Spurningalisti finnst ekki","survey_started_success":"H\u00e9r er byrja\u00f0 a\u00f0 svara spurningu","click_here_to_finish":"Kl\u00e1ra","previous_section":"&laquo; Previous section","next_section":"Next section &raquo;","select_one":"Select one ...","sections":"Sections"},"surveys":{"dass":{"name":"DASS","questions":[null,"\u00c9g komst \u00ed uppn\u00e1m yfir hreinum sm\u00e1munum.","\u00c9g fann fyrir munn\u00feurrki.","\u00c9g virtist alls ekki geta fundi\u00f0 fyrir neinum g\u00f3\u00f0um tilfinningum.","\u00c9g \u00e1tti \u00ed erfi\u00f0leikum me\u00f0 a\u00f0 anda (t.d. allt of hr\u00f6\u00f0 \u00f6ndun, m\u00e6\u00f0i \u00e1n l\u00edkamlegrar \u00e1reynslu).","\u00c9g gat ekki byrja\u00f0 \u00e1 neinu.","\u00c9g haf\u00f0i tilhneigingu til a\u00f0 breg\u00f0ast of harkalega vi\u00f0 a\u00f0st\u00e6\u00f0um.","M\u00e9r fannst \u00e9g vera \u00f3styrk(ur) (t.d. a\u00f0 f\u00e6turnir v\u00e6ru a\u00f0 gefa sig).","M\u00e9r fannst erfitt a\u00f0 slappa af.","\u00c9g lenti \u00ed a\u00f0st\u00e6\u00f0um sem ger\u00f0u mig svo kv\u00ed\u00f0na/kv\u00ed\u00f0inn a\u00f0 m\u00e9r l\u00e9tti st\u00f3rum \u00feegar \u00feeim lauk.","M\u00e9r fannst \u00e9g ekki geta hlakka\u00f0 til neins.","\u00c9g komst au\u00f0veldlega \u00ed uppn\u00e1m.","M\u00e9r fannst \u00e9g ey\u00f0a mikilli andlegri orku.","\u00c9g var hrygg/hryggur og \u00feunglynd(ur).","\u00c9g var\u00f0 \u00f3\u00feolinm\u00f3\u00f0(ur) ef eitthva\u00f0 l\u00e9t \u00e1 s\u00e9r standa (t.d. lyftur, umfer\u00f0arlj\u00f3s, \u00e9g l\u00e1tin(n) b\u00ed\u00f0a).","M\u00e9r fannst \u00fea\u00f0 \u00e6tla\u00f0i a\u00f0 l\u00ed\u00f0a yfir mig.","M\u00e9r fannst \u00e9g hafa misst \u00e1huga \u00e1 n\u00e6stum \u00f6llu.","M\u00e9r fannst \u00e9g ekki vera mikils vir\u00f0 i sem manneskja.","M\u00e9r fannst \u00e9g frekar h\u00f6runds\u00e1r.","\u00c9g svitna\u00f0i t\u00f6luvert (t.d. sviti \u00ed l\u00f3fum) \u00fe\u00f3 \u00fea\u00f0 v\u00e6ri ekki heitt og \u00e9g hafi ekki reynt miki\u00f0 \u00e1 mig.","\u00c9g fann fyrir \u00f3tta \u00e1n nokkurrar skynsamlegrar \u00e1st\u00e6\u00f0u.","M\u00e9r fannst l\u00edfi\u00f0 varla \u00feess vir\u00f0i a\u00f0 lifa \u00fev\u00ed.","M\u00e9r fannst erfitt a\u00f0 n\u00e1 m\u00e9r ni\u00f0ur.","\u00c9g \u00e1tti erfitt me\u00f0 a\u00f0 kyngja.","\u00c9g virtist ekki geta haft neina \u00e1n\u00e6gju af \u00fev\u00ed sem \u00e9g var a\u00f0 gera.","\u00c9g var\u00f0 var vi\u00f0 hjartsl\u00e1ttinn \u00ed m\u00e9r \u00fe\u00f3 \u00e9g hef\u00f0i ekki reynt \u00e1 mig (t.d.hra\u00f0ari hjartsl\u00e1ttur, hjarta\u00f0 sleppti \u00far slagi).","\u00c9g var dapur/d\u00f6pur og ni\u00f0urdregin(n).","M\u00e9r fannst \u00e9g vera mj\u00f6g pirru\u00f0/pirra\u00f0ur.","M\u00e9r fannst \u00e9g n\u00e1nast gripin(n) skelfingu.","M\u00e9r fannst erfitt a\u00f0 r\u00f3a mig eftir a\u00f0 eitthva\u00f0 kom m\u00e9r \u00ed uppn\u00e1m.","\u00c9g var hr\u00e6dd(ur) um a\u00f0 \u201eklikka \u00e1\u201c sm\u00e1v\u00e6gilegu verki sem \u00e9g var ekki kunnug(ur).","\u00c9g gat ekki fengi\u00f0 brennandi \u00e1huga \u00e1 neinu.","\u00c9g \u00e1tti erfitt me\u00f0 a\u00f0 umbera truflanir \u00e1 \u00fev\u00ed sem \u00e9g var a\u00f0 gera.","\u00c9g var spennt(ur) \u00e1 taugum.","M\u00e9r fannst \u00e9g n\u00e1nast einskis vir\u00f0i.","\u00c9g \u00feoldi ekki \u00feegar eitthva\u00f0 kom \u00ed veg fyrir a\u00f0 \u00e9g h\u00e9ldi \u00e1fram vi\u00f0 \u00fea\u00f0 sem \u00e9g var a\u00f0 gera.","\u00c9g var \u00f3ttaslegin(n).","\u00c9g s\u00e1 ekkert \u00ed framt\u00ed\u00f0inni sem gaf m\u00e9r von.","M\u00e9r fannst l\u00edfi\u00f0 vera tilgangslaust.","\u00c9g var ergileg(ur).","\u00c9g haf\u00f0i \u00e1hyggjur af a\u00f0st\u00e6\u00f0um \u00fear sem \u00e9g fengi hr\u00e6\u00f0slukast (panik) og ger\u00f0i mig a\u00f0 f\u00edfli.","\u00c9g fann fyrir skj\u00e1lfta (t.d. \u00ed h\u00f6ndum).","M\u00e9r fannst erfitt a\u00f0 hleypa \u00ed mig krafti til a\u00f0 gera hluti."],"answers":["\u00c1tti alls ekki vi\u00f0 mig","\u00c1tti vi\u00f0 mig a\u00f0 einhverju leyti e\u00f0a stundum","\u00c1tti t\u00f6luvert vel vi\u00f0 mig e\u00f0a drj\u00fagan hluta vikunnar","\u00c1tti mj\u00f6g vel vi\u00f0 mig e\u00f0a mest allan t\u00edmann"],"terms":{"depression":"\u00feunglyndi","stress":"streitu","anxiety":"kv\u00ed\u00f0i","normal":"undir m\u00f6rkum","moderate":"me\u00f0allagi","severe":"alvarleg","extremely_severe":"afar alvarleg"}},"ysr-syndrome-scale":{"name":"Sj\u00e1lfsmatslisti(YSR)","terms":{"clinical":"yfir m\u00f6rkum","borderline":"ja\u00f0arsv\u00e6\u00f0i","raw_score_mean":"me\u00f0altal","other_problems":"\u00f6nnur vandam\u00e1l","aggressive_behaviour":"\u00e1r\u00e1sagirni","rule_breaking_behaviour":"\u00f3hl\u00fd\u00f0ni","attention_problems":"einbeitingarvandi","thought_problems":"hugsun","somatic_complaints":"l\u00edkamleg vanl\u00ed\u00f0an","withdrawn_or_depressed":"hl\u00e9dr\u00e6gni/ \u00feunglyndi","anxious_or_depressed":"kv\u00ed\u00f0i/ depur\u00f0","social_problems":"f\u00e9lagsvandi","externalizing":"heg\u00f0un, ytri \u00fe\u00e6ttir","internalizing":"innri l\u00ed\u00f0an","total":"heildarvandi","describe":"lystu"},"questions":[null,"\u00c9g haga m\u00e9r barnalega mi\u00f0a\u00f0 vi\u00f0 aldur","\u00c9g drekk \u00e1fengi \u00e1n sam\u00feykkis foreldra (l\u00fdstu)","\u00c9g r\u00edfst miki\u00f0","\u00c9g kl\u00e1ra ekki verkefni sem \u00e9g byrja \u00e1","\u00dea\u00f0 er f\u00e1tt sem \u00e9g hef \u00e1n\u00e6gju af","M\u00e9r \u00feykir v\u00e6nt um d\u00fdr","\u00c9g er montin(n), sj\u00e1lfh\u00e6lin(n)","\u00c9g \u00e1 erfitt me\u00f0 a\u00f0 einbeita m\u00e9r, e\u00f0a fylgjast me\u00f0","\u00c9g get ekki h\u00e6tt a\u00f0 hugsa \u00e1kve\u00f0nar hugsanir /\u00fer\u00e1hyggja (l\u00fdstu)","\u00c9g \u00e1 erfitt me\u00f0 a\u00f0 sitja kyrr","\u00c9g er of h\u00e1\u00f0(ur) fullor\u00f0num","M\u00e9r finnst \u00e9g einmana","M\u00e9r finnst \u00e9g vera ruglu\u00f0/rugla\u00f0ur e\u00f0a r\u00e1\u00f0villt(ur)","\u00c9g gr\u00e6t miki\u00f0","\u00c9g er nokku\u00f0 hei\u00f0arleg(ur)","\u00c9g er vondur vi\u00f0 a\u00f0ra","Mig dreymir oft dagdrauma","\u00c9g mei\u00f0i mig viljandi og reyni a\u00f0 fyrirfara m\u00e9r","\u00c9g reyni a\u00f0 vekja \u00e1 m\u00e9r athygli","\u00c9g ey\u00f0ilegg eigin eigur","\u00c9g ey\u00f0ilegg eigur annarra","\u00c9g hl\u00fd\u00f0i ekki foreldrum m\u00ednum","\u00c9g er \u00f3hl\u00fd\u00f0in(n) \u00ed sk\u00f3la","\u00c9g bor\u00f0a ekki eins miki\u00f0 og \u00e9g \u00e6tti a\u00f0 gera","M\u00e9r semur illa vi\u00f0 \u00f6nnur b\u00f6rn","\u00c9g finn ekki til sektarkenndar eftir a\u00f0 hafa gert eitthva\u00f0 sem \u00e9g \u00e6tti ekki a\u00f0 gera","\u00c9g er afbr\u00fd\u00f0issamur(s\u00f6m) \u00fat\u00ed a\u00f0ra","\u00c9g br\u00fdt reglur heimilisins, sk\u00f3la e\u00f0a annars sta\u00f0ar","\u00c9g hr\u00e6\u00f0ist sum d\u00fdr, a\u00f0st\u00e6\u00f0ur e\u00f0a sta\u00f0i anna\u00f0 en sk\u00f3la (l\u00fdstu)","\u00c9g \u00f3ttast a\u00f0 fara \u00ed sk\u00f3la","\u00c9g \u00f3ttast a\u00f0 hugsa e\u00f0a gera eitthva\u00f0 sl\u00e6mt","M\u00e9r finnst \u00e9g \u00feurfi a\u00f0 vera fullkomin(n)","M\u00e9r finnst engum \u00feykja v\u00e6nt um mig","M\u00e9r finnst a\u00f0rir ofs\u00e6kja mig","M\u00e9r finnst \u00e9g minna vir\u00f0i e\u00f0a verri en a\u00f0rir","\u00c9g mei\u00f0i mig oft af slysni","\u00c9g lendi oft \u00ed slagsm\u00e1lum","M\u00e9r er miki\u00f0 str\u00edtt","\u00c9g er miki\u00f0 me\u00f0 kr\u00f6kkum sem lenda \u00ed vandr\u00e6\u00f0um","\u00c9g heyri oft hlj\u00f3\u00f0 e\u00f0a raddir sem a\u00f0rir vir\u00f0ast ekki heyra (l\u00fdstu)","\u00c9g geri oft hluti \u00e1n \u00feess a\u00f0 hugsa","\u00c9g vil frekar vera ein(n) en me\u00f0 \u00f6\u00f0rum","\u00c9g l\u00fdg e\u00f0a svindla","\u00c9g naga neglur","\u00c9g er tauga\u00f3styrk(ur) e\u00f0a spennt(ur)","Hlutar l\u00edkama m\u00edns kippast til e\u00f0a \u00e9g f\u00e6 taugaviprur/k\u00e6ki (l\u00fdstu)","\u00c9g f\u00e6 martra\u00f0ir","\u00d6\u00f0rum kr\u00f6kkum l\u00edkar ekki vi\u00f0 mig","Suma hluti get \u00e9g gert betur en flestir krakkar","\u00c9g er of hr\u00e6dd(ur) e\u00f0a kv\u00ed\u00f0in(n)","\u00c9g f\u00e6 svima","\u00c9g hef of mikla sektarkennd","\u00c9g bor\u00f0a of miki\u00f0","\u00c9g finn fyrir of\u00fereytu","\u00c9g er of feit(ur)",{"header":"L\u00edkamleg vandam\u00e1l \u00e1n l\u00e6knisfr\u00e6\u00f0ilegra sk\u00fdringa","subquestions":["a) S\u00e1rsauki og verkir (ekki maga- e\u00f0a h\u00f6fu\u00f0verkur)","b) H\u00f6fu\u00f0verkur","c) \u00d3gle\u00f0i, fl\u00f6kurleiki","d) Vandam\u00e1l me\u00f0 augu (sem gleraugu laga ekki, l\u00fdstu)","e) \u00datbrot e\u00f0a \u00f6nnur h\u00fa\u00f0vandam\u00e1l","f) Magaverkir e\u00f0a magakrampar","g) Uppk\u00f6st","h) Anna\u00f0 (l\u00fdstu)"]},"\u00c9g r\u00e6\u00f0st (l\u00edkamlega) \u00e1 anna\u00f0 f\u00f3lk","\u00c9g kroppa \u00ed h\u00fa\u00f0 e\u00f0a a\u00f0ra l\u00edkamshluta (l\u00fdstu)","\u00c9g get veri\u00f0 vingjarnleg(ur)","M\u00e9r finnst gaman a\u00f0 reyna eitthva\u00f0 n\u00fdtt","M\u00e9r gengur illa \u00ed n\u00e1mi","\u00c9g hef l\u00e9lega samh\u00e6fingu hreyfinga e\u00f0a er klaufaleg(ur)","\u00c9g myndi frekar vilja vera me\u00f0 eldri kr\u00f6kkum en jafn\u00f6ldrum m\u00ednum","\u00c9g myndi frekar vilja vera me\u00f0 yngri kr\u00f6kkum en jafn\u00f6ldrum m\u00ednum","\u00c9g neita a\u00f0 tala","\u00c9g endurtek \u00e1kve\u00f0nar athafnir aftur og aftur, (l\u00fdstu)","\u00c9g str\u00fdk a\u00f0 heiman","\u00c9g \u00f6skra miki\u00f0","\u00c9g er dul(ur) og pukrast me\u00f0 hlutina","\u00c9g s\u00e9 hluti sem a\u00f0rir vir\u00f0ast ekki geta s\u00e9\u00f0 (l\u00fdstu)","\u00c9g er feimin(n), fer au\u00f0veldlega hj\u00e1 m\u00e9r","\u00c9g kveiki \u00ed","\u00c9g \u00e1 au\u00f0velt me\u00f0 a\u00f0 gera hluti \u00ed h\u00f6ndunum","\u00c9g f\u00edflast e\u00f0a leik tr\u00fa\u00f0 til a\u00f0 n\u00e1 athygli","\u00c9g er of feimin(n)","\u00c9g sef minna en flestir krakkar","\u00c9g sef meira en flestir a\u00f0rir \u00e1 daginn og/e\u00f0a n\u00f3ttunni (l\u00fdstu)","\u00c9g \u00e1 erfitt me\u00f0 a\u00f0 einbeita m\u00e9r og missi au\u00f0veldlega einbeitinguna","\u00c9g \u00e1 \u00ed m\u00e1l- e\u00f0a tal\u00f6r\u00f0ugleikum (l\u00fdstu)","\u00c9g stend \u00e1 r\u00e9tti m\u00ednum","\u00c9g stel heima hj\u00e1 m\u00e9r","\u00c9g stel \u00e1 st\u00f6\u00f0um utan heimilis (l\u00fdstu)","\u00c9g safna a\u00f0 m\u00e9r drasli sem \u00e9g hef enga \u00fe\u00f6rf fyrir (l\u00fdstu)","\u00c9g geri hluti sem \u00f6\u00f0ru f\u00f3lki \u00feykja undarlegir (l\u00fdstu)","\u00c9g hugsa um \u00fdmislegt sem \u00f6\u00f0ru f\u00f3lki finnst undarlegt (l\u00fdstu)","\u00c9g er \u00ferj\u00f3sk(ur)","Skap mitt og l\u00ed\u00f0an geta breyst skyndilega","\u00c9g hef gaman af a\u00f0 vera me\u00f0 \u00f6\u00f0ru f\u00f3lki","\u00c9g er tortryggin(n)","\u00c9g bl\u00f3ta e\u00f0a kl\u00e6mist","\u00c9g hugsa um a\u00f0 svipta mig l\u00edfi","\u00c9g hef gaman af \u00fev\u00ed a\u00f0 koma \u00f6\u00f0rum til a\u00f0 hl\u00e6ja","\u00c9g tala of miki\u00f0","\u00c9g er mj\u00f6g str\u00ed\u00f0in(n)","\u00c9g er skapbr\u00e1\u00f0(ur)","\u00c9g hugsa of miki\u00f0 um kynfer\u00f0ism\u00e1l","\u00c9g h\u00f3ta a\u00f0 mei\u00f0a f\u00f3lk","M\u00e9r finnst gaman a\u00f0 hj\u00e1lpa \u00f6\u00f0rum","\u00c9g reyki, nota munn- e\u00f0a neft\u00f3bak","\u00c9g \u00e1 erfitt me\u00f0 svefn (l\u00fdstu)","\u00c9g skr\u00f3pa \u00ed sk\u00f3la e\u00f0a sleppi \u00far t\u00edmum","Mig skortir \u00ferek","\u00c9g er \u00f3hamingjus\u00f6m(samur), hrygg(ur), \u00feunglynd(ur)","\u00c9g er h\u00e1v\u00e6rari en a\u00f0rir krakkar","\u00c9g nota eiturlyf e\u00f0a lyf vegna annars en sj\u00fakd\u00f3ms (teldu ekki me\u00f0 \u00e1fengi e\u00f0a t\u00f3bak) (l\u00fdstu)","\u00c9g reyni a\u00f0 vera sanngj\u00f6rn(gjarn) vi\u00f0 a\u00f0ra","\u00c9g hef gaman af g\u00f3\u00f0um br\u00f6ndurum","\u00c9g tek l\u00edfinu l\u00e9tt","\u00c9g reyni a\u00f0 hj\u00e1lpa \u00f6\u00f0ru f\u00f3lki \u00feegar \u00e9g get","\u00c9g vildi \u00f3ska a\u00f0 \u00e9g v\u00e6ri af gagnst\u00e6\u00f0u kyni","\u00c9g for\u00f0ast a\u00f0 komast \u00ed kynni vi\u00f0 anna\u00f0 f\u00f3lk","\u00c9g er oft \u00e1hyggjufull(ur)"],"answers":["Ekki r\u00e9tt","Stundum r\u00e9tt","Oft r\u00e9tt","Lystu"]},"adhd-rating-scale":{"age":"Aldur","name":"ADHD M\u00e6likvar\u00f0i","terms":{"average":"me\u00f0altal","inattention":"athyglisbrestur","impulsivity_hyperactivity":"ofvirkni/hvatv\u00edsi","total":"heildarskor","standard_deviation_from_average":"s fr\u00e1 m","age":"Veldu aldur"},"questions":[null,"Hugar illa a\u00f0 sm\u00e1atri\u00f0um og gerir flj\u00f3tf\u00e6rnislegar villur \u00e1 sk\u00f3laverkefnum.","Er miki\u00f0 me\u00f0 hendur og f\u00e6tur \u00e1 hreyfingu e\u00f0a i\u00f0ar \u00ed s\u00e6ti.","\u00c1 erfitt me\u00f0 a\u00f0 halda athygli vakandi vi\u00f0 verkefni e\u00f0a leiki.","Yfirgefur s\u00e6ti \u00ed sk\u00f3lastofu e\u00f0a vi\u00f0 a\u00f0rar a\u00f0st\u00e6\u00f0ur \u00fear sem \u00e6tlast er til a\u00f0 seti\u00f0 s\u00e9 kyrr.","Vir\u00f0ist ekki hlusta \u00feegar tala\u00f0 er beint til hans/hennar.","Hleypur um e\u00f0a pr\u00edlar \u00f3h\u00f3flega vi\u00f0 a\u00f0st\u00e6\u00f0ur \u00fear sem sl\u00edkt \u00e1 ekki vi\u00f0.","Fylgir oft ekki fyrirm\u00e6lum til enda og l\u00fdkur ekki vi\u00f0 verkefni.","\u00c1 erfitt me\u00f0 a\u00f0 vera hlj\u00f3\u00f0/ur vi\u00f0 leik e\u00f0a t\u00f3mstundastarf.","\u00c1 erfitt me\u00f0 a\u00f0 skipuleggja verkefni s\u00edn og athafnir.","Er \u00e1 \u201cfleygifer\u00f0\u201d e\u00f0a er \u201ceins og \u00feeytispjald\u201d.","For\u00f0ast vi\u00f0fangsefni (t.d. heiman\u00e1m og verkefni \u00ed sk\u00f3la) sem krefjast mikillar beitingar hugans.","Talar \u00f3h\u00f3flega miki\u00f0.","T\u00fdnir hlutum sem hann/h\u00fan \u00fearf \u00e1 a\u00f0 halda til verkefna sinna e\u00f0a athafna.","Gr\u00edpur fram \u00ed me\u00f0 svari \u00e1\u00f0ur en spurningu er loki\u00f0.","Truflast au\u00f0veldlega af utana\u00f0komandi \u00e1reitum.","\u00c1 erfitt me\u00f0 a\u00f0 b\u00ed\u00f0a eftir a\u00f0 r\u00f6\u00f0in komi a\u00f0 honum/henni.","Er gleymin/n \u00ed ath\u00f6fnum daglegs l\u00edfs.","Gr\u00edpur fram \u00ed e\u00f0a ry\u00f0st inn \u00ed (samr\u00e6\u00f0ur e\u00f0a leiki)."],"answers":["aldrei/sjaldan","stundum","oft","mj\u00f6g oft"]},"terms":{"age":"\u00e1ra","male":"drengir","female":"st\u00falkur","average":"Me\u00f0altal","standard_deviation":"Sta\u00f0alfr\u00e1vik","respondent":{"parent":"foreldri","teacher":"kennari"},"norm_reference":{"title":"vi\u00f0mi\u00f0","group":"samanbur\u00f0arh\u00f3pur","teacher":"kennaramat","parent":"foreldramat"}},"respondent_registration":{"name":"Grunnupl\u00fdsingar"},"messages":{"question_list_failed":"questions for %{name} list failed","charts_not_found":"could not get charts"},"sdq":{"name":"Spurningar um styrk og vanda (SDQ)","terms":{"normal":"undir m\u00f6rkum","borderline":"ja\u00f0arsv\u00e6\u00f0i","abnormal":"yfir m\u00f6rkum","emotional":"tilfinningavandi","conduct":"heg\u00f0unarvandi","hyperactivity_inattention":"ofvirkni","peer_problem":"samskiptavandi","prosocial_behaviour":"f\u00e9lagsh\u00e6fni","total":"heildarvandi","impact_supplement":"vi\u00f0b\u00f3tarspurningar"},"questions":[null,"Tekur tillit til tilfinninga annarra","Eir\u00f0arlaus, ofvirk/ur, getur ekki veri\u00f0 kyrr lengi","Kvartar oft um h\u00f6fu\u00f0verk, magaverk e\u00f0a fl\u00f6kurleika","Deilir grei\u00f0lega me\u00f0 \u00f6\u00f0rum b\u00f6rnum (nammi, d\u00f3ti, bl\u00fd\u00f6ntum o.s.frv.)","F\u00e6r oft skapofsak\u00f6st e\u00f0a er heitt \u00ed hamsi","Frekar einr\u00e6n/n, leikur s\u00e9r oft ein/n","Almennt hl\u00fd\u00f0in/n, gerir yfirleitt eins og fullor\u00f0nir \u00f3ska","\u00c1hyggjur af m\u00f6rgu, vir\u00f0ist oft \u00e1hyggjufullur","Hj\u00e1lpsamur/s\u00f6m ef einhver mei\u00f0ir sig, er \u00ed uppn\u00e1mi e\u00f0a l\u00ed\u00f0ur illa","St\u00f6\u00f0ugt me\u00f0 fikt e\u00f0a \u00e1 i\u00f0i","\u00c1 a\u00f0 minnsta kosti einn g\u00f3\u00f0an vin","Fl\u00fdgst oft \u00e1 e\u00f0a leggur b\u00f6rn \u00ed einelti","Oft \u00f3hamingjusamur/s\u00f6m, langt ni\u00f0ri e\u00f0a t\u00e1rast","Almennt vel \u00feokka\u00f0ur/\u00feokku\u00f0 af \u00f6\u00f0rum b\u00f6rnum","Au\u00f0velt a\u00f0 stela athygli hans/hennar, einbeiting \u00e1 flakki","\u00d3\u00f6rugg/ur, hangir \u00ed foreldrum, vi\u00f0 \u00f3kunnar a\u00f0st\u00e6\u00f0ur, missir sj\u00e1lfstraust","G\u00f3\u00f0ur vi\u00f0 yngri b\u00f6rn","L\u00fdgur oft e\u00f0a svindlar","Ver\u00f0ur fyrir str\u00ed\u00f0ni e\u00f0a einelti af h\u00e1lfu annarra barna","B\u00fd\u00f0st oft til a\u00f0 hj\u00e1lpa \u00f6\u00f0rum (foreldrum, kennurum, \u00f6\u00f0rum b\u00f6rnum)","Hugsar \u00e1\u00f0ur en hann/h\u00fan framkv\u00e6mir","Stelur heima, \u00ed sk\u00f3la e\u00f0a annarssta\u00f0ar","Semur betur vi\u00f0 fullor\u00f0na en \u00f6nnur b\u00f6rn","\u00d3ttast margt, ver\u00f0ur au\u00f0veldlega hr\u00e6dd/ur","Fylgir verkefnum eftir til enda, heldur g\u00f3\u00f0ri athygli"],"answers":["Ekki r\u00e9tt","A\u00f0 nokkru r\u00e9tt","\u00d6rugglega r\u00e9tt"]}},"views":{"entry_field_sections":{"list":{"drag_and_drop":"Drag\u00f0u spurningu hinga\u00f0"}},"responder_items":{"select_respondents":"Velja vi\u00f0takenda","select_entry_sets":"Velja ey\u00f0ubla\u00f0","requests":{"name":"Bei\u00f0nir","submit":"Senda n\u00fdja bei\u00f0ni","have_sent":"Bei\u00f0ni hefur veri\u00f0 send","sent":"Bei\u00f0ni send","for":"Skilast fyrir %{date}","sent_another":"Veldu dagsetningu til a\u00f0 senda a\u00f0ra bei\u00f0ni","error":"Villa !","contact_admin":"Kerfisstj\u00f3ri hefur fengi\u00f0 meldingu um villu.","no_uncompleted":"Engar n\u00fdjar bei\u00f0nir"}},"help_page":{"content":{"slides":[{"title":"Title 1","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 2","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 3","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]},{"title":"Title 4","paragraphs":["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae arcu vulputate dui viverra egestas ut et felis. Quisque in iaculis purus. Sed leo turpis, porttitor et elit eu, dictum pellentesque mi. Phasellus imperdiet lacus a felis semper, et commodo ante mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer ac facilisis ipsum. Nunc tempor odio non tortor aliquet iaculis. Nulla ac venenatis risus, in posuere nisl. Morbi tincidunt nunc ac libero eleifend, ut accumsan metus tempor. Nullam scelerisque feugiat elit. Morbi vel augue interdum, consectetur nunc eu, tempus turpis.","Vestibulum volutpat ut quam ac tempus. Quisque vitae dapibus purus. Praesent vehicula imperdiet orci vel porta. Praesent porta eget nunc ac malesuada. Maecenas et malesuada nunc, vitae blandit urna. Sed gravida commodo aliquet. Nulla sagittis sagittis nulla, eget fringilla orci commodo sit amet. Sed quis varius lacus. Nulla condimentum placerat ligula. Donec dictum a neque sed tristique. Ut neque massa, mollis quis convallis ut, bibendum at orci. Vestibulum tincidunt, lorem eget commodo tristique, est odio aliquam diam, sed suscipit risus lacus ac dui. Pellentesque aliquet at nibh et bibendum. Aliquam eu ipsum nec magna venenatis consequat sed quis ante. Pellentesque in interdum libero, eget dictum est. Cras pellentesque nec dui ut sollicitudin."]}]}},"landing_page":{"content":{"features":[{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."},{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."},{"title":"Dream it!","subtitle":"Aliquet amet nascetur","description":"Snarpur er n\u00fdsk\u00f6punarverkefni \u00fear sem unni\u00f0 er a\u00f0 \u00fer\u00f3un hugb\u00fana\u00f0ar sem au\u00f0veldar s\u00f6fnun og \u00farvinnslu gagna \u00ed kl\u00edn\u00edsku starfi s\u00e9rfr\u00e6\u00f0inga sem taka s\u00e9r skj\u00f3lst\u00e6\u00f0inga til me\u00f0fer\u00f0ar s.s. l\u00e6kna, s\u00e1lfr\u00e6\u00f0inga og f\u00e9lagsr\u00e1\u00f0gjafa."}]},"partial":{"apply":{"express_interest":"Skr\u00e1\u00f0u \u00feig h\u00e9r til a\u00f0 f\u00e1 fr\u00e9ttir af verkefninu."},"footer":{"copyright":"Copyright"},"header":{"stripes":["Sta\u00f0la\u00f0ir listar","Ey\u00f0ubl\u00f6\u00f0","Samskipti","Yfirs\u00fdin","\u00d6ryggi gagna"],"sub_header":"Au\u00f0veldar s\u00f6fnun og \u00farvinnslu kl\u00edn\u00edskra gagna."}}},"401_page":{"content":{"unauthorized":"Unauthorized","message":"You are not allowed to see this content, either contact your webmaster or try again. Use your browser's <b>Back button</b> to navigate to the page you have prevously come from","go_homepage":"Or you could go to your Home Page:","button_home":"Take me home","go_loginpage":"Or you could just logged in:"}},"browser_update":{"content":{"ups":"\u00daps...!","alert_message":"Til \u00feessa a\u00f0 halda \u00fer\u00f3unarkostna\u00f0i \u00ed l\u00e1gmarki sty\u00f0ur Qodiag ekki Internet explorer e\u00f0a eldri ger\u00f0ir af v\u00f6frum eins og er. Vinsamlegastu uppf\u00e6r\u00f0u vafran \u00feinn(sj\u00e1 lei\u00f0beiningar) og skr\u00e1\u00f0i \u00feig svo inn \u00e1 Snarp.","election":"Veldu anna\u00f0hvort","instruction":"og fylgdu lei\u00f0beiningum um uppsetningu.","update":"Ef \u00fe\u00fa ert \u00feegar me\u00f0 sl\u00edkan vafra skalltu uppf\u00e6ra hann samkv\u00e6mt eftirfarandi lei\u00f0beiningum.","step1":"1. Far\u00f0u \u00ed about","step2":"2. Smelltu \u00e1 \"Update now\"","login":"Skr\u00e1\u00f0u \u00feig inn \u00e1 www.qodiag.com"}},"profiles":{"parent_not_found":"Foreldri vantar","upload_image":"Hla\u00f0a upp mynd"},"application":{"partial":{"alert_login_as":{"attention":"Attention","message":"You have logged-in like the patient respondent. To go back as a caretaker, please click the link below"}}},"users":{"content":{"uncompleted_requests":"\u00d3kl\u00e1r\u00f0ar bei\u00f0nir","completed_requests":"\u00datrunnar bei\u00f0nir","login_as":"Skr\u00e1 mig inn"}}},"errors":{"messages":{"not_found":"not found","already_confirmed":"was already confirmed","not_locked":"was not locked"}},"devise":{"failure":{"unauthenticated":"You need to sign in or sign up before continuing.","unconfirmed":"You have to confirm your account before continuing.","locked":"Your account is locked.","invalid":"\u00d3gilt netfang e\u00f0a lykilor\u00f0","invalid_token":"Invalid authentication token.","timeout":"Your session expired, please sign in again to continue.","inactive":"Your account was not activated yet.","user":{"not_found_in_database":"\u00d3gilt netfang e\u00f0a lykilor\u00f0"}},"sessions":{"sign_up":"Skr\u00e1 notenda","sign_in":"Innskr\u00e1ning","signed_in":"Innskr\u00e1ning t\u00f3kst","signed_out":"\u00datskr\u00e1ning t\u00f3kst","signed_in_as":"Skr\u00e1\u00f0(ur) inn sem","sign_out":"Skr\u00e1 mig \u00fat"},"passwords":{"send_instructions":"You will receive an email with instructions about how to reset your password in a few minutes.","updated":"Your password was changed successfully. You are now signed in.","change_password":"Change your password","send_reset":"Send me reset password instructions"},"confirmations":{"send_instructions":"You will receive an email with instructions about how to confirm your account in a few minutes.","confirmed":"Your account was successfully confirmed. You are now signed in.","resend_instructions":"Resend confirmation instructions","not_received":"Didn't receive confirmation instructions?"},"registrations":{"signed_up":"Skr\u00e1ning t\u00f3kst","updated":"You updated your account successfully.","destroyed":"Bye! Your account was successfully cancelled. We hope to see you again soon.","pre_registration":"Takk fyrir \u00e1hugan, vi\u00f0 munum senda netfang \u00e1 %{email}","blank_email":"Netfang vantar","tips":["(leave blank if you don't want to change it)","(we need your current password to confirm your changes)","Unhappy? "],"cancel_account":"Cancel my account"},"unlocks":{"send_instructions":"You will receive an email with instructions about how to unlock your account in a few minutes.","unlocked":"Your account was successfully unlocked. You are now signed in.","not_received":"Didn't receive unlock instructions?","resend_instructions":"Resend unlock instructions"},"mailer":{"confirmation_instructions":{"subject":"Confirmation instructions","user_subject":"blabla","greeting":"Velkomin %{name}!","body":["You can confirm your account through the link below:"],"link":{"confirm":"Confirm my account"}},"reset_password_instructions":{"subject":"Reset password instructions breytt","greeting":"S\u00e6l(l) %{name}!","body":["Someone has requested a link to change your password, and you can do this through the link below.","If you didn't request this, please ignore this email.","Your password won't change until you access the link above and create a new one."],"link":{"change_password":"Change my password"}},"unlock_instructions":{"subject":"Unlock Instructions breytt","greeting":"S\u00e6l(l) %{name}!","body":["Your account has been locked due to an excessive amount of unsuccessful sign in attempts.","Click the link below to unlock your account:"],"link":{"unlock":"Unlock my account"}},"invitation_instructions":{"user_subject":"Qodiag- N\u00fdskr\u00e1ning","body":{"greeting":"S\u00e6l(l) %{name}","text":"Vinsamlegast kl\u00e1ri\u00f0 n\u00fdskr\u00e1ningu me\u00f0 \u00fev\u00ed a\u00f0 fylgja eftirfarandi sl\u00f3\u00f0","regards":"Bestu kve\u00f0jur"}}},"invitations":{"send_instructions":"Bei\u00f0ni um a\u00f0 kl\u00e1ra skr\u00e1ningur hefur veri\u00f0 sent \u00e1 %{email}","invitation_token_invalid":"Bei\u00f0ni um skr\u00e1ningu er ekki gild","updated":"Lykilor\u00f0 hefur veri\u00f0 vista\u00f0, \u00fe\u00fa ert n\u00fa skr\u00e1\u00f0ur inn"},"messages":{"use_password_received":"Vinsamlegast skr\u00e1\u00f0u \u00feig inn me\u00f0 lykilor\u00f0i sem \u00fe\u00fa hefur fengi\u00f0 sent \u00ed t\u00f6lvup\u00f3sti."}},"entry_set":{"model_name":"ey\u00f0ubla\u00f0","model_name_accusative":"ey\u00f0ubla\u00f0i","model_name_plural":"Ey\u00f0ubl\u00f6\u00f0","description":"L\u00fdsing","public":"Opinber?","messages":{"question_saved":"Spurningu b\u00e6tt vi\u00f0","question_edited":"Spurningu breytt vi\u00f0","confirm_delte_question":"Ertu viss um a\u00f0 \u00fe\u00fa viljir ey\u00f0a \u00feessari spurningu","entry_set_saved":"F\u00e6rsla hefur vistast"}},"responder_item":{"deadline":"Skilafrestur","respondent":"Vi\u00f0takenda","entry_set":"Ey\u00f0ubla\u00f0","registration":"Skr\u00e1ning","registrations":"Skr\u00e1ningar","registration_items":{"client_registration":"N\u00fdskr\u00e1ning"},"survey_items":{"hsq-r":"W.B. \u00deunglyndism\u00e6likvar\u00f0i","quiz":"Svefnskr\u00e1ning","rating-scale":"ADHD Rating Scale"},"status":{"completed":"B\u00fai\u00f0 a\u00f0 svara","uncompleted":"\u00c1 eftir a\u00f0 svara"},"headers":{"name":"Heiti","patient":"Var\u00f0ar","due_date":"Skiladagur"}},"user":{"email":"Netfang","password":"Lykilor\u00f0","password_confirmation":"Endurtaka lykilor\u00f0","sign_in":"Innskr\u00e1ning","forgotten_password":"Gleymt lykilor\u00f0?"},"role":{"super_admin":"Kerfisstj\u00f3ri","caretaker":"Starfsma\u00f0ur","client":"Skj\u00f3lst\u00e6\u00f0ingur"},"person":{"name":"Nafn","firstname":"Fornafn","lastname":"Eftirnafn","dateofbirth":"F\u00e6\u00f0ingardagur","cpr":"Kennitala","full_cpr":"Kennitala","mobilephone":"S\u00edmi GSM","workphone":"S\u00edmi vinna","occupation":"Starfsheiti","workplace":"Vinnusta\u00f0ur","yearofbirth":"F\u00e6\u00f0ingar\u00e1r","boy":"Drengur","girl":"St\u00falka","male":"Karl","female":"Kona","sex":"Kyn","avatar":"Mynd"},"relationship":{"parent":"Forr\u00e1\u00f0ama\u00f0ur er foreldri","guardian":"Er forr\u00e6\u00f0ishafi skj\u00f3lst\u00e6\u00f0ings","not_guardian":"Er ekki forr\u00e6\u00f0ishafi","not_spouse":"Fyrrverandi maki","is_spouse":"Er n\u00faverandi maki tengili\u00f0s","spouse_start":"Samband h\u00f3fst","spouse_end":"Sambandi lauk","guardian_start":"T\u00f3k vi\u00f0 forr\u00e6\u00f0i","guardian_end":"Forr\u00e6\u00f0i lauk"},"address":{"street_1":"Heimilisfang","street_2":"Heimilisfang","zip_code":"P\u00f3stn\u00famer","town":"Sveitarf\u00e9lag","home_phone":"S\u00edmi 2","phone":"S\u00edmi 1"},"forms":{"full_siblings":"Alsystkin","half_siblings":"H\u00e1lf systkin - B\u00f6rn tengili\u00f0s","inverse_half_siblings":"H\u00e1lf systkin - B\u00f6rn hins foreldris","foster_siblings":"F\u00f3stursystkin","relations":"Tengsl","information_from_national_registry":"Uppl\u00fdsingar fr\u00e1 \u00dej\u00f3\u00f0skr\u00e1","family_from_national_registry":"Fylla \u00fat uppl\u00fdsingar mi\u00f0a\u00f0 vi\u00f0 uppl\u00fdsingar fr\u00e1 \u00dej\u00f3\u00f0skr\u00e1","personal_info":"Pers\u00f3nuuppl\u00fdsingar","personal_info_parent1":"Pers\u00f3nuuppl\u00fdsingar fyrri foreldris","personal_info_parent2":"Pers\u00f3nuuppl\u00fdsingar seinni foreldris","address_info":"Heimilisfang","parent_guardian":"foreldri/forr\u00e6\u00f0ishafi","client":"skj\u00f3lst\u00e6\u00f0ingur","guardian_invitation":{"name":"Bei\u00f0ni um skr\u00e1ningu","steps":{"guardian_info":"Foreldri/forr\u00e1\u00f0ama\u00f0ur","patient_info":"Uppl\u00fdsingar um skj\u00f3lst\u00e6\u00f0ing"}},"subject_invitation":{"steps":{"patient_info":"Uppl\u00fdsingar um skj\u00f3lst\u00e6\u00f0ing"}},"respondent_registration":{"name":"Forskr\u00e1ning grunnuppl\u00fdsinga","steps":{"contact_info":"Helstu uppl\u00fdsingar (s\u00edmi, heimilsfang ofl)","subject_parent":"Fa\u00f0ir/m\u00f3\u00f0ir"}},"pre_registration_as_guardian_and_parent":{"steps":{"subject":"Skj\u00f3lst\u00e6\u00f0ingur","contact_info":"Tengili\u00f0ur skj\u00f3lst\u00e6\u00f0ings","subject_parent":"Foreldri skj\u00f3lst\u00e6\u00f0ings","subject_siblings":"Fj\u00f6lskyldu samsetning"}},"pre_registration_as_guardian":{"steps":{"subject":"Skj\u00f3lst\u00e6\u00f0ingur","contact_info":"Tengili\u00f0ur skj\u00f3lst\u00e6\u00f0ings","subject_parent":"Foreldrar skj\u00f3lst\u00e6\u00f0ings","subject_siblings":"Systkin skj\u00f3lst\u00e6\u00f0ings"}}},"navigation":{"home":"heim","settings":"stillingar"},"page_errors":{"error_401":"\u00de\u00fa hefur ekki a\u00f0gang a\u00f0 \u00feessari s\u00ed\u00f0u"},"number":{"format":{"separator":",","delimiter":".","precision":2},"currency":{"format":{"format":"%u %n","unit":"kr."}},"human":{"format":{"delimiter":"","precision":1},"storage_units":{"format":"%n %u","units":{"byte":{"one":"b\u00e6ti","other":"b\u00e6ti"},"kb":"KB","mb":"MB","gb":"GB","tb":"TB"}}}},"date":{"formats":{"default":"%d.%m.%Y","short":"%e. %b","long":"%e. %B %Y"},"day_names":["sunnudaginn","m\u00e1nudaginn","\u00feri\u00f0judaginn","mi\u00f0vikudaginn","fimmtudaginn","f\u00f6studaginn","laugardaginn"],"abbr_day_names":["sun","m\u00e1n","\u00feri","mi\u00f0","fim","f\u00f6s","lau"],"month_names":[null,"jan\u00faar","febr\u00faar","mars","apr\u00edl","ma\u00ed","j\u00fan\u00ed","j\u00fal\u00ed","\u00e1g\u00fast","september","okt\u00f3ber","n\u00f3vember","desember"],"abbr_month_names":[null,"jan","feb","mar","apr","ma\u00ed","j\u00fan","j\u00fal","\u00e1g\u00fa","sep","okt","n\u00f3v","des"],"order":"day :month :year"},"time":{"formats":{"default":"%A %e. %B %Y kl. %H:%M","time":"%H:%M","short":"%e. %B %Y","long":"%A %e. %B %Y kl. %H:%M","abbr_month":"%b"},"am":"","pm":""},"support":{"array":{"sentence_connector":"og","words_connector":", ","two_words_connector":" og ","last_word_connector":" og ","skip_last_comma":true}},"datetime":{"distance_in_words":{"half_a_minute":"h\u00e1lf m\u00edn\u00fata","less_than_x_seconds":{"one":"minna en 1 sek\u00fanda","other":"minna en %{count} sek\u00fandur"},"x_seconds":{"one":"1 sek\u00fanda","other":"%{count} sek\u00fandur"},"less_than_x_minutes":{"one":"minna en 1 m\u00edn\u00fata","other":"minna en %{count} m\u00edn\u00fatur"},"x_minutes":{"one":"1 m\u00edn\u00fata","other":"%{count} m\u00edn\u00fatur"},"about_x_hours":{"one":"u.\u00fe.b. 1 klukkustund","other":"u.\u00fe.b. %{count} klukkustundir"},"x_days":{"one":"1 dagur","other":"%{count} dagar"},"about_x_months":{"one":"u.\u00fe.b. 1 m\u00e1nu\u00f0ur","other":"u.\u00fe.b. %{count} m\u00e1nu\u00f0ir"},"x_months":{"one":"1 m\u00e1nu\u00f0ur","other":"%{count} m\u00e1nu\u00f0ir"},"about_x_years":{"one":"u.\u00fe.b. 1 \u00e1r","other":"u.\u00fe.b. %{count} \u00e1r"},"over_x_years":{"one":"meira en 1 \u00e1r","other":"meira en %{count} \u00e1r"}}},"activerecord":{"models":{"user":"notenda","role":"hlutverk","person":"pers\u00f3na","resopnder_item":"skr\u00e1ning"},"attributes":{"user":{"email":"netfang","password":"lykilor\u00f0","password_confirmation":"endurtaka lykilor\u00f0"},"role":{"name":"hlutverk"},"person":{"firstname":"fornafn","lastname":"eftirnafn","cpr":"kennitala","sex":"kyn","full_cpr":"kennitala"},"relationship":{"relation_id":"relation_id","name":"tenging"},"responder_item":{"completed":"kl\u00e1r\u00f0","deadline":"skilafrestur"}},"errors":{"template":{"header":{"one":"Ekki var h\u00e6gt a\u00f0 vista %{model} vegna einnar villu.","other":"Ekki var h\u00e6gt a\u00f0 vista %{model} vegna %{count} villna."},"body":"Upp kom vandam\u00e1l \u00ed eftirfarandi d\u00e1lkum:"},"messages":{"inclusion":"er ekki \u00ed listanum","exclusion":"er fr\u00e1teki\u00f0","invalid":"er \u00f3gilt","record_invalid":"er \u00f3gilt","confirmation":"er ekki jafngilt sta\u00f0festingunni","accepted":"\u00fearf a\u00f0 vera teki\u00f0 gilt","empty":"m\u00e1 ekki vera t\u00f3mt","blank":"vantar","too_long":"er of langt, m\u00e1 mest vera %{count} stafir","too_short":"er of stutt, m\u00e1 minnst vera %{count} stafir","wrong_length":"er af rangri lengd, m\u00e1 mest vera %{count} stafir","taken":"er \u00feegar \u00ed notkun","not_a_number":"er ekki tala","greater_than":"\u00fearf a\u00f0 vera st\u00e6rri en %{count}","greater_than_or_equal_to":"\u00fearf a\u00f0 vera st\u00e6rri en e\u00f0a jafngilt %{count}","equal_to":"\u00fearf a\u00f0 vera jafngilt %{count}","less_than":"\u00fearf a\u00f0 vera minna en %{count}","less_than_or_equal_to":"\u00fearf a\u00f0 vera minna en e\u00f0a jafngilt %{count}","odd":"\u00fearf a\u00f0 vera oddatala","even":"\u00fearf a\u00f0 vera sl\u00e9tt tala","not_equal":"This value must match the value of %{field}"}},"sucess":{"messages":{"saved":"Skref %{model} hefur veri\u00f0 vista\u00f0"}},"confirm":{"messages":{"deleted":"Ertu viss um a\u00f0 \u00fe\u00fa viljir ey\u00f0a ey\u00f0ubla\u00f0i %{model}"}}},"terms":{"child":"Barn","boy":"Drengur","girl":"St\u00falka","sex":{"male":"Karlkyn","female":"Kvennkyn"},"father":"Fa\u00f0ir","mother":"M\u00f3\u00f0ir","parent":"Foreldri","parents":"Foreldrar","patient":"Var\u00f0ar","client":{"one":"Skj\u00f3lst\u00e6\u00f0ingur","other":"Skj\u00f3lst\u00e6\u00f0ingar"},"spouse":"Maki","spouses":"Makar","ex_spouse":"Fyrrverandi maki","current_spouse":"N\u00faverandi maki","relationship_start":"Samband h\u00f3fst","relationship_end":"Sambandi lauk","guardianship_start":"Forr\u00e6\u00f0i h\u00f3fst","guardianship_end":"Forr\u00e6\u00f0i lauk","guardianship":"Forr\u00e6\u00f0i","guardian":"Forr\u00e6\u00f0ishafi","siblings":"Systkin","sibling":"Systkin","half_sibling":"H\u00e1lfsystkin","foster_sibling":"F\u00f3stursyskin","register":{"mother":"Skr\u00e1 m\u00f3\u00f0ur","father":"Skr\u00e1 f\u00f6\u00f0ur"},"personal_information":"Pers\u00f3nu uppl\u00fdsingar","occupational_information":"Atvinnu uppl\u00fdsingar","contact_information":"Heimilisfang og s\u00edmi","total":"heildarvandi","y":" og ","or":"e\u00f0a","onCap":"\u00c1","help":"Uppl\u00fdsingar","setup":"Stillingar","go_back":"Fara tilbaka!","sure":"Alveg viss?","type_something":"Skrifa h\u00e9r....","title":"Titill","step":"skref","new":"n\u00fdtt","edit":"breyta","update":"uppf\u00e6ra","in":"\u00ed ","public":"Sameiginlegur","name":"Heiti","due_date":"Skiladagur","edit_information":"Breyta uppl\u00fdsingum","add_information":"Skr\u00e1 uppl\u00fdsingar","empty_select":"Select an option...","type":"Tegund","time_to_words":{"until":"\u00feanga\u00f0 til","ago":"s\u00ed\u00f0an","expires":"rennur \u00fat","expired":"rann \u00fat","submitted":"svara\u00f0","no_submitted":"\u00f3svara\u00f0"},"today":"\u00ed dag","question":"Spurningar","history":"Saga","timeline":"M\u00e6lingar","ago":"","lists":"Listar","empty":"T\u00f3mt","username":"Notendanafn","access_count":"Innskr\u00e1ningar","last_access":"S\u00ed\u00f0asta innskr\u00e1ning","first_access":"Stofna\u00f0","show":"Birta","back":"Til baka","surveys":"Spurningalistar"},"marionette":{"errors":{"error_in_function":"Error in %{function}","model_not_found":"No model found inside of form's contentView","model_not_saved":"could not save %{model} error","invalid_loading_type":"Invalid loadingType","url_not_found":"A 'url' property or function must be specified","template_not_found":"Template %{template} not found!","schema_nested_model_not_found":"Missing required 'schema.model' option for NestedModel editor","schema_model_not_found":"Schema Model not found"}},"actions":{"save":"Vista","add_spouse":"Skr\u00e1 maka","add_guardian":"Skr\u00e1 forr\u00e6\u00f0ishafa","remove":"Ey\u00f0a","create":"Skr\u00e1","add":"B\u00e6ta vi\u00f0","cancel":"H\u00e6tta vi\u00f0","sign_up":"N\u00fdskr\u00e1ning","sign_in":"Skr\u00e1 mig inn","sign_out":"Skr\u00e1 mig \u00fat","log_in":"Innskr\u00e1ning","register":"Skr\u00e1","finish":"Kl\u00e1ra","send":"Senda","upload":"Hla\u00f0a upp","request_survey":"Senda spurningalista","invite_clients":"Skr\u00e1 skj\u00f3lst\u00e6\u00f0ing","save_and_continue":"\u00c1fram og vista","continue":"\u00c1fram","save_and_complete":"Vista og kl\u00e1ra","new_list":"B\u00faa til n\u00fdjan lista","add_parent":"Skr\u00e1 foreldri","edit_avatar":"Breyta mynd","edit_information":"Breyta uppl\u00fdsingum","add_comment":"Skrifa umm\u00e6li","minor":"Undir l\u00f6galdri","adult":"Fullor\u00f0in","new_question":"N\u00fd spurning","add_section":"B\u00e6ta vi\u00f0 skrefi"}},"he":{"surveyor":{"take_these_surveys":"\u05ea\u05d5\u05db\u05dc\u05d5 \u05dc\u05d1\u05e6\u05e2 \u05e1\u05e7\u05e8\u05d9\u05dd \u05d0\u05dc\u05d5","take_it":"\u05d1\u05e6\u05e2","completed_survey":"\u05e1\u05d9\u05d5\u05dd \u05d4\u05e1\u05e7\u05e8","unable_to_find_your_responses":"\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05ea\u05e9\u05d5\u05d1\u05d5\u05ea\u05d9\u05da \u05dc\u05e1\u05e7\u05e8","unable_to_update_survey":"","unable_to_find_that_survey":"\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05d0\u05ea\u05e8 \u05d0\u05ea \u05d4\u05e1\u05e7\u05e8 \u05d4\u05de\u05d1\u05d5\u05e7\u05e9","survey_started_success":"\u05d4\u05e1\u05e7\u05e8 \u05d4\u05d5\u05d7\u05dc \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4","click_here_to_finish":"\u05dc\u05e1\u05d9\u05d5\u05dd","previous_section":"\u05d7\u05d6\u05e8\u05d4 &raquo;","next_section":"&laquo; \u05d4\u05de\u05e9\u05da","select_one":"\u05d1\u05d7\u05e8/\u05d9","sections":"\u05e1\u05e2\u05d9\u05e4\u05d9\u05dd","language":"\u05e9\u05e4\u05d4"}}};




$(document).ready(function(){
  $("#flash > div").fadeOut(4000);
});;
