require 'open-uri'
require 'uri'
require 'flickraw'

FlickRaw.api_key = ENV['FLICKR_API_KEY']
FlickRaw.shared_secret = ENV['FLICKR_SHARED_SECRET']

module VibeHelper

  def foursquare_ll(ll)
    fs_interestingness = 5
    meters_in_km = 1000

    client = Foursquare2::Client.new(:client_id => ENV['FOURSQUARE_CLIENT_ID'], :client_secret => ENV['FOURSQUARE_CLIENT_SECRET'], :api_version => '20130505')
    venues  = client.trending_venues(ll, {:limit => 10, :radius => 5000}).venues
    fs_entities = []
    s_latlng = ll.split(',').map{|i| i.to_f}

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
      entity.radius_distance = (Geocoder::Calculations.distance_between(s_latlng, v_latlng) * meters_in_km)
      entity.data = [venue, photo]
      fs_entities << entity
    end

    return fs_entities
  end

  def flickr_ll(lat, long)
    fk_interestingness = 1
    meters_in_km = 1000

    radius = "32"
    radius_units = "km"
    days

    fk_photos = 



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
