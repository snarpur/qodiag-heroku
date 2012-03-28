class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user
    if user.role? :super_admin
      can :manage, :all
    elsif user.role? :caretaker
      can :create, User do |u|
       (u.role_names & ["caretaker","super_admin"]).empty?
      end
      can [:read, :update], User do |u|
       !(u.role_names & ["caretaker","super_admin"]).empty? && (user.id == u.invited_by_id || user.id == u.id)
      end
      can :manage, Person do |p|
       p.inverse_relations.caretaker.include?(user.person)
      end
      can :manage, ResponderItem do |ri|
        ri.caretaker == user.person
      end
      can :read, Role
    elsif user.role? :client
      can [:read,:update], User do |u|
        u == user
      end
      can :manage, ResponseSet do |rs|
        rs.responder.user == user
      end
      can :manage, Person do |p|
        p.guardian_client == user.person
      end

      can :manage, ResponderItem do |ri|
        ri.client == user.person
      end 
    end
    #only super_admin abilities
    if !user.role? :super_admin
      cannot :manage, User do |u|
        !(u.role_names & ["caretaker","super_admin"]).empty? && !user.role_names.includ?('super_admin')
      end
    end 

  end
end