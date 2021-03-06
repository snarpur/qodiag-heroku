class EntrySetsSection  < ActiveRecord::Base
  belongs_to :entry_set
  belongs_to :section
  attr_accessible :display_order, :entry_set_id, :section_id
  delegate :id, :name, :description, :entry_field_ids,
           :to => :section, :prefix => true

end
