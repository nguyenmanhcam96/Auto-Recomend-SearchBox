function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}
var ul = document.createElement("ul");
ul.classList.add("list-group");
var result = document.getElementById("suggest");
result.appendChild(ul);

async function autoSuggest() {
  var input = document.getElementById("input_field").value;
  ul.innerHTML = "";
  const INFO =
    "https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=";
  const TITLE =
    "https://en.wikipedia.org/w/api.php? origin=*&action=query&prop=pageprops|pageimages&format=json&titles=";
  try {
   await getData(INFO + input, (undefined, data) => {
      if (undefined) {
        console.log("error undefined");
      }
      var name = data[1];
      var link = data[3];
      for (let i = 0; i < name.length; i++) {
        getData(TITLE + name[i], (undefined, info) => {
          if (undefined) {
            console.log("Error get info");
          }
          ul.innerHTML += `<li style="height: auto;" class="list-group-item w-75 d-flex">
                            <div>
                              <img class="w-auto" alt="image" src="${info.query.pages[Object.keys(info.query.pages)].thumbnail.source}"/>
                            </div>
                            <div class=" ml-2 ">
                              <a id="link" class="text-decoration-none" href="${link[i]}">${name[i]}</a><br/>
                              <span>${info.query.pages[Object.keys(info.query.pages)].title}</span>
                            </div>
                        </li>`;
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
