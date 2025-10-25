// app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';

// GET - Fetch single job
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobsId: string }> }
) {
  try {
    // ✅ unwrap the params Promise
    const params = await context.params;

    console.log("geeeeeeeeee" ,params.jobsId)
    const collection = await getCollection('all-jobs');
    const job = await collection.findOne({ id: params.jobsId });
    
    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 } 
      );
    }
    
    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update job
export async function PUT(
   request: NextRequest,
  context: { params: Promise<{ jobsId: string }> }
) {
  try {
    // ✅ unwrap the params Promise
    const params = await context.params;
    const body = await request.json();
    const collection = await getCollection('all-jobs');
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { id: params.jobsId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete job
export async function DELETE(
   request: NextRequest,
  context: { params: Promise<{ jobsId: string }> }
) {
  try {
    // ✅ unwrap the params Promise
    const params = await context.params;
    const collection = await getCollection('all-jobs');
    
    const result = await collection.deleteOne({ id: params.jobsId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
