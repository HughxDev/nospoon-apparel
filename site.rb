require 'sinatra/base'
require 'yaml'
require 'hash_dot'

Hash.use_dot_syntax = true

class NoSpoonApparel < Sinatra::Base
  get "/" do
    erb :index
  end

  get "/collection" do
    redirect "/collection/", 302
  end

  get "/collection/:product/" do
    redirect "/collection/#{params['product']}", 302
  end

  get "/collection/" do
    erb :collection
  end

  get "/collection/:product" do
    @data = YAML.load_file('data/products.yaml')[params['product']]
    @product = params['product']
    @default_colorway = @data['variants'][0]['colorways'][0]['id']
    @default_colorway_src = "/collection/#{@product}/product--#{@default_colorway}.png"
    @default_colorway_srcset = "#{@default_colorway_src} 1x, #{@default_colorway_src.sub '.png', '@2x.png'} 2x, #{@default_colorway_src.sub '.png', '@3x.png'} 3x"
    erb :product
  end
end