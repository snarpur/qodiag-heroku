class Devise::InvitationsController < ApplicationController

  before_filter :get_user, :only => [:index,:new]
  before_filter :accessible_roles, :only => [:new, :show, :update, :create]
  before_filter :build_user, :only => [:new], :if => :logged_in?
  load_resource :user, :parent => false
  authorize_resource :user, :parent => false, :except => [:edit, :update]


  def new
    @parent = @user.build_person
    @child =  Person.new(:factory => {:name => :child, :relation =>  @parent})
    @patient_relationship = @child.inverse_relationships.build(:name=> "patient", :person_id => @current_user.person.id)
    @responder_item = @parent.client_responder_items.build(:registration_identifier => "client_registration",
                                                           :caretaker_id => @current_user.person.id,
                                                           :deadline => Time.zone.now
                                                           )
    respond_to do |format|
      format.html
    end
  end

  def create
    @user = User.new(params[:user].merge!({:invitation => true}))
    @user.valid?
    if @user.errors.empty?
      #@user = User.invite!(params[:user])
      KK.see "WARNING :::: COMMENT"
      @user = User.create(params[:user])
      @user.update_attributes(params[:user][:person])
      set_responder_item
      flash[:notice] = I18n.t('devise.invitations.send_instructions',:email => @user.email)
      redirect_to after_sign_in_path_for(User)
    else
      render :action => :new
    end
  end

  def edit
    if params[:invitation_token] && @user = User.first(:conditions => { :invitation_token => params[:invitation_token] })
      render :edit
    else
      flash[:alert] = I18n.t('devise.invitations.invitation_token_invalid')
      redirect_to after_sign_out_path_for(User)
    end
  end

  def update
    @user = User.accept_invitation!(params[:user])
    if @user.errors.empty?
      flash[:notice] = I18n.t('devise.invitations.updated')
      sign_in_and_redirect(User, @user)
    else
      render :edit
    end
  end

  private
  def accessible_roles
    @accessible_roles = Role.accessible_by(current_ability,:read)
  end

  def get_user
    @current_user = current_user
  end

  def logged_in?
   !current_user.nil?
  end

  def build_user
    @user = User.new(:role_ids => params[:role_ids], :invited_by_id => @current_user.id)
  end

  def set_responder_item
    guardian = @user.person
    child = guardian.relations.guardian_of.last
    #child.inverse_relationships.create(:name => "patient", :person_id =>  @current_user.person.id)
    #ResponderItem.create( :client_id => guardian.id,
                          # :subject_id => child.id,
                          # :caretaker_id => @current_user.person.id,
                          # :deadline => Time.now.advance(:weeks => 2),
                          # :registration_identifier => 'client_registration'
                          # )
  end

end
