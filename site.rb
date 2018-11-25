require 'sinatra/base'
require 'sinatra/subdomain'
require 'yaml'
require 'hash_dot'
require 'money'

# set :tld_size, 2
Hash.use_dot_syntax = true
Money.locale_backend = :i18n
I18n.config.available_locales = :en
I18n.locale = :en

class NoSpoonApparel < Sinatra::Base
  register Sinatra::Subdomain

  before do
    @copy = YAML.load_file('data/language.yaml')
    @lang = File.read('data/language.json', :encoding => 'utf-8')
    @language = get_language(subdomain)
    @locale = get_locale(@language)
    @supported_languages = [ :en, :ja ]
  end

  # https://stackoverflow.com/a/37891309/214325
  def strip_trailing_zero(n)
    n.to_s.sub(/\.?0+$/, '')
  end

  def get_locale(language)
    case language
    when 'en'
      'en-US'
    when 'ja'
      'ja-JP'
    else
      language
    end
  end

  def get_language(subdomain)
    language = subdomain.to_s.sub( 'local.', '' ).sub( '.apparel', '' )

    if language == 'apparel'
      'en'
    else
      language
    end
  end

  # subdomain [ /(local\.)?ja/ ] do
  #   get "/" do
  #     erb :index
  #   end
  # end

  # get "/collection" do
  #   redirect "/collection/", 302
  # end

  # get "/collection/:product/" do
  #   redirect "/collection/#{params['product']}", 302
  # end

  get "/collection/" do
    # Dir["data/products/*.yaml"].each do |product|
    #
    # end

    erb :collection, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end

  get "/collection/:product/" do
    language = get_language(subdomain)
    locale = get_locale(language)

    @data = YAML.load_file("data/products/#{params['product']}.yaml")
    @jsonData = File.read("data/products/#{params['product']}.json", :encoding => 'utf-8')
    @product = params['product']
    @default_colorways = @data['variants'][0]['colorways']
    @default_colorway = @data['variants'][0]['colorways'][0]['id']
    @default_colorway_src = "/collection/#{@product}/product--#{@default_colorway}@2x.png"
    # @default_colorway_srcset = "#{@default_colorway_src} 1x, #{@default_colorway_src.sub '.png', '@2x.png'} 2x, #{@default_colorway_src.sub '.png', '@3x.png'} 3x"
    @default_price = @data.variants[0].price.USD.amount
    @default_price_formatted = Money.from_amount(@default_price, "USD")
    @default_price_clean = strip_trailing_zero(@default_price)
    @default_currency_text = @copy._PRICE_USD_[@language].sub( 'X', @default_price_formatted.to_s )

    @missing_description_languages = []

    @supported_languages.each do |supported_language|
      supported_language = supported_language.to_s
      if !@data.description_languages.include?(supported_language)
        @missing_description_languages.push(supported_language)
      end
    end

    erb :product, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end

  get "/" do
    erb :index, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end
end