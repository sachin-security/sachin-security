// app/api/applicants/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';


// GET - Fetch applicants (with optional jobId filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');  // ✅ This handles ?jobId=JOB001
    const status = searchParams.get('status');
    
    const collection = await getCollection('applicants');
    
    let query: any = {};
    if (jobId) {
      query.jobId = jobId;  // ✅ Filters by jobId
    }
    if (status && status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    const applicants = await collection
      .find(query)
      .sort({ appliedDate: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: applicants,
      count: applicants.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const collection = await getCollection('applicants');
    const result = await collection.updateOne(
      { id: id },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}