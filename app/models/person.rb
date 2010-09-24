class Person < ActiveRecord::Base
  
  validates_presence_of :firstname  #, :lastname, :sex, :full_date
  #validate :presence_of_cpr
  #validates_numericality_of :cpr, :full_date
  #validates_length_of :full_date, :is => 6
  #validates_length_of :cpr, :is => 4
  #validate :presence_of_parent_occupation
  #after_save :set_parents_address



  
  
  has_many  :relationships, :dependent => :destroy do
    def child
      find(:all, :conditions => "name = 'parent'")
    end
  
    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end
  
    def guardian(id)
      find(:all, :conditions => "name = 'guardian' AND relation_id = #{id}")
    end
  
    def spouse_as_parent(id)
      find(:all, :conditions => "relation = 'spouse'")
    end
  end 
  
  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
    def spouse
     find(:all, :conditions => "name = 'spouse'")
    end
  end
  
  has_many  :relations, :through => :relationships do
    def children
      find(:all, :conditions => "name = 'parent'")
    end
    
    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end
  end
            
  has_many :inverse_relations, :through => :inverse_relationships, :source => :person do
    def parents
      find(:all,:conditions => "relationships.name = 'parent'" )
    end
  
    def mother
      find(:all,:conditions => "relationships.name = 'parent' AND sex = 'female'" )
    end

    def father
      find(:all,:conditions => "relationships.name = 'parent' AND sex = 'male'" )
    end
    
    def spouse
      find(:all, :conditions => "name = 'spouse'")
    end
  end  
  
  belongs_to :address    

  
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true #,  :reject_if => proc {|attributes| attributes['person_id'].blank?}
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relations, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true

  attr_accessible :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_date, :address_id,
                  :relations_attributes, :inverse_relations_attributes, :relationships_attributes, :inverse_relationships_attributes, :address_attributes
  
  validates_associated :relationships, :address
  
  
  def presence_of_cpr
    errors.add(:cpr, "má ekki vera autt") if
      ispatient == true and cpr.nil?
  end
  
  def presence_of_parent_occupation
    #logger.debug_variables(binding)
    errors.add(:occupation, "má ekki vera autt") if
      !relationships.select{|v|v.name == "guardian" || "parent"}.empty? and occupation.try("empty?")
  end
  
  def full_date
    unless self.dateofbirth.nil?
      date = self.dateofbirth
      day = "%02d" % date.mday 
      month = "%02d" % date.month
      year =  date.year.to_s[-2..-1].to_i
      self.full_date = "#{day}#{month}#{year}"
    end
  end 
  
  def full_date=(date)

    unless date.empty?
      day = date[0..1]
      month = date[2..3]
      year = date[4..5].to_i > 10 ? "19" << date[4..5] : "20" << date[4..5]
      self.dateofbirth = Date.civil(year.to_i,month.to_i,day.to_i)
    end
    self.dateofbirth = Date.new
  end
  
  def mother
    self.inverse_relations.mother.first
  end
  
  def father
    self.inverse_relations.father.first
  end
  
  def parents
    self.inverse_relations.parents
  end
  
  def spouse_relationships
    self.relationships.spouse + self.inverse_relationships.spouse
  end
  
  def spouses
    self.relations.spouse + self.inverse_relations.spouse
  end
  
  def full_siblings
    self.mother.relations.children & self.father.relations.children
  end
  
  def half_siblings(parent)
    parent.relations.children - self.opposite_parent(parent).relations.children
  end
  
  def foster_siblings
    spouses = self.mother.spouses + self.mother.spouses
    spouses.delete(self.father)
    spouses.delete(self.mother)
    foster_siblings = []
    spouses.each do |i|
     foster_siblings << i.relations.children
    end
    #get mother spouses
    #get father spouses
    #get mother spouses children exclude common children
    #get father spouses children exclude common children
    
  end

  def is_person_parent(person)
    self.parents.include?(person)
  end

  def opposite_parent(parent)
      self.parents.select{|i| i != parent}.first  
  end

  def parents_relationship
    parents = self.parents   
    if parents.size <= 1
      nil
    else
       parents[0].spouse_relationships & parents[1].spouse_relationships 
    end
  end
end
