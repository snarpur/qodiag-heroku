class Devise::SwitchUsersController < ApplicationController
 
  def login_as
    session['last_user_id'] = nil
    session['last_user_id'] = @current_user.id
    sign_in :user, Person.find(params[:id]).user

    redirect_to root_path()
  end

  def logout_as
    session['last_user_id'] = nil
    sign_in :user, User.find(params[:id])

    redirect_to root_path()
  end

end
