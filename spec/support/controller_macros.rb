module ControllerMacros
  def login_user(role)
    before(:each) do
      @admin = Factory.create(:user, :roles => [Factory(:role, :name => role.to_s)])
      sign_in @admin
    end
  end
end