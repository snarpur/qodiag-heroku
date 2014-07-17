(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Address = (function(_super) {
    __extends(Address, _super);

    function Address() {
      this.initialize = __bind(this.initialize, this);
      return Address.__super__.constructor.apply(this, arguments);
    }

    Address.prototype.urlRoot = "/address";

    Address.prototype.paramRoot = "address";

    Address.prototype.initialize = function() {
      Address.__super__.initialize.apply(this, arguments);
      this.once("change:form", function() {
        if (this.get("submitDisabled") === true) {
          return this.disableFields();
        }
      });
      return this.url = function() {
        if (this.get('person_id')) {
          return "/people/" + (this.get('person_id')) + this.urlRoot;
        } else {
          return "" + this.urlRoot;
        }
      };
    };

    return Address;

  })(App.Models.Base);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.ColumnChart = (function(_super) {
    __extends(ColumnChart, _super);

    function ColumnChart() {
      return ColumnChart.__super__.constructor.apply(this, arguments);
    }

    ColumnChart.prototype.urlRoot = "/responder_items/responses";

    ColumnChart.prototype.initialize = function() {
      return this.url = function() {
        var base;
        base = "" + this.urlRoot + "/" + (this.get('id')) + "/column";
        if (this.get("columnMetrics")) {
          base = "" + base + "/" + (this.get('columnMetrics'));
        }
        return base;
      };
    };

    ColumnChart.prototype.chartWidth = function() {
      var width;
      width = App.Timeline.Dimensions.canvas_width * (this.get('size') / this.collection.totalSize());
      return this.get('chart').width = (width * 0.8) + 22;
    };

    ColumnChart.prototype.renderTo = function(view) {
      return this.get('chart').renderTo = this.view.$("> div")[0];
    };

    ColumnChart.prototype.chartContainer = function() {
      return this.view.$(" > div")[0];
    };

    ColumnChart.prototype.setFormatters = function() {
      var formatter;
      formatter = new App.Lib.ChartFormatters.Column(this.attributes);
      return formatter.setFormatters();
    };

    ColumnChart.prototype.responderItem = function() {
      return this.collection.responderItem();
    };

    ColumnChart.prototype.drillDownSetup = function() {
      var drilldown;
      if (this.get('questionListDrilldown')) {
        return drilldown = new App.Views.Drilldown({
          chart: this
        });
      }
    };

    ColumnChart.prototype.removeActiveChartEl = function(drilldown, callback) {
      if (this.get("activeChart") instanceof Backbone.View) {
        return this.get("activeChart").remove();
      } else {
        return this.get("activeChart").destroy();
      }
    };

    ColumnChart.prototype.setup = function(view) {
      var highChart;
      this.view = view;
      this.chartWidth();
      this.renderTo();
      this.setFormatters();
      this.drillDownSetup();
      console.log(JSON.stringify(this.attributes));
      console.warn(this.attributes);
      highChart = new Highcharts.Chart(this.attributes);
      return this.set("activeChart", highChart);
    };

    return ColumnChart;

  })(Backbone.Model);

  App.Collections.ColumnChart = (function(_super) {
    __extends(ColumnChart, _super);

    function ColumnChart() {
      return ColumnChart.__super__.constructor.apply(this, arguments);
    }

    ColumnChart.prototype.model = App.Models.ColumnChart;

    ColumnChart.prototype.initialize = function(models, options) {
      this.options = options;
      this.setCurrentMetric(options.currentMetric);
      this.on('reset', (function(_this) {
        return function(models, options) {
          _this.setMetricMenu(models, options);
          return _this.setFilters(models, options);
        };
      })(this));
      return this.url = function() {
        var url;
        url = "/responder_items/responses/:id/column";
        url = url.replace(/\:id/, this.responderItemId());
        if (!_.isEmpty(this.currentMetric)) {
          if (!_.isEmpty(this.normReferenceId)) {
            url = "" + url + "/norm_reference/" + this.normReferenceId + "/" + this.currentMetric;
          } else {
            url = "" + url + "/" + this.currentMetric;
          }
        } else {
          if (!_.isEmpty(this.normReferenceId)) {
            url = "" + url + "/norm_reference/" + this.normReferenceId;
          }
        }
        return url;
      };
    };

    ColumnChart.prototype.totalSize = function() {
      return _.reduce(this.pluck("size"), (function(memo, num) {
        return memo + num;
      }), 0);
    };

    ColumnChart.prototype.metricsMenu = function() {
      return _.map(this.at(0).attributes.chartMetrics, (function(i) {
        i.isActive = i.query === this.getCurrentMetric();
        return i;
      }), this);
    };

    ColumnChart.prototype.filters = function() {
      return _.map(this.at(0).attributes.chartFilters, (function(i) {
        return i;
      }), this);
    };

    ColumnChart.prototype.responderItemId = function() {
      return this.options.responderItem.get("id");
    };

    ColumnChart.prototype.responderItem = function() {
      return this.options.responderItem;
    };

    ColumnChart.prototype.setMetricMenu = function(models, options) {
      if ((options.chartMetrics == null) || (this.metricMenu != null)) {
        return;
      }
      _.first(options.chartMetrics).isActive = true;
      this.metricMenu = new Backbone.Collection(options.chartMetrics);
      return this.listenTo(this.metricMenu, "change:isActive", function(model) {
        return this.setCurrentMetric(model.get('name'));
      });
    };

    ColumnChart.prototype.setFilters = function(models, options) {
      if ((options.chartFilters == null) || (this.selectFilter != null)) {
        return;
      }
      this.selectFilter = new Backbone.Collection(options.chartFilters);
      return this.listenTo(this.selectFilter, 'change:normReferenceId', function(model) {
        return this.setNormReferenceId(model.get('normReferenceId'));
      });
    };

    ColumnChart.prototype.getMetricMenu = function() {
      return this.metricMenu;
    };

    ColumnChart.prototype.getFilters = function() {
      return this.selectFilter;
    };

    ColumnChart.prototype.setCurrentMetric = function(name) {
      return this.currentMetric = name;
    };

    ColumnChart.prototype.setNormReferenceId = function(id) {
      return this.normReferenceId = id;
    };

    ColumnChart.prototype.getCurrentMetric = function() {
      return this.currentMetric || _.first(this.at(0).attributes.chartMetrics).name;
    };

    return ColumnChart;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.FormRenderer = (function(_super) {
    __extends(FormRenderer, _super);

    function FormRenderer() {
      this.destroyInQueue = __bind(this.destroyInQueue, this);
      this.triggerIfComplete = __bind(this.triggerIfComplete, this);
      this.removeFromDestructionQueue = __bind(this.removeFromDestructionQueue, this);
      this.addToDestructionQueue = __bind(this.addToDestructionQueue, this);
      this.toJSON = __bind(this.toJSON, this);
      this.onLastStep = __bind(this.onLastStep, this);
      this.stepLength = __bind(this.stepLength, this);
      this.currentStepNo = __bind(this.currentStepNo, this);
      this.formTemplate = __bind(this.formTemplate, this);
      this.subjectId = __bind(this.subjectId, this);
      this.formModelId = __bind(this.formModelId, this);
      this.nextStep = __bind(this.nextStep, this);
      this.createFormMetaData = __bind(this.createFormMetaData, this);
      this.createFormModel = __bind(this.createFormModel, this);
      this.initialize = __bind(this.initialize, this);
      return FormRenderer.__super__.constructor.apply(this, arguments);
    }

    FormRenderer.prototype.initialize = function() {
      this.createFormMetaData();
      this.createFormModel();
      this.destructionQueue = new Backbone.Collection;
      this.listenTo(App.Event, "addToDestructionQueue", this.addToDestructionQueue);
      this.listenTo(App.Event, "removeFromDestructionQueue", this.removeFromDestructionQueue);
      this.on("change:formModel", this.createFormModel);
      this.on("change:formMetaData", this.createFormMetaData);
      this.paramRoot = this.get("formModel").get("paramRoot");
      return this.url = function() {
        return "" + (this.get('formModel').url()) + "/step/" + (this.currentStepNo());
      };
    };

    FormRenderer.prototype.createFormModel = function() {
      var formModel;
      formModel = new App.Models.Base(_.extend(this.get('formModel'), {
        schema: this.get('schema')
      }));
      return this.set("formModel", formModel, {
        silent: true
      });
    };

    FormRenderer.prototype.createFormMetaData = function() {
      return this.set('formMetaData', new Backbone.Model(this.get("formMetaData")), {
        silent: true
      });
    };

    FormRenderer.prototype.nextStep = function() {
      this.get("formMetaData").set("currentStep", this.currentStepNo() + 1);
      return this.trigger("change:step", this);
    };

    FormRenderer.prototype.formModelId = function() {
      return this.get("formModel").get("id");
    };

    FormRenderer.prototype.subjectId = function() {
      return this.get("formModel").get("subject").id;
    };

    FormRenderer.prototype.formTemplate = function() {
      return this.get('formMetaData').get('formTemplate');
    };

    FormRenderer.prototype.currentStepNo = function() {
      return Number(this.get('formMetaData').get('currentStep'));
    };

    FormRenderer.prototype.stepLength = function() {
      return this.get("formMetaData").get('stepNames').length;
    };

    FormRenderer.prototype.onLastStep = function() {
      return this.currentStepNo() === this.stepLength();
    };

    FormRenderer.prototype.i18nStepName = function(stepName) {
      return I18n.translate("forms." + (this.formTemplate()) + ".steps." + stepName);
    };

    FormRenderer.prototype.urlOnComplete = function() {
      var location;
      return location = "" + window.location.protocol + "//" + window.location.host;
    };

    FormRenderer.prototype.toJSON = function() {
      return this.get("formModel").toJSON();
    };

    FormRenderer.prototype.addToDestructionQueue = function(model) {
      return this.destructionQueue.add(model);
    };

    FormRenderer.prototype.removeFromDestructionQueue = function(model) {
      return this.destructionQueue.remove(model);
    };

    FormRenderer.prototype.triggerIfComplete = function() {
      if (this.destructionQueue.length === 0) {
        return this.trigger("destructionComplete");
      }
    };

    FormRenderer.prototype.destroyInQueue = function() {
      var callbacks, renderer;
      this.triggerIfComplete();
      renderer = this;
      callbacks = {
        success: function(model, response) {
          return renderer.triggerIfComplete();
        },
        error: function(model, response) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "formRenderer.js.coffee:destroyInQueue()"
          });
        }
      };
      return this.destructionQueue.each((function(i) {
        var model;
        model = this.destructionQueue.pop();
        return model.destroy(callbacks);
      }), this);
    };

    return FormRenderer;

  })(Backbone.Model);

}).call(this);
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
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Line = (function(_super) {
    __extends(Line, _super);

    function Line() {
      this.removeItems = __bind(this.removeItems, this);
      this.addItems = __bind(this.addItems, this);
      this.clearDialogItem = __bind(this.clearDialogItem, this);
      this.hasDialog = __bind(this.hasDialog, this);
      this.previousDialogView = __bind(this.previousDialogView, this);
      this.currentDialogView = __bind(this.currentDialogView, this);
      this.previousDialogItem = __bind(this.previousDialogItem, this);
      this.currentDialogItem = __bind(this.currentDialogItem, this);
      this.setPreviousDialogItem = __bind(this.setPreviousDialogItem, this);
      this.setCurrentDialogItem = __bind(this.setCurrentDialogItem, this);
      this.subjectId = __bind(this.subjectId, this);
      this.url = __bind(this.url, this);
      return Line.__super__.constructor.apply(this, arguments);
    }

    Line.prototype.initialize = function() {
      this.urlRoot = "/people/:subject_id/responder_items/survey/";
      this.timeline = this.get('timeline');
      return this.on("updateDialog", this.setCurrentDialogItem);
    };

    Line.prototype.url = function() {
      var base;
      base = this.urlRoot.replace(/:subject_id/, this.subjectId());
      return "" + base + (_.endsWith(base, '/') ? '' : void 0) + (encodeURIComponent(this.get('survey_id')));
    };

    Line.prototype.subjectId = function() {
      return this.get("timeline").getSubjectId();
    };

    Line.prototype.setCurrentDialogItem = function(item) {
      this.setPreviousDialogItem(item);
      return this.set({
        currentDialogItem: item
      });
    };

    Line.prototype.setPreviousDialogItem = function() {
      if (this.currentDialogItem() != null) {
        return this.set({
          previousDialogItem: this.currentDialogItem()
        });
      }
    };

    Line.prototype.currentDialogItem = function() {
      return this.get('currentDialogItem');
    };

    Line.prototype.previousDialogItem = function() {
      return this.get('previousDialogItem');
    };

    Line.prototype.currentDialogView = function() {
      return this.currentDialogItem().get("dialogView");
    };

    Line.prototype.previousDialogView = function() {
      return this.previousDialogItem().get("dialogView");
    };

    Line.prototype.hasDialog = function() {
      return this.get('currentDialogItem') != null;
    };

    Line.prototype.clearDialogItem = function() {
      return this.set({
        previousDialogItem: null
      });
    };

    Line.prototype.addItems = function(items) {
      return this.get('items').add(items);
    };

    Line.prototype.removeItems = function() {
      this.trigger('remove', this);
      return this.collection.remove(this, {
        silent: true
      });
    };

    return Line;

  })(Backbone.Model);

  App.Collections.LineCollection = (function(_super) {
    __extends(LineCollection, _super);

    function LineCollection() {
      this.addLine = __bind(this.addLine, this);
      this.subjectId = __bind(this.subjectId, this);
      this.setSubjectId = __bind(this.setSubjectId, this);
      return LineCollection.__super__.constructor.apply(this, arguments);
    }

    LineCollection.prototype.model = App.Models.Line;

    LineCollection.prototype.url = "/people/:subject_id/";

    LineCollection.prototype.initialize = function(lines, timeline) {
      this.models = lines;
      return this.timeline = timeline;
    };

    LineCollection.prototype.setSubjectId = function(id) {
      return this.subjectId = id;
    };

    LineCollection.prototype.subjectId = function() {
      return this.subjectId;
    };

    LineCollection.prototype.addLine = function(params) {
      var line, that;
      params.timeline = this.timeline;
      line = new App.Models.Line(params);
      that = this;
      return line.fetch({
        success: function(model, response) {
          var items;
          items = new App.Collections.ResponderItemsCollection(response);
          params.items = items;
          line = new App.Models.Line(params);
          return that.add(line);
        },
        error: function(response) {
          throw "ERROR: in fetching line with id: " + params;
        }
      });
    };

    return LineCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.LineChart = (function(_super) {
    __extends(LineChart, _super);

    function LineChart() {
      this.setContainerName = __bind(this.setContainerName, this);
      this.addParametersToUrl = __bind(this.addParametersToUrl, this);
      this.respondentUrlSegment = __bind(this.respondentUrlSegment, this);
      this.surveyUrlSegment = __bind(this.surveyUrlSegment, this);
      return LineChart.__super__.constructor.apply(this, arguments);
    }

    LineChart.prototype.initialize = function() {
      this.item = this.get('item');
      this.urlRoot = "/people/:subject_id/responder_items/responses/";
      this.url = function() {
        var base;
        base = this.urlRoot.replace(/:subject_id/, this.item.get('subject_id'));
        return "" + base + (_.endsWith(base, '/') ? '' : void 0) + (this.addParametersToUrl());
      };
      return this.bind("change:charts", this.setContainerName);
    };

    LineChart.prototype.surveyUrlSegment = function() {
      return encodeURIComponent(this.item.get('survey_id'));
    };

    LineChart.prototype.respondentUrlSegment = function() {
      return encodeURIComponent(this.item.get('respondent_id'));
    };

    LineChart.prototype.addParametersToUrl = function() {
      return "" + (this.respondentUrlSegment()) + "/" + (this.surveyUrlSegment());
    };

    LineChart.prototype.setContainerName = function() {
      if (this.get("charts") != null) {
        return _.each(this.get("charts"), function(c) {
          return c.chart.renderTo = "line-" + c.chart.renderTo;
        });
      }
    };

    return LineChart;

  })(Backbone.Model);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.NationalRegisterEntry = (function(_super) {
    __extends(NationalRegisterEntry, _super);

    function NationalRegisterEntry() {
      return NationalRegisterEntry.__super__.constructor.apply(this, arguments);
    }

    NationalRegisterEntry.prototype.urlRoot = "/national_registers";

    NationalRegisterEntry.prototype.initialize = function() {
      return this.url = function() {
        return "" + this.urlRoot + "/" + (this.get('cpr'));
      };
    };

    return NationalRegisterEntry;

  })(App.Models.Base);

  App.Collections.NationalRegister = (function(_super) {
    __extends(NationalRegister, _super);

    function NationalRegister() {
      return NationalRegister.__super__.constructor.apply(this, arguments);
    }

    NationalRegister.prototype.model = App.Models.NationalRegisterEntry;

    NationalRegister.prototype.url = "/national_registers";

    return NationalRegister;

  })(App.Collections.Base);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Person = (function(_super) {
    __extends(Person, _super);

    function Person() {
      this.separateAddressCallbacks = __bind(this.separateAddressCallbacks, this);
      this.commonAddressCallbacks = __bind(this.commonAddressCallbacks, this);
      this.getCprFields = __bind(this.getCprFields, this);
      this.setAddres = __bind(this.setAddres, this);
      return Person.__super__.constructor.apply(this, arguments);
    }

    Person.prototype.defaults = {
      "object_class": "person",
      "i18n": "person"
    };

    Person.prototype.urlRoot = "/people";

    Person.prototype.paramRoot = 'person';

    Person.prototype.blacklist = ["family"];

    Person.prototype.initialize = function() {
      var spouseRelationship;
      Person.__super__.initialize.apply(this, arguments);
      spouseRelationship = this.get("spouse_relationships");
      if (spouseRelationship) {
        spouseRelationship.on("statusUpdate", this.setAddres);
      }
      this.on('change:family', (function(_this) {
        return function(model, attribute) {
          return App.Event.trigger('person:cpr:populate_from_select', attribute);
        };
      })(this));
      this.on('change:full_cpr', this.getCprFields);
      this.on('change:form', (function(_this) {
        return function() {
          var family, options;
          family = _this.get('family');
          if (family) {
            options = _.map(family, (function(v) {
              return {
                val: _.keys(v)[0],
                label: _.values(v)[0]
              };
            }), _this);
            _this.get('form').fields.family.editor.setOptions(options);
          }
          if (_.has(_this.attributes, 'full_cpr')) {
            return App.Event.on('person:cpr:populate_from_select', function(attribute) {
              return _this.set('full_cpr', attribute, {
                formUpdate: true
              });
            });
          }
        };
      })(this));
      return this;
    };

    Person.prototype.setAddres = function(model) {
      var address, spouse_id;
      address = this.get("address");
      if (model.changed.status == null) {
        if (model.get("status") === true) {
          address.set("submitDisabled", model.get("status"));
        }
        return;
      }
      if (model.get('status') === true) {
        spouse_id = _.difference(_.filter(model.attributes, function(v, k) {
          return k.search(/person|relation/) !== -1;
        }), [this.get('id')]);
        address.set("person_id", spouse_id, {
          silent: true
        });
        return address.fetch(this.commonAddressCallbacks());
      } else {
        if (this.get('id')) {
          address.set("person_id", this.get('id'));
          return address.fetch(this.separateAddressCallbacks());
        } else {
          address.clearFormAttributes();
          return address.enableFields();
        }
      }
    };

    Person.prototype.getCprFields = function(person) {
      var address, cpr, entry, thisModel;
      thisModel = this;
      address = thisModel.get("address");
      cpr = person.get('full_cpr');
      if (cpr.length === 10) {
        entry = new App.Models.NationalRegisterEntry({
          cpr: cpr
        });
        return entry.fetch({
          success: function(model, response) {
            thisModel.set(response, {
              formUpdate: true
            });
            if (_.isFunction(address.set)) {
              return address.set(response, {
                formUpdate: true
              });
            }
          },
          error: function(model, xhr, options) {
            throw I18n.t("marionette.errors.error_in_function", {
              "function": "Person:getCprFields"
            });
          }
        });
      }
    };

    Person.prototype.commonAddressCallbacks = function() {
      var callbacks, thisModel;
      thisModel = this;
      return callbacks = {
        formUpdate: true,
        success: function(model, response) {
          model.disableFields();
          return thisModel.set('address_id', model.get('id'));
        },
        error: function(model, xhr, options) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "Person:commonAddressCallbacks"
          });
        }
      };
    };

    Person.prototype.separateAddressCallbacks = function() {
      var callbacks, thisModel;
      thisModel = this;
      return callbacks = {
        success: function(model, response) {
          if (model.previous("id") === model.get("id")) {
            model.clearFormAttributes();
          }
          thisModel.set('address_id', model.get('id'));
          return model.enableFields();
        },
        error: function(model, xhr, options) {
          throw I18n.t("marionette.errors.error_in_function", {
            "function": "Person:separateAddressCallbacks"
          });
        }
      };
    };

    return Person;

  })(App.Models.Base);

  App.Collections.Person = (function(_super) {
    __extends(Person, _super);

    function Person() {
      return Person.__super__.constructor.apply(this, arguments);
    }

    Person.prototype.model = App.Models.Person;

    Person.prototype.paramRoot = "people";

    return Person;

  })(App.Collections.Base);

  App.Models.Aliases.Relations = App.Models.Person;

  App.Models.Aliases.InverseRelations = App.Models.Person;

  App.Models.Aliases.Relation = App.Models.Person;

  App.Models.Aliases.InverseRelation = App.Models.Person;

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App.Models.QuestionResponse = (function(_super) {
    __extends(QuestionResponse, _super);

    function QuestionResponse() {
      return QuestionResponse.__super__.constructor.apply(this, arguments);
    }

    QuestionResponse.prototype.initialize = function() {
      return this.set('surveyAccessCode', this.collection.surveyAccessCode());
    };

    return QuestionResponse;

  })(Backbone.Model);

  App.Collections.QuestionResponse = (function(_super) {
    __extends(QuestionResponse, _super);

    function QuestionResponse() {
      this.surveyAccessCode = __bind(this.surveyAccessCode, this);
      return QuestionResponse.__super__.constructor.apply(this, arguments);
    }

    QuestionResponse.prototype.model = App.Models.QuestionResponse;

    QuestionResponse.prototype.urlRoot = "/responder_items/responses/:id/question_group/:question_group_name";

    QuestionResponse.prototype.initialize = function(questionGroupName, chart) {
      this.questionGroupName = questionGroupName;
      this.responderItem = chart.responderItem();
      return this.url = function() {
        var url;
        url = this.urlRoot.replace(/\:id/, this.responderItem.get('id'));
        return url = url.replace(/\:question_group_name/, this.questionGroupName);
      };
    };

    QuestionResponse.prototype.surveyAccessCode = function() {
      return this.responderItem.get('access_code');
    };

    QuestionResponse.prototype.placement = function(size) {
      var dimensions, margin;
      dimensions = App.Timeline.Dimensions;
      margin = (dimensions.line_height_expanded - size) / 2;
      if (margin > (dimensions.line_height / 2)) {
        return margin;
      } else {
        return dimensions.line_height / 2;
      }
    };

    QuestionResponse.prototype.tableHeight = function(size) {
      var dimensions;
      dimensions = App.Timeline.Dimensions;
      if ((size + dimensions.line_height) > dimensions.line_height) {
        return size + dimensions.line_height;
      }
    };

    return QuestionResponse;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Relationship = (function(_super) {
    __extends(Relationship, _super);

    function Relationship() {
      this.setSelectFieldTitle = __bind(this.setSelectFieldTitle, this);
      return Relationship.__super__.constructor.apply(this, arguments);
    }

    Relationship.prototype.initialize = function() {
      Relationship.__super__.initialize.apply(this, arguments);
      return this.on("change:form", function(model, form) {
        return model.trigger("change:status", model);
      });
    };

    Relationship.prototype.setSelectFieldTitle = function() {
      var select, selectWithTitle;
      select = _.filter(this.schema, (function(v, k) {
        var _ref;
        return (v != null ? (_ref = v.type) != null ? _ref.search(/Select|Checkbox|Radio/) : void 0 : void 0) > -1;
      }));
      return selectWithTitle = _.map(select, (function(i) {
        return i.title = this.get('name');
      }), this);
    };

    Relationship.prototype.fieldTitle = function(field) {
      Relationship.__super__.fieldTitle.apply(this, arguments);
      return this.i18nTitle("" + (this.get('object_class')) + ".is_" + (this.get('name')));
    };

    return Relationship;

  })(App.Models.Base);

  App.Collections.Relationships = (function(_super) {
    __extends(Relationships, _super);

    function Relationships() {
      this.toJSON = __bind(this.toJSON, this);
      this.renewModel = __bind(this.renewModel, this);
      this.setRelationship = __bind(this.setRelationship, this);
      return Relationships.__super__.constructor.apply(this, arguments);
    }

    Relationships.prototype.model = App.Models.Relationship;

    Relationships.prototype.url = '/relationships';

    Relationships.prototype.initialize = function(models, options) {
      Relationships.__super__.initialize.apply(this, arguments);
      this.on("change:status", this.setRelationship);
      return this.on("remove", this.renewModel);
    };

    Relationships.prototype.setRelationship = function(model) {
      this.trigger('statusUpdate', model);
      if (model.changed.status != null) {
        if (model.get('status') === false && !model.isNew()) {
          return App.Event.trigger("addToDestructionQueue", model);
        } else if (model.get('status') === true) {
          return App.Event.trigger("removeFromDestructionQueue", model);
        }
      }
    };

    Relationships.prototype.renewModel = function(model) {
      var attrs, modelAttrs;
      attrs = _.without(model.getSchemaFields(), 'id');
      attrs.push("form", "schema");
      modelAttrs = _.pick(model.attributes, attrs);
      return this.add(modelAttrs);
    };

    Relationships.prototype.toJSON = function() {
      return _.chain(this.models).map((function(i) {
        if (i.get('status') !== false) {
          return i.toJSON();
        }
      }), this).compact().value();
    };

    return Relationships;

  })(App.Collections.Base);

  App.Models.Relationships = App.Models.Relationship;

  App.Models.Aliases.InverseRelationships = App.Models.Relationship;

  App.Collections.Aliases.InverseRelationships = App.Collections.Relationships;

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.ResponderItem = (function(_super) {
    __extends(ResponderItem, _super);

    function ResponderItem() {
      this.status = __bind(this.status, this);
      this.isPending = __bind(this.isPending, this);
      this.isOverdue = __bind(this.isOverdue, this);
      this.isCompleted = __bind(this.isCompleted, this);
      this.deadlineIsPassed = __bind(this.deadlineIsPassed, this);
      return ResponderItem.__super__.constructor.apply(this, arguments);
    }

    ResponderItem.prototype.urlRoot = "/responder_items";

    ResponderItem.prototype.deadlineIsPassed = function() {
      var deadline;
      deadline = Date.parse(this.get('deadline'));
      return deadline.isBefore(Date.today());
    };

    ResponderItem.prototype.isCompleted = function() {
      return this.get('completed') != null;
    };

    ResponderItem.prototype.isOverdue = function() {
      return !this.isPending() && !this.isCompleted();
    };

    ResponderItem.prototype.isPending = function() {
      return !this.isCompleted() && !this.deadlineIsPassed();
    };

    ResponderItem.prototype.status = function() {
      if (this.isCompleted()) {
        return "completed";
      } else if (this.isPending()) {
        return "pending";
      } else if (this.isOverdue()) {
        return "overdue";
      }
    };

    return ResponderItem;

  })(Backbone.Model);

  App.Collections.ResponderItemsCollection = (function(_super) {
    __extends(ResponderItemsCollection, _super);

    function ResponderItemsCollection() {
      return ResponderItemsCollection.__super__.constructor.apply(this, arguments);
    }

    ResponderItemsCollection.prototype.model = App.Models.ResponderItem;

    return ResponderItemsCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Subject = (function(_super) {
    __extends(Subject, _super);

    function Subject() {
      this.getUrlRoot = __bind(this.getUrlRoot, this);
      return Subject.__super__.constructor.apply(this, arguments);
    }

    Subject.prototype.paramRoot = "subject";

    Subject.prototype.initialize = function() {
      Subject.__super__.initialize.apply(this, arguments);
      return this.urlRoot = this.getUrlRoot();
    };

    Subject.prototype.getUrlRoot = function() {
      return function() {
        var urlRoot;
        if (this.collection == null) {
          urlRoot = App.Collections.Subject.prototype.url;
          return urlRoot.replace(/\:id/, this.get("caretaker_id"));
        } else {
          return this.collection.url();
        }
      };
    };

    return Subject;

  })(App.Models.Person);

  App.Collections.Subject = (function(_super) {
    __extends(Subject, _super);

    function Subject() {
      return Subject.__super__.constructor.apply(this, arguments);
    }

    Subject.prototype.model = App.Models.Subject;

    Subject.prototype.url = "/caretaker/:id/subjects";

    Subject.prototype.initialize = function(models, options) {
      this.caretakerId = options.caretaker_id;
      return this.url = function() {
        return this.url.replace(/\:id/, this.caretakerId);
      };
    };

    return Subject;

  })(App.Collections.Person);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.SurveyMenuItem = (function(_super) {
    __extends(SurveyMenuItem, _super);

    function SurveyMenuItem() {
      this.addLine = __bind(this.addLine, this);
      this.hideLine = __bind(this.hideLine, this);
      this.showLine = __bind(this.showLine, this);
      this.subjectId = __bind(this.subjectId, this);
      return SurveyMenuItem.__super__.constructor.apply(this, arguments);
    }

    SurveyMenuItem.prototype.subjectId = function() {
      return this.get('timeline').getSubjectId();
    };

    SurveyMenuItem.prototype.showLine = function(line) {
      this.set({
        visibility: 'visible',
        line: line
      });
      return line.set({
        menuItem: this
      });
    };

    SurveyMenuItem.prototype.hideLine = function() {
      this.set({
        visibility: "hidden"
      });
      this.get('line').set({
        menuItem: null
      });
      return this.unset('line');
    };

    SurveyMenuItem.prototype.addLine = function() {
      return this.get('lines').addLine({
        survey_id: this.get("id"),
        name: this.get("access_code"),
        timeline: this.get('timeline')
      });
    };

    return SurveyMenuItem;

  })(Backbone.Model);

  App.Collections.SurveyMenuItemCollection = (function(_super) {
    __extends(SurveyMenuItemCollection, _super);

    function SurveyMenuItemCollection() {
      return SurveyMenuItemCollection.__super__.constructor.apply(this, arguments);
    }

    SurveyMenuItemCollection.prototype.model = App.Models.SurveyMenuItem;

    return SurveyMenuItemCollection;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Timeline = (function(_super) {
    __extends(Timeline, _super);

    function Timeline() {
      this.getChartHeight = __bind(this.getChartHeight, this);
      this.getSurveyAccessCode = __bind(this.getSurveyAccessCode, this);
      this.positionOnLine = __bind(this.positionOnLine, this);
      this.dayPixelsFromMonthStart = __bind(this.dayPixelsFromMonthStart, this);
      this.monthPixelsFromStart = __bind(this.monthPixelsFromStart, this);
      this.monthsFromStart = __bind(this.monthsFromStart, this);
      this.centeredDatePosition = __bind(this.centeredDatePosition, this);
      this.goToDate = __bind(this.goToDate, this);
      this.changePosition = __bind(this.changePosition, this);
      this.endPosition = __bind(this.endPosition, this);
      this.step = __bind(this.step, this);
      this.hasOpenLine = __bind(this.hasOpenLine, this);
      this.getOpenLine = __bind(this.getOpenLine, this);
      this.setOpenLine = __bind(this.setOpenLine, this);
      this.getSubjectId = __bind(this.getSubjectId, this);
      this.fillSurveyMenu = __bind(this.fillSurveyMenu, this);
      return Timeline.__super__.constructor.apply(this, arguments);
    }

    Timeline.prototype.initialize = function() {
      var years, _i, _ref, _ref1, _results;
      years = {
        years: (function() {
          _results = [];
          for (var _i = _ref = this.get("starts"), _ref1 = this.get("ends"); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this)
      };
      this.set(years);
      this.set({
        subject: new App.Models.Subject(this.get('subject'))
      });
      this.set({
        lines: new App.Collections.LineCollection([], this)
      });
      this.get('lines').setSubjectId(this.getSubjectId());
      return this.set({
        surveyMenu: new App.Collections.SurveyMenuItemCollection([])
      });
    };

    Timeline.prototype.fillSurveyMenu = function() {
      return this.get('surveyMenu').add(this.get('surveys'));
    };

    Timeline.prototype.getSubjectId = function() {
      return this.get('subject').id;
    };

    Timeline.prototype.setOpenLine = function(line) {
      return this.set({
        openLine: line
      });
    };

    Timeline.prototype.getOpenLine = function() {
      return this.get('openLine');
    };

    Timeline.prototype.hasOpenLine = function() {
      return this.getOpenLine() != null;
    };

    Timeline.prototype.step = function(steps) {
      var movement, position;
      movement = this.get("month_width") * steps;
      position = this.get("current_position") + movement;
      return this.changePosition(position);
    };

    Timeline.prototype.endPosition = function() {
      return this.get("canvas_width") - this.get('history_width');
    };

    Timeline.prototype.changePosition = function(position) {
      var end, gutter;
      gutter = this.get("gutter_width");
      end = this.endPosition();
      if (position > gutter) {
        position = gutter;
      }
      if (position < end) {
        position = end;
      }
      return this.set({
        current_position: position
      });
    };

    Timeline.prototype.goToDate = function() {
      var position;
      position = this.monthPixelsFromStart(this.centeredDatePosition());
      return this.changePosition(-position);
    };

    Timeline.prototype.centeredDatePosition = function() {
      return this.get('current_date').moveToFirstDayOfMonth().add(-7).month();
    };

    Timeline.prototype.monthsFromStart = function(date) {
      var starts;
      starts = new XDate("" + (this.get("starts")));
      return Math.floor(starts.diffMonths(date));
    };

    Timeline.prototype.monthPixelsFromStart = function(date) {
      return this.monthsFromStart(date) * this.get('month_width');
    };

    Timeline.prototype.dayPixelsFromMonthStart = function(date) {
      var daysInMonth;
      daysInMonth = XDate.getDaysInMonth(date.getFullYear(), date.getMonth());
      return (this.get('month_width') / daysInMonth) * (date.getDate() - 1);
    };

    Timeline.prototype.positionOnLine = function(date) {
      date = new XDate(date.toString());
      return this.monthPixelsFromStart(date) + this.dayPixelsFromMonthStart(date);
    };

    Timeline.prototype.getSurveyAccessCode = function(id) {
      var _ref;
      return (_ref = _.find(this.get('surveys'), function(o) {
        return o.id === +id;
      })) != null ? _ref.access_code : void 0;
    };

    Timeline.prototype.getChartHeight = function() {
      return this.get('line_height_expanded') - this.get('line_height');
    };

    return Timeline;

  })(Backbone.Model);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.User = (function(_super) {
    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.urlRoot = "/users";

    User.prototype.paramRoot = '/users';

    return User;

  })(App.Models.Base);

}).call(this);
