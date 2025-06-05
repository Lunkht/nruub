var email = "utilisateur@example.com";
var password = "motdepasse123";

firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // L'utilisateur est enregistré avec succès
    var user = userCredential.user;
  })
  .catch((error) => {
    // Gérer les erreurs d'enregistrement ici
  });
