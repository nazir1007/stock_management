import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query")
   
// Replace the uri string with your connection string.
const uri = "mongodb+srv://stock-management:mZEpRx5qmNWq7kIf@cluster1.dwtcj23.mongodb.net/";

const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Query for a movie that has the title 'Back to the Future'
    //const query = { };

    const products = await inventory.aggregate([{
        $match: {
            $or: [
                {slug: {$regex: query, $options: "i"}},
                // {quantity: {$regex: "your_query_string", $options: "i"}},
                // {price: {$regex: "your_query_string", $options: "i"}},

            ]
        }

    }]).toArray()
    //await inventory.find(query).toArray();
    return NextResponse.json({success: true, products})

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



