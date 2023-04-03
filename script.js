const addForm = document.querySelector("#AddProduct form");
const id = addForm.querySelector("#product-id");
const name = addForm.querySelector("#name");
const price = addForm.querySelector("#price");
const desc = addForm.querySelector("#description");
const imageInput = addForm.querySelector("#image");
const outputImage = addForm.querySelector("#output");

const productSection = document.querySelector("#Products .container");

// Load Product cards
function loadProducts(products) {

    productSection.innerHTML = "";

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
                                        <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal" onClick="editViewProduct(${product.id}, 'Edit')">Edit</button>
                                        <button class="btn btn-sm btn-danger delete" onClick={deleteProduct(${product.id})}>Delete</button>
                                    </div>
                                </div>`;
        
        productSection.append(productItem);

    });

    loadPagination();
    if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {
        login();
    }
}


const addBtn = document.getElementById("add-btn");
const loginInvoke = document.querySelector("#login-btn");
const logoutBtn = document.querySelector("#logout-btn");
const isLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn")) || false;

if (!isLoggedIn) {
    loginInvoke.classList.remove("d-none");
    const loginForm = document.querySelector("#login-modal form");
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const loginEmail = loginForm.querySelector("#login-email");
        const loginPassword = loginForm.querySelector("#login-password");
    
        const email = loginEmail.value;
        const password = loginPassword.value;
    
        if (email === "dummy@mail.com" && password === "dummy@password") {
            login();
            email.value = password.value = "";
            showNotification("login-success");
        } 
        else {
            showNotification("login-fail");
        }
    });
}
else {
    login();
}

function login() {
    loginInvoke.classList.add("d-none");
    addBtn.classList.remove("d-none");
    logoutBtn.classList.remove("d-none");

    const editDeleteWrapper = document.querySelectorAll(".edit-delete-wrapper");
    
    editDeleteWrapper.forEach((editDelete) => {
        editDelete.classList.remove("d-none");
    });

    const productCards = document.querySelectorAll("#Products .card");
    productCards.forEach((product) => {
        product.style.height = "22rem";
    });

    sessionStorage.setItem("isLoggedIn", JSON.stringify(true));
}

logoutBtn.addEventListener("click", (e) => {
    logout();
})

function logout() {
    sessionStorage.setItem("isLoggedIn", JSON.stringify(false));
    location.reload();
}


const products = JSON.parse(localStorage.getItem("products")) || [];
loadProducts(products);


const addProduct = document.getElementById("AddProduct");

addBtn.addEventListener("click", () => {
    addProduct.classList.toggle("show");
});

const sortBtn = document.getElementById("sort-btn");
const sortFilter = document.getElementById("sort-filter");
sortBtn.addEventListener("click", () => {
    sortFilter.classList.toggle("show");
})


let product = {};

// Create Product
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


addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    product.id = id.value;
    product.name = name.value;
    product.price = price.value;
    product.description = desc.value;

    let productList = JSON.parse(localStorage.getItem("products"));

    if (productList.find((product) => product.id === id.value)) {
        showNotification("Duplicate");
        return;
    }

    if (productList == null)
        productList = [];

    productList.unshift(product);

    try {
        localStorage.setItem("products", JSON.stringify(productList));

        loadProducts(productList);
        login();

        showNotification("Add");

        id.value = name.value = price.value = desc.value = imageInput.value = product.image = "";
        outputImage.removeAttribute('src');
    }
    catch(error) {
        showNotification("Error");
    }

});

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
        case "Duplicate": 
            notification.style.backgroundColor = 'rgba(220,53,69,0.9)';
            notificationText.innerHTML = `<p>Product ID should be Unique!!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
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
    }

    notification.style.display = "block";

    setTimeout(()=>{
        notification.style.display = "none";
    }, 4000);

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

// Edit Operation
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
    idInput.setAttribute("disabled", true);

    name.value = productToBeUpdated.name;
    price.value = productToBeUpdated.price;
    desc.value = productToBeUpdated.description;    
    outputImage.src = productToBeUpdated.image;

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


    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        editedProduct.id = id + "";
        editedProduct.name = name.value;
        editedProduct.price = price.value;
        editedProduct.description = desc.value;

        const foundIndex = productList.findIndex(product => product.id == id);

        if (!editedProduct.image)
            editedProduct.image = productList[foundIndex].image;

        productList[foundIndex] = editedProduct;

        localStorage.setItem("products", JSON.stringify(productList));
        
        showNotification("Edited");

        loadProducts(productList);
        login();
    })
}


// Delete Operation
function deleteProduct(id) {

    const products = JSON.parse(localStorage.getItem("products"));
    console.log(`id${id}`);

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

            console.log(updatedProducts);

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            
            showNotification("Delete");
            loadProducts(updatedProducts);
            login();
        }
    });
}


// Sort Products
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


// Filter Products
const searchFilter = document.querySelector(".search");
console.log(searchFilter);
searchFilter.addEventListener("input", () => {
    filterProducts();    
})

function filterProducts() {
    const searchTerm = searchFilter.value;

    const products = JSON.parse(localStorage.getItem("products")) || [];

    const searchResult = [];

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

    loadProducts(searchResult);
}

function loadPagination() {
    const pageUl = document.querySelector(".pagination");
    const cards = productSection.getElementsByClassName("card");
    console.log(cards);
    const productList = [];
    let index = 1;
    let itemsPerPage = 10;

    if (document.body.clientWidth < 991) {
        itemsPerPage = 4;
    }
    else if (document.body.clientWidth < 1200) {
        itemsPerPage = 6;
    }
    else if (document.body.clientWidth < 1450) {
        itemsPerPage = 8;
    }


    for(let i=0; i<cards.length; i++){ productList.push(cards[i]); }
    
    function displayPage(limit){
        productSection.innerHTML = '';
        for(let i=0; i<limit; i++){
            if (i >= productList.length)
                break;
            productSection.append(productList[i]);
        }
        const pageNum = pageUl.querySelectorAll('.list'); 
        pageNum.forEach(n => n.remove());
    }
    displayPage(itemsPerPage);
    
    function pageGenerator(itemsPerPage){
        const nProducts = productList.length;  
        console.log(nProducts);
        if(nProducts <= itemsPerPage){
            pageUl.style.display = 'none';
        }else{
            pageUl.style.display = 'flex';
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


// Navbar
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