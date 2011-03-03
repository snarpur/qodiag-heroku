class User < ActiveRecord::Base
  has_and_belongs_to_many :roles
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  accepts_nested_attributes_for :roles, :allow_destroy => true
  # Setup accessible (or protected) attributes for your model
  attr_accessor :password
  attr_accessible :email, :password, :password_confirmation, :remember_me, :roles_attributes
  
  validates_associated :roles



  
  
  def role?(role)
    return !!self.roles.find_by_name(role.to_s.camelize)
  end
 
end
