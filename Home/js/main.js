
// --- Featured Products ---
const productsContainer = document.getElementById("products-container");

// Keywords for filtering men's clothing
const allowedKeywords = ["shirt", "jacket", "blazer", "suit"];

// Fetch mens-shirts and tops
Promise.all([
  fetch("https://dummyjson.com/products/category/mens-shirts").then((res) =>
    res.json()
  ),
  fetch("https://dummyjson.com/products/category/tops").then((res) =>
    res.json()
  ),
])
  .then((results) => {
    if (!productsContainer) return;

    productsContainer.innerHTML = ""; // clear existing cards

    // Combine both categories
    let allProducts = [...results[0].products, ...results[1].products];

    // Filter only products containing allowed keywords in title
    let filtered = allProducts.filter((product) =>
      allowedKeywords.some((keyword) =>
        product.title.toLowerCase().includes(keyword)
      )
    );

    // If filter wipes everything out → fall back to first 5 products
    if (filtered.length === 0) {
      console.warn(
        "No products matched keywords, showing fallback unfiltered list."
      );
      filtered = allProducts;
    }

    filtered.slice(0, 5).forEach((product) => {
      const cardCol = document.createElement("div");
      cardCol.classList.add("col");

      cardCol.innerHTML = `
        <div class="product-card d-flex flex-column align-items-center text-center p-3 cursor-pointer" style="transition: all 0.3s ease;">
          <img src="${product.thumbnail}" alt="${product.title}" 
              class="w-100 rounded-3 object-fit-cover" style="height:250px;">
          <h4 class="fs-6 mt-3 fw-bold">${product.title}</h4>
          <p class="price-text mt-1">$ ${product.price}</p>
        </div>
      `;

      // Hover effect
      const card = cardCol.querySelector(".product-card");
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.05)";
        
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
        card.style.boxShadow = "none";
      });

      productsContainer.appendChild(cardCol);
    });
  })
  .catch((err) => console.error("Error fetching products:", err));


document.addEventListener("DOMContentLoaded", () => {
  const usernameSpan = document.getElementById("username");
  const loggedOutBtn = document.getElementById("loggedOutBtn");

  function getBasePath() {
    if (location.hostname === "127.0.0.1" || location.hostname === "localhost") {
      return "/";
    }
    // هات أول جزء بعد الدومين (الفولدر الرئيسي بتاع المشروع)
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}/` : "/";
  }

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const users = JSON.parse(localStorage.getItem("user")) || [];

  if (usernameSpan) {
    if (loggedInUser) {
      const fullUser = users.find(u => u.userEmail === loggedInUser.email);
      usernameSpan.textContent = fullUser ? fullUser.userName : "Guest";
    } else if (users.length > 0) {
      usernameSpan.textContent = users[users.length - 1].userName;
    } else {
      usernameSpan.textContent = "Guest";
    }
  }

  if (loggedOutBtn) {
    loggedOutBtn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = getBasePath() + "index.html";
    });
  }
});
