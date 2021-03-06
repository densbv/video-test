app.innerHTML = `<div class="loader"></div>`;

const params = new URLSearchParams(document.location.search.substring(1));
let page = parseInt(params.get("page"));
if (isNaN(page)) {
  page = 1;
}
console.log(page);

const apiUrl = "https://orionnet.online/api/v2/cameras/public";

const camsOnePage = 9;

const indexes = (page, camsOnePage) => {
  let end = page * camsOnePage;
  let start = end - camsOnePage;
  return [start, end];
};
const [...items] = indexes(page, camsOnePage);
console.log(items);

fetch(apiUrl)
  .then((res) => res.json())
  .then(
    (result) => {
      console.log(result);
      let pages = Math.ceil(result.length / camsOnePage);
      console.log(pages);
      cams = result.slice(...items);
      console.log(cams);
      app.innerHTML = renderCamCard(cams);
      pager.innerHTML = renderPager(page, pages);
      addVideo();
    },
    (error) => {
      app.innerHTML = `<div class="alert alert-danger" role="alert">
                            ${error}
                         </div>`;
      console.log(error);
    }
  );

function renderCamCard(cams) {
  let html = "";
  for (cam of cams) {
    html += cardTemplate(cam);
  }
  return html;
}

function cardTemplate(cam) {
  let preview = `https://krkvideo14.orionnet.online/cam1560/preview.jpg?token=${cam.id}`;
  return `<div class="col"><div class="card">
            <div id="video${cam.id}">
              <img class="preview" id="${cam.id}" src="${preview}" loading="lazy" />
            </div>
            <div class="card-body">
              <h5 class="card-title">${cam.title}</h5>
              </div>
            </div>
          </div>`;
}

function renderPager(page, pages) {
  return `<ul class="pagination">
              ${pagerLinks(pages, page)}
            </ul>`;
}

function pagerLinks(pages, page) {
  let start = 1;
  let currentPage = page;
  let end = pages + 1;
  const interval = 5;
  let arr = [];
  let linksHtml = "";
  let linkDisabled = `<li class="page-item disabled"><span class="page-link" href="#">...</span></li>`;
  if (currentPage <= interval) {
    let s = 1;
    for (let i = 0; i < interval; i++) {
      arr[i] = s++;
    }
    if (currentPage === start) {
      linksHtml += prevLink("disabled", start);
    } else {
      linksHtml += prevLink("", currentPage - 1);
    }
    linksHtml += linkTemplate(arr, currentPage);
    linksHtml += linkDisabled;
    linksHtml += endsLink(pages);
    linksHtml += nextLink("", currentPage + 1);
  } else if (currentPage > interval && currentPage + interval < end) {
    let s = currentPage - 2;
    for (let i = 0; i < interval; i++) {
      arr[i] = s++;
    }
    linksHtml += prevLink("", currentPage - 1);
    linksHtml += linkDisabled;
    linksHtml += linkTemplate(arr, currentPage);
    linksHtml += linkDisabled;
    linksHtml += nextLink("", currentPage + 1);
  } else if (currentPage <= end) {
    let s = end - interval;
    for (let i = 0; i < interval; i++) {
      arr[i] = s++;
    }
    linksHtml += prevLink("", currentPage - 1);
    linksHtml += endsLink(start);
    linksHtml += linkDisabled;
    linksHtml += linkTemplate(arr, currentPage);
    if (currentPage === pages) {
      linksHtml += nextLink("disabled", end);
    } else {
      linksHtml += nextLink("", currentPage + 1);
    }
  }
  return linksHtml;
}

function linkTemplate(arr, currentPage) {
  let linksHtml = "";
  for (let i = 0; i < arr.length; i++) {
    let active = arr[i] === currentPage ? "active" : "";
    linksHtml += `<li class="page-item"><a class="page-link ${active}" href="${location.pathname}?page=${arr[i]}">${arr[i]}</a></li>`;
  }
  return linksHtml;
}

function endsLink(pageTarget) {
  return `<li class="page-item"><a class="page-link active-link" href="${location.pathname}?page=${pageTarget}">${pageTarget}</a></li>`;
}

function prevLink(disabled, pageTarget) {
  return `<li class="page-item ${disabled}"><a class="page-link" href="${location.pathname}?page=${pageTarget}" tabindex="-1" aria-disabled="true">Назад</a></li>`;
}

function nextLink(disabled, pageTarget) {
  return `<li class="page-item ${disabled}"><a class="page-link" href="${location.pathname}?page=${pageTarget}">Вперед</a></li>`;
}

function video(camId) {
  let video = `https://krkvideo14.orionnet.online/cam1560/embed.html?token=${camId}`;
  return `<div class="plyr__video-embed" id="player${camId}">
            <iframe
              src="${video}"
              allowfullscreen
              allowtransparency
              allow="autoplay"
            ></iframe>
          </div>`;
}

function addVideo() {
  let previews = document.getElementsByClassName("preview");
  for (let i = 0; i < previews.length; i++) {
    previews[i].addEventListener(
      "click",
      function (e) {
        console.log(this.id);
        let camId = this.id;
        videoBlock = document.getElementById(`video${camId}`);
        videoBlock.innerHTML = video(camId);
      },
      false
    );
  }
}
