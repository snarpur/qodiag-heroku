(function(){this.JST||(this.JST={});this.JST["backbone_app/templates/people/parentTmpl"]=function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments)};with(obj||{}){__p.push(' <div class="avatar">\n    <img src="',avatar,'" >\n    <a href="#" onclick="$(\'.avatarUploadModal_',id,'\').toggle();return false;"><span class="btn btn-mini dialog"><i class="icon-upload"></i></span></a>\n </div>\n <h4>',firstname+" "+lastname,' <span class="btn btn-mini edit-item"><i class="icon-pencil"></i></span></h4>\n  <table>\n   <tr>\n     <td>',I18n.t("person.full_cpr"),":</td>\n     <td>",full_cpr,"</td>\n   </tr>\n   <tr>\n     <td>",I18n.t("address.street_1"),":</td>\n     <td>",address.get("street_1"),"</td>\n   </tr>\n   <tr>\n     <td>",I18n.t("address.phone"),":</td>\n     <td>",address.get("phone"),"</td>\n   </tr>\n   <tr>\n     <td>",I18n.t("address.home_phone"),":</td>\n     <td>",address.get("home_phone"),"</td>\n   </tr>\n   <tr>\n     <td>",I18n.t("person.workplace"),":</td>\n     <td>",workplace,"</td>\n   </tr>\n   <tr>\n     <td>",I18n.t("person.workphone"),":</td>\n     <td>",workphone,'</td>\n   </tr>\n</table>\n\n<div class="upload modal hide avatarUploadModal_',id,'">\n    <div class="modal-header"><h3>Hlaða upp mynd</h3></div>\n    <div class="modal-body">\n        <form accept-charset="UTF-8" class="edit_person" enctype="multipart/form-data" method="post" id="avatarUploadForm_',id,'" action="/people/',id,'">\n            <input name="utf8" type="hidden" value="✓">\n            <input name="subject_id" type="hidden" value="',subject_id,'">\n            <input name="_method" type="hidden" value="put">\n            <input name="authenticity_token" class="authenticity_token" type="hidden" value="">\n            <input id="person_avatar" name="person[avatar]" type="file">\n        </form>\n    </div>\n    <div class="modal-footer">\n        <a href="#" class="btn" onclick="$(\'.avatarUploadModal_',id,'\').toggle();return false;">Hætta við</a>\n        <a href="#" class="btn btn-primary" onclick="document.forms.avatarUploadForm_',id,'.submit();return false;">Senda</a>\n    </div>\n</div>\n')}return __p.join("")}}).call(this);