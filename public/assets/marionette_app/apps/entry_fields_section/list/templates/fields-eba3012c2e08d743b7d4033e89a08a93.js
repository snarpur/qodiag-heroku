(function(){this.JST||(this.JST={});this.JST["marionette_app/apps/entry_fields_section/list/templates/fields"]=function(b){b||(b={});var c=[],e=function(a){return a&&a.ecoSafe?a:"undefined"!==typeof a&&null!=a?d(a):""},f=b.safe,d=b.escape;b.safe=function(a){if(a&&a.ecoSafe)return a;"undefined"!==typeof a&&null!=a||(a="");a=new String(a);a.ecoSafe=!0;return a};d||(d=b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")});(function(){c.push('<ul id="entry-section" class="dd-list"></ul>\n<button class="btn btn-success pull-right">');
c.push(e(this.t("actions.save")));c.push("</button>\n")}).call(b);b.safe=f;b.escape=d;return c.join("")}}).call(this);
