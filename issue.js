fetch("http://localhost:5000/issue")
  .then((response) => response.json())
  .then((issuesData) => {
    // Calculate the highest issue ID
    const highestId = Math.max(...issuesData.map((issue) => issue.id));

    // Set the new ID in the issue form
    const issueidField = document.getElementById("issueid");
    issueidField.value = highestId + 1;
  })
  .catch((error) => {
    console.error("Error fetching issue data:", error);
  });

// Fetch member and book data from JSON Server
fetch("http://localhost:3000/members")
  .then((response) => response.json())
  .then((membersData) => {
    const memberDropdown = document.getElementById("member");
    membersData.forEach((member) => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.name;
      memberDropdown.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching member data:", error);
  });

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("bookId");

// Fetch book data from JSON Server based on the book ID
fetch(`http://localhost:4000/books/${bookId}`)
  .then((response) => response.json())
  .then((book) => {
    const bookDetailsDiv = document.getElementById("bookDetails");
    bookDetailsDiv.innerHTML = `
            <!-- <p><strong>Book ID:</strong> ${book.id}</p>
            <p><strong>Title:</strong> ${book.title}</p> -->
            <label for="bookid" class="form-label">Book ID:</label>
            <input type="text" id="bookid" name="bookid" class="form-control" value="${book.id}" required>
            <label for="title" class="form-label">Title:</label>
            <input type="text" id="title" name="title" class="form-control" value="${book.title}" required>
            <!-- Add the rest of the issue book form here -->
        `;
  });

// Handle form submission
const issueForm = document.getElementById("issueForm");
issueForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const memberId = issueForm.member.value;
  const bookId = issueForm.bookid.value;
  const issueDate = issueForm.issueDate.value;
  const returnDate = issueForm.returnDate.value;

  // Create the issue object
  const issueObject = {
    id: issueForm.issueid.value, // Automatically generated ID
    //mname: getMemberName(memberId), // You need to implement this function
    bid: bookId,
    mid: memberId,
    idate: issueDate,
    rdate: returnDate,
  };

  // Send the issueObject to the JSON Server
  const response = await fetch("http://localhost:5000/issue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(issueObject),
  });

  if (response.ok) {
    alert("Book issued successfully!");
  } else {
    alert("Error issuing book.");
  }
});

//code to not able to select the return date before issue date
const issueDateInput = issueForm.issueDate;
const returnDateInput = issueForm.returnDate;

issueDateInput.addEventListener("input", () => {
  // Set the min attribute of the returnDate input field
  returnDateInput.min = issueDateInput.value;
});

