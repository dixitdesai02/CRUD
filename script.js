const addForm = document.querySelector("#AddProduct form");
const id = addForm.querySelector("#product-id");
const name = addForm.querySelector("#name");
const price = addForm.querySelector("#price");
const desc = addForm.querySelector("#description");
const imageInput = addForm.querySelector("#image");
const outputImage = addForm.querySelector("#output");

const productSection = document.querySelector("#Products .container");

// RENDER PRODUCTS
function loadProducts(products) {

    // Load Wishlists for each User
    const username = sessionStorage.getItem("username");
    const wishlist = JSON.parse(localStorage.getItem(`${username}WishList`)) || [];

    productSection.innerHTML = "";

    // No Product Items
    if (products.length === 0) {
        const emptyItems = document.createElement("img");
        emptyItems.setAttribute("src", "images/empty.webp");
        productSection.classList.add("d-block", "text-center");
        emptyItems.classList.add("w-75");
        productSection.append(emptyItems);
        return;
    }

    // Render Each Product
    productSection.classList.remove("d-block", "text-center");

    products.forEach((product) => {

        const productItem = document.createElement("div");
        productItem.setAttribute("href", `productDetail.html?id=${product.id}`);
        productItem.classList.add("card");
        productItem.innerHTML += `  <img src="${product.image || 'images/dummy-image.png'}" class="card-img-top" alt="..."  data-bs-toggle="modal" data-bs-target="#modal" onClick="editViewProduct(${product.id}, 'View')">
                                    <div class="card-body">
                                    <h5 class="card-title" data-bs-toggle="modal" data-bs-target="#modal" onClick="editViewProduct(${product.id}, 'View')">${product.id}. ${product.name.length > 15 ? product.name.slice(0,15) + "...": product.name}</h5>
                                    <p class="card-desc opacity-75">${product.description.length > 50 ? product.description.slice(0,50) + "...": product.description}</p>
                                    <p class="card-price">₹ ${product.price} <span>/-</span> </p>
                                    <div class="edit-delete-wrapper d-none">
                                        <div class="flex-grow-1">
                                            <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal" onClick="editViewProduct(${product.id}, 'Edit')">Edit</button>
                                            <button class="btn btn-sm btn-danger delete" onClick={deleteProduct(${product.id})}>Delete</button>
                                        </div>
                                        <img class="save-btn justify-item-end ${wishlist.find(wish => wish == product.id) && "d-none"}" src="images/save.svg" alt="Add to wishlist" onClick="AddToWishList(event, ${product.id})">
                                        <img class="saved-btn ${wishlist.find(wish => wish == product.id) ? "d-inline-block" : "d-none"}" src="images/saved.svg" alt="saved to wishlist" onClick="RemoveFromWishList(event, ${product.id})">
                                    </div>
                                </div>`;
        
        productSection.append(productItem);

    });

    // Load Pagination of Products
    loadPagination();
    if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {
        login();
    }
}


// LOGIN FUNCTIONALITY
const addBtn = document.getElementById("add-btn");
const wishlistBtn = document.getElementById("wishlist-btn");
const loginInvoke = document.querySelector("#login-btn");
const logoutBtn = document.querySelector("#logout-btn");

// Check for login status in session storage
const isLoggedIn = sessionStorage.getItem("isLoggedIn") || false;

// If User is not Logged In
if (isLoggedIn === "false") {
    loginInvoke.classList.remove("d-none");
    const loginForm = document.querySelector("#login-modal form");
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const loginEmail = loginForm.querySelector("#login-email");
        const loginPassword = loginForm.querySelector("#login-password");
    
        const email = loginEmail.value;
        const password = loginPassword.value;
    
        // Conditions for Three dummy emails
        if (email === "user1@mail.com" && password === "user1") {
            login();
            email.value = password.value = "";
            showNotification("login-success");
            sessionStorage.setItem("username", "user1");
        } 
        else if(email === "user2@mail.com" && password === "user2") {
            login();
            email.value = password.value = "";
            showNotification("login-success");
            sessionStorage.setItem("username", "user2");
        }
        else if(email === "user3@mail.com" && password === "user3") {
            login();
            email.value = password.value = "";
            showNotification("login-success");
            sessionStorage.setItem("username", "user3");
        }
        else  {
            // Login Failed
            showNotification("login-fail");
        }
        location.reload();
    });
}
else {
    // Else Do Login Automatically
    login();
}

// Changes for Logged In User
function login() {
    loginInvoke.classList.add("d-none");
    addBtn.classList.remove("d-none");
    wishlistBtn.classList.remove("d-none");
    logoutBtn.classList.remove("d-none");

    // Unhide Edit and Delete
    const editDeleteWrapper = document.querySelectorAll(".edit-delete-wrapper");
    
    editDeleteWrapper.forEach((editDelete) => {
        editDelete.classList.remove("d-none");
        editDelete.classList.add("d-flex");
    });

    const productCards = document.querySelectorAll("#Products .card");
    productCards.forEach((product) => {
        product.style.height = "22rem";
    });

    sessionStorage.setItem("isLoggedIn", true);
}

// LOGOUT 
logoutBtn.addEventListener("click", (e) => {
    logout();
})

// Make LoggedIn Status to False
function logout() {
    sessionStorage.setItem("isLoggedIn", false);
    location.reload();
}

// Fetch All the Products from localstorage and call LoadProducts Method
const products = JSON.parse(localStorage.getItem("products")) || [];
loadProducts(products);



// Diff WishList for Each User
let user1WishList = JSON.parse(localStorage.getItem("user1WishList")) || [];
let user2WishList = JSON.parse(localStorage.getItem("user2WishList")) || [];;
let user3WishList = JSON.parse(localStorage.getItem("user3WishList")) || [];

// Add To Wish List of Products
function AddToWishList(event, id) {
    const saveBtn = event.target;
    saveBtn.classList.add("d-none");

    const savedBtn = saveBtn.nextElementSibling;
    savedBtn.classList.remove("d-none");

    let username = sessionStorage.getItem("username");

    // Switch to particular user and add product to its respective wishlist
    switch (username) {
        case "user1":
            user1WishList.push(id);
            localStorage.setItem("user1WishList", JSON.stringify(user1WishList));
            break;
        case "user2":
            user2WishList.push(id);
            localStorage.setItem("user2WishList",  JSON.stringify(user2WishList));
            break;
        case "user3":
            user3WishList.push(id);
            localStorage.setItem("user3WishList", JSON.stringify(user3WishList));
            break;
    } 
}

// Remove from particular wishlist
function RemoveFromWishList(event, id) {
    const savedBtn = event.target;
    savedBtn.classList.add("d-none");

    const saveBtn = savedBtn.previousElementSibling;
    saveBtn.classList.remove("d-none");

    let username = sessionStorage.getItem("username");
    switch (username) {
        case "user1":
            user1WishList = user1WishList.filter(savedItemId => savedItemId != id);
            localStorage.setItem("user1WishList", JSON.stringify(user1WishList));
            break;
        case "user2":
            user2WishList = user2WishList.filter(savedItemId => savedItemId != id);
            localStorage.setItem("user2WishList",  JSON.stringify(user2WishList));
            break;
        case "user3":
            user3WishList = user3WishList.filter(savedItemId => savedItemId != id);
            localStorage.setItem("user3WishList", JSON.stringify(user3WishList));
            break;
    }
}

// To Render Wishlist Product items
wishlistBtn.addEventListener("click", (e) => {
    const products = JSON.parse(localStorage.getItem("products"));

    let username = sessionStorage.getItem("username");
    let wishList = [];

    switch (username) {
        case "user1":
            user1WishList = JSON.parse(localStorage.getItem("user1WishList")) || [];
            user1WishList.forEach(id => {
                wishList.push(products.find(product => product.id == id));
            })
            break;
        case "user2":
            user2WishList = JSON.parse(localStorage.getItem("user2WishList")) || [];
            user2WishList.forEach(id => {
                wishList.push(products.find(product => product.id == id));
            })
            break;
        case "user3":
            user3WishList = JSON.parse(localStorage.getItem("user3WishList")) || [];
            user3WishList.forEach(id => {
                wishList.push(products.find(product => product.id == id));
            })
            break;
    }

    // Removing All the undefined (Falsy Values) from Array
    wishList = wishList.filter( Boolean );
    loadProducts(wishList)
});


// Add and SortFilter Products Hide and Show Toggle 
const addProduct = document.getElementById("AddProduct");

addBtn.addEventListener("click", () => {
    addProduct.classList.toggle("show");
});

const sortBtn = document.getElementById("sort-btn");
const sortFilter = document.getElementById("sort-filter");
sortBtn.addEventListener("click", () => {
    sortFilter.classList.toggle("show");
})



// CREATE Product
let product = {};

// Load Image and render it for Preview
imageInput.addEventListener('change', (event) => {
    const image = event.target.files[0];

    console.log(event.target.files[0]);

    const reader = new FileReader();

    reader.readAsDataURL(image);

    reader.addEventListener('load', () => {
        outputImage.src = reader.result;
        product.image = reader.result;
    });
});

// On Submitting Add Product Form
addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Fetch Values from Form
    product.id = id.value;
    product.name = name.value;
    product.price = price.value;
    product.description = desc.value;

    let productList = JSON.parse(localStorage.getItem("products"));

    // Check of Existance of Product Id in Products List
    // If ID is already present, then show popup for updating or not
    if (productList && productList.find((product) => product.id === id.value)) {
        swal({
            title: "Product Already Exists!",
            text: "Do you want update the existing product?",
            icon: "warning",
            buttons: ["Cancel", "Update"],
          })
          .then((willUpdate) => {
            if (willUpdate) {
              updateExistingProduct(id.value);  
              showNotification("Edited");
            }
          });
        return;
    }

    if (productList == null)
        productList = [];

    // Push Element at Starting of List
    productList.unshift(product);

    try {
        localStorage.setItem("products", JSON.stringify(productList));

        loadProducts(productList);
        login();

        // Notification for Adding Successfully
        showNotification("Add");

        id.value = name.value = price.value = desc.value = imageInput.value = product.image = "";
        outputImage.removeAttribute('src');
    }
    catch(error) {
        // Incase of Any Error
        showNotification("Error");
    }
});

// For Updating Product when Adding Product which is already there with the same ID
function updateExistingProduct(id) {
    let productList = JSON.parse(localStorage.getItem("products"));
    const productToBeUpdated = productList.find((product) => product.id === id);

    console.log(productToBeUpdated);

    console.log(id);
    const index = productList.findIndex((product) => product.id == id);
    console.log(index);
    productList.splice(index, 1);

    productToBeUpdated.name = name.value;
    productToBeUpdated.price = price.value;
    productToBeUpdated.description = desc.value;
    productToBeUpdated.image = product.image;

    productList.unshift(productToBeUpdated);

    console.log("Updated List:", productList);

    localStorage.setItem("products", JSON.stringify(productList));
    loadProducts(productList);
}

// EDIT Operation
function editViewProduct(id, operation) {

    const productList = JSON.parse(localStorage.getItem("products"));
    const productToBeUpdated = productList.find(product => product.id == id);
    
    const modalTitle = document.querySelector(".modal-title");
    modalTitle.textContent = `${operation} Product`;

    const editForm = document.querySelector("#modal form");
    const idInput = editForm.querySelector("#edit-id");
    const name = editForm.querySelector("#edit-name");
    const price = editForm.querySelector("#edit-price");
    const desc = editForm.querySelector("#edit-description");
    const imageInput = editForm.querySelector("#edit-image");
    const outputImage = editForm.querySelector("#output-edit");
    const saveChanges = editForm.querySelector(".save-changes");


    idInput.value = id;
    // ID Can't Get Updated
    idInput.setAttribute("disabled", true);

    name.value = productToBeUpdated.name;
    price.value = productToBeUpdated.price;
    desc.value = productToBeUpdated.description;    
    outputImage.src = productToBeUpdated.image;

    // Make Editing Disabled if Operation is only for view
    if (operation === "View") {
        name.setAttribute("disabled", true);
        price.setAttribute("disabled", true);
        desc.setAttribute("disabled", true);
        imageInput.setAttribute("disabled", true);
        saveChanges.style.display = "none";
        return;
    }
    else {
        name.removeAttribute("disabled");
        price.removeAttribute("disabled");
        desc.removeAttribute("disabled");
        imageInput.removeAttribute("disabled");
        saveChanges.style.display = "inline-block";
    }


    const editedProduct = {};

    // For Updating Image
    imageInput.addEventListener('change', (event) => {
        const image = event.target.files[0];
    
        console.log(event.target.files[0]);
    
        const reader = new FileReader();
    
        reader.readAsDataURL(image);
    
        reader.addEventListener('load', () => {
            outputImage.src = reader.result;
            editedProduct.image = reader.result;
        });
    });

    // On Submitting Edit Form
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        editedProduct.id = id + "";
        editedProduct.name = name.value;
        editedProduct.price = price.value;
        editedProduct.description = desc.value;

        // Find Index of Product that is going to be updated
        const foundIndex = productList.findIndex(product => product.id == id);

        if (!editedProduct.image)
            editedProduct.image = productList[foundIndex].image;

        productList[foundIndex] = editedProduct;

        // Set Updated List
        localStorage.setItem("products", JSON.stringify(productList));
        
        showNotification("Edited");

        loadProducts(productList);
    })
}


// DELETE Operation
function deleteProduct(id) {

    const products = JSON.parse(localStorage.getItem("products"));

    // Pop up for Warning
    swal({
        title: "Are you sure?",
        text: "You won't be able to recover this Product!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            const updatedProducts = products.filter(product => product.id != id);

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            
            // Also Delete from WishList Array
            deleteFromWishList(id);

            showNotification("Delete");
            loadProducts(updatedProducts);
        }
    });
}

// Delete from wishlist function
function deleteFromWishList(id) {
    let index;
    const username = sessionStorage.getItem("username");
    switch (username) {
        case "user1":
            index = user1WishList.indexOf(id);
            user1WishList.splice(index, 1);
            localStorage.setItem("user1WishList", JSON.stringify(user1WishList));
            
        case "user2":
            index = user2WishList.indexOf(id);
            user2WishList.splice(index, 1);
            localStorage.setItem("user2WishList", JSON.stringify(user2WishList));
            
        case "user3":
            index = user3WishList.indexOf(id);
            user3WishList.splice(index, 1);
            localStorage.setItem("user3WishList", JSON.stringify(user3WishList));
            
    }
}

// SORT Products
const sort = document.querySelector(".sort-selector");
const order = document.querySelector(".order-selector");

sort.addEventListener("change", () => {
    sortProducts();
});

order.addEventListener("change", () => {
    sortProducts();
});


function sortProducts() {
    const sortBy = sort.value;
    const sortOrder = order.value;

    const products = JSON.parse(localStorage.getItem("products")) || [];
    console.log(products);

    if (sortOrder === "asc") {
        if (sortBy === "name")
            products.sort((a,b) => a.name.localeCompare(b.name));
        else
            products.sort((a,b) => a[sortBy] - b[sortBy]);
    }
    else {
        if (sortBy === "name")
            products.sort((a,b) => b.name.localeCompare(a.name));
        else
            products.sort((a,b) => b[sortBy] - a[sortBy]);
    }

    localStorage.setItem("products", JSON.stringify(products));

    loadProducts(products);
}


// FILTER Products
const searchFilter = document.querySelector(".search");
console.log(searchFilter);
searchFilter.addEventListener("input", () => {
    filterProducts();    
})

function filterProducts() {
    // Fetching value of input 
    const searchTerm = searchFilter.value;

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const searchResult = [];

    // Search for product using search Term in ID, Name, Desc
    for (let product of products) {
        if (product.id.includes(searchTerm)) {
            searchResult.push(product);
        }
        else if (product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResult.push(product);
        }
        else if (product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
            searchResult.push(product);
        }
    }

    // Load New Filtered Products
    loadProducts(searchResult);
}


// NOTIFICATION function for diff Operations
function showNotification(msg) {
    const notification = document.querySelector(".notification");

    notification.innerHTML = "";

    const notificationText = document.createElement("div");
    notificationText.classList.add("d-flex", "justify-content-between", "align-items-center");
    notification.append(notificationText);

    switch (msg) {
        case "Error":
            notification.style.backgroundColor = 'rgba(220,53,69,0.9)';
            notificationText.innerHTML = `<p>Storage is Full! Delete some items to Add more..</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
        case "Edited":
            notification.style.backgroundColor = '#318481';
            notificationText.innerHTML = `<p>Hurrey!! Edited Successfully!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
        case "Add":
            notification.style.backgroundColor = '#318481';
            notificationText.innerHTML = `<p>Hurrey!! Product Added Successfully!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
        case "Delete":
            notification.style.backgroundColor = '#318481';
            notificationText.innerHTML = `<p>Deleted Successfully!!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
        case "login-success":
            notification.style.backgroundColor = '#318481';
            notificationText.innerHTML = `<p>Welcome Back! Logged In Successfully!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
        case "login-fail":
            notification.style.backgroundColor = 'rgba(220,53,69,0.9)';
            notificationText.innerHTML = `<p>Invalid Username or Password!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
            break;
    }

    notification.style.display = "block";

    setTimeout(()=>{
        notification.style.display = "none";
    }, 4000);

    // Closing Notification on clicking close btn
    const closeNotification = notification.querySelector(".close");
    closeNotification.addEventListener("click", ()=>{
        notification.style.display =     
        function displayPage(limit){
            productSection.innerHTML = '';
            for(let i=0; i<limit; i++){
                productSection.append(productList[i]);
            }
            const pageNum = pageUl.querySelectorAll('.list'); 
            pageNum.forEach(n => n.remove());
        }
        displayPage(itemsPerPage);
    });
}


// PAGINATION
function loadPagination() {
    const pageUl = document.querySelector(".pagination");
    const cards = productSection.getElementsByClassName("card");
    console.log(cards);
    const productList = [];
    let index = 1;
    let itemsPerPage = 10;

    // Adjust items per page according to screen size
    if (document.body.clientWidth < 991) {
        itemsPerPage = 4;
    }
    else if (document.body.clientWidth < 1200) {
        itemsPerPage = 6;
    }
    else if (document.body.clientWidth < 1450) {
        itemsPerPage = 8;
    }

    // Load Cards in a list
    for(let i=0; i<cards.length; i++){ productList.push(cards[i]); }
    
    function displayPage(limit){
        productSection.innerHTML = '';
        for(let i=0; i<limit; i++){
            if (i >= productList.length)
                break;
            productSection.append(productList[i]);
        }
        // Update Page numers
        const pageNum = pageUl.querySelectorAll('.list'); 
        pageNum.forEach(n => n.remove());
    }
    displayPage(itemsPerPage);
    
    // Function to Add Page Numbers to possible pages
    function pageGenerator(itemsPerPage){
        const nProducts = productList.length;  
        console.log(nProducts);
        if(nProducts <= itemsPerPage){
            pageUl.style.display = 'none';
        }else{
            pageUl.style.display = 'flex';
            // Count of Number of pages
            const nPages = Math.ceil(nProducts/itemsPerPage);
            for(i=1; i<=nPages; i++){
                const li = document.createElement('li'); li.classList.add('list');
                const a =document.createElement('a'); a.href = '#'; a.innerText = i;
                a.setAttribute('data-page', i);
                li.appendChild(a);
                pageUl.insertBefore(li,pageUl.querySelector('.next'));
            }
        }
    }

    pageGenerator(itemsPerPage);

    // Update Page index on clicking page number or Next, Prev
    function pageRunner(pageLinks, itemsPerPage, lastPage, pageList){
        for(let button of pageLinks){
            button.onclick = e=>{
                const pageNo = e.target.getAttribute('data-page');
                const pageMover = e.target.getAttribute('id');
                if(pageNo != null){
                    index = pageNo;
                }else{
                    if(pageMover === "next"){
                        index++;
                        if(index >= lastPage){
                            index = lastPage;
                        }
                    }else{
                        index--;
                        if(index <= 1){
                            index = 1;
                        }
                    }
                }
                pageMaker(index, itemsPerPage, pageList);
            }
        }
    }

    const pageLinks = pageUl.querySelectorAll("a");
    const lastPage =  pageLinks.length - 2;
    const pageList = pageUl.querySelectorAll('.list'); 
    pageList[0] && pageList[0].classList.add("active");
    pageRunner(pageLinks, itemsPerPage, lastPage, pageList);

    // Load Page and Update Active class of page
    function pageMaker(index, itemsPerPage, pageList){
        const start = itemsPerPage * index;
        const end  = start + itemsPerPage;
        const currentPage =  productList.slice((start - itemsPerPage), (end-itemsPerPage));
        productSection.innerHTML = "";

        for(let product of currentPage){				
            productSection.appendChild(product);
        }

        if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {
            login();
        }

        Array.from(pageList).forEach((e)=>{e.classList.remove("active");});
        pageList[index-1].classList.add("active");
    }
}


// NAVBAR Menu Toggle
const menu = document.querySelector(".hamburger-menu");
const navList = document.querySelector(".nav-list");

menu.addEventListener("click", () => {
  navList.classList.toggle("change");
});

const navBtns = document.querySelectorAll(".btn-container button");
navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        navList.classList.toggle("change");
    })
})