Snarpur::Application.routes.draw do

  devise_for :users
  devise_scope :user do
    get "/login" => "devise/sessions#new"
    get "invitation/new/:role_ids(/step/:step_no(/:root_object_id))" => 'devise/invitations#new',:defaults => {:step_no => 1}, :as => :new_user_invitation
    post "invitation/new/:role_ids(/step/:step_no(/:root_object_id))" => 'devise/invitations#create',:defaults => {:step_no => 1}
    # post "invitation/new" => 'devise/invitations#create', :as => :user_invitation
    get "invitation/edit" => 'devise/invitations#edit', :as => :accept_user_invitation
    put "invitation/update" => 'devise/invitations#update', :as => :user_confirmation
    get 'users', :to => 'users#show', :as => :user_root # Rails 3
  end

  

  resources :users
  resources :people
  resources :relationships
  resources :pre_registrations
  resources :responder_items do
      resources :people
  end
  resources :people, :as => 'subject' do
      resources :responder_items
  end



namespace :admin do
  resources :users
end

  match 'all_surveys' => 'surveyor#index', :via => :get
  match 'people/:subject_id/responder_items/responses/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/responses/:respondent_id/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/survey/:survey_id' => 'responder_items#survey', :via => :get
  match 'people/:subject_id/history' => 'people#history'
  match 'people/:subject_id/information' => 'people#information'

  # match 'pre_registrations/:responder_item_id/edit/step/:step_no' => 'pre_registrations#edit', :via => :get
  # match 'pre_registrations/:responder_item_id/edit' => 'pre_registrations#edit', :via => :get
  # match 'pre_registrations/:responder_item_id/edit/step/:step_no' => 'pre_registrations#update', :via => [:post]
  
  match 'pre_registrations/edit/step/:step_no/:id' => 'pre_registrations#edit',:defaults => { :step_no => 1}, :via => [:get], :as => :pre_registration_step
  match 'pre_registrations/edit/step/:step_no/:id' => 'pre_registrations#update',:defaults => { :step_no => 1}, :via => [:post]


  get "pages/error_401"
  get "pages/help"
  get "pages/browser_update"

  root :to => 'users#show'
  #How to define nested contoller as root
  #root :to => Devise::SessionsController.action(:new)



end
