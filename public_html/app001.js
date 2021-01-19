
let params = new URLSearchParams(document.location.search.substring(1));
let page = parseInt(params.get("page"));
if (isNaN(page)) {
    page = 1;
}
console.log(page);

let apiUrl = "https://orionnet.online/api/v2/cameras/public";

const count = 9;

fetch(apiUrl)
  .then((res) => res.json())
  .then(
    (result) => {
      console.log(result[0]);
    },
    (error) => {
      console.log(error);
    }
  );

  function renderCam () {

  }
