Snarpur::Application.routes.draw do


  devise_for :users
  resources :users
  resources :people
  resources :relationships

  devise_scope :user do
    get "/login" => "devise/sessions#new"
  end

  root :to => "application#index"

  match 'users/new/role/:role_id' => 'users#new'


end
