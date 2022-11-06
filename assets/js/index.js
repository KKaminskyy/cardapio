let selector = selector => document.querySelector(`${selector}`)
let selectorAll = selectorAll => document.querySelectorAll(`${selectorAll}`)
let productClass = []
let modalQt = 1
let modalId
let cart = []
let currentPrice
let priceExtras = 0
let timer = 0

setInterval(()=>{
    if(timer >= 870){
        timer = 0
    }

    selector('.offers-area').style.left = `-${timer}px`
    timer += 290
},5000)

const productPrice = price => price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
})

const getProductClass = (n, productName) => productClass = productJson.filter(e => e.keyClass == n).map((item, index) => {
        
        if(n == 1){
            offerItem = selector('.models .offers-area--item').cloneNode(true)

            offerItem.querySelector('.item--img img').src = item.img.thumbnail
            offerItem.querySelector('.item-content--name').innerHTML = item.name
            offerItem.querySelector('.item-content--current-price').innerHTML = productPrice(item.price)
            selector(`.${productName}-area`).append(offerItem)

            offerItem.querySelectorAll('.offers-link').forEach(e => e.addEventListener('click', clickEvent =>{
                clickEvent.preventDefault()
                openModal(item.id ,item.keyClass, item.img.thumbnailBig, item.name, item.description, item.extras, item.price)
            }))

        }else{
            productItem = selector('.models .product-item').cloneNode(true)
            
            
            productItem.querySelector('.product-item--img').src = item.img.thumbnail
            productItem.querySelector('.product-item--info-name').innerHTML = item.name
            productItem.querySelector('.product-item--price').innerHTML = productPrice(item.price)
            selector(`.product-${productName} .product-area`).append(productItem)

            productItem.querySelectorAll('.product-btn-cart').forEach(e => e.addEventListener('click', clickEvent => {
                clickEvent.preventDefault()
                openModal(item.id ,item.keyClass, item.img.thumbnailBig, item.name, item.description, item.extras, item.price)
            }))
        }

        
        
})
getProductClass(1, 'offers')
getProductClass(2, 'burger')
getProductClass(3, 'pizza')

selectorAll('.product-window-info--cancel, .product-window-info--cancel-mobile').forEach(e => e.addEventListener('click', closeModal))

function openModal(id, key, imageModal, nameModal, descModal, extras, priceModal){
    selector('.product-window-img--img').src = imageModal
    selector('.product-window-info--name').innerHTML = nameModal
    selector('.product-window-info--ingredients').innerHTML = descModal

    modalQt = 1
    modalId = id
    updatePrice(modalQt)
    if(key == 3){
        selector('.product-window-info-extra--txt').innerHTML = 'Tamanho'
        selector('.product-window-info-extra-size').style.display = 'flex'

        selector('.product-window-info-extra-size .btn-extra--size.selected').classList.remove('selected')
        
        selectorAll('.product-window-info-extra-size .btn-extra--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected')
            }
        })


    }else{
        selector('.product-window-info-extra--txt').innerHTML = 'Adicional'
        selector('.product-window-info-extra-additional').style.display = 'flex'
    
        for(let i in extras){
            productExtra = selector('.extras-itens').cloneNode(true)
            productExtra.querySelector('.extra-additional--checkbox').setAttribute('data-key', i)
            productExtra.querySelector('.extra-name').innerHTML = extras[i].ingredient
            productExtra.querySelector('.extra-price').innerHTML = productPrice(extras[i].price)
            
            selector('.product-window-info-extra-additional').append(productExtra)
        }

        
    }
    selector('.product-window-info--price-area-price--actual-price').innerHTML = productPrice(priceModal)
    selector('.product-window-info--price-area-price-qtarea--qt').innerHTML = modalQt
    
    selector('.product-window-area').style.opacity = 0
    selector('.product-window-area').style.display = 'flex'
    setTimeout(()=> selector('.product-window-area').style.opacity = 1, 200)
}

function closeModal(){
    selector('.product-window-area').style.opacity = 0
    setTimeout(()=> selector('.product-window-area').style.display = 'none', 200)
    setTimeout(()=> {

        selectorAll('.product-window-info-extra-additional .extras-itens').forEach(e => e.remove())
        selector('.product-window-info-extra-additional').style.display = 'none'
        selector('.product-window-info-extra-size').style.display = 'none'
    }, 300)
}

selectorAll('.btn-extra--size').forEach(item => item.addEventListener('click', () => {
    selector('.btn-extra--size.selected').classList.remove('selected')
    item.classList.add('selected')
}))

selector('.btn-qtmenos-modal').addEventListener('click', ()=> {
    if(modalQt > 1){
        modalQt--
        updatePrice(modalQt)
        selector('.product-window-info--price-area-price-qtarea--qt').innerHTML = modalQt
    }
    
})


selector('.btn-qtmais-modal').addEventListener('click', ()=> {
    modalQt++
    updatePrice(modalQt)
    selector('.product-window-info--price-area-price-qtarea--qt').innerHTML = modalQt
})



selector('.product-window-info--add-button').addEventListener('click', ()=>{
    let size = parseInt(selector('.btn-extra--size.selected').getAttribute('data-key'))
    let extras = []
    selectorAll('.extra-additional--checkbox').forEach(e => {
        if(e.checked){
            extras.push(e.getAttribute('data-key'))
            return extras
        }
    })

    if(productJson[modalId].keyClass != 3){
        priceExtras = 0
        for(let i in extras){
           priceExtras += productJson[modalId].extras[extras[i]].price
        }
        updatePrice(modalQt, priceExtras)
    }

    let identifier = productJson[modalId].id+'@'+size
    let key = cart.findIndex(item=> item.identifier == identifier)
    if(key > -1){
        cart[key].qt += modalQt
        updatePrice(cart[key].qt)
    }else{
        cart.push({
            identifier,
            size,
            qt:modalQt,
            id: modalId,
            price: currentPrice
        })
    }
    
    updateCart()
    closeModal()
})

function updateCart(){

    openCart()
    selector('.cart .cart-itens').innerHTML = ''
    let total = 0

    for(let i in cart){
        let productItem = productJson.find(item=> item.id == cart[i].id)
        total += currentPrice
        let cartItem = selector('.models .cart-itens--item').cloneNode(true)
        cartItem.querySelector('.cart-itens--item--img').src = productItem.img.thumbnailBig
        cartItem.querySelector('.cart-itens--item-name').innerHTML = productItem.name
        cartItem.querySelector('.cart-itens--item-qtarea--qt').innerHTML = cart[i].qt
        cartItem.querySelector('.cart-btn-qtmenos').addEventListener('click', ()=>{
            let qnt = cart[i].qt > 1 ? cart[i].qt-- : cart.splice(i, 1)
            if(cart.length != 0){
                updatePrice(cart[i].qt)
            } 
            updateCart()
        })
        cartItem.querySelector('.cart-btn-qtmais').addEventListener('click', ()=>{
            cart[i].qt++
            updatePrice(cart[i].qt)
            updateCart()
        })
        selector('.cart-itens').append(cartItem)
    }

    selector('.cart-price-info--span').innerHTML = productPrice(total)
    
    
}

function updatePrice(quantidade, extras=0){
    console.log("Calcular valor "+extras)
    currentPrice = (productJson[modalId].price * quantidade) + extras
    selector('.product-window-info--price-area-price--actual-price').innerHTML = productPrice(currentPrice) 
}


selector('.open-cart').addEventListener('click', openCart)
selector('.close-cart').addEventListener('click', closeCart)
selector('.open-login').addEventListener('click', openLogin)
selector('.close-login').addEventListener('click', closeLogin)

function openLogin(){
    if(window.screen.width < 600){
        closeMenu()
    }
    
    if(selector('.cart').style.left == '-2vw'){
        closeCart()
    }
    setTimeout(()=> {
        selector('.login').style.display = 'flex'
        setTimeout(()=> selector('.login').style.left = '-2vw', 200)
    },20)
}

function closeLogin(){
    selector('.login').style.left = '100vw'
    setTimeout(()=> selector('.login').style.display = 'none', 300)
}

function openCart(){
    if(window.screen.width < 600){
        closeMenu()
    }

    if(selector('.login').style.left == '-2vw'){
        closeLogin()
    }
    setTimeout(()=> {
        selector('.cart').style.display = 'flex'
        setTimeout(()=>selector('.cart').style.left = '-2vw', 200)
    },20)
    
}

function closeCart(){
    selector('.cart').style.left = '100vw'
    setTimeout(()=> selector('.cart').style.display = 'none', 50)
}

selector('.gg-menu').addEventListener('click', openMenu)
selector('.menuHidden').addEventListener('click', closeMenu)


function openMenu(){
    closeCart()
    closeLogin()
    selector('nav').style.display = 'flex'
    selector('.gg-menu').style.display = 'none'
    selector('.menuHidden').style.display = 'block'
    setTimeout(()=> selector('nav').style.opacity = '1', 200)
}

function closeMenu(){
    selector('.menuHidden').style.display = 'none'
    selector('.gg-menu').style.display = 'block'
    selector('nav').style.opacity = '0'
    selector('nav').style.display = 'none'
}

window.addEventListener('resize', ()=> {
    if(window.screen.width >= 600 && selector('nav').style.display != 'flex'){
        openMenu()
        selector('.menuHidden').style.display = 'none'
    }else if (window.screen.width < 600 && selector('nav').style.display == 'flex'){
        console.log('fechou')
        closeMenu()
    }
})