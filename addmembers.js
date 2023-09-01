//used for addMembers
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addMemberForm");
  const tableBody = document.getElementById("MemberTableBody");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  async function fetchMembers() {
    const response = await fetch("http://localhost:3000/members");
    const data = await response.json();
    return data;
  }

  async function displayMembers(filter = "") {
    tableBody.innerHTML = "";
    const members = await fetchMembers();

    members.forEach((Member) => {
      if (
        Member.name.toLowerCase().includes(filter.toLowerCase()) ||
        Member.phone.toLowerCase().includes(filter.toLowerCase())
      ) {
        tableBody.innerHTML += `
            <tr>
              <td>${Member.id}</td>
              <td>${Member.name}</td>
              <td>${Member.phone}</td>
              <td>${Member.date}</td>
              <td>${Member.status}</td>
              <td><button class="btn btn-sm btn-primary edit-btn" data-id="${Member.id}">Edit</button></td>
              <td><button class="btn btn-sm btn-danger delete-btn" data-id="${Member.id}">Delete</button></td>
              </tr>
              `;
      }
    });

    attachEventListeners();
  }

  async function fetchMemberById(id) {
    const response = await fetch(`http://localhost:3000/Members/${id}`);
    const Member = await response.json();
    return Member;
  }

  async function populateEditModal(Member) {
    const modalBody = document.querySelector("#editModal .modal-body");
    modalBody.innerHTML = `

          <form id="editMemberForm">
            <table>
              <tr>
                  <td><label for="editname">Name:</label></td>
                  <td><input type="text" id="editname" name="name" value="${Member.name}" required></td>
              </tr>
              <tr>
                  <td><label for="editphone">Phone:</label></td>
                  <td><input type="text" id="editphone" name="phone" value="${Member.phone}" required></td>
              </tr>
              <tr>
                  <td><label for="editdate">Date:</label></td>
                  <td><input type="text" id="editdate" name="date" value="${Member.date}" required></td>
              </tr>
              <tr>
                  <td><label for="editstatus" class="form-label">Status:</label></td>
                  <td>
                      <select class="form-select" id="editstatus" name="status" required>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <!-- Add more status options here -->
                      </select>
                  </td>
              </tr>
              <!-- Add more fields for editing -->
            </table>
          </form>
          `;

    const saveChangesBtn = document.getElementById("saveChangesBtn");
    saveChangesBtn.addEventListener("click", async () => {
      const editFormData = new FormData(
        document.getElementById("editMemberForm")
      );

      const updatedMember = Object.fromEntries(editFormData);
      const response = await fetch(
        `http://localhost:3000/Members/${Member.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedMember),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        $("#editModal").modal("hide");
        displayMembers();
      }
    });
  }

  async function editMember(id) {
    const Member = await fetchMemberById(id);
    populateEditModal(Member);
    $("#editModal").modal("show");
  }

  async function deleteMember(id) {
    const response = await fetch(`http://localhost:3000/Members/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      displayMembers();
    }
  }

  // Inside the addMember function
  async function addMember(event) {
  event.preventDefault();
  const formData = new FormData(form);

  const existingMembers = await fetchMembers();
  const highestId = Math.max(...existingMembers.map(member => member.id));
  const newMemberId = highestId + 1;

  formData.set("id", newMemberId.toString()); // Set the new ID in the form data

  const response = await fetch("http://localhost:3000/Members", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    form.reset();
    displayMembers();
  }
}


  function attachEventListeners() {
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((button) => {
      button.addEventListener("click", () =>
        editMember(button.getAttribute("data-id"))
      );
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () =>
        deleteMember(button.getAttribute("data-id"))
      );
    });
  }

  searchButton.addEventListener("click", () => {
    const searchQuery = searchInput.value;
    //console.log("Search Query:", searchQuery);
    displayMembers(searchQuery);
  });

  // Call these functions when the page loads
  displayMembers();

  // Attach event listeners
  form.addEventListener("submit", addMember);
});
