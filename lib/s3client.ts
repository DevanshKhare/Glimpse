import AWS from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { UserValidation } from "./validations/user";
import * as z from "zod";

const S3_BUCKET = process.env.NEXT_PUBLIC_BUCKET_NAME;
const REGION = process.env.NEXT_PUBLIC_BUCKET_REGION;

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});
export const uploadImage = async (
  selectedFile: File,
  // values: z.infer<typeof UserValidation>
  values: any,
  type?: string
) => {
  try {
    let key: string;
    let contentType: string;
    if (type == "thread") {
      const { media, thread } = values;
      contentType = media.split(";")[0].split("/")[1];
      key = `${thread.split(" ")[0]}_media_${new Date().getTime()}`;
    } else {
      const { username, profile_photo } = values;
      contentType = profile_photo.split(";")[0].split("/")[1];
      key = `${username}_profile_photo_${new Date().getTime()}`;
    }
    const params: PutObjectRequest = {
      Body: selectedFile || "",
      Bucket: S3_BUCKET || "",
      Key: key,
      ContentType: contentType,
    };
    const data = await myBucket.upload(params).promise();
    return data?.Location;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
