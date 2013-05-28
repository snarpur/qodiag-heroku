class EntryValue < ActiveRecord::Base
  belongs_to :entry_field
  belongs_to :entry_set_response
  belongs_to :person
  has_many :comments, :class_name => "EntryValue", :foreign_key => "commentable_id"
  has_many :caretaker_comments, :through => :entry_set_response
  belongs_to :commentable, :class_name => "EntyValue"
  attr_accessible :entry_field_id, :entry_set_response_id, :string_value, :text_value, :person_id, :commentable_id

  scope :by_response, lambda {|response_id| where('entry_set_response_id = ?',response_id)}
  scope :by_fields, lambda {|field_ids| find_all_by_entry_field_id(field_ids)}


end
