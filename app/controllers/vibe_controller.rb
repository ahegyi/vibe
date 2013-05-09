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

end
