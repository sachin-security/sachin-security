// app/api/download/profile/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string } >}
) {
  try {
     const params = await context.params;
    const { fileId } = params;
    
    const collection = await getCollection('uploads');
    
    // Find the file
    const file = await collection.findOne({ _id: new ObjectId(fileId) });
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'user File not found' },
        { status: 404 }
      );
    }
    
    // Convert Base64 back to buffer
    const buffer = Buffer.from(file.data, 'base64');
    
    // Return file with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('User PP Download error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
