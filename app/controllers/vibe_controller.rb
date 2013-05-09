class VibeController < ApplicationController

  include VibeHelper

  def index
    @images = {}


    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @images }
    end
  end

  def foursquare

    @place = "Austin, Tx"

    ll = Geocoder.coordinates(@place).join(',')

    @foursquare_arr = foursquare_ll(ll)

    respond_to do |format|
      format.html # matt.html.erb
      format.json { render json: @foursquare_arr }
    end

  end

  def instagram_test
    @place = "san francisco, ca"

    ll = Geocoder.coordinates(@place)
    @instagram_entities = instagram_ll(ll[0], ll[1])

    @instagram_entities.sort!{|e| e.interestingness}

    respond_to do |format|
      format.html # instagram_test.html.erb
      format.json { render json: @instagram_entities }
    end
  end

end
