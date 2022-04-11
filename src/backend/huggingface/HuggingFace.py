from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline

class HuggingFace:

    def __init__(self, modelName) -> None:
        self.modelName = modelName
        self.tokenizer = AutoTokenizer.from_pretrained(modelName)
        self.model = AutoModelForTokenClassification.from_pretrained(modelName)

    def analyze(self, text):
        nlp = pipeline("ner", model=self.model, tokenizer=self.tokenizer)
        out = nlp(text)
        return out, self.modelName
        