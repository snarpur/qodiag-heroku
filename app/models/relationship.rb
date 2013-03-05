  class Relationship < ActiveRecord::Base
  belongs_to :person
  belongs_to :relation, :class_name => "Person"
  belongs_to :inverse_relation, :class_name => "Person"

  after_save :delete_nameless, :if => :is_nameless?
  # scope :parent, where(:name => :parent)
  # scope :guardian, where(:name => :guardian)
  # scope :patient, where(:name => :patient)
  # scope :spouse, where(:name => :spouse)

  accepts_nested_attributes_for :person, :relation
  attr_accessible :person_id, :relation_id, :name, :start, :end, :relation_attributes, :inverse_relation_attributes, :status, :person_attributes


  def status
    if self.new_record?
      @status
    else
      (self.read_attribute(:end).nil?)
    end
  end

  def status=(s)
    @status = s
  end

   private
    def delete_nameless
       self.destroy 
    end
    
    def is_nameless?
      (name == nil)
    end
end
