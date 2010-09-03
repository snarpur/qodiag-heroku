class ApplicationController < ActionController::Base
  protect_from_forgery
  layout 'application'
  
  def self.get_error_msg(tag, msg)
    unless tag.include?("label")
      %(<div class="validation-error">#{tag}<span class="validation-error-msg">&nbsp;#{msg.join(',')}</span></div>).html_safe
    else
      tag
    end
    
  end
  
  
  #Configure validation error messages
  ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
    if instance.error_message.kind_of?(Array)
      get_error_msg(html_tag, instance.error_message)
    else
      %(#{html_tag}<span class="validation-error">&nbsp;#{instance.error_message}</span>).html_safe
    end
  end

end