const defaultUrls = {
  lc: "https://laracasts.com/search?q={s}",
  yt: "https://www.youtube.com/results?search_query={s}",
  bang: "https://duckduckgo.com/bang?q={s}",
  flaticon: "https://www.flaticon.com/search?word={s}"
};

let form = document.querySelector("form");
let add = document.querySelector("#add");
let urls = {};

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    urls: urls
  });
}

function addUrl(e) {
  if (urls["newUrl"]) return;
  urls["newUrl"] = "https://your-url.com?s={s}";
  createUrl("newUrl");
}

function createUrl(alias) {
  let div = document.createElement("div");
  div.className = "my-2 p-2 border-b border-grey-darl flex";

  let del = document.createElement("button");
  del.innerText = "delete";
  del.className = "rounded-full bg-red-lighter px-2 text-xs";
  del.onclick = function() {
    delete urls[alias];
    form.removeChild(div);
  };

  let label = document.createElement("input");
  label.value = alias;
  label.className = "p-2 w-24 font-bold";
  label.onchange = function() {
    label.value = label.value.replace(" ", "");
    urls[label.value] = urls[alias];
    delete urls[alias];
  };

  let input = document.createElement("input");
  input.value = urls[alias];
  input.className = "flex-1 p-2 border-l-2";
  input.onchange = function() {
    urls[label.value] = input.value;
  };

  div.appendChild(del);
  div.appendChild(label);
  div.appendChild(input);
  form.appendChild(div);
}

function restoreOptions() {
  function createLayout(result) {
    urls = result.urls || defaultUrls;

    let aliases = Object.keys(urls);

    aliases.forEach(alias => {
      createUrl(alias);
    });
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("urls");
  getting.then(createLayout, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
form.addEventListener("submit", saveOptions);
add.addEventListener("click", addUrl);
