import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import FoodItem from '../../../../models/FoodItem';

export async function POST(request) {
  try {
    await dbConnect();
    const { itemIds, charityName } = await request.json(); 

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json({ error: "No items selected" }, { status: 400 });
    }

    const result = await FoodItem.updateMany(
      { _id: { $in: itemIds } },
      { $set: { quantity: 0, claimedBy: charityName } }
    );

    return NextResponse.json({ 
      message: `Successfully claimed ${result.modifiedCount} bulk items!`,
    }, { status: 200 });

  } catch (error) {
    console.error("Bulk claim error:", error);
    return NextResponse.json({ error: "Failed to process bulk claim" }, { status: 500 });
  }
}