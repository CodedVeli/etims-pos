import { NextResponse } from 'next/server';

const ETIMS_BACKEND_URL = process.env.ETIMS_BACKEND_URL || 'http://localhost:5000';

export async function POST(request) {
  try {
    const { items, total } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json({
        message: 'No items provided'
      }, { status: 400 });
    }
    
    const response = await fetch(`${ETIMS_BACKEND_URL}/api/etims/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, total })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ETIMS service error');
    }
    
    const receipt = await response.json();
    return NextResponse.json(receipt);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to generate receipt' }, { status: 500 });
  }
}