object @pre_registration
attributes :current_step_no,:current_step_name,:subject,:respondent
attributes :current_step_form_content => :form_content,
           :current_step_form_schema => :schema,
           :step_names => :steps,
           :responder_item_attributes => :responder_item