Promise.all([
  fetch("/csv").then((response) => response.json()), // fetching csv
  fetch("/images").then((response) => response.json()), // fetching Model images
  fetch("/Clothimages").then((response) => response.json()), // fetching cloth images
  fetch("/Resultimages").then((response) => response.json()), // fetching result images
]).then(([data, Data, cloth, result]) => {
  // parsing each get request
  var csvArray = JSON.parse(data);
  var modelimageArray = JSON.parse(Data);
  var clothimageArray = JSON.parse(cloth);
  var resultimageArray = JSON.parse(result);

  // Define pagination variables
  const itemsPerPage = 5; // Number of items per page
  let currentPage = 1; // Current page

  // Function to render images for a specific page
  function renderPage(page) {
    var container = document.getElementById("image-container");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Calculate starting and ending indexes for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (var i = startIndex; i < Math.min(endIndex, csvArray.length); i++) {
      var imgm = document.createElement("img");
      imgm.alt = "nothing";
      let imgc = document.createElement("img");
      imgc.alt = "nothing";
      let imgr = document.createElement("img");
      imgr.alt = "nothing";
      //respective paths for the images

      console.log(imgm.src);
      imgm.src = modelimageArray[i] + "/" + csvArray[i][0]; //  uploads/Modelimage/imagenmae
      imgc.src = clothimageArray[i] + "/" + csvArray[i][1]; // uploads/Clothimage/imagenmae
      imgr.src = resultimageArray[i] + "/" + csvArray[i][0]; // uploads/Resultimage/imagenmae

      let CountDiv = document.createElement("div");
      CountDiv.id = "CountDiv";
      CountDiv.appendChild(imgm);
      CountDiv.appendChild(imgc);
      CountDiv.appendChild(imgr);

      let imageNameDiv = document.createElement("div");
      imageNameDiv.className = "image-names";

      let modelName = document.createElement("p");
      modelName.textContent = "Model Image: " + csvArray[i][0];
      imageNameDiv.appendChild(modelName);

      let clothName = document.createElement("p");
      clothName.textContent = "Cloth Image: " + csvArray[i][1];
      imageNameDiv.appendChild(clothName);

      let resultName = document.createElement("p");
      resultName.textContent = "Result Image: " + csvArray[i][0];
      imageNameDiv.appendChild(resultName);

      container.appendChild(CountDiv);
      container.appendChild(imageNameDiv);
    }
  }

  // Function to handle pagination
  function handlePagination() {
    const totalPages = Math.ceil(csvArray.length / itemsPerPage);

    // Next page button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        handlePagination(); // Update pagination buttons
      }
    });

    // Previous page button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        handlePagination(); // Update pagination buttons
      }
    });

    // Append pagination buttons to the container
    const paginationDiv = document.getElementById("pagination-container");
    paginationDiv.innerHTML = ""; // Clear previous buttons
    paginationDiv.appendChild(nextButton);

    // Hide/show previous button based on current page
    if (currentPage === 1) {
      prevButton.style.display = "none";
    } else {
      prevButton.style.display = "block";
      paginationDiv.insertBefore(prevButton, nextButton);
    }
  }

  // Initial render
  renderPage(currentPage);
  handlePagination();
});
