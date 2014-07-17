(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/chartsTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div></div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/columnChartCollectionTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/editableCollectionTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<h1>',  I18n.t("terms.parents") ,'</h1>\n<ul class="reset"></ul>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/emptyTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/filterOptionItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('',  name ,'\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/filtersItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<label>',  I18n.t("surveys.adhd-rating-scale.terms."+name) ,'\n<select class="',  name ,'">\n  ');  for(var i=0; i<options.length; i++) { ; __p.push('\n    <option id = "',  options[i].id ,'" ',  options[i].selected ,'>\n      ', options[i].value ,'\n    </option>\n  ');  } ; __p.push('\n</select> \n</label>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/filtersSelectItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/headingsListTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<ul class="reset"></ul>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/headingsTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');  var lineName = name == "" ? "client_registration" : name ;; __p.push('\n<p>', I18n.t("surveys."+name+".name"),'</p>\n<span class="new-item icon-tiny-add"></span>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/itemDialogTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<span class="icon-close close"></span>\n<ul>\n<li><span class="c-icon medium column-chart-icn"></span></li>\n<li><span class="c-icon medium line-chart-icn"></span></li>\n</ul>\n<div class="chart-wrapper">\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/lineChartsTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="', chart.renderTo,'"class="chart">\n\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/lineItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<ul class="reset">\n<li><em>', I18n.t("views.responder_items.requests.sent") ,': ',  I18n.strftime(new Date(created_at),"%-d %B %Y"),'</em></li>\n<li><em>',  I18n.t("terms.due_date") ,': ',  I18n.strftime(new Date(deadline),"%-d %B %Y") ,'</em></li>\n</ul>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/lineTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="line-items"></div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/metricsMenuItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('',  I18n.t("surveys.terms."+name) ,'\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/multistepFormNavigationTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<li class=', cssClass,'>\n  <span>', stepNo,'</span>\n  '); if(formModelId == null) {; __p.push('\n    <a href="#">\n      ',  stepName,'\n    </a>\n  '); }else{; __p.push('\n    <a href=', "#step/s"+stepNo +"/i"+ formModelId,'>\n      ',  stepName,'\n    </a>\n  '); }; __p.push('\n</li>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/multistepFormTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="wizard-fields" class="wizard-fields"></div>\n<button class="btn btn-primary submit-btn">',  I18n.t("actions.save") ,'</button>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/newItemMsgTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="alert alert-block alert-info">\n  <h4>',  I18n.t("views.responder_items.requests.for", {date:""}) ,':</h4>\n  ', I18n.strftime(date,"%A %-d %B %Y"),'\n  ',  I18n.t("terms.ago") ,'\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/newItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="window">\n    <span class="icon-close close"></span>\n    <div class="left">\n      <h3>',  I18n.t("surveys."+name+".name"),'</h3>\n      <ul class="state-msg">\n        <li class="m-idle">\n          <div class="alert alert-info">Veldu dagsetningu til að senda beiðni</div>\n        </li>\n        <li class="m-selected"></li>\n        <li class="m-sending"></li>\n        <li class="m-success">\n          <div class="alert alert-block alert-success">\n            <h4>',  I18n.t("views.responder_items.requests.have_sent") ,'</h4>\n            ',  I18n.t("views.responder_items.requests.sent_another") ,'\n          </div>\n        </li>\n        <li class="m-error">\n          <div class="alert alert-block alert-error">\n            <h4>',  I18n.t("views.responder_items.requests.error") ,'</h4>\n            ',  I18n.t("views.responder_items.requests.contact_admin") ,'\n          </div>\n        </li>\n      </ul>\n    </div>\n    <div class="calendar right"></div>\n    <ul class="btn-controls">\n      <button class="btn btn-cancel">',  I18n.t("actions.cancel") ,'</button>\n      <button class="btn btn-success btn-submit">',  I18n.t("actions.send") ,'</button>\n    </ul>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/patientInformationTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="subject">\n    <div class="avatar"></div>\n    <div class="information"></div>\n</div>\n<hr class="fullbreak" />\n<div class="parents"></div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/questionResponseItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<td data-sortAs="',  question ,'">\n  ',  question ,'\n</td>\n<td>\n');  if (subquestion == "0") { ; __p.push('\n  ',  I18n.t("surveys."+surveyAccessCode+"."+"questions")[question] ,'\n');  }else{ ; __p.push('\n  ',  I18n.t("surveys."+surveyAccessCode+"."+"questions")[question]["header"] + ":<br/><small>" + I18n.t("surveys."+surveyAccessCode+"."+"questions")[question]["subquestions"][(subquestion - 1)]+ "</small>" ,'\n');  } ; __p.push('\n');  if (text_value != null && text_value != "") { ; __p.push('\n  <br/><div class="description">\n    <small>\n      ',  text_value ,'\n    </small>\n  </div>\n');  } ; __p.push('\n</td>\n<td data-sortAs="',  answer + 1 ,'"><span class="answer-signal">',  I18n.t("surveys."+surveyAccessCode+"."+"answers")[answer] ,'</span>\n\n</td>\n\n\n\n\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/questionResponseListTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<thead>\n  <tr>\n    <th data-sortBy="numeric"><span class="c-icon sort"></span></th>\n    <th data-sortBy="nosort">', _.capitalize(I18n.t("surveys."+surveyAccessCode+".terms."+questionGroupName)) ,'</th>\n    <th data-sortby="numeric"><span class="c-icon sort"></span></th>\n  </tr>\n</thead>\n<tbody>\n</tbody>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/simpleFormTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="buttons">\n    <button class="btn btn-cancel">',  I18n.t("actions.cancel") ,'</button>\n    <button class="btn btn-primary btn-submit">',  I18n.t("actions.save") ,'</button>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/submitButton"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<button class="btn btn-primary btn-submit">',  I18n.t("actions.save") ,'</button>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/surveyMenuItemTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<a data-toggle="dropdown" data-target="#">', I18n.t("surveys."+access_code+".name"),'</a>\n\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/surveyMenuTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<button class="btn btn-mini dropdown-toggle" data-toggle="dropdown">\n  ',  I18n.t("terms.lists") ,'\n  <span class="caret"></span>\n</button>\n<a href="#" class="popover-target" data-placement="left" data-content="Veldu lista til að senda beiðni" data-title="Engar mælingar">&nbsp;</a>\n<ul class="dropdown-menu pull-right"></ul>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/timelineNavTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<ul class="reset">\n  <li><span class="icon-big-next"></span></li>\n  <li><span class="icon-big-prev"></span></li>\n</ul>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/timelineTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div id="tml-body">\n  <div id="tml-history">\n    <ul class="reset">\n      ');  for(var i=0; i<years.length; i++) {; __p.push('\n        <li>\n        \t<b>',  years[i] ,'</b>\n        \t<b>',  years[i] ,'</b>\n        \t<p>',  I18n.t("date.abbr_month_names").slice(1,13).join("</p><p>"),'</p>\n        </li>\n      ');  } ; __p.push('\n    </ul>\n  </div>\n</div>\n<div id=\'empty-timeline\'>\n  ',  I18n.t("terms.empty") ,'\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/useragentDetectionTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div>\n\t<p>',  version ,'</p>\n</div>\n');}return __p.join('');};
}).call(this);
