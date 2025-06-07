# MALAZA-GPS-# AGENTS.md – Codex Guide – Malaza Track

## 🎯 Objectif

Malaza Track est une application de gestion de trackers GPS. Chaque appareil est lié à un client et une carte SIM. L’admin peut :

* Ajouter un GPS
* Associer un client et une SIM
* Visualiser les trackers sur une carte
* Suivre les paiements et l'état des abonnements

## 📁 Structure actuelle

* `index.html` : page d'accueil
* `gps.html` : gestion des GPS
* `clients.html` : liste des clients
* `sim.html` : gestion des cartes SIM
* `map.html` : carte avec position GPS (Google Maps) A CREER 
* `app.js` : logique générale
* `pouchdb.min.js` : base de données locale

## ✅ Ce que je veux que tu fasses

* Vérifie que l’ajout/modification des GPS fonctionne sans bug
* Corrige les erreurs de synchronisation avec PouchDB
* Optimise la vitesse d’affichage des cartes (si lente)
* Ajoute un message d'erreur si une SIM est déjà utilisée
* Vérifie que le code fonctionne sur mobile (responsive)

## 🧪 Tests attendus

* Ajouter un nouveau GPS et vérifier qu’il apparaît bien
* Ajouter une SIM existante → doit bloquer
* Supprimer un client → GPS liés doivent rester visibles
* Tester navigation entre pages sans perte de données

Merci 🙏
