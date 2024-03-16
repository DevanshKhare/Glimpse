import * as z from 'zod';
export const ThreadsValidation  = z.object({
    thread: z.string().nonempty().min(3, {message: 'Minimum 3 characters'}),
    accountId: z.string(),
    media: z.string().url().nonempty().optional()
})

export const CommentValidation = z.object({
    threads: z.string().nonempty().min(3, {message: 'Minimum 3 characters'})
})