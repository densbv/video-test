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

let app = document.getElementById("app");
let pager = document.getElementById("pagination");

fetch(apiUrl)
  .then((res) => res.json())
  .then(
    (result) => {
      console.log(result);
      let pages = Math.floor(result.length / camsOnePage);

      cams = result.slice(...items);
      console.log(cams);

      app.innerHTML = renderCamCard(cams);
      pagination.innerHTML = renderPager(page, pages);
    },
    (error) => {
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
  //let preview = `https://krkvideo14.orionnet.online/cam1560/preview.jpg?token=${cam.id}`;
  //<img src="${preview}" / style="height: 200px;">
  return `<div class="col"><div class="card" style="width: 18rem;">
            
            <div class="card-body">
              <h5 class="card-title">${cam.title}</h5>
              </div>
            </div>
          </div>`;
      }

function renderPager(page, pages) {
console.log(page);
console.log(pages);
let prev = page - 1;
let next = page + 1;
console.log(prev);
console.log(next);

return pagerTemplate(pages, page);
}

function pagerTemplate(pages, page) {
  return `<nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
              
              ${pagerLinks(pages, page)}
              <li class="page-item">
                <a class="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>`;
}

function pagerLinks(pages, page) {
  let linksHtml = "";
  let prev = `<li class="page-item disabled">
  <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
</li>`;
  for (let i=1; i < pages+1; ++i) {
    let active = i === page ? "active" : "";
    if (i === 1) {
      linksHtml += prev + `<li class="page-item ${active}"><a class="page-link" href="${location.pathname}?page=${i}">${i}</a></li>`;
    } else {
      linksHtml += `<li class="page-item ${active}"><a class="page-link" href="${location.pathname}?page=${i}">${i}</a></li>`;
    }
    
  }
  return linksHtml;
}
