import { checkApiLimit, incrementApiLimit } from '@/lib/api-limit';
import { amountOptions } from './../../(dashboard)/(routes)/image/constants';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parse } from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const body = await request.json();
        const { prompt,amount=1,resolution="512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not found", { status: 500 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is required", { status: 400 });
        }
        const freeLimit = await checkApiLimit();
        if(!freeLimit) {
            return new NextResponse("You have reached the maximum number of free requests. Please upgrade your plan to continue using the service.", { status: 403 });
        }
        const response = await openai.images.generate({
            prompt,
            n: parseInt(amount,10),
            size: resolution
        })
        await incrementApiLimit();

        return NextResponse.json(response.data);

    } catch (error) {
        console.log("IMAGE ERROR");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
