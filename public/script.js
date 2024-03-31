document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.getElementById('gallery');
    const addCraftButton = document.getElementById('addCraftButton');
    const addCraftModal = document.getElementById('addCraftModal');
    const closeAddCraftModal = document.getElementById('closeAddCraftModal');
    const addSupplyButton = document.getElementById('addSupply');
    const craftImageInput = document.getElementById('craftImage');
    const addCraftForm = document.getElementById('addCraftForm');
    const cancelAddCraftButton = document.getElementById('cancelAddCraft');
    const craftDetailModal = document.getElementById('craftDetailModal');
    const craftDetailTitle = document.getElementById('craftDetailTitle');
    const craftDetailDescription = document.getElementById('craftDetailDescription');
    const craftDetailSupplies = document.getElementById('craftDetailSupplies');
    const closeCraftDetailModal = document.getElementById('closeCraftDetailModal');

    function showCraftDetails(craft) {
        craftDetailTitle.textContent = craft.name;
        craftDetailDescription.textContent = craft.description;
        craftDetailSupplies.innerHTML = '';
        craft.supplies.forEach(supply => {
            const li = document.createElement('li');
            li.textContent = supply;
            craftDetailSupplies.appendChild(li);
        });
        craftDetailModal.style.display = 'block';
    }

    function addCraftToGallery(craft) {
        const img = document.createElement('img');
        img.src = `/images/crafts/${craft.image}`;
        img.alt = craft.name;
        img.className = 'craft-image';
        img.addEventListener('click', () => showCraftDetails(craft));

        // Insert the new image at the beginning of the gallery
        gallery.insertBefore(img, gallery.firstChild);
    }

    fetch('/api/crafts')
        .then(response => response.json())
        .then(crafts => {
            crafts.forEach(craft => {
                addCraftToGallery(craft);
            });
        })
        .catch(error => console.error('Error fetching crafts:', error));

    addCraftButton.addEventListener('click', () => {
        addCraftModal.style.display = 'block';
    });

    closeAddCraftModal.addEventListener('click', () => {
        addCraftModal.style.display = 'none';
    });

    closeCraftDetailModal.addEventListener('click', () => {
        craftDetailModal.style.display = 'none';
    });

    addSupplyButton.addEventListener('click', () => {
        const newSupplyInput = document.createElement('input');
        newSupplyInput.type = 'text';
        newSupplyInput.name = 'supplies[]';
        document.getElementById('supplyInputs').appendChild(newSupplyInput);
    });

    craftImageInput.addEventListener('change', function () {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    });

    addCraftForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        fetch('/api/crafts', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(newCraft => {
            addCraftModal.style.display = 'none';
            addCraftToGallery(newCraft);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    cancelAddCraftButton.addEventListener('click', () => {
        addCraftModal.style.display = 'none';
    });

});
