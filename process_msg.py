import subprocess
from naive_LM import Naive_LM
import pandas as pd


def process(msg):

    answer = starspace(msg)


    return 'Returned message ====> ' + answer
    
    
def naive(text):
    model = Naive_LM()
    
    list_of_a = model.get_closest_answers(text)
    
    print('######################')
    print(list_of_a)
    print('######################')
    
    return list_of_a[0]
    
    
def fasttext_test(text):

    with open('testtext.txt', 'w') as f:
        f.write(text)
    
    bashCommand = '~/fastText/fasttext predict-prob model_sup_tr.bin testtext.txt 1'
    output = subprocess.check_output(['bash','-c', bashCommand])
    
    return output.decode()

def starspace(text):

    with open('testtext.txt', 'w') as f:
        f.write(text)

    bashCommand = '~/Starspace/embed_doc questions_1000_embeddings testtext.txt'
    output = subprocess.check_output(['bash','-c', bashCommand])

    print(output)

    dictionary = pd.read_csv('messageId_threadId.txt')

    return output.decode()
