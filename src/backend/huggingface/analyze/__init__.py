import logging
import azure.functions as func
from HuggingFace import HuggingFace


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    out = {}
    try:
        req_body = req.get_json()
        hf = HuggingFace(req_body.get('modelId'))

        out, modelName = hf.analyze(req_body.get('text'))
        logging.info(modelName)
   
    except ValueError:
        logging.info(ValueError)

    return f'{out}'
    

    
        

