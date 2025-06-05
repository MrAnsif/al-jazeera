import { 
  verifyAdminCredentials, 
  generateAuthToken,
  createUnauthorizedResponse,
  isAuthenticated,
  AUTH_CONFIG 
} from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, action } = await request.json();
    
    if (action === 'logout') {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
      
      response.cookies.set(AUTH_CONFIG.COOKIE_NAME, '', {
        ...AUTH_CONFIG.COOKIE_OPTIONS,
        maxAge: 0
      });
      
      return response;
    }
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and password are required' 
      }, { status: 400 });
    }
    
    const isValid = await verifyAdminCredentials(email, password);
    
    if (!isValid) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return createUnauthorizedResponse('Invalid credentials');
    }
    
    // Generate token and create response
    const token = generateAuthToken({ email });
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: { email, role: 'admin' }
    });
    
    // Set secure HTTP-only cookie
    response.cookies.set(AUTH_CONFIG.COOKIE_NAME, token, AUTH_CONFIG.COOKIE_OPTIONS);
    
    return response;
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const auth = isAuthenticated(request);
    
    if (!auth.authenticated) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not authenticated' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      authenticated: true,
      user: auth.user 
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}