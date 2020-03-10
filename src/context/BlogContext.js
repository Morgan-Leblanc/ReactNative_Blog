import createDataContext from "./createDataContext";
import jsonserver from "../api/jsonserver";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      return action.payload;
    case "edit_blogpost":
      return state.map(blogPost => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });
    // case "add_blogpost":
    //   return [
    //     ...state,
    //     {
    //       id: Math.floor(Math.random() * 9999),
    //       title: action.payload.title,
    //       content: action.payload.content
    //     }
    //   ];
    case "delete_blogpost":
      return state.filter(blogPost => blogPost.id !== action.payload);
    default:
      return state;
  }
};

const deleteBlogPost = dispatch => {
  return async id => {
    await jsonserver.delete(`/blogposts/${id}`);
    dispatch({ type: "delete_blogpost", payload: id });
  };
  // return id => {
  // dispatch({ type: "delete_blogpost", payload: id });
  // };
};

const getBlogPost = dispatch => {
  return async () => {
    const response = await jsonserver.get("/blogposts");
    dispatch({ type: "get_blogposts", payload: response.data });
  };
};
const addBlogPost = dispatch => {
  return async (title, content, callback) => {
    await jsonserver.post("/blogposts", { title, content });
    // dispatch({ type: "add_blogpost", payload: { title, content } });
    if (callback) {
      callback();
    }
  };
};

const editBlogPost = dispatch => {
  return async (id, title, content, callback) => {
    await jsonserver.put(`/blogposts/${id}`), {title, content};
    dispatch({
      type: "edit_blogpost",
      payload: { id, title, content }
    });
    if (callback) {
      callback();
    }
  };

  // return (id, title, content, callback) => {
    // dispatch({
    //   type: "edit_blogpost",
    //   payload: { id, title, content }
    // });
  // if (callback) {
  //   callback();
  // }
  // };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  {
    addBlogPost,
    deleteBlogPost,
    editBlogPost,
    getBlogPost
  },
  []
);
