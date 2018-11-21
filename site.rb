require 'sinatra/base'

class Site < Sinatra::Base
  get "/" do
    erb :index
  end

  get "/collection/" do
    erb :collection
  end
end