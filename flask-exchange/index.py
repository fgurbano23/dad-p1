import hashlib
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import Flask, jsonify, request, Response, session
from flask_session import Session
from flask_cors import CORS
from models.transaction import Transaction
from models.wallet import Wallet

import requests
import json
import uuid
import traceback

app = Flask(__name__)
cors = CORS(app)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["JWT_SECRET_KEY"] = "P0$TGR4DO.S1-D4D2022"

Session(app)
jwt = JWTManager(app)

USERS = []

SYSTEM = {
    'tokens': 500,
    'wallet': Wallet().get_keys()
}

EXCHANGE_RATE = {
    'token': 1,
    'coin': 0.001,
    'dollar': 10
}

DB_FILES = 'db-files/'


def create_jwt_token(id, wallet_public_key, token_public_key):
    token = create_access_token(identity=id, additional_claims={
                                'wallet_public_key': wallet_public_key,
                                'token_public_key': token_public_key})
    return token


def manage_tokens(token_wallet, amount, operation):
    updated_file = ''
    # Transferir de cuenta usuario a cuenta sistema
    with open(DB_FILES + 'db.txt', mode='r', encoding='utf-8') as f:
        records = f.readlines()
        for entry in records:
            entry = json.loads(entry)
            if entry['token_wallet']['public_key'] == token_wallet:

                if (operation == 'add'):
                    entry['tokens'] = entry['tokens'] + amount
                else:
                    if entry['tokens'] < amount:
                        raise Exception(
                            'No posee tokens suficientes para realizar la operación')

                    entry['tokens'] = entry['tokens'] - amount

            updated_file = updated_file + \
                (json.dumps(entry) + '\n')
    # Escritura
    with open(DB_FILES + 'db.txt', mode='w', encoding='utf-8') as f:
        f.write(updated_file)


def get_wallet_private_key(id):
    try:
        with open(DB_FILES + 'db.txt', mode="r", encoding="utf-8") as f:
            users_registered = f.readlines()

            for user in users_registered:
                user_dict = json.loads(user)
                if user_dict['id'] == id:
                    return user_dict['coin_wallet']['private_key']
    except Exception as e:
        print(e)
        raise e


def transfer_to_user(node, sender_public_key, sender_private_key, receiver_public_key, amount, system_tx=False):
    try:
        sender_account = requests.post('http://localhost:5001/balance', json={
            'node': node,
            'coin_wallet': sender_public_key
        })

        print(sender_account)
        sender_account = json.loads(sender_account.content)
        sender_balance = (json.loads(sender_account))['balance']

        if not system_tx:
            if float(sender_balance) < float(amount):
                raise Exception(
                    'No posee aurax suficientes para realizar la operación')

        transaction = Transaction(
            sender_public_key,
            sender_private_key,
            receiver_public_key,
            amount
        )
        rq = {
            'sender_address': getattr(transaction, 'sender_address'),
            'recipient_address': getattr(transaction, 'recipient_address'),
            'amount': getattr(transaction, 'value'),
            'signature': transaction.sign_transaction()
        }
        res = requests.post(
            node + '/transactions/new', data=rq)
    except Exception as e:
        raise e


@app.route('/exchange-rate')
def exchange_rate():
    return jsonify(EXCHANGE_RATE)


@app.route('/exchange', methods=['POST'])
@jwt_required()
def exchange_currency():
    form = request.json
    private_key = get_wallet_private_key(get_jwt_identity())

    from_currency = EXCHANGE_RATE[form['to_currency']]
    to_currency = EXCHANGE_RATE[form['from_currency']]
    exchange_amount = form['amount'] * from_currency / to_currency

    try:
        if (form['from_currency'] == 'token'):
            if (form['to_currency'] == 'dollar'):
                manage_tokens(form['token_wallet'], form['amount'], 'remove')
            else:  # TOKENS --> AURAX
                # actualizar archivo con tokens -= new_tokens
                manage_tokens(form['token_wallet'], form['amount'], 'remove')
                # Transferir del sistema al usuario
                transfer_to_user(
                    form['node'],
                    SYSTEM['wallet']['public_key'],
                    SYSTEM['wallet']['private_key'],
                    form['coin_wallet'],
                    str(exchange_amount),
                    True)
        else:
            if (form['to_currency'] == 'token'):
                # Transferir de cuenta usuario a cuenta sistema
                transfer_to_user(
                    form['node'],
                    form['coin_wallet'],
                    private_key,
                    SYSTEM['wallet']['public_key'],
                    str(form['amount']))
                manage_tokens(form['token_wallet'], exchange_amount, 'add')
            else:
                transfer_to_user(
                    form['node'],
                    form['coin_wallet'],
                    private_key,
                    SYSTEM['wallet']['public_key'],
                    str(form['amount'])
                )
        return jsonify({'data': 'Transacción exitosa'}), 200
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/sign-in', methods=['POST'])
def sign_in():
    form = request.json
    try:
        with open(DB_FILES + 'db.txt', mode="r", encoding="utf-8") as f:
            users_registered = f.readlines()
            print(len(users_registered))

            for user in users_registered:
                user_dict = json.loads(user)
                hash_pasword = hashlib.sha256(
                    form['password'].encode('utf-8')).hexdigest()

                if user_dict['username'] == form['username'] and user_dict['password'] == hash_pasword:
                    return jsonify({
                        'token':  create_jwt_token(
                            user_dict['id'],
                            user_dict['coin_wallet']['public_key'],
                            user_dict['token_wallet']['public_key'],
                        )
                    }), 200
            return jsonify({'data': 'Usuario o contraseña incorrecta'}), 500
    except Exception as e:
        print(e)
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/sign-up', methods=['POST'])
def sign_up():
    form = request.json
    try:
        with open(DB_FILES + 'db.txt', mode="r+", encoding="utf-8") as f:
            user_id = uuid.uuid4().hex
            records = f.readlines()
            is_registered = False

            for entry in records:
                entry = entry.replace('\n', '')
                entry = json.loads(entry)

                if entry['username'] == form['username']:
                    is_registered = True

            if is_registered:
                return jsonify({'data': 'Usuario existente'}), 500
            else:
                user_record = {
                    'id': user_id,
                    'name': form['name'],
                    'surname': form['surname'],
                    'username': form['username'],
                    'coin_wallet': Wallet().get_keys(),
                    'token_wallet': Wallet().get_keys(),
                    'tokens': 0,
                    'password': hashlib.sha256(form['password'].encode('utf-8')).hexdigest()
                }
                access_token = create_jwt_token(
                    user_record['id'],
                    user_record['coin_wallet']['public_key'],
                    user_record['token_wallet']['public_key'],
                )
                f.write(json.dumps(user_record) + '\n')

                return jsonify({'token': access_token})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/beneficiaries')
@jwt_required()
def get_beneficiaries():
    try:
        users = []
        with open(DB_FILES + 'db.txt', mode="r", encoding="utf-8") as f:
            users_registered = f.readlines()
            for user in users_registered:
                user_dict = json.loads(user)
                users.append({
                    'username': user_dict['username'],
                    'id': user_dict['id'],
                    'wallet_public_key': user_dict['coin_wallet']['public_key'],
                    'token_public_key': user_dict['token_wallet']['public_key'],
                })
        return jsonify({'data': users}), 200
    except Exception as e:
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/tokens', methods=['POST'])
@jwt_required()
def buy_tokens():
    form = request.json
    token_wallet = form['token_wallet']
    amount = form['amount']
    tokens_to_add = amount/10

    try:
        updated_file = ''
        # Lectura
        with open(DB_FILES + 'db.txt', mode='r', encoding='utf-8') as f:
            records = f.readlines()
            for entry in records:
                entry = json.loads(entry)
                if entry['token_wallet']['public_key'] == token_wallet:
                    entry['tokens'] = entry['tokens'] + tokens_to_add
                updated_file = updated_file + (json.dumps(entry) + '\n')
        # Escritura
        with open(DB_FILES + 'db.txt', mode='w', encoding='utf-8') as f:
            f.write(updated_file)

        return jsonify({'data': 'ok'}), 200
    except Exception as e:
        print(e)
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/wallet/<public_key>/tokens', methods=['GET'])
@jwt_required()
def get_token_balance(public_key):
    try:
        # Lectura
        with open(DB_FILES + 'db.txt', mode='r', encoding='utf-8') as f:
            records = f.readlines()
            for entry in records:
                entry = json.loads(entry)
                if entry['token_wallet']['public_key'] == public_key:
                    return jsonify({'tokens': entry['tokens']})
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/balance', methods=['POST'])
def get_balance():
    try:
        form = request.json
        res = requests.get(form['node'] + '/balance/' +
                           form['coin_wallet'])
        return jsonify(json.loads(res.content)), 200
    except Exception as e:
        print(e)
        print(traceback.format_exc())
        return jsonify({'data': 'Ha ocurrido un error'}), 500


@app.route('/transfer', methods=['POST'])
@jwt_required()
def make_transfer():
    private_key = get_wallet_private_key(get_jwt_identity())
    try:
        form = request.json
        transfer_to_user(
            form['node'],
            form['coin_wallet'],
            private_key,
            form['receiver'],
            str(form['amount'])
        )
        return jsonify(''), 200
    except Exception as e:
        print(e)
        return jsonify({'data': 'Ha ocurrido un error'}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
