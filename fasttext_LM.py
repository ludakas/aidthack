import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import re
import subprocess

class Fasttext_LM(object):
    def __init__(self):
        super(Fasttext_LM, self).__init__()
        with open("res/fast_LM_params.pkl","rb") as f:
            X, good_threadIds, q_a = pickle.load(f)
        self.X = X
        self.good_threadIds = good_threadIds
        self.q_a = q_a

    def cleaned_text(self, text):
        text = text.lower()
        text = re.sub('[^a-zäöüß]+', ' ', text)

        text = re.sub('ä', 'a', text)
        text = re.sub('ö', 'o', text)
        text = re.sub('ü', 'u', text)
        text = re.sub('ß', 'ss', text)

        # Maximum of 100 words per sentence
        words = text.split()
        text = ' '.join(words[:100])
        return text

    def starspace(self, text):

        with open('testtext.txt', 'w') as f:
            f.write(text)

        bashCommand = '~/Starspace/embed_doc questions_1000_embeddings testtext.txt'
        output = subprocess.check_output(['bash','-c', bashCommand]).decode()

        vec_str = output.split('\n')[-2]
        vec = np.fromstring(vec_str, dtype=float, sep=' ')
        # print(vec)
        return vec

    def get_feature_vec(self, text):
        text = self.cleaned_text(text)
        feature_vec = self.starspace(text)
        # with open("res/intext.txt","rb") as f:
        #     f.
        # bashCommand = '~/fastText/fasttext predict-prob model_sup_tr.bin res/intext.txt 1'
        # output = subprocess.check_output(['bash','-c', bashCommand])
# ............................................
# ............................................
# ............................................
# ............................................
# ............................................
        return feature_vec

    def get_closest_answers(self, new_question_text):
        feature_vec = self.get_feature_vec(new_question_text).reshape(1,1000)
        similarities = cosine_similarity(self.X, feature_vec)
        ind = np.argmax(similarities)
        threadId = self.good_threadIds[ind]
        return self.q_a[threadId]["ans"]

if __name__ == '__main__':
    fast_lm = Fasttext_LM()
    example_question = "hallo zusammen ich bin am berlegen von meinem analog anschluss auf einen ip anschluss zu wechseln gibt es bei der umstellung"
    ans = fast_lm.get_closest_answers(example_question)
    print(ans)
    print("done")