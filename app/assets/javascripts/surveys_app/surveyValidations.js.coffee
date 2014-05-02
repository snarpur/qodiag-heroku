$(document).ready( () ->
	answers = $(".choices-group")
	$("label.error").remove()
	$("input[type = submit]").addClass("btn btn-primary")
	$("input[type = submit]").bind('click', (e) ->
		$("label.error").remove()
		answers.each(() ->
			fieldset = $(@).parents("fieldset.pick-one")
			if $(fieldset).find("input[type='radio']:checked").size() is 0
				fieldset.setCssState("invalid")
			else
				fieldset.setCssState("valid")
		)

		if $("#surveyor").find(".state-invalid").size() isnt 0
			$(".next_section").append("<label class='error'>There are unanswered questions!</label>")
			false
		else
			$("label.error").remove()
			true
	)
	
	$(".survey_section").delegate(".state-invalid input[type=radio]", "click", (e) ->
		$(@).parents("fieldset.pick-one").setCssState("valid")
		if $("#surveyor").find(".state-invalid").size() is 0
			$("label.error").remove()

	)

)