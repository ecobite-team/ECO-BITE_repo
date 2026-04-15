import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Reservation from '../../../models/Reservation';
import FoodItem from '../../../models/FoodItem'; // We need this to reduce the inventory!

export async function POST(request) {
  try {
    const { foodId, foodName } = await request.json();
    await dbConnect();

    // 1. Check if the food is still available
    const food = await FoodItem.findById(foodId);
    if (!food || food.quantity <= 0) {
      return NextResponse.json({ error: "Sorry, this item is sold out!" }, { status: 400 });
    }

    // 2. Reduce the available quantity by 1 and save it
    food.quantity -= 1;
    await food.save();

    // 3. Generate a random 4-digit code (e.g., 1000 to 9999)
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 4. Create the official reservation ticket
    const newReservation = await Reservation.create({
      foodId,
      foodName,
      pickupCode
    });

    return NextResponse.json({ 
      message: "Reservation successful!", 
      data: newReservation 
    }, { status: 201 });

  } catch (error) {
    console.error("Reservation failed:", error);
    return NextResponse.json({ error: "Failed to create reservation." }, { status: 500 });
  }
}

// PUT expects to update an existing reservation using the secret code
export async function PUT(request) {
  try {
    const { pickupCode } = await request.json();
    await dbConnect();

    // 1. Find a reservation that matches the code AND is still pending
    const reservation = await Reservation.findOne({ 
      pickupCode: pickupCode,
      status: 'Pending'
    });

    if (!reservation) {
      return NextResponse.json({ error: "Invalid code or already picked up." }, { status: 400 });
    }

    // 2. Mark it as completed and save!
    reservation.status = 'Completed';
    await reservation.save();

    return NextResponse.json({ 
      message: "Order verified! Hand over the food.", 
      data: reservation 
    }, { status: 200 });

  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json({ error: "Failed to verify code." }, { status: 500 });
  }
}