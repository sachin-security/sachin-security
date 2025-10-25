// app/api/upload/resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log("Got req to upload resume")
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only PDF and DOC files are allowed' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const filename = `${timestamp}_${originalName}`;
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file to public/resumes directory
    const uploadDir = join(process.cwd(), 'public', 'resumes');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    
    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        filename,
        url: `/resumes/${filename}`,
        size: file.size,
        type: file.type
      }
    });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
