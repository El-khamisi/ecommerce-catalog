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
                images: data
            })
        })).then(response => response.json())
}

