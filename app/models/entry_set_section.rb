class EntrySetSection  < ActiveRecord::Base
  belongs_to :entry_set
  has_and_belongs_to :entry_field
end
