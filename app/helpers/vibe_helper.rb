module VibeHelper

  fs_interestingness = 5
  meters_in_km = 1000

  def foursquare_ll(ll)
    client = Foursquare2::Client.new(:client_id => ENV['FOURSQUARE_CLIENT_ID'], :client_secret => ENV['FOURSQUARE_CLIENT_SECRET'], :api_version => '20130505')
    venues  = client.trending_venues(ll, {:limit => 10, :radius => 5000}).venues
    fs_entities = []
    s_latlng = ll.split(',').map{|i| i.to_f}

    venues.each do |venue|
      id = venue['id']
      photo = client.venue_photos(id, {:limit => 1})["items"][0]
      photo_size = photo['width'].to_s + "x" + photo['height'].to_s
      v_ltlng = [venue['location']['lat'], venue['location']['lng']]
      entity = Entity.New
      entity.type = "image"
      entity.source = "Foursquare"
      entity.external_url = venue['canonicalUrl']
      entity.media_url = photo['prefix'] + photo_size + photo['suffix']
      entity.caption = venue['name']
      entity.interestingness = fs_interestingness
      entity.radius_distance = Geocoder::Calculations.distance_between(s_latlng, v_latlng) * meters_in_km
      entity.data = [venue, photo]
      fs_entities << entity
    end

    return fs_entities
  end


end
