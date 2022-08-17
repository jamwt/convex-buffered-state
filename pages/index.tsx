import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { buffer } from "stream/consumers";
import { Story } from "../convex/common";
import { useMutation, useQuery } from "../convex/_generated/react";

function useBufferedState<T, D>(
  upstream: T | null,
  differ: (oldVal: T | null, newVal: T) => D
): {
  currentVal: T | null;
  diff: D | null;
  sync: () => void;
} {
  const [currentVal, setCurrentVal] = useState(upstream);
  var upstreamRef = useRef(upstream);
  upstreamRef.current = upstream;
  const doSync = () => {
    console.log("sync!");
    setCurrentVal(upstreamRef.current);
  };

  return {
    currentVal,
    diff: upstream ? differ(currentVal, upstream) : null,
    sync: doSync,
  };
}

const Home: NextPage = () => {
  const serverStories = useQuery("getStories") ?? null;
  const storyDiffer = (oldVal: Story[] | null, newVal: Story[]) => {
    return newVal.length - (oldVal?.length ?? 0);
  };
  const buffered = useBufferedState<Story[], number>(
    serverStories,
    storyDiffer
  );
  const stories = buffered.currentVal;
  const diff = buffered.diff;
  const doSync = () => {
    console.log("Sync requested");
    buffered.sync();
  };
  const addNewsStory = useMutation("addNewsStory");

  const submitStory = (_event: any) => {
    const authorEl = document.querySelector("#author")! as HTMLInputElement;
    const bodyEl = document.querySelector("#body")! as HTMLTextAreaElement;
    const story: Story = {
      author: authorEl.value,
      body: bodyEl.value,
    };
    bodyEl.value = "";
    addNewsStory(story);
  };

  if (diff) {
    var diffEl = (
      <span
        className="p-1 text-blue-600 cursor-pointer"
        onClick={() => doSync()}
      >
        (Click to load {diff} new stories...)
      </span>
    );
  } else {
    var diffEl = <></>;
  }
  if (stories === null && diff === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-8 mx-14 flex flex-col">
      <div className="text-6xl">The Scary Times 👻</div>
      <div className="flex flex-row">
        <div className="flex flex-col basis-2/3 p-10">
          <div className="rounded bg-yellow-100 p-4 font-bold mb-8">
            Showing {stories?.length ?? 0} stories.
            {diffEl}
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
