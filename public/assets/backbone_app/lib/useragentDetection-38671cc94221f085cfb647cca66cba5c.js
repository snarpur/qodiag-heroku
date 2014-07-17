(function() {
  App.Lib.useragentDetection = (function() {
    function useragentDetection() {
      var bw;
      bw = new App.Views.useragentDetectionView({
        browser: $.browser
      });
      $("#wrapper").append(bw.render().el);
    }

    return useragentDetection;

  })();

}).call(this);
