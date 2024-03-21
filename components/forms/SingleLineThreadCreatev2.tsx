"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { ThreadsValidation } from "@/lib/validations/threads";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { User } from "@clerk/nextjs/server";
import { ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import { GrAttachment } from "react-icons/gr";
import { uploadImage } from "@/lib/s3client";

function SingleLineThreadCreatev2({
  userId,
  userInfo,
  user,
}: {
  userId: string;
  userInfo: any;
  user: User;
}) {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(ThreadsValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      media: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadsValidation>) => {
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
    setOpen(false)
    setPreviewUrl("")
    form.reset();
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="w-full flex items-center justify-between rounded-[2rem] py-[0.4rem] px-[1rem] bg-dark-3 mt-0 mb-6">
          <div className="w-[2.7rem] aspect-square rounded-full overflow-hidden">
            <Image
              src={userInfo?.image || user?.imageUrl}
              alt="userImage"
              width={0}
              height={0}
              quality={100}
              unoptimized
              className="w-[2.7rem] aspect-square rounded-full overflow-hidden"
            />
          </div>
          <DialogTrigger asChild>
            <p className="text-gray-1 w-full pl-4 cursor-pointer">
              What's on you mind
            </p>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[500px] min-h-[600px] bg-dark-2 border-none text-light-2 flex flex-col ">
          <div>
          <DialogHeader className="flex h-max">
            <DialogTitle className="self-center">Create Thread</DialogTitle>
            <hr />
            <DialogDescription className="flex flex-row">
              <Image
                src={userInfo?.image || user?.imageUrl}
                alt="userImage"
                width={0}
                height={0}
                quality={100}
                unoptimized
                className="w-[2.7rem] aspect-square rounded-full overflow-hidden"
              />
              <b className="pl-2 text-light-2">{`${user?.firstName} ${user?.lastName}`}</b>
            </DialogDescription>
          </DialogHeader>
            {previewUrl && <div className="  h-[17rem] flex item-center justify-center">
                              <Image
                  src={previewUrl || ""}
                  alt="media"
                  className="h-[100%] w-[100%] object-contain"
                  width={0}
                  height={0}
                  quality={100}
                  unoptimized
                  decoding="async"
                  loading="lazy"
                  style={{ imageRendering: "optimizeQuality" }}
                />
              </div>}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-0 mb-6 ">
              <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={previewUrl ? 1 : 10}
                        placeholder={`What's on you mind, ${user?.firstName}`}
                        className="bg-transparent border-none text-light-2 no-focus min-h-[5rem]"
                        {...field}
                      />
                    </FormControl>
                    <DialogFooter className="absolute bottom-5 w-[88%] flex items-center center mb-4 ml-0 col">
                      <div className="w-full border-gray-200 border-[1px] rounded-[0.5rem] mb-5 p-[1rem] outline-none flex justify-between">
                        <p>Add to you post</p>
                      </div>
                      <Button type="submit" className="bg-primary-500 w-[100%]">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <GrAttachment className="text-[1.4rem] cursor-pointer absolute right-[4rem] bottom-[6rem]" />
                    </FormLabel>
                    <FormControl>
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default SingleLineThreadCreatev2;
