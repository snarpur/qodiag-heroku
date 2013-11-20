class EntryFieldOption < ActiveRecord::Base
  attr_accessible :entry_field_id, :text_option

  belongs_to :entry_field
  belongs_to :entry_value
  
end
