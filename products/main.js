const selectTag = document.getElementById("selectCategory");
const container = document.getElementById("cards");

// تحميل التصنيفات
async function selectCategory() {
    let response = await fetch("https://dummyjson.com/products/categories");
    let categories = await response.json();

    selectTag.innerHTML += categories
        .map((cat) => `<option value="${cat.url}">${cat.name}</option>`)
        .join("");

    // نخلي Beauty افتراضي
    let beauty = categories.find(cat => cat.slug === "beauty");
    if (beauty) {
        selectTag.value = beauty.url;
        loadProducts(beauty.url);
    }
}

// تحميل المنتجات لأي تصنيف
async function loadProducts(url) {
    document.getElementById("loading").style.display = "block"; // show spinner
    container.innerHTML = "";
    let response = await fetch(url);
    let data = await response.json();
    let products = data.products;

    container.innerHTML = products
        .map((product) => {
            // ⭐ توليد النجوم حسب التقييم
            let stars = "";
            let fullStars = Math.floor(product.rating); // عدد النجوم المملوءة
            let halfStar = product.rating % 1 >= 0.5; // لو في نص نجمة
            let emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
            let discountedPrice = product.price - (product.price * product.discountPercentage / 100);

            for (let i = 0; i < fullStars; i++) {
                stars += `<i class="fa-solid fa-star text-warning"></i>`;
            }
            if (halfStar) {
                stars += `<i class="fa-solid fa-star-half-stroke text-warning"></i>`;
            }
            for (let i = 0; i < emptyStars; i++) {
                stars += `<i class="fa-regular fa-star text-warning"></i>`;
            }

            return `
        <div class="col-xl-3 col-md-6 col-sm-6 col-12 d-flex flex-column align-items-center my-3">
            <div id="cardContainer" class="card-container p-4 rounded position-relative product-card" data-id="${product.id}">
                <img src="${product.thumbnail}" class="rounded img-fluid" alt="${product.title}" />
                <h6 class="text-center mt-3 fw-bold">${product.title}</h6>
                <p class="d-flex justify-content-between">
                    <span class="ms-4 text-danger fw-medium"><s>${Math.ceil(product.price)} $</s></span>
                    <span class="me-4 fw-medium">${Math.ceil(discountedPrice)} $</span>
                </p>
                <p class="product-rate text-center">
                    ${stars} <span class="text-muted small">(${product.rating.toFixed(1)})</span>
                </p>
                <div class="card-icons">
                    <p class="icon cart-btn w-100" title="add to cart" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping text-light"></i>
                        Add to Cart
                    </p>
                    <p class="icon wishlist-btn text-light w-100" title="add to wishlist" data-id="${product.id}">
                        <i class="fa-solid fa-heart text-light"></i>
                        Add to Wishlist
                    </p>
                  
                </div>
                <span class="badge bg-danger">-${Math.ceil(product.discountPercentage)}% OFF</span>
            </div>
        </div>
        `;

        })

        .join("");
        // Model start
    document.getElementById("loading").style.display = "none";

    const productModalEl = document.getElementById("productModal");
    const productModal = new bootstrap.Modal(productModalEl);

    document.querySelectorAll(".view-details").forEach((card) => {
        card.addEventListener("click", () => {
            let id = card.getAttribute("data-id");
            let product = products.find((p) => p.id == id);

            document.getElementById("modalTitle").textContent = product.title;
            document.getElementById("modalImage").src = product.thumbnail;
            document.getElementById("modalDescription").textContent = product.description;
            document.getElementById("modalPrice").textContent = `${product.price} $`;
            document.getElementById("modalRating").textContent = `⭐ ${product.rating}`;
            document.getElementById("modalBrand").textContent = `Brand: ${product.brand}`;
            document.getElementById("modalCategory").textContent = `Category: ${product.category}`;
            document.getElementById("modalQuantity").textContent = `Available: ${product.stock}`;
            document.getElementById("modalMinOrder").textContent = `Minimum Order: ${product.minimumOrderQuantity}`;
            document.getElementById("modalDimensions").textContent =
                `Dimensions: ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`;
            document.getElementById("modalCartBtn").setAttribute("data-id", product.id);
            document.getElementById("modalWishlistBtn").setAttribute("data-id", product.id);
            productModal.show();
        });
    });

    // ✅ إضافة الأحداث بعد عرض المنتجات
    document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id");
            let product = products.find((p) => p.id == id);
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (!cart.find((item) => item.id === product.id)) {
                cart.push({
                    id: product.id,
                    category:product.category,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                });
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        });
    });


    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-id");
            let product = products.find((p) => p.id == id);
            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (!wishlist.find((item) => item.id === product.id)) {
                wishlist.push({
                    id: product.id,
                    category:product.category,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                });
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
            }
        });
    });

    // ✅ لما تضغط على الكارد يفتح تفاصيل المنتج
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // عشان ما يفتحش المودال لو ضغطت على زر Add to Cart أو Wishlist أو View Details
        if (e.target.closest(".cart-btn") || e.target.closest(".wishlist-btn") || e.target.closest(".view-details")) return;

        let id = card.getAttribute("data-id");
        let product = products.find((p) => p.id == id);

        if (!product) return;

        // نملأ بيانات المودال
        document.getElementById("modalTitle").textContent = product.title;
        document.getElementById("modalImage").src = product.thumbnail;
        document.getElementById("modalDescription").textContent = product.description;
        document.getElementById("modalPrice").textContent = `${product.price} $`;
        document.getElementById("modalRating").textContent = `⭐ ${product.rating}`;
        document.getElementById("modalBrand").textContent = `Brand: ${product.brand}`;
        document.getElementById("modalCategory").textContent = `Category: ${product.category}`;
        document.getElementById("modalQuantity").textContent = `Available: ${product.stock}`;
        document.getElementById("modalMinOrder").textContent = `Minimum Order: ${product.minimumOrderQuantity}`;
        document.getElementById("modalDimensions").textContent =
            `Dimensions: ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`;
        document.getElementById("modalCartBtn").setAttribute("data-id", product.id);
        document.getElementById("modalWishlistBtn").setAttribute("data-id", product.id);

        // نعرض المودال
        productModal.show();
      });
    });
}

// عند تغيير الاختيار
selectTag.addEventListener("change", () => {
    if (selectTag.value) loadProducts(selectTag.value);
});

document.addEventListener("hidden.bs.modal", (event) => {
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
});

// أول تحميل
selectCategory();