module SimpleForm 
  module Components 
    module Error 
      
      def error
        errors = object.errors
        Rails.logger.debug "xx -- attirbute_name = #{attribute_name} = #{attribute_has_errors(errors, attribute_name)}"
        if has_errors(errors, attribute_name)
          template.content_tag('span', errors[attribute_name].join(", ") ,:class => "error err-#{attribute_name}")
        end
      end 
      
      def attribute_has_errors(errors, attribute_name)
        errors.has_key?(attribute_name.to_sym) && !errors[attribute_name.to_sym].empty?
      end
      
      def model_has_errors(errors)
        !errors.empty?
      end
      
      def has_errors(errors, attribute_name)
        model_has_errors(errors) && attribute_has_errors(errors, attribute_name)
      end
      
    end 
  end 
  module Inputs 
    class Base 
      include SimpleForm::Components::Error
    end 
  end 
end