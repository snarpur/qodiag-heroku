/**
 * Include this file _after_ the main backbone-forms file to override the default templates.
 * You only need to include templates you want to override.
 *
 * Requirements when customising templates:
 * - Each template must have one 'parent' element tag.
 * - "data-type" attributes are required.
 * - The main placeholder tags such as the following are required: fieldsets, fields
        {{{#if title}}}\
          <h2>{{title}}</h2>\
        {{/if}}}\
 */
;(function() {
  var Form = Backbone.Form;

    
  //TWITTER BOOTSTRAP TEMPLATES
  //Requires Bootstrap 2.x


  Form.setTemplates({

    //HTML
    form: '\
      <form>{{fieldsets}}</form>\
    ',

    fieldset: '\
      <fieldset>\
        <legend>{{legend}}</legend>\
        {{fields}}\
      </fieldset>\
    ',

    field: '\
      <div class="control-group field-{{key}} {{typeClass}}">\
        <label class="control-label" for="{{id}}">{{title}}</label>\
        <div class="controls">\
          <div>{{editor}}</div>\
          <div class="help-block">{{help}}</div>\
        </div>\
      </div>\
    ',

    nestedField: '\
      <div class="field-{{key}}">\
        <div title="{{title}}">{{editor}}</div>\
        <div class="help-block">{{help}}</div>\
      </div>\
    ',

   checkbox: '\
      <div class="control-group field-{{key}} type-checkbox">\
        <div class="controls">\
          <label class="checkbox" for="{{id}}">{{editor}}{{title}}</label>\
          <div class="help-block">{{help}}</div>\
        </div>\
      </div>\
    ',
    
    list: '\
      <div class="bbf-list">\
        <ul class="unstyled clearfix">{{items}}</ul>\
        <button type="button" class="btn bbf-add" data-action="add">Add</div>\
      </div>\
    ',

    listItem: '\
      <li class="clearfix">\
        <div class="pull-left">{{editor}}</div>\
        <button type="button" class="btn bbf-del" data-action="remove">&times;</button>\
      </li>\
    ',

    date: '\
      <div class="bbf-date">\
        <select data-type="date" class="bbf-date">{{dates}}</select>\
        <select data-type="month" class="bbf-month">{{months}}</select>\
        <select data-type="year" class="bbf-year">{{years}}</select>\
      </div>\
    ',

    dateTime: '\
      <div class="bbf-datetime">\
        <p>{{date}}</p>\
        <p>\
          <select data-type="hour" style="width: 4em">{{hours}}</select>\
          :\
          <select data-type="min" style="width: 4em">{{mins}}</select>\
        </p>\
      </div>\
    ',

    'list.Modal': '\
      <div class="bbf-list-modal">\
        {{summary}}\
      </div>\
    '
  }, {
  
    //CLASSNAMES
    error: 'error' //Set on the field tag when validation fails
  });


})();
