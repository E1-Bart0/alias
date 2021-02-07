#### Запуск на сервере: ####
# YouTube который помог:
# https://www.youtube.com/watch?v=Sa_kQheCnds&list=PL-osiE80TeTtoQCKZ03TU5fNfx2UY6U4p&index=13
# https://www.youtube.com/watch?v=FLiKTJqyyvs&t=1358s
# https://gist.github.com/postrational/5747293
# Библиотеки от Диджатализируй
sudo apt-get install -y vim mosh tmux htop git curl wget unzip zip gcc build-essential make

sudo apt-get install -y zsh tree redis-server nginx zlib1g-dev libbz2-dev libreadline-dev llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev liblzma-dev python3-dev python3-lxml libxslt-dev python-libxml2 libffi-dev libssl-dev python-dev gnumeric libsqlite3-dev libpq-dev libxml2-dev libxslt1-dev libjpeg-dev libfreetype6-dev libcurl4-openssl-dev supervisor

sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

chsh -s $(which zsh)
# Создаем приложение
sudo apt-get install -y python3 python3-pip python3-venv
mkdir ~/Project
cd ~/Project
git config --global user.name "E1-Bart0"
git config --global user.email starovoitov.vadik1@gmail.com

git clone https://github.com/E1-Bart0/alias.git
python3 -m pip install -U pip


# Для предварительного просмотра использовать:
sudo apt-get install ufw
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 8000
sudo ufw enable
# Отключаем: 
sudo ufw disable
# Качаем app в settings:
ALLOWED_HOSTS = ['172.105.246.197', '127.0.0.1']
...
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'
# Собираем все static файлы, иначе не грузит их
python manage.py collectstatic
# Проверяем python manage.py runserver 0.0.0.0:8000

# Устанавливаем gunicorn:
pip install gunicorn
# gunicorn config в dir c manage.py
vim ~/Project/alias/gunicorn_config.py
#
USER = 'vad'
DIR_NAME = 'Project'
DJANGO_DIR_NAME = 'alias'
APP_NAME = 'aliace'
PROCESS = 1

command = f'/home/{USER}/{DIR_NAME}/env/bin/gunicorn'
pythonpath = '/home/{USER}/{DIR_NAME}/{DJANGO_DIR_NAME}'
bind = '127.0.0.1:8001'
workers = PROCESS * 2 + 1
user = USER
limit_request_fields = 32000
limit_request_field_size = 0
raw_env = f'DJANGO_SETTINGS_MODULE={APP_NAME}.settings'
# Скрипт запуска gunicorn выше, чем config
mkdir ~/Project/bin
vim ~/Project/bin/start_gunicorn.sh
#
#!/bin/bash
source /home/vad/Project/env/bin/activate
exec gunicorn  -c "/home/vad/Project/alias/gunicorn_config.py" aliace.wsgi
# Даем выполнение этому файлу
chmod +x ~/Project/bin/start_gunicorn.sh

####
# Можно проверить на ошибки 
~/Project/bin/start_gunicorn.sh
# Должен быть 502 BAD так как nginx не настроен
####

# Настройка nginx
sudo vim /etc/nginx/sites-enabled/default
# static поменять
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        location /static/ {
                alias   /home/vad/Project/alias/static/;
        }

        server_name _;

        location / {
                proxy_pass http://127.0.0.1:8001;
                proxy_set_header X-Forwarded-Host $server_name;
                proxy_set_header X-Real-IP $remote_addr;
                add_header P3P 'CP="ALL DSP COR PSAa PSDa OUR NOR ONL UNI COM NAV"';
                add_header Access-Control-Allow-Origin *;
        }
}
# Можно запустить gunicorn и проверить работу, все должно уже работать.


# Настройка supervisora путь и имя
sudo vim /etc/supervisor/conf.d/alias.conf
#
[program:www_gunicorn]
command=/home/vad/Project/bin/start_gunicorn.sh
user=vad
process_name=%(program_name)s
numprocs=1
autostart=true
autorestart=true
redirect_stderr=true
# ВСЕ!!!
sudo service supervisor start






