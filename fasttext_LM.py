import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class Fasttext_LM(object):
    def __init__(self):
        super(Fasttext_LM, self).__init__()
        with open("res/fasttext_LM_params.pkl","rb") as f:
            X, good_threadIds = pickle.load(f)
        self.X = X
        self.good_threadIds = good_threadIds

    def get_feature_vec(self, text):
        feature_vec = np.zeros(1000)
............................................
............................................
............................................
............................................
............................................
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