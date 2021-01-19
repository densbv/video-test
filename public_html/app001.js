const params = new URLSearchParams(document.location.search.substring(1));
let page = parseInt(params.get("page"));
if (isNaN(page)) {
  page = 1;
}
console.log(page);

const apiUrl = "https://orionnet.online/api/v2/cameras/public";

const camsOnePage = 9;

const indexes = (page, camsOnePage) => {
    let end = ((page * camsOnePage) - 1);
    let start = page > 1 ? end - camsOnePage : 0;
    return [start, end];
}
const [...items] = indexes(page, camsOnePage);
console.log(items);

fetch(apiUrl)
  .then((res) => res.json())
  .then(
    (result) => {

      let pages = result.length / camsOnePage;
      console.log(Math.floor(pages));
      
      cams = result.slice(...items);
      console.log(cams);

      for (let i=0; cams.length; i++) {
        console.log(cams[i].title)
      }

    },
    (error) => {
      console.log(error);
    }
  );

