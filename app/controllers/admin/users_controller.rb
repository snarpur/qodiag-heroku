module Admin
  class UsersController < ApplicationController
    before_filter :get_user
    before_filter :accessible_roles
    load_and_authorize_resource

    def index
      @users = User.by_role('caretaker') #
       respond_to do |format|
         format.html
       end
    end

    private
    def accessible_roles
      @accessible_roles = Role.accessible_by(current_ability,:read)
    end

    # Make the current user object available to views
    #----------------------------------------
    def get_user
      @current_user = current_user
    end
  end
end