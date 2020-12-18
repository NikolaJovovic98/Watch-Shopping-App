
let productData = [];
let buyProductData = [];
const total = document.getElementById('total');

function checkInputData(e, callbackFunction) {
    e.preventDefault();
    const productName = document.getElementById('product-name').value;
    const productDesc = document.getElementById('product-desc').value;
    const productImageUrl = document.getElementById('product-image').value;
    const productPrice = document.getElementById('product-price').value;
    if (productName === "" || productDesc === "" || productImageUrl === "" || productPrice === "") {
        alert("Must fill all fields.")
    } else {
        callbackFunction(productName, productDesc, productImageUrl, productPrice, updateLocalStorage);
    }
}

function fillProductData(name, desc, image, price, callbackFunction) {
    let newObject =
    {
        p_Name: name,
        p_Desc: desc,
        p_Image: image,
        p_Price: price
    }
    addOnePanel(newObject);
    productData.push(newObject);
    callbackFunction(productData);
}

function updateLocalStorage(productDataFilledObject) {
    localStorage.setItem("product_ls", JSON.stringify(productDataFilledObject));
}

function addOnePanel(productInfo) {
    document.getElementById("list-section").innerHTML += `
    <div class="list-panel">
        <img src="${productInfo.p_Image}" alt="Watch Image">
        <h3>${productInfo.p_Name}</h3>
        <h4>${productInfo.p_Price} <strong>&euro;</strong></h4>
        <span>${productInfo.p_Desc}</span>
        <button  class="button-class details-button">Details</button>
        <button  class="button-class buy-button">Buy</button>
    </div>
`;
}

function addPanel(product) {
    const productObject = JSON.parse(product);
    productObject.forEach(product => {
        document.getElementById("list-section").innerHTML += `
        <div class="list-panel">
            <img src="${product.p_Image}" alt="Watch Image">
            <h3>${product.p_Name}</h3>
            <h4>${product.p_Price} <strong>&euro;</strong></h4>
            <span>${product.p_Desc}</span>
            <button  class="button-class details-button">Details</button>
            <button  class="button-class buy-button">Buy</button>
        </div>
    `;
    });
}


function getModalData(e, callbackFunction) {
    const data = {
        name: e.target.parentElement.children[1].innerText,
        imgURL: e.target.parentElement.children[0].src,
        price: e.target.parentElement.children[2].innerText,
        desc: e.target.parentElement.children[3].innerText,
    }
    callbackFunction(data.name, data.imgURL, data.price, data.desc);
}

function getModalDataBUY(e, callbackFunction) {

    const data = {
        name: e.target.parentElement.children[1].innerText,
        imgURL: e.target.parentElement.children[0].src,
        price: e.target.parentElement.children[2].innerText,
        desc: e.target.parentElement.children[3].innerText,
    }
    callbackFunction(data.name, data.imgURL, data.price, data.desc);
    buyProductData.push(data);
    localStorage.setItem("buy_product_ls", JSON.stringify(buyProductData));
    total.innerText = addInt(total.innerText, data.price);
}

function updateModalData(name, imgUrl, price, desc) {
    document.getElementById('modal-name').innerText = name;
    document.getElementById('modal-image').src = imgUrl;
    document.getElementById('modal-price').innerText = price;
    document.getElementById('modal-desc').innerText = desc;
}

function addToBuyPanel(name, imageUrl, price, desc) {
    document.getElementById('buy-section-panel').innerHTML += `
        <div class="buy-item">
                    <div class="buy-item-info">
                        <p>${name}</p>
                        <p>${price}</p>
                        <div class="buy-item-add-remove-amount">
                            <button class="button-class minus-amount">&minus;</button>
                             <span>1</span>
                            <button class="button-class plus-amount">&plus;</button>
                        </div>
                    </div> 
                <div class="buy-item-image">
                    <img src="${imageUrl}" alt="Watch Image">
                </div>
        </div>
    `;
}

function addToBuyPanelLS(buyProductObjectsArray) {
    let buyProduct = JSON.parse(buyProductObjectsArray);
    buyProduct.forEach(product => {
        document.getElementById('buy-section-panel').innerHTML += `
            <div class="buy-item">
                        <div class="buy-item-info">
                            <p>${product.name}</p>
                            <p>${product.price}</p>
                            <div class="buy-item-add-remove-amount">
                                <button class="button-class minus-amount">&minus;</button>
                                <span>1</span>
                                <button class="button-class plus-amount">&plus;</button>
                            </div>
                        </div> 
                    <div class="buy-item-image">
                        <img src="${product.imgURL}" alt="Watch Image">
                    </div>
            </div>
     `;
        total.innerText = addInt(total.innerText, product.price);
    });
}

function checkAmount(amount) {
    if (parseInt(amount.target.parentElement.parentElement.children[2].children[1].innerText) > 9) return true;
    return false;
}

function checkAmountDivide(amount) {
    if (parseInt(amount.target.parentElement.parentElement.children[2].children[1].innerText) === 1) return true;
    return false;
}

function addToTotal(priceToAdd, productAmount) {
    total.innerText = addInt(total.innerText, priceToAdd.substr(0, priceToAdd.indexOf(' ')));
    productAmount.target.parentElement.parentElement.children[2].children[1].innerText =
        parseInt(productAmount.target.parentElement.parentElement.children[2].children[1].innerText) + 1;

}

function removeFromTotal(priceToRemove, productAmount) {
    total.innerText = divideInt(total.innerText, priceToRemove.substr(0, priceToRemove.indexOf(' ')));
    productAmount.target.parentElement.parentElement.children[2].children[1].innerText =
        parseInt(productAmount.target.parentElement.parentElement.children[2].children[1].innerText) - 1;
}

function removeFromTotalAndFromLS(priceToRemove, productAmount) {
    total.innerText = divideInt(total.innerText, priceToRemove.substr(0, priceToRemove.indexOf(' ')));
    productAmount.target.parentElement.parentElement.children[2].children[1].innerText =
        parseInt(productAmount.target.parentElement.parentElement.children[2].children[1].innerText) - 1;
    deleteProductFromLocalStorage(buyProductData, productAmount.target.parentElement.parentElement.children[0].innerText);
}

function deleteProductFromLocalStorage(productArray, itemToCompare) {
    productArray.forEach(buy_product => {
        if (buy_product.name === itemToCompare) {
            let index = productArray.indexOf(buy_product);
            productArray.splice(index, 1);
        }
    });
    localStorage.setItem("buy_product_ls", JSON.stringify(productArray));
}

function checkIfProductIsInBuyList(e) {
    let flag = false
    buyProductData.forEach(product => {
        if (product.name === e.target.parentElement.children[1].innerText) {
            flag = true;
        };
    });
    return flag;
}

function showModal() {
    document.querySelector('.modal-bg').classList.add('modal-bg-activate');
}

function showPurchaseModal() {
    document.querySelector('.modal-bg-purchase').classList.add('modal-bg-purchase-activate');
}

function closeModal() {
    document.querySelector('.modal-bg').classList.remove('modal-bg-activate');
}

function closePurchaseModal() {
    document.querySelector('.modal-bg-purchase').classList.remove('modal-bg-purchase-activate');
}

function addInt(num1, num2) {
    return parseInt(num1) + parseInt(getNumFromStr(num2));
}

function divideInt(num1, num2) {
    return parseInt(num1) - parseInt(getNumFromStr(num2));
}

function getNumFromStr(string) {
    return string.match(/\d+/);
}

function init() {
    window.onload = () => {
        if (localStorage.getItem("product_ls") === null) {
            productData = productData;
        } else {
            productData = JSON.parse(localStorage.getItem("product_ls"));
            addPanel(localStorage.getItem("product_ls"));
            loadDOM();
        }
    }
    document.getElementById('add-button')
        .addEventListener('click', (e) => {
            checkInputData(e, fillProductData);
            loadDOM();
        });
}

function loadDOM() {
    document.querySelectorAll('.button-class.details-button')
        .forEach(detailbutton => {
            detailbutton.addEventListener('click', (e) => {
                showModal();
                getModalData(e, updateModalData);
            });
        });
    document.querySelectorAll('.button-class.buy-button')
        .forEach(detailbutton => {
            detailbutton.addEventListener('click', (e) => {
                if (!checkIfProductIsInBuyList(e)) {
                    getModalDataBUY(e, addToBuyPanel);
                    loadDOMplusMinus();
                } else {
                    alert("Product already bought.")
                    return;
                }

            });
        });
    document.getElementById('modal-close')
        .addEventListener('click', closeModal)
    if (localStorage.getItem("buy_product_ls") === null) {
        buyProductData = buyProductData;
    } else {
        buyProductData = JSON.parse(localStorage.getItem("buy_product_ls"));
        addToBuyPanelLS(localStorage.getItem("buy_product_ls"));
        loadDOMplusMinus();
        activatePurchaseButton();
    }
}

function loadDOMplusMinus() {
    document.querySelectorAll('.button-class.plus-amount')
        .forEach(plusButtons => {
            plusButtons.addEventListener('click', (e) => {
                if (!checkAmount(e)) {
                    addToTotal(e.target.parentElement.parentElement.children[1].innerText, e);
                } else {
                    alert("Maximum Product Amount Reached");
                    return;
                }
            });
        });
    document.querySelectorAll('.button-class.minus-amount')
        .forEach(minusButtons => {
            minusButtons.addEventListener('click', (e) => {
                if (!checkAmountDivide(e)) {
                    removeFromTotal(e.target.parentElement.parentElement.children[1].innerText, e);
                } else {
                    removeFromTotalAndFromLS(e.target.parentElement.parentElement.children[1].innerText, e);
                    e.target.parentElement.parentElement.parentElement.style.display = "none";
                    return;
                }
            });
        });
}

function activatePurchaseButton(){

    document.getElementById("purchase-button")
            .addEventListener("click",()=>{
                if(parseInt(total.innerText) === 0){
                    alert("No products in shopping cart.")
                }else {
                    document.getElementById("modal-purchase-amount").innerText = total.innerText;
                    showPurchaseModal();
                }
            });
    document.getElementById("modal-close-purchase")
            .addEventListener("click",closePurchaseModal)        
}

init();


//Kad se zatvori prozor localStorage se brise 
//da se napravi modal kad se klikne purchase koji provjerava amount ima li ga ako ima izbaci modal 
//sa podacima koju su u buy listu znaci slike itd