(function() {
  (function(Backbone) {
    var methods, _helper, _sync;
    _sync = Backbone.sync;
    Backbone.sync = function(method, entity, options) {
      var sync;
      if (options == null) {
        options = {};
      }
      _.defaults(options, {
        type: _helper.methodMap[method],
        dataType: 'json',
        beforeSend: _.bind(methods.beforeSend, entity),
        complete: _.bind(methods.complete, entity)
      });
      _helper.jsonData(method, entity, options);
      _helper.ignoreProcessOnNonGet(method, entity, options);
      _helper.setUrl(entity, options);
      sync = _sync(method, entity, options);
      if (!entity._fetch && method === "read") {
        return entity._fetch = sync;
      }
    };
    methods = {
      beforeSend: function(xhr, options) {
        var token;
        if (!options.noCSRF) {
          token = $("meta[name=\"csrf-token\"]").attr("content");
          if (token) {
            xhr.setRequestHeader("X-CSRF-Token", token);
          }
        }
        return this.trigger("sync:start", this);
      },
      complete: function() {
        return this.trigger("sync:stop", this);
      }
    };
    return _helper = {
      methodMap: {
        'create': 'POST',
        'update': 'PUT',
        'delete': 'DELETE',
        'read': 'GET'
      },
      jsonData: function(method, entity, options) {
        var data;
        if (!options.data && entity && (method === 'create' || method === 'update')) {
          options.contentType = 'application/json';
          data = {};
          if (entity.paramRoot) {
            data[entity.paramRoot] = entity.toJSON();
          } else {
            data = entity.toJSON();
          }
          return options.data = JSON.stringify(data);
        }
      },
      ignoreProcessOnNonGet: function(method, entity, options) {
        if (options.type !== 'GET') {
          return options.processData = false;
        }
      },
      setUrl: function(entity, options) {
        if (!options.url) {
          return options.url = this.getUrl(entity) || this.urlError();
        }
      },
      getUrl: function(object) {
        if (!(object && object.url)) {
          return null;
        }
        if (_.isFunction(object.url)) {
          return object.url();
        } else {
          return object.url;
        }
      },
      urlError: function() {
        throw new Error(I18n.t("marionette.errors.url_not_found"));
      }
    };
  })(Backbone);

}).call(this);