from googletrans import Translator
from random import randint
import process_msg as pm

translator = Translator()

langs = ['cs', 'hr', 'pl', 'sk', 'sl']

newlines = []
with open('../qa_tr.txt', 'r') as f:
    l = f.readline()
    i = 0
    while l and i < 20:
        print(i)
        
        q_o = l.split('__')[0]
        lang = langs[randint(0, len(langs)-1)]
        q_t = translator.translate(q_o, src='de', dest=lang).text
        q_f = translator.translate(q_t, src=lang, dest='de').text
        
        l = f.readline()
        ans = l.split('__')[0]
        
        newlines.append(q_f + '____' + ans + '\n')
        
        l = f.readline()
        i += 1
        
        
with open('../qa_val.txt', 'w') as f:
    for l in newlines:
        f.write(l)
        

all = 0
cor = 0
for l in newlines:
    ans_o = l.split('____')[1]
    ans_p = pm.process(l.split('____')[0])
    
    print()
    print(ans_o)
    print(ans_p)
    print('{} - {}'.format(len(ans_o), len(ans_p)))
    
    if ans_o == ans_p:
        cor += 1
    all += 1
    
print('{} out of {} are correct => {:.2%} accuracy'.format(cor, all, cor/all))
