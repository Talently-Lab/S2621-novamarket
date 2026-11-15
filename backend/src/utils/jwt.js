import jwt from "jsonwebtoken";

const JWT_ALGORITHM = "HS256";

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return null;
  }

  return secret;
};

export const signAuthToken = (user) => {
  const secret = getJwtSecret();

  if (!secret) {
    return null;
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      algorithm: JWT_ALGORITHM,
    },
  );
};

export const verifyAuthToken = (token) => {
  const secret = getJwtSecret();

  if (!secret) {
    const error = new Error("Falta JWT_SECRET");
    error.name = "JwtSecretMissing";
    throw error;
  }

  return jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
  });
};
