import React, { useContext, useEffect, useState } from "react";

import Nav from "../components/Nav";
import {
  addComment,
  createPost,
  fetchPosts,
} from "../controllers/ForumController";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";
import Loader from "../components/common/Loader";
import { postsRoute } from "../utils/ApiRoutes";
import NavBar from "../components/NavBar";
import LeftSideBar from "../components/LeftSideBar";
import CenterSide from "../components/CenterSide";
import { useForum } from "../utils/PostContext";

const Home = () => {
  // const [loading, setLoading] = useState(false);
  // const [loadingComment, setLoadingComment] = useState(false);
  // const [threads, setThreads] = useState([]);
  // const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { token } = useContext(UserAuthContext);
  const { loading, handleFetchPosts } = useForum();

  useEffect(() => {
    handleFetchPosts();
  }, []);

  // const handleFetchPosts = async () => {
  //   await fetchPosts().then((response) => {
  //     console.log("RESponse: ", response);
  //     if (response && response.data) {
  //       setThreads(response.data);
  //     } else {
  //       return "No Data found";
  //     }
  //   });
  // };

  // const handleCreatePost = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await createPost(newPost, token);
  //     // console.log("RESPONSE: ", response);
  //     setThreads([...threads, response.data.data]);
  //   } finally {
  //     setNewPost({ title: "", content: "" });
  //     setLoading(false);
  //   }
  // };

  // function handleAddComment(post, e, token, setThreads, threads) {
  //   e.preventDefault();
  //   setLoadingComment(true);
  //   try {
  //     addComment(post._id, { content: e.target.value }, token).then(
  //       (response) => {
  //         setThreads(
  //           threads.map((p) =>
  //             p._id === post._id
  //               ? {
  //                   ...p,
  //                   comment: [...p.comments, response.data],
  //                 }
  //               : p
  //           )
  //         );
  //       }
  //     );
  //   } finally {
  //     setLoadingComment(false);
  //     e.target.value = "";
  //   }
  // }

  return (
    <div className="dark">
      <NavBar />
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-col sm:flex-row lg:flex-row md:flex-row xl:flex-row px-4 h-full w-full">
          <LeftSideBar />
          <CenterSide />
          {/* <section className="">
            <h2 className="homeTitle">Create a Thread</h2>
            <form className="homeForm" onSubmit={handleCreatePost}>
              <div className="home__container">
                <label htmlFor="thread">Title / Description</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
                <textarea
                  type="text"
                  name="thread"
                  placeholder="Write your thread here"
                  required
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                />
              </div>
              <button className="homeBtn">CREATE THREAD</button>
            </form>

            <div className="w-[70%]  ">
              <h2>Threads</h2>
              {threads?.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col w-[100%] px-8 py-4 shadow-lg border-spacing-1 border-2  mt-4"
                >
                  <h3 className="font-bold">{post.title}</h3>
                  <div className="">
                    <p className="">{post.content}</p>
                  </div>

                  <div>
                    <h4>Comments</h4>
                    {postsRoute.comments?.map((comment) => (
                      <p key={comment._id}>{comment.content}</p>
                    ))}
                    {loadingComment ? (
                      <Loader />
                    ) : (
                      <input
                        type="text"
                        placeholder="Add a comment"
                        onKeyDown={(e) => {
                          console.log("Event: ", e.key);
                          if (e.key === "Enter") {
                            handleAddComment(
                              post,
                              e,
                              token,
                              setThreads,
                              threads
                            );
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </main>
      )}
    </div>
  );
};

export default Home;