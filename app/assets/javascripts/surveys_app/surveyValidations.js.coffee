$(document).ready( () ->
	answers = $(".survey_section .pick-one > ol")
	invalid = []
	$("label.error").remove()
	$("input[type = submit]").bind('click', (e) ->
		# $("input[type = submit]").attr('disabled','disabled')
		# $(".next_section").prepend("<label class='error'>There are unanswered questions!</label>")
		answers.each(() ->
			fieldset = $(@).parents("fieldset.pick-one")
			if $(@).find("input[type='radio']:checked").size() is 0
				invalid.push(fieldset)
				fieldset.setCssState("invalid")
			else
				fieldset.setCssState("valid")
		)

		if _.isEmpty(invalid) isnt true
			$(".next_section").prepend("<label class='error'>There are unanswered questions!</label>")
			false
		else
			true
	)
	
	$(".survey_section").delegate(".state-invalid input[type=radio]", "click", (e) ->
		$(@).parents("fieldset.pick-one").setCssState("valid")
		invalid = _.rest(invalid)
		if _.size(invalid) is 0
			$('input[type="submit"]').removeAttr('disabled')
			$("label.error").remove()
	)

)
# $(document).ready( () ->

# 	answers = $(".survey_section .pick-one > ol")
# 	$("input[type = submit]").bind('click', (e) ->
# 	invalid = []
# 	answers.each(() ->
# 		fieldset = $(@).parents("fieldset.pick-one")
# 		if $(@).find("input[type='radio']:checked").size() is 0
# 			invalid.push(fieldset)
# 			fieldset.setCssState("invalid")
# 		else
# 			fieldset.setCssState("valid")
# 	)

# 	if _.isEmpty(invalid) isnt true
# 		false
# 	)

# 	$(".survey_section").delegate(".state-invalid input[type=radio]", "click", (e) ->
# 		$(@).parents("fieldset.pick-one").setCssState("valid")
# 	)
# )