const form = document.querySelector("#AddProduct form");
const id = form.querySelector("#product-id");
const name = form.querySelector("#name");
const price = form.querySelector("#price");
const desc = form.querySelector("#description");
const imageInput = form.querySelector("#image");
const outputImage = form.querySelector("#output");

const productSection = document.querySelector("#Products .container");

// Load Product cards
function loadProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    productSection.innerHTML = "";

    products.forEach((product) => {

        const productItem = document.createElement("div");
        productItem.classList.add("card");
        productItem.innerHTML += ` <img src="${product.image || 'images/dummy-image.png'}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                    <h5 class="card-title">${product.id}. ${product.name}</h5>
                                    <p class="card-desc">${product.description}</p>
                                    <p class="card-price">₹ ${product.price} <span>/-</span> </p>
                                    <button class="btn btn-sm btn-warning edit" data-bs-toggle="modal" data-bs-target="#modal">Edit</button>
                                    <button class="btn btn-sm btn-danger delete">Delete</button>
                                </div>`;
        
        productSection.append(productItem);

        // Delete Event
        const deleteBtn = productItem.querySelector(".delete");
        deleteBtn.addEventListener("click", (e) => {
            deleteProduct(e);
        });

        // Edit Event
        const editBtn = productItem.querySelector(".edit");
        editBtn.addEventListener("click", (e) => {
            editProduct(e);
        });

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


form.addEventListener("submit", (e) => {
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
        showNotification();
    }

});

function showNotification() {
    const notification = document.querySelector(".notification");

    notification.style.display = "flex";

    setTimeout(()=>{
        notification.style.display = "none";
    }, 4000);
};

function AddProduct(product) {
    const productItem = document.createElement("div");
    productItem.classList.add("card");
    productItem.innerHTML = ` <img src="${product.image || 'images/dummy-image.png'} " class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${product.id}. ${product.name}</h5>
                                <p class="card-desc">${product.description}</p>
                                <p class="card-price">₹ ${product.price} <span>/-</span> </p>
                                <button class="btn btn-sm btn-warning edit"  data-bs-toggle="modal" data-bs-target="#modal">Edit</button>
                                <button class="btn btn-sm btn-danger delete">Delete</button>
                            </div>`;
    
    productSection.append(productItem);
    
    // Delete Event
    const deleteBtn = productItem.querySelector(".delete");
    deleteBtn.addEventListener("click", (e) => {
        deleteProduct(e);
    });

    // Edit Event
    const editBtn = productItem.querySelector(".edit");
    editBtn.addEventListener("click", (e) => {
        editProduct(e);
    });

}

// Edit Operation
function editProduct(event) {
    const productTitle = event.target.parentElement.childNodes[1].textContent;
    const index = productTitle.indexOf(".");
    const id = productTitle.slice(0, index);
    
    const productList = JSON.parse(localStorage.getItem("products"));
    const productToBeUpdated = productList.find(product => product.id === id);
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


    editForm.addEventListener("click", (e) => {
        e.preventDefault();

        editedProduct.name = name.value;
        editedProduct.price = price.value;
        editedProduct.description = desc.value;

        const foundIndex = productList.findIndex(product => product.id === id);
        console.log(foundIndex);
        // productList[foundIndex] = editProduct;

        // localStorage.setItem("products", JSON.stringify(productList));
    })
}


// Delete Operation
function deleteProduct(event) {

    const productTitle = event.target.parentElement.childNodes[1].textContent;
    const index = productTitle.indexOf(".");
    const id = productTitle.slice(0, index);

    const products = JSON.parse(localStorage.getItem("products"));

    swal({
        title: "Are you sure?",
        text: "You won't be able to recover this Product!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            const updatedProducts = products.filter(product => product.id !== id);

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            
            loadProducts();
        }
    });
}