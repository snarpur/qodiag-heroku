jQuery.fn.selectToUISlider=function(g){function m(a){return"text"==c.tooltipSrc?e[a].text:e[a].value}var k=jQuery(this),c=jQuery.extend({labels:3,tooltip:!0,tooltipSrc:"text",labelSrc:"value",sliderOptions:null},g),q=function(){var a=[];k.each(function(){a.push("handle_"+jQuery(this).attr("id"))});return a}(),e=function(){var a=[];k.eq(0).find("option").each(function(){a.push({value:jQuery(this).attr("value"),text:jQuery(this).text()})});return a}(),l=function(){if(0<k.eq(0).find("optgroup").size()){var a=
[];k.eq(0).find("optgroup").each(function(b){a[b]={};a[b].label=jQuery(this).attr("label");a[b].options=[];jQuery(this).find("option").each(function(){a[b].options.push({text:jQuery(this).text(),value:jQuery(this).attr("value")})})});return a}return null}(),h={step:1,min:0,orientation:"horizontal",max:e.length-1,range:1<k.length,slide:function(a,b){var f=jQuery(b.handle),c=m(b.value);f.attr("aria-valuetext",c).attr("aria-valuenow",b.value).find(".ui-slider-tooltip .ttContent").text(c);jQuery("#"+
f.attr("id").split("handle_")[1]).find("option").eq(b.value).attr("selected","selected")},values:function(){var a=[];k.each(function(){a.push(jQuery(this).get(0).selectedIndex)});return a}()};c.sliderOptions=g?jQuery.extend(h,g.sliderOptions):h;k.bind("change keyup click",function(){var a=jQuery(this).get(0).selectedIndex,b=jQuery("#handle_"+jQuery(this).attr("id")),f=b.data("handleNum");b.parents(".ui-slider:eq(0)").slider("values",f,a)});var d=jQuery("<div></div>");k.each(function(a){var b="",f=
jQuery("label[for="+jQuery(this).attr("id")+"]"),e=0<f.size()?"Slider control for "+f.text()+"":"",f=f.attr("id")||f.attr("id","label_"+q[a]).attr("id");!1==c.tooltip&&(b=' style="display: none;"');jQuery('<a href="#" tabindex="0" id="'+q[a]+'" class="ui-slider-handle" role="slider" aria-labelledby="'+f+'" aria-valuemin="'+c.sliderOptions.min+'" aria-valuemax="'+c.sliderOptions.max+'" aria-valuenow="'+c.sliderOptions.values[a]+'" aria-valuetext="'+m(c.sliderOptions.values[a])+'" ><span class="screenReaderContext">'+
e+'</span><span class="ui-slider-tooltip ui-widget-content ui-corner-all"'+b+'><span class="ttContent"></span><span class="ui-tooltip-pointer-down ui-widget-content"><span class="ui-tooltip-pointer-down-inner"></span></span></span></a>').data("handleNum",a).appendTo(d)});if(l){var n=0,p=d.append('<dl class="ui-slider-scale ui-helper-reset" role="presentation"></dl>').find(".ui-slider-scale:eq(0)");jQuery(l).each(function(a){p.append('<dt style="width: '+(100/l.length).toFixed(2)+"%; left:"+(100*(a/
(l.length-1))).toFixed(2)+'%"><span>'+this.label+"</span></dt>");var b=this.options;jQuery(this.options).each(function(a){var d=n==e.length-1||0==n?'style="display: none;"':"";a="text"==c.labelSrc?b[a].text:b[a].value;p.append('<dd style="left:'+((100*(n/(e.length-1))).toFixed(2)+"%")+'"><span class="ui-slider-label">'+a+'</span><span class="ui-slider-tic ui-widget-content"'+d+"></span></dd>");n++})})}else p=d.append('<ol class="ui-slider-scale ui-helper-reset" role="presentation"></ol>').find(".ui-slider-scale:eq(0)"),
jQuery(e).each(function(a){var b=a==e.length-1||0==a?'style="display: none;"':"",d="text"==c.labelSrc?this.text:this.value;p.append('<li style="left:'+((100*(a/(e.length-1))).toFixed(2)+"%")+'"><span class="ui-slider-label">'+d+'</span><span class="ui-slider-tic ui-widget-content"'+b+"></span></li>")});1<c.labels&&d.find(".ui-slider-scale li:last span.ui-slider-label, .ui-slider-scale dd:last span.ui-slider-label").addClass("ui-slider-label-show");g=Math.max(1,Math.round(e.length/c.labels));for(h=
0;h<e.length;h+=g)e.length-h>g&&d.find(".ui-slider-scale li:eq("+h+") span.ui-slider-label, .ui-slider-scale dd:eq("+h+") span.ui-slider-label").addClass("ui-slider-label-show");d.find(".ui-slider-scale dt").each(function(a){jQuery(this).css({left:(100/l.length*a).toFixed(2)+"%"})});d.insertAfter(jQuery(this).eq(this.length-1)).slider(c.sliderOptions).attr("role","application").find(".ui-slider-label").each(function(){jQuery(this).css("marginLeft",-jQuery(this).width()/2)});d.find(".ui-tooltip-pointer-down-inner").each(function(){var a=
jQuery(".ui-tooltip-pointer-down-inner").css("borderTopWidth"),b=jQuery(this).parents(".ui-slider-tooltip").css("backgroundColor");jQuery(this).css("border-top",a+" solid "+b)});g=d.slider("values");g.constructor==Array?jQuery(g).each(function(a){d.find(".ui-slider-tooltip .ttContent").eq(a).text(m(this))}):d.find(".ui-slider-tooltip .ttContent").eq(0).text(m(g));return this};