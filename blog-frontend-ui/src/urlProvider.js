const urlMap = {
    BLOG_API: process.env.REACT_APP_BLOG_API.toLowerCase() === "auto" ? 'https://blog-api-blog.apps.ik.am' : process.env.REACT_APP_BLOG_API,
    BLOG_UI: process.env.REACT_APP_BLOG_UI.toLowerCase() === "auto" ? `${document.location.protocol}//${document.location.hostname}` : process.env.REACT_APP_BLOG_UI
};
export default urlMap;