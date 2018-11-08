const defaultUrls = {
  lc: "https://laracasts.com/search?q={s}",
  yt: "https://www.youtube.com/results?search_query={s}",
  bang: "https://duckduckgo.com/bang?q={s}",
  flaticon: "https://www.flaticon.com/search?word={s}"
};

let urls = {};

// Provide help text to the user.
browser.omnibox.setDefaultSuggestion({
  description: `Jump right to your site (eg. go url => https://your-url.com?q=query)`
});

// Open the page based on how the user clicks on a suggestion.
browser.omnibox.onInputEntered.addListener((text, disposition) => {
  let url = "";

  let parts = text.split(" ");
  let key = parts.shift();
  let query = parts.join(" ") || "";
  if (urls[key]) {
    url = urls[key].replace("{s}", query);
  }

  if (!url) {
    if (disposition === "currentTab") {
      var querying = browser.tabs.query({ currentWindow: true, active: true });
      querying.then(tabs => {
        browser.search.search({
          query: text,
          tabId: tabs[0].id
        });
      }, onError);
    } else {
      browser.search.search({
        query: text
      });
    }
  } else {
    switch (disposition) {
      case "currentTab":
        browser.tabs.update({ url });
        break;
      case "newForegroundTab":
        browser.tabs.create({ url });
        break;
      case "newBackgroundTab":
        browser.tabs.create({ url, active: false });
        break;
    }
  }
});

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  let keys = Object.keys(urls);

  console.log(keys);

  let result = [];
  for (key of keys) {
    if (key.includes(text) || urls[key].includes(text))
      result.push({
        content: key,
        description: urls[key]
      });
  }

  suggest(result);
});

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
  console.log(item);
  if (item.urls) {
    urls = item.urls || defaultUrls;
  }
}

var getting = browser.storage.sync.get("urls");
getting.then(onGot, onError);
