(function() {
  $(document).ready(function() {
    var answers;
    answers = $(".choices-group");
    $("label.error").remove();
    $("input[type = submit]").addClass("btn btn-success");
    $("input[type = submit]").bind('click', function(e) {
      $("label.error").remove();
      answers.each(function() {
        var fieldset;
        fieldset = $(this).parents("fieldset.pick-one");
        if ($(fieldset).find("input[type='radio']:checked").size() === 0) {
          return fieldset.setCssState("invalid");
        } else {
          return fieldset.setCssState("valid");
        }
      });
      if ($("#surveyor").find(".state-invalid").size() !== 0) {
        $(".next_section").append("<label class='error'>" + I18n.t('entry_set.messages.question_saved') + "</label>");
        return false;
      } else {
        $("label.error").remove();
        return true;
      }
    });
    return $(".survey_section").delegate(".state-invalid input[type=radio]", "click", function(e) {
      $(this).parents("fieldset.pick-one").setCssState("valid");
      if ($("#surveyor").find(".state-invalid").size() === 0) {
        return $("label.error").remove();
      }
    });
  });

}).call(this);
