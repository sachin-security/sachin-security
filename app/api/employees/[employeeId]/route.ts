// app/api/employees/[employeeId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/app/lib/db';

// GET - Fetch single employee
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ employeeId: string }> }
) {
  try {
    const params = await context.params;
    const collection = await getCollection('employees');
    const employee = await collection.findOne({ employeeId: params.employeeId });
    
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: employee
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update employee
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ employeeId: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const collection = await getCollection('employees');
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { employeeId: params.employeeId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete employee
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ employeeId: string }> }
) {
  try {
    const params = await context.params;
    const collection = await getCollection('employees');
    
    const result = await collection.deleteOne({ employeeId: params.employeeId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
