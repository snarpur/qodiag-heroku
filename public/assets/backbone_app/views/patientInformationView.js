(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.PatientInformationView = (function(_super) {
    __extends(PatientInformationView, _super);

    function PatientInformationView() {
      this.reset = __bind(this.reset, this);
      this.setForm = __bind(this.setForm, this);
      this.insertHtml = __bind(this.insertHtml, this);
      this.renderAvatarUpload = __bind(this.renderAvatarUpload, this);
      this.renderAvatar = __bind(this.renderAvatar, this);
      this.renderCollectionView = __bind(this.renderCollectionView, this);
      this.renderItemView = __bind(this.renderItemView, this);
      return PatientInformationView.__super__.constructor.apply(this, arguments);
    }

    PatientInformationView.prototype.className = "patient-view";

    PatientInformationView.prototype.template = "templates/patientInformationTmpl";

    PatientInformationView.prototype.onRender = function() {
      this.renderItemView(new App.Models.Person(this.options.subject), ".subject .information");
      return this.renderCollectionView(new App.Collections.Person(this.options.parents), ".parents");
    };

    PatientInformationView.prototype.renderItemView = function(model, container) {
      var subjectView;
      subjectView = new App.Views.EditableItem({
        model: model
      });
      subjectView.on("itemEdit", this.setForm);
      this.insertHtml(subjectView, container);
      this.renderAvatar(".subject .avatar", this.options.subject);
      return this.renderAvatarUpload(".subject .upload", this.options.subject.id);
    };

    PatientInformationView.prototype.renderCollectionView = function(collection, container) {
      var parentsView, person, _i, _len, _ref, _results;
      parentsView = new App.Views.EditableItemCollection({
        collection: collection
      });
      parentsView.on("itemview:itemEdit", this.setForm);
      this.insertHtml(parentsView, container);
      _ref = collection.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        person = _ref[_i];
        _results.push(this.renderAvatarUpload(container, person.id));
      }
      return _results;
    };

    PatientInformationView.prototype.renderAvatar = function(container, person) {
      var avatar, html;
      avatar = person.avatar;
      html = '<img src="' + avatar + '" ><a href="#" onclick="$(\'.avatarUploadModal_' + person.id + '\').toggle();return false;"><span class="btn btn-mini dialog"><i class="icon-upload"></i></span></a>';
      return this.$(container).html(html);
    };

    PatientInformationView.prototype.renderAvatarUpload = function(container, id) {
      var form, token;
      token = $("meta[name=\"csrf-token\"]").attr("content");
      form = this.$('form', container);
      return form.find('.authenticity_token').val(token);
    };

    PatientInformationView.prototype.insertHtml = function(view, container) {
      if (_.isString(container)) {
        return this.$(container).html(view.render().el);
      } else {
        return container.replaceWith(view.render().el);
      }
    };

    PatientInformationView.prototype.setForm = function(editableItem) {
      var form;
      form = editableItem.renderForm();
      form.on("destroy", this.reset);
      editableItem.$el.replaceWith(form.el);
      return editableItem.close();
    };

    PatientInformationView.prototype.reset = function(formView) {
      this.renderItemView(formView.model, formView.$el);
      return formView.close();
    };

    return PatientInformationView;

  })(Backbone.Marionette.ItemView);

}).call(this);
