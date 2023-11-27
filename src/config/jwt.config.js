import { SignJWT } from "jose";

export const getToken = async (payload, expiry) => {
  const signJWT = new SignJWT(payload).setProtectedHeader({
    alg: "HS256",
  });

  if (expiry) {
    signJWT.setExpirationTime(expiry);
  }

  return await signJWT.sign(
    new TextEncoder().encode(process.env.JWT_TOKEN_SECRET)
  );
};
