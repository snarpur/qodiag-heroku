class Person < ActiveRecord::Base
  has_many  :relationships, :dependent => :destroy do
            def child
              find(:all, :conditions => "name = 'parent'")
            end
            
            def spouse
              find(:all, :conditions => "name = 'spouse'")
            end
            
            def spouse_as_parent(id)
              find(:all, :conditions => "relation = 'spouse'")
            end
          end          
  has_many  :relations, :through => :relationships 
  
  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
              def spouse
                find(:all, :conditions => "name = 'spouse'")
              end

            end
            
  has_many :inverse_relations, :through => :inverse_relationships, :source => :person do
      def parents
        find(:all,:conditions => "relationships.name = 'parent'" )
      end
    end  
  
  belongs_to :address    

  attr_accessor :relationship_name
  
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true, :reject_if => proc { |attributes| attributes.all? {|k,v| v.blank?} }
  
  attr_accessible :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_date,
                  :relations_attributes, :relationships_attributes, :inverse_relationships_attributes, :address_attributes, :inverse_relationships
  
  
  def full_date
    self.dateofbirth
  end 
  
  def full_date=(date)
    day = date[0..1]
    month = date[2..3]
    year = date[4..5].to_i > 10 ? "19" << date[4..5] : "20" << date[4..5]
    self.dateofbirth = Date.civil(year.to_i,month.to_i,day.to_i)
  end
  
  def mother
    Person.joins(:relationships).where(:sex => "female", "relationships.relation_id" => self.id )
  end
  
  def father
    Person.joins(:relationships).where(:sex => "male", "relationships.relation_id" => self.id )
  end
  
  def parents
    self.inverse_relations.parents
  end
  
  def is_person_parent(person)
    self.parents.include?(person)
  end
  
  def opposite_parent(parent)
    parents = self.parents
    if parents.size == 1 && !is_person_parent(parent) 
      parents
    elsif parents.size == 2 && is_person_parent(parent)
      parents = parents.select {|v| v != parent}
    end
  end
  
  def parents_relationship
    parents = self.parents
    all_relationships, parents_relationship = []
    parents.each{ |p|
      all_temp = all_relationships
      all_relationships = p.relationships + p.inverse_relationships
      parents_relationship = all_temp & all_relationships
    }
    parents_relationship
  end
  
  
  
end
