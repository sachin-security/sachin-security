// app/api/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'jobId',
      'jobTitle',
      'fullName',
      'email',
      'phone',
      'dateOfBirth',
      'education',
      'experience',
      'address'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate phone format (Indian)
    const phoneRegex = /^[+]?91?[6-9]\d{9}$/;
    if (!phoneRegex.test(body.phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }
    
    const applicantsCollection = await getCollection('applicants');
    
    // Check if already applied for this job
    const existingApplication = await applicantsCollection.findOne({
      jobId: body.jobId,
      email: body.email
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'You have already applied for this job' },
        { status: 400 }
      );
    }
    
    // Generate applicant ID
    const applicantCount = await applicantsCollection.countDocuments();
    const applicantId = `APP${String(applicantCount + 1).padStart(4, '0')}`;
    
    const applicantData = {
      id: applicantId,
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      
      // Personal Information
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      
      // Professional Information
      education: body.education,
      experience: body.experience,
      
      // Documents
      resumeUrl: body.resumeUrl || '',
      resumeFilename: body.resumeFilename || '',
      
      // Cover Letter
      coverLetter: body.coverLetter || '',
      
      // Status
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert application
    const result = await applicantsCollection.insertOne(applicantData);
    
    // Update job applicant count
    const jobsCollection = await getCollection('all-jobs');
    await jobsCollection.updateOne(
      { id: body.jobId },
      { $inc: { applicantsCount: 1 } }
    );
    
    // Send confirmation email (optional - implement later)
    // await sendApplicationConfirmationEmail(body.email, body.fullName, body.jobTitle);
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review your application and contact you soon.',
      data: {
        applicationId: applicantId,
        jobTitle: body.jobTitle,
        appliedDate: applicantData.appliedDate
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

// GET - Check if user already applied for a job
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const email = searchParams.get('email');
    
    if (!jobId || !email) {
      return NextResponse.json(
        { success: false, error: 'jobId and email are required' },
        { status: 400 }
      );
    }
    
    const collection = await getCollection('applicants');
    
    const application = await collection.findOne({
      jobId,
      email
    });
    
    return NextResponse.json({
      success: true,
      hasApplied: !!application,
      application: application || null
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
