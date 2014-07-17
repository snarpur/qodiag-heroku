(function() {
  Backbone.Marionette.Renderer.render = function(template, data) {
    if (!_.startsWith(template, "templates")) {
      template = "templates/" + template;
    }
    if (!JST["backbone_app/" + template]) {
      throw I18n.t("marionette.errors.template_not_found", {
        template: template
      });
    }
    return JST["backbone_app/" + template](data);
  };

}).call(this);
