// require("dotenv").config();
const CryptoJS = require("crypto-js");

function encrypt(text) {
    const ciphertext = CryptoJS.AES.encrypt(
        text,
        "process.env.CRYPTO_SECRET_KEY"
    ).toString();
    return ciphertext;
}

function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(
        ciphertext,
        "process.env.CRYPTO_SECRET_KEY"
    );
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

module.exports = { encrypt, decrypt };
