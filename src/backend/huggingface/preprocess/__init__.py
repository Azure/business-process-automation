import logging
import azure.functions as func
from Preprocess import Pr
from huggingface.Preprocess import Preprocess




def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    out = {}
    try:
        req_body = req.get_json()
        text = req_body.get('text')
        preprocess = Preprocess()
        words, filtered_words, stemmed, pos = preprocess.preprocess(text)
        out = {
            words : words,
            filtered_words : filtered_words,
            stemmed : stemmed,
            pos : pos
        }
   
    except ValueError:
        logging.info(ValueError)

    return f'{out}'
    

    
        

