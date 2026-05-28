const API_URL = "http://localhost:5678/api";
let allWorks = [];

async function fetchAPI(route) {
  const response = await fetch(`${API_URL}${route}`);
  return response.json();
}

function displayWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

function createFilters(categories) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";
  const Tous = document.createElement("button");
  Tous.textContent = "Tous";
  Tous.classList.add("active");
  filters.appendChild(Tous);
  Tous.addEventListener("click", () => {
    document
      .querySelectorAll(".filters button")
      .forEach((btn) => btn.classList.remove("active"));
    Tous.classList.add("active");
    displayWorks(allWorks);
  });
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    filters.appendChild(button);
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filters button")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      displayWorks(allWorks.filter((work) => work.categoryId === category.id));
    });
  });
}

function handleEditorMode() {
  if (localStorage.getItem("token")) {
    document.querySelector("#editor-mode").style.display = "flex";
    document.querySelector(".editor-button").style.display = "flex";
    const loginLink = document.querySelector("#login a");
    loginLink.textContent = "logout";
    loginLink.href = "#";
    document.querySelector(".filters").style.display = "none";
    loginLink.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  }
}

const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
const modalBack = document.querySelector(".modal-back");
const modalTitle = document.querySelector(".modal-title");

const modalGallery = document.querySelector(".modal-gallery");
const modalForm = document.querySelector(".modal-form");
const modalGalleryGrid = document.querySelector(".modal-gallery-grid");

const btnAddPhoto = document.querySelector(".btn-add-photo");
const editorButton = document.querySelector(".editor-button");

const addWorkForm = document.querySelector("#add-work-form");
const workImageInput = document.querySelector("#work-image");
const workTitleInput = document.querySelector("#work-title");
const workCategorySelect = document.querySelector("#work-category");
const submitWorkButton = document.querySelector(".btn-submit");

const previewImage = document.querySelector(".preview-image");
const uploadIcon = document.querySelector(".upload-icon");
const uploadLabel = document.querySelector(".upload-label");
const uploadInfo = document.querySelector(".upload-info");
const uploadError = document.querySelector(".upload-error");

/* opening modal and closing */

function openModal() {
  modalOverlay.classList.remove("hidden");
  showModalGallery();
  displayModalWorks(allWorks);
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  showModalGallery();
  resetAddWorkForm();
}

/* change modal */

function showModalGallery() {
  modalGallery.classList.remove("hidden");
  modalForm.classList.add("hidden");
  modalBack.classList.add("hidden");
  modalTitle.textContent = "Galerie photo";
}

function showModalForm() {
  modalGallery.classList.add("hidden");
  modalForm.classList.remove("hidden");
  modalBack.classList.remove("hidden");
  modalTitle.textContent = "Ajout photo";
}

/* load miniatures*/

function displayModalWorks(works) {
  modalGalleryGrid.innerHTML = "";

  works.forEach((work) => {
    const workContainer = document.createElement("div");
    workContainer.classList.add("modal-work");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-work");
    deleteButton.type = "button";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    deleteButton.addEventListener("click", () => {
      deleteWork(work.id);
    });

    workContainer.appendChild(img);
    workContainer.appendChild(deleteButton);
    modalGalleryGrid.appendChild(workContainer);
  });
}

/* charg catg*/

function loadCategoriesInSelect(categories) {
  workCategorySelect.innerHTML = '<option value=""></option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    workCategorySelect.appendChild(option);
  });
}

/* preview imag*/

function showImagePreview() {
  const file = workImageInput.files[0];

  if (!file) {
    return;
  }

  const validTypes = ["image/jpeg", "image/png"];
  const maxSize = 4 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    uploadError.textContent = "Format invalide. Utilisez une image JPG ou PNG.";
    uploadError.classList.remove("hidden");
    workImageInput.value = "";
    checkAddWorkFormValidity();
    return;
  }

  if (file.size > maxSize) {
    uploadError.textContent = "L’image ne doit pas dépasser 4 Mo.";
    uploadError.classList.remove("hidden");
    workImageInput.value = "";
    checkAddWorkFormValidity();
    return;
  }

  uploadError.classList.add("hidden");
  uploadError.textContent = "";

  const imageUrl = URL.createObjectURL(file);

  previewImage.src = imageUrl;
  previewImage.classList.remove("hidden");

  uploadIcon.style.display = "none";
  uploadLabel.style.display = "none";
  uploadInfo.style.display = "none";
}

/*reset forms */

function resetAddWorkForm() {
  addWorkForm.reset();

  previewImage.src = "";
  previewImage.classList.add("hidden");

  uploadIcon.style.display = "";
  uploadLabel.style.display = "";
  uploadInfo.style.display = "";
  uploadError.textContent = "";
  uploadError.classList.add("hidden");
  submitWorkButton.disabled = true;
}

/*validation forms */

function checkAddWorkFormValidity() {
  const imageSelected = workImageInput.files.length > 0;
  const titleFilled = workTitleInput.value.trim() !== "";
  const categorySelected = workCategorySelect.value !== "";

  submitWorkButton.disabled = !(
    imageSelected &&
    titleFilled &&
    categorySelected
  );
}

/* event modal*/

function initModalEvents() {
  editorButton.addEventListener("click", openModal);

  modalClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeModal();
  });

  btnAddPhoto.addEventListener("click", showModalForm);

  modalBack.addEventListener("click", (event) => {
    event.stopPropagation();
    showModalGallery();
  });

  modalOverlay.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  workImageInput.addEventListener("change", () => {
    showImagePreview();
    checkAddWorkFormValidity();
  });

  workTitleInput.addEventListener("input", checkAddWorkFormValidity);

  workCategorySelect.addEventListener("change", checkAddWorkFormValidity);
  addWorkForm.addEventListener("submit", addWork);
}

/* delet work modal */
async function deleteWork(workId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    allWorks = allWorks.filter((work) => work.id !== workId);
    displayWorks(allWorks);
    displayModalWorks(allWorks);
  } else {
    alert("Erreur lors de la suppression du projet");
  }
}

/* post work modal */
async function addWork(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("image", workImageInput.files[0]);
  formData.append("title", workTitleInput.value);
  formData.append("category", workCategorySelect.value);

  const response = await fetch(`${API_URL}/works`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.ok) {
    const newWork = await response.json();

    allWorks.push(newWork);

    displayWorks(allWorks);
    displayModalWorks(allWorks);

    closeModal();
  } else {
    alert("Erreur lors de l’ajout du projet");
  }
}
async function init() {
  allWorks = await fetchAPI("/works");
  const categories = await fetchAPI("/categories");
  displayWorks(allWorks);
  createFilters(categories);
  handleEditorMode();
  loadCategoriesInSelect(categories);
  initModalEvents();
}

document.addEventListener("DOMContentLoaded", init);
