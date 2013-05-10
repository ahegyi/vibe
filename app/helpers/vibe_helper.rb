require 'open-uri'
require 'uri'
require 'flickraw'

FlickRaw.api_key = ENV['FLICKR_API_KEY']
FlickRaw.shared_secret = ENV['FLICKR_SHARED_SECRET']

module VibeHelper

# lat and long arguments should be floats
  def foursquare_ll(lat, long)
    fs_interestingness = 5

    ll = [lat, long].join(",")
    client = Foursquare2::Client.new(:client_id => ENV['FOURSQUARE_CLIENT_ID'], :client_secret => ENV['FOURSQUARE_CLIENT_SECRET'], :api_version => '20130505')
    venues  = client.trending_venues(ll, {:limit => 10, :radius => 5000}).venues
    fs_entities = []
    s_latlng = [lat, long]

    venues.each do |venue|
      id = venue['id']
      photo = client.venue_photos(id, {:limit => 1})["items"][0]
      # binding.pry
      photo_size = photo['width'].to_s + "x" + photo['height'].to_s
      v_latlng = [venue['location']['lat'], venue['location']['lng']]
      entity = Entity.new
      entity.type = "image"
      entity.source = "Foursquare"
      entity.external_url = venue['canonicalUrl']
      entity.media_url = photo['prefix'] + photo_size + photo['suffix']
      entity.caption = venue['name']
      entity.interestingness = fs_interestingness
      entity.radius_distance = (Geocoder::Calculations.distance_between(s_latlng, v_latlng) * 1000)
      entity.data = [venue, photo]
      fs_entities << entity
    end

    return fs_entities
  end

  def flickr_ll(lat, long)
    fk_interestingness = 1
    meters_in_km = 1000
    fk_entities = []

    radius = "32"
    radius_units = "km"
    accuracy = 3 # Current range is 1-16 : World level is 1, Country is ~3, Region is ~6, City is ~11, Street is ~16
    days_prior = 1
    min_taken_date = Time.now.to_i - (days_prior * 8640)
    per_page = 10

    fk_photos = flickr.photos.search(:lat => lat.to_s, :lon => long.to_s, :radius => radius.to_s, :radius_units => radius_units, :accuracy => accuracy.to_s, :media => "photos", :sort => "interestingness-desc", :min_taken_date => min_taken_date.to_s, :per_page => per_page.to_s, :extras => "description, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_z")

    fk_photos.each do |photo_obj|
      entity = Entity.new
      entity.type = "image"
      entity.source = "Flickr"
      entity.external_url = 
      entity.media_url = photo_obj.
    end

    return fk_photos

  end


  # Deprecated function, do not use! TODO remove this thing
  def get_point(input)
    geocode_base_uri = "http://geocoding.cloudmade.com/" + ENV["CLOUDMADE_API_KEY"] + "/geocoding/v2/find.js"

    results = open(geocode_base_uri + "?query=" + URI.escape(input))

    centroid = []

    results_hash = JSON.load(results.read)
    if !results_hash.nil? && !results_hash.empty? && results_hash.keys.include?("found")
      centroid = results_hash["features"][0]["centroid"]["coordinates"]
    end

    return centroid
  end

end
