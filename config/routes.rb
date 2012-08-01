Snarpur::Application.routes.draw do

  devise_for :users do
    get "/login" => "devise/sessions#new"
    get "invitation/new/:role_ids" => 'devise/invitations#new', :as => :new_user_invitation
    post "invitation/new" => 'devise/invitations#create', :as => :user_invitation
    get "invitation/edit" => 'devise/invitations#edit', :as => :accept_user_invitation
    put "invitation/update" => 'devise/invitations#update', :as => :user_confirmation
  end

  devise_for :users do
    get 'users', :to => 'users#show', :as => :user_root # Rails 3
  end
  

  resources :users
  resources :people
  resources :relationships

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
 
  
  get "pages/error_401"
  get "pages/help"
  get "pages/browser_update"

  root :to => 'users#show'
  #How to define nested contoller as root
  #root :to => Devise::SessionsController.action(:new)



end
