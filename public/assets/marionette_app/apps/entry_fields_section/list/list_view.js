(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Qapp.module("EntryFieldsSectionApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Empty = (function(_super) {
      __extends(Empty, _super);

      function Empty() {
        return Empty.__super__.constructor.apply(this, arguments);
      }

      Empty.prototype.template = "entry_fields_section/list/templates/_empty";

      Empty.prototype.tagName = 'li';

      return Empty;

    })(App.Views.ItemView);
    List.Field = (function(_super) {
      __extends(Field, _super);

      function Field() {
        return Field.__super__.constructor.apply(this, arguments);
      }

      Field.prototype.template = "entry_fields_section/list/templates/_field";

      Field.prototype.tagName = 'li';

      Field.prototype.className = "dd-item";

      Field.prototype.triggers = {
        "click a.trash": "remove:field"
      };

      Field.prototype.events = {
        'update:display:order': 'setDisplayOrder'
      };

      Field.prototype.setDisplayOrder = function(e, displayOrder) {
        return this.model.updateDisplayOrder(displayOrder);
      };

      Field.prototype.onRemoveField = function() {
        return this.model.collection.removeField(this.model);
      };

      return Field;

    })(App.Views.ItemView);
    return List.Fields = (function(_super) {
      __extends(Fields, _super);

      function Fields() {
        this.removePlaceHolder = __bind(this.removePlaceHolder, this);
        return Fields.__super__.constructor.apply(this, arguments);
      }

      Fields.prototype.template = "entry_fields_section/list/templates/fields";

      Fields.prototype.itemView = List.Field;

      Fields.prototype.emptyView = List.Empty;

      Fields.prototype.itemViewContainer = "ul";

      Fields.prototype.onCompositeCollectionRendered = function() {
        var listEl, options, _this;
        _this = this;
        listEl = this.$('ul');
        this.model.trigger("change:current:dropzone", listEl);
        options = {
          update: function(e, ui) {
            var displayOrder;
            displayOrder = $('li', this).index(ui.item);
            ui.item.trigger("update:display:order", displayOrder);
            return _this.trigger("section:entries:updated", {
              displayOrder: displayOrder,
              field: _this.newField
            });
          },
          over: function(e, ui) {
            return _this.placeHolderElement = ui.item;
          },
          deactivate: function(e, ui) {
            return _this.newField = null;
          },
          placeholder: "dropzone"
        };
        listEl.sortable(options);
        return listEl.on("item:selected", function(e, model) {
          return _this.newField = model;
        });
      };

      Fields.prototype.initialize = function(options) {
        return this.listenTo(this.collection, "add", this.removePlaceHolder);
      };

      Fields.prototype.removePlaceHolder = function() {
        return this.placeHolderElement.remove();
      };

      Fields.prototype.triggers = {
        "click button": "save:clicked"
      };

      return Fields;

    })(App.Views.CompositeView);
  });

}).call(this);
