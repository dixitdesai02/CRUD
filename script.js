const addBtn = document.getElementById("add-btn");
const addProduct = document.getElementById("AddProduct");

addBtn.addEventListener("click", () => {
    addProduct.classList.toggle("show");
});

const sortBtn = document.getElementById("sort-btn");
const sortFilter = document.getElementById("sort-filter");
sortBtn.addEventListener("click", () => {
    sortFilter.classList.toggle("show");
})


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
                                    <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal" onClick="editViewProduct(${product.id}, 'Edit')">Edit</button>
                                    <button class="btn btn-sm btn-danger delete" onClick={deleteProduct(${product.id})}>Delete</button>
                                </div>`;
        
        productSection.append(productItem);

    });
}

const products = JSON.parse(localStorage.getItem("products")) || [];
loadProducts(products);
loadPagination();

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

    productList.push(product);

    try {
        localStorage.setItem("products", JSON.stringify(productList));

        id.value = name.value = price.value = desc.value = imageInput.value = product.image = "";
        outputImage.removeAttribute('src');

        loadProducts(productList);
        loadPagination();
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

    if (msg === "Error") {
        notification.style.backgroundColor = 'rgba(220,53,69,0.9)';
        notificationText.innerHTML = `<p>Storage is Full! Delete some items to Add more..</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
    }
    else if (msg === "Edited") {
        notification.style.backgroundColor = '#318481';
        notificationText.innerHTML = `<p>Hurrey!! Edited Successfully!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
    }
    else if (msg === "Duplicate") {
        notification.style.backgroundColor = 'rgba(220,53,69,0.9)';
        notificationText.innerHTML = `<p>Product ID should be Unique!!</p> <i class="close fa-solid fa-xmark fs-4"></i>`;
    }

    notification.style.display = "block";

    setTimeout(()=>{
        notification.style.display = "none";
    }, 4000);

    const closeNotification = notification.querySelector(".close");
    closeNotification.addEventListener("click", ()=>{
        notification.style.display = "none";
    });
    
};

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
        loadPagination();
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
            
            loadProducts(updatedProducts);
            loadPagination();
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
    loadPagination();
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
    loadPagination();
}

function loadPagination() {

    const pageUl = document.querySelector(".pagination");
    const cards = productSection.querySelectorAll(".card");
    const productList = [];
    let index = 1;
    const itemsPerPage = 10;

    if (cards.length <= itemsPerPage)
        return;
    
    for(let i=0; i<cards.length; i++){ productList.push(cards[i]); }
    
    function displayPage(limit){
        productSection.innerHTML = '';
        for(let i=0; i<limit; i++){
            productSection.append(productList[i]);
        }
        const pageNum = pageUl.querySelectorAll('.list'); // Review
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
    pageList[0].classList.add("active");
    pageRunner(pageLinks, itemsPerPage, lastPage, pageList);

    
    function pageMaker(index, itemsPerPage, pageList){
        const start = itemsPerPage * index;
        const end  = start + itemsPerPage;
        const currentPage =  productList.slice((start - itemsPerPage), (end-itemsPerPage));
        productSection.innerHTML = "";

        for(let product of currentPage){				
            productSection.appendChild(product);
        }

        Array.from(pageList).forEach((e)=>{e.classList.remove("active");});
        pageList[index-1].classList.add("active");
    }
}
