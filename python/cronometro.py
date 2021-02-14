#!/home/pi/ProgramacionRemota/python/env/bin/python3

#############################################
#
# Control del tiempo de cada banco de trabajo
#
#############################################

from random import randint, seed
import subprocess
import pyrebase


config = {
    "apiKey": "AIzaSyAatzOzuR6BBb3XcqrW49h774J7BC2BBw4",
    "authDomain": "programacionremota.firebaseapp.com",
    "databaseURL": "https://programacionremota.firebaseio.com",
    "storageBucket": "programacionremota.appspot.com",
}

firebase = pyrebase.initialize_app(config)

db = firebase.database()

# Temporarily replace quote function
# hay un bug en pyrebase
# https://github.com/thisbejim/Pyrebase/issues/294
def noquote(s):
    return s

pyrebase.pyrebase.quote = noquote

avatarList = [
    'https://ssl.gstatic.com/docs/common/profile/alligator_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/anteater_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/axolotl_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/badger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/bat_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/beaver_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/buffalo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/camel_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/capybara_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chameleon_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/cheetah_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chinchilla_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chipmunk_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/chupacabra_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/cormorant_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/coyote_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/crow_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dingo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dinosaur_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/dolphin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/duck_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/elephant_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ferret_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/frog_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/giraffe_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/grizzly_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/hedgehog_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/hippo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ibex_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/ifrit_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/jackal_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/jackalope_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/kangaroo_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/koala_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/kraken_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/lemur_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/leopard_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/liger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/llama_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/mink_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/monkey_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/narwhal_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/nyancat_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/orangutan_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/panda_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/penguin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/pumpkin_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/python_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/quagga_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/rabbit_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/raccoon_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/rhino_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/sheep_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/shrew_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/skunk_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/squirrel_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/tiger_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/turtle_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/walrus_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/wolverine_lg.png',
    'http://ssl.gstatic.com/docs/common/profile/wombat_lg.png'
]
# generamos indice aleatorio para el avatar
seed()
index_random = randint(0, avatarList.__len__())

# filtramos los bancos ocupados
wbs = db.child('workbenchs').order_by_child('status').equal_to('busy').get()
# recorremos bancos ocupados
for wb in wbs.each():
    # print(wb.key())
    # datos del banco
    banco = wb.val()
    # print(wb.val())
    # descontamos 1 minuto si hay tiempo que descontar
    if (banco['t_remaining'] > 0):
        banco['t_remaining'] = banco['t_remaining'] - 1
        db.child("workbenchs").child(wb.key()).update({"t_remaining": banco['t_remaining']})
    # si el tiempo llega a cero, liberamos el banco y reseteamos tiempo remanente
    else:
        # TODO llamada a express para pararlo o desde aqui?
        # TODO actualizar avatar
        # inicializo campos
        data = {
            "t_remaining": banco['t_total'],
            "status": "free",
            "userLogueado": "",
            "avatar": avatarList[index_random]
        }
        print(avatarList[index_random])
        # actualizo los campos
        db.child("workbenchs").child(wb.key()).update(data)

        # filtramos el usuario que estaba utilizandolo
        # la 'key' es la id, AA00, AA01, etc.
        # la suma es necesaria para que le anhada las comillas sino da error
        # https://stackoverflow.com/questions/41789515/how-to-filter-complex-object-in-firebase
        id_banco = "" + wb.key()
        print("Parando: " + id_banco)
        # filtramos el usuario de este banco
        users = db.child('users').order_by_child('banco').equal_to(id_banco).get()
        for user in users.each():
            # liberamos al usuario
            db.child("users").child(user.key()).update({"banco": "-", "bancoNombre": "-"})

        # cerramos el banco
        # necesitamos shell=True, ya que no separamos los argumentos
        # https://stackoverflow.com/questions/18962785/oserror-errno-2-no-such-file-or-directory-while-using-python-subprocess-in-dj
        comando_pm2 = 'pm2 delete ' + id_banco
        banco_cerrado = subprocess.Popen(comando_pm2, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        output, error = banco_cerrado.communicate()
        # print(output)
        # print(error)
