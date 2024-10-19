const list = document.getElementById('list');

function products() {
    const search_params = document.getElementById('q');
    const others_params = document.getElementById('others');

    let url = 'http://localhost:3000/products?'
    if (search_params.value != '') {
        url += `q=${search_params.value}&`
    }
    if (others_params.value != '') {
        url += `others=${others_params.value}&`
    }



    return fetch(url,).then(response => response.json()).then(result => {

        list.innerHTML = ""
        result.data.forEach(product => {
            const dev = document.createElement('dev')
            dev.classList = 'col'

            let attributes = ""
            if (product.attributes) {
                product.attributes.forEach(attr => {
                    if (attr.type == 'color') {
                        let vals = ""
                        attr.values.forEach(val => vals += `<li class="badge rounded-pill mx-2" style="background: ${val}">${val}</li>`)
                        attributes += `<ul class="list-unstyled d-flex align-items-center mb-2">
                        <li>${attr.name}</li>
                         <li>${vals}</li>
                    </ul>`
                    } else {
                        let vals = ""
                        attr.values.forEach(val => vals += `<li class="mx-2">${val}</li>`)
                        attributes += `<ul class="list-unstyled d-flex align-items-center mb-2">
                        <li>${attr.name}</li>
                         <li>${vals}</li>
                    </ul>`
                    }
                })
            }
            dev.innerHTML = `  
            <div class="card h-100 shadow-sm"> 
                <img src="${product.images[0]}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div class="mb-3"> 
                        <span class"card-title">${product.name}</span> 
                        <span class="float-end price-hp">${product.price}</span> 
                    </div>
                    <h5 class="card-text">${product.description}</h5>
                    ${attributes}
                    
                </div>
            </div>
        `
            list.appendChild(dev)
        })
    })
}

const createForm = document.getElementById('createForm')
createForm.addEventListener('submit', e => {
    e.preventDefault()
    createProduct().then(data => document.getElementById('reqStatus').innerText = JSON.stringify(data))
})

function createProduct() {

    const name = document.getElementById('inputName').value
    const description = document.getElementById('inputDesc').value
    const price = document.getElementById('inputPrice').value
    const images = document.getElementById('inputimages').files
    const attrs = document.querySelectorAll('.inputAttrs')

    let attributes = []
    for (attr of attrs) {
        const type = attr.children[2].value
        const name = attr.children[1].children[0].value
        const values = attr.children[1].children[1].value
        attributes.push({ type, name, values: values.split(',') })
    }

    const formData = new FormData()
    for (image of images) {
        formData.append('files', image)
    }

    return fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    }).then(res => res.json()).then(data =>
        fetch('http://localhost:3000/products', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                description,
                price,
                attributes,
                images: data
            })
        })).then(response => response.json())
}


const attrsDiv = document.getElementById('attrsDiv')
function moreAttr() {
    let child = document.createElement('div')
    child.className = 'inputAttrs'

    child.innerHTML = `<label for="inputAttrs" class="col-sm-2 col-form-label">Product Custom Attributes</label>
    <div class="col-sm-5">
        <input type="text" class="form-control"  placeholder="Enter Attributes Name">
        <input type="text" class="form-control"  placeholder="Enter Attributes Values">
    </div>
    <select class="col-sm-5" class="displayType" name="method">
        <option value="color" selected>Color Dots</option>
        <option value="radio">Choose one</option>
        <option value="dropdown">Dropdown Menu</option>
        <option value="checkbox">Multi-choice</option>
    </select>`

    attrsDiv.appendChild(child)

}