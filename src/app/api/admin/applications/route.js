import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Restaurant from '../../../../models/Restaurant';
import Charity from '../../../../models/Charity';

export async function GET() {
  try {
    await dbConnect();
    
    // .lean() strips away the heavy Mongoose formatting so we can easily add new properties
    const restaurants = await Restaurant.find({}).sort({ createdAt: -1 }).lean();
    const charities = await Charity.find({}).sort({ createdAt: -1 }).lean();

    // Tag them so the frontend knows who is who, and standardize the contact info
    const restWithType = restaurants.map(r => ({ ...r, orgType: 'Restaurant', contact: r.address }));
    const charWithType = charities.map(c => ({ ...c, orgType: 'Charity', contact: c.contactEmail }));

    // Mash them together and sort the combined list by date
    const allApplications = [...restWithType, ...charWithType].sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ data: allApplications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load applications." }, { status: 500 });
  }
}