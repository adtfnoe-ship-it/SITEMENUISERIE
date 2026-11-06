# Sites ADTF — hébergement sur le VPS Hostinger

Ce dépôt contient les sites servis par le VPS `srv2067740.hstgr.cloud` (2.24.42.33) :

| Dossier | Domaine | Contenu |
|---|---|---|
| `sites/adtfermeture.fr/` | adtfermeture.fr | Site vitrine compilé depuis `source/adtfermeture.fr/` |
| `sites/devis-adtf.fr/` | devis-adtf.fr | ADTF Pilot (build Vite/React de `selimdjafer-collab/ADTF2`, branche `hostinger`) |

Les deux applications sont statiques : les données (devis, clients, comptes) sont chez Supabase.

## Fonctionnement

`deploy/docker-compose.yml` est le projet Docker `adtf-web` du VPS (Docker Manager Hostinger) :

- **sync** vérifie la branche déployée toutes les 60 s et passe à la nouvelle version dès qu'un commit arrive ;
- **caddy** sert les sites avec HTTPS automatique et relit `deploy/Caddyfile` à chaque changement.

**Mettre un site à jour** : remplacer le contenu de `sites/<domaine>/` par le nouveau build (`dist/`), committer, pousser.
Le VPS le met en ligne en une minute environ, sans SSH.

**Ajouter un domaine** : pointer son DNS (A → 2.24.42.33), ajouter un bloc dans `deploy/Caddyfile`, pousser.

## Site vitrine : code source et administration

Le code source est dans `source/adtfermeture.fr/` (Vite + React + Supabase).
Après une modification : `./scripts/build-adtfermeture.sh`, puis committer et pousser.

L'administration (`https://adtfermeture.fr/admin`) permet de :

- **Photos du site** : remplacer chaque photo fixe (logo, accueil, produits, à propos…) ou revenir à l'originale.
  La liste des emplacements est dans `source/adtfermeture.fr/src/lib/photos.tsx` (`EMPLACEMENTS`).
- **Galerie photos** : ajouter plusieurs photos d'un coup, réorganiser, renommer, supprimer.
- **Actualités** : rédiger et publier des articles.

Les photos sont réduites dans le navigateur avant l'envoi (2000 px max, WebP) et stockées dans le
bucket Supabase `site-images`. Les photos remplacées sont des lignes de `gallery_images` avec
`section = 'emplacement'` et `label` = clé de l'emplacement : aucune table supplémentaire.
