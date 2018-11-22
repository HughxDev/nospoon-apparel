require 'sinatra/base'
require 'yaml'
require 'hash_dot'
require 'money'

Hash.use_dot_syntax = true
Money.locale_backend = :i18n
I18n.config.available_locales = :en
I18n.locale = :en

class NoSpoonApparel < Sinatra::Base
  # https://stackoverflow.com/a/37891309/214325
  def strip_trailing_zero(n)
    n.to_s.sub(/\.?0+$/, '')
  end

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
    @default_colorways = @data['variants'][0]['colorways']
    @default_colorway = @data['variants'][0]['colorways'][0]['id']
    @default_colorway_src = "/collection/#{@product}/product--#{@default_colorway}@2x.png"
    # @default_colorway_srcset = "#{@default_colorway_src} 1x, #{@default_colorway_src.sub '.png', '@2x.png'} 2x, #{@default_colorway_src.sub '.png', '@3x.png'} 3x"
    @default_price = @data.variants[0].price.USD.amount
    @default_price_formatted = Money.from_amount(@default_price, "USD")
    @default_price_clean = strip_trailing_zero(@default_price)
    erb :product
  end
end