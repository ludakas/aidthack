import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class Naive_LM(object):
    """docstring for naive_LM"""
    def __init__(self):
        super(Naive_LM, self).__init__()
        with open("res/naive_LM_params_big.pkl","rb") as f:
            vocab, X, ans = pickle.load(f)
        self.vocab = vocab
        self.X = X
        self.ans = ans

    def get_feature_vec(self, text):
        feature_vec = np.zeros(5000)
        for word in text:
            if word in self.vocab:
                feature_vec[ self.vocab.index(word) ] += 1
        return feature_vec

    def get_closest_answers(self, new_question_text):
        feature_vec = self.get_feature_vec(new_question_text).reshape(1,1000)
        similarities = cosine_similarity(self.X, feature_vec)
        ind = np.argmax(similarities)
        return ans[ind]

if __name__ == '__main__':
    naive_lm = Naive_LM()
    example_question = "hallo zusammen ich bin am berlegen von meinem analog anschluss auf einen ip anschluss zu wechseln gibt es bei der umstellung"
    ans = naive_lm.get_closest_answers(example_question)
    print(ans)
    print("done")