class SectionsEntryField  < ActiveRecord::Base
  belongs_to :section
  belongs_to :entry_field
  delegate :title, :description,
           :to => :entry_field, :prefix => true
end
