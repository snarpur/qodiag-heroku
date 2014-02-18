class EntrySetResponse < ActiveRecord::Base
  has_many :entry_values
  has_one :responder_item
  belongs_to :entry_set
  accepts_nested_attributes_for :entry_values, :allow_destroy => true, reject_if: :reject_options
  attr_accessible :entry_set_id, :responder_item_id, :entry_values_attributes, :complete_item
  
  delegate :name, :to => :entry_set, :prefix => true
  
  # delegate :id, :to => :responder_item, :prefix => true
  delegate :caretaker_id, :respondent_id, :subject_id, :to => :responder_item, :prefix => false
  
  delegate :name, :section_ids, :sections, :entry_sets_sections, :to => :entry_set, :prefix => false

  def reject_options(attributed)
    attributed['string_value'].blank? and attributed['text_value'].blank? and attributed['entry_field_option_id'].blank?
  end

  def complete_item=(is_complete)
    item = ResponderItem.where(:entry_set_response_id => read_attribute(:id)).first
    item.complete_item=(is_complete)
    item.save
  end


end
