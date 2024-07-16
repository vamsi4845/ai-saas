// 
import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const body = await request.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt required", { status: 400 });
    }

    const freeLimit = await checkApiLimit();
    console.log(freeLimit);
    if(!freeLimit) {
      return new NextResponse("You have reached the maximum number of free requests. Please upgrade your plan to continue using the service.", { status: 403 });
    }

    const response = await replicate.run("anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      { input: { prompt } }
    );

    console.log(response);
    await incrementApiLimit();
    return NextResponse.json(response);

  } catch (error) {
    console.log("VIDEO ERROR");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}