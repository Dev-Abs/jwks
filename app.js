const express = require('express');
const app = express();
const jose = require('node-jose');
const fs = require('fs');

// Load your public key
const publicKey = fs.readFileSync('publickey.pem', 'utf8');

// Initialize JWKS variable
let jwks;

// Convert to JWKS format
(async () => {
    const keystore = jose.JWK.createKeyStore();
    const key = await keystore.add(publicKey, 'pem');
    jwks = keystore.toJSON(); // Assign JWKS to the variable
    console.log("JWKS generated:", JSON.stringify(jwks, null, 2));
})();

// Serve JWKS
app.get('/.well-known/jwks.json', (req, res) => {
    if (!jwks) {
        return res.status(503).send({ error: "JWKS not ready yet" });
    }
    res.json(jwks);
});

app.listen(3000, () => {
    console.log('JWKS endpoint is running on http://localhost:3000/.well-known/jwks.json');
});
