# Embryologie — Spécification fonctionnelle du génome swimbot

## Vue d'ensemble

Le génome d'un swimbot contient **256 gènes**, chacun une valeur byte (0–255). Avant application, chaque valeur est normalisée en un flottant entre 0.0 et 1.0. Sur ces 256 gènes, **112 sont fonctionnels** et **144 sont de l'ADN inutile** (junk DNA).

Les gènes fonctionnels se répartissent en trois groupes :

| Groupe | Nombre de gènes | Rôle |
|---|---|---|
| Gènes globaux | 2 | Fréquence de nage et taille maximale |
| Gènes par catégorie | 108 (27 × 4 catégories) | Géométrie, couleur, mouvement, ramification |
| Gènes alimentaires | 2 | Préférence et digestibilité de la nourriture |

---

## Gènes globaux

### Frequency

**Fréquence de nage** globale du swimbot. Une valeur plus élevée produit un mouvement de nage plus rapide. Plage : 0.02 à 0.2.

### Cutoff

**Limite de croissance** du corps. Une fois ce nombre de segments atteint, le swimbot arrête d'en produire. Contrôle ainsi la taille maximale du corps. Plage : MIN_PARTS à MAX_PARTS − 1.

---

## Gènes par catégorie

Un swimbot possède **4 catégories** de segments corporels. Chaque catégorie définit l'apparence et le comportement d'une séquence de segments. Les 27 gènes par catégorie sont :

### Couleur et géométrie

| Nom | Plage | Rôle |
|---|---|---|
| `start red / green / blue` | 0 – 1 | Couleur RGB au **début** de la séquence |
| `end red / green / blue` | 0 – 1 | Couleur RGB à la **fin** de la séquence |
| `start width` | 0.5 – 7.0 | Épaisseur du segment au début |
| `end width` | 0.5 – 7.0 | Épaisseur du segment à la fin |
| `start length` | 3 – 27 | Longueur du segment au début |
| `end length` | 3 – 27 | Longueur du segment à la fin |

Les couleurs, épaisseurs et longueurs **interpolent linéairement** entre les valeurs `start` et `end` le long de chaque séquence.

### Mouvement

| Nom | Plage | Rôle |
|---|---|---|
| `amplitude` | −60 – 60 | Amplitude de **balancement latéral** (mouvement ondulatoire de nage) |
| `phase` | −1 – 1 | **Décalage de phase** du balancement entre segments consécutifs |
| `turn amplitude` | −60 – 60 | Amplitude de **rotation** (virage du corps) |
| `turn phase` | −1 – 1 | Phase de rotation |
| `branch amplitude` | −60 – 60 | Amplitude de balancement du **premier segment d'une branche** |
| `branch phase` | −1 – 1 | Phase du balancement de branche |
| `branch turn amplitude` | −60 – 60 | Amplitude de rotation du premier segment de branche |
| `branch turn phase` | −1 – 1 | Phase de rotation de branche |

### Ramification

| Nom | Plage | Rôle |
|---|---|---|
| `sequence count` | 1 – 5 | **Nombre de segments** dans la séquence de cette catégorie |
| `branch period` | 1 – 4 | **Période de ramification** : toutes les N segments, un point de branchement apparaît |
| `branch angle` | −90° – 90° | **Angle** d'attache de la branche par rapport au segment parent |
| `branch number` | 0 – 3 | **Nombre de branches** par point de ramification (0 = aucune branche) |
| `branch shift` | 0 – 6 | **Décalage** avant la première ramification |
| `branch category` | 0 – 3 | **Catégorie héritée** par la branche : détermine l'apparence et le mouvement des segments enfants |
| `branch reflect` | 1 – 3 | **Symétrie** : chaque N-ième branche voit son angle inversé (réflexion miroir) |

### Rendu

| Nom | Plage | Rôle |
|---|---|---|
| `splined` | 0 – 1 | **Lissage** : 0 = segments anguleux, 1 = courbe lissée entre segments |
| `end cap spline` | 0.5 – 4.0 | **Arrondi de l'extrémité** du dernier segment de la séquence |

### Structure des catégories

Les 4 catégories sont indexées absolument comme suit :

- **Catégorie 0** : gènes 2–28
- **Catégorie 1** : gènes 29–55
- **Catégorie 2** : gènes 56–82
- **Catégorie 3** : gènes 83–109

La catégorie 0 est utilisée pour la séquence racine (le corps principal). Les catégories 1 à 3 sont héritées par les branches via le gène `branch category`.

---

## Gènes alimentaires

Ces mécanismes n'entrent en jeu que lorsque le mode **Food Speciation** est activé (deux types de nourriture : vert et bleu). Sinon, les deux valeurs sont fixées à 0 (vert) et sans effet.

### Preferred food type

Détermine le type de nourriture que le swimbot **perçoit**. Le swimbot est **aveugle** aux foodbits d'un type différent : lors de la recherche de nourriture, seuls les foodbits correspondant à ce type sont visibles dans son rayon de détection. Valeur : 0 (vert) ou 1 (bleu).

### Digestible food type

Détermine le type de nourriture que le swimbot **digère efficacement**. Si le swimbot mange un foodbit correspondant à ce type, il récupère l'intégralité de son énergie. S'il mange un foodbit d'un type différent, il ne récupère que **20 % de l'énergie**. Valeur : 0 (vert) ou 1 (bleu).

### Désalignement préférence ≠ digestion

Les deux gènes étant mutés et croisés indépendamment lors de la reproduction, un swimbot peut hériter d'une préférence d'un parent et d'une digestibilité de l'autre. Dans ce cas :

- Le swimbot **cherche et mange** exclusivement la nourriture de son type préféré (c'est tout ce qu'il voit)
- Mais son système digestif est optimisé pour **l'autre type**
- Résultat : il ne récupère que 20 % de l'énergie → **désavantage sélectif**

Les swimbots dont les deux gènes sont alignés survivent mieux et se reproduisent davantage, ce qui maintient la cohésion des sous-populations et favorise la spéciation.

### Initialisation

Au démarrage avec le mode Food Speciation activé, les deux gènes sont **synchronisés** : 50 % de la population préfère et digère le vert, 50 % préfère et digère le bleu. Le désalignement n'apparaît qu'après mutations et croisements successifs.

---

## ADN inutile (Junk DNA)

Les gènes 112 à 255 (soit 144 gènes) sont du **junk DNA**. Ils ne produisent aucun effet phénotypique mais sont hérités et mutés comme les gènes fonctionnels. Ils servent au calcul de la **similarité génétique** entre swimbots, ce qui influence le critère d'attraction sexuelle et la détection d'espèces.

---

## Carte complète des indices

```
gène   0              → frequency
gène   1              → cutoff
gènes   2 –  28       → catégorie 0  (27 gènes)
gènes  29 –  55       → catégorie 1  (27 gènes)
gènes  56 –  82       → catégorie 2  (27 gènes)
gènes  83 – 109       → catégorie 3  (27 gènes)
gène  110             → preferred food type
gène  111             → digestible food type
gènes 112 – 255       → junk DNA     (144 gènes)
────────────────────────────────────────
total                 → 256 gènes
```

---

## Références de code

| Composant | Fichier |
|---|---|
| Constantes et plages des gènes | `simulation/Embryology.js` |
| Génération du phénotype | `simulation/Embryology.js` — `generatePhenotypeFromGenotype()` |
| Génération d'une séquence de segments | `simulation/Embryology.js` — `generateBodySequence()` |
| Recherche de nourriture (perception) | `simulation/GenePool.js` |
| Ingestion et pénalité de digestion | `simulation/SwimbotAI.js` — `eatChosenFoodBit()` |
| Pénalité de digestion (20%) | `simulation/Parameters.js` — `FOOD_TYPE_OFFSET` |
| Phénotype (structure de données) | `simulation/SwimbotTypes.js` |
| Genotype (structure de données) | `simulation/Genotype.js` |
