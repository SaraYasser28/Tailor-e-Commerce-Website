document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("wedding-products-container");
  let allProducts = [];

  function displayProducts(products) {
    container.innerHTML = "";
    products.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-lg-3";

      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body text-center">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text small text-muted">${product.description}</p>
            <p class="fw-bold">$${product.price}</p>
            <a href="../cart/index.html" class="btn btn-main">Add to Cart</a>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
  }

  // Fetch products
  fetch('data/wedding.json')
    .then(response => response.json())
    .then(data => {
      allProducts = data;           // store products
      displayProducts(allProducts); // display all products
    })
    .catch(err => console.error(err));

  // Filtering
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      if (filter === "all") {
        displayProducts(allProducts);
      } else {
        displayProducts(allProducts.filter(p => p.category === filter));
      }
    });
  });
});
