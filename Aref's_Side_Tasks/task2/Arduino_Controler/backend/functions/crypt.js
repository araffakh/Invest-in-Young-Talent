require("dotenv").config();
const crypto = require("crypto");

function encrypt(text) {
    const cipher = crypto.createCipher(
        "aes-256-cbc",
        process.env.CRYPTO_SECRET_KEY
    );
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decrypt(encrypted) {
    const decipher = crypto.createDecipher(
        "aes-256-cbc",
        process.env.CRYPTO_SECRET_KEY
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = { encrypt, decrypt };
