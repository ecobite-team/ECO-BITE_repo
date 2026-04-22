import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Reservation from '../../../models/Reservation';

// GET: Fetch the consumer's order history
export async function GET() {
  try {
    await dbConnect();
    const orders = await Reservation.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const { orderId, rating, reviewText } = await request.json();

    const updatedOrder = await Reservation.findByIdAndUpdate(
      orderId, 
      { rating, reviewText }, 
      { new: true }
    );

    return NextResponse.json({ message: "Review saved!", data: updatedOrder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save review." }, { status: 500 });
  }
}