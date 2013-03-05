Snarpur::Application.routes.draw do

  devise_for :users
  devise_scope :user do
    get "/login" => "devise/sessions#new"
    # get "invitation/new/:role_ids(/step/:step_no(/:responder_item_id))" => 'devise/invitations#new',:defaults => {:step_no => 1}, :as => :new_user_invitation
    # post "invitation/new/:role_ids(/step/:step_no(/:responder_item_id))" => 'devise/invitations#create',:defaults => {:step_no => 1}
    # post "invitation/new" => 'devise/invitations#create', :as => :user_invitation
    get "invitation/edit" => 'devise/invitations#edit', :as => :accept_user_invitation
    put "invitation/update" => 'devise/invitations#update', :as => :user_confirmation
    get 'users', :to => 'users#show', :as => :user_root # Rails 3
  end

  namespace :admin do
    resources :users
  end
  

  resources :users
  resources :people do
    resources :address, :only => [:index]
  end
  resources :people, :path => 'caretaker', :as => :caretaker do
    resources :people,:controller => "people/caretaker", :path => "subjects", :as => :subjects
  end
  
  resources :relationships

  resources :responder_items do
      resources :people
  end


  resources :people, :as => 'subject' do
    resources :responder_items
  end
  


  resources :pre_registrations
  match "pre_registrations/:id(/step/:step_no)" => 'pre_registrations#show',:defaults => {:step_no => 1}, :via => :get
  match "pre_registrations/:id(/step/:step_no)" => 'pre_registrations#update',:defaults => {:step_no => 1}, :via => :put

  resources :responder_items, :path => 'invitation_items', :as => :invitation_items , :controller => "invitation_items" 
  match "invitation_items/:id(/step/:step_no)" => 'invitation_items#show',:defaults => {:step_no => 1}, :via => :get
  match "invitation_items(/step/:step_no)" => 'invitation_items#create',:defaults => {:step_no => 1}, :via => :post
  match "invitation_items/:id(/step/:step_no)" => 'invitation_items#update',:defaults => {:step_no => 1}, :via => :put



  match 'all_surveys' => 'surveyor#index', :via => :get
  match 'people/:subject_id/responder_items/responses/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/responses/:respondent_id/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/survey/:survey_id' => 'responder_items#survey', :via => :get
  match 'responder_items/:id/responses/question_group/:question_group_name' => 'responder_items/survey_responses#question_group', :via => :get

  match 'people/:subject_id/history' => 'people#history'
  match 'people/:subject_id/information' => 'people#information'
  match 'people/:subject_id/upload' => 'people#upload'

  
  # match 'pre_registrations/edit/step/:step_no/:id' => 'pre_registrations#edit',:defaults => { :step_no => 1}, :via => [:get], :as => :pre_registration_step
  # match 'pre_registrations/edit/step/:step_no/:id' => 'pre_registrations#update',:defaults => { :step_no => 1}, :via => [:post]


  get "pages/error_401"
  get "pages/help"
  get "pages/browser_update"

  root :to => 'users#show'




end
