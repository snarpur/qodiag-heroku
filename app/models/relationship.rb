class Relationship < ActiveRecord::Base
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"
           
  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :relation_attributes
  
  
  
end
