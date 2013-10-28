module ApplicationHelper
  
  def role_partial(name, action)
    partial = @current_user.role_name
    "#{name}/#{partial}/#{action}"
  end
  
  def role_view
    "#{@current_user.role_name}-view" unless @current_user.nil?
  end

  def set_checked_status(record,role)
    if record.role != role || record.new_record? then status = true end
    if record.role.nil? then status = false end
  end

  def javascript(*args)
    args = args.map { |arg| arg == :defaults ? arg : arg.to_s }
    content_for(:head) { javascript_include_tag(*args) }
  end

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

  def resource_name
    :user
  end

  def resource
    @resource ||= User.new
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

end
