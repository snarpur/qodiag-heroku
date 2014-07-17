(function() {
  (function(Marionette) {
    return _.extend(Marionette.Renderer, {
      lookups: ["marionette_app/apps/", "marionette_app/components/"],
      render: function(template, data) {
        var path;
        if (template === false) {
          return;
        }
        path = this.getTemplate(template);
        if (!path) {
          throw I18n.t("marionette.errors.template_not_found", {
            template: template
          });
        }
        return path(data);
      },
      getTemplate: function(template) {
        var lookup, path, _i, _j, _len, _len1, _ref, _ref1;
        _ref = [template, template.split("/").insertAt(-1, "templates").join("/")];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          _ref1 = this.lookups;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            lookup = _ref1[_j];
            if (JST[lookup + path]) {
              return JST[lookup + path];
            }
          }
        }
      }
    });
  })(Marionette);

}).call(this);
