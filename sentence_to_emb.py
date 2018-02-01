### WIP ###


from pprint import pprint
import numpy as np


lookup_table = dict()
with open("forum_1000_embeddings.vec","r") as f:
    for line in f:
        tokens = line.split(" ")
        key = tokens[0]
        vec = [ float(x) for x in tokens[1:-1] ]
        if len(vec) > 0:
            assert len(vec) == 100
            lookup_table[key] = vec

pad_vec = np.mean([ v for v in lookup_table.values()], axis=0)

# pprint(len(lookup_table))
# pprint(lookup_table["ist"])

def pad_sequence(seq, length):
    if len(seq) == length:
        return seq
    else:
        return seq + ["<PAD>"] * (length - len(seq))

def embedding(word):
    if word is "<PAD>":
        return pad_vec
    try:
        return lookup_table[word]
    except KeyError:
        return pad_vec


if __name__ == '__main__':
    sentences = []
    with open("res/forum_1000.txt","r") as f:
        for line in f:
            sentences.append([ word for word in line.replace("\n", '').split(" ") ])

    seq_len = max(len(sentence) for sentence in sentences)

    sentences = [ [ embedding(word) for word in pad_sequence(sentence, seq_len) ] for sentence in sentences ]
    sentences = np.array(sentences)


    pprint(len(sentences))
    pprint(len(sentences[1]))
    pprint(sentences[17])
    from IPython import embed
    embed()
    # pprint(sentences[1])
