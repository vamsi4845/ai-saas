import { auth } from "@clerk/nextjs/server";
import prisma from "./prismadb";
import { MAX_FREE_COUNTS } from "../constants";

export const incrementApiLimit = async () => {
    const {userId} = auth();
    if(!userId) return;
    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId
        }
    });

    if (userApiLimit) {
        await prisma.userApiLimit.update({
            where: {
                userId
            },
            data: {
                count: userApiLimit.count + 1
            }
        });
    } else {
        await prisma.userApiLimit.create({
            data: {
                userId,
                count: 1
            }
        });
    }
};

export const checkApiLimit = async () => {
    const {userId} = auth();
    if(!userId) return;
    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId
        }
    });
    if(!userApiLimit || userApiLimit.count <= MAX_FREE_COUNTS) return true;
    else return false;
};

export const getApiLimit =async()=>{
    const {userId} = auth();
    if(!userId) return 0;
    const userApiLimit = await prisma.userApiLimit.findUnique({
        where: {
            userId
        }
    });
    return userApiLimit?.count || 0;
}