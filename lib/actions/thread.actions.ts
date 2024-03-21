"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface Params{
    text: string;
    author: string;
    communityId: string | null;
    path: string,
    media: string
}

export async function createThread({ text, author, communityId, path, media }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );
        
    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject ? communityIdObject : null, // Assign communityId if provided, or leave it null for personal account
      media: media
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchThreads(skip=0, pageSize = 4) {
  connectToDB();

  //fetch the posts that have no parents
  const threadsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skip)
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
    .populate({
      path: "community",
      model: Community,
    })
    const threads = await threadsQuery.exec();
    return { threads: JSON.parse(JSON.stringify(threads)) };
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
      return JSON.parse(JSON.stringify(thread)) 
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

export async function likeUnlikeThread(threadId: string, userId: string, liked: boolean, pathname: string) {
  try {
    connectToDB();
    if (liked) {
      await Thread.findOneAndUpdate(
        { _id: threadId },
        { $pull: { likes: userId } }
      );
    } else {
      await Thread.findOneAndUpdate(
        { _id: threadId },
        { $push: { likes: userId } }
      );
    }
    revalidatePath(pathname);
  } catch (error) {
    console.log("error", error);
  }
}

async function generateIds(threadId: string, threadsToBeDeleted: any){
  const responseObject = {
    finalThreadsToBeDeleted: [],
    threadToUnlinkFromUser: "",
  }
  const originalThread = await Thread.findById(threadId);
  if (originalThread.children.length > 0) {
    await Promise.all(originalThread.children.map(async (child: any) => {
      threadsToBeDeleted.push(child._id.toString());
      await generateIds(child._id, threadsToBeDeleted);
    }));
  }
  responseObject.finalThreadsToBeDeleted = threadsToBeDeleted;
  if(!originalThread?.parentId){
    responseObject.threadToUnlinkFromUser = threadId
  }

  return responseObject;
}

export async function deleteThread(threadId: string, path: string) {
  try {
    connectToDB();
    let threadsToBeDeleted: any = [];
    threadsToBeDeleted.push(threadId);
    const {finalThreadsToBeDeleted, threadToUnlinkFromUser } = await generateIds(threadId, threadsToBeDeleted);
    await Thread.deleteMany({_id: {$in: finalThreadsToBeDeleted}});
    if(threadToUnlinkFromUser.length > 0) {
      await User.updateMany({}, {$pull: { threads: threadToUnlinkFromUser}})
      await Community.updateMany({}, {$pull: { threads: threadToUnlinkFromUser}})

    }
    revalidatePath(path);
  } catch (error) {
  }
}

export async function getFirstLikedUserDetails(userId: string){
  try {
    connectToDB();
    let user = await User.findOne({id: userId}).select("name")
    return user;
  } catch (error) {
    console.log("error finding fist user liked")
  }
}

