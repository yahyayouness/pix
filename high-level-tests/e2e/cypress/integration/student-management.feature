Feature: Gestion des Élèves

  Background:
    Given les données de test sont chargées

  Scenario: Je consulte la liste des élèves
    Given je vais sur Pix Orga
    And je suis connecté à Pix Orga en tant qu'administrateur d'une organisation SCO gérant des élèves
    When j'accède à la liste des élèves
    Then je vois la liste des élèves

