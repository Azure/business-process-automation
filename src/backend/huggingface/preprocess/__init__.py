import azure.functions as func
from Preprocess import Preprocess
import json


def main(req: func.HttpRequest) -> func.HttpResponse:
    print('Python HTTP trigger function processed a request.')
    out = {}
    try:
        req_body = req.get_json()
        text = req_body.get('text')
        preprocess = Preprocess()
        words, filtered_words, stemmed = preprocess.preprocess(text)
        out = {
            "words" : words,
            "filteredWords" : filtered_words,
            "stemmed" : stemmed
            #"pos" : pos
        }

        return json.dumps(out)

    except ValueError:
        print(ValueError)

    return json.dumps(out)





