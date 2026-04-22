import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import FoodItem from '../../../models/FoodItem';

// POST means we are EXPECTING data to be sent to us
export async function POST(request) {
  try {
    // 1. Catch the data the frontend threw at us
    const body = await request.json(); 
    
    // 2. Wake up the database connection
    await dbConnect();

    // 3. Use the Model blueprint to save the data securely
    const newFood = await FoodItem.create(body);

    // 4. Send a success receipt back to the frontend
    return NextResponse.json({ message: "Food saved successfully!", data: newFood }, { status: 201 });
    
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save food to database." }, { status: 500 });
  }
}

// GET means we are EXPECTING to send data OUT to the browser
export async function GET() {
  try {
    await dbConnect();
    const foods = await FoodItem.find({}).lean(); 
    const now = new Date();

    // THE ALGORITHM: Map through the food and calculate dynamic prices
    const dynamicFoods = foods.map(item => {
      
     
      // If it's an old item missing the field, default to 4 hours after it was created.
      const expiry = item.expiryTime 
        ? new Date(item.expiryTime) 
        : new Date(new Date(item.createdAt).getTime() + (4 * 60 * 60 * 1000));
      
      const hoursLeft = (expiry - now) / (1000 * 60 * 60);
      
      let finalPrice = item.discountedPrice;
      let isSurgeDiscounted = false;

      // The Dynamic Pricing Logic
      if (hoursLeft > 0 && hoursLeft <= 1) {
        // Less than 1 hour left! 50% off the already discounted price!
        finalPrice = Math.floor(item.discountedPrice * 0.5);
        isSurgeDiscounted = true;
      } else if (hoursLeft > 1 && hoursLeft <= 2) {
        // Less than 2 hours left! 20% off!
        finalPrice = Math.floor(item.discountedPrice * 0.8);
        isSurgeDiscounted = true;
      }

      return {
        ...item,
        dynamicPrice: finalPrice,
        isSurgeDiscounted,
        hoursLeft: Math.max(0, hoursLeft).toFixed(1)
      };
    });
    
    // Push sold-out items to the bottom of the array
    dynamicFoods.sort((a, b) => {
      if (a.quantity > 0 && b.quantity <= 0) return -1; 
      if (a.quantity <= 0 && b.quantity > 0) return 1;  
      return 0; 
    });

    return NextResponse.json({ data: dynamicFoods }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load food." }, { status: 500 });
  }
}

// DELETE means we are EXPECTING to destroy data
export async function DELETE(request) {
  try {
    // 1. Get the ID of the food item from the URL (e.g., /api/food?id=123)
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // 2. Wake up the database
    await dbConnect();

    // 3. Tell MongoDB to find this specific item and delete it
    await FoodItem.findByIdAndDelete(id);

    return NextResponse.json({ message: "Food item deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Failed to delete food:", error);
    return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
  }
}

// PUT means we are EXPECTING to update existing data
export async function PUT(request) {
  try {
    // 1. Grab the ID from the URL (e.g., /api/food?id=123)
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    // 2. Catch the updated data the frontend sent us
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    await dbConnect();

    // 3. Find the item by its ID, and overwrite it with the new data
    const updatedFood = await FoodItem.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ message: "Food updated successfully", data: updatedFood }, { status: 200 });

  } catch (error) {
    console.error("Failed to update food:", error);
    return NextResponse.json({ error: "Failed to update item." }, { status: 500 });
  }
}