'use strict';

(() => {

    const STORAGE_KEY =
        'taoufikmoda_products';

    const WHATSAPP_NUMBER =
        '212664380123';

    const ADMIN_CODE =
        'taoufik2026';


    const $ = id =>
        document.getElementById(id);


    const generateId = () =>
        'product_' +
        Math.random()
            .toString(36)
            .slice(2, 10);


    let products =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY) || 'null'
        ) || [

            {
                id: generateId(),

                name: 'Robe élégante',

                price: 850,

                category: 'Robes',

                image: '',

                desc:
                    'Robe élégante pour vos occasions.'
            },

            {
                id: generateId(),

                name: 'Kaftan moderne',

                price: 1200,

                category: 'Kaftans',

                image: '',

                desc:
                    'Kaftan moderne et raffiné.'
            }

        ];


    let selectedFilter =
        'Tous';


    let uploadedImage =
        '';


    /* =====================================================
       SAVE PRODUCTS
       ===================================================== */

    function saveProducts() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(products)
        );

    }


    /* =====================================================
       PRICE
       ===================================================== */

    function formatPrice(price) {

        return Number(price)
            .toLocaleString('fr-FR')
            + ' DH';

    }


    /* =====================================================
       FILTERS
       ===================================================== */

    function renderFilters() {

        const container =
            $('collectionFilters');


        container.innerHTML =
            '';


        const categories = [

            'Tous',

            ...new Set(
                products.map(
                    product =>
                        product.category
                )
            )

        ];


        categories.forEach(
            category => {

                const button =
                    document.createElement(
                        'button'
                    );


                button.className =
                    'filter-chip' +
                    (
                        category ===
                        selectedFilter
                            ? ' is-active'
                            : ''
                    );


                button.textContent =
                    category;


                button.onclick = () => {

                    selectedFilter =
                        category;

                    renderFilters();

                    renderProducts();

                };


                container.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       PRODUCTS
       ===================================================== */

    function renderProducts() {

        const grid =
            $('productGrid');


        const filteredProducts =
            selectedFilter === 'Tous'

                ? products

                : products.filter(
                    product =>
                        product.category ===
                        selectedFilter
                );


        grid.innerHTML =
            '';


        $('emptyState').hidden =
            filteredProducts.length > 0;


        filteredProducts.forEach(
            product => {


                const card =
                    document.createElement(
                        'article'
                    );


                card.className =
                    'product-card';


                card.innerHTML = `

                    <div
                        class="product-media"
                        style="background-image:url('${product.image}')">
                    </div>

                    <div class="product-body">

                        <span class="product-cat">
                            ${product.category}
                        </span>

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="product-desc">
                            ${product.desc || ''}
                        </p>

                        <div class="product-foot">

                            <strong
                                class="product-price">

                                ${formatPrice(product.price)}

                            </strong>

                            <button
                                class="product-order">

                                Commander

                            </button>

                        </div>

                    </div>

                `;


                card
                    .querySelector(
                        '.product-order'
                    )
                    .onclick = () => {


                        $('oArticle').value =
                            product.name;


                        $('commande')
                            .scrollIntoView({

                                behavior:
                                    'smooth'

                            });

                    };


                grid.appendChild(card);

            }
        );

    }


    /* =====================================================
       ORDER OPTIONS
       ===================================================== */

    function renderOrderOptions() {

        const select =
            $('oArticle');


        select.innerHTML =
            '<option value="">Choisir un article</option>';


        products.forEach(
            product => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    product.name;


                option.textContent =
                    product.name +
                    ' — ' +
                    formatPrice(
                        product.price
                    );


                select.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       ADMIN LIST
       ===================================================== */

    function renderAdminList() {

        const list =
            $('adminList');


        list.innerHTML =
            '';


        products.forEach(
            product => {


                const item =
                    document.createElement(
                        'div'
                    );


                item.className =
                    'admin-list-item';


                item.innerHTML = `

                    <span>

                        ${product.name}
                        —
                        ${formatPrice(product.price)}

                    </span>

                    <button>
                        Supprimer
                    </button>

                `;


                item
                    .querySelector('button')
                    .onclick = () => {


                        products =
                            products.filter(
                                current =>
                                    current.id !==
                                    product.id
                            );


                        refresh();

                    };


                list.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       REFRESH
       ===================================================== */

    function refresh() {

        saveProducts();

        renderFilters();

        renderProducts();

        renderOrderOptions();

        renderAdminList();

    }


    /* =====================================================
       ADMIN OPEN
       ===================================================== */

    $('adminToggleLink').onclick =
        event => {

            event.preventDefault();


            const panel =
                $('adminPanel');


            if (panel.hidden) {


                const code =
                    prompt(
                        'Code d’accès :'
                    );


                if (code !== ADMIN_CODE) {

                    alert(
                        'Code incorrect.'
                    );

                    return;

                }


                panel.hidden =
                    false;


            } else {

                panel.hidden =
                    true;

            }

        };


    /* =====================================================
       CLOSE ADMIN
       ===================================================== */

    $('closeAdmin').onclick =
        () => {

            $('adminPanel').hidden =
                true;

        };


    /* =====================================================
       IMAGE UPLOAD
       ===================================================== */

    $('pImageFile').onchange =
        event => {


            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                () => {


                    uploadedImage =
                        reader.result;


                    $('imagePreview').src =
                        uploadedImage;


                    $('imagePreview').hidden =
                        false;


                    $('imagePreviewRow').hidden =
                        false;

                };


            reader.readAsDataURL(
                file
            );

        };


    /* =====================================================
       REMOVE IMAGE
       ===================================================== */

    $('removeImage').onclick =
        () => {

            uploadedImage =
                '';

            $('imagePreview').src =
                '';

            $('imagePreview').hidden =
                true;

            $('imagePreviewRow').hidden =
                true;

            $('pImageFile').value =
                '';

        };


    /* =====================================================
       ADD PRODUCT
       ===================================================== */

    $('productForm').onsubmit =
        event => {


            event.preventDefault();


            const product = {

                id:
                    generateId(),

                name:
                    $('pName')
                        .value
                        .trim(),

                price:
                    Number(
                        $('pPrice')
                            .value
                    ),

                category:
                    $('pCategory')
                        .value
                        .trim(),

                image:
                    uploadedImage ||
                    $('pImage')
                        .value
                        .trim(),

                desc:
                    $('pDesc')
                        .value
                        .trim()

            };


            products.push(
                product
            );


            refresh();


            event.target.reset();


            uploadedImage =
                '';


            $('imagePreview').src =
                '';


            $('imagePreview').hidden =
                true;


            $('imagePreviewRow').hidden =
                true;

        };


    /* =====================================================
       EXPORT CATALOG
       ===================================================== */

    $('exportCatalog').onclick =
        () => {


            const file =
                new Blob(

                    [
                        JSON.stringify(
                            products,
                            null,
                            2
                        )
                    ],

                    {
                        type:
                            'application/json'
                    }

                );


            const link =
                document.createElement(
                    'a'
                );


            link.href =
                URL.createObjectURL(
                    file
                );


            link.download =
                'products.json';


            link.click();


            URL.revokeObjectURL(
                link.href
            );

        };


    /* =====================================================
       WHATSAPP MESSAGE
       ===================================================== */

    function getWhatsAppMessage() {

        return `

Bonjour Taoufik Moda,

Je souhaite commander :

Article : ${$('oArticle').value}
Quantité : ${$('oQty').value}
Boutique : ${$('oStore').value}
Nom : ${$('oName').value}
Téléphone : ${$('oPhone').value}
Message : ${$('oMessage').value}

`;

    }


    /* =====================================================
       WHATSAPP LINK
       ===================================================== */

    function updateWhatsAppLink() {

        $('whatsappBtn').href =
            'https://wa.me/' +
            WHATSAPP_NUMBER +
            '?text=' +
            encodeURIComponent(
                getWhatsAppMessage()
            );

    }


    $('orderForm').oninput =
        updateWhatsAppLink;


    /* =====================================================
       ORDER
       ===================================================== */

    $('orderForm').onsubmit =
        event => {


            event.preventDefault();


            updateWhatsAppLink();


            $('orderConfirm').hidden =
                false;

        };


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    $('burgerBtn').onclick =
        () => {


            $('mainNav')
                .classList
                .toggle(
                    'is-open'
                );


        };


    /* =====================================================
       YEAR
       ===================================================== */

    $('year').textContent =
        new Date().getFullYear();


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    refresh();

    updateWhatsAppLink();

})();