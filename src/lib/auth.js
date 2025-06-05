import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in environment variables');
}

const ADMIN_PASSWORD_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 12);

export const AUTH_CONFIG = {
  JWT_SECRET,
  ADMIN_EMAIL,
  ADMIN_PASSWORD_HASH,
  TOKEN_EXPIRY: '24h',
  COOKIE_NAME: 'admin-token',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,  
    path: '/'
  }
};

export async function verifyAdminCredentials(email, password) {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  
  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: AUTH_CONFIG.TOKEN_EXPIRY 
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function isAuthenticated(request) {
  const token = request.cookies.get(AUTH_CONFIG.COOKIE_NAME)?.value;
  
  if (!token) {
    return { authenticated: false, user: null };
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded || decoded.email !== ADMIN_EMAIL) {
    return { authenticated: false, user: null };
  }
  
  return { 
    authenticated: true, 
    user: { 
      email: decoded.email, 
      role: 'admin',
      iat: decoded.iat,
      exp: decoded.exp 
    } 
  };
}

export function generateAuthToken(user) {
  return generateToken({ 
    email: user.email, 
    role: 'admin',
    timestamp: Date.now()
  });
}

export function createUnauthorizedResponse(message = 'Unauthorized access') {
  return new Response(JSON.stringify({ 
    success: false, 
    message 
  }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}