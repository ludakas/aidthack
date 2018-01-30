from googletrans import Translator
from random import randint
import process_msg as pm

translator = Translator()

langs = ['cs', 'hr', 'pl', 'sk', 'sl']

qs = []
anss = []

q_f = ''
ans_l = ''

newlines = []
with open('forum_1000.csv', 'r') as f:
    l = f.readline()
    l = f.readline()
    i = 0
    while l and i < 70:
        
        ans = l.split(',')[1]
        id = l.split(',')[3]

        if ans == '0' and id not in qs:
            q_o = l.split('"')[-2]
            lang = langs[randint(0, len(langs)-1)]
            q_t = translator.translate(q_o, src='de', dest=lang).text
            q_f = translator.translate(q_t, src=lang, dest='de').text
            qs.append(id)
        elif ans == '1' and id not in anss:
            anss.append(id)
            ans_l = l.split('"')[-2]
        
        if id in qs and id in anss and len(qs) > len(newlines) and len(anss) > len(newlines):
            newlines.append(q_f + '____' + ans_l + '\n')
            i += 1
            print(i)
        
        l = f.readline()
        
        
with open('../qa_val.txt', 'w') as f:
    for l in newlines:
        f.write(l)
        

all = 0
cor = 0
for l in newlines:
    ans_o = l.split('____')[1][:50]
    ans_p = pm.process(l.split('____')[0])[:50]
    
    if ans_o == ans_p:
        cor += 1
    all += 1
    
print('{} out of {} are correct => {:.2%} accuracy'.format(cor, all, cor/all))
