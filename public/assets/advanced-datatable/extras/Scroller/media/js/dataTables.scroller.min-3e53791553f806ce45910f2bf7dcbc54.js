/*
 * File:        dataTables.scroller.min.js
 * Version:     1.1.0
 * Author:      Allan Jardine (www.sprymedia.co.uk)
 * 
 * Copyright 2011 Allan Jardine, all rights reserved.
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD (3 point) style license, as supplied with this software.
 * 
 * This source file is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 */
/*
     GPL v2 or BSD 3 point style
 @contact     www.sprymedia.co.uk/contact

 @copyright Copyright 2011-2012 Allan Jardine, all rights reserved.

 This source file is free software, under either the GPL v2 license or a
 BSD style license, available at:
   http://datatables.net/license_gpl2
   http://datatables.net/license_bsd
*/

(function(d,h,g){var e=function(a,b){!this instanceof e?alert("Scroller warning: Scroller must be initialised with the 'new' keyword."):("undefined"==typeof b&&(b={}),this.s={dt:a,tableTop:0,tableBottom:0,redrawTop:0,redrawBottom:0,rowHeight:null,autoHeight:!0,viewportHeight:0,viewportRows:0,stateTO:null,drawTO:null},this.s=d.extend(this.s,e.oDefaults,b),this.dom={force:g.createElement("div"),scroller:null,table:null},this.s.dt.oScroller=this,this._fnConstruct())};e.prototype={fnRowToPixels:function(a){return a*
this.s.rowHeight},fnPixelsToRow:function(a){return parseInt(a/this.s.rowHeight,10)},fnScrollToRow:function(a,b){var c=this.fnRowToPixels(a);"undefined"==typeof b||b?d(this.dom.scroller).animate({scrollTop:c}):d(this.dom.scroller).scrollTop(c)},fnMeasure:function(a){this.s.autoHeight&&this._fnCalcRowHeight();this.s.viewportHeight=d(this.dom.scroller).height();this.s.viewportRows=parseInt(this.s.viewportHeight/this.s.rowHeight,10)+1;this.s.dt._iDisplayLength=this.s.viewportRows*this.s.displayBuffer;
this.s.trace&&console.log("Row height: "+this.s.rowHeight+" Viewport height: "+this.s.viewportHeight+" Viewport rows: "+this.s.viewportRows+" Display rows: "+this.s.dt._iDisplayLength);("undefined"==typeof a||a)&&this.s.dt.oInstance.fnDraw()},_fnConstruct:function(){var a=this;this.dom.force.style.position="absolute";this.dom.force.style.top="0px";this.dom.force.style.left="0px";this.dom.force.style.width="1px";this.dom.scroller=d("div."+this.s.dt.oClasses.sScrollBody,this.s.dt.nTableWrapper)[0];
this.dom.scroller.appendChild(this.dom.force);this.dom.scroller.style.position="relative";this.dom.table=d(">table",this.dom.scroller)[0];this.dom.table.style.position="absolute";this.dom.table.style.top="0px";this.dom.table.style.left="0px";d(this.s.dt.nTableWrapper).addClass("DTS");this.s.loadingIndicator&&d(this.dom.scroller.parentNode).css("position","relative").append('<div class="DTS_Loading">'+this.s.dt.oLanguage.sLoadingRecords+"</div>");this.s.rowHeight&&"auto"!=this.s.rowHeight&&(this.s.autoHeight=
!1);this.fnMeasure(!1);d(this.dom.scroller).scroll(function(){a._fnScroll.call(a)});d(this.dom.scroller).bind("touchstart",function(){a._fnScroll.call(a)});this.s.dt.aoDrawCallback.push({fn:function(){a.s.dt.bInitialised&&a._fnDrawCallback.call(a)},sName:"Scroller"});this.s.dt.oApi._fnCallbackReg(this.s.dt,"aoStateSaveParams",function(b,c){c.iScroller=a.dom.scroller.scrollTop},"Scroller_State")},_fnScroll:function(){var a=this,b=this.dom.scroller.scrollTop,c;if(!this.s.dt.bFiltered&&!this.s.dt.bSorted&&
(this.s.trace&&console.log("Scroll: "+b+"px - boundaries: "+this.s.redrawTop+" / "+this.s.redrawBottom+".  Showing rows "+this.fnPixelsToRow(b)+" to "+this.fnPixelsToRow(b+d(this.dom.scroller).height())+" in the viewport, with rows "+this.s.dt._iDisplayStart+" to "+this.s.dt._iDisplayEnd+" rendered by the DataTable"),this._fnInfo(),clearTimeout(this.s.stateTO),this.s.stateTO=setTimeout(function(){a.s.dt.oApi._fnSaveState(a.s.dt)},250),b<this.s.redrawTop||b>this.s.redrawBottom)){var f=(this.s.displayBuffer-
1)/2*this.s.viewportRows;c=parseInt(b/this.s.rowHeight,10)-f;0>c?c=0:c+this.s.dt._iDisplayLength>this.s.dt.fnRecordsDisplay()?(c=this.s.dt.fnRecordsDisplay()-this.s.dt._iDisplayLength,0>c&&(c=0)):0!==c%2&&c++;c!=this.s.dt._iDisplayStart&&(this.s.tableTop=d(this.s.dt.nTable).offset().top,this.s.tableBottom=d(this.s.dt.nTable).height()+this.s.tableTop,this.s.dt.oFeatures.bServerSide?(clearTimeout(this.s.drawTO),this.s.drawTO=setTimeout(function(){a.s.dt._iDisplayStart=c;a.s.dt.oApi._fnCalculateEnd(a.s.dt);
a.s.dt.oApi._fnDraw(a.s.dt)},this.s.serverWait)):(this.s.dt._iDisplayStart=c,this.s.dt.oApi._fnCalculateEnd(this.s.dt),this.s.dt.oApi._fnDraw(this.s.dt)),this.s.trace&&console.log("Scroll forcing redraw - top DT render row: "+c))}},_fnDrawCallback:function(){var a=this,b=this.dom.scroller.scrollTop,c=b+this.s.viewportHeight;this.dom.force.style.height=this.s.rowHeight*this.s.dt.fnRecordsDisplay()+"px";var f=this.s.rowHeight*this.s.dt._iDisplayStart;0===this.s.dt._iDisplayStart?f=0:this.s.dt._iDisplayStart===
this.s.dt.fnRecordsDisplay()-this.s.dt._iDisplayLength&&(f=this.s.rowHeight*this.s.dt._iDisplayStart);this.dom.table.style.top=f+"px";this.s.tableTop=f;this.s.tableBottom=d(this.s.dt.nTable).height()+this.s.tableTop;this.s.redrawTop=b-(b-this.s.tableTop)*this.s.boundaryScale;this.s.redrawBottom=b+(this.s.tableBottom-c)*this.s.boundaryScale;this.s.trace&&console.log("Table redraw. Table top: "+f+"px Table bottom: "+this.s.tableBottom+" Scroll boundary top: "+this.s.redrawTop+" Scroll boundary bottom: "+
this.s.redrawBottom+" Rows drawn: "+this.s.dt._iDisplayLength);setTimeout(function(){a._fnInfo.call(a)},0);this.s.dt.oFeatures.bStateSave&&null!==this.s.dt.oLoadedState&&"undefined"!=typeof this.s.dt.oLoadedState.iScroller&&(null!==this.s.dt.sAjaxSource&&2==this.s.dt.iDraw||null===this.s.dt.sAjaxSource&&1==this.s.dt.iDraw)&&setTimeout(function(){d(a.dom.scroller).scrollTop(a.s.dt.oLoadedState.iScroller);a.s.redrawTop=a.s.dt.oLoadedState.iScroller-a.s.viewportHeight/2},0)},_fnCalcRowHeight:function(){var a=
this.s.dt.nTable.cloneNode(!1),b=d('<div class="'+this.s.dt.oClasses.sWrapper+' DTS"><div class="'+this.s.dt.oClasses.sScrollWrapper+'"><div class="'+this.s.dt.oClasses.sScrollBody+'"></div></div></div>')[0];d(a).append("<tbody><tr><td>&nbsp;</td></tr></tbody>");d("div."+this.s.dt.oClasses.sScrollBody,b).append(a);g.body.appendChild(b);this.s.rowHeight=d("tbody tr",a).outerHeight();g.body.removeChild(b)},_fnInfo:function(){if(this.s.dt.oFeatures.bInfo){var a=this.s.dt,b=this.dom.scroller.scrollTop,
c=this.fnPixelsToRow(b)+1,f=a.fnRecordsTotal(),e=a.fnRecordsDisplay(),b=this.fnPixelsToRow(b+d(this.dom.scroller).height()),b=e<b?e:b,c=a.fnFormatNumber(c),b=a.fnFormatNumber(b),f=a.fnFormatNumber(f),e=a.fnFormatNumber(e),e=0===a.fnRecordsDisplay()&&a.fnRecordsDisplay()==a.fnRecordsTotal()?a.oLanguage.sInfoEmpty+a.oLanguage.sInfoPostFix:0===a.fnRecordsDisplay()?a.oLanguage.sInfoEmpty+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",f)+a.oLanguage.sInfoPostFix:a.fnRecordsDisplay()==a.fnRecordsTotal()?
a.oLanguage.sInfo.replace("_START_",c).replace("_END_",b).replace("_TOTAL_",e)+a.oLanguage.sInfoPostFix:a.oLanguage.sInfo.replace("_START_",c).replace("_END_",b).replace("_TOTAL_",e)+" "+a.oLanguage.sInfoFiltered.replace("_MAX_",a.fnFormatNumber(a.fnRecordsTotal()))+a.oLanguage.sInfoPostFix,a=a.aanFeatures.i;if("undefined"!=typeof a){f=0;for(c=a.length;f<c;f++)d(a[f]).html(e)}}}};e.oDefaults={trace:!1,rowHeight:"auto",serverWait:200,displayBuffer:9,boundaryScale:0.5,loadingIndicator:!1};e.prototype.CLASS=
"Scroller";e.VERSION="1.1.0";e.prototype.VERSION=e.VERSION;"function"==typeof d.fn.dataTable&&"function"==typeof d.fn.dataTableExt.fnVersionCheck&&d.fn.dataTableExt.fnVersionCheck("1.9.0")?d.fn.dataTableExt.aoFeatures.push({fnInit:function(a){return(new e(a,"undefined"==typeof a.oInit.oScroller?{}:a.oInit.oScroller)).dom.wrapper},cFeature:"S",sFeature:"Scroller"}):alert("Warning: Scroller requires DataTables 1.9.0 or greater - www.datatables.net/download");d.fn.dataTable.Scroller=e})(jQuery,window,
document);
