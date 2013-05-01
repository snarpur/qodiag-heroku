class EntryField  < ActiveRecord::Base
  has_many :sections_entry_fields
  has_many :sections, :through => :sections_entry_fields
end
