if (document.readyState === 'interactive' || document.readyState === 'complete') {
  loadWebMentions();
} else {
  document.addEventListener("DOMContentLoaded", function(event) {
    loadWebMentions();
  });
}

function loadWebMentions() {

  if (typeof fetch === "undefined") {
    // We don't support browsers that don't have fetch
    return;
  }

  var elem = document.getElementById('webmentions');
  if (!elem) {
    // Not supported on this page
    return;
  }

  var url = document.URL;

  // fix dev url
  url = url.replace(/^http:\/\/localhost:4000/, 'https://evertpot.com');

  return fetch('https://webmention.io/api/mentions?per-page=200&target=' + url)
    .then( response => response.json() )
    .then( result => displayWebMentions(elem, result) );

}

function displayWebMentions(elem, result) {

  if (!result.links.length) {
    // No mentions
    return;
  }

  var activityHtml = [];
  var likeHtml = [];
  var repostHtml = [];

  result.links.sort( (a, b) => {
    return a.data.published_ts - b.data.published_ts
  });

  for(var linkIdx in result.links) {
    var link = result.links[linkIdx];

    if (!link.data.author) {
      console.log('Links without authors are not yet supported');
      continue;
    }

    switch(link.activity.type) {
      case 'like' :
        likeHtml.push(getAvatar(link, link.data.url));
        break;
      case 'repost' :
        repostHtml.push(getAvatar(link, link.data.url));
        break;
      case 'reply' :
      case 'link' :
        let publishedTime = getPublishedTime(link);
        if (publishedTime) publishedTime = ' • ' + publishedTime;
        let content = link.data.content;
        if (!content) {
          content = link.data.url;
        }
        activityHtml.push('<li><div class="comment">' + getAvatar(link) + '<div class="inner"><p>' + getAuthorName(link) + publishedTime + '</p>' + content + '</div></div>');
        break;
      default :
        if (link.activity.sentence_html) {
          activityHtml.push('<li>' + getAvatar(link) + ' <p>' + link.activity.sentence_html + '</p></li>');
        }
        break;

    }
  }

  var html = '';

  if (repostHtml.length) {
    html += '<div class="facepile"><h2>Reposts:</h2>' + repostHtml.join('\n') + '</div>\n';
  }
  if (likeHtml.length) {
    html += '<div class="facepile"><h2>Likes:</h2>' + likeHtml.join('\n') + '</div>\n';
  }
  if (activityHtml.length) {
    html += '<ul class="activity">' + activityHtml.join('\n') + '</ul>\n';
  }

  elem.innerHTML = html;
  document.getElementsByClassName('webmentions')[0].className = 'webmentions visible';

}

function getAvatar(link, url) {

  url = url ? url : link.data.author.url;

  if (link.data && link.data.author && link.data.author.photo) {
    return '<a href="' + h(url) + '" title="' + h(link.data.author.name) + '"><img src="' + h(link.data.author.photo) + '" alt="' + h(link.data.author.name) + '" /></a>';
  }
  return '';

}
function getAuthorName(link, url) {

  url = link.data.author.url;

  if (link.data && link.data.author) {
    return '<a href="' + h(url) + '" title="' + h(link.data.author.name) + '">' + h(link.data.author.name) + '</a>';
  }

}
function getPublishedTime(link) {

  if (!link.data.published_ts) {
    return '';
  }
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  var d = new Date(link.data.published_ts * 1000);
  return '<time>' + months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + '</time>';

}

function h(input) {

  if (!input) {
    return '';
  }
  var charsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  };

  return input.replace(/&|<|>|"/g, char => {

    return charsToReplace[char];

  });

}
