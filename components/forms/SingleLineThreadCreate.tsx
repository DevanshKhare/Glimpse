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

function SingleLineThreadCreate({
  userId,
  userInfo,
  user
}: {
  userId: string;
  userInfo: any;
  user: User
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadsValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
      media: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadsValidation>) => {

    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
      media: "",
    });
    form.reset();
  };
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-0 mb-6"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="w-full flex items-center justify-between rounded-[2rem] py-[0.4rem] px-[1rem] bg-dark-3">
              <FormLabel className="w-[2.7rem] aspect-square rounded-full overflow-hidden">
                <Image
                  src={userInfo?.image || user?.imageUrl}
                  alt="userImage"
                  width={0}
                  height={0}
                  quality={100}
                  unoptimized
                  className="w-[2.7rem] aspect-square rounded-full overflow-hidden"
                />
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder={`What's on you mind, ${user?.firstName}`} className="no-focus border-none justify-self-start w-full pl-[1rem] bg-transparent mr-[1rem] text-light-4 outline-none marginresety"/>
              </FormControl>
              <Button type="submit" className="bg-primary-500 rounded-[2rem] py-[0.6rem] px-[2rem] marginresety">
                Post
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
export default SingleLineThreadCreate;
