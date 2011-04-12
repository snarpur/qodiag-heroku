class User < ActiveRecord::Base
  has_many :rights
  has_many :roles, :through => :rights
  belongs_to :person
  attr_accessor :users_attributes
  #after_initialize :user_factory, :if => :new_record?



  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable :registerable,
  devise :invitable, :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation,:role_ids, :remember_me, :person_attributes
  accepts_nested_attributes_for :person




  def role?(role)
    return !!self.roles.find_by_name(role.to_s)
  end

  def role_names
    self.roles.map{|r| r[:name]}
  end

  private
  def user_factory
    if self.factory
      self.build_person()
      Person.new(:factory => {:name => :child, :relation => self.person })
    end
    self.roles << Role.find(self.role_ids)
  end
end

