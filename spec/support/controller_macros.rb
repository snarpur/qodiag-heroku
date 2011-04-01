module ControllerMacros
  def login_user(role)
    before(:each) do
      #@request.env["devise.mapping"] = Devise.mappings[:admin]
      @admin = Factory.create(:user, :roles => [Factory(:role, :name => role.to_s)])
      sign_in @admin
    end
  end
end