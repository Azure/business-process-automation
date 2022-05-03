import azure.functions as func
from Preprocess import Preprocess


def main(req: func.HttpRequest) -> func.HttpResponse:
    print('Python HTTP trigger function processed a request.')
    out = {}
    try:
        req_body = req.get_json()
        text = req_body.get('text')
        preprocess = Preprocess()
        words, filtered_words, stemmed, pos = preprocess.preprocess(text)
        out = {
            "words" : words,
            "filtered_words" : filtered_words,
            "stemmed" : stemmed,
            "pos" : pos
        }
        #return('hello')
   
    except ValueError:
        print(ValueError)

    return f'{out}'
    

    
        

