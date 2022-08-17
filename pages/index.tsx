import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Story } from "../convex/common";
import { useMutation, useQuery } from "../convex/_generated/react";

const Home: NextPage = () => {
  const stories = useQuery("getStories");
  const addNewsStory = useMutation("addNewsStory");

  const submitStory = (_event: Event) => {
    const authorEl = document.querySelector("#author")! as HTMLInputElement;
    const bodyEl = document.querySelector("#body")! as HTMLTextAreaElement;
    const story: Story = {
      author: authorEl.value,
      body: bodyEl.value,
    };
    bodyEl.value = "";
    addNewsStory(story);
  };
  if (stories === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-8 mx-14 flex flex-col">
      <div className="text-6xl">The Scary Times 👻</div>
      <div className="flex flex-row">
        <div className="flex flex-col basis-2/3 p-10">
          <div className="rounded bg-yellow-100 p-4 font-bold mb-8">
            Showing {stories.length} stories.
          </div>
          {stories?.map((story, i) => (
            <StoryItem key={i} story={story} />
          ))}
        </div>
        <div className="flex flex-col basis-1/3 mt-10">
          <p className="font-bold mb-3">Post a new story:</p>
          <div className="mb-4">
            <input
              className="border-2 bg-slate-100 p-2 rounded"
              type="text"
              id="author"
              placeholder="Author..."
            />
          </div>
          <div className="mb-4">
            <textarea
              className="border-2 bg-slate-100 p-2 rounded"
              id="body"
              placeholder="Story text..."
              rows={10}
              cols={30}
            ></textarea>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={submitStory}
            >
              Create story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryItem = (props: { story: Story }) => {
  const story = props.story;
  return (
    <div>
      <div className="bg-blue-200 rounded p-2">
        {new Date(story._creationTime!).toLocaleString()} Author: {story.author}
      </div>
      <div className="p-4 mb-6">{story.body}</div>
    </div>
  );
};

export default Home;
