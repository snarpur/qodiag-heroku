Snarpur::Application.routes.draw do
  require "#{ RAILS_ROOT }/lib/util/route_util.rb"


  resources :entry_set_responses 
  get "person/:person_id/entry_set_responder_items(/:id)" => "people/entry_set_responder_items#index", :as => :person_entry_set_items

  resources :entry_values
  get 'entry_set_responses/:entry_set_response_id/section/:section_id' => 'entry_set_responses/sections#index', :as => :entry_set_response_section

  # Entry Field options
  match 'entry_fields/:id/entry_field_options' => 'entry_field_options#index', :via => :get 
  resources :entry_field_options, :only => [:destroy]

  resources :entry_sets do
    resources :sections  
  end

  resources :sections do  
    resources :entry_fields, :controller => 'sections/entry_fields'  
    resources :sections_entry_fields, :controller => 'sections/sections_entry_fields' 
  end
  match 'sections/:section_id/sections_entry_fields' => 'sections/sections_entry_fields#update', :via => :put
  resources :entry_fields
  resources :section_entry_fields, :only => [:destroy]
  


  mount Surveyor::Engine => "/surveys", :as => "surveyor"

  devise_for :users
  devise_scope :user do
    get "/login" => "devise/sessions#new"
    get "invitation/edit" => 'devise/invitations#edit', :as => :accept_user_invitation
    put "invitation/update" => 'devise/invitations#update', :as => :user_confirmation
    get 'users', :to => 'users#show', :as => :user_root # Rails 3

  end

  match 'user/login_as/:id' => 'devise/switch_users#login_as', :as => :login_as, :via => :get
  match 'user/logout_as/:id' => 'devise/switch_users#logout_as', :as => :logout_as, :via => :get

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
  
  resources :inverse_relations

  resources :relationships

  resources :responder_items do
    resources :people  
  end

  resources :people do
    resources :responder_items, :controller => 'people/responder_items'
  end


  resources :survey_responses, :path => 'responder_items/responses', :module => "responder_items", :only => [:index] do
    member do 
      get "column(/norm_reference/:norm_reference_id)" => "survey_responses#column"
      get "column(/norm_reference/:norm_reference_id/:column_metrics)" => "survey_responses#column"
      get "column(/:column_metrics)" => "survey_responses#column"
      get "question_group/:question_group_name" => 'survey_responses#question_group'
    end
  end




  resources :people, :as => 'subject' do
    resources :responder_items
  end
  

  #REFACTOR: change match to memeber
  resources :pre_registrations
  match "pre_registrations/:id(/step/:step_no)" => 'pre_registrations#show',:defaults => {:step_no => 1}, :via => :get, :as => :pre_registration_step
  match "pre_registrations/:id(/step/:step_no)" => 'pre_registrations#update',:defaults => {:step_no => 1}, :via => :put
  #REFACTOR: change match to memeber
  resources :responder_items, :path => 'invitation_items', :as => :invitation_items , :controller => "invitation_items" 
  

  match "invitation_items/:id/invite/:type/step/:step_no" => 'invitation_items#show',:defaults => {:step_no => 1,:type => "guardian"}, :via => :get, :as => :invitation_item_step
  match "invitation_items/invite/:type/step/:step_no" => 'invitation_items#create',:defaults => {:step_no => 1, :type => "guardian"}, :via => :post
  match "invitation_items/:id/invite/:type/step/:step_no" => 'invitation_items#update',:defaults => {:step_no => 1,:type => "guardian"}, :via => :put


  match 'all_surveys' => 'surveyor#index', :via => :get
  match 'people/:subject_id/responder_items/responses/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/responses/:respondent_id/:survey_id' => 'responder_items#responses', :via => :get
  match 'people/:subject_id/responder_items/survey/:survey_id' => 'responder_items#survey', :via => :get, :as => :survey
  # match 'responder_items/:id/responses/question_group/:question_group_name' => 'responder_items/survey_responses#question_group', :via => :get

  match 'people/:subject_id/history' => 'people#history'
  match 'people/:subject_id/information' => 'people#information'
  match 'people/:id/image_upload' => 'people#image_upload', :via => :put , :as => :image_upload
  
  
  post "sign_up/user", :to => 'sign_up#create'

  get "pages/error_401"
  get "pages/help"
  get "pages/landing"
  get "pages/browser_update"

  get "national_registers/:kennitala" => 'national_registers#lookup', :as => :lookup
  get "national_registers/family/:kennitala" => 'national_registers#family', :as => :family

  #REFACTOR: Try to pass this logic to Devise GEM
  root :to => 'application#index', constraints: lambda { |r| r.env["warden"].authenticate? }
  root :to => 'pages#landing'

end
