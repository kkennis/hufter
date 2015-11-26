var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var key = process.env["ENCRYPT_KEY"];
var _ = require('ramda');


function aesDecrypt(string,key){
  var decrypted = AES.decrypt(string, key);
  var decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
  return decryptedString;
}

function aesEncrypt(string,key){
  var encrypted = AES.encrypt(string,key);
  var encryptedString = encrypted.toString();
  return encryptedString;
}

module.exports.decrypt = _.curry(aesDecrypt)(_.__, key);
module.exports.encrypt = _.curry(aesEncrypt)(_.__, key);