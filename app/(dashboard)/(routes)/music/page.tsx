"use client";

import * as z from "zod";
import Heading from "@/components/Heading";
import axios from "axios";
import { MusicIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index";
import { Empty } from "@/components/Empty";
import { Loader } from "@/components/Loader";

const MusicPage = () => {
  const router = useRouter();
  const[music, setMusic] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      setMusic("");
      const response = await axios.post("/api/music", values);
      setMusic(response.data.audio);
      console.log(response);
      form.reset();

    }catch(error){
      console.log(error);
    } finally{
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Music"
        description="Turn your prompt into music"
        icon={MusicIcon}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        disabled={isLoading}
                        placeholder="Piano solo"
                        className="border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
                type="submit"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader/>
            </div>
          )}
          {!music &&  !isLoading && (
            <div className="text-center">
            <Empty label="No Music Generated"/>
            </div>
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} type="audio/mpeg" />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};
export default MusicPage;
