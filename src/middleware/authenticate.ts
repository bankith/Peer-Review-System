import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';

// Define the expected structure of the payload in the JWT
interface JwtPayload {
  userId: number;
}

// Extend the NextApiRequest to include the user information
interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload;
}

// Type for the next function which is called to pass control to the next middleware
type NextFunction = (result?: any) => void;

// Middleware function to authenticate and authorize requests
export function authenticate(req: AuthenticatedRequest, res: NextApiResponse, next: NextFunction) {
  // Attempt to retrieve the token from the Authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1]; // Expecting "Bearer [token]"

  if (!token) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }

  try {
    // Verify the token with your secret key
    const decoded = jwt.verify(token, 'your_secret_key') as JwtPayload;

    // Attach the user information to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or the route handler
  } catch (err) {
    // If the token is not valid, send an unauthorized status
    return res.status(401).json({ error: 'Invalid Token' });
  }
}
