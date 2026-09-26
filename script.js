/* =========================================================
   TAOUFIK MODA — LOGIQUE DU SITE
   ========================================================= */

(function () {

  "use strict";


  const STORAGE_KEY =
    "taoufikmoda_products";


  const WHATSAPP_NUMBER =
    "212664380123";


  const ADMIN_CODE =
    "taoufik2026";


  function cryptoId() {

    return (
      "p_" +
      Math.random()
        .toString(36)
        .slice(2,10)
    );

  }


  const defaultProducts = [

    {
      id: cryptoId(),
      name:"Kaftan brodé Ivoire",
      price:2400,
      category:"Kaftans",
      store:"Guéliz — Marrakech",
      image:"",
      desc:"Broderie main sur soie, coupe fluide, finitions dorées."
    },

    {
      id: cryptoId(),
      name:"Robe Soirée Bordeaux",
      price:1650,
      category:"Robes",
      store:"Maârif — Casablanca",
      image:"",
      desc:"Velours structuré, dos drapé, longueur au sol."
    },

    {
      id: cryptoId(),
      name:"Ceinture Cuir & Laiton",
      price:380,
      category:"Accessoires",
      store:"Agdal — Rabat",
      image:"",
      desc:"Cuir pleine fleur, boucle laiton brossé fait main."
    }

  ];


  function getProducts() {

    try {

      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );


      if (!raw) {

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(defaultProducts)
        );

        return defaultProducts.slice();

      }


      return JSON.parse(raw);

    }
    catch (e) {

      return defaultProducts.slice();

    }

  }


  function saveProducts(products) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
      );

    }
    catch (e) {

      console.warn(
        "Impossible d'enregistrer les articles :",
        e
      );

    }

  }


  let products =
    getProducts();


  let activeFilter =
    "Tous";


  let usingPublishedCatalog =
    false;


  const productGrid =
    document.getElementById(
      "productGrid"
    );


  const emptyState =
    document.getElementById(
      "emptyState"
    );


  const filtersWrap =
    document.getElementById(
      "collectionFilters"
    );


  const orderArticleSelect =
    document.getElementById(
      "oArticle"
    );


  /* ================= CATALOGUE PUBLIE ================= */

  async function loadPublishedCatalog() {

    try {

      const res =
        await fetch(
          "products.json",
          {
            cache:"no-store"
          }
        );


      if (!res.ok) return;


      const data =
        await res.json();


      if (
        Array.isArray(data) &&
        data.length
      ) {

        products = data;

        usingPublishedCatalog = true;

        renderFilters();
        renderProducts();
        renderOrderOptions();
        renderAdminList();

      }

    }
    catch (e) {

      /*
        Pas de products.json :
        on garde les produits locaux.
      */

    }

  }


  /* ================= PRIX ================= */

  function formatPrice(n) {

    return (
      Number(n)
        .toLocaleString("fr-FR")
      + " DH"
    );

  }


  /* ================= FILTRES ================= */

  function renderFilters() {

    const cats = [

      "Tous",

      ...new Set(
        products
          .map(
            p => p.category
          )
          .filter(Boolean)
      )

    ];


    filtersWrap.innerHTML = "";


    cats.forEach(
      function (cat) {

        const btn =
          document.createElement(
            "button"
          );


        btn.className =
          "filter-chip" +
          (
            cat === activeFilter
              ? " is-active"
              : ""
          );


        btn.textContent =
          cat;


        btn.dataset.filter =
          cat;


        btn.addEventListener(
          "click",
          function () {

            activeFilter =
              cat;

            renderFilters();
            renderProducts();

          }
        );


        filtersWrap.appendChild(
          btn
        );

      }
    );

  }


  /* ================= PRODUITS ================= */

  function renderProducts() {

    const visible =
      activeFilter === "Tous"
        ? products
        : products.filter(
            p =>
              p.category ===
              activeFilter
          );


    productGrid.innerHTML =
      "";


    emptyState.hidden =
      visible.length > 0;


    visible.forEach(
      function (p) {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "product-card";


        const media =
          document.createElement(
            "div"
          );


        media.className =
          "product-media";


        if (p.image) {

          media.style.backgroundImage =
            `url("${p.image}")`;

        }
        else {

          const placeholder =
            document.createElement(
              "div"
            );


          placeholder.className =
            "no-img";


          placeholder.textContent =
            "Taoufik Moda";


          media.appendChild(
            placeholder
          );

        }


        const storeTag =
          document.createElement(
            "span"
          );


        storeTag.className =
          "product-store";


        storeTag.textContent =
          p.store || "";


        media.appendChild(
          storeTag
        );


        const body =
          document.createElement(
            "div"
          );


        body.className =
          "product-body";


        body.innerHTML = `

          <span class="product-cat">
            ${escapeHtml(
              p.category || ""
            )}
          </span>

          <h3 class="product-name">
            ${escapeHtml(
              p.name
            )}
          </h3>

          <p class="product-desc">
            ${escapeHtml(
              p.desc || ""
            )}
          </p>

          <div class="product-foot">

            <span class="product-price">
              ${formatPrice(
                p.price
              )}
            </span>

            <button
              class="product-order"
              data-id="${p.id}">

              Commander

            </button>

          </div>

        `;


        card.appendChild(
          media
        );


        card.appendChild(
          body
        );


        productGrid.appendChild(
          card
        );

      }
    );


    productGrid
      .querySelectorAll(
        ".product-order"
      )
      .forEach(
        function (btn) {

          btn.addEventListener(
            "click",
            function () {

              const product =
                products.find(
                  p =>
                    p.id ===
                    btn.dataset.id
                );


              if (!product)
                return;


              document
                .getElementById(
                  "commande"
                )
                .scrollIntoView({
                  behavior:"smooth"
                });


              selectArticleInOrderForm(
                product.name
              );

            }
          );

        }
      );

  }


  /* ================= SECURITE HTML ================= */

  function escapeHtml(str) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      str == null
        ? ""
        : str;


    return div.innerHTML;

  }


  /* ================= OPTIONS COMMANDE ================= */

  function renderOrderOptions() {

    orderArticleSelect.innerHTML =
      '<option value="">Sélectionner un article</option>';


    products.forEach(
      function (p) {

        const opt =
          document.createElement(
            "option"
          );


        opt.value =
          p.name;


        opt.textContent =
          `${p.name} — ${formatPrice(
            p.price
          )}`;


        orderArticleSelect.appendChild(
          opt
        );

      }
    );

  }


  function selectArticleInOrderForm(
    name
  ) {

    renderOrderOptions();

    orderArticleSelect.value =
      name;

    updateWhatsappLink();

  }


  /* ================= RAFRAICHISSEMENT ================= */

  function refreshAll() {

    saveProducts(
      products
    );

    renderFilters();

    renderProducts();

    renderOrderOptions();

    renderAdminList();

  }


  /* ================= ADMIN ================= */

  const adminPanel =
    document.getElementById(
      "adminPanel"
    );


  const adminToggleLink =
    document.getElementById(
      "adminToggleLink"
    );


  const closeAdminBtn =
    document.getElementById(
      "closeAdmin"
    );


  const productForm =
    document.getElementById(
      "productForm"
    );


  const adminList =
    document.getElementById(
      "adminList"
    );


  adminToggleLink.addEventListener(
    "click",
    function (e) {

      e.preventDefault();


      if (adminPanel.hidden) {

        const code =
          prompt(
            "Code d'accès de l'espace gérant :"
          );


        if (
          code !==
          ADMIN_CODE
        ) {

          if (
            code !== null
          ) {

            alert(
              "Code incorrect."
            );

          }

          return;

        }


        adminPanel.hidden =
          false;


        adminPanel.scrollIntoView({
          behavior:"smooth"
        });

      }
      else {

        adminPanel.hidden =
          true;

      }

    }
  );


  closeAdminBtn.addEventListener(
    "click",
    function () {

      adminPanel.hidden =
        true;


      document
        .getElementById(
          "collection"
        )
        .scrollIntoView({
          behavior:"smooth"
        });

    }
  );


  /* ================= IMAGE ================= */

  const pImageFile =
    document.getElementById(
      "pImageFile"
    );


  const imagePreviewRow =
    document.getElementById(
      "imagePreviewRow"
    );


  const imagePreview =
    document.getElementById(
      "imagePreview"
    );


  const removeImageBtn =
    document.getElementById(
      "removeImage"
    );


  let uploadedImageData =
    "";


  pImageFile.addEventListener(
    "change",
    function () {

      const file =
        pImageFile.files &&
        pImageFile.files[0];


      if (!file)
        return;


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Merci de choisir un fichier image."
        );


        pImageFile.value =
          "";


        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        function () {

          uploadedImageData =
            reader.result;


          imagePreview.src =
            uploadedImageData;


          imagePreviewRow.hidden =
            false;

        };


      reader.readAsDataURL(
        file
      );

    }
  );


  removeImageBtn.addEventListener(
    "click",
    function () {

      uploadedImageData =
        "";


      pImageFile.value =
        "";


      imagePreviewRow.hidden =
        true;


      imagePreview.src =
        "";

    }
  );


  function resetImageUpload() {

    uploadedImageData =
      "";


    pImageFile.value =
      "";


    imagePreviewRow.hidden =
      true;


    imagePreview.src =
      "";

  }


  /* ================= AJOUT PRODUIT ================= */

  productForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      const newProduct = {

        id:
          cryptoId(),

        name:
          document
            .getElementById(
              "pName"
            )
            .value
            .trim(),

        price:
          Number(
            document
              .getElementById(
                "pPrice"
              )
              .value
          ),

        category:
          document
            .getElementById(
              "pCategory"
            )
            .value
            .trim(),

        store:
          document
            .getElementById(
              "pStore"
            )
            .value,

        image:
          uploadedImageData ||
          document
            .getElementById(
              "pImage"
            )
            .value
            .trim(),

        desc:
          document
            .getElementById(
              "pDesc"
            )
            .value
            .trim()

      };


      if (
        !newProduct.name ||
        !newProduct.category
      ) {

        return;

      }


      products.push(
        newProduct
      );


      refreshAll();


      productForm.reset();


      resetImageUpload();

    }
  );


  /* ================= LISTE ADMIN ================= */

  function renderAdminList() {

    adminList.innerHTML =
      "";


    products.forEach(
      function (p) {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "admin-list-item";


        const thumb =
          p.image
            ? `<img src="${p.image}" alt="">`
            : "";


        row.innerHTML = `

          <span class="item-info">

            ${thumb}

            ${escapeHtml(
              p.name
            )}

            — ${formatPrice(
              p.price
            )}

            — ${escapeHtml(
              p.category
            )}

          </span>

        `;


        const removeBtn =
          document.createElement(
            "button"
          );


        removeBtn.textContent =
          "Retirer";


        removeBtn.addEventListener(
          "click",
          function () {

            products =
              products.filter(
                prod =>
                  prod.id !==
                  p.id
              );


            refreshAll();

          }
        );


        row.appendChild(
          removeBtn
        );


        adminList.appendChild(
          row
        );

      }
    );

  }


  /* ================= EXPORT CATALOGUE ================= */

  const exportCatalogBtn =
    document.getElementById(
      "exportCatalog"
    );


  exportCatalogBtn.addEventListener(
    "click",
    function () {

      const blob =
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
              "application/json"
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const a =
        document.createElement(
          "a"
        );


      a.href =
        url;


      a.download =
        "products.json";


      document.body.appendChild(
        a
      );


      a.click();


      document.body.removeChild(
        a
      );


      URL.revokeObjectURL(
        url
      );


      alert(
        "Le fichier products.json a été téléchargé.\n\n" +
        "Pour que tous les visiteurs voient ces articles et photos :\n" +
        "1. Ouvrez votre hébergement (là où se trouve index.html)\n" +
        "2. Remplacez le fichier products.json par celui téléchargé\n" +
        "3. C'est publié — tout le monde verra le même catalogue."
      );

    }
  );


  /* ================= COMMANDE ================= */

  const orderForm =
    document.getElementById(
      "orderForm"
    );


  const orderConfirm =
    document.getElementById(
      "orderConfirm"
    );


  const whatsappBtn =
    document.getElementById(
      "whatsappBtn"
    );


  function buildOrderMessage() {

    const name =
      document
        .getElementById(
          "oName"
        )
        .value
        .trim();


    const phone =
      document
        .getElementById(
          "oPhone"
        )
        .value
        .trim();


    const article =
      document
        .getElementById(
          "oArticle"
        )
        .value;


    const qty =
      document
        .getElementById(
          "oQty"
        )
        .value;


    const store =
      document
        .getElementById(
          "oStore"
        )
        .value;


    const message =
      document
        .getElementById(
          "oMessage"
        )
        .value
        .trim();


    return (

      `Bonjour Taoufik Moda, je souhaite commander :\n` +

      `- Article : ${
        article || "—"
      }\n` +

      `- Quantité : ${
        qty
      }\n` +

      `- Boutique de retrait : ${
        store
      }\n` +

      `- Nom : ${
        name
      }\n` +

      `- Téléphone : ${
        phone
      }\n` +

      (
        message
          ? `- Précisions : ${message}\n`
          : ""
      )

    );

  }


  function updateWhatsappLink() {

    const text =
      encodeURIComponent(
        buildOrderMessage()
      );


    whatsappBtn.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  }


  orderForm.addEventListener(
    "input",
    updateWhatsappLink
  );


  orderForm.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();


      if (
        !orderForm.checkValidity()
      ) {

        orderForm.reportValidity();

        return;

      }


      updateWhatsappLink();


      orderConfirm.hidden =
        false;


      orderForm.reset();


      updateWhatsappLink();


      setTimeout(
        function () {

          orderConfirm.hidden =
            true;

        },
        6000
      );

    }
  );


  /* ================= MENU MOBILE ================= */

  const burgerBtn =
    document.getElementById(
      "burgerBtn"
    );


  const mainNav =
    document.getElementById(
      "mainNav"
    );


  burgerBtn.addEventListener(
    "click",
    function () {

      const isOpen =
        mainNav.classList.toggle(
          "is-open"
        );


      burgerBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(
      function (a) {

        a.addEventListener(
          "click",
          function () {

            mainNav.classList.remove(
              "is-open"
            );


            burgerBtn.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );


  /* ================= INIT ================= */

  document
    .getElementById(
      "year"
    )
    .textContent =
      new Date()
        .getFullYear();


  refreshAll();


  updateWhatsappLink();


  loadPublishedCatalog();

})();
