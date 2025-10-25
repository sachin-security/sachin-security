// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';

// GET - Fetch all support messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const collection = await getCollection('support-messages');
    
    let query: any = {};
    if (status) {
      query.status = status;
    }
    
    const messages = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const collection = await getCollection('support-messages');
    
    // Generate message ID
    const messageCount = await collection.countDocuments();
    const messageId = `MSG${String(messageCount + 1).padStart(4, '0')}`;
    
    const messageData = {
      id: messageId,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      subject: body.subject,
      message: body.message,
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(messageData);
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully. We will contact you soon.',
      data: { ...messageData, _id: result.insertedId }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
