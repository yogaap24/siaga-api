const { SignJWT } = require("jose");

const getToken = async (payload, expiry) => {
  const signJWT = new SignJWT(payload).setProtectedHeader({
    alg: "HS256",
  });

  console.log(signJWT);

  if (expiry) {
    signJWT.setExpirationTime(expiry);
  }

  return await signJWT.sign(
    new TextEncoder().encode(process.env.JWT_TOKEN_SECRET)
  );
};

module.exports = {
  getToken,
};
