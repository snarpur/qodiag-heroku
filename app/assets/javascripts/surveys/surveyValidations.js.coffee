$(document).ready( () ->

	answers = $(".survey_section .pick-one > ol")
	$("input[type = submit]").bind('click', (e) ->
		invalid = []
		answers.each(() ->
			fieldset = $(@).parents("fieldset.pick-one")
			if $(@).find("input[type='radio']:checked").size() is 0
				invalid.push(fieldset)
				fieldset.setCssState("invalid")
			else
				fieldset.setCssState("valid")
		)

		if _.isEmpty(invalid) isnt true
			false
	)
	
	$(".survey_section").delegate(".state-invalid input[type=radio]", "click", (e) ->
		$(@).parents("fieldset.pick-one").setCssState("valid")
	)

)