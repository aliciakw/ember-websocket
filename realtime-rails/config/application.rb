require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(*Rails.groups)

module RealtimeRails
  class Application < Rails::Application
    config.middleware.use Rack::Cors do
      allow do
        origins '*'

        resource '/cors',
                 :headers => :any,
                 :methods => [:post],
                 :credentials => true,
                 :max_age => 0

        resource '*',
                 :headers => :any,
                 :methods => [:get, :post, :delete, :put, :options, :head],
                 :max_age => 0
      end
    end
  end
end
