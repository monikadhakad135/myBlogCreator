// Toggle form visibility
function showForm(type) {
  const manualForm = document.getElementById("manualForm");
  const apiForm = document.getElementById("apiForm");
  const blogCardSection = document.getElementById("blogCardSection");

  manualForm.style.display = type === "manual" ? "block" : "none";
  apiForm.style.display = type === "api" ? "block" : "none";
  blogCardSection.innerHTML = ""; // Clear unsaved blog card
}

// Handle API Blog Form submission
const apiForm = document.getElementById("apiForm");
apiForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const searchTitle = document.getElementById("apiTitle").value.trim().toLowerCase();
  const blogCardSection = document.getElementById("blogCardSection");

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();

    const found = posts.find(post => post.title.toLowerCase().includes(searchTitle));

    if (found) {
      blogCardSection.innerHTML = `
        <div class="blog-card">
          <h3>${found.title}</h3>
          <p>${found.body}</p>
          <button onclick="saveBlog('${escapeString(found.title)}', '${escapeString(found.body)}')">Save</button>
        </div>
      `;
    } else {
      alert("Blog not found!");
      blogCardSection.innerHTML = "";
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    alert("Error fetching data.");
  }
});

// Handle Manual Form submission
const manualForm = document.getElementById("manualForm");
manualForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("manualTitle").value.trim();
  const desc = document.getElementById("manualDesc").value.trim();
  const blogCardSection = document.getElementById("blogCardSection");

  if (!title || !desc) return alert("Both fields are required.");

  blogCardSection.innerHTML = `
    <div class="blog-card">
      <h3>${title}</h3>
      <p>${desc}</p>
      <button onclick="saveBlog('${escapeString(title)}', '${escapeString(desc)}')">Save</button>
    </div>
  `;
});

// Save blog and render in saved section
function saveBlog(title, description) {
  const saved = JSON.parse(localStorage.getItem("blogs")) || [];
  saved.push({ title, description });
  localStorage.setItem("blogs", JSON.stringify(saved));
  document.getElementById("blogCardSection").innerHTML = "";
  displaySavedBlogs();
}

// Display blogs from localStorage
function displaySavedBlogs() {
  const saved = JSON.parse(localStorage.getItem("blogs")) || [];
  const container = document.getElementById("savedBlogs");
  container.innerHTML = "";

  saved.forEach((blog, index) => {
    container.innerHTML += `
      <div class="saved-card">
        <h3>${blog.title}</h3>
        <p>${blog.description}</p>
        <button onclick="editBlog(${index})">Edit</button>
        <button onclick="deleteBlog(${index})">Delete</button>
      </div>
    `;
  });
}

function deleteBlog(index) {
  if (!confirm("Are you sure you want to delete this blog?")) return;
  const saved = JSON.parse(localStorage.getItem("blogs")) || [];
  saved.splice(index, 1);
  localStorage.setItem("blogs", JSON.stringify(saved));
  displaySavedBlogs();
}

function editBlog(index) {
  const saved = JSON.parse(localStorage.getItem("blogs")) || [];
  const newTitle = prompt("Edit title:", saved[index].title);
  const newDesc = prompt("Edit description:", saved[index].description);
  if (newTitle && newDesc) {
    saved[index] = { title: newTitle, description: newDesc };
    localStorage.setItem("blogs", JSON.stringify(saved));
    displaySavedBlogs();
  }
}

function escapeString(str) {
  return str.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

// Initialize saved blogs on load
window.onload = function () {
  displaySavedBlogs();
};
