const addBtn = document.getElementById("add-btn");
const addProduct = document.getElementById("AddProduct");

addBtn.addEventListener("click", () => {
    addProduct.classList.toggle("show");
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
function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    productSection.innerHTML = "";

    products.forEach((product) => {

        const productItem = document.createElement("div");
        productItem.setAttribute("href", `productDetail.html?id=${product.id}`);
        productItem.classList.add("card");
        productItem.innerHTML += ` <a href="productDetail.html?id=${product.id}"> <img src="${product.image || 'images/dummy-image.png'}" class="card-img-top" alt="..."> </a>
                                    <div class="card-body">
                                    <a href="productDetail.html?id=${product.id}"> <h5 class="card-title">${product.id}. ${product.name.length > 15 ? product.name.slice(0,15) + "...": product.name}</h5> </a>
                                    <p class="card-desc opacity-75">${product.description.length > 50 ? product.description.slice(0,50) + "...": product.description}</p>
                                    <p class="card-price">₹ ${product.price} <span>/-</span> </p>
                                    <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal" onClick={editProduct(${product.id})}>Edit</button>
                                    <button class="btn btn-sm btn-danger delete" onClick={deleteProduct(${product.id})}>Delete</button>
                                </div>`;
        
        productSection.append(productItem);

    });
}

loadProducts();

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

    if (productList == null)
        productList = [];

    console.log(productList);

    productList.push(product);

    try {
        localStorage.setItem("products", JSON.stringify(productList));

        AddProduct(product);

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

function AddProduct(product) {
    const productItem = document.createElement("a");
    productItem.setAttribute("href", "productDetail.html");
    productItem.classList.add("card");
    productItem.innerHTML = ` <img src="${product.image || 'images/dummy-image.png'} " class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${product.id}. ${product.name.length > 15 ? product.name.slice(0,15) + "...": product.name}</h5>
                                <p class="card-desc">${product.description.length > 50 ? product.description.slice(0,50) + "...": product.description}</p>
                                <p class="card-price">₹ ${product.price} <span>/-</span> </p>
                                <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal" onClick={editProduct(${product.id})}>Edit</button>
                                <button class="btn btn-sm btn-danger delete" onClick={deleteProduct(${product.id})}>Delete</button>
                            </div>`;
    
    productSection.append(productItem);

}

// Edit Operation
function editProduct(id) {

    console.log("Edit here");
    const productList = JSON.parse(localStorage.getItem("products"));
    const productToBeUpdated = productList.find(product => product.id == id);
    console.log(productToBeUpdated);

    const editForm = document.querySelector("#modal form");

    const idInput = editForm.querySelector("#edit-id");
    const name = editForm.querySelector("#edit-name");
    const price = editForm.querySelector("#edit-price");
    const desc = editForm.querySelector("#edit-description");
    const imageInput = editForm.querySelector("#edit-image");
    const outputImage = editForm.querySelector("#output-edit");

    idInput.value = id;
    idInput.setAttribute("disabled", true);

    name.value = productToBeUpdated.name;
    price.value = productToBeUpdated.price;
    desc.value = productToBeUpdated.description;    
    outputImage.src = productToBeUpdated.image;

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

        loadProducts();

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
            
            loadProducts();
        }
    });
}

const sort = document.querySelector(".sort-selector");
const order = document.querySelector(".order-selector");

sort.addEventListener("change", () => {
    sortProducts();
});

order.addEventListener("change", () => {
    sortProducts();
    console.log("INside order");
});

function sortProducts() {
    const sortBy = sort.value;
    const sortOrder = order.value;
    console.log("Sort by", sortBy);
    console.log(sortOrder);

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

    loadProducts();
}


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
    }
    
}