class Relationship < ActiveRecord::Base
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  
  attr_accessible :person_id, :relation_id, :name
  
end
