class Query < ActiveRecord::Base
  attr_accessible :id, :created_at, :updated_at, :input, :named_place, :radius, :lat, :lng

  validates :input, :presence => true

  geocoded_by :input, :latitude  => :lat, :longitude => :lng do |query, results|
    if geo = results.first
      # only tested with ESRI as geocoding service
      query.named_place = geo.data["locations"].first["name"]
      # have to do this manually, I guess
      query.lat = geo.latitude
      query.lng = geo.longitude
    end
  end

  after_validation :geocode # auto-fetch coordinates

  has_many :entities

end
