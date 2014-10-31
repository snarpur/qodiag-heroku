(function(){var g={}.hasOwnProperty,h=function(b,c){function f(){this.constructor=b}for(var d in c)g.call(c,d)&&(b[d]=c[d]);f.prototype=c.prototype;b.prototype=new f;b.__super__=c.prototype;return b};this.Qapp.module("Entities",function(b,c,f,d,g,e){var k;b.EntrySetSection=function(b){function a(){return a.__super__.constructor.apply(this,arguments)}h(a,b);a.prototype.paramRoot="section";a.prototype.blacklist=["entry_set_id","display_order"];a.prototype.nestedAttributeList=["sections_entry_fields",
"entry_sets_sections"];a.prototype.initialize=function(){var l,a,b;if(null!=(null!=(l=this.collection)?l.entrySetResponseId:void 0)||null!=(null!=(a=this.collection)?a.entrySetResponse:void 0))this.set("entrySetResponseId",null!=(b=this.collection.entrySetResponseId)?b:this.collection.entrySetResponse.id);return this.url=function(){return this.isNew()?Routes.sections_path():Routes.section_path(this.get("id"))}};a.prototype.getSectionEntryResponses=function(){var a;a=new c.Entities.EntryFields([],
{});a.url=Routes.entry_set_response_section_path(this.get("entrySetResponseId"),this.id);a.fetch({reset:!0});return a};a.prototype.getSectionEntryFields=function(a){a=new c.Entities.SectionsEntryFieldsCollection([],{section:this});this.set("sections_entry_fields",a);this.isNew()||a.fetch({reset:!0});return a};a.prototype.addSelectedField=function(a){var b;b=a.displayOrder;a=a.field;a={entry_field_id:a.get("id"),section_id:this.get("id"),display_order:b,entry_field:a.toJSON()};return this.get("sections_entry_fields").add([a],
{at:b})};a.prototype.saveEntryFields=function(){return this.save(this.pick("id","sections_entry_fields"))};a.prototype.isCurrentSection=function(){return this.collection.isCurrentSection(this)};a.prototype.entryFieldIds=function(){return this.get("sections_entry_fields")?this.get("sections_entry_fields").pluck("entry_field_id"):this.get("entry_field_ids")};return a}(b.Model);b.EntrySetSections=function(c){function a(){return a.__super__.constructor.apply(this,arguments)}h(a,c);a.prototype.model=b.EntrySetSection;
a.prototype.initialize=function(a,b){this.entrySetId=b.entrySetId;this.entrySetResponse=b.entrySetResponse;this.currentSectionId=b.currentSectionId;this.sectionNo=b.sectionNo;this.url=function(){return Routes.entry_set_sections_path(this.entrySetId)};return this.on("change:current:section",function(a){this.currentSectionId=a.model.id;return this.currentSection=a.model})};a.prototype.entryFieldIds=function(){return e.flatten(e.map(this.models,function(a){return a.entryFieldIds()}))};a.prototype.hasFieldWithId=
function(a){return e.contains(this.entryFieldIds(),a)};a.prototype.comparator=function(){return this.get("display_order")};a.prototype.newSection=function(a){return new this.model(e.extend({entry_sets_sections:[{entry_set_id:this.entrySetId,display_order:this.length+1}]},a))};a.prototype.getCurrentSection=function(){return this.currentSectionId?this.get(this.currentSectionId):this.first()};a.prototype.isCurrentSection=function(a){return a.id===this.getCurrentSection().id};a.prototype.setCurrentToLast=
function(){return this.sectionNo=this.last().get("display_order")};a.prototype.isCurrentLast=function(){return this.currentDisplayNo()===this.size()};a.prototype.isCurrentFirst=function(){return 1===this.currentDisplayNo()};a.prototype.getNextSection=function(){return this.findWhere({display_order:this.currentDisplayNo()+1})};a.prototype.getPreviousSection=function(){return this.findWhere({display_order:this.currentDisplayNo()-1})};a.prototype.currentDisplayNo=function(){return this.getCurrentSection().get("display_order")};
a.prototype.getLastDisplayNo=function(){return this.last().get("display_order")};a.prototype.addNewSection=function(a){a=this.newSection(a);this.add(a,{silent:!0});this.setCurrentToLast();this.trigger("reset");return a};return a}(b.Collection);k={getSectionEntities:function(c){c=new b.EntrySetSections([],c);c.fetch({reset:!0});return c}};return c.reqres.setHandler("entry:set:sections:entities",function(b){return k.getSectionEntities(b)})})}).call(this);
