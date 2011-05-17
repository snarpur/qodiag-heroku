module ControllerMacros
  def login_user(role)
    before(:each) do
      @current_user = Factory.create(:user, :roles => [Factory(:role, :name => role.to_s)])
      sign_in @current_user
    end
  end
end