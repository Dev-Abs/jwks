const jose = require('node-jose');
const fs = require('fs');

let jwks;

// Load and prepare JWKS
(async () => {
  const publicKey = fs.readFileSync('./publickey.pem', 'utf8');
  const keystore = jose.JWK.createKeyStore();
  await keystore.add(publicKey, 'pem');
  jwks = keystore.toJSON();
})();

// Export the serverless function
export default (req, res) => {
  if (!jwks) {
    return res.status(503).json({ error: 'JWKS not ready yet' });
  }
  res.json(jwks);
};
