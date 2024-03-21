"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
    revalidatePath("/")

  } catch (error: any) {
    // throw new Error(`Failed to create or update user ${error.message}`);
    console.log("Erro", error);
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();
    const user =  await User.findOne({ id: userId });
    return JSON.parse(JSON.stringify(user))
    // .populate({
    //   path: 'communities',
    //   model: Communities
    // })
  } catch (error: any) {
    throw new Error(`Failed to fetch user ${error.message}`);
  }
}

export async function fetchUserThreads(userId: string, skip: number, limit: number){
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      options: {skip: skip, limit: limit, sort: {createdAt: "desc"}},
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
    return JSON.parse(JSON.stringify(threads));
  } catch (error: any) {
    throw new Error("Error fetching the user threads");
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageSize = 20,
  pageNumber = 1,
  sortBy = "desc",
}: {
  userId: string;
  searchString: string;
  pageSize: number;
  pageNumber: number;
  sortBy: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const isNext = totalUsersCount  > skipAmount + users.length;

    return {users: JSON.parse(JSON.stringify(users)), isNext}
  } catch (error) {
    throw new Error("Error completing search query");
  }
}

export async function getActivity(userId: string){
  try {
    connectToDB();

    const userThreads = await Thread.find({
      author: userId
    })

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    },[])

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return JSON.parse(JSON.stringify(replies));

  } catch (error) {
    throw new Error("Error fetching activity");
  }
}

export async function fetchUserImages(userIds: string[]){
  connectToDB();
  try {
    const users = await User.find({ id: { $in: userIds}}).select('image').limit(4)
    const images = users.map(user => user.image);
    return images;
  } catch (error) {
    
  }
}

export async function setBookmark(
  cardId: string,
  userId: string,
  isBookmarked: boolean,
  path: any
) {
  try {
    connectToDB();

    const updateOperation = isBookmarked
      ? { $pull: { bookmarked: cardId } }
      : { $push: { bookmarked: cardId } };

await User.updateOne({ id: userId }, updateOperation);
      revalidatePath(path);
  } catch (error) {}
}

export async function getBookmarked(userId: string){
  try {
    connectToDB();
    const response = await User.findOne({_id: JSON.parse(JSON.stringify(userId))}).select("bookmarked").populate({
      path: "bookmarked",
      model: Thread,
      options: {sort: "desc"},
      populate: {
        path: "author",
        model: User,
        select: "image name"
      }
    })
    return JSON.parse(JSON.stringify(response?.bookmarked))
  }catch (error) {
    console.log(error)
  }
}