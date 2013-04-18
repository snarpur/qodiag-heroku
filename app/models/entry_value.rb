class EntryValue  < ActiveRecord::Base
  
  belongs_to :responder_item
  belongs_to :caretaker, :class_name => 'Person'
  belongs_to :subject, :class_name => 'Person'

end
