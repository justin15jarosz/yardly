export { createRemoteJWKSet, jwtVerify } from "jose";

const ISSUER   = `https://${process.env.AUTH0_DOMAIN}/`;
const AUDIENCE = process.env.AUTH0_AUDIENCE;
const JWKS     = createRemoteJWKSet(new URL(`${ISSUER}.well-known/jwks.json`));

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE,
      algorithms: ["RS256"],
    });

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

function requireScope(scope) {
  return (req, res, next) => {
    const scopes = (req.user?.scope || "").split(" ");
    if (!scopes.includes(scope)) return res.status(403).json({ error: "Insufficient scope" });
    next();
  };
}

export default { authMiddleware, requireScope };
