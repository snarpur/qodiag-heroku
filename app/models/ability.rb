class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user
    if user.role? :super_admin
      can :manage, :all
    elsif user.role? :caretaker
      can :manage, User do |u|
       (u.role_names & ["caretaker","super_admin"]).empty?
      end
      can [:read, :update], User do |u|
       !(u.role_names & ["caretaker","super_admin"]).empty? && (user.id == u.invited_by_id || user.id == u.id)
      end
      can :manage, Person do |p|
        #!(p.relation_ids & user.person.relation_ids).empty?
        true
      end
      can :manage, ResponderItem do |ri|
        ri.caretaker == user.person
      end
      can [:read,:update,:destroy], EntrySet do |es|
        es.visibility == 1 || (es.created_by_id == user.person_id)
      end
      
      can :create, EntrySet

      can :read, Role
      can :manage, Survey 
    elsif user.role? :respondent
      can [:read,:update], User do |u|
        u == user
      end
      can :manage, ResponseSet do |rs|
        rs.respondent.user == user
      end
      can :manage, Person do |p|
        p.guardian_respondent == user.person
      end
      can :manage, Person do |p|
        p == user.person
      end
      can :manage, ResponderItem do |ri|
        ri.respondent == user.person
      end 
    end
    #only super_admin abilities
    if !user.role? :super_admin
      cannot :manage, User do |u|
        !(u.role_names & ["caretaker","super_admin"]).empty? && !user.role_names.include?('super_admin')
      end
    end 

  end
end
