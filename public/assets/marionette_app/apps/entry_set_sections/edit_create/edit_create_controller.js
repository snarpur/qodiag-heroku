(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Qapp.module("EntrySetSectionsApp.EditCreate", function(EditCreate, App, Backbone, Marionette, $, _) {
    return EditCreate.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.create = function(options) {
        options.action = 'create';
        return this.showDialog(options);
      };

      Controller.prototype.edit = function(options) {
        options.action = 'edit';
        return this.showDialog(options);
      };

      Controller.prototype.showDialog = function(options) {
        this.dialogView = new EditCreate.Section({
          model: options.section
        });
        App.dialogRegion.show(this.dialogView);
        return this.dialogView.on("save:section", (function(_this) {
          return function() {
            return _this.saveSection(options);
          };
        })(this));
      };

      Controller.prototype.saveSection = function(options) {
        var action, activeView, collection, section, _this;
        section = options.section, collection = options.collection, activeView = options.activeView, action = options.action;
        _this = this;
        return section.save(section.attributes, {
          success: function(model, response) {
            if (action === 'create') {
              collection.add(response);
              collection.trigger("change:current:section", {
                model: collection.last()
              });
              App.navigate(_this.successPath(model));
            } else if (action === 'edit') {
              model.trigger('edit:complete');
            }
            _this.dialogView.$el.find(".modal").modal('hide');
            return activeView.trigger("section:" + action + ":complete");
          },
          error: function() {
            throw "entry_set_sections/create/create_controller.js.coffee:new()";
          }
        });
      };

      Controller.prototype.successPath = function(section) {
        return "settings" + (Routes.entry_set_section_path(section.get('entry_set_id'), section.id));
      };

      return Controller;

    })(App.Controllers.Base);
  });

}).call(this);
