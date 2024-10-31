// Selects all elements
const burgerMenu = document.querySelector("#burger-menu");
const sideBarMenu = document.querySelector("#side-bar");
const mainSection = document.querySelector("#main-section");

// Callback functions
const handleAddStyle = (element, style) => {
  element.classList.add(style);
};

const handleRemoveStyle = (element, style) => {
  element.classList.remove(style);
};

// Add events

burgerMenu.addEventListener("click", (event) => {
  if (sideBarMenu.classList.contains("display-none")) {
    handleRemoveStyle(sideBarMenu, "display-none");
    handleRemoveStyle(mainSection, "w-100");
  } else {
    handleAddStyle(sideBarMenu, "display-none");
    handleAddStyle(mainSection, "w-100");
  }
});


// personal touch

function updateContactCount() {
  // Récupérer les contacts depuis le localStorage ou initialiser à un tableau vide
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const count = contacts.length; // Nombre de contacts

  // Mettre à jour les éléments d'affichage du compteur
  const contactCountElement = document.getElementById('contactCount');
  const contactCountHeaderElement = document.getElementById('contactCountHeader');

  if (contactCountElement) contactCountElement.textContent = count;
  if (contactCountHeaderElement) contactCountHeaderElement.textContent = count;

  // Sélectionner les éléments du DOM nécessaires pour l'affichage
  const contactTable = document.getElementById('contactTable');
  const emptyContacts = document.getElementById('emptyContacts');
  const noContactsText = document.getElementById('noContactsText');
  const noContactsContainer = document.getElementById('noContactsContainer');
  const createContactContainer = document.getElementById('createContactContainer');

  // Vérifier si le nombre de contacts est supérieur à 0
  if (count > 0) {
      // Afficher le tableau et masquer les éléments pour l'absence de contacts
      contactTable.style.display = 'table';
      emptyContacts.style.display = 'none';
      noContactsText.style.display = 'none';
      noContactsContainer.style.display = 'none';
      createContactContainer.style.display = 'none';
      displayContacts(contacts); // Appeler la fonction pour afficher les contacts
  } else {
      // Masquer le tableau et afficher les éléments indiquant qu'il n'y a pas de contacts
      contactTable.style.display = 'none';
      emptyContacts.style.display = 'block';
      noContactsText.style.display = 'block';
      noContactsContainer.style.display = 'block';
      createContactContainer.style.display = 'flex';
  }
} 

// Fonction pour afficher les contacts dans le tableau
function displayContacts(contacts) {
  const contactList = document.getElementById('contact-list');
  contactList.innerHTML = ''; // Réinitialiser la liste avant de l'afficher

  // Parcourir chaque contact pour créer une ligne dans le tableau
  contacts.forEach((contact, index) => {
      const labels = Array.isArray(contact.labels) ? contact.labels.join(', ') : 'Aucun'; // Gérer les libellés
      const contactRow = document.createElement('tr'); // Créer une nouvelle ligne
      contactRow.innerHTML = `
          <td>
              <div class="d-flex align-items-center">
                  <div class="contact-icon" onclick="showContactSummary(${index})">${contact.firstName.charAt(0).toUpperCase()}</div>
                  ${contact.firstName} ${contact.lastName}
              </div>
          </td>
          <td>${contact.email}</td>
          <td>${contact.phone}</td>
          <td>${contact.position} & ${contact.company}</td>
          <td>${labels}</td>
          <td><button class="btn btn-info btn-sm" onclick="showContactSummary(${index})">Détails</button></td>
      `;
      contactList.appendChild(contactRow); // Ajouter la ligne au tableau
  });
}

// Fonction pour afficher le résumé d'un contact
function showContactSummary(index) {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
  const contact = contacts[index]; // Récupérer le contact à partir de l'index
  const summary = `
      <strong>Nom:</strong> ${contact.firstName} ${contact.lastName}<br>
      <strong>Email:</strong> ${contact.email}<br>
      <strong>Téléphone:</strong> ${contact.phone}<br>
      <strong>Fonction & Entreprise:</strong> ${contact.position} & ${contact.company}<br>
      <strong>Libellés:</strong> ${Array.isArray(contact.labels) ? contact.labels.join(', ') : 'Aucun'}
  `;
  document.getElementById('contactSummary').innerHTML = summary; // Mettre à jour le résumé

  // Lier le bouton "Modifier" pour ouvrir la modale d'édition
  document.getElementById('editButton').onclick = () => {
      const contactSummaryModal = bootstrap.Modal.getInstance(document.getElementById('contactSummaryModal'));
      contactSummaryModal.hide(); // Fermer la modale de résumé
      openContactModal(index); // Ouvrir la modale d'édition
  };

  // Lier le bouton "Supprimer" pour supprimer le contact
  document.getElementById('deleteButton').onclick = () => deleteContact(index);

  // Ouvrir la modale de résumé
  const contactSummaryModal = new bootstrap.Modal(document.getElementById('contactSummaryModal'));
  contactSummaryModal.show();
}

// Fonction pour ouvrir la modale d'édition ou de création de contact
function openContactModal(index = null) {
  const modal = new bootstrap.Modal(document.getElementById('contactModal'));
  document.getElementById('contactForm').reset(); // Réinitialiser le formulaire
  document.getElementById('contactModalLabel').textContent = index !== null ? 'Modifier un Contact' : 'Créer un Contact';
  document.getElementById('saveContactButton').onclick = () => saveContact(index); // Lier la fonction de sauvegarde

  // Si on modifie un contact, pré-remplir le formulaire avec ses informations
  if (index !== null) {
      const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
      const contact = contacts[index];
      document.getElementById('firstName').value = contact.firstName;
      document.getElementById('lastName').value = contact.lastName;
      document.getElementById('email').value = contact.email;
      document.getElementById('phone').value = contact.phone;
      document.getElementById('position').value = contact.position;
      document.getElementById('company').value = contact.company;
  }
  modal.show(); // Afficher la modale
}

function saveContact(index) {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || []; // Récupérer les contacts
  const contact = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      position: document.getElementById('position').value.trim(),
      company: document.getElementById('company').value.trim(),
      
  };

  // Vérifier si tous les champs sont remplis
  if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone || !contact.position || !contact.company) {
      alert("Veuillez remplir tous les champs.");
      return; // Sortir de la fonction si un champ est vide
  }

 

  // Vérifier si on modifie un contact existant ou en ajoute un nouveau
  if (index !== null) {
      contacts[index] = contact; // Modifier le contact existant
  } else {
      contacts.push(contact); // Ajouter un nouveau contact
  }

  localStorage.setItem('contacts', JSON.stringify(contacts)); // Sauvegarder les contacts dans le localStorage
  updateContactCount(); // Mettre à jour le compteur de contacts
  const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
  contactModal.hide(); // Fermer la modale
}

// Fonction pour supprimer un contact
function deleteContact(index) {
  const contacts = JSON.parse(localStorage.getItem('contacts')) || []; // Récupérer les contacts
  contacts.splice(index, 1); // Supprimer le contact à l'index donné
  localStorage.setItem('contacts', JSON.stringify(contacts)); // Mettre à jour le localStorage
  updateContactCount(); // Mettre à jour le compteur après suppression
  const contactSummaryModal = bootstrap.Modal.getInstance(document.getElementById('contactSummaryModal'));
  contactSummaryModal.hide(); // Fermer la modale de résumé
}

// Initialiser l'affichage des libellés au chargement de la page
let labels = JSON.parse(localStorage.getItem('labels')) || [];

// Fonction pour mettre à jour l'affichage des libellés
function updateLabelsDisplay() {
  const labelsList = document.getElementById('labelsList');
  labelsList.innerHTML = ''; // Réinitialiser la liste

  // Parcourir chaque libellé pour créer un élément de liste
  labels.forEach((label, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'border', 'p-2', 'mb-1');
      listItem.innerHTML = `
          <span>${label}</span>
          <button class="btn btn-danger btn-sm" onclick="deleteLabel(${index})">Supprimer</button>
      `;
      labelsList.appendChild(listItem); // Ajouter le libellé à la liste
  });
}

// Fonction pour ouvrir la modale de création de libellé
function openLabelModal() {
  const modal = new bootstrap.Modal(document.getElementById('labelModal'));
  document.getElementById('labelName').value = ''; // Réinitialiser le champ
  document.getElementById('saveLabelButton').onclick = saveLabel; // Lier la fonction de sauvegarde
  modal.show(); // Afficher la modale
}

// Fonction pour sauvegarder un libellé
function saveLabel() {
  const labelName = document.getElementById('labelName').value.trim(); // Obtenir le nom du libellé
  if (labelName) {
      labels.push(labelName); // Ajouter le libellé à la liste
      localStorage.setItem('labels', JSON.stringify(labels)); // Sauvegarder dans le localStorage
      updateLabelsDisplay(); // Mettre à jour l'affichage des libellés
      const modal = bootstrap.Modal.getInstance(document.getElementById('labelModal'));
      modal.hide(); // Fermer la modale
  }
}

// Fonction pour supprimer un libellé
function deleteLabel(index) {
  labels.splice(index, 1); // Supprimer le libellé à l'index donné
  localStorage.setItem('labels', JSON.stringify(labels)); // Mettre à jour le localStorage
  updateLabelsDisplay(); // Mettre à jour l'affichage
}

// Événement au chargement de la page pour initialiser l'affichage des contacts et des libellés
document.addEventListener('DOMContentLoaded', () => {
  updateContactCount(); // Mettre à jour le compteur de contacts
  updateLabelsDisplay(); // Mettre à jour l'affichage des libellés

  // Lier l'événement pour ouvrir la modale de création de libellé
  document.getElementById('addLabelButton').onclick = () => {
      const labelModal = new bootstrap.Modal(document.getElementById('labelModal'));
      labelModal.show(); // Ouvrir la modale
  };

  // Lier le bouton d'enregistrement des libellés
  document.getElementById('saveLabelButton').onclick = saveLabel; 
});




