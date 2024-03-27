# Threads Clone

Threads Clone is a web application built using Next.js, Tailwind CSS, and MongoDB. It provides a platform for users to create and interact with threads/posts, including features like posting, liking, unliking, bookmarking, commenting, following, and unfollowing.

## Features

- **Posting Threads/Posts**: Users can create and publish threads or posts.
- **Like/Unlike**: Users can like or unlike threads or posts.
- **Bookmarking**: Users can bookmark threads or posts for later reference.
- **Commenting**: Users can comment on threads or posts.
- **Follow/Unfollow**: Users can follow or unfollow other users to stay updated on their activity.

## Environment Variables

To run the application locally or deploy it, you need to set up the following environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk Publishable Key for authentication.
- `CLERK_SECRET_KEY`: Clerk Secret Key for authentication.
- `NEXT_CLERK_WEBHOOK_SECRET`: Webhook secret for Clerk integration.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: URL for signing in.
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: URL for signing up.
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`: URL to redirect after signing in.
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`: URL to redirect after signing up.
- `MONGODB_URL`: MongoDB connection URL.
- `NEXT_PUBLIC_BUCKET_NAME`: Name of the AWS S3 bucket.
- `NEXT_PUBLIC_BUCKET_REGION`: Region of the AWS S3 bucket.
- `NEXT_PUBLIC_AWS_S3_ACCESS_ID`: Access ID for AWS S3.
- `NEXT_PUBLIC_AWS_S3_ACCESS_KEY`: Access key for AWS S3.

## Getting Started

Follow these steps to set up the application locally:

1. Clone the repository: `git clone https://github.com/yourusername/threads-clone.git`
2. Navigate to the project directory: `cd threads-clone`
3. Install dependencies: `npm install` or `yarn install`
4. Set up environment variables by creating a `.env.local` file in the root directory and adding the required variables.
5. Start the development server: `npm run dev` or `yarn dev`
6. Open your browser and go to `http://localhost:3000` to view the application.

## Deployment

To deploy the application, follow these steps:

1. Build the application: `npm run build` or `yarn build`
2. Start the production server: `npm start` or `yarn start`

Make sure to set up the environment variables in your deployment environment as well.

## Contributing

Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests.

