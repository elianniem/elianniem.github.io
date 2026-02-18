window.addEventListener("DOMContentLoaded", () => {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");
  filterForm.style.display = "none";
  newForm.style.display = "none";

  filterArticles();
});

function showFilter() {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  filterForm.style.display = "block";
  newForm.style.display = "none";
}

function showAddNew() {
  const filterForm = document.getElementById("filterContent");
  const newForm = document.getElementById("newContent");

  newForm.style.display = "flex"; 
  filterForm.style.display = "none";
}

function filterArticles() {
  const showOpinion = document.getElementById("opinionCheckbox").checked;
  const showRecipe = document.getElementById("recipeCheckbox").checked;
  const showUpdate = document.getElementById("updateCheckbox").checked;

  document.querySelectorAll("article.opinion").forEach((a) => {
    a.style.display = showOpinion ? "" : "none";
  });

  document.querySelectorAll("article.recipe").forEach((a) => {
    a.style.display = showRecipe ? "" : "none";
  });

  document.querySelectorAll("article.update").forEach((a) => {
    a.style.display = showUpdate ? "" : "none";
  });
}

function addNewArticle() {
  const titleEl = document.getElementById("inputHeader");
  const textEl = document.getElementById("inputArticle");

  const title = titleEl.value.trim();
  const text = textEl.value.trim();

  const isOpinion = document.getElementById("opinionRadio").checked;
  const isRecipe = document.getElementById("recipeRadio").checked;
  const isUpdate = document.getElementById("lifeRadio").checked;

  if (!title || !text || (!isOpinion && !isRecipe && !isUpdate)) {
    alert("Please enter a title, select a type, and enter text.");
    return;
  }

  let typeClass = "";
  let markerText = "";

  if (isOpinion) {
    typeClass = "opinion";
    markerText = "Opinion";
  } else if (isRecipe) {
    typeClass = "recipe";
    markerText = "Recipe";
  } else {
    typeClass = "update";
    markerText = "Update"; 
  }

  const articleList = document.getElementById("articleList");

  const nextNum = articleList.querySelectorAll("article").length + 1;

  const article = document.createElement("article");
  article.className = typeClass;
  article.id = "a" + nextNum;

  const marker = document.createElement("span");
  marker.className = "marker";
  marker.textContent = markerText;

  const h2 = document.createElement("h2");
  h2.textContent = title;

  const pText = document.createElement("p");
  pText.textContent = text;

  const pLink = document.createElement("p");
  const link = document.createElement("a");
  link.href = "moreDetails.html";
  link.textContent = "Read more...";
  pLink.appendChild(link);

  article.appendChild(marker);
  article.appendChild(h2);
  article.appendChild(pText);
  article.appendChild(pLink);

  articleList.appendChild(article);

  titleEl.value = "";
  textEl.value = "";
  document.getElementById("opinionRadio").checked = false;
  document.getElementById("recipeRadio").checked = false;
  document.getElementById("lifeRadio").checked = false;

  filterArticles();
}
