(function() {
  $.fn.extend({
    helpOverlay: function() {
      var setUp, settings;
      settings = {
        trigger: 'a',
        overlay: "#help-overlay"
      };
      setUp = (function(_this) {
        return function() {
          return $(_this, settings.trigger).bind("click", function(e) {
            e.preventDefault();
            return $(settings.overlay).toggleClass("visible");
          });
        };
      })(this);
      return this.each(function() {
        return setUp(settings);
      });
    }
  });

}).call(this);
