# Convex Buffered State

Simple project using React, Next.js, TailwindCSS, and Convex. Simple full-stack
app that is a news feed of "scary stories" ala twitter.

Has one twist: contains a `useBufferedState` hook that demonstrates a way
to delay reactive updates until the user is ready.

## Running

**1. Install all dependencies**

    $ npm i

**2. Set up your Convex deployment**

    $ npx convex login # Create convex account
    $ npx convex init # Create new convex project / deployment
    $ npx convex push # Push the functions in the convex/ directory to your deployment

**3. Run the application**

    $ npm run dev

**4. Use it!**

Browse to http://localhost:3000/ and make some _super scary_ stories!
Observe how the buffered state abstraction is used to delay reflowing the
story list until the readers are ready.