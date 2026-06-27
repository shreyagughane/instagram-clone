import { useEffect, useState, useCallback } from "react";
import axios from "axios";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // modal + like/comment state
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // ✅ FIXED: fetchUserPosts (no duplicate + proper hook usage)
  const fetchUserPosts = useCallback(async () => {
    try {
      if (!user?.id) return;

      const res = await axios.get(
        `https://instagram-clone-eid7.onrender.com/api/posts/user/${user.id}`
      );

      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [user?.id]);

  // run on load
  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // FOLLOW
  const handleFollow = async () => {
    try {
      await axios.put(
        `https://instagram-clone-eid7.onrender.com/api/users/follow/${user.id}`,
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.log(err);
    }
  };

  // OPEN POST MODAL
  const openPost = (post) => {
    setSelectedPost(post);
    setLikes(post.likes?.length || 0);
    setComments(post.comments || []);
    setLiked(false);
  };

  // LIKE (frontend only toggle)
  const handleLike = async () => {
  try {
    await axios.put(
      `https://instagram-clone-eid7.onrender.com/api/posts/like/${selectedPost._id}`,
      { userId: user.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  } catch (err) {
    console.log(err);
  }
};
  // COMMENT (frontend only)
 const handleComment = async () => {
  if (!commentText.trim()) return;

  try {
    const res = await axios.put(
      `https://instagram-clone-eid7.onrender.com/api/posts/comment/${selectedPost._id}`,
      {
        userId: user.id,
        text: commentText,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setComments(res.data.comments); // backend updated comments
    setCommentText("");
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div style={{ maxWidth: "950px", margin: "30px auto", padding: "20px" }}>

      {/* PROFILE HEADER */}
      <div style={{ display: "flex", gap: "40px", alignItems: "center", marginBottom: "40px" }}>
        
        <img
          src="https://i.pravatar.cc/180"
          alt="profile"
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div>

          {/* USERNAME + BUTTONS */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h2 style={{ margin: 0 }}>{user?.username}</h2>

            <button
              style={{
                padding: "6px 14px",
                border: "1px solid #dbdbdb",
                background: "#fafafa",
                borderRadius: "6px",
              }}
            >
              Edit Profile
            </button>

            <button
              onClick={handleFollow}
              style={{
                padding: "6px 14px",
                border: "none",
                background: "#0095f6",
                color: "white",
                borderRadius: "6px",
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* STATS */}
          <div style={{ display: "flex", gap: "25px", marginTop: "15px" }}>
            <p><b>{posts.length}</b> posts</p>
            <p><b>120</b> followers</p>
            <p><b>180</b> following</p>
          </div>

          {/* BIO */}
          <div style={{ marginTop: "10px" }}>
            <b>{user?.username}</b>
            <p style={{ color: "#555" }}>Instagram Clone User 🚀</p>
          </div>

        </div>
      </div>

      <hr />

      {/* TABS */}
      <div className="tabs">
        <button className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
          Posts
        </button>

        <button className={activeTab === "reels" ? "active" : ""} onClick={() => setActiveTab("reels")}>
          Reels
        </button>

        <button className={activeTab === "tagged" ? "active" : ""} onClick={() => setActiveTab("tagged")}>
          Tagged
        </button>
      </div>

      {/* POSTS */}
      <div className="tab-content">
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <img
                  key={post._id}
                  src={`https://instagram-clone-eid7.onrender.com${post.image}`}
                  alt="post"
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => openPost(post)}
                />
              ))
            ) : (
              <p>No posts yet</p>
            )}
          </div>
        )}

        {activeTab === "reels" && <p>No reels yet 🎬</p>}
        {activeTab === "tagged" && <p>No tagged posts yet 🏷️</p>}
      </div>

      {/* MODAL */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              width: "400px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <img
              src={`https://instagram-clone-eid7.onrender.com${selectedPost.image}`}
              alt="post"
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "10px" }}>
              
              {/* LIKE */}
              <button onClick={handleLike}>
                {liked ? "❤️ Liked" : "🤍 Like"}
              </button>

              <span style={{ marginLeft: "10px" }}>{likes} likes</span>

              {/* COMMENTS */}
              <div style={{ marginTop: "10px", maxHeight: "120px", overflowY: "auto" }}>
                {comments.map((c, i) => (
                  <p key={i}>
                    <b>{c.user}:</b> {c.text}
                  </p>
                ))}
              </div>

              {/* INPUT */}
              <div style={{ display: "flex", marginTop: "10px" }}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  style={{ flex: 1, padding: "5px" }}
                />
                <button onClick={handleComment}>Post</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;