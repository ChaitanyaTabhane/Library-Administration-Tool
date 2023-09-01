document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("addIssueForm");
  const tableBody = document.getElementById("IssueTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  // Fetch the existing issues to determine the highest ID
  const issues = await fetchIssues();
  const highestId = Math.max(...issues.map(issue => issue.id));

  // Automatically set the next ID for the new issue
  const issueIdField = document.getElementById("id");
  issueIdField.value = highestId + 1;

  async function fetchIssues() {
    const response = await fetch("http://localhost:5000/issue");
    const data = await response.json();
    return data;
  }

  async function displayIssues(filter = "") {
    tableBody.innerHTML = "";
    const issues = await fetchIssues();

    issues.forEach((Issue) => {
      if (
        (Issue.bid?.toString() ?? "").includes(filter) ||
        (Issue.mid?.toString() ?? "").includes(filter)
      ){
        tableBody.innerHTML += `
          <tr>
              <td>${Issue.id}</td>
              <td>${Issue.bid}</td>
              <td>${Issue.mid}</td>
              <td>${Issue.idate}</td>
              <td>${Issue.rdate}</td>
              <td><button class="btn btn-sm btn-primary edit-btn" data-id="${Issue.id}">Edit</button></td>
              <td><button class="btn btn-sm btn-danger delete-btn" data-id="${Issue.id}">Delete</button></td>
            </tr>
        `;
      }
    });

    attachEventListeners();
  }
  
    async function fetchIssueById(id) {
      const response = await fetch(`http://localhost:5000/issue/${id}`);
      const Issue = await response.json();
      return Issue;
    }
  
    async function populateEditModal(Issue) {
      const modalBody = document.querySelector("#editModal .modal-body");
      modalBody.innerHTML = `
  
          <form id="editIssueForm">
          <table>
          <tr>
            <td><label for="editbid">Book ID:</label></td>
            <td><input type="text" id="editbid" name="bid" value="${Issue.bid}" required></td>
          </tr>
          <tr>
            <td><label for="editId">Id:</label></td>
            <td><input type="text" id="editId" name="id" value="${Issue.id}" required></td>
          </tr>
          <tr>
            <td><label for="editmid">mid:</label></td>
            <td><input type="text" id="editmid" name="mid" value="${Issue.mid}" required></td>
          </tr>
          <tr>
            <td><label for="editidate">Issue Date:</label></td>
            <td><input type="date" id="editidate" name="idate" value="${Issue.idate}" required></td>
          </tr>
          <tr>
            <td><label for="editrdate" class="form-label">Return Date:</label></td>
            <td><input type="date" id="editrdate" name="rdate" value="${Issue.rdate}" required></td>
          </tr>
          <!-- Add more rows for additional fields if needed -->
        </table>
        
          `;
  
      const saveChangesBtn = document.getElementById("saveChangesBtn");
      saveChangesBtn.addEventListener("click", async () => {
        const editFormData = new FormData(
          document.getElementById("editIssueForm")
        );
  
        const updatedIssue = Object.fromEntries(editFormData);
        const response = await fetch(`http://localhost:5000/issue/${Issue.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedIssue),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          $("#editModal").modal("hide");
          displayIssues();
        }
      });
    }
  
    async function editIssue(id) {
      const Issue = await fetchIssueById(id);
      populateEditModal(Issue);
      $("#editModal").modal("show");
    }
  
    async function deleteIssue(id) {
      const response = await fetch(`http://localhost:5000/issue/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        displayIssues();
      }
    }
  
    // Inside addIssue function
    async function addIssue(event) {
      event.preventDefault();
      const formData = new FormData(form);

      const response = await fetch("http://localhost:5000/issue", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        displayIssues();
        showSuccessNotification("Issue added successfully");
      } else {
        showErrorNotification("An error occurred while adding the issue");
      }
    }

  
    function attachEventListeners() {
      const editButtons = document.querySelectorAll(".edit-btn");
      const deleteButtons = document.querySelectorAll(".delete-btn");
  
      editButtons.forEach((button) => {
        button.addEventListener("click", () =>
          editIssue(button.getAttribute("data-id"))
        );
      });
  
      deleteButtons.forEach((button) => {
        button.addEventListener("click", () =>
          deleteIssue(button.getAttribute("data-id"))
        );
      });
    }
  
    // Initial display of all issues
  displayIssues();

  // Attach event listeners
  form.addEventListener("submit", addIssue);

  // Attach search event listener
  searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value;
    displayIssues(searchQuery);
  });
});