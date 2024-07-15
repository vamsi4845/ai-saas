"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "@/components/ui/progress";

const Counter = ({ apiLimit}: {apiLimit: number}) => {
    const[mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if(!mounted) return null;
  return (
    <div className="px-3">
        <Card className=" bg-white/10 border-0" >
        <CardContent className="py-6">
                <div className="text-center text-sm text-white mb-4 space-y-2">
                    <p>{apiLimit}/{MAX_FREE_COUNTS} Free Requests</p>
                    <Progress className="h-3" 
                    value={(apiLimit/MAX_FREE_COUNTS)*100}
                       />
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
export default Counter