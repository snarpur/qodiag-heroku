require 'spec_helper'

describe User do
  it "is valid with valid attributes" do
    user = User.new(:email => "orri@orri.is", :password => "foobarbaz")
    role = Role.new(:name => "System administrator")
    user.roles << role
    user.should be_valid
  end
  it "is without a email" do
    user = User.new(:email => "", :password => "foobarbaz")
    role = Role.new(:name => "System administrator")
    user.roles << role
    user.should be_invalid
  end
  
  it "is without a password" do
    user = User.new(:email => "orri@orri.is", :password => "")
    role = Role.new(:name => "System administrator")
    user.roles << role
    user.should be_invalid
  end
  
  it "is without a role" do
    user = User.new(:email => "orri@orri.is", :password => "foobarbaz")
    role = Role.new(:name => nil)
    user.roles << role
    user.should be_invalid
  end
end
