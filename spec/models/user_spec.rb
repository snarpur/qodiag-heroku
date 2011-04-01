require 'spec_helper'

describe User do

  context "caretaker should have correct relathionships" do
    before do
        Role.create(:name => 'caretaker')
        @user = User.new(:email => "gulli@kalli.is", :password => "foobarbaz", :role_name => "caretaker")
    end
    # it { @user.roles.should_not be_nil}
    it { @user.person.should_not be_nil}
    it { @user.role?(:caretaker).should be_true}
  end
end
