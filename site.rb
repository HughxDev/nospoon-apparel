require 'sinatra/base'
require 'sinatra/subdomain'
require 'yaml'
require 'hash_dot'
require 'money'
require 'stripe'
require 'dotenv/load'
require 'yaml/store'

# set :tld_size, 2
Hash.use_dot_syntax = true
Money.locale_backend = :i18n
I18n.config.available_locales = :en
I18n.locale = :en
Stripe.api_key = ENV['STRIPE_TEST_SK']

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

  post "/echo/" do
    request.body.rewind
    request.body.read
  end

  post "/purchase/" do
    request.body.rewind  # in case someone already read it
    data = JSON.parse request.body.read

    # Sample data
    # {
    #   "amount":2000,
    #   "currency":"usd",
    #   "description":"2 widgets",
    #   "stripeSource":{
    #     "id":"src_1DbbqIHLfc0mJZQd9YMgmwTN",
    #     "object":"source",
    #     "amount":null,
    #     "card":{
    #       "exp_month":11,
    #       "exp_year":2018,
    #       "address_line1_check":"pass",
    #       "address_zip_check":"pass",
    #       "brand":"Visa",
    #       "country":"CA",
    #       "cvc_check":"pass",
    #       "funding":"credit",
    #       "last4":"1881",
    #       "three_d_secure":"optional",
    #       "name":null,
    #       "tokenization_method":null,
    #       "dynamic_last4":null
    #     },
    #     "client_secret":"src_client_secret_E3jIOyT1O2u1NC7CAFR3gKVe",
    #     "created":1543445354,
    #     "currency":null,
    #     "flow":"none",
    #     "livemode":false,
    #     "metadata":{
    #
    #     },
    #     "owner":{
    #       "address":{
    #         "city":"Dorchester Center",
    #         "country":"United States",
    #         "line1":"1 Larchmont Street",
    #         "line2":null,
    #         "postal_code":"02124",
    #         "state":"MA"
    #       },
    #       "email":"hugh@hughguiney.com",
    #       "name":"Hugh Guiney",
    #       "phone":null,
    #       "verified_address":{
    #         "city":null,
    #         "country":null,
    #         "line1":"1 Larchmont Street",
    #         "line2":null,
    #         "postal_code":"02124",
    #         "state":null
    #       },
    #       "verified_email":null,
    #       "verified_name":null,
    #       "verified_phone":null
    #     },
    #     "statement_descriptor":null,
    #     "status":"chargeable",
    #     "type":"card",
    #     "usage":"reusable"
    #   },
    #   "billing_name":"Hugh Guiney",
    #   "billing_address_country":"United States",
    #   "billing_address_country_code":"US",
    #   "billing_address_zip":"02124",
    #   "billing_address_line1":"1 Larchmont Street",
    #   "billing_address_city":"Dorchester Center",
    #   "billing_address_state":"MA",
    #   "shipping_name":"Hugh Guiney",
    #   "shipping_address_country":"United States",
    #   "shipping_address_country_code":"US",
    #   "shipping_address_zip":"02124",
    #   "shipping_address_line1":"1 Larchmont Street",
    #   "shipping_address_city":"Dorchester Center",
    #   "shipping_address_state":"MA"
    # }

    store = YAML::Store.new( 'customers.yaml' )
    store.transaction do
      existing_customer = store[data.stripeSource.owner.email]

      if existing_customer.nil?
        @customer = Stripe::Customer.create(
          :email => data.stripeSource.owner.email,
          :source => data.stripeSource.id
        )
        store[@customer.email] = @customer.id
        store.commit
      else
        @customer = {
          :email => data.stripeSource.owner.email,
          :id => existing_customer
        }
      end
    end

    # token = params[:stripeSource]

    Stripe::Charge.create(
      # A positive integer representing how much to charge,
      # in the smallest currency unit (e.g., 100 cents to charge $1.00,
      # or 100 to charge ¥100, a zero-decimal currency).
      # The minimum amount is $0.50 USD or equivalent in charge currency.
      :amount => data.amount, # required

      # Three-letter ISO currency code, in lowercase.
      # Must be a supported currency.
      :currency => data.currency, # required

      # A fee in cents that will be applied to the charge and
      # transferred to the application owner’s Stripe account.
      # The request must be made with an OAuth key
      # or the Stripe-Account header in order to take an application fee.
      # For more information, see the application fees documentation.
      # :application_fee => 0,

      # Whether to immediately capture the charge.
      # When false, the charge issues an authorization (or pre-authorization),
      # and will need to be captured later.
      # Uncaptured charges expire in seven days.
      # For more information, see the authorizing charges
      # and settling later documentation.
      :capture => true,

      # The ID of an existing customer that will be charged in this request.
      :customer => @customer.id,

      # An arbitrary string which you can attach to a Charge object.
      # It is displayed when in the web interface alongside the charge.
      # Note that if you use Stripe to send automatic email receipts
      # to your customers, your receipt emails will include
      # the description of the charge(s) that they are describing.
      # This can be unset by updating the value to nil and then saving.
      :description => data.description,

      # If specified, the charge will be attributed
      # to the destination account for tax reporting,
      # and the funds from the charge will be transferred
      # to the destination account.
      # The ID of the resulting transfer will be returned
      # in the response’s transfer field.
      # For details, see Creating Destination Charges on Your Platform.
      # :destination => {}

      # Set of key-value pairs that you can attach to an object.
      # This can be useful for storing additional information
      # about the object in a structured format.
      # :metadata => {}

      # The Stripe account ID for which these funds are intended.
      # Automatically set if you use the destination parameter.
      # For details, see Creating Separate Charges and Transfers.
      # :on_behalf_of => "",

      # The email address to which this charge’s receipt will be sent.
      # The receipt will not be sent until the charge is paid,
      # and no receipts will be sent for test mode charges.
      # If this charge is for a customer, the email address specified here
      # will override the customer’s email address.
      # If receipt_email is specified for a charge in live mode,
      # a receipt will be sent regardless of your email settings.
      # :receipt_email => "",

      # Shipping information for the charge.
      # Helps prevent fraud on charges for physical goods.
      #   "shipping_name":"Hugh Guiney",
      #   "shipping_address_country":"United States",
      #   "shipping_address_country_code":"US",
      #   "shipping_address_zip":"02124",
      #   "shipping_address_line1":"1 Larchmont Street",
      #   "shipping_address_city":"Dorchester Center",
      #   "shipping_address_state":"MA"
      :shipping => { #optional
        :name => data.shipping_name,
        :address => {
          :line1 => data.shipping_address_line1, # required
          :line2 => defined?(data.shipping_address_line2) ? data.shipping_address_line2 : nil,
          :city => data.shipping_address_city,
          :country => data.shipping_address_country,
          :postal_code => data.shipping_address_zip,
          :state => data.shipping_address_state
        }
      },

      # Recipient name.
      # This can be unset by updating the value to nil and then saving.
      # :name => data.shipping_name, #required

      # The delivery service that shipped a physical product,
      # such as Fedex, UPS, USPS, etc.
      # This can be unset by updating the value to nil and then saving.
      # :carrier => "",

      # Recipient phone (including extension).
      # This can be unset by updating the value to nil and then saving.
      # :phone => "",

      # The tracking number for a physical product,
      # obtained from the delivery service.
      # If multiple tracking numbers were generated for this purchase,
      # please separate them with commas.
      # This can be unset by updating the value to nil and then saving.
      # :tracking_number => "",

      # A payment source to be charged.
      # This can be the ID of a card (i.e., credit or debit card),
      # a bank account, a source, a token, or a connected account.
      # For certain sources—namely, cards, bank accounts, and attached sources
      # —you must also pass the ID of the associated customer.
      :source => data.stripeSource.id, # obtained with Stripe.js

      # An arbitrary string to be displayed
      # on your customer’s credit card statement.
      # This can be up to 22 characters.
      # As an example, if your website is RunClub
      # and the item you’re charging for is a race ticket,
      # you might want to specify a statement_descriptor of
      # RunClub 5K race ticket.
      # The statement description must contain at least one letter,
      # must not contain <>"' characters,
      # and will appear on your customer’s statement in capital letters.
      # Non-ASCII characters are automatically stripped.
      # While most banks and card issuers display this information consistently,
      # some might display it incorrectly or not at all.
      :statement_descriptor => "No Spoon Apparel",

      # A string that identifies this transaction as part of a group.
      # For details, see Grouping transactions.
      # :transfer_group => ""
    ) # Stripe::Charge.create
  end

  get "/collection/" do
    @products = []
    @jsonData = '[';

    product_files = Dir["data/products/*.json"]
    product_count = product_files.count

    Dir["data/products/*.yaml"].each do |product|
      @products.push( YAML.load_file(product) )
    end

    product_files.each_with_index do |product, index|
      @jsonData += File.read(product, :encoding => 'utf-8')
      if index < ( product_files.count - 1 )
        @jsonData += ','
      end
    end
    @jsonData += ']'

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

  get "/:view/" do
    erb :"#{params['view']}"
  end

  get "/" do
    erb :index, :locals => {
      :language => @language,
      :locale => @locale,
      :lang => @lang
    }
  end
end