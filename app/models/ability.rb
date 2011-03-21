class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user

    if user.role? :system_admin
      can :manage, :all
    elsif user.role? :organization_admin
      can :manage, [Person,Relationship]
    # elsif user.role? :product_team
    #    can :read, [Product, Asset]
    #    # manage products, assets he owns
    #    can :manage, Product do |product|
    #      product.try(:owner) == user
    #    end
    #    can :manage, Asset do |asset|
    #      asset.assetable.try(:owner) == user
    #    end
    end
  end
end