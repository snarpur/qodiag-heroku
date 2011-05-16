require 'spec_helper'

describe User do
  context "caretaker should have correct role" do
    before do
        role_id = Role.find_by_name("caretaker").id.to_s
        @user = User.new(:email => "gulli@kalli.is", :password => "foobarbaz", :role_ids => role_id)
    end
    it { @user.role_names.should include("caretaker")}
  end

  context "client should have correct relationships"do
    before do
      @caretaker = Factory(:user, :roles => [Factory(:role, :name => 'caretaker')])
      @user = User.new_client_as_guardian_by_invitation(Factory.attributes_for(:simple_client, :inviter => @caretaker))
      @user.save

    end
    it { @user.role_names.should include('client') }
    it { @user.person.should_not be_nil }
    it {User.find(@user.invited_by_id) == @caretaker}
  end


  context "validates correctly" do
    before do
      @existing_user = User.create(:email => "gulli@kalli.is", :password => "asdfkjl", :password_confirmation => "asdfkjl")
    end
    it "should have user already exists" do
         user = User.new(:email => "gulli@kalli.is", :invitation => true)
         user.valid?
         user.errors.should include(:email)
         user.errors.should_not include(:password)
     end
     it "should have user both password errors exists" do
         user = User.new(:email => "palli@kalli.is")
         user.valid?
         user.errors.should include(:password)
         user.errors.should include(:password_confirmation)
     end
    it "should have password_confirmation errors" do
         user = User.new(:email => "palli@kalli.is", :password => "asdfkj")
         user.valid?
         user.errors.should include(:password_confirmation)
     end
     it "should have password_confirmation does not match" do
         user = User.new(:email => "palli@kalli.is", :password => "asdfkj", :password_confirmation => "askj")
         user.valid?
         user.errors.should include(:password)
     end
     it "should have password to short" do
         user = User.new(:email => "palli@kalli.is", :password => "askj", :password_confirmation => "askj")
         user.valid?
         user.errors.should include(:password)
     end
  end

end
