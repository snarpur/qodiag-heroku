class Relationship < ActiveRecord::Base
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"

  scope :parent, where(:name => :parent)
  scope :guardian, where(:name => :guardian)
  scope :patient, where(:name => :patient)
  scope :spouse, where(:name => :spouse)

  attr_accessor :status
  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :relation_attributes, :inverse_relation_attributes, :status


  def status
    if self.new_record?
      read_attribute(:status)
    else
      (self.read_attribute(:end).nil?)
    end
  end
end