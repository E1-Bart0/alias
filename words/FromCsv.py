import csv
import time

import requests
from bs4 import BeautifulSoup


def run(path, difficult):
    with open(path, mode='r', encoding='utf-8') as file:
        with open(f'{difficult}.txt', mode='w', encoding='utf-8') as writing_file:
            words = list(csv.reader(file))
            for index, word in enumerate(words):
                img = parsing_img(word[0], index, len(words), difficult)
                writing_file.write(f'{word[0]}; {img}\n')


def parsing_img(word, index, finish, difficult):
    word = word.replace(' ', '%20')
    if difficult == 'hard':
        word += '%20кальян'
    url = f'https://www.google.com/search?q={word}&tbm=isch'
    r = requests.get(url)
    print(f'Loading {word}: {round((index+1) / finish * 100)} %')
    soup = BeautifulSoup(r.text, features='html.parser', multi_valued_attributes=False)
    try:
        img = soup.find('img', alt='')['src']
        return img
    except Exception as err:
        print(err)
        return None


if __name__ == '__main__':
    run('SergeyWords.csv', difficult='hard')
