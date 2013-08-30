class Person < ActiveRecord::Base

  validate :uniqueness_of_full_cpr
  #validates_presence_of :firstname , :sex, :lastname
  #validate :presence_of_full_cpr
  #validates_length_of :full_cpr, :is => 10, :allow_nil => true
  #validates_length_of :cpr, :is => 4
  #validate :presence_of_parent_occupation
  #after_save :set_parents_address
  

  belongs_to :address
  has_one :user
  has_many :respondent_responder_items, :class_name => "ResponderItem", :foreign_key => "respondent_id"
  has_many :patient_responder_items, :class_name => "ResponderItem", :foreign_key => "subject_id"
  has_many :caretaker_responder_items, :class_name => "ResponderItem", :foreign_key => "caretaker_id"
  
  # Added in order to reflect the relationship between  entry_sets and users
  has_many :entry_sets, :foreign_key => "created_by_id"

  # Added in order to reflect the relationship between  entry_sets and users
  has_many :entry_fields, :foreign_key => "created_by_id"


  has_many  :relationships,:dependent => :destroy do
    def child
      where("name = 'parent'")
    end

    def spouse
      where("name = 'spouse'")
    end
  end

  has_many :inverse_relationships, :class_name => "Relationship", :foreign_key => "relation_id" do
    def spouse
      where("name = 'spouse'")
    end
    def parents
      where("name = 'parent'")
    end

    def guardians
     where("name = 'guardian'")
    end
  end

  has_many  :relations, :through => :relationships do
    def children
      where("relationships.name = 'parent'")
    end
    def guardian_of
      where("relationships.name = 'guardian'")
    end

    def spouse
      where("relationships.name = 'spouse'")
    end
    def patients
      where("relationships.name = 'patient'")
    end
  end

  has_many :inverse_relations, :through => :inverse_relationships, :source => :person do
    def caretakers
      where("name = 'patient'")
    end

    def mother
      where("name = 'parent' AND people.sex = 'female'" )
    end

    def father
      where("name = 'parent' AND people.sex = 'male'" )
    end

    def spouse
      where("name = 'spouse'")
    end

    def parents
      where("name = 'parent'")
    end

    def guardians
      where("name = 'guardian'")
    end
  end
  



  accepts_nested_attributes_for :user, :allow_destroy => true
  accepts_nested_attributes_for :relations, :allow_destroy => true
  accepts_nested_attributes_for :relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relationships, :allow_destroy => true
  accepts_nested_attributes_for :inverse_relations, :allow_destroy => true
  accepts_nested_attributes_for :address, :allow_destroy => true
  accepts_nested_attributes_for :respondent_responder_items, :allow_destroy => true
  accepts_nested_attributes_for :patient_responder_items, :allow_destroy => true


  attr_accessible :id, :firstname, :lastname, :sex, :ispatient, :dateofbirth, :cpr, :workphone, :mobilephone, :occupation, :workplace, :full_cpr,
                  :avatar,
                  :address_id, :relations_attributes, :inverse_relations_attributes, :relationships_attributes, :inverse_relationships_attributes, :address_attributes, 
                  :spouse_relationships_attributes, :respondent_responder_items_attributes, :patient_responder_items_attributes, :user_attributes,
                  :full_siblings_attributes, :full_siblings, :half_siblings_attributes, :half_siblings, :inverse_half_siblings_attributes, :inverse_half_siblings,
                  :parent0_attributes, :parent1_attributes
  
  validates_associated :relationships, :inverse_relationships, :address #:user

  has_attached_file :avatar,
    :styles => {
        :tiny=> "64x64#",
        :thumb=> "100x100#",
        :small  => "150x150>",
        :medium => "250x250>",
        :large =>   "400x400>" },
    :default_url => "/assets/avatars/:style/missing.png"
  # validates :avatar, :attachment_presence => true
  # validates_with AttachmentPresenceValidator, :attributes => :avatar

  attr_accessor :current_responder_item
  
  delegate :email, :is_invited?,:invite!,
           :to => :user, :prefix => true


  RELATIONSHIP_NAMES = %w{parent guardian patient spouse}


  def self.relationship_names
    RELATIONSHIP_NAMES
  end

   RELATIONSHIP_NAMES.each do |name|
    define_method("inverse_#{name}_relationship_to") do |person|
      self.inverse_relationships & Relationship.where(:person_id => person.id, :name => name)
    end
    
    define_method("#{name}_relationship_to") do |person|
      self.relationships & Relationship.where(:relation_id => person.id, :name => name)
    end

    define_method("build_inverse_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      self.inverse_relationships.build({:person_id => person.id, :name => name}.merge(status))
    end

    define_method("build_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      self.relationships.build({:relation_id => person.id, :name => name}.merge(status))
    end

    define_method("find_or_build_inverse_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      relationship = self.inverse_relationships & Relationship.where(:person_id => person.id, :name => name)
      if relationship.empty?
        relationship = self.inverse_relationships.build({:person_id => person.id, :name => name}.merge(status))
      else
        relationship.first
      end
    end
    
    define_method("find_or_build_#{name}_relationship_to") do |person,*arg|
      status = arg[0] || {:status => true}
      relationship = self.relationships & Relationship.where(:relation_id => person.id, :name => name)
      if relationship.empty?
        relationship =  self.relationships.build({:relation_id => person.id, :name => name}.merge(status))
      else
        relationship.first
      end
    end
  end

  def respondent_subject_ids
    ResponderItem.by_respondent(self.id).subject_ids.to_a
  end
  
  def guardianship_relations
    self.relations.guardian_of
  end
  
  def responder_items
    self.send("#{self.role}_responder_items")
  end

  def responder_items_by_type_and_status(name,status=:all)
      status = status.is_a?(Array) ? status : [status]
      items = []
      status.each do |s|
        if name.eql?(:all)
          item_group = self.responder_items & ResponderItem.send(s)
        else
          item_group = self.responder_items & ResponderItem.send(name).send(s)
        end
        items << {:name => s, :items => item_group} unless item_group.empty?
      end
      items
  end

  def completed_surveys_by_id(id)
    self.responder_items & ResponderItem.by_survey_id(id).completed
  end

  def responder_items_by_group
    items = self.responder_items.surveys_by_group
    groups, groups_arr = {},[]
    items.each_with_index do |item,index|
      groups[item.access_code] ||= []
      groups[item.access_code] << item
        if item == items.last || items[index + 1].access_code != item.access_code
          groups_arr << {:name => item.access_code, :items => groups[item.access_code]}
        end
     end
     groups_arr
  end

  def role
    role = self.user.nil? ? 'patient' : self.user.role_name
  end

  def age
    if dateofbirth
      if Date.current.month > dateofbirth.month
        Date.current.year - dateofbirth.year
      elsif Date.current.month >= dateofbirth.month && Date.current.day >= dateofbirth.day
        Date.current.year - dateofbirth.year
      else
        Date.current.year - dateofbirth.year - 1
      end
    end
  end
  
  def presence_of_cpr
    errors.add(:cpr, "cannot be empty") if
      ispatient == true and cpr.nil?
  end
  
  def presence_of_full_cpr
    errors.add(:full_cpr, I18n.t("activerecord.errors.messages.invalid")) if
      !self.inverse_relationships.patient.empty? && (!valid_cpr? || dateofbirth.nil?)
  end

  def uniqueness_of_full_cpr
    errors.add(:full_cpr, I18n.t("activerecord.errors.messages.taken")) if
      Person.exists?(:dateofbirth => dateofbirth, :cpr => cpr) && id.nil?
  end

  def valid_cpr?
    cpr.to_s.length == 4 ? true : false
  end

  def full_cpr
    unless self.dateofbirth.nil?
      "#{self.dateofbirth.strftime("%d%m%y")}#{self.cpr}"
    end
  end

  #FIX: Exception on invalid date
  def full_cpr=(cpr)
    unless cpr.empty?
      day = cpr[0..1]
      month = cpr[2..3]
      year = cpr[4..5].to_i > 10 ? "19" << cpr[4..5] : "20" << cpr[4..5]
      self.dateofbirth = Date.civil(year.to_i,month.to_i,day.to_i)
      self.cpr = cpr[6..9]
    end
  end

  def family
    unless cpr.empty?
      r = [0 => '--']
      entry = NationalRegister.find_by_kennitala(full_cpr)
      unless entry.nil?
        family = NationalRegister.where(:fjolskyldunumer => entry.fjolskyldunumer)

        family.each do |member|
          day = member.kennitala[0..1]
          month = member.kennitala[2..3]
          year = member.kennitala[4..5].to_i > 10 ? "19" << member.kennitala[4..5] : "20" << member.kennitala[4..5]
          dob = Date.civil(year.to_i,month.to_i,day.to_i)
          age = Date.today.strftime("%Y").to_i - dob.year

          if age <= 18
            r.push(member.kennitala => "#{member.nafn} [#{member.kennitala}]")
          end
        end
      end
      r
    end
  end

  def full_name
    "#{self.firstname} #{self.lastname}"
  end

  def parents
    self.inverse_relations.parents
  end

  def guardians
    self.inverse_relations.guardians
  end
  
  def caretakers
    self.inverse_relations.caretakers
  end
  
  def spouses
    self.relations.spouse + self.inverse_relations.spouse
  end

  def spouse_relationships
    self.relationships.spouse + self.inverse_relationships.spouse
  end

  def mother
    self.inverse_relations.mother.first
  end

  def father
    self.inverse_relations.father.first
  end

  def is_parent_of?(person)
    !parent_relationship_to(person).empty?
  end

  def is_guardian_of?(person)
    !guardian_relationship_to(person).empty?
  end

  def is_parent_and_guardian_of?(person)
    (is_parent_of?(person) && is_guardian_of?(person))
  end

  def full_siblings_relationships
    relations = Relationship.where(:name => 'parent', :person_id => self.parents[0].id) + Relationship.where(:name => 'parent', :person_id => self.parents[1].id)
  end

  def full_siblings
    full_siblings = self.parents[0].relations.children & self.parents[1].relations.children
    full_siblings.delete(self)

    if full_siblings.empty?
      full_siblings = self.parents[0].relations.build
    end

    full_siblings
  end

  def full_siblings_attributes=(siblings)
    unless siblings.empty?
      siblings.each do |i|
        unless i['firstname'].nil?
          p = Person.find_or_initialize_by_id(i)
          p.save()
          if p.parents.empty?
            p.inverse_relationships.create([{:name => 'parent', :person_id => parents[0].id}, {:name => 'parent', :person_id => parents[1].id}])
          end
        end
      end
    end
  end

  def half_siblings
    half_siblings = self.parents[0].relations.children - self.parents[1].relations.children

    if half_siblings.empty?
      half_siblings = self.parents[0].relations.build
    end

    half_siblings
  end

  def half_siblings_attributes=(siblings)
    unless siblings.empty?
      siblings = siblings - parents[1].relations.children
      siblings.each do |i|
        unless i['firstname'].nil?
          p = Person.find_or_initialize_by_id(i)
          p.save()
          if p.parents.empty?
            p.inverse_relationships.create([{:name => 'parent', :person_id => parents[0].id}])
          end
        end
      end
    end
  end

  def inverse_half_siblings
    half_siblings = self.parents[1].relations.children - self.parents[0].relations.children

    if half_siblings.empty?
      half_siblings = self.parents[1].relations.build
    end

    half_siblings
  end

  def inverse_half_siblings_attributes=(siblings)
    unless siblings.empty?
      siblings = siblings - parents[0].relations.children
      siblings.each do |i|
        unless i['firstname'].nil?
          p = Person.find_or_initialize_by_id(i)
          p.save()
          if p.parents.empty?
            p.inverse_relationships.create([{:name => 'parent', :person_id => parents[1].id}])
          end
        end
      end
    end
  end

  def foster_siblings
    blood_related = self.parents.map {|i| i.relations.children}.flatten
    all = self.parents[0].relations.children + self.parents[0].relations.children
    foster_siblings = all - blood_related

    if foster_siblings.empty?
      foster_siblings = self.parents[0].relations.build
    end

    foster_siblings
  end

  def respondents
    self.guardians
  end

  def guardian_respondent
    User.joins(:person => :relationships).
    where("relationships.name = 'guardian' AND relationships.relation_id = #{self.id}").
    first.person
  end

  def opposite_parent_relation(parent)
      self.parents.select{|i| i.id != parent.id}.first
  end

  def find_or_create_opposite_parent_relation(parent)
    opposite_parent_relation(parent) || self.inverse_relations.build() 
  end

  def parent0
    p = self.parents[0]
    unless p
      p = self.parents.build
    end
    p
  end

  def parent0_attributes=(parent)
    p = Person.find_or_initialize_by_id(parent)
    p.save()
    unless self.parents[0]
      p.relationships.build([{:name => 'parent', :person_id => p.id, :relation_id => self.id}])
    end
    self.parents[0] = p
  end

  def parent1
    p = self.parents[1]
    unless p
      p = self.parents.build
    end
    p
  end

  def parent1_attributes=(parent)
    p = Person.find_or_initialize_by_id(parent)
    p.save()
    unless self.parents[1]
      p.relationships.build(:name => 'parent', :person_id => p.id, :relation_id => self.id)
    end

    self.parents[1] = p
  end

  def other_parent_of(child)
    return child.parents.first if self.new_record?
    Person.joins(:relationships).where('relationships.name = ? AND relationships.relation_id = ? AND relationships.person_id != ?', 'parent', child.id, self.id).first
  end
  
  def parents_relationship
    parents = self.parents
    if parents.size == 1
       parents[0].relationships.build(:name => :spouse)
    elsif parents.size == 2
       relationship = parents[0].spouse_relationships & parents[1].spouse_relationships
       if relationship.empty?
        parents[0].relationships.build(:name => :spouse, :relation_id => parents[1].id)
       else
        relationship.first
       end
    end
  end
  
  def spouse_relationships_attributes=(params)
    params.each do |i|
      if !i.has_key?(:id) || i[:id] == nil
        if i[:relation_id] == self.id
          self.inverse_relationships.build(i)
        else
          self.relationships.build(i)
        end
      elsif i[:relation_id] == self.id
        self.inverse_relationships.find(i[:id]).update_attributes(i)
      elsif i[:person_id] == self.id
        self.relationships.find(i[:id]).update_attributes(i)
      end
    end
  end
end
