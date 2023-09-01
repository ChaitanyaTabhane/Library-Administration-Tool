document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addBookForm");
  const tableBody = document.getElementById("bookTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  async function fetchBooks() {
    const response = await fetch("http://localhost:4000/books");
    const data = await response.json();
    return data;
  }

  async function displayBooks(filter = "") {
  tableBody.innerHTML = "";
  const books = await fetchBooks();
  
  console.log("Search Query:", filter); // Debugging
  
  books.forEach((book) => {
    if (
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase())
    ) {
      //console.log("Matching Book:", book.title); // Debugging
      
      tableBody.innerHTML += `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.language}</td>
            <td>${book.pages}</td>
            <td>${book.year}</td>
            <td>${book.country}</td>
            <td><a href="${book.link}" target="_blank">link</a></td>
            <td><button class="btn btn-sm btn-primary edit-btn" data-id="${book.id}">Edit</button></td>
            <td><button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}">Delete</button></td>
          </tr>
      `;
    }
  });

  attachEventListeners();
}
  async function fetchBookById(id) {
    const response = await fetch(`http://localhost:4000/books/${id}`);
    const book = await response.json();
    return book;
  }

async function populateEditModal(book) {
    const modalBody = document.querySelector("#editModal .modal-body");
    modalBody.innerHTML = `

        <form id="editBookForm">
        <table>
        <tr>
            <td><label for="editTitle">Title:</label></td>
            <td><input type="text" id="editTitle" name="title" value="${book.title}" required></td>
        </tr>
        <tr>
            <td><label for="editAuthor">Author:</label></td>
            <td><input type="text" id="editAuthor" name="author" value="${book.author}" required></td>
        </tr>
        <tr>
            <td><label for="editLanguage">Language:</label></td>
            <td><input type="text" id="editLanguage" name="language" value="${book.language}" required></td>
        </tr>
        <tr>
            <td><label for="editPages">Pages:</label></td>
            <td><input type="number" id="editPages" name="pages" value="${book.pages}" required></td>
        </tr>
        <tr>
            <td><label for="editYear">Year:</label></td>
            <td><input type="number" id="editYear" name="year" value="${book.year}" required></td>
        </tr>
        <tr>
            <td><label for="editCountry" class="form-label">Country:</label></td>
            <td>
                <select class="form-select" id="editCountry" name="country" required>
                    <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Brazil">Brazil</option>
                    <!-- Add more country options here -->
                </select>
            </td>
        </tr>
        <tr>
            <td><label for="editLink">Link:</label></td>
            <td><input type="url" id="editLink" name="link" value="${book.link}" required></td>
        </tr>
        <!-- Add more fields for editing -->
    </table>
        </form>
        `;

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", async () => {
      const editFormData = new FormData(
        document.getElementById("editBookForm")
      );

      const updatedBook = Object.fromEntries(editFormData);
      const response = await fetch(`http://localhost:4000/books/${book.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedBook),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        $("#editModal").modal("hide");
        displayBooks();
      }
    });
  }

  async function editBook(id) {
    const book = await fetchBookById(id);
    populateEditModal(book);
    $("#editModal").modal("show");
  }

  async function deleteBook(id) {
    const response = await fetch(`http://localhost:4000/books/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      displayBooks();
      
    }
  }

  // Inside the addBook function
async function addBook(event) {
  event.preventDefault();
  const formData = new FormData(form);

  const existingBooks = await fetchBooks();
  const highestId = Math.max(...existingBooks.map(book => book.id));
  const newBookId = highestId + 1;

  formData.set("id", newBookId.toString()); // Set the new ID in the form data

  const response = await fetch("http://localhost:4000/books", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    form.reset();
    displayBooks();
    toastr.success("Book added successfully", "success");
  } else {
    toastr.error("An error occurred while adding the book", "error");
  }
}


  function attachEventListeners() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () =>
        editBook(button.getAttribute("data-id"))
      );
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () =>
        deleteBook(button.getAttribute("data-id"))
      );
    });
  }


  // Initial display of all books
  displayBooks();

  // Attach event listeners
  form.addEventListener("submit", addBook);

  // Attach search event listener
  searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value;
    displayBooks(searchQuery);
  });
});
