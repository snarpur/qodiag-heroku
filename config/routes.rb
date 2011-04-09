Snarpur::Application.routes.draw do


  devise_for :users do
    get "/login" => "devise/sessions#new"
    get "invitation/new/:role_ids" => 'devise/invitations#new', :as => :new_user_invitation
    post "invitation/new" => 'devise/invitations#create', :as => :user_invitation
    put "invitation/update" => 'devise/invitations#update', :as => :user_confirmation
  end

  resources :users
  resources :people
  resources :relationships
  resources :roles

  get "pages/error_401"


  root :to => "application#index"




end
