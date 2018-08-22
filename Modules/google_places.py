import json
import requests

from config import api_key

def nearest_establishments(listing):
    nearest_data = dict()
    busi_types = ['restaurant', 'groceries', 'coffee', 'entertainment', 'bar']

    for i in busi_types:
        # listing = listing[0]
        lat, lng = listing['lat'], listing['lng']

        base_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
        url = '{}location={},{}&keyword={}&rankby=distance&key={}'.format(base_url, lat, lng, i, api_key)

        response = requests.get(url)
        data = response.json()
        
        nearest_data[i] = data
        
    nearest_restaurant = nearest_data['restaurant']['results']
    nearest_groceries = nearest_data['groceries']['results']
    nearest_coffee = nearest_data['coffee']['results']
    nearest_entertainment = nearest_data['entertainment']['results']
    nearest_bar = nearest_data['bar']['results']

    
    return nearest_restaurant, nearest_groceries, nearest_coffee, nearest_entertainment, nearest_bar