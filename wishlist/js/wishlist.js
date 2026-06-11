let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let itemIdToRemove = null;

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Add product to wishlist
function addToWishlist(product) {
    const exists = wishlist.find(item => item.id === product.id);
    if (!exists) {
        wishlist.push(product);
        saveWishlist();
        renderWishlist();
    }
}

// Remove product by id
function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    renderWishlist();
}

// Open modal to confirm removal
function confirmRemoveFromWishlist(id, title) {
    itemIdToRemove = id;
    document.getElementById("removeModalText").innerText =
        `Are you sure you want to remove "${title}" from wishlist?`;

    const modal = new bootstrap.Modal(document.getElementById("removeModal"));
    modal.show();
}

// Confirm button in modal
document.getElementById("confirmRemove").addEventListener("click", () => {
    if (itemIdToRemove !== null) {
        removeFromWishlist(itemIdToRemove);
        itemIdToRemove = null;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById("removeModal"));
    modal.hide();
});

// Render wishlist
function renderWishlist() {
    const wishlistContainer = document.getElementById("wishlist-grid");

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
        <div class="wishlist-empty" id="wishlist-empty">
            <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Empty Wishlist">
            <h2>Oops! Your wishlist is empty</h2>
            <p class="text-muted">Start adding items you love and save them for later.</p>
            <a href="../products/index.html" class="btn btn-primary mt-3 px-4 py-2">
                <i class="bi bi-shop me-2"></i> Continue Shopping
            </a>
        </div>`;
        return;
    }

    wishlistContainer.innerHTML = ""; // clear previous items

    wishlist.forEach(item => {
        const card = `
        <div class="col-md-4 col-lg-3 col-sm-6 mb-4 wishlist-item">
            <div class="card h-100">
                <div class="img-container">
                    <img src="${item.thumbnail}" alt="${item.title}" class="card-img-top w-100">
                </div>
                <div class="card-body text-center">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.category}</p>
                    <p class="card-text fw-bold">$${item.price}</p>
                    <button class="btn btn-sm btn-danger w-100"
                        onclick="confirmRemoveFromWishlist(${item.id}, '${item.title.replace(/'/g, "\\'")}')">
                        <i class="bi bi-trash me-2"></i> Remove
                    </button>
                </div>
            </div>
        </div>`;
        wishlistContainer.innerHTML += card;
    });
}

// Initial render
document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
});
