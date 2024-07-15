import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { incrementApiLimit,checkApiLimit } from '@/lib/api-limit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const body = await request.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not found", { status: 500 });
        }

        if (!messages || messages.length === 0) {
            return new NextResponse("No messages provided", { status: 400 });
        }
        const freeLimit = await checkApiLimit();
        if(!freeLimit) {
            return new NextResponse("You have reached the maximum number of free requests. Please upgrade your plan to continue using the service.", { status: 403 });
        }
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });
        await incrementApiLimit();

        return NextResponse.json(response.choices[0].message);

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
