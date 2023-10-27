function sbIsPoster(postEl, ignoredUsers) {
  return ignoredUsers.includes(postEl.querySelector(".poster h4 a").innerText);
}

function sbIsQuoted(postEl, ignoredUsers) {
  let quoteHeaders = [];
  postEl
    .querySelectorAll("cite a")
    .forEach((el) => quoteHeaders.push(el.innerText));

  if (!quoteHeaders.length) return false;

  return quoteHeaders.some((header) =>
    ignoredUsers.some((user) => header.includes(user))
  );
}

function sbIsMarkedPost(postEl, ignoredUsers) {
  return sbIsPoster(postEl, ignoredUsers) || sbIsQuoted(postEl, ignoredUsers);
}

function sbGetPosts() {
  const topicPosts = document.querySelectorAll(".post_wrapper");
  const bestOfPosts = document.querySelectorAll(".core_posts");

  return { topic: topicPosts, best: bestOfPosts };
}

function sbRun(ignoredUsers = [], blur) {
  const { topic, best } = sbGetPosts();

  topic.forEach((post) => {
    if (sbIsMarkedPost(post, ignoredUsers)) {
      post.parentElement.classList.add(
        blur ? "sb-ignore-user-blur" : "sb-ignore-user-hide"
      );
    }
  });

  best.forEach((post) => {
    if (sbIsMarkedPost(post, ignoredUsers)) {
      post.classList.add(blur ? "sb-ignore-user-blur" : "sb-ignore-user-hide");
    }
  });
}

chrome.storage.local.get("settings", (result) => {
  const { sb_on, sb_ignoredUsers, sb_blur } = result.settings || {};
  const ignoredUsers = sb_ignoredUsers.split(",");
  if (sb_on && ignoredUsers.length && !!ignoredUsers[0]) {
    sbRun(ignoredUsers, sb_blur);
  }
});
