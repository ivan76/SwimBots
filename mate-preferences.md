# Préférences de reproduction des swimbots

## Mécanisme général

Lorsqu'un swimbot entre en mode reproduction, il évalue chaque swimbot potentiellement attractif dans son rayon de vision et lui attribue un **score d'attractivité** entre 0 et 1. Le critère utilisé pour ce calcul est déterminé par le paramètre global d'attraction, modifiable depuis l'onglet **Tweak**.

Ce critère s'applique à **toute la population** simultanément : changer le critère modifie instantanément la préférence de tous les swimbots vivants.

Les 17 critères se répartissent en **5 groupes** de 3, plus **2 critères** indépendants. Chaque groupe mesure une qualité physique du corps et propose trois variantes :

| Variante | Principe | Forme du score |
|---|---|---|
| **Absolu positif** (ex. *colorful*) | Plus la qualité est élevée, plus le swimbot est attractif | Score = valeur brute de la qualité |
| **Absolu négatif** (ex. *not colorful*) | Plus la qualité est faible, plus le swimbot est attractif | Score = 1 − valeur brute de la qualité |
| **Similarité** (ex. *similar color*) | Plus le juge et le jugé se ressemblent sur cette qualité, plus le score est élevé | Score = 1 − \|valeur du juge − valeur du jugé\| |

---

## Groupe 1 — Couleur

### Colorful

Les swimbots sont attirés par les individus aux **couleurs vives et saturées**.

La saturation est calculée segment par segment : pour chaque segment, on prend la moyenne des différences absolues entre les composantes rouge, verte et bleue. Un segment blanc (R=G=B) a une saturation de 0, un segment rouge pur (R=1, G=0, B=0) a une saturation de 1. Le score final est une **moyenne pondérée par la masse** de tous les segments.

**Effet évolutif :** la population tend vers des couleurs de plus en plus saturées et contrastées.

### Not colorful

L'inverse de *colorful* : les swimbots préfèrent les individus aux **couleurs ternes et désaturées**.

Score = 1 − saturation.

**Effet évolutif :** la population tend vers des teintes grisâtres et monochromes.

### Similar color

Les swimbots préfèrent les individus dont la **couleur moyenne** est proche de la leur.

La couleur moyenne est calculée comme une moyenne pondérée par la masse de toutes les composantes RGB de tous les segments. La similarité est `1 − (|ΔR| + |ΔG| + |ΔB|) / 3`.

**Effet évolutif :** la population se fragmente en sous-groupes de couleurs homogènes, chacun se reproduisant entre membres similaires.

---

## Groupe 2 — Taille (Bigness)

### Big

Les swimbots sont attirés par les individus de **grande masse corporelle**.

La taille est mesurée comme le rapport entre la masse totale du swimbot et la masse théoriquement maximale possible (`MAX_PARTS × MAX_LENGTH × MAX_WIDTH`).

**Effet évolutif :** sélection de swimbots avec plus de segments, plus longs et plus épais.

### Small

Les swimbots préfèrent les individus de **petite taille**.

Score = 1 − bigness.

**Effet évolutif :** sélection de swimbots compacts et légers.

### Similar size

Les swimbots préfèrent les individus dont la **masse** est proche de la leur.

Score = 1 − |bigness du juge − bigness du jugé|.

**Effet évolutif :** émergence de plusieurs "classes de taille" stables au sein de la population.

---

## Groupe 3 — Activité (Hyperness)

### Hyper

Les swimbots sont attirés par les individus **très mobiles et agités**.

L'"hyperness" est la somme des vitesses absolues de tous les segments, multipliée par un facteur d'échelle de 0.4, puis plafonnée à 1. Un swimbot dont les segments bougent beaucoup obtient un score élevé.

**Effet évolutif :** sélection de swimbots avec de grandes amplitudes de mouvement et des fréquences de nage élevées.

### Still

Les swimbots préfèrent les individus **calmes et peu mobiles**.

Score = 1 − hyperness.

**Effet évolutif :** sélection de swimbots à mouvement réduit, favorisant l'efficacité énergétique.

### Similar hyper

Les swimbots préfèrent les individus dont le **niveau d'activité** est proche du leur.

Score = 1 − |hyperness du juge − hyperness du jugé|.

**Effet évolutif :** coexistence de sous-populations actives et de sous-populations calmes.

---

## Groupe 4 — Longueur

### Long

Les swimbots sont attirés par les individus **physiquement allongés**.

La longueur est la **distance maximale** entre deux segments quelconques du corps, normalisée par la longueur théoriquement maximale possible (`MAX_PARTS × MAX_LENGTH`). Un swimbot ramassé obtient un score bas, un swimbot étendu un score élevé.

**Effet évolutif :** sélection de swimbots avec des segments longs et une morphologie étirée.

### Short

Les swimbots préfèrent les individus **compacts et ramassés**.

Score = 1 − longness.

**Effet évolutif :** sélection de swimbots courts et compacts.

### Similar length

Les swimbots préfèrent les individus dont la **longueur** est proche de la leur.

Score = 1 − |longness du juge − longness du jugé|.

**Effet évolutif :** diversification des morphologies en fonction de la longueur corporelle.

---

## Groupe 5 — Rectitude (Straightness)

### Straight

Les swimbots sont attirés par les individus au **corps droit et aligné**.

La rectitude se calcule en deux étapes :
1. Pour chaque paire de segments, on calcule le produit scalaire de leurs vecteurs d'axe normalisés. Un produit scalaire proche de 1 signifie que les segments sont parallèles (alignés).
2. La moyenne de tous ces produits scalaires est combinée (70 %) avec le ratio du nombre de segments sur le maximum possible (30 %), favorisant ainsi les swimbots à la fois droits et segmentés.

**Effet évolutif :** sélection de swimbots au corps rectiligne avec peu de branches anguleuses.

### Crooked

Les swimbots préfèrent les individus au **corps tordu et irrégulier**.

Score = 1 − straightness.

**Effet évolutif :** sélection de swimbots branchus, courbés et morphologiquement complexes.

### Similar straight

Les swimbots préfèrent les individus dont le **degré de rectitude** est proche du leur.

Score = 1 − |straightness du juge − straightness du jugé|.

**Effet évolutif :** coexistence de morphologies droites et tordues.

---

## Critères indépendants

### Closest

Le swimbot choisit simplement le **partenaire le plus proche** spatialement dans son rayon de vision.

Score = 1 − (distance au juge / rayon de vision).

**Effet évolutif :** aucune pression sélective sur une qualité morphologique particulière. La reproduction est purement opportuniste, ce qui tend à ralentir la divergence évolutive.

### Random

Le swimbot attribue un score **aléatoire** à chaque candidat potentiel.

Score = nombre aléatoire entre 0 et 1.

**Effet évolutif :** aucune sélection directionnelle. C'est le contrôle neutre de la simulation — l'évolution ne suit aucune préférence, seule la dérive génétique opère.

---

## Tableau récapitulatif

| Critère | Type | Qualité mesurée | Pression sélective |
|---|---|---|---|
| **Colorful** | Absolu | Saturation des couleurs | Vers des couleurs vives |
| **Not colorful** | Absolu | Saturation des couleurs (inverse) | Vers des couleurs ternes |
| **Similar color** | Similarité | Couleur moyenne | Fragmentation par couleur |
| **Big** | Absolu | Masse corporelle | Vers des corps massifs |
| **Small** | Absolu | Masse corporelle (inverse) | Vers des corps légers |
| **Similar size** | Similarité | Masse corporelle | Classes de taille |
| **Hyper** | Absolu | Niveau d'activité | Vers plus de mouvement |
| **Still** | Absolu | Niveau d'activité (inverse) | Vers le calme |
| **Similar hyper** | Similarité | Niveau d'activité | Groupes par activité |
| **Long** | Absolu | Longueur du corps | Vers l'allongement |
| **Short** | Absolu | Longueur du corps (inverse) | Vers la compacité |
| **Similar length** | Similarité | Longueur du corps | Diversité de longueurs |
| **Straight** | Absolu | Alignement des segments | Vers la rectitude |
| **Crooked** | Absolu | Alignement des segments (inverse) | Vers la complexité |
| **Similar straight** | Similarité | Alignement des segments | Coexistence droite/tordu |
| **Closest** | Spatial | Distance | Pas de pression morphologique |
| **Random** | Neutre | — | Aucune sélection |

Le critère par défaut est **Similar color** (similar color).

---

## Références de code

| Composant | Fichier |
|---|---|
| Constantes d'attraction (0–16) | `simulation/SwimbotTypes.js` |
| Calcul du score d'attractivité | `simulation/SwimbotSocial.js` — `getAttractiveness()` |
| Mesure de la saturation | `simulation/SwimbotSocial.js` — `getColorSaturation()` |
| Mesure de la masse | `simulation/SwimbotSocial.js` — `getCurrentBodyBigness()` |
| Mesure de l'activité | `simulation/SwimbotSocial.js` — `getCurrentBodyHyperness()` |
| Mesure de la longueur | `simulation/SwimbotSocial.js` — `getCurrentBodyLongness()` |
| Mesure de la rectitude | `simulation/SwimbotSocial.js` — `getCurrentBodyStraightness()` |
| Couleur moyenne | `simulation/SwimbotSocial.js` — `getAverageColor()` |
| Proximité spatiale | `simulation/SwimbotSocial.js` — `getCloseness()` |
| Application du critère global | `simulation/GenePool.js` — `setAttraction()` |
| Valeur par défaut | `simulation/Parameters.js` — `GlobalTweakers` |
| Interface radio buttons | `index.html` — `#attractionPanel` |
