module ControllerMacros
  def login_admin
    before(:each) do
      #@request.env["devise.mapping"] = Devise.mappings[:admin]
      @admin = Factory.create(:admin)
      sign_in @admin
    end
  end
end