module ApplicationHelper
  
  def set_checked_status(record,role)
    if record.role != role || record.new_record? : status = true end
    if record.role.nil? : status = false end  
  end
  
  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    content_for(:head) { javascript_include_tag(*args) }
  end
  
  def remove_link_unless_new_record(fields)
    out = ''
    out << fields.hidden_field(:_delete)  unless fields.object.new_record?
    out << link_to(t('actions.remove'), "##{fields.object.class.name.underscore}", :class => 'remove-spouse button small red')
    out
  end

  # This method demonstrates the use of the :child_index option to render a
  # form partial for, for instance, client side addition of new nested
  # records.
  #
  # This specific example creates a link which uses javascript to add a new
  # form partial to the DOM.
  #
  #   <% form_for @project do |project_form| -%>
  #     <div id="tasks">
  #       <% project_form.fields_for :tasks do |task_form| %>
  #         <%= render :partial => 'task', :locals => { :f => task_form } %>
  #       <% end %>
  #     </div>
  #   <% end -%>

    
  def generate_html(form_builder, method, options = {}, attributes = {})
    options[:object] ||= form_builder.object.class.reflect_on_association(method).klass.new(attributes)
    options[:partial] ||= method.to_s.singularize
    options[:form_builder] ||= :f  
    options[:locals] ||= {}
    form_builder.fields_for(method, options[:object], :child_index => 'NEW_RECORD') do |f|
      form_locals = {options[:form_builder] => f}.merge(options[:locals])
      render(:partial => options[:partial], :locals => form_locals)
    end
  end

  def generate_template(form_builder, method, options = {}, attributes = {})
    escape_javascript generate_html(form_builder, method, options, attributes)
  end
  
  def call_nil(obj, method)
    result = obj.try(method)
    result = result == nil ?  "" : result
  end
  
end
