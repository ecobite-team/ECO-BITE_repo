import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Restaurant from '../../../models/Restaurant';
import Charity from '../../../models/Charity';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { type, name, contactInfo } = body;

    // Check what dropdown option they selected on the frontend
    if (type === 'restaurant') {
      const newRest = await Restaurant.create({ 
        name: name, 
        address: contactInfo // Restaurants use addresses
      });
      return NextResponse.json({ message: "Restaurant application submitted!", data: newRest }, { status: 201 });
      
    } else if (type === 'charity') {
      const newCharity = await Charity.create({ 
        name: name, 
        contactEmail: contactInfo // Charities use emails
      });
      return NextResponse.json({ message: "Charity application submitted!", data: newCharity }, { status: 201 });
      
    } else {
      return NextResponse.json({ error: "Invalid application type" }, { status: 400 });
    }

  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}