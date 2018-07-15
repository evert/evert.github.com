document.addEventListener("DOMContentLoaded", function(event) {
  loadWebMentions();
});

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



  return fetch('https://webmention.io/api/mentions?target=' + url)
    .then( response => response.json() )
    .then( result => displayWebMentions(elem, result) );

}

function displayWebMentions(elem, result) {

  if (!result.links) {
    // No mentions
    return;
  }

  var activityHtml = [];
  var likeHtml = [];
  for(var linkIdx in result.links) {
    var link = result.links[0];

    switch(link.activity.type) {
      case 'like' :
        likeHtml.push(getAvatar(link, link.data.url));
        break
      default :
        if (link.activity.sentence_html) {
          activityHtml.push('<li>' + getAvatar(link) + ' <p>' + link.activity.sentence_html + '</p></li>');
        }
        break;

    }
  }

  var html = '';

  if (activityHtml) {
    html += '<ul class="activity">' + activityHtml.join('\n') + '</ul>\n';
  }
  if (likeHtml) {
    html += '<div class="likes"><h2>Likes:</h2>' + likeHtml.join('\n') + '</p>\n';
  }

  console.log(html);
  elem.innerHTML = html;
  document.getElementsByClassName('webmentions')[0].className = 'webmentions visible';

}

function getAvatar(link, url) {

  url = url ? url : link.data.author.url;

  if (link.data && link.data.author && link.data.author.photo) {
    return '<a href="' + h(url) + '" title="' + h(link.data.author.name) + '"><img src="' + h(link.data.author.photo) + '" alt="' + h(link.data.author.name) + '" /></a>';
  }

}

function h(input) {

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
