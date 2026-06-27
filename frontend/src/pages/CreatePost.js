import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const createPost = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    formData.append("userId", user.id);

    try {
      const res = await axios.post(
        " https://instagram-clone-eid7.onrender.com/api/posts/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log(res.data);
      alert("Post created successfully!");
      setCaption("");
      setFile(null);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to create post");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Post</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <br /><br />

      <button onClick={createPost}>Upload Post</button>
    </div>
  );
}

export default CreatePost;
