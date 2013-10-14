class SignUpController < ApplicationController
  
  def create
    if not params[:user][:email].blank?
      @user = User.new
      @user.email = params[:user][:email]
      @user.set_role("pre_registered")

      if @user.save
        RequestNotice.request_sign_up(@user.email).deliver
        flash[:success] = I18n.t('devise.registrations.pre_registration',:email => params[:user][:email])
        redirect_to :back
      else
        redirect_to :back, alert: @user.errors.full_messages.to_sentence
      end
    else
      redirect_to :back, alert: I18n.t('devise.registrations.blank_email')
    end
  end
end