(function() {
  this.JST || (this.JST = {});
  this.JST["backbone_app/templates/questionResponseListTmpl"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<thead>\n  <tr>\n    <th data-sortBy="numeric"><span class="c-icon sort"></span></th>\n    <th data-sortBy="nosort">', _.capitalize(I18n.t("surveys."+surveyAccessCode+".terms."+questionGroupName)) ,'</th>\n    <th data-sortby="numeric"><span class="c-icon sort"></span></th>\n  </tr>\n</thead>\n<tbody>\n</tbody>\n');}return __p.join('');};
}).call(this);
