import nltk
import string
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk import pos_tag

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

class Preprocess:

    def __init__(self) -> None:
        print('Preprocess init')


    def preprocess(self, text):
        text = text.lower()
    
        text_p = "".join([char for char in text if char not in string.punctuation])
        
        words = word_tokenize(text_p)
        
        stop_words = stopwords.words('english')
        filtered_words = [word for word in words if word not in stop_words]
        
        porter = PorterStemmer()
        stemmed = [porter.stem(word) for word in filtered_words]
        
        #pos = pos_tag(filtered_words)

        return words, filtered_words, stemmed#, pos

        