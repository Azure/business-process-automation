# import logging

# import azure.functions as func


# def main(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info('Python HTTP trigger function processed a request.')

#     name = req.params.get('name')
#     if not name:
#         try:
#             req_body = req.get_json()
#         except ValueError:
#             pass
#         else:
#             name = req_body.get('name')

#     if name:
#         return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
#     else:
#         return func.HttpResponse(
#              "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
#              status_code=200
#         )
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
    

    
        

