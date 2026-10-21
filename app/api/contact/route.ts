// app/api/contact-us/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { getSessionUser } from '@/app/lib/apiAuth';
import { validOpsOrigin } from '@/app/lib/guardOperations';
import { ObjectId } from 'mongodb';

async function staffAccess() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  if (!['admin', 'hr'].includes(user.role)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  return null;
}

// GET - Fetch all support messages


export async function GET(request: NextRequest) {
  const denied = await staffAccess(); if (denied) return denied;
  

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const collection = await getCollection('support-messages');
    
    const query: Record<string, unknown> = { deletedAt: { $exists: false } };
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
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to process request' },
      { status: 500 }
    );
  }
}

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject'];
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
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to process request' },
      { status: 500 }
    );
  }
}


//update contactform
export async function PATCH(request: NextRequest) {
  const denied = await staffAccess(); if (denied) return denied;
  if (!validOpsOrigin(request)) return NextResponse.json({ success: false, error: 'Invalid origin' }, { status: 403 });
  try {
    const { id, status } = await request.json();
    if (typeof id !== 'string' || !['New', 'In Progress', 'Resolved'].includes(status)) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const collection = await getCollection('support-messages');
    const result = await collection.updateOne(
      { id: id, deletedAt: { $exists: false } },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'messages not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unable to process request' }, { status: 500 });
  }
}

// Recoverable deletion, using the existing collection and immutable MongoDB ID.
export async function DELETE(request: NextRequest) {
  const denied = await staffAccess(); if (denied) return denied;
  if (!validOpsOrigin(request)) return NextResponse.json({ success: false, error: 'Invalid origin' }, { status: 403 });
  try {
    const { id, restore } = await request.json();
    if (typeof id !== 'string' || !/^[a-f0-9]{24}$/i.test(id) || (restore !== undefined && typeof restore !== 'boolean')) return NextResponse.json({ success: false, error: 'Invalid message' }, { status: 400 });
    const collection = await getCollection('support-messages');
    const result = await collection.updateOne(
      { _id: new ObjectId(id), deletedAt: { $exists: !!restore } },
      restore ? { $unset: { deletedAt: '' }, $set: { updatedAt: new Date() } } : { $set: { deletedAt: new Date(), updatedAt: new Date() } }
    );
    if (!result.matchedCount) return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not update message. Try again.' }, { status: 500 });
  }
}
