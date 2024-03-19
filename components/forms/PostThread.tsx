"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import AWS from "aws-sdk";
// import { updateUser } from "@/lib/actions/user.actions";
import { ThreadsValidation } from "@/lib/validations/threads";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import { uploadImage } from "@/lib/s3client";

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(ThreadsValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      media: "",
    },
  });
  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const onSubmit = async (values: z.infer<typeof ThreadsValidation>) => {
    console.log(values)

    let location;
    if (selectedFile) {
      location = await uploadImage(selectedFile, values, "thread");
    }
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
      media: location || "",
    });
    router.push("/");
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event?.target?.result?.toString() || "";
        setPreviewUrl(imageDataUrl);
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Share your thoughts
              </FormLabel>
              {selectedFile && previewUrl && (
                <Image
                  src={previewUrl || ""}
                  alt="media"
                  className="h-[20rem] w-[20rem] object-contain"
                  width={0}
                  height={0}
                  quality={100}
                  unoptimized
                  decoding="async"
                  loading="lazy"
                  style={{ imageRendering: "optimizeQuality" }}
                />
              )}
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={8} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem className="flex items-start justify-end gap-4">
              <FormLabel>
                <Image
                  src="/assets/create.svg"
                  alt="profile photo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post Thread
        </Button>
      </form>
    </Form>
  );
}
export default PostThread;
