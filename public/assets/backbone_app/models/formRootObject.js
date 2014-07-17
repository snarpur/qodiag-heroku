(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.FormRootObject = (function(_super) {
    __extends(FormRootObject, _super);

    function FormRootObject() {
      this.submitForm = __bind(this.submitForm, this);
      this.formAttributes = __bind(this.formAttributes, this);
      this.getFormRootObject = __bind(this.getFormRootObject, this);
      this.getFormRootObjectName = __bind(this.getFormRootObjectName, this);
      this.setUrl = __bind(this.setUrl, this);
      this.setFormHandler = __bind(this.setFormHandler, this);
      this.initialize = __bind(this.initialize, this);
      return FormRootObject.__super__.constructor.apply(this, arguments);
    }

    FormRootObject.prototype.initialize = function() {
      FormRootObject.__super__.initialize.apply(this, arguments);
      this.on("change:formHandler", this.setFormHandler);
      this.on("change:url", this.setUrl);
      return this;
    };

    FormRootObject.prototype.setFormHandler = function(self, handler) {
      if (handler != null) {
        $(handler.model.get("form").el).addClass("form-horizontal");
        return handler.on("submitForm", this.submitForm);
      }
    };

    FormRootObject.prototype.setUrl = function(self, url) {
      return this.url = function() {
        return url;
      };
    };

    FormRootObject.prototype.getFormRootObjectName = function() {
      return _.first(_.keys(this.schema));
    };

    FormRootObject.prototype.getFormRootObject = function() {
      var model, root;
      model = this;
      root = {};
      _.each(this.schema, function(v, k) {
        var attributes, schema;
        schema = $.extend(true, {}, {
          schema: model.schema[k].schema
        });
        attributes = $.extend(true, model.get(k), schema);
        return root = new v.model(_.extend(attributes, {
          formRenderModel: model.getFormRenderModel()
        }));
      });
      return root;
    };

    FormRootObject.prototype.formAttributes = function() {
      var attributes, model, root;
      attributes = {
        form_content: {}
      };
      root = {};
      root[this.getFormRootObjectName()] = this.getFormRootObject();
      model = this;
      _.each(root, function(v, k) {
        return attributes[k] = $.extend(true, {}, v.toJSON());
      });
      return attributes;
    };

    FormRootObject.prototype.submitForm = function(url) {
      var attrs;
      attrs = this.formAttributes();
      this.get('formHandler').off();
      this.clear();
      this.set("url", url);
      return this.trigger("readyToSave", attrs);
    };

    return FormRootObject;

  })(App.Models.Base);

}).call(this);
