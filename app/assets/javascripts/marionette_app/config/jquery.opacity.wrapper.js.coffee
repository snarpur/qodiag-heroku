do ($) ->
	$.fn.toggleWrapper = (obj = {}, init = true) ->
		_.defaults obj,
			className: ""
			backgroundColor: 'rgba(255,255,255,0.7)'
			zIndex: if @css("zIndex") is "auto" or 0 then 1000 else (Number) @css("zIndex")
			spinner: true

		$offset = @offset()
		$width 	= @outerWidth(false)
		$height = @outerHeight(false)
		
		if init
			wrapper = $("<div>")
				.appendTo("body")
					.addClass(obj.className)
						.attr("data-wrapper", true)
							.css
								width: $width
								height: $height 
								top: $offset.top
								left: $offset.left
								position: "absolute"
								zIndex: obj.zIndex + 1
								backgroundColor: obj.backgroundColor
			wrapper.spinner() if obj.spinner
			wrapper
		else
			$("[data-wrapper]").remove()


