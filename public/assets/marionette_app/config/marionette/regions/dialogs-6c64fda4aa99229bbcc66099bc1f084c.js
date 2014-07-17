(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(Backbone, Marionette) {
    return Marionette.Region.Dialog = (function(_super) {
      __extends(Dialog, _super);

      function Dialog() {
        _.extend(this, Backbone.Events);
      }

      Dialog.prototype.onShow = function(view) {
        view.$el.find(".modal").modal({
          keyboard: true
        });
        if (view.model != null) {
          this.listenTo(view.model, "created updated", (function(_this) {
            return function() {
              return _this.closeDialog;
            };
          })(this));
        }
        view.$el.on("hidden", (function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        return this.setupBindings(view);
      };

      Dialog.prototype.setupBindings = function(view) {
        return this.listenTo(view, "dialog:close", this.closeDialog);
      };

      Dialog.prototype.closeDialog = function() {
        this.stopListening();
        if (this.currentView != null) {
          return this.currentView.$el.find(".modal").modal('hide');
        }
      };

      return Dialog;

    })(Marionette.Region);
  })(Backbone, Marionette);

}).call(this);
