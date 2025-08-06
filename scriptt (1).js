document.addEventListener("DOMContentLoaded", function () { 
   let selectFiliere = document.getElementById("filiere"); 
  let filiereSelectOptions = [
    { code: "mat", nom: "Mathématiques" },
    { code: "inf", nom: "Informatique" },
    { code: "aut", nom: "Automatique" },
    { code: "tel", nom: "Télécommunications" },
    { code: "fra", nom: "Français" },
    { code: "ang", nom: "Anglais" }
  ];
   filiereSelectOptions.forEach(filiere => {
    const opt = document.createElement("option"); /* On crée une nouvelle balise HTML <option> vide*/
    opt.value = filiere.code; /*définir la valeur de l’option*/
    opt.textContent = filiere.nom; /*écrire le nom de la filière dans l’option*/
   selectFiliere.add(opt); /*insérer l’option dans la liste déroulante*/
  });
/*Quand le formulaire est soumis, exécute la fonction qui suit*/
  document.getElementById("formulaire").addEventListener("submit", function (event)  {
   /* Empêche le rechargement automatique de la page quand on soumet le formulaire.
    Utile pour faire des vérifications AVANT d'envoyer les données.*/
    event.preventDefault();

    const nom = document.getElementById("nom"); /*On récupère les champs de saisie de nom et prénom dans le HTML via leurs id*/
    const prenom = document.getElementById("prenom");
    const naissance = document.getElementById("naissance");
    const lieu = document.getElementById("lieu");
   /* On récupère la valeur sélectionnée dans la liste déroulante <select id="universite">*/
    const universite = document.getElementById("universite");
    const filiere = document.getElementById("filiere");
/*On crée une expression régulière (regex) pour vérifier le format des noms/prénoms*/
    const regexNom = /^[A-Za-z]+(-[A-Za-z]+)?$/;
 /*^[A-Za-z]+ → commence par au moins une lettre (majuscule ou minuscule),
 (-[A-Za-z]+)? → optionnel : un tiret suivi d’au moins une lettre,
 $ → la fin du mot.*/

    if (nom.value.length > 24 || prenom.value.length > 24) {
      alert("Nom ou prénom trop long (24 caractères maximum).");
      return;
    }

    if (!regexNom.test(nom.value) || !regexNom.test(prenom.value)) {
      alert("Nom ou prénom invalide. Exemple: Nom=Ait-Younes, Prénom=Younes");
      return;/*Si le format n’est pas bon, une alerte personnalisée s’affiche, et la fonction s'arrête là aussi*/
    }
/*
On crée un objet Date à partir de la valeur entrée par l’utilisateur (naissance.value).*/
    const birthDate = new Date(naissance.value);
    /*On récupère la date d’aujourd’hui sous forme d’un objet Date*/
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    /*On vérifie si l’anniversaire de l’utilisateur n’est pas encore passé cette année
    Si oui on enlève 1 an au calcul de l’âge.*/
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      alert("Vous devez avoir au moins 18 ans.");
      return;
    }
/*On récupère l’année actuelle (ex : 2025).*/
    const year = today.getFullYear();
    /*const anneeUniv = (today.getMonth() >= 8) ? `${year}/${year + 1}` : `${year - 1}/${year}`;

Ce que ça fait :
On calcule l’année universitaire en fonction de la date actuelle, 
en utilisant un opérateur ternaire (forme raccourcie d’un if).*/
    const anneeUniv = (today.getMonth() >= 8) ? `${year}/${year + 1}` : `${year - 1}/${year}`;
                         /*month>aout ->2025/2026 sinon 2024/2025*/  
    /* On prépare une variable vide appelée faculte, 
    où on va stocker le nom complet de la faculté correspondant à la filière.*/
    let faculte;
    switch (filiere.value) {
      case "mat":
      case "inf":
        faculte = "Faculté des Sciences Exactes";
        break;
      case "aut":
      case "tel":
        faculte = "Faculté de Technologie";
        break;
      case "fra":
      case "ang":
        faculte = "Faculté des Lettres et des Langues";
        break;
    } /*Le switch vérifie la valeur entrée dans le champ filiere.*/
  let grade;
    if (age <= 21) grade = "Licence";
    else if (age <= 23) grade = "Master";
    else if (age <= 27) grade = "Doctorant";
    else grade = "Enseignant-Chercheur";
/*On crée une variable vide statut, qui servira à stocker si l’utilisateur est "Interne" ou "Externe"*/
    let statut;
    if (lieu.value === "Béjaïa" && universite.value === "UAMB") {
      statut = "Interne";
    } else if (lieu.value === "Tizi Ouzou" && universite.value === "UMMTO") {
      statut = "Interne";
    } else {
      statut = "Externe";
    }
// Création de l'objet utilisateur avec toutes les données saisies et déduites pour grouper toutes les infos utiles sur 
//l’utilisateur, les gérer plus facilement, et les réutiliser efficacement dans le reste du projet.
    const utilisateur = {
      nom: nom.value, //nom.value et prenom.value : valeurs tapées par l'utilisateur
      prenom: prenom.value,
      age: age,
      filiere: filiere.options[filiere.selectedIndex].text, /* sert à récupérer le texte visible dans
       une liste déroulante  (<select>) lorsque l’utilisateur choisit une option.*/
     faculte: faculte,
      grade: grade,
      statut: statut,
      lieuNaissance: lieu.value,
      universite: universite.value,
      anneeUniversitaire: anneeUniv
    };
// Détermine le titre de la carte selon le grade (étudiant ou enseignant)Utilise un opérateur ternaire
 let titreCarte = (grade === "Enseignant-Chercheur") ? "CARTE ENSEIGNANT" : "CARTE ÉTUDIANT";
//Choisit quel fichier image (logo) afficher sur la carte.
    let logoSrc = "";
    if (universite.value === "UAMB") {
      logoSrc = "bejaia.png";
    } else if (universite.value === "UMMTO") {
      logoSrc = "tizi.png";
    } else {
      logoSrc = "default-logo.png";
    }
//Crée une chaîne HTML contenant le contenu de la carte : logo, titre, et infos de l’utilisateur.
//${} insère les valeurs dynamiques dans le code HTML.
    const carteHtml = `
      <img src="${logoSrc}" alt="Logo Université" class="logo">
      <h2>${titreCarte}</h2>
      <ul> 
        <li><strong>Nom :</strong> ${utilisateur.nom}</li>
        <li><strong>Prénom :</strong> ${utilisateur.prenom}</li>
        <li><strong>Date de naissance :</strong> ${naissance.value}</li>
        <li><strong>Lieu de naissance :</strong> ${utilisateur.lieuNaissance}</li>
        <li><strong>Filière :</strong> ${utilisateur.filiere}</li>
        <li><strong>Faculté :</strong> ${utilisateur.faculte}</li>
        <li><strong>Grade :</strong> ${utilisateur.grade}</li>
        <li><strong>Année universitaire :</strong> ${utilisateur.anneeUniversitaire}</li>
      </ul>
    `;
// afficher la carte 
    const carte = document.getElementById("carte");//sélectionne l’élément HTML avec l’id carte.
    carte.innerHTML = carteHtml;//insère le contenu HTML créé précédemment
    carte.className = "";// réinitialise les classes CSS.
    carte.classList.add(utilisateur.statut.toLowerCase());//ajoute une classe CSS selon au statut 
    carte.style.display = "block";//: rend la carte visible.
  });// Afficher dynamiquement une carte d’étudiant ou d’enseignant avec toutes les informations saisies/déduites
  //  depuis le formulaire, et adapter son apparence selon le statut (interne ou externe).
// Faire disparaître la carte à la réinitialisation du formulaire
document.getElementById("resetBtn").addEventListener("click", function () {
  const carte = document.getElementById("carte");
  carte.innerHTML = ""; //// Supprime le contenu HTML de la carte
  carte.style.display = "none"; // Masque l'élément visuellement (disparaît de l'écran)
});

// Générer l'identifiant personnalisé au clic sur la carte
document.getElementById("carte").addEventListener("click", function () {
  if (!this.innerHTML.trim()) return; //Si la carte est vide, on arrête l’exécution (return)
  //  pour éviter d’afficher un identifiant sans infos.
// Ensuite, on va récupérer les données nécessaires pour composer l’identifiant :
  const nomHex = toHex(document.getElementById("nom").value);
  const prenomHex = toHex(document.getElementById("prenom").value); 
  //Transforme le nom et le prénom en code hexadécimal ASCII via la fonction toHex.
  const date = document.getElementById("naissance").value.split("-"); //.split("-") coupe la chaîne en utilisant - comme séparateur
 //date = ["2004", "11", "09"] 
  const jjmmaaaa = `${date[2]}/${date[1]}/${date[0]}`;// jjmmaaaa=09/11/2004
//Prend la date au format aaaa-mm-jj et la convertit en jj/mm/aaaa (format demandé).
  const lieu = document.getElementById("lieu").value;
  const universite = document.getElementById("universite").value;
  const wilayaNaissance = (lieu === "Béjaïa") ? "06" : "15";
  const wilayaUniv = (universite === "UAMB") ? "06" : "15";

  const filiereCode = document.getElementById("filiere").value;
  let facCode = "";
  switch (filiereCode) {
    case "mat":
    case "inf":
      facCode = "FSE";
      break;
    case "aut":
    case "tel":
      facCode = "FT";
      break;
    case "fra":
    case "ang":
      facCode = "FLL";
      break;
  }

  const birthDate = new Date(document.getElementById("naissance").value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }

  let gradeLetter;
  if (age <= 21) gradeLetter = "L";
  else if (age <= 23) gradeLetter = "M";
  else if (age <= 27) gradeLetter = "D";
  else gradeLetter = "E";

  const year = today.getFullYear();
  const anneeUniv = (today.getMonth() >= 8) ? `${year}/${year + 1}` : `${year - 1}/${year}`;

  const identifiant = `${nomHex}-${prenomHex}-${jjmmaaaa}-${wilayaNaissance}-${wilayaUniv}-${filiereCode}-${facCode}-${gradeLetter}-${anneeUniv}`;
  alert("Identifiant généré :\n" + identifiant);
});// Assemble tous les morceaux dans le bon ordre, séparés par des tirets -

// Fonction pour convertir une chaîne en hexadécimal ASCII
function toHex(str) {
  return [...str].map(c => c.charCodeAt(0).toString(16)).join('');
}
//Convertit chaque caractère d’une chaîne (str) en son code ASCII hexadécimal, puis les assemble

});

  