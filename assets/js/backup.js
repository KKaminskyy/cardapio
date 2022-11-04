let selector = selector => document.querySelector(`${selector}`)
let selectorAll = selectorAll => document.querySelectorAll(`${selectorAll}`)
let productClass = []

const productPrice = price => price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
})

productJson.map( (item, index) => {

    const getProductClass = n => productClass = productJson.filter(e => e.keyClass == n)
    
    const adicionarItens = (keyClass, productName) => {
        getProductClass(keyClass)
        
        console.log(`
            =============== Desconstrução ===============
            Thumbnail: ${productClass}

        `)

        productItem = selector('.models .product-item').cloneNode(true)

        productItem.querySelector('.product-item--img').src = productClass[index].img.thumbnail
        productItem.querySelector('.product-item--info-name').innerHTML = productClass[index].name
        productItem.querySelector('.product-item--price').innerHTML = productPrice(productClass[index].price)

        selector(`.product-${productName} .product-area`).append(productItem)
    }


    getProductClass(1)
    let offerItem = selector('.models .offers-area--item').cloneNode(true)

    offerItem.setAttribute('data-key', productClass[index].id)

    offerItem.querySelector('.item--img img').src = productClass[index].img.thumbnail
    offerItem.querySelector('.item-content--name').innerHTML = productClass[index].name
    offerItem.querySelector('.item-content--current-price').innerHTML = productPrice(productClass[index].price)

    selector('.offers-area').append(offerItem)

    offerItem.querySelectorAll('.offers-link').forEach(e => e.addEventListener('click', item =>{
        item.preventDefault()
        
        selector('.product-window-area').style.opacity = 0
        selector('.product-window-area').style.display = 'flex'
        setTimeout(()=> selector('.product-window-area').style.opacity = 1, 200)
    }))

    adicionarItens(2, 'burger')
    adicionarItens(3, 'pizza')

})

document.querySelector('.product-window-info--cancel').innerHTML = 'a'

function closeModal(){
    console.log('CALL')
    selector('.product-window-area').style.opacity = 0
    setTimeout(()=> selector('.product-window-area').style.display = 'none', 200)
}

