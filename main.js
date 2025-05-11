function copyright(){
    const date = document.getElementById('date');
    const year = new Date().getFullYear();
    if(date) {
        date.innerHTML = year;
    }
};

async function loadJson(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
         return data;
        } catch (error) {
            throw new Error(`Error loading JSON: ${error.message}`);
        
    }
}

/*TO ADD AND REMOVE THE ACTIVE CLASS ON THE CART-BTN AND THE PLUS-MINUS BTN*/ 

function toggleButton() {
  const grid = document.querySelector('.grid');

  
  //To handle clicks on cart button
    grid.addEventListener("click", (e) => {
  
    const cartBtn = e.target.closest(".cart-btn");
    

    //Use nextElementSibling to get the plusMinubtn after the cart-btn
    if (cartBtn) {
      const plusMinusCart = cartBtn.nextElementSibling;

      
    if (plusMinusCart) {
      if (cartBtn.classList.contains("active")) {

        cartBtn.classList.remove("active");
        plusMinusCart.classList.add("active");

        //Add items to cart
        const gridItem = cartBtn.closest(".grid-item");
        addToCart(gridItem);

        //const cartSidebar = document.querySelector('.side-wrap');
        //console.log(cartSidebar, "the sidebar is available");

      }
      updateUI();
      updateTotal();
    }
  }
  });
}


function addToCart(gridItem){
  
  const itemName = gridItem.querySelector('.dessert-name').innerText;
  const itemPrice = parseFloat(gridItem.querySelector('.price').innerText.replace("$", ""));
  let currentQuantity = 1;

  //Highlight image with red border when item is added
  gridItem.querySelectorAll('.mobile, .desktop').forEach(img => {
    img.style.border = "2px solid red";
  });

  //New cart item markup
  const cartContents = document.createElement('article');
    cartContents.classList.add('cart-contents');
    cartContents.setAttribute('data-label', `${itemName}`);
    cartContents.innerHTML = `
          <div class="cart-quantity">
            <p class="cart-heading">${itemName}</p>
            <span class="quantity">${currentQuantity}x</span>
            <span class="each">@$${itemPrice.toFixed(2)}</span>
            <span class="item-total">$${(itemPrice * currentQuantity).toFixed(2)}</span>
          </div>
          <button class="remove-item">
            <span class="access-hidden">Remove Item</span>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
          </button>
          
    `;

    //Append to the sidebar

    const cartSidebar = document.querySelector('.container-cart');
      if(cartSidebar){
        cartSidebar.appendChild(cartContents);
      }

  
      const cartButton = gridItem.querySelector('.cart-btn');
      const plusMinusCart = gridItem.querySelector('.plus-minus-cart');
      const dataGrid = gridItem.getAttribute(`${itemName}`);
      const dataContents = cartContents.getAttribute(`${itemName}`);

      //updateTotal();



    //Add functionality to remove the item from cart
    const removeButton = cartContents.querySelector(".remove-item");
    const itemQuantitySpan = cartContents.querySelector(".quantity");
    const itemTotalSpan = cartContents.querySelector(".item-total");
    const itemQuantity = gridItem.querySelector('.item-quantity');
        

    removeButton.addEventListener("click", () => {
        cartSidebar.removeChild(cartContents);

        //Remove the red border
        gridItem.querySelectorAll('.mobile, .desktop').forEach(img =>{
          img.style.border = "none";
        })

        if(dataGrid == dataContents) {
          plusMinusCart.classList.remove('active');
          cartButton.classList.add('active');
          itemQuantity.innerHTML = 1;
        }
        updateUI();
        updateTotal();
       });


      //Add functionality for increment and decrement quantity

  let totalItemCount = parseInt(document.querySelector('#totalItemCount').innerText.replace(/\D/g, "")) || 0; // Global variable to track total count 
  
  const incrementBtn = gridItem.querySelector(".increment");
  const decrementBtn = gridItem.querySelector(".decrement");

 
  incrementBtn.addEventListener("click", () => {
    if(currentQuantity === 1){
      totalItemCount++;
    }
    currentQuantity++;
    totalItemCount++; // Increase total count

    itemQuantitySpan.innerText = `${currentQuantity}x`;
    itemTotalSpan.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
    itemQuantity.innerText = currentQuantity;

    updateUI();
    updateTotal();

  });

  decrementBtn.addEventListener("click", () => {
    if(currentQuantity > 1) {
      currentQuantity--;
      totalItemCount--; // Decrease total count
    }

     totalItemCount = Math.max(0, totalItemCount - 1); 
      itemQuantitySpan.innerText = `${currentQuantity}x`;
      itemTotalSpan.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
      itemQuantity.innerText = currentQuantity;
     
     // console.log("currentQuantity:", currentQuantity, "totalItemCount:", totalItemCount);
       updateUI();
       updateTotal();
  });

};
  function updateUI() {

    totalItemCount = 0;
    document.querySelectorAll('.cart-contents .quantity').forEach(item =>{
      totalItemCount += parseInt(item.innerText.replace(/\D/g, "")) || 0;

    });

    const totalItemCountElement = document.querySelector('#totalItemCount');
       if (totalItemCountElement) {
          totalItemCountElement.innerText = `Your Cart (${totalItemCount})`;
       } 

    //To control the empty and full cart

    const emptyCart = document.querySelector('.empty_cart');
    const fullCart = document.querySelector('.full-cart');
        
    if(emptyCart && fullCart) {
      if(totalItemCount > 0){
        emptyCart.style.display = 'none';
        fullCart.style.display = 'block';
      }else{
        emptyCart.style.display = 'block';
        fullCart.style.display = 'none';
      }
    }
  }

  //TO TOTAL THE FULL CART ORDER

  function updateTotal() {
    let total = 0;
    const itemTotals = document.querySelectorAll('.item-total');
    

      itemTotals.forEach(item =>{
      //  console.log('item-total textContent:', item.textContent);
        total += parseFloat(item.textContent.replace(/[^0-9.-1]+/g, "")) || 0;
      });

       // total += parseFloat(item.textContent) || 0;
   // });

    const totalAmount = document.querySelector('.total-amount');
     if(totalAmount){
      totalAmount.textContent = `$${total.toFixed(2)}`;
     // console.log("Updated total amount:", totalAmount.textContent);
     }//else{
      //console.log("element with class .total-amount not found");
    // }
 }// Call the function initially
     updateTotal();

  




document.addEventListener('DOMContentLoaded', () => {
    copyright();
    loadJson('data.json')
        .then(data => {
            const grid = document.querySelector('.grid');
            data.forEach((item) => {
            const article = document.createElement('article');
                article.classList.add('grid-item');
                article.setAttribute('data-label', `${item.name}`);
                let itemQuantity = 1;
                article.innerHTML = `
                
      <div class="img-container">
        <img class="mobile" src="${item.image.mobile}" width="378" height="245" alt="${item.name}">
        <img class="desktop" src="${item.image.desktop}" alt="${item.name}">
        <img class="thumbnail hidden" src="${item.image.thumbnail}" alt="${item.name}">
      </div>
      <div class="btn-container">
        <button class="cart-btn active">
          <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>
          <span>Add to Cart</span>
        </button>
      
      <div class="plus-minus-cart">
        <span class="access-hidden">Cart Quantity</span>

        <button class="add-less decrement">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="" d="M0 .375h10v1.25H0V.375Z"/></svg>
        </button>

        <span class="item-quantity">${itemQuantity}</span>

        <button class="add-less increment">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
        </button>
      </div>
    </div>

    <div class="menu">
      <p class="dessert-item">${item.category}</p>
      <h2 class="dessert-name">${item.name}</h2>
      <p class="price">$${item.price.toFixed(2)}</p>
    </div>
    </article>
   
       `;
       grid.appendChild(article);

              updateTotal();

            });

            toggleButton();
           // updateUI();
           // updateTotal();


        })
        .catch(error => {
            console.error('Error loading JSON data: ', error);
        })

        
        
});


 //TO OPEN THE MODAL
const confirmBtn = document.querySelector('.confirm');
const modalBtn =document.querySelector('.modal');

confirmBtn.addEventListener('click', openModal);

function openModal(){
  if(modalBtn) {
    modalBtn.style.display ="block";
  }else{
    console.error('modal element not found');
  }
}

const modalContainerCart = document.querySelector('.modal-container-cart');
const modalTotal = document.querySelector('.modal-total-amount');

confirmBtn.addEventListener('click', () => {
  modalContainerCart.innerHTML = ""; //CLEAR PREVIOUS DATA
  let totalAmount = 0;

  document.querySelectorAll('.cart-contents').forEach(cartItem => {
    const itemName = cartItem.getAttribute("data-label");
    const quantity = cartItem.querySelector('.quantity').textContent;
    const eachPrice = cartItem.querySelector('.each').textContent.replace("@$", "");
    const itemTotal = cartItem.querySelector('.item-total').textContent.replace("$", "");

    totalAmount += parseFloat(itemTotal);

    const gridItem = [...document.querySelectorAll(".grid-item")].find(
      item => item.getAttribute("data-label") === itemName
         );
  
    
    const imgSrc = gridItem ? gridItem.querySelector(".thumbnail").src : "placeholder.jpg";
    const modalItem = document.createElement("div");
    modalItem.classList.add("modal-container-cart");
    modalItem.innerHTML = `
      
      <div class="modal-item-details">
      <div class="flex-thumbnail">
        <img class="thumbnail" src="${imgSrc}" alt="${itemName}">
      </div>
      <div class="modal-menu">
         <p class="modal-cart-heading">${itemName}</p>
         <span class="modal-quantity">${quantity}&nbsp;</span>
         <span class="modal-each"> @ $${eachPrice}</span>
       </div>
        <span class="modal-item-total">$${parseFloat(itemTotal).toFixed(2)}</span>
      </div>

    `;
      modalContainerCart.appendChild(modalItem);
      
      modalTotal.textContent = `$${totalAmount.toFixed(2)}`;
      modalBtn.classList.remove("hidden");
  });

});

 const closeModal = document.querySelector('#cart-modal');
 
  // When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == closeModal) {
    closeModal.style.display = "none";
  }
} 


//RESET FULL-CART
const newOrderBtn = document.querySelector('.new-order');
const sideHeaderCount = document.querySelector('.side-header');
const cartContents = document.querySelector('#container-cart');
const resetTotalAmount = document.querySelector('#total-amount');


const emptyCart = document.querySelector('.empty_cart');
const fullCart = document.querySelector('.full-cart');

const cartBtnActive = document.querySelector(".cart-btn");

 

newOrderBtn.addEventListener('click', function() {

  console.log('newOrderBtn');
  sideHeaderCount.innerHTML = "";
  cartContents.innerHTML = "";
  resetTotalAmount.innerHTML = "";
  fullCart.style.display = 'none';
  emptyCart.style.display = 'block';
  modalBtn.style.display = 'none';
  

 // Remove red border dynamically set on .desktop and .mobile
 document.querySelectorAll('.desktop, .mobile').forEach(element => {
  element.style.border = "none";
});

// Remove 'active' class from .plus-minus-cart
document.querySelectorAll('.plus-minus-cart').forEach(element => {
  element.classList.remove('active');
});


// Add 'active' class to .cart-btn
 document.querySelectorAll(".cart-btn").forEach(element => {
   element.classList.add("active");
 });

 // Reset all .item-quantity elements to 1
 document.querySelectorAll('.item-quantity').forEach(quantityField => {
  quantityField.textContent = "1"; // Sets the input field back to 1
});




const modal = document.querySelector('.modal'); // Select the modal dynamically
  if(modal) {
    modal.classList.add('hidden'); // Ensure 'hidden' is correctly applied
    }
});

