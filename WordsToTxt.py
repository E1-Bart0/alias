def read_file(path, stop):
    words = []
    with open(path, mode='r', encoding='cp1251') as file:
        for index, line in enumerate(file.readlines()):
            word = line[:-1].lower()
            if '-' in word or '.' in word or len(word) < 8 or word.startswith('аб')\
                    or len(list(filter(lambda x: bool(x[:-2] in word), words))) > 0:
                stop += 1
                continue
            if index == stop:
                break

            words.append(word)
    print(words)
    with open('easy.txt', mode='w', encoding='utf-8') as writing_file:
        writing_file.write('\n'.join(words))


if __name__ == '__main__':
    read_file('russian.txt', 20)
