(function() {
  this.Qapp.module("CollectionMixins", function(CollectionMixins, App, Backbone, Marionette, $, _) {
    return CollectionMixins.NestedValidation = {
      validateNested: function() {
        this.modelCids = _.pluck(this.models, 'cid');
        this.validated = [];
        this._errors = [];
        return this.each((function(_this) {
          return function(m) {
            _this.listenTo(m, "validated:invalid validated:valid", function(model, msg) {
              _this.validated.push(model.cid);
              if (_.isEmpty(_.difference(_this.modelCids, _this.validated))) {
                return _.each(_this.parents, function(p) {
                  return p.trigger("validated:" + _this.parentRelationsKey + ":collection", _this);
                });
              }
            });
            return m.validateNested();
          };
        })(this));
      }
    };
  });

}).call(this);
