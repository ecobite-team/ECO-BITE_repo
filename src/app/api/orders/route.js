import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Reservation from '../../../models/Reservation';

// GET: Fetch the consumer's order history
export async function GET() {
  try {
    await dbConnect();
    // Fetch all reservations, newest first
    const orders = await Reservation.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}