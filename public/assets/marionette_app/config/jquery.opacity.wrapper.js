(function() {
  (function($) {
    return $.fn.toggleWrapper = function(obj, init) {
      var $height, $offset, $width, wrapper;
      if (obj == null) {
        obj = {};
      }
      if (init == null) {
        init = true;
      }
      _.defaults(obj, {
        className: "",
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: this.css("zIndex") === "auto" || 0 ? 1000 : Number(this.css("zIndex")),
        spinner: true
      });
      $offset = this.offset();
      $width = this.outerWidth(false);
      $height = this.outerHeight(false);
      if (init) {
        wrapper = $("<div>").appendTo("body").addClass(obj.className).attr("data-wrapper", true).css({
          width: $width,
          height: $height,
          top: $offset.top,
          left: $offset.left,
          position: "absolute",
          zIndex: obj.zIndex + 1,
          backgroundColor: obj.backgroundColor
        });
        if (obj.spinner) {
          wrapper.spinner();
        }
        return wrapper;
      } else {
        return $("[data-wrapper]").remove();
      }
    };
  })($);

}).call(this);