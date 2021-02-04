import time
import requests
import logging
from api.models import EasyWord, MediumWord, HardWord


logging.basicConfig(filename='words_db.log', level=logging.DEBUG)
APIKEY = '20140696-5eddb214e95c3bc40379d34e3'
LANG = 'ru'
DB = {'easy': EasyWord, 'medium': MediumWord, 'hard': HardWord}


def fill_db(diff, words):
    for word in words:
        url = f'https://pixabay.com/api/?key={APIKEY}&q={word.lower()}' \
              f'&lang={LANG}&image_type=photo'
        r = requests.get(url).json()
        try:
            img_url = r['hits'][0]['webformatURL']
            time.sleep(1)
            try:
                DB[diff](word=word, img=img_url).save()
                logging.info(f'{word} saved')
            except Exception as exc:
                logging.exception(f'{word} did not add \n{exc}')
        except IndexError:
            logging.exception(url, '\n', r)


def read_file(path, stop):
    words = []
    with open(path, mode='r', encoding='cp1251') as file:
        for index, line in enumerate(file.readlines()):
            word = line[:-1].lower()
            if '-' in word or '.' in word or len(word) < 5 \
                    or len(list(filter(lambda x: word.startswith(x[:-1]), words))) > 0:
                stop += 1
                continue
            if index == stop:
                break
            words.append(word)
    return words


Words = ['привет', 'очень', 'весна', 'зима', 'лето', 'круто', 'опять',
         'каникулы', 'выходные', 'жара', 'отдых', 'гарнитура', 'клавиатура',
         'угар', 'загар', 'муж', 'часы', 'телефон', 'стол', 'ложка', 'вилка',
         'телевизор', 'яхта', 'парус', 'лох', 'чебурек',]
