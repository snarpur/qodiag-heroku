object @pre_registration
attributes  :form_identifier,
            :current_step_no,
            :current_step_name,
            :next_step_no,
            :last_step_no,
            :step_names,
            :root_object_id,
            :redirect_url_on_complete,
            :root_url,
            :errors
attributes :current_step_form_content => :form_content,
           :current_step_form_schema => :schema
