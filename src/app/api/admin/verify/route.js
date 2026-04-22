import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Restaurant from '../../../../models/Restaurant';
import Charity from '../../../../models/Charity'; 

export async function PUT(request) {
  try {
    await dbConnect();
    // Notice we are now catching the 'orgType' as well!
    const { orgId, action, orgType } = await request.json(); 

    if (!orgId || !action || !orgType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const status = action === 'Approve' ? 'Approved' : 'Rejected';
    
    let updatedOrg;
    
    // Route the update to the correct database collection
    if (orgType === 'Restaurant') {
      updatedOrg = await Restaurant.findByIdAndUpdate(orgId, { status }, { new: true });
    } else if (orgType === 'Charity') {
      updatedOrg = await Charity.findByIdAndUpdate(orgId, { status }, { new: true });
    }

    return NextResponse.json({ message: `Successfully ${status}`, data: updatedOrg }, { status: 200 });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Failed to verify organization" }, { status: 500 });
  }
}