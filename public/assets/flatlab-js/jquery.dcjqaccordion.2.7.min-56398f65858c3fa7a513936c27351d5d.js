(function(b){b.fn.dcAccordion=function(h){function l(d,g){var e=b.cookie(d);null!=e&&(e=e.split(","),b.each(e,function(e,d){var f=b("li:eq("+d+")",g);b("> a",f).addClass(a.classActive);f=f.parents("li");b("> a",f).addClass(a.classActive)}))}function k(d,g){var e=[];b("li a."+a.classActive,g).each(function(a){a=b(this).parent("li");a=b("li",g).index(a);e.push(a)});b.cookie(d,e,{path:"/"})}var a={classParent:"dcjq-parent",classActive:"active",classArrow:"dcjq-icon",classCount:"dcjq-count",classExpand:"dcjq-current-parent",
eventType:"click",hoverDelay:300,menuClose:!0,autoClose:!0,autoExpand:!1,speed:"slow",saveState:!0,disableLink:!0,showCount:!1,cookie:"dcjq-accordion"};h=b.extend(a,h);this.each(function(d){function g(){$activeLi=b(this).parent("li");$parentsLi=$activeLi.parents("li");$parentsUl=$activeLi.parents("ul");!0==a.autoClose&&f($parentsLi,$parentsUl);b("> ul",$activeLi).is(":visible")?(b("ul",$activeLi).slideUp(a.speed),b("a",$activeLi).removeClass(a.classActive)):(b(this).siblings("ul").slideToggle(a.speed),
b("> a",$activeLi).addClass(a.classActive));!0==a.saveState&&k(a.cookie,c)}function e(){}function h(){}function m(){!0==a.menuClose&&(b("ul",c).slideUp(a.speed),b("a",c).removeClass(a.classActive),k(a.cookie,c))}function f(d,e){b("ul",c).not(e).slideUp(a.speed);b("a",c).removeClass(a.classActive);b("> a",d).addClass(a.classActive)}var c=this;(function(){$arrow='<span class="'+a.classArrow+'"></span>';var d=a.classParent+"-li";b("> ul",c).show();b("li",c).each(function(){0<b("> ul",this).length&&(b(this).addClass(d),
b("> a",this).addClass(a.classParent).append($arrow))});b("> ul",c).hide();!0==a.showCount&&b("li."+d,c).each(function(){var c=!0==a.disableLink?parseInt(b("ul a:not(."+a.classParent+")",this).length):parseInt(b("ul a",this).length);b("> a",this).append(' <span class="'+a.classCount+'">('+c+")</span>")})})();!0==a.saveState&&l(a.cookie,c);!0==a.autoExpand&&b("li."+a.classExpand+" > a").addClass(a.classActive);b("ul",c).hide();$allActiveLi=b("a."+a.classActive,c);$allActiveLi.siblings("ul").show();
"hover"==a.eventType?(d={sensitivity:2,interval:a.hoverDelay,over:g,timeout:a.hoverDelay,out:e},b("li a",c).hoverIntent(d),d={sensitivity:2,interval:1E3,over:h,timeout:1E3,out:m},b(c).hoverIntent(d),!0==a.disableLink&&b("li a",c).click(function(a){0<b(this).siblings("ul").length&&a.preventDefault()})):b("li a",c).click(function(d){$activeLi=b(this).parent("li");$parentsLi=$activeLi.parents("li");$parentsUl=$activeLi.parents("ul");!0==a.disableLink&&0<b(this).siblings("ul").length&&d.preventDefault();
!0==a.autoClose&&f($parentsLi,$parentsUl);b("> ul",$activeLi).is(":visible")?(b("ul",$activeLi).slideUp(a.speed),b("a",$activeLi).removeClass(a.classActive)):(b(this).siblings("ul").slideToggle(a.speed),b("> a",$activeLi).addClass(a.classActive));!0==a.saveState&&k(a.cookie,c)})})}})(jQuery);
