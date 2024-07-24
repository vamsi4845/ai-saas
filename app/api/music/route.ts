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
        const { prompt } = await request.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt required", { status: 400 });
        }

        const freeLimit = await checkApiLimit();
        if (!freeLimit) {
            return new NextResponse("You have reached the maximum number of free requests. Please upgrade your plan to continue using the service.", { status: 403 });
        }

        const output = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt,
                }
            }
        );

        await incrementApiLimit();

        return NextResponse.json(output);

    } catch (error) {
        console.error("MUSIC ERROR:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
