"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params{
    text: string;
    author: string;
    communityId: string | null;
    path: string
}

export async function createThread({ text, author, communityId, path}: Params){
    
    try {
        connectToDB();
    
        const createdThread = await Thread.create({
            text,
            author,
            community: null
        });
    
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id}
        })
    
        revalidatePath(path);
        
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`);
    }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipData = (pageNumber - 1) * pageSize;
  //fetch the posts that have no parents
  const threadsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipData)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    })
    const totalThreadsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipData + threads.length;
    return { threads, isNext };
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name image parentId",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name image parentId",
            },
          },
        ],
      }).exec();
      return thread 
  } catch (error) {
    throw new Error("Error fetching thread");
  }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string){
  connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if(!originalThread){
      throw new Error("Thread not found");
    }

    const commentThread = await Thread.create({
      text: commentText,
      author: userId,
      parentId: threadId
    })

    originalThread.children.push(commentThread._id)
    await originalThread.save();
    revalidatePath(path)
    
  } catch (error:any) {
    throw new Error(`Error adding comment to thread ${error.message}`);
  }
}