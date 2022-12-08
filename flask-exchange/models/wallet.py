import binascii

import Crypto
import Crypto.Random
from Crypto.Hash import SHA
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5


class Wallet:
    def __init__(self):
        random_gen = Crypto.Random.new().read
        private_key = RSA.generate(1024, random_gen)
        public_key = private_key.publickey()
        self.private_key = private_key
        self.public_key = public_key

    def get_keys(self):
        return {
            'private_key': binascii.hexlify(self.private_key.exportKey(format='DER')).decode('ascii'),
            'public_key': binascii.hexlify(self.public_key.exportKey(format='DER')).decode('ascii')
        }
