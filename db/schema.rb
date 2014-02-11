# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20140211094417) do

  create_table "addresses", :force => true do |t|
    t.string   "street_1"
    t.string   "street_2"
    t.integer  "zip_code"
    t.string   "town"
    t.string   "country"
    t.string   "home_phone"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "phone"
  end

  create_table "answers", :force => true do |t|
    t.integer  "question_id"
    t.text     "text"
    t.text     "short_text"
    t.text     "help_text"
    t.integer  "weight"
    t.string   "response_class"
    t.string   "reference_identifier"
    t.string   "data_export_identifier"
    t.string   "common_namespace"
    t.string   "common_identifier"
    t.integer  "display_order"
    t.boolean  "is_exclusive"
    t.integer  "display_length"
    t.string   "custom_class"
    t.string   "custom_renderer"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "default_value"
    t.string   "api_id"
    t.string   "display_type"
    t.string   "input_mask"
    t.string   "input_mask_placeholder"
  end

  add_index "answers", ["api_id"], :name => "uq_answers_api_id", :unique => true
  add_index "answers", ["question_id"], :name => "index_question_id"

  create_table "dependencies", :force => true do |t|
    t.integer  "question_id"
    t.integer  "question_group_id"
    t.string   "rule"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "dependency_conditions", :force => true do |t|
    t.integer  "dependency_id"
    t.string   "rule_key"
    t.integer  "question_id"
    t.string   "operator"
    t.integer  "answer_id"
    t.datetime "datetime_value"
    t.integer  "integer_value"
    t.float    "float_value"
    t.string   "unit"
    t.text     "text_value"
    t.string   "string_value"
    t.string   "response_other"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entry_field_options", :force => true do |t|
    t.integer  "entry_field_id"
    t.string   "text_option"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "entry_field_options", ["entry_field_id"], :name => "index_entry_field_id"

  create_table "entry_fields", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "help_text"
    t.string   "field_type",      :default => "text"
    t.integer  "parent_field_id"
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
    t.integer  "visibility",      :default => 0,      :null => false
    t.integer  "created_by_id"
  end

  add_index "entry_fields", ["created_by_id"], :name => "index_created_by_id"

  create_table "entry_set_responses", :force => true do |t|
    t.integer  "entry_set_id"
    t.integer  "responder_item_id"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  add_index "entry_set_responses", ["entry_set_id"], :name => "index_entry_set_id"
  add_index "entry_set_responses", ["responder_item_id"], :name => "index_responder_item_id"

  create_table "entry_sets", :force => true do |t|
    t.string   "name"
    t.integer  "created_by_id"
    t.string   "description"
    t.string   "type"
    t.datetime "created_at",                   :null => false
    t.datetime "updated_at",                   :null => false
    t.integer  "visibility",    :default => 0, :null => false
  end

  add_index "entry_sets", ["created_by_id"], :name => "index_created_by_id_entry_sets"

  create_table "entry_sets_sections", :force => true do |t|
    t.integer  "entry_set_id"
    t.integer  "section_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.integer  "display_order"
  end

  add_index "entry_sets_sections", ["entry_set_id"], :name => "entry_sets_sections_index_entry_set_id"
  add_index "entry_sets_sections", ["section_id"], :name => "entry_sets_sections_index_section_id"

  create_table "entry_values", :force => true do |t|
    t.integer  "entry_field_id"
    t.integer  "entry_set_response_id"
    t.string   "string_value"
    t.text     "text_value"
    t.datetime "created_at",            :null => false
    t.datetime "updated_at",            :null => false
    t.integer  "person_id"
    t.integer  "commentable_id"
    t.integer  "entry_field_option_id"
  end

  add_index "entry_values", ["commentable_id"], :name => "entry_values_index_commentable_id"
  add_index "entry_values", ["entry_field_id"], :name => "entry_values_index_entry_field_id"
  add_index "entry_values", ["entry_field_option_id"], :name => "entry_values_index_entry_field_option_id"
  add_index "entry_values", ["entry_set_response_id"], :name => "entry_values_index_entry_set_response_id"
  add_index "entry_values", ["person_id"], :name => "entry_values_index_person_id"

  create_table "national_registers", :id => false, :force => true do |t|
    t.integer "rownumber"
    t.string  "kennitala"
    t.string  "fjolskyldunumer"
    t.string  "bannmerki"
    t.string  "nafn"
    t.integer "postnumer"
    t.string  "heimili"
    t.integer "sveitarfelag"
    t.integer "lastchanged"
    t.string  "kyn"
    t.string  "hjuskaparstada"
    t.string  "ktmaka"
    t.string  "rikisfang"
    t.string  "faedingarstadur"
    t.integer "latinn"
  end

  add_index "national_registers", ["kennitala"], :name => "national_registers_index_kennitala"

  create_table "norm_references", :force => true do |t|
    t.integer  "survey_id"
    t.string   "sex"
    t.integer  "age_start"
    t.integer  "age_end"
    t.string   "responder"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "norm_references", ["survey_id"], :name => "norm_references_index_survey_id"

  create_table "people", :force => true do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "sex"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "ispatient"
    t.date     "dateofbirth"
    t.string   "mobilephone"
    t.string   "workphone"
    t.string   "occupation"
    t.string   "workplace"
    t.integer  "address_id"
    t.string   "cpr"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
  end

  add_index "people", ["address_id"], :name => "people_index_address_id"

  create_table "question_groups", :force => true do |t|
    t.text     "text"
    t.text     "help_text"
    t.string   "reference_identifier"
    t.string   "data_export_identifier"
    t.string   "common_namespace"
    t.string   "common_identifier"
    t.string   "display_type"
    t.string   "custom_class"
    t.string   "custom_renderer"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "api_id"
  end

  add_index "question_groups", ["api_id"], :name => "uq_question_groups_api_id", :unique => true

  create_table "questions", :force => true do |t|
    t.integer  "survey_section_id"
    t.integer  "question_group_id"
    t.text     "text"
    t.text     "short_text"
    t.text     "help_text"
    t.string   "pick"
    t.string   "reference_identifier"
    t.string   "data_export_identifier"
    t.string   "common_namespace"
    t.string   "common_identifier"
    t.decimal  "display_order",          :precision => 10, :scale => 2
    t.string   "display_type"
    t.boolean  "is_mandatory"
    t.integer  "display_width"
    t.string   "custom_class"
    t.string   "custom_renderer"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "correct_answer_id"
    t.string   "api_id"
  end

  add_index "questions", ["api_id"], :name => "uq_questions_api_id", :unique => true
  add_index "questions", ["correct_answer_id"], :name => "questions_index_correct_answer_id"
  add_index "questions", ["question_group_id"], :name => "questions_index_question_group_id"
  add_index "questions", ["survey_section_id"], :name => "questions_index_survey_section_id"

  create_table "relationships", :force => true do |t|
    t.integer  "person_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "relation_id"
    t.date     "start"
    t.date     "end"
  end

  add_index "relationships", ["person_id"], :name => "relationships_index_person_id"
  add_index "relationships", ["relation_id"], :name => "relationships_index_relation_id"

  create_table "responder_items", :force => true do |t|
    t.integer  "respondent_id"
    t.integer  "subject_id"
    t.integer  "survey_id"
    t.string   "registration_identifier"
    t.datetime "deadline"
    t.datetime "completed"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "caretaker_id"
    t.integer  "response_set_id"
    t.integer  "entry_set_response_id"
  end

  add_index "responder_items", ["caretaker_id"], :name => "responder_items_index_caretaker_id"
  add_index "responder_items", ["entry_set_response_id"], :name => "responder_items_index_entry_set_response_id"
  add_index "responder_items", ["respondent_id"], :name => "responder_items_index_respondent_id"
  add_index "responder_items", ["response_set_id"], :name => "responder_items_index_response_set_id"
  add_index "responder_items", ["subject_id"], :name => "responder_items_index_subject_id"
  add_index "responder_items", ["survey_id"], :name => "responder_items_index_survey_id"

  create_table "response_sets", :force => true do |t|
    t.integer  "user_id"
    t.integer  "survey_id"
    t.string   "access_code"
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "api_id"
  end

  add_index "response_sets", ["access_code"], :name => "response_sets_ac_idx", :unique => true
  add_index "response_sets", ["api_id"], :name => "uq_response_sets_api_id", :unique => true
  add_index "response_sets", ["survey_id"], :name => "response_sets_index_survey_id"
  add_index "response_sets", ["user_id"], :name => "response_sets_index_user_id"

  create_table "responses", :force => true do |t|
    t.integer  "response_set_id"
    t.integer  "question_id"
    t.integer  "answer_id"
    t.datetime "datetime_value"
    t.integer  "integer_value"
    t.float    "float_value"
    t.string   "unit"
    t.text     "text_value"
    t.string   "string_value"
    t.string   "response_other"
    t.string   "response_group"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "survey_section_id"
    t.string   "api_id"
  end

  add_index "responses", ["answer_id"], :name => "responses_index_answer_id"
  add_index "responses", ["api_id"], :name => "uq_responses_api_id", :unique => true
  add_index "responses", ["question_id"], :name => "responses_index_question_id"
  add_index "responses", ["response_set_id"], :name => "responses_index_response_set_id"
  add_index "responses", ["survey_section_id"], :name => "index_responses_on_survey_section_id"

  create_table "rights", :force => true do |t|
    t.integer "role_id"
    t.integer "user_id"
  end

  add_index "rights", ["role_id"], :name => "rights_index_role_id"
  add_index "rights", ["user_id"], :name => "rights_index_user_id"

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "scores", :force => true do |t|
    t.string   "name"
    t.integer  "norm_reference_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "start_value"
    t.float    "end_value"
    t.string   "result_name"
    t.float    "value"
  end

  add_index "scores", ["norm_reference_id"], :name => "scores_index_norm_reference_id"

  create_table "sections", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "sections_entry_fields", :force => true do |t|
    t.integer  "entry_field_id"
    t.integer  "section_id"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
    t.integer  "display_order"
  end

  add_index "sections_entry_fields", ["entry_field_id"], :name => "sections_entry_fields_index_entry_field_id"
  add_index "sections_entry_fields", ["section_id"], :name => "sections_entry_fields_index_section_id"

  create_table "survey_sections", :force => true do |t|
    t.integer  "survey_id"
    t.string   "title"
    t.text     "description"
    t.string   "reference_identifier"
    t.string   "data_export_identifier"
    t.string   "common_namespace"
    t.string   "common_identifier"
    t.integer  "display_order"
    t.string   "custom_class"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "survey_sections", ["survey_id"], :name => "survey_sections_index_survey_id"

  create_table "survey_translations", :force => true do |t|
    t.integer  "survey_id"
    t.string   "locale"
    t.text     "translation"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "surveys", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.string   "access_code"
    t.string   "reference_identifier"
    t.string   "data_export_identifier"
    t.string   "common_namespace"
    t.string   "common_identifier"
    t.datetime "active_at"
    t.datetime "inactive_at"
    t.string   "css_url"
    t.string   "custom_class"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "display_order"
    t.string   "api_id"
    t.integer  "survey_version",         :default => 0
  end

  add_index "surveys", ["access_code", "survey_version"], :name => "surveys_access_code_version_idx", :unique => true
  add_index "surveys", ["api_id"], :name => "uq_surveys_api_id", :unique => true

  create_table "thjodskra", :primary_key => "kennitala", :force => true do |t|
    t.integer "rownumber",       :limit => 8,                    :null => false
    t.string  "fjolskyldunumer", :limit => 10,                   :null => false
    t.string  "bannmerki",       :limit => 3,  :default => "",   :null => false
    t.string  "nafn",            :limit => 31,                   :null => false
    t.integer "postnumer",                                       :null => false
    t.string  "heimili",         :limit => 21,                   :null => false
    t.integer "sveitarfelag",                                    :null => false
    t.integer "lastchanged",                                     :null => false
    t.integer "kyn",             :limit => 1,  :default => 0,    :null => false
    t.string  "hjuskaparstada",  :limit => 1,  :default => "",   :null => false
    t.string  "ktmaka",          :limit => 10,                   :null => false
    t.string  "rikisfang",       :limit => 2,  :default => "IS", :null => false
    t.string  "faedingarstadur", :limit => 4,  :default => "",   :null => false
    t.integer "latinn",          :limit => 1,  :default => 0,    :null => false
  end

  add_index "thjodskra", ["fjolskyldunumer"], :name => "fjolskyldunumer"
  add_index "thjodskra", ["heimili"], :name => "heimili"
  add_index "thjodskra", ["kennitala"], :name => "kennitala", :unique => true
  add_index "thjodskra", ["ktmaka"], :name => "ktmaka"
  add_index "thjodskra", ["postnumer"], :name => "postnumer"
  add_index "thjodskra", ["sveitarfelag"], :name => "sveitarfelag"

  create_table "users", :force => true do |t|
    t.string   "email",                                 :default => "", :null => false
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "invitation_token",       :limit => 20
    t.datetime "invitation_sent_at"
    t.integer  "person_id"
    t.integer  "invited_by_id"
    t.datetime "invitation_accepted_at"
    t.string   "invited_by_type"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["invitation_token"], :name => "index_users_on_invitation_token"
  add_index "users", ["person_id"], :name => "users_index_person_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "validation_conditions", :force => true do |t|
    t.integer  "validation_id"
    t.string   "rule_key"
    t.string   "operator"
    t.integer  "question_id"
    t.integer  "answer_id"
    t.datetime "datetime_value"
    t.integer  "integer_value"
    t.float    "float_value"
    t.string   "unit"
    t.text     "text_value"
    t.string   "string_value"
    t.string   "response_other"
    t.string   "regexp"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "validations", :force => true do |t|
    t.integer  "answer_id"
    t.string   "rule"
    t.string   "message"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
