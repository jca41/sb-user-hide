function sbIsPoster(postEl, ignoredUsers) {
  return ignoredUsers.includes(postEl.querySelector(".poster h4 a").innerText);
}

function sbIsQuoted(postEl, ignoredUsers) {
  let quoteHeaders = [];
  postEl
    .querySelectorAll(".quoteheader a")
    .forEach((el) => quoteHeaders.push(el.innerText));

  if (!quoteHeaders.length) return false;

  return quoteHeaders.some((header) =>
    ignoredUsers.some((user) => header.includes(user))
  );
}

function sbGetPosts() {
  const topicPosts = document.querySelectorAll(".post_wrapper");
  const bestOfPosts = document.querySelectorAll(".core_posts");

  return topicPosts.length ? topicPosts : bestOfPosts;
}

function sbRun(ignoredUsers = [], blur) {
  const posts = sbGetPosts();
  posts.forEach((post) => {
    if (sbIsPoster(post, ignoredUsers) || sbIsQuoted(post, ignoredUsers)) {
      if (blur) {
        post.parentElement.classList.add("sb-ignore-user-blur");
      } else {
        post.classList.add("sb-ignore-user-hide");
        post.parentElement.firstElementChild.classList.add(
          "sb-ignore-user-hide"
        );
      }
    }
  });
}

chrome.storage.local.get("settings", (result) => {
  const { sb_on, sb_ignoredUsers, sb_blur } = result.settings || {};
  const ignoredUsers = sb_ignoredUsers.split(",");
  if (sb_on && ignoredUsers.length) {
    sbRun(ignoredUsers, sb_blur);
  }
});
