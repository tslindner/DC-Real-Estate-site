import json
import requests

from config import api_key

def nearest_establishments(listing):
    nearest_data = dict()
    busi_types = ['restaurant', 'groceries', 'coffee', 'entertainment', 'bar']

    listing = listing[0]

    for i in busi_types:
        lat, lng = listing['lat'], listing['lng']

        base_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
        url = '{}location={},{}&keyword={}&rankby=distance&key={}'.format(base_url, lat, lng, i, api_key)

        response = requests.get(url)
        data = response.json()
        
        nearest_data[i] = data
    
    return nearest_data