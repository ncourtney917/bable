import logging
import azure.functions as func
import json
import requests
from flask import Flask, request, jsonify
import pymongo

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Triggering MongoPost.')
    print("Triggering MongoPost")
    name = req.params.get('name')
    gameId = req.params.get('gameId')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
    else:
        name = req_body.get('name')
        gameId = req_body.get('gameId')

    record = {"gameId": gameId, "name": name}
    client = pymongo.MongoClient("mongodb+srv://babbleadmin:aBwJTJXWWncF1Kx5@gamelog.qaezs.mongodb.net/?retryWrites=true&w=majority")
    db = client.babblegames
    collection = db.gameentries
    print(record)
    collection.insert_one(record)
    #r = requests.post(base_url, data=data, headers=headers)
    response = jsonify({"name":name})
    response.headers.add('Access-Control-Allow-Origin', '*')

    if name:
        return func.HttpResponse(response)
    else:
        return func.HttpResponse(
             response,
             status_code=200
        )
