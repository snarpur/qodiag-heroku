require 'spec_helper'

describe User do
  context "caretaker should have correct relathionships" do
    before do
        role_id = Role.find_by_name("caretaker").id.to_s
        @user = User.new(:email => "gulli@kalli.is", :password => "foobarbaz", :role_ids => role_id)
    end
    it { @user.person.should_not be_nil }
    it { @user.role_names.should include("caretaker")}
  end

  context "client should have correct relationships" do
    before do
      role_id = Role.find_by_name("client").id.to_s
      @user = User.new(:email => "gulli@kalli.is", :password => "foobarbaz", :role_ids => role_id)
    end
    it { @user.person.should_not be_nil }
    it { @user.role_names.should include("client") }
  end
  context "user has pending_registration" do

  end

end
