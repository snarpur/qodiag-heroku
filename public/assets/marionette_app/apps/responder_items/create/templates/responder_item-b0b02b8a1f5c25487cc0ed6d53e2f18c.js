(function(){this.JST||(this.JST={});this.JST["marionette_app/apps/responder_items/create/templates/responder_item"]=function(b){b||(b={});var a=[],e=function(a){return a&&a.ecoSafe?a:"undefined"!==typeof a&&null!=a?c(a):""},g=b.safe,c=b.escape;b.safe=function(a){if(a&&a.ecoSafe)return a;"undefined"!==typeof a&&null!=a||(a="");a=new String(a);a.ecoSafe=!0;return a};c||(c=b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")});(function(){var b,
d,c,f;a.push('<div class="control-group">\n  <label for="respondent_id" class="control-label">');a.push(this.t("responder_item.respondent"));a.push('</label>\n  <div class="controls">\n    <span class="help-inline span1"></span>\n    <select id="respondent_id" class="input-xlarge">\n      <option value="">');a.push(e(this.t("views.responder_items.select_respondents")));a.push("</option>\n      ");if(null!=this.respondents()){a.push("\n        ");f=this.respondents();d=0;for(c=f.length;d<c;d++)b=f[d],
a.push('\n          <option value="'),a.push(e(b.id)),a.push('">'),a.push(e(b.full_name)),a.push("</option> \n        ");a.push("\n      ")}a.push('\n    </select>\n    <span id="respondent_id_error" class="help-inline"></span>\n  </div>\n</div>\n<div class="control-group">\n  <label for="entry_set_response" class="control-label">');a.push(this.t("responder_item.entry_set"));a.push('</label>\n  <div class="controls">\n    <select id="entry_set_response" data-nested-key="entry_set_id" class="input-xlarge">\n      <option value="">');
a.push(e(this.t("views.responder_items.select_entry_sets")));a.push("</option>\n      ");if(null!=this.entrySets()){a.push("\n        ");f=this.entrySets();d=0;for(c=f.length;d<c;d++)b=f[d],a.push('\n          <option value="'),a.push(e(b.id)),a.push('">'),a.push(e(b.name)),a.push("</option> \n        ");a.push("\n      ")}a.push('\n    </select>\n    <span id="entry_set_response_error" class="help-inline"></span>\n  </div>\n</div>\n\n\n  <div class="control-group">\n    <label class="control-label">');
a.push(this.t("responder_item.deadline"));a.push('</label>\n    <div class="controls">\n      <label for="deadline_date"></label>\n      <span id="deadline_error" class="help-inline"></span>\n    </div>\n  </div>\n\n\n<div class="row">\n    <div id="deadline" class="span5 offset1" data-date-wrapper=\'true\'>\n</div>\n')}).call(b);b.safe=g;b.escape=c;return a.join("")}}).call(this);
