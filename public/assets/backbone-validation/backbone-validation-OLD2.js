Backbone.Validation=function(b){var p={forceUpdate:!1,selector:"name",labelFormatter:"sentenceCase",valid:Function.prototype,invalid:Function.prototype},t={formatLabel:function(b,e){return s[p.labelFormatter](b,e)},format:function(){var b=Array.prototype.slice.call(arguments);return b.shift().replace(/\{(\d+)\}/g,function(e,d){return"undefined"!==typeof b[d]?b[d]:e})}},r=function(q,e,d){e=e||{};d=d||"";b.each(q,function(a,b){q.hasOwnProperty(b)&&(a&&"object"===typeof a&&!(a instanceof Array||a instanceof
Date||a instanceof RegExp||a instanceof Backbone.Model||a instanceof Backbone.Collection)?r(a,e,d+b+"."):e[d+b]=a)});return e},m=function(){var q=function(a){return b.reduce(b.keys(b.result(a,"validation")||{}),function(a,b){a[b]=void 0;return a},{})},e=function(a,c){var l=a.validation?b.result(a,"validation")[c]||{}:{};if(b.isFunction(l)||b.isString(l))l={fn:l};b.isArray(l)||(l=[l]);return b.reduce(l,function(a,c){b.each(b.without(b.keys(c),"msg"),function(b){a.push({fn:k[b],val:c[b],msg:c.msg})});
return a},[])},d=function(a,c,l,g){return b.reduce(e(a,c),function(f,e){var d=b.extend({},t,k),d=e.fn.call(d,l,c,e.val,a,g);return!1===d||!1===f?!1:d&&!f?b.result(e,"msg")||d:f},"")},a=function(a,c){var g,f={},e=!0,q=b.clone(c),h=r(c);b.each(h,function(b,c){if(g=d(a,c,b,q))f[c]=g,e=!1});return{invalidAttrs:f,isValid:e}},g=function(c,g){return{preValidate:function(a,c){var g=this,f={},e;return b.isObject(a)?(b.each(a,function(a,b){(e=g.preValidate(b,a))&&(f[b]=e)}),b.isEmpty(f)?void 0:f):d(this,a,
c,b.extend({},this.attributes))},isValid:function(a){var c=r(this.attributes);if(b.isString(a))return!d(this,a,c[a],b.extend({},this.attributes));if(b.isArray(a))return b.reduce(a,function(a,g){return a&&!d(this,g,c[g],b.extend({},this.attributes))},!0,this);!0===a&&this.validate();return this.validation?this._isValid:!0},validate:function(f,e){var d=this,h=!f,k=b.extend({},g,e),m=q(d),u=b.extend({},m,d.attributes,f),p=r(f||u),n=a(d,u);d._isValid=n.isValid;b.each(m,function(a,b){n.invalidAttrs.hasOwnProperty(b)||
k.valid(c,b,k.selector)});b.each(m,function(a,b){var f=n.invalidAttrs.hasOwnProperty(b),g=p.hasOwnProperty(b);f&&(g||h)&&k.invalid(c,b,n.invalidAttrs[b],k.selector)});b.defer(function(){d.trigger("validated",d._isValid,d,n.invalidAttrs);d.trigger("validated:"+(d._isValid?"valid":"invalid"),d,n.invalidAttrs)});if(!k.forceUpdate&&0<b.intersection(b.keys(n.invalidAttrs),b.keys(p)).length)return n.invalidAttrs}}},c=function(a){delete a.validate;delete a.preValidate;delete a.isValid},f=function(a){b.extend(a,
g(this.view,this.options))},h=function(a){c(a)};return{version:"0.9.1",configure:function(a){b.extend(p,a)},bind:function(a,c){c=b.extend({},p,w,c);var e=c.model||a.model,d=c.collection||a.collection;if("undefined"===typeof e&&"undefined"===typeof d)throw"Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";e?b.extend(e,g(a,c)):d&&(d.each(function(f){b.extend(f,g(a,c))}),
d.bind("add",f,{view:a,options:c}),d.bind("remove",h))},unbind:function(a,g){g=b.extend({},g);var e=g.model||a.model,d=g.collection||a.collection;e?c(e):d&&(d.each(function(a){c(a)}),d.unbind("add",f),d.unbind("remove",h))},mixin:g(null,p)}}(),w=m.callbacks={valid:function(b,e,d){b.$("["+d+'~="'+e+'"]').removeClass("invalid").removeAttr("data-error")},invalid:function(b,e,d,a){b.$("["+a+'~="'+e+'"]').addClass("invalid").attr("data-error",d)}},v=m.patterns={digits:/^\d+$/,number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},
h=m.messages={required:"{0} is required",acceptance:"{0} must be accepted",min:"{0} must be greater than or equal to {1}",max:"{0} must be less than or equal to {1}",range:"{0} must be between {1} and {2}",length:"{0} must be {1} characters",minLength:"{0} must be at least {1} characters",maxLength:"{0} must be at most {1} characters",rangeLength:"{0} must be between {1} and {2} characters",oneOf:"{0} must be one of: {1}",equalTo:"{0} must be the same as {1}",digits:"{0} must only contain digits",
number:"{0} must be a number",email:"{0} must be a valid email",url:"{0} must be a valid url",inlinePattern:"{0} is invalid"},s=m.labelFormatters={none:function(b){return b},sentenceCase:function(b){return b.replace(/(?:^\w|[A-Z]|\b\w)/g,function(b,d){return 0===d?b.toUpperCase():" "+b.toLowerCase()}).replace(/_/g," ")},label:function(b,e){return e.labels&&e.labels[b]||s.sentenceCase(b,e)}},k=m.validators=function(){var k=String.prototype.trim?function(a){return null===a?"":String.prototype.trim.call(a)}:
function(a){var b=/^\s+/,c=/\s+$/;return null===a?"":a.toString().replace(b,"").replace(c,"")},e=function(a){return b.isNumber(a)||b.isString(a)&&a.match(v.number)},d=function(a){return!(b.isNull(a)||b.isUndefined(a)||b.isString(a)&&""===k(a)||b.isArray(a)&&b.isEmpty(a))};return{fn:function(a,d,c,f,e){b.isString(c)&&(c=f[c]);return c.call(f,a,d,e)},required:function(a,g,c,f,e){c=b.isFunction(c)?c.call(f,a,g,e):c;if(!c&&!d(a))return!1;if(c&&!d(a))return this.format(h.required,this.formatLabel(g,f))},
acceptance:function(a,d,c,f){if("true"!==a&&(!b.isBoolean(a)||!1===a))return this.format(h.acceptance,this.formatLabel(d,f))},min:function(a,b,c,d){if(!e(a)||a<c)return this.format(h.min,this.formatLabel(b,d),c)},max:function(a,b,c,d){if(!e(a)||a>c)return this.format(h.max,this.formatLabel(b,d),c)},range:function(a,b,c,d){if(!e(a)||a<c[0]||a>c[1])return this.format(h.range,this.formatLabel(b,d),c[0],c[1])},length:function(a,d,c,e){if(!b.isString(a)||a.length!==c)return this.format(h.length,this.formatLabel(d,
e),c)},minLength:function(a,d,c,e){if(!b.isString(a)||a.length<c)return this.format(h.minLength,this.formatLabel(d,e),c)},maxLength:function(a,d,c,e){if(!b.isString(a)||a.length>c)return this.format(h.maxLength,this.formatLabel(d,e),c)},rangeLength:function(a,d,c,e){if(!b.isString(a)||a.length<c[0]||a.length>c[1])return this.format(h.rangeLength,this.formatLabel(d,e),c[0],c[1])},oneOf:function(a,d,c,e){if(!b.include(c,a))return this.format(h.oneOf,this.formatLabel(d,e),c.join(", "))},equalTo:function(a,
b,c,d,e){if(a!==e[c])return this.format(h.equalTo,this.formatLabel(b,d),this.formatLabel(c,d))},pattern:function(a,b,c,e){if(!d(a)||!a.toString().match(v[c]||c))return this.format(h[c]||h.inlinePattern,this.formatLabel(b,e),c)}}}();b.each(k,function(h,e){k[e]=b.bind(k[e],b.extend({},t,k))});return m}(_);
