# This support package contains modules for authenticaiting
# devise users for request specs.

# This module authenticates users for request specs.#
module ValidUserRequestHelper
    # Define a method which signs in as a valid user.
    def sign_in_as_a_valid_user(role)
        # ASk factory girl to generate a valid user for us.
        @user ||= FactoryGirl.create(:user, :roles => [FactoryGirl.create(:role, :name => role.to_s)])

        # We action the login request using the parameters before we begin.
        # The login requests will match these to the user we just created in the factory, and authenticate us.
        post user_session_path, 'user[email]' => @user.email, 'user[password]' => @user.password
    end
end