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
         !(u.role_names & ["caretaker"]).empty? && (user.id == u.invited_by_id || user.id == u.id)
        end
        can :manage, ResponderItem do |ri|
          ri.caretaker == user.person
        end
        can :read, Role
    elsif user.role? :client
      can [:read,:update], User do |u|
        u == user
      end
      can :manage, ResponderItem do |ri|
        ri.person == user.person
      end
    end

    #  elsif user.role? :organization_admin
    #    can :manage, [Person,Relationship]
    # elsif user.role? :product_team
    #    can :read, [Product, Asset]
    #    # manage products, assets he owns
    #    can :marage, Product do |product|
    #      product.try(:owner) == user
    #    end
    #    can :manage, Asset do |asset|
    #      asset.assetable.try(:owner) == user
    #    end
    #end
  end
end