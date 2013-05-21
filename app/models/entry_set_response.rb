class EntrySetResponse < ActiveRecord::Base
  has_many :entry_values
  has_one :responder_item
  belongs_to :entry_set
  delegate :name, :to => :entry_set, :prefix => true
  accepts_nested_attributes_for :entry_values
  attr_accessible :entry_set_id, :responder_item_id, :entry_values_attributes, :complete_item
  delegate :name, :to => :entry_set, :prefix => false

  def complete_item=(is_complete)
    item = ResponderItem.where(:entry_set_response_id => read_attribute(:id)).first
    item.complete_item=(is_complete)
    item.save
  end


end
