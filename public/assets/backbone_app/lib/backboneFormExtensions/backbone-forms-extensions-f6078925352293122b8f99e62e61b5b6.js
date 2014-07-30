(function() {
  Backbone.Form.Field.prototype.renderingContext = function(schema, editor) {
    var model, nestedTitle, opt, title;
    model = editor.model;
    title = model.fieldTitle(this.key);
    nestedTitle = {
      nestedTitle: model.nestedFieldTitle(this.key)
    };
    if (schema.type === "Radio") {
      _.each(schema.options, function(item, index, list) {
        if (!item.label.match(/[A-Z]/)) {
          return item.label = model.fieldTitle(item.label);
        }
      });
    }
    opt = {
      key: this.key,
      id: editor.id,
      type: schema.type,
      title: title,
      typeClass: "type-" + (schema.type.toLowerCase()),
      editor: '<b class="bbf-tmp-editor"></b>',
      help: '<b class="bbf-tmp-help"></b>',
      error: '<b class="bbf-tmp-error"></b>'
    };
    if ((editor != null ? editor.hasNestedForm : void 0) != null) {
      opt.nestedTitle = Handlebars.compile(App.Templates.FormPartials.nestedTitle)(nestedTitle);
      opt.nestedClass = _.isEmpty(opt.nestedTitle) ? "" : 'nested-fields';
    }
    return opt;
  };

}).call(this);