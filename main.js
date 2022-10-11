const API = "http://localhost:8000/post";

let textArea = document.querySelector("#text-area");
let inpUrl = document.querySelector("#inp-url");
let createBtn = document.querySelector(".create__btn");
let textPar = document.querySelector("#paragraph");
let sectionRead = document.getElementById("section__read");
let inpEditUrl = document.querySelector(".window__edit_url");
let btnEditSave = document.querySelector(".window__edit_btn-save");
let mainModal = document.querySelector(".main-modal");
let btnEditClose = document.querySelector(".window__edit_close");
let inpEditDetails = document.querySelector(".window__text-area");

let inpSearch = document.querySelector(".search-txt");
let searchValue = inpSearch.value;
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let currentPage = 1;

function createPost(obj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
}

createBtn.addEventListener("click", () => {
  if (!textArea.value.trim() || !inpUrl.value.trim()) {
    alert("Зполните поле");
    return;
  }
  let obj = {
    paragraph: textArea.value,
    url: inpUrl.value,
  };
  createPost(obj);
  textArea.value = "";
  inpUrl.value = "";
  readProducts();
});
function readProducts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=2`)
    .then(res => res.json())
    .then(data => {
      sectionRead.innerHTML = "";
      data.forEach(post => {
        sectionRead.innerHTML += `
      <div id="read">
          <div class="post__paragraph">
            <p id="paragraph">
              ${post.paragraph}
            </p>
          </div>
          <div class="posts">
            <img
              src="${post.url}"
              width="600px"
              alt="image"
            />
            <div class="icons">
              <img
                src="https://icons.veryicon.com/png/o/miscellaneous/decon/like-52.png"
                alt="likes"
              />
              <img
                src="https://cdn-icons-png.flaticon.com/512/1380/1380338.png"
                alt="comment"
              />
              <img
                src="https://cdn3.iconfinder.com/data/icons/random-icon-set/512/retweet-512.png"
                alt="retweet"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Share_Icon.svg/2048px-Share_Icon.svg.png"
                alt="share"
              />
              <button class="update__btn" onclick="handleEditBtn(${post.id})">Редактировать пост</button>
              <button class="delete__btn" onclick="deleteProduct(${post.id})">Удалить</button>
            </div>
          </div>
        </div>`;
      });
    });
  pageTotal();
}
readProducts();
// !delete start
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => readProducts());
}
// ?Delete end
// !edit Start
function editProduct(id, editedObj) {
  if (!inpEditDetails.value.trim() || !inpEditUrl.value.trim()) {
    alert("Зполните поле");
    return;
  }
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedObj),
  }).then(() => readProducts());
}
let editId = "";
function handleEditBtn(id) {
  mainModal.style.display = "block";
  fetch(`${API}/${id}`)
    .then(res => res.json())
    .then(postObj => {
      inpEditDetails.value = postObj.paragraph;
      inpEditUrl.value = postObj.url;
      editId = postObj.id;
    });
}

btnEditClose.addEventListener("click", () => {
  mainModal.style.display = "none";
});

btnEditSave.addEventListener("click", () => {
  let editedObj = {
    paragraph: inpEditDetails.value,
    url: inpEditUrl.value,
  };
  editProduct(editId, editedObj);
  mainModal.style.display = "none";
  readProducts();
});
// !Search
// !Search
inpSearch.addEventListener("input", e => {
  searchValue = e.target.value;
  readProducts();
});
// ?Search end
// ! paginate
let countPage = 1;
function pageTotal() {
  fetch(`${API}?q=${searchValue}`)
    .then(res => res.json())
    .then(data => {
      countPage = Math.ceil(data.length / 2);
    });
}

prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  readProducts();
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  readProducts();
});
