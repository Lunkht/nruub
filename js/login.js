var email = "utilisateur@example.com";
var password = "motdepasse123";

firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // L'utilisateur est connecté avec succès
    var user = userCredential.user;
  })
  .catch((error) => {
    // Gérer les erreurs d'authentification ici
  });
