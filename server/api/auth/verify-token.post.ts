import jsonwebtoken from "jsonwebtoken";

export default eventHandler(async (event) => {
  const { jwt } = await readBody(event);
  const jwtSecret = process.env.JWT_SECRET;

  try {
    const verifiedToken = jsonwebtoken.verify(jwt, jwtSecret as string);

    if (verifiedToken) {
      return true;
    } else {
      false;
    }
  } catch {
    return false;
  }
});
