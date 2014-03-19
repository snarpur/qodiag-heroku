class EntryValue < ActiveRecord::Base
  belongs_to :entry_field
  belongs_to :entry_set_response
  belongs_to :person
  has_many :comments, :class_name => "EntryValue", :foreign_key => "commentable_id"
  has_many :caretaker_comments, :through => :entry_set_response
  belongs_to :commentable, :class_name => "EntyValue"

  belongs_to :entry_field_option
  # delegate :text_option, :to => :entry_field_option, :prefix => false
  attr_accessible :entry_field_id, :entry_set_response_id, :string_value, :text_value, :person_id, :commentable_id, 
    :entry_field_option_id, :text_option


  # delegate :title, :help_text, :decription, :to => :entry_field, :prefix => true
  # delegate :field_type,  :to => :entry_field, :prefix => false

  scope :by_response, lambda {|response_id| where('entry_set_response_id = ?',response_id)}
  scope :by_fields, lambda {|field_ids| find_all_by_entry_field_id(field_ids)}

  def text_option
    entry_field_option.nil? ? nil : entry_field_option.text_option
  end

end
