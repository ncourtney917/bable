import logging
import azure.functions as func
import json
import requests
from flask import Flask, request, jsonify
import pymongo

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Triggering MongoLookup.')
    print("Triggering MongoLookup...")

    gameId = req.params.get('gameId')
    if not gameId:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
    else:
        gameId = req_body.get('gameId')

    client = pymongo.MongoClient("mongodb+srv://babbleadmin:aBwJTJXWWncF1Kx5@gamelog.qaezs.mongodb.net/?retryWrites=true&w=majority")
    db = client.babblegames
    collection = db.gameentries
    record = collection.find_one({"gameId":gameId})
    name = record["name"]
    response = jsonify({"name":name})
    response.headers.add('Access-Control-Allow-Origin', '*')

    if name:
        return func.HttpResponse(response)
    else:
        return func.HttpResponse(
             response,
             status_code=200
        )
