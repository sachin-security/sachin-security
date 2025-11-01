// app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';

// GET - Fetch all jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const collection = await getCollection('all-jobs');
    
    let query = {};
    if (status && status !== 'all') {
      query = { status: status.charAt(0).toUpperCase() + status.slice(1) };
    }
    
    const jobs = await collection
      .find(query)
      .sort({ postedDate: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'location'];//['title', 'department', 'location', 'type', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const collection = await getCollection('all-jobs');
    
    // Generate job ID
    const jobCount = await collection.countDocuments();
    const jobId = `JOB${String(jobCount + 1).padStart(3, '0')}`;
    
    const jobData = {
      id: jobId,
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      experience: body.experience || '',
      salary: body.salary || '',
      description: body.description,
      eligibility: body.eligibility || [],
      responsibilities: body.responsibilities || [],
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(jobData);
    
    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      data: { ...jobData, _id: result.insertedId }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
