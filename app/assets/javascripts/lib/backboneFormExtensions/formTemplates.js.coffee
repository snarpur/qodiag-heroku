App.Templates ||= {}
App.Templates.Forms=
  form: "<form class=\"form-base\">
          {{fieldsets}}
        </form>"

  fieldset: "<fieldset>
              <legend>{{legend}}</legend>
              {{fields}}
            </fieldset>"
  
  field: "<div class=\"control-group field-{{key}} {{typeClass}}\"> 
            <label class=\"control-label\" for=\"{{id}}\">{{title}}</label> 
            <div class=\"controls\">
              <div>
                {{editor}}
                <span class=\"help-inline\">
                  {{error}}
                </span>
              </div>
              <div class=\"help-block\">{{help}}</div>  
            </div>
          </div>"
  
  nestedField: "<div class=\"field-{{key}} {{nestedClass}}\">
                  {{nestedTitle}}
                  <div title=\"{{title}}\">{{editor}}</div>  
                  <div class=\"help-block\">{{help}}</div>
                </div>"
  
  checkbox: "<div class=\"control-group field-{{key}} type-checkbox\">
              <div class=\"controls\">
                <label class=\"checkbox\" for=\"{{id}}\">{{editor}}{{title}}</label>
                <div class=\"help-block\">{{help}}</div>
              </div>
            </div>"
  
  radio: "<div class=\"control-group field-{{key}} type-radio\">
            <div class=\"controls\">{{title}}
              {{editor}}
              <div class=\"help-block\">{{help}}</div>
            </div>
          </div>"


  list: "<div class=\"bbf-list\">
          <ul class=\"unstyled clearfix\">{{items}}</ul>
          <button type=\"button\" class=\"btn bbf-add\" data-action=\"add\">Add</div>
        </div>"
  
  listItem: "<li class=\"clearfix\">
              <div class=\"pull-left\">{{editor}}</div>
              <button type=\"button\" class=\"btn bbf-del\" data-action=\"remove\">&times;</button>
            </li>"
  
  date: "<div class=\"bbf-date\">
          <select data-type=\"date\" class=\"bbf-date\">{{dates}}</select>  
          <select data-type=\"month\" class=\"bbf-month\">{{months}}</select>  
          <select data-type=\"year\" class=\"bbf-year\">{{years}}</select>
        </div>"
  
  dateTime: "<div class=\"bbf-datetime\">
              <p>{{date}}</p>
              <p>
                <select data-type=\"hour\" style=\"width: 4em\">{{hours}}</select>:
                <select data-type=\"min\" style=\"width: 4em\">{{mins}}</select>
              </p>
            </div>"
  
  "list.Modal": "<div class=\"bbf-list-modal\">  {{summary}}</div>"


App.Templates.FormPartials=
  nestedTitle: "{{#if nestedTitle}}<h2>{{nestedTitle}}</h2>{{/if}}"


(->
  Form = Backbone.Form
  #TWITTER BOOTSTRAP TEMPLATES
  #Requires Bootstrap 2.x
  classNames = 
    error: "error" #Set on the field tag when validation fails

  Form.setTemplates App.Templates.Forms, classNames
)()
