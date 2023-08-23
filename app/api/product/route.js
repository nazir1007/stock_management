import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
const uri = "mongodb+srv://stock-management:mZEpRx5qmNWq7kIf@cluster1.dwtcj23.mongodb.net/";
const client = new MongoClient(uri);
const database = client.db('stock');
const inventory = database.collection('inventory');
export async function GET(request) {
  try {
    const query = { };
    const products = await inventory.find(query).toArray();
    return NextResponse.json({success: true, products})
  } finally {
    await client.close();
  }
}
export async function POST(request) {
     let body = await request.json()
      try {
        const product = await inventory.insertOne(body);
        return NextResponse.json({product, ok: true})
      } finally {
        await client.close();
      }
    }
