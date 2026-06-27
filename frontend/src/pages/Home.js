
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiHeart,
  FiMessageCircle,
  FiSend,
  FiBookmark
} from "react-icons/fi";

function Home() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showHeart, setShowHeart] = useState(null);
  

  const user = JSON.parse(localStorage.getItem("user")) || "null";
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  // 📥 GET POSTS
  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://instagram-clone-eid7.onrender.com/api/posts");
      console.log("POST DATA:", res.data);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ❤️ LIKE POST
  const handleLike = async (postId) => {
  try {
    await axios.put(
      `https://instagram-clone-eid7.onrender.com/api/posts/like/${postId}`,
      { userId: user._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, likes: [...p.likes, user._id] }
          : p
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  // ❤️ DOUBLE TAP LIKE + ANIMATION
  const handleDoubleTapLike = async (postId) => {
    try {
      await axios.put(
        `https://instagram-clone-eid7.onrender.com/api/posts/like/${postId}`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowHeart(postId);

      setTimeout(() => {
        setShowHeart(null);
      }, 600);

      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 COMMENT
  const handleComment = async (postId) => {
  try {
    const text = comments[postId];

    await axios.put(
      `https://instagram-clone-eid7.onrender.com/api/posts/comment/${postId}`,
      { userId: user._id, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { text, userId: user._id }
              ]
            }
          : p
      )
    );

    setComments((prev) => ({ ...prev, [postId]: "" }));
  } catch (err) {
    console.log(err);
  }
};


  return (
    <div className="container">
      <div className="feed">

        <h2>Instagram</h2>
        <div className="stories">
  <div className="story">
    <img
      className="story-avatar"
      src="https://i.pravatar.cc/60?img=1"
      alt="story"
    />
    <div className="story-name">you</div>
  </div>

  <div className="story">
    <img
      className="story-avatar"
      src="https://i.pravatar.cc/60?img=2"
      alt="story"
    />
    <div className="story-name">alex</div>
  </div>

  <div className="story">
    <img
      className="story-avatar"
      src="https://i.pravatar.cc/60?img=3"
      alt="story"
    />
    <div className="story-name">john</div>
  </div>

  <div className="story">
    <img
      className="story-avatar"
      src="https://i.pravatar.cc/60?img=4"
      alt="story"
    />
    <div className="story-name">emma</div>
  </div>
</div>

        {posts.map((post) => (
          <div className="post" key={post._id}>

            {/* USER */}
            <div
  className="post-header"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}
>
  <img
    src="https://i.pravatar.cc/40"
    alt="profile"
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%"
    }}
  />
  <span>{post.userId?.username}</span>
</div>
            {/* IMAGE WITH DOUBLE TAP */}
            <div
              className="post-image-wrapper"
              onDoubleClick={() => handleDoubleTapLike(post._id)}
            >
              <img
                src={`https://instagram-clone-eid7.onrender.com${post.image}`}
                alt="post"
              />

              {showHeart === post._id && (
                <div className="heart-animation">❤️</div>
              )}
            </div>

            {/* CAPTION */}
            <div style={{ padding: "10px" }}>
              <div
  className="post-actions"
  style={{
    display: "flex",
    justifyContent: "space-between",
    padding: "12px"
  }}
>
  <div style={{ display: "flex", gap: "18px", fontSize: "24px" }}>
    <FiHeart
      style={{ cursor: "pointer" }}
      onClick={() => handleLike(post._id)}
    />

    <FiMessageCircle style={{ cursor: "pointer" }} />

    <FiSend style={{ cursor: "pointer" }} />
  </div>

  <FiBookmark style={{ fontSize: "24px", cursor: "pointer" }} />
</div>
             <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
  {post.likes.length} likes
</p>

<p>
  <b>{post.userId?.username}</b> {post.caption}
</p>

              
              

              {/* COMMENT SECTION */}
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comments[post._id] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [post._id]: e.target.value
                    })
                  }
                />

                <button onClick={() => handleComment(post._id)}>
                  Post
                </button>

                {/* COMMENTS */}
                <div>
                  {post.comments?.map((c, index) => (
                    <p key={index}>💬 {c.text}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
  <h3>Suggestions For You</h3>

  <p>👤 alex</p>
  <p>👤 emma</p>
  <p>👤 john</p>
  <p>👤 sophia</p>
</div>
    </div>
  );
}

export default Home;