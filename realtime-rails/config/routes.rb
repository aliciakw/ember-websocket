Rails.application.routes.draw do
  get '/', to: 'books#index'
  resources :books
  #root 'pages#index'
  # mount API::Base => '/api'
  #mount GrapeSwaggerRails::Engine => '/documentation'

  mount API::Base => '/api'
end
