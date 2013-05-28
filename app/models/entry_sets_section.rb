class EntrySetsSection  < ActiveRecord::Base
  belongs_to :entry_set
  belongs_to :section
  delegate :id, :name, :description, :entry_field_ids,
           :to => :section, :prefix => true
end
