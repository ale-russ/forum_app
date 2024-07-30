import React, { useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import {
  addComment,
  createPost,
  fetchPosts,
} from "../controllers/ForumController";
import { UserAuthContext } from "../utils/UserAuthenticationProvider";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const { token } = useContext(UserAuthContext);

  useEffect(() => {
    fetchPosts().then((response) => {
      setThreads(response.data);
    });
  }, []);

  const handleCreatePost = async () => {
    await createPost(newPost, token).then((response) => {
      console.log("Response: ", response);
      setThreads([...newPost, response.data]);
      setNewPost({ title: "", content: "" });
    });
  };
  return (
    <>
      <Nav />
      <main className="home">
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

        <div>
          <h2>Threads</h2>
          {threads.map((post) => {
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div>
                <h4>Comments</h4>
                {postsRoute.comments.map((comment) => (
                  <p key={comment._id}>{comment.content}</p>
                ))}
                <input
                  type="text"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addComment(
                        post._id,
                        { content: e.target.value },
                        token
                      ).then((response) => {
                        setThreads(
                          threads.map((p) =>
                            p._id === post._id
                              ? {
                                  ...p,
                                  comment: [...p.comments, response.data],
                                }
                              : p
                          )
                        );
                      });
                    }
                  }}
                />
              </div>
            </div>;
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
