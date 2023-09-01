//for show books, book.html
document.addEventListener("DOMContentLoaded", function () {
  var booksData; // Declare booksData in a higher scope

  fetch("http://localhost:4000/books")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      booksData = data; // Store the data in the booksData variable
      appendData(booksData); // Call appendData with the fetched data
    })
    .catch(function (err) {
      console.log("Error: " + err);
    });

  function appendData(booksData) {
    var bookListContainer = document.getElementById("bookList");

    for (var i = 0; i < booksData.length; i++) {
      var bookCard = document.createElement("div");
      bookCard.className = "col-md-4";
      
      bookCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${booksData[i].imageLink}" class="card-img-top" alt="Book Cover">
                    <div class="card-body">
                        <h5 class="card-title">${booksData[i].title}</h5>
                        <p class="card-text">Author: ${booksData[i].author}</p>
                        <p class="card-text">Pages: ${booksData[i].pages}</p>
                        <p class="card-text">Year: ${booksData[i].year}</p>
                        <a href="${booksData[i].link}"  class="btn-sm btn-secondary" target ="_blank">info</a>
                        <br><br>
                        <a href="issue.html?bookId=${booksData[i].id}" class="btn btn-primary">Select</a>
                        <!-- <a href="issue.html" class="btn btn-primary">Select</a> -->
                    </div>
                </div>
            `;

            
      bookListContainer.appendChild(bookCard);
    }
  }

  var searchInput = document.getElementById("searchInput");
  var searchButton = document.getElementById("searchButton");

  searchButton.addEventListener("click", function () {
    var searchTerm = searchInput.value.toLowerCase();

    var filteredBooks = booksData.filter(function (book) {
      return (
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
      );
    });

    var bookListContainer = document.getElementById("bookList");
    bookListContainer.innerHTML = "";

    appendData(filteredBooks);
  });
});
