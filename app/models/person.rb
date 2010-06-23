class Person < ActiveRecord::Base
  has_many  :relationships, :dependent => :destroy do
            def child
              find(:all, :conditions => "name = 'parent'")
            end
            
            def spouse
              find(:all, :conditions => "name = 'spouse'")
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


  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true, :reject_if => proc { |attributes| attributes.any? {|k,v| v.blank?} }
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true, :reject_if => proc { |attributes| attributes.any? {|k,v| v.blank?} }
  
  attr_accessible :firstname, :lastname, :sex, :ispatient, 
                  :relations_attributes, :relationships_attributes, :inverse_relationships_attributes
  
  
  def mother
    Person.joins(:relationships).where(:sex => "female", "relationships.relation_id" => self.id )
  end
  
  def father
    Person.joins(:relationships).where(:sex => "male", "relationships.relation_id" => self.id )
  end
  
  def parents
    self.inverse_relations.parents
  end
end
