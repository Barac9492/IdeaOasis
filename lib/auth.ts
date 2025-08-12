import { NextRequest } from 'next/server';

export async function authenticate(req: NextRequest): Promise<any> {
  // Simple authentication for demonstration
  // In production, this would integrate with your auth system
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // For demo purposes, accept any bearer token
  const token = authHeader.substring(7);
  
  if (token === 'demo_token') {
    return {
      id: 'demo_user',
      email: 'demo@ideaoasis.co.kr',
      role: 'admin'
    };
  }
  
  return null;
}