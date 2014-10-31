(function(d,t){function r(){return new Date(Date.UTC.apply(Date,arguments))}function v(){var a=new Date;return r(a.getFullYear(),a.getMonth(),a.getDate())}function z(a){return function(){return this[a].apply(this,arguments)}}function C(a,b){function c(a,b){return b.toLowerCase()}var h=d(a).data(),f={},g,e=RegExp("^"+b.toLowerCase()+"([A-Z])");b=RegExp("^"+b.toLowerCase());for(var k in h)b.test(k)&&(g=k.replace(e,c),f[g]=h[k]);return f}function D(a){var b={};if(!m[a]&&(a=a.split("-")[0],!m[a]))return;
var c=m[a];d.each(E,function(a,d){d in c&&(b[d]=c[d])});return b}var x=d(window),A=function(){var a={get:function(a){return this.slice(a)[0]},contains:function(a){a=a&&a.valueOf();for(var c=0,d=this.length;c<d;c++)if(this[c].valueOf()===a)return c;return-1},remove:function(a){this.splice(a,1)},replace:function(a){a&&(d.isArray(a)||(a=[a]),this.clear(),this.push.apply(this,a))},clear:function(){this.length=0},copy:function(){var a=new A;a.replace(this);return a}};return function(){var b=[];b.push.apply(b,
arguments);d.extend(b,a);return b}}(),u=function(a,b){this.dates=new A;this.viewDate=v();this.focusDate=null;this._process_options(b);this.element=d(a);this.isInline=!1;this.isInput=this.element.is("input");this.hasInput=(this.component=this.element.is(".date")?this.element.find(".add-on, .input-group-addon, .btn"):!1)&&this.element.find("input").length;this.component&&0===this.component.length&&(this.component=!1);this.picker=d(n.template);this._buildEvents();this._attachEvents();this.isInline?this.picker.addClass("datepicker-inline").appendTo(this.element):
this.picker.addClass("datepicker-dropdown dropdown-menu");this.o.rtl&&this.picker.addClass("datepicker-rtl");this.viewMode=this.o.startView;this.o.calendarWeeks&&this.picker.find("tfoot th.today").attr("colspan",function(a,b){return parseInt(b)+1});this._allow_update=!1;this.setStartDate(this._o.startDate);this.setEndDate(this._o.endDate);this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);this.fillDow();this.fillMonths();this._allow_update=!0;this.update();this.showMode();this.isInline&&this.show()};
u.prototype={constructor:u,_process_options:function(a){this._o=d.extend({},this._o,a);a=this.o=d.extend({},this._o);var b=a.language;m[b]||(b=b.split("-")[0],m[b]||(b=y.language));a.language=b;switch(a.startView){case 2:case "decade":a.startView=2;break;case 1:case "year":a.startView=1;break;default:a.startView=0}switch(a.minViewMode){case 1:case "months":a.minViewMode=1;break;case 2:case "years":a.minViewMode=2;break;default:a.minViewMode=0}a.startView=Math.max(a.startView,a.minViewMode);!0!==a.multidate&&
(a.multidate=Number(a.multidate)||!1,a.multidate=!1!==a.multidate?Math.max(0,a.multidate):1);a.multidateSeparator=String(a.multidateSeparator);a.weekStart%=7;a.weekEnd=(a.weekStart+6)%7;b=n.parseFormat(a.format);-Infinity!==a.startDate&&(a.startDate=a.startDate?a.startDate instanceof Date?this._local_to_utc(this._zero_time(a.startDate)):n.parseDate(a.startDate,b,a.language):-Infinity);Infinity!==a.endDate&&(a.endDate=a.endDate?a.endDate instanceof Date?this._local_to_utc(this._zero_time(a.endDate)):
n.parseDate(a.endDate,b,a.language):Infinity);a.daysOfWeekDisabled=a.daysOfWeekDisabled||[];d.isArray(a.daysOfWeekDisabled)||(a.daysOfWeekDisabled=a.daysOfWeekDisabled.split(/[,\s]*/));a.daysOfWeekDisabled=d.map(a.daysOfWeekDisabled,function(a){return parseInt(a,10)});var b=String(a.orientation).toLowerCase().split(/\s+/g),c=a.orientation.toLowerCase(),b=d.grep(b,function(a){return/^auto|left|right|top|bottom$/.test(a)});a.orientation={x:"auto",y:"auto"};if(c&&"auto"!==c)if(1===b.length)switch(b[0]){case "top":case "bottom":a.orientation.y=
b[0];break;case "left":case "right":a.orientation.x=b[0]}else c=d.grep(b,function(a){return/^left|right$/.test(a)}),a.orientation.x=c[0]||"auto",c=d.grep(b,function(a){return/^top|bottom$/.test(a)}),a.orientation.y=c[0]||"auto"},_events:[],_secondaryEvents:[],_applyEvents:function(a){for(var b=0,c,d,f;b<a.length;b++)c=a[b][0],2===a[b].length?(d=t,f=a[b][1]):3===a[b].length&&(d=a[b][1],f=a[b][2]),c.on(f,d)},_unapplyEvents:function(a){for(var b=0,c,d,f;b<a.length;b++)c=a[b][0],2===a[b].length?(f=t,
d=a[b][1]):3===a[b].length&&(f=a[b][1],d=a[b][2]),c.off(d,f)},_buildEvents:function(){this.isInput?this._events=[[this.element,{focus:d.proxy(this.show,this),keyup:d.proxy(function(a){-1===d.inArray(a.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:d.proxy(this.keydown,this)}]]:this.component&&this.hasInput?this._events=[[this.element.find("input"),{focus:d.proxy(this.show,this),keyup:d.proxy(function(a){-1===d.inArray(a.keyCode,[27,37,39,38,40,32,13,9])&&this.update()},this),keydown:d.proxy(this.keydown,
this)}],[this.component,{click:d.proxy(this.show,this)}]]:this.element.is("div")?this.isInline=!0:this._events=[[this.element,{click:d.proxy(this.show,this)}]];this._events.push([this.element,"*",{blur:d.proxy(function(a){this._focused_from=a.target},this)}],[this.element,{blur:d.proxy(function(a){this._focused_from=a.target},this)}]);this._secondaryEvents=[[this.picker,{click:d.proxy(this.click,this)}],[d(window),{resize:d.proxy(this.place,this)}],[d(document),{"mousedown touchstart":d.proxy(function(a){!this.element.is(a.target)&&
(!this.element.find(a.target).length&&!this.picker.is(a.target)&&!this.picker.find(a.target).length)&&this.hide()},this)}]]},_attachEvents:function(){this._detachEvents();this._applyEvents(this._events)},_detachEvents:function(){this._unapplyEvents(this._events)},_attachSecondaryEvents:function(){this._detachSecondaryEvents();this._applyEvents(this._secondaryEvents)},_detachSecondaryEvents:function(){this._unapplyEvents(this._secondaryEvents)},_trigger:function(a,b){var c=b||this.dates.get(-1),c=
this._utc_to_local(c);this.element.trigger({type:a,date:c,dates:d.map(this.dates,this._utc_to_local),format:d.proxy(function(a,b){0===arguments.length?(a=this.dates.length-1,b=this.o.format):"string"===typeof a&&(b=a,a=this.dates.length-1);b=b||this.o.format;var c=this.dates.get(a);return n.formatDate(c,b,this.o.language)},this)})},show:function(){this.isInline||this.picker.appendTo("body");this.picker.show();this.place();this._attachSecondaryEvents();this._trigger("show")},hide:function(){!this.isInline&&
this.picker.is(":visible")&&(this.focusDate=null,this.picker.hide().detach(),this._detachSecondaryEvents(),this.viewMode=this.o.startView,this.showMode(),this.o.forceParse&&(this.isInput&&this.element.val()||this.hasInput&&this.element.find("input").val())&&this.setValue(),this._trigger("hide"))},remove:function(){this.hide();this._detachEvents();this._detachSecondaryEvents();this.picker.remove();delete this.element.data().datepicker;this.isInput||delete this.element.data().date},_utc_to_local:function(a){return a&&
new Date(a.getTime()+6E4*a.getTimezoneOffset())},_local_to_utc:function(a){return a&&new Date(a.getTime()-6E4*a.getTimezoneOffset())},_zero_time:function(a){return a&&new Date(a.getFullYear(),a.getMonth(),a.getDate())},_zero_utc_time:function(a){return a&&new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate()))},getDates:function(){return d.map(this.dates,this._utc_to_local)},getUTCDates:function(){return d.map(this.dates,function(a){return new Date(a)})},getDate:function(){return this._utc_to_local(this.getUTCDate())},
getUTCDate:function(){return new Date(this.dates.get(-1))},setDates:function(){var a=d.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,a);this._trigger("changeDate");this.setValue()},setUTCDates:function(){var a=d.isArray(arguments[0])?arguments[0]:arguments;this.update.apply(this,d.map(a,this._utc_to_local));this._trigger("changeDate");this.setValue()},setDate:z("setDates"),setUTCDate:z("setUTCDates"),setValue:function(){var a=this.getFormattedDate();this.isInput?this.element.val(a).change():
this.component&&this.element.find("input").val(a).change()},getFormattedDate:function(a){a===t&&(a=this.o.format);var b=this.o.language;return d.map(this.dates,function(c){return n.formatDate(c,a,b)}).join(this.o.multidateSeparator)},setStartDate:function(a){this._process_options({startDate:a});this.update();this.updateNavArrows()},setEndDate:function(a){this._process_options({endDate:a});this.update();this.updateNavArrows()},setDaysOfWeekDisabled:function(a){this._process_options({daysOfWeekDisabled:a});
this.update();this.updateNavArrows()},place:function(){if(!this.isInline){var a=this.picker.outerWidth(),b=this.picker.outerHeight(),c=x.width(),h=x.height(),f=x.scrollTop(),g=parseInt(this.element.parents().filter(function(){return"auto"!==d(this).css("z-index")}).first().css("z-index"))+10,e=this.component?this.component.parent().offset():this.element.offset(),k=this.component?this.component.outerHeight(!0):this.element.outerHeight(!1),n=this.component?this.component.outerWidth(!0):this.element.outerWidth(!1),
l=e.left,m=e.top;this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left");"auto"!==this.o.orientation.x?(this.picker.addClass("datepicker-orient-"+this.o.orientation.x),"right"===this.o.orientation.x&&(l-=a-n)):(this.picker.addClass("datepicker-orient-left"),0>e.left?l-=e.left-10:e.left+a>c&&(l=c-a-10));a=this.o.orientation.y;"auto"===a&&(a=-f+e.top-b,h=f+h-(e.top+k+b),a=Math.max(a,h)===h?"top":"bottom");this.picker.addClass("datepicker-orient-"+
a);m="top"===a?m+k:m-(b+parseInt(this.picker.css("padding-top")));this.picker.css({top:m,left:l,zIndex:g})}},_allow_update:!0,update:function(){if(this._allow_update){var a=this.dates.copy(),b=[],c=!1;arguments.length?(d.each(arguments,d.proxy(function(a,c){c instanceof Date&&(c=this._local_to_utc(c));b.push(c)},this)),c=!0):(b=(b=this.isInput?this.element.val():this.element.data("date")||this.element.find("input").val())&&this.o.multidate?b.split(this.o.multidateSeparator):[b],delete this.element.data().date);
b=d.map(b,d.proxy(function(a){return n.parseDate(a,this.o.format,this.o.language)},this));b=d.grep(b,d.proxy(function(a){return a<this.o.startDate||a>this.o.endDate||!a},this),!0);this.dates.replace(b);this.dates.length?this.viewDate=new Date(this.dates.get(-1)):this.viewDate<this.o.startDate?this.viewDate=new Date(this.o.startDate):this.viewDate>this.o.endDate&&(this.viewDate=new Date(this.o.endDate));c?this.setValue():b.length&&String(a)!==String(this.dates)&&this._trigger("changeDate");!this.dates.length&&
a.length&&this._trigger("clearDate");this.fill()}},fillDow:function(){var a=this.o.weekStart,b="<tr>";this.o.calendarWeeks&&(b+='<th class="cw">&nbsp;</th>',this.picker.find(".datepicker-days thead tr:first-child").prepend('<th class="cw">&nbsp;</th>'));for(;a<this.o.weekStart+7;)b+='<th class="dow">'+m[this.o.language].daysMin[a++%7]+"</th>";this.picker.find(".datepicker-days thead").append(b+"</tr>")},fillMonths:function(){for(var a="",b=0;12>b;)a+='<span class="month">'+m[this.o.language].monthsShort[b++]+
"</span>";this.picker.find(".datepicker-months td").html(a)},setRange:function(a){!a||!a.length?delete this.range:this.range=d.map(a,function(a){return a.valueOf()});this.fill()},getClassNames:function(a){var b=[],c=this.viewDate.getUTCFullYear(),h=this.viewDate.getUTCMonth(),f=new Date;a.getUTCFullYear()<c||a.getUTCFullYear()===c&&a.getUTCMonth()<h?b.push("old"):(a.getUTCFullYear()>c||a.getUTCFullYear()===c&&a.getUTCMonth()>h)&&b.push("new");this.focusDate&&a.valueOf()===this.focusDate.valueOf()&&
b.push("focused");this.o.todayHighlight&&(a.getUTCFullYear()===f.getFullYear()&&a.getUTCMonth()===f.getMonth()&&a.getUTCDate()===f.getDate())&&b.push("today");-1!==this.dates.contains(a)&&b.push("active");(a.valueOf()<this.o.startDate||a.valueOf()>this.o.endDate||-1!==d.inArray(a.getUTCDay(),this.o.daysOfWeekDisabled))&&b.push("disabled");this.range&&(a>this.range[0]&&a<this.range[this.range.length-1]&&b.push("range"),-1!==d.inArray(a.valueOf(),this.range)&&b.push("selected"));return b},fill:function(){var a=
new Date(this.viewDate),b=a.getUTCFullYear(),c=a.getUTCMonth(),a=-Infinity!==this.o.startDate?this.o.startDate.getUTCFullYear():-Infinity,h=-Infinity!==this.o.startDate?this.o.startDate.getUTCMonth():-Infinity,f=Infinity!==this.o.endDate?this.o.endDate.getUTCFullYear():Infinity,g=Infinity!==this.o.endDate?this.o.endDate.getUTCMonth():Infinity,e=m[this.o.language].today||m.en.today||"",k=m[this.o.language].clear||m.en.clear||"",s;this.picker.find(".datepicker-days thead th.datepicker-switch").text(m[this.o.language].months[c]+
" "+b);this.picker.find("tfoot th.today").text(e).toggle(!1!==this.o.todayBtn);this.picker.find("tfoot th.clear").text(k).toggle(!1!==this.o.clearBtn);this.updateNavArrows();this.fillMonths();e=r(b,c-1,28);c=n.getDaysInMonth(e.getUTCFullYear(),e.getUTCMonth());e.setUTCDate(c);e.setUTCDate(c-(e.getUTCDay()-this.o.weekStart+7)%7);k=new Date(e);k.setUTCDate(k.getUTCDate()+42);for(var k=k.valueOf(),c=[],l;e.valueOf()<k;){if(e.getUTCDay()===this.o.weekStart&&(c.push("<tr>"),this.o.calendarWeeks)){l=new Date(+e+
864E5*((this.o.weekStart-e.getUTCDay()-7)%7));l=new Date(Number(l)+864E5*((11-l.getUTCDay())%7));var q=new Date(Number(q=r(l.getUTCFullYear(),0,1))+864E5*((11-q.getUTCDay())%7));c.push('<td class="cw">'+((l-q)/864E5/7+1)+"</td>")}l=this.getClassNames(e);l.push("day");if(this.o.beforeShowDay!==d.noop){var p=this.o.beforeShowDay(this._utc_to_local(e));p===t?p={}:"boolean"===typeof p?p={enabled:p}:"string"===typeof p&&(p={classes:p});!1===p.enabled&&l.push("disabled");p.classes&&(l=l.concat(p.classes.split(/\s+/)));
p.tooltip&&(s=p.tooltip)}l=d.unique(l);c.push('<td class="'+l.join(" ")+'"'+(s?' title="'+s+'"':"")+">"+e.getUTCDate()+"</td>");e.getUTCDay()===this.o.weekEnd&&c.push("</tr>");e.setUTCDate(e.getUTCDate()+1)}this.picker.find(".datepicker-days tbody").empty().append(c.join(""));var w=this.picker.find(".datepicker-months").find("th:eq(1)").text(b).end().find("span").removeClass("active");d.each(this.dates,function(a,c){c.getUTCFullYear()===b&&w.eq(c.getUTCMonth()).addClass("active")});(b<a||b>f)&&w.addClass("disabled");
b===a&&w.slice(0,h).addClass("disabled");b===f&&w.slice(g+1).addClass("disabled");c="";b=10*parseInt(b/10,10);s=this.picker.find(".datepicker-years").find("th:eq(1)").text(b+"-"+(b+9)).end().find("td");b-=1;q=d.map(this.dates,function(a){return a.getUTCFullYear()});for(g=-1;11>g;g++)h=["year"],-1===g?h.push("old"):10===g&&h.push("new"),-1!==d.inArray(b,q)&&h.push("active"),(b<a||b>f)&&h.push("disabled"),c+='<span class="'+h.join(" ")+'">'+b+"</span>",b+=1;s.html(c)},updateNavArrows:function(){if(this._allow_update){var a=
new Date(this.viewDate),b=a.getUTCFullYear(),a=a.getUTCMonth();switch(this.viewMode){case 0:-Infinity!==this.o.startDate&&b<=this.o.startDate.getUTCFullYear()&&a<=this.o.startDate.getUTCMonth()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"});Infinity!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()&&a>=this.o.endDate.getUTCMonth()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"});
break;case 1:case 2:-Infinity!==this.o.startDate&&b<=this.o.startDate.getUTCFullYear()?this.picker.find(".prev").css({visibility:"hidden"}):this.picker.find(".prev").css({visibility:"visible"}),Infinity!==this.o.endDate&&b>=this.o.endDate.getUTCFullYear()?this.picker.find(".next").css({visibility:"hidden"}):this.picker.find(".next").css({visibility:"visible"})}}},click:function(a){a.preventDefault();a=d(a.target).closest("span, td, th");var b,c,h;if(1===a.length)switch(a[0].nodeName.toLowerCase()){case "th":switch(a[0].className){case "datepicker-switch":this.showMode(1);
break;case "prev":case "next":a=n.modes[this.viewMode].navStep*("prev"===a[0].className?-1:1);switch(this.viewMode){case 0:this.viewDate=this.moveMonth(this.viewDate,a);this._trigger("changeMonth",this.viewDate);break;case 1:case 2:this.viewDate=this.moveYear(this.viewDate,a),1===this.viewMode&&this._trigger("changeYear",this.viewDate)}this.fill();break;case "today":a=new Date;a=r(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0);this.showMode(-2);this._setDate(a,"linked"===this.o.todayBtn?null:"view");
break;case "clear":this.isInput?b=this.element:this.component&&(b=this.element.find("input")),b&&b.val("").change(),this.update(),this._trigger("changeDate"),this.o.autoclose&&this.hide()}break;case "span":a.is(".disabled")||(this.viewDate.setUTCDate(1),a.is(".month")?(h=1,c=a.parent().find("span").index(a),b=this.viewDate.getUTCFullYear(),this.viewDate.setUTCMonth(c),this._trigger("changeMonth",this.viewDate),1===this.o.minViewMode&&this._setDate(r(b,c,h))):(h=1,c=0,b=parseInt(a.text(),10)||0,this.viewDate.setUTCFullYear(b),
this._trigger("changeYear",this.viewDate),2===this.o.minViewMode&&this._setDate(r(b,c,h))),this.showMode(-1),this.fill());break;case "td":a.is(".day")&&!a.is(".disabled")&&(h=parseInt(a.text(),10)||1,b=this.viewDate.getUTCFullYear(),c=this.viewDate.getUTCMonth(),a.is(".old")?0===c?(c=11,b-=1):c-=1:a.is(".new")&&(11===c?(c=0,b+=1):c+=1),this._setDate(r(b,c,h)))}this.picker.is(":visible")&&this._focused_from&&d(this._focused_from).focus();delete this._focused_from},_toggle_multidate:function(a){var b=
this.dates.contains(a);a?-1!==b?this.dates.remove(b):this.dates.push(a):this.dates.clear();if("number"===typeof this.o.multidate)for(;this.dates.length>this.o.multidate;)this.dates.remove(0)},_setDate:function(a,b){(!b||"date"===b)&&this._toggle_multidate(a&&new Date(a));if(!b||"view"===b)this.viewDate=a&&new Date(a);this.fill();this.setValue();this._trigger("changeDate");var c;this.isInput?c=this.element:this.component&&(c=this.element.find("input"));c&&c.change();this.o.autoclose&&(!b||"date"===
b)&&this.hide()},moveMonth:function(a,b){if(!a)return t;if(!b)return a;var c=new Date(a.valueOf()),d=c.getUTCDate(),f=c.getUTCMonth(),g=Math.abs(b),e;b=0<b?1:-1;if(1===g){if(g=-1===b?function(){return c.getUTCMonth()===f}:function(){return c.getUTCMonth()!==e},e=f+b,c.setUTCMonth(e),0>e||11<e)e=(e+12)%12}else{for(var k=0;k<g;k++)c=this.moveMonth(c,b);e=c.getUTCMonth();c.setUTCDate(d);g=function(){return e!==c.getUTCMonth()}}for(;g();)c.setUTCDate(--d),c.setUTCMonth(e);return c},moveYear:function(a,
b){return this.moveMonth(a,12*b)},dateWithinRange:function(a){return a>=this.o.startDate&&a<=this.o.endDate},keydown:function(a){if(this.picker.is(":not(:visible)"))27===a.keyCode&&this.show();else{var b=!1,c,d,f,g=this.focusDate||this.viewDate;switch(a.keyCode){case 27:this.focusDate?(this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill()):this.hide();a.preventDefault();break;case 37:case 39:if(!this.o.keyboardNavigation)break;c=37===a.keyCode?-1:1;a.ctrlKey?(d=this.moveYear(this.dates.get(-1)||
v(),c),f=this.moveYear(g,c),this._trigger("changeYear",this.viewDate)):a.shiftKey?(d=this.moveMonth(this.dates.get(-1)||v(),c),f=this.moveMonth(g,c),this._trigger("changeMonth",this.viewDate)):(d=new Date(this.dates.get(-1)||v()),d.setUTCDate(d.getUTCDate()+c),f=new Date(g),f.setUTCDate(g.getUTCDate()+c));this.dateWithinRange(d)&&(this.focusDate=this.viewDate=f,this.setValue(),this.fill(),a.preventDefault());break;case 38:case 40:if(!this.o.keyboardNavigation)break;c=38===a.keyCode?-1:1;a.ctrlKey?
(d=this.moveYear(this.dates.get(-1)||v(),c),f=this.moveYear(g,c),this._trigger("changeYear",this.viewDate)):a.shiftKey?(d=this.moveMonth(this.dates.get(-1)||v(),c),f=this.moveMonth(g,c),this._trigger("changeMonth",this.viewDate)):(d=new Date(this.dates.get(-1)||v()),d.setUTCDate(d.getUTCDate()+7*c),f=new Date(g),f.setUTCDate(g.getUTCDate()+7*c));this.dateWithinRange(d)&&(this.focusDate=this.viewDate=f,this.setValue(),this.fill(),a.preventDefault());break;case 13:g=this.focusDate||this.dates.get(-1)||
this.viewDate;this._toggle_multidate(g);b=!0;this.focusDate=null;this.viewDate=this.dates.get(-1)||this.viewDate;this.setValue();this.fill();this.picker.is(":visible")&&(a.preventDefault(),this.o.autoclose&&this.hide());break;case 9:this.focusDate=null,this.viewDate=this.dates.get(-1)||this.viewDate,this.fill(),this.hide()}if(b){this.dates.length?this._trigger("changeDate"):this._trigger("clearDate");var e;this.isInput?e=this.element:this.component&&(e=this.element.find("input"));e&&e.change()}}},
showMode:function(a){a&&(this.viewMode=Math.max(this.o.minViewMode,Math.min(2,this.viewMode+a)));this.picker.find(">div").hide().filter(".datepicker-"+n.modes[this.viewMode].clsName).css("display","block");this.updateNavArrows()}};var B=function(a,b){this.element=d(a);this.inputs=d.map(b.inputs,function(a){return a.jquery?a[0]:a});delete b.inputs;d(this.inputs).datepicker(b).bind("changeDate",d.proxy(this.dateUpdated,this));this.pickers=d.map(this.inputs,function(a){return d(a).data("datepicker")});
this.updateDates()};B.prototype={updateDates:function(){this.dates=d.map(this.pickers,function(a){return a.getUTCDate()});this.updateRanges()},updateRanges:function(){var a=d.map(this.dates,function(a){return a.valueOf()});d.each(this.pickers,function(b,c){c.setRange(a)})},dateUpdated:function(a){if(!this.updating){this.updating=!0;var b=d(a.target).data("datepicker").getUTCDate();a=d.inArray(a.target,this.inputs);var c=this.inputs.length;if(-1!==a){d.each(this.pickers,function(a,c){c.getUTCDate()||
c.setUTCDate(b)});if(b<this.dates[a])for(;0<=a&&b<this.dates[a];)this.pickers[a--].setUTCDate(b);else if(b>this.dates[a])for(;a<c&&b>this.dates[a];)this.pickers[a++].setUTCDate(b);this.updateDates();delete this.updating}}},remove:function(){d.map(this.pickers,function(a){a.remove()});delete this.element.data().datepicker}};var F=d.fn.datepicker;d.fn.datepicker=function(a){var b=Array.apply(null,arguments);b.shift();var c;this.each(function(){var h=d(this),f=h.data("datepicker"),g="object"===typeof a&&
a;if(!f){var f=C(this,"date"),e=d.extend({},y,f,g),e=D(e.language),g=d.extend({},y,e,f,g);h.is(".input-daterange")||g.inputs?(f={inputs:g.inputs||h.find("input").toArray()},h.data("datepicker",f=new B(this,d.extend(g,f)))):h.data("datepicker",f=new u(this,g))}if("string"===typeof a&&"function"===typeof f[a]&&(c=f[a].apply(f,b),c!==t))return!1});return c!==t?c:this};var y=d.fn.datepicker.defaults={autoclose:!1,beforeShowDay:d.noop,calendarWeeks:!1,clearBtn:!1,daysOfWeekDisabled:[],endDate:Infinity,
forceParse:!0,format:"mm/dd/yyyy",keyboardNavigation:!0,language:"en",minViewMode:0,multidate:!1,multidateSeparator:",",orientation:"auto",rtl:!1,startDate:-Infinity,startView:0,todayBtn:!1,todayHighlight:!1,weekStart:0},E=d.fn.datepicker.locale_opts=["format","rtl","weekStart"];d.fn.datepicker.Constructor=u;var m=d.fn.datepicker.dates={en:{days:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(" "),daysShort:"Sun Mon Tue Wed Thu Fri Sat Sun".split(" "),daysMin:"Su Mo Tu We Th Fr Sa Su".split(" "),
months:"January February March April May June July August September October November December".split(" "),monthsShort:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),today:"Today",clear:"Clear"}},n={modes:[{clsName:"days",navFnc:"Month",navStep:1},{clsName:"months",navFnc:"FullYear",navStep:1},{clsName:"years",navFnc:"FullYear",navStep:10}],isLeapYear:function(a){return 0===a%4&&0!==a%100||0===a%400},getDaysInMonth:function(a,b){return[31,n.isLeapYear(a)?29:28,31,30,31,30,31,31,30,31,
30,31][b]},validParts:/dd?|DD?|mm?|MM?|yy(?:yy)?/g,nonpunctuation:/[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,parseFormat:function(a){var b=a.replace(this.validParts,"\x00").split("\x00");a=a.match(this.validParts);if(!b||!b.length||!a||0===a.length)throw Error("Invalid date format.");return{separators:b,parts:a}},parseDate:function(a,b,c){function h(){var a=this.slice(0,g[k].length),b=g[k].slice(0,a.length);return a===b}if(!a)return t;if(a instanceof Date)return a;"string"===typeof b&&(b=n.parseFormat(b));
var f=/([\-+]\d+)([dmwy])/,g=a.match(/([\-+]\d+)([dmwy])/g),e,k;if(/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(a)){a=new Date;for(k=0;k<g.length;k++)switch(b=f.exec(g[k]),e=parseInt(b[1]),b[2]){case "d":a.setUTCDate(a.getUTCDate()+e);break;case "m":a=u.prototype.moveMonth.call(u.prototype,a,e);break;case "w":a.setUTCDate(a.getUTCDate()+7*e);break;case "y":a=u.prototype.moveYear.call(u.prototype,a,e)}return r(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),0,0,0)}g=a&&a.match(this.nonpunctuation)||
[];a=new Date;var f={},s="yyyy yy M MM m mm d dd".split(" ");e={yyyy:function(a,b){return a.setUTCFullYear(b)},yy:function(a,b){return a.setUTCFullYear(2E3+b)},m:function(a,b){if(isNaN(a))return a;for(b-=1;0>b;)b+=12;b%=12;for(a.setUTCMonth(b);a.getUTCMonth()!==b;)a.setUTCDate(a.getUTCDate()-1);return a},d:function(a,b){return a.setUTCDate(b)}};var l;e.M=e.MM=e.mm=e.m;e.dd=e.d;a=r(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0);var q=b.parts.slice();g.length!==q.length&&(q=d(q).filter(function(a,
b){return-1!==d.inArray(b,s)}).toArray());if(g.length===q.length){var p;k=0;for(p=q.length;k<p;k++){l=parseInt(g[k],10);b=q[k];if(isNaN(l))switch(b){case "MM":l=d(m[c].months).filter(h);l=d.inArray(l[0],m[c].months)+1;break;case "M":l=d(m[c].monthsShort).filter(h),l=d.inArray(l[0],m[c].monthsShort)+1}f[b]=l}for(k=0;k<s.length;k++)b=s[k],b in f&&!isNaN(f[b])&&(c=new Date(a),e[b](c,f[b]),isNaN(c)||(a=c))}return a},formatDate:function(a,b,c){if(!a)return"";"string"===typeof b&&(b=n.parseFormat(b));c=
{d:a.getUTCDate(),D:m[c].daysShort[a.getUTCDay()],DD:m[c].days[a.getUTCDay()],m:a.getUTCMonth()+1,M:m[c].monthsShort[a.getUTCMonth()],MM:m[c].months[a.getUTCMonth()],yy:a.getUTCFullYear().toString().substring(2),yyyy:a.getUTCFullYear()};c.dd=(10>c.d?"0":"")+c.d;c.mm=(10>c.m?"0":"")+c.m;a=[];for(var h=d.extend([],b.separators),f=0,g=b.parts.length;f<=g;f++)h.length&&a.push(h.shift()),a.push(c[b.parts[f]]);return a.join("")},headTemplate:'<thead><tr><th class="prev">&laquo;</th><th colspan="5" class="datepicker-switch"></th><th class="next">&raquo;</th></tr></thead>',
contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>',footTemplate:'<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'};n.template='<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">'+n.headTemplate+"<tbody></tbody>"+n.footTemplate+'</table></div><div class="datepicker-months"><table class="table-condensed">'+n.headTemplate+n.contTemplate+n.footTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+
n.headTemplate+n.contTemplate+n.footTemplate+"</table></div></div>";d.fn.datepicker.DPGlobal=n;d.fn.datepicker.noConflict=function(){d.fn.datepicker=F;return this};d(document).on("focus.datepicker.data-api click.datepicker.data-api",'[data-provide="datepicker"]',function(a){var b=d(this);b.data("datepicker")||(a.preventDefault(),b.datepicker("show"))});d(function(){d('[data-provide="datepicker-inline"]').datepicker()})})(window.jQuery);
