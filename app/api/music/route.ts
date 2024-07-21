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
      console.log(prompt);
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }


        if (!prompt) {
            return new NextResponse("Prompt required", { status: 400 });
        }

        const freeLimit = await checkApiLimit();
        if(!freeLimit) {
            return new NextResponse("You have reached the maximum number of free requests. Please upgrade your plan to continue using the service.", { status: 403 });
        }
        const output = await replicate.run(
          "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
          {
            input: {
              top_k: 250,
              top_p: 0,
              prompt:prompt,
              duration: 8,
              temperature: 1,
              continuation: false,
              model_version: "stereo-melody-large",
              output_format: "wav",
              continuation_start: 0,
              multi_band_diffusion: false,
              normalization_strategy: "loudness",
              classifier_free_guidance: 3
            }
          }
        );
        console.log(output);

        return NextResponse.json(output);
        await incrementApiLimit();

    } catch (error) {
        console.log("MUSIC ERROR");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
