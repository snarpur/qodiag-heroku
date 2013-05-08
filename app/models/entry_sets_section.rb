class EntrySetsSection  < ActiveRecord::Base
  belongs_to :entry_set
  belongs_to :section
  delegate :id, :name, :description,
           :to => :section, :prefix => true
end
