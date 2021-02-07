import logging

from api.models import EasyWord, MediumWord, HardWord

logging.basicConfig(filename='words_db.log', level=logging.DEBUG)
DB = {'easy': EasyWord, 'medium': MediumWord, 'hard': HardWord}


def fill_db(path, difficult):
    with open(path, mode='r', encoding='utf-8') as data_file:
        for index, line in enumerate(data_file.readlines()):
            try:
                word, img = map(str, line.split(','))
                DB[difficult](word=word, img=img).save()
                logging.info(f'{word} saved')
            except Exception as err:
                logging.exception(f'Line #{index}: {line}\nErr: {err}')
                print(f'Line #{index}: {line}\nErr: {err}')
