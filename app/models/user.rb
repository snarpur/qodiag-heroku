class User < ActiveRecord::Base
  has_many :rights
  has_many :roles, :through => :rights
  attr_accessor :users_attributes
  validates_presence_of :role_ids

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable and :timeoutable :registerable,
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :role_ids, :remember_me


  def role?(role)
    return !!self.roles.find_by_name(role.to_s)
  end

end

