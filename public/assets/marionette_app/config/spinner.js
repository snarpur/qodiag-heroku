(function() {
  (function($) {
    return $.fn.spinner = function(obj, init) {
      var options, spinner;
      if (obj == null) {
        obj = {};
      }
      if (init == null) {
        init = true;
      }
      options = {
        lines: 13,
        length: 7,
        width: 4,
        radius: 10,
        corners: 1,
        rotate: 0,
        color: "#000",
        speed: 1,
        trail: 60,
        shadow: false,
        hwaccel: false,
        className: "spinner",
        zIndex: 2e9,
        top: '50%',
        left: "auto"
      };
      spinner = new Spinner(options);
      return spinner.spin(this[0]);
    };
  })($);

}).call(this);
