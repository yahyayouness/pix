#language: fr
Fonctionnalité: Profil

  Contexte:
    Étant donné que les données de test sont chargées

  Scénario: J'accède à la page de détails d'une compétence
    Étant donné que je vais sur Pix
    Et je suis connecté à Pix en tant que "Daenerys Targaryen"
    Lorsque j'accède à mon profil
    Et je clique sur le rond de niveau de la compétence "Géographie"
    Alors je vois la page de détails de la compétence "Géographie"

  Scénario: Je m'évalue sur une compétence
    Étant donné que je vais sur Pix

    Lorsque je me connecte avec le compte "daenerys.targaryen@pix.fr"
    Alors je suis redirigé vers le profil de "Daenerys"
    Et la page "Profil" est correctement affichée
    Et je vois le nombre de Pix total à "–"

    Lorsque je survole la carte "Mathématiques"
    Alors la page "Profil avec carte survolée non commencée" est correctement affichée

    Lorsque je clique sur "Commencer"
    Alors je vois l'épreuve "Combien font 2 + 2 ?"
    Et je suis redirigé vers une page d'épreuve
    Et le titre sur l'épreuve est "Mathématiques"

    Lorsque je vois l'épreuve "Combien font 2 + 2 ?"
    Et je saisis "4" dans le champ "Résultat :"
    Et je clique sur "Je valide"
    Alors je vois l'épreuve "La bonne réponse est 12"

    Lorsque je clique sur "Quitter"
    Alors je vois le nombre de Pix total à "4"
    Et je vois un score de "–" pour la carte "Mathématiques"

    Lorsque je survole la carte "Mathématiques"
    Alors la page "Profil avec carte survolée commencée" est correctement affichée
