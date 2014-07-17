(function() {
  this.Qapp.module("Components.Form", function(Form, App, Backbone, Marionette, $, _) {
    return Form.Builder = {
      buildConfig: function(config, rootModel, options) {
        var rendered;
        if (options == null) {
          options = {};
        }
        rendered = [];
        _.each(config, (function(_this) {
          return function(item) {
            var currentItem, nestedCollection;
            console.log(" 0000000000000");
            console.info(item);
            if (item.modelName) {
              currentItem = rootModel.get(item.modelName);
              console.info("currentItem", currentItem);
              if (_.has(item, "nestedFields")) {
                if (currentItem instanceof Backbone.Collection) {
                  console.info("current ", currentItem, item);
                  return currentItem.each(function(m) {
                    var modelConfig, nestedConfig;
                    modelConfig = _.clone(item);
                    modelConfig.formModel = m;
                    console.log(" m ", m);
                    _this.setFieldType(m, modelConfig);
                    if (modelConfig != null ? modelConfig.nestedFields : void 0) {
                      nestedConfig = _this.buildConfig(_.clone(modelConfig.fields), m);
                      rendered.push(modelConfig);
                      return rendered.push(nestedConfig);
                    } else {
                      return rendered.push(modelConfig);
                    }
                  });
                } else {
                  if (currentItem.get(item.nestedFields.modelName) instanceof Backbone.Collection) {
                    nestedCollection = currentItem.get(item.nestedFields.modelName);
                    return console.log("model with a nested collection");
                  }
                }
              }
            }
          };
        })(this));
        return _.flatten(rendered);
      },
      setFieldType: function(model, options) {
        if (!(options.fieldType || options.fieldType === "dynamic")) {
          return options.fieldType = model.get("field_type");
        }
      }
    };
  });

}).call(this);
