import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Restaurant from '../../../models/Restaurant';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all restaurants, sorted with newest at the top
    const allRestaurants = await Restaurant.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: allRestaurants }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load restaurants." }, { status: 500 });
  }
}