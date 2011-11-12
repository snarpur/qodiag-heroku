# module SimpleForm
#   module Components
#     module Error
#       def error
#         unless object.nil?
#           if has_errors(object, attribute_name)
#             template.content_tag('span', object.errors[attribute_name].join(", ") ,:class => "error err-#{attribute_name}")
#           end
#         end
#       end

#       def attribute_has_errors(errors, attribute_name)
#         errors.has_key?(attribute_name.to_sym) && !errors[attribute_name.to_sym].empty?
#       end

#       def model_has_errors(errors)
#         !errors.empty?
#       end

#       def has_errors(object, attribute_name)
#         model_has_errors(object.errors) && attribute_has_errors(object.errors, attribute_name)
#       end

#     end
#   end
#   module Inputs
#     class Base
#       include SimpleForm::Components::Error
#     end
#   end
# end