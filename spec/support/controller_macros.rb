module ControllerMacros
  def login_user(role)
    before(:each) do
      @current_user = FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => role.to_s)])
      sign_in @current_user
    end
  end
end