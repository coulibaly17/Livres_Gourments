-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : lun. 21 juil. 2025 à 19:08
-- Version du serveur :  8.0.21
-- Version de PHP : 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `magasin_livres`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_parent_id_foreign` (`parent_id`)
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `nom`, `description`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'mangas', 'tout ce qui faut connaitre sur la romance', NULL, '2025-06-01 12:17:50', '2025-06-18 12:17:50'),
(6, 'Fantastique', 'les histoires les plus de la terre ', NULL, '2025-06-03 12:16:55', '2025-06-21 12:16:55'),
(9, 'roman', 'les meilleurs animees de tous les temps', NULL, '2025-06-18 12:16:12', '2025-06-26 12:16:12'),
(10, 'Poésie', 'la poesie dans le sang', NULL, NULL, NULL),
(16, 'Voyage', 'tout ce qu\'il y\'a a savoir sur les voyages ', NULL, NULL, NULL),
(17, 'Sciences', 'pour les parsionnes des sciences', NULL, NULL, NULL),
(19, 'Économie', 'deviens le maitre de l\'economie ', NULL, NULL, NULL),
(20, 'Philosophie', 'livre de philosophie', NULL, NULL, NULL),
(21, 'Cuisine', 'Livres de cuisine et de gastronomie', NULL, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(23, 'Cuisine Italienne', 'Spécialités italiennes', 21, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(24, 'Cuisine Asiatique', 'Spécialités asiatiques', 21, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(25, 'Pâtisserie', 'Livres de pâtisserie et desserts', NULL, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(26, 'Gâteaux', 'Recettes de gâteaux', 25, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(27, 'Biscuits', 'Recettes de biscuits', 25, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(28, 'Chocolats', 'Recettes de chocolats', 25, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(29, 'Vins et Spiritueux', 'Livres sur les vins et spiritueux', NULL, '2025-04-24 17:08:00', '2025-04-24 17:08:00');

-- --------------------------------------------------------

--
-- Structure de la table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
CREATE TABLE IF NOT EXISTS `commentaires` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `utilisateur_id` bigint UNSIGNED NOT NULL,
  `ouvrage_id` bigint UNSIGNED NOT NULL,
  `note` int NOT NULL DEFAULT '0',
  `statut` enum('en_attente','approuve','rejete') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commentaires_utilisateur_id_foreign` (`utilisateur_id`),
  KEY `commentaires_ouvrage_id_foreign` (`ouvrage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `commentaires`
--

INSERT INTO `commentaires` (`id`, `contenu`, `utilisateur_id`, `ouvrage_id`, `note`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Un peu déçu par la fin. Rapport qualité-prix excellent. \nConcernant \"La Cuisine Française Facile\", c\'est une lecture enrichissante.', 1, 1, 5, 'approuve', '2024-11-24 18:08:35', '2024-11-24 18:08:35'),
(2, 'Excellent livre, je le recommande vivement ! Intéressant mais un peu difficile à comprendre par moments. Rapport qualité-prix excellent. \nConcernant \"La Cuisine Française Facile\", ça vaut vraiment le détour.', 1, 1, 4, 'approuve', '2025-03-11 17:08:35', '2025-03-11 17:08:35'),
(3, 'Je l\'ai lu d\'une traite. \nConcernant \"La Cuisine Française Facile\", je le conseille aux amateurs du genre.', 1, 1, 4, 'approuve', '2025-02-24 18:08:35', '2025-02-24 18:08:35'),
(4, 'Un classique incontournable. \nConcernant \"Le Seigneur des Anneaux : La Communauté de l\'Anneau\", c\'est une lecture enrichissante.', 1, 2, 5, 'en_attente', '2024-09-10 17:08:35', '2024-09-10 17:08:35'),
(5, 'Excellent livre, je le recommande vivement ! Parfait pour débuter dans ce domaine. Idéal pour approfondir ses connaissances. \nConcernant \"Le Seigneur des Anneaux : La Communauté de l\'Anneau\", ça vaut vraiment le détour.', 2, 2, 4, 'approuve', '2024-06-24 17:08:35', '2024-06-24 17:08:35'),
(6, 'Parfait pour débuter dans ce domaine. \nConcernant \"L\'Art de la Programmation en Python\", c\'est une lecture enrichissante.', 3, 3, 5, 'approuve', '2024-08-21 17:08:35', '2024-08-21 17:08:35'),
(7, 'Très bien expliqué, facile à comprendre. \nConcernant \"L\'Art de la Programmation en Python\", c\'est une lecture enrichissante.', 2, 3, 5, 'approuve', '2024-11-17 18:08:35', '2024-11-17 18:08:35'),
(8, 'Rapport qualité-prix excellent. \nConcernant \"One Piece Tome 1\", c\'est une lecture enrichissante.', 3, 4, 4, 'approuve', '2024-11-01 17:08:35', '2024-11-01 17:08:35'),
(9, 'Une lecture passionnante du début à la fin. Je l\'ai lu d\'une traite. Très bien expliqué, facile à comprendre. \nConcernant \"One Piece Tome 1\", je le conseille aux amateurs du genre.', 3, 4, 4, 'approuve', '2024-11-05 18:08:35', '2024-11-05 18:08:35'),
(10, 'Une lecture passionnante du début à la fin. Intéressant mais un peu difficile à comprendre par moments. Idéal pour approfondir ses connaissances. \nConcernant \"Les Fleurs du Mal\", c\'est une lecture enrichissante.', 2, 5, 3, 'en_attente', '2025-02-10 18:08:35', '2025-02-10 18:08:35'),
(11, 'Le style d\'écriture est très agréable. Un peu déçu par la fin. \nConcernant \"Les Fleurs du Mal\", je le conseille aux amateurs du genre.', 3, 5, 4, 'approuve', '2024-05-20 17:08:35', '2024-05-20 17:08:35'),
(12, 'Une lecture passionnante du début à la fin. \nConcernant \"Les Fleurs du Mal\", ça vaut vraiment le détour.', 3, 5, 4, 'approuve', '2025-03-29 17:08:35', '2025-03-29 17:08:35'),
(13, 'Parfait pour débuter dans ce domaine. Belle découverte ! \nConcernant \"Les Fleurs du Mal\", c\'est une lecture enrichissante.', 3, 5, 3, 'approuve', '2025-01-09 18:08:35', '2025-01-09 18:08:35'),
(14, 'Les illustrations sont magnifiques. Un peu cher pour ce que c\'est. \nConcernant \"Les Fleurs du Mal\", ça vaut vraiment le détour.', 3, 5, 3, 'approuve', '2024-12-12 18:08:35', '2024-12-12 18:08:35'),
(15, 'Excellent livre, je le recommande vivement ! Les illustrations sont magnifiques. Un peu déçu par la fin. \nConcernant \"Les Fleurs du Mal\", ça vaut vraiment le détour.', 1, 5, 4, 'en_attente', '2024-07-20 17:08:35', '2024-07-20 17:08:35'),
(16, 'Un peu déçu par la fin. \nConcernant \"Le Guide du Voyageur Galactique\", ça vaut vraiment le détour.', 1, 6, 5, 'approuve', '2024-05-17 17:08:35', '2024-05-17 17:08:35'),
(17, 'Le style d\'écriture est très agréable. Idéal pour approfondir ses connaissances. \nConcernant \"Le Guide du Voyageur Galactique\", je le conseille aux amateurs du genre.', 2, 6, 3, 'approuve', '2024-06-07 17:08:35', '2024-06-07 17:08:35'),
(18, 'Excellent livre, je le recommande vivement ! Rapport qualité-prix excellent. \nConcernant \"Le Guide du Voyageur Galactique\", ça vaut vraiment le détour.', 2, 6, 4, 'approuve', '2024-08-21 17:08:35', '2024-08-21 17:08:35'),
(19, 'Le style d\'écriture est très agréable. \nConcernant \"Le Guide du Voyageur Galactique\", ça vaut vraiment le détour.', 2, 6, 4, 'approuve', '2025-01-20 18:08:35', '2025-01-20 18:08:35'),
(20, 'Je l\'ai lu d\'une traite. \nConcernant \"Le Guide du Voyageur Galactique\", c\'est une lecture enrichissante.', 2, 6, 3, 'approuve', '2024-11-21 18:08:35', '2024-11-21 18:08:35'),
(21, 'Parfait pour débuter dans ce domaine. Idéal pour approfondir ses connaissances. Je l\'ai lu d\'une traite. \nConcernant \"Histoire de l\'Art\", je le conseille aux amateurs du genre.', 1, 7, 5, 'approuve', '2025-01-28 18:08:35', '2025-01-28 18:08:35'),
(22, 'Très bien expliqué, facile à comprendre. \nConcernant \"Histoire de l\'Art\", ça vaut vraiment le détour.', 2, 7, 4, 'approuve', '2025-04-16 17:08:35', '2025-04-16 17:08:35'),
(23, 'Le style d\'écriture est très agréable. Un peu cher pour ce que c\'est. \nConcernant \"Histoire de l\'Art\", c\'est une lecture enrichissante.', 3, 7, 4, 'approuve', '2024-07-12 17:08:35', '2024-07-12 17:08:35'),
(24, 'Intéressant mais un peu difficile à comprendre par moments. Bon livre dans l\'ensemble, quelques longueurs cependant. \nConcernant \"Histoire de l\'Art\", c\'est une lecture enrichissante.', 3, 7, 4, 'approuve', '2025-03-19 17:08:35', '2025-03-19 17:08:35'),
(25, 'Le style d\'écriture est très agréable. \nConcernant \"Histoire de l\'Art\", c\'est une lecture enrichissante.', 3, 7, 4, 'rejete', '2024-04-26 17:08:35', '2025-04-24 18:11:48'),
(26, 'Un classique incontournable. Idéal pour approfondir ses connaissances. Un peu cher pour ce que c\'est. \nConcernant \"Histoire de l\'Art\", ça vaut vraiment le détour.', 3, 7, 5, 'approuve', '2024-05-19 17:08:35', '2024-05-19 17:08:35'),
(27, 'Bon livre dans l\'ensemble, quelques longueurs cependant. Un classique incontournable. Je l\'ai lu d\'une traite. \nConcernant \"Le Sport pour les Nuls\", ça vaut vraiment le détour.', 1, 8, 5, 'approuve', '2024-06-25 17:08:35', '2024-06-25 17:08:35'),
(28, 'Très bien expliqué, facile à comprendre. \nConcernant \"Le Sport pour les Nuls\", ça vaut vraiment le détour.', 3, 8, 5, 'approuve', '2024-12-23 18:08:35', '2024-12-23 18:08:35'),
(29, 'Intéressant mais un peu difficile à comprendre par moments. Rapport qualité-prix excellent. Idéal pour approfondir ses connaissances. \nConcernant \"Le Sport pour les Nuls\", je le conseille aux amateurs du genre.', 2, 8, 5, 'approuve', '2025-02-04 18:08:35', '2025-02-04 18:08:35'),
(30, 'Bon livre dans l\'ensemble, quelques longueurs cependant. Un peu cher pour ce que c\'est. Très bien expliqué, facile à comprendre. \nConcernant \"Méditer Jour Après Jour\", ça vaut vraiment le détour.', 3, 9, 3, 'approuve', '2025-02-13 18:08:35', '2025-02-13 18:08:35'),
(31, 'Bon livre dans l\'ensemble, quelques longueurs cependant. Un peu déçu par la fin. Un peu cher pour ce que c\'est. \nConcernant \"Méditer Jour Après Jour\", c\'est une lecture enrichissante.', 1, 9, 5, 'en_attente', '2025-01-07 18:08:35', '2025-01-07 18:08:35'),
(32, 'Un peu déçu par la fin. \nConcernant \"Méditer Jour Après Jour\", ça vaut vraiment le détour.', 3, 9, 3, 'approuve', '2025-03-14 17:08:35', '2025-03-14 17:08:35'),
(33, 'Rapport qualité-prix excellent. \nConcernant \"Méditer Jour Après Jour\", je le conseille aux amateurs du genre.', 1, 9, 3, 'approuve', '2024-12-28 18:08:35', '2024-12-28 18:08:35'),
(34, 'Un classique incontournable. Belle découverte ! \nConcernant \"Méditer Jour Après Jour\", ça vaut vraiment le détour.', 2, 9, 3, 'rejete', '2024-08-29 17:08:35', '2025-04-24 17:49:55'),
(35, 'Bon livre dans l\'ensemble, quelques longueurs cependant. Rapport qualité-prix excellent. Idéal pour approfondir ses connaissances. \nConcernant \"Méditer Jour Après Jour\", je le conseille aux amateurs du genre.', 2, 9, 3, 'en_attente', '2024-11-01 17:08:35', '2024-11-01 17:08:35'),
(36, 'Excellent livre, je le recommande vivement ! Belle découverte ! Je l\'ai lu d\'une traite. \nConcernant \"Méditer Jour Après Jour\", ça vaut vraiment le détour.', 3, 9, 5, 'rejete', '2024-11-21 18:08:35', '2025-04-24 17:37:38'),
(37, 'Une lecture passionnante du début à la fin. Belle découverte ! \nConcernant \"Les Secrets de l\'Économie\", ça vaut vraiment le détour.', 1, 10, 3, 'en_attente', '2025-02-16 18:08:35', '2025-02-16 18:08:35'),
(38, 'Belle découverte ! \nConcernant \"Les Secrets de l\'Économie\", je le conseille aux amateurs du genre.', 3, 10, 5, 'en_attente', '2025-01-15 18:08:35', '2025-01-15 18:08:35'),
(39, 'Une lecture passionnante du début à la fin. \nConcernant \"Les Secrets de l\'Économie\", je le conseille aux amateurs du genre.', 1, 10, 3, 'rejete', '2024-07-08 17:08:35', '2025-04-24 17:37:53'),
(40, 'Rapport qualité-prix excellent. Un peu cher pour ce que c\'est. \nConcernant \"Les Secrets de l\'Économie\", je le conseille aux amateurs du genre.', 1, 10, 4, 'approuve', '2024-06-08 17:08:35', '2024-06-08 17:08:35'),
(41, 'Excellent livre, je le recommande vivement ! Le style d\'écriture est très agréable. \nConcernant \"Les Secrets de l\'Économie\", je le conseille aux amateurs du genre.', 2, 10, 4, 'approuve', '2025-02-28 18:08:35', '2025-02-28 18:08:35'),
(42, 'alex est fort', 1, 3, 5, 'en_attente', '2025-06-06 14:06:02', '2025-06-06 14:06:02'),
(43, 'j\'ai beaucoup aime le livre. il a ete genial , vous meriter la note', 1, 18, 5, 'en_attente', '2025-06-10 18:59:17', '2025-06-10 18:59:17'),
(44, 'abdulaye le boss', 1, 1, 5, 'rejete', '2025-06-17 23:12:25', '2025-06-17 23:13:02'),
(45, 'cecin est un neauvgdcjhs', 1, 6, 4, 'en_attente', '2025-06-20 19:00:37', '2025-06-20 19:00:37');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_ventes`
--

DROP TABLE IF EXISTS `ligne_ventes`;
CREATE TABLE IF NOT EXISTS `ligne_ventes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `vente_id` bigint UNSIGNED NOT NULL,
  `ouvrage_id` bigint UNSIGNED NOT NULL,
  `utilisateur_id` bigint UNSIGNED NOT NULL,
  `quantite` int NOT NULL,
  `prix_unitaire` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ligne_ventes_vente_id_foreign` (`vente_id`),
  KEY `ligne_ventes_ouvrage_id_foreign` (`ouvrage_id`),
  KEY `ligne_ventes_utilisateur_id_foreign` (`utilisateur_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ligne_ventes`
--

INSERT INTO `ligne_ventes` (`id`, `vente_id`, `ouvrage_id`, `utilisateur_id`, `quantite`, `prix_unitaire`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 2, 2, '45.00', '2024-11-14 20:48:35', '2024-11-14 20:48:35'),
(2, 1, 9, 2, 2, '18.90', '2024-11-14 20:48:35', '2024-11-14 20:48:35'),
(3, 2, 9, 2, 2, '18.90', '2024-12-17 02:15:16', '2024-12-18 02:15:16'),
(4, 3, 1, 2, 2, '29.99', '2025-04-10 13:05:37', '2025-04-15 13:05:37'),
(5, 3, 6, 2, 3, '22.90', '2025-04-02 13:05:37', '2025-04-15 13:05:37'),
(6, 3, 10, 2, 1, '25.00', '2025-04-15 13:05:37', '2025-04-15 13:05:37'),
(7, 4, 1, 2, 2, '29.99', '2025-03-09 01:16:43', '2025-03-09 01:16:43'),
(8, 4, 3, 2, 2, '45.00', '2025-03-09 01:16:43', '2025-03-09 01:16:43'),
(9, 5, 2, 2, 3, '24.90', '2024-12-04 13:16:30', '2024-12-07 13:16:30'),
(10, 6, 1, 3, 1, '29.99', '2025-02-24 20:40:49', '2025-02-24 20:40:49'),
(11, 6, 6, 3, 1, '22.90', '2025-02-24 20:40:49', '2025-02-24 20:40:49');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_04_12_224248_create_ouvrages_table', 1),
(6, '2025_04_12_224603_create_utilisateurs_table', 1),
(7, '2025_04_12_224701_create_categories_table', 1),
(8, '2025_04_12_224742_create_ventes_table', 1),
(9, '2025_04_12_224903_create_ligne_ventes_table', 1),
(10, '2025_04_12_224953_create_stocks_table', 1),
(11, '2025_04_12_225015_create_commentaires_table', 1),
(12, '2025_04_19_213722_add_parent_id_to_categories_table', 1),
(13, '2025_04_23_022633_add_statut_to_utilisateurs_table', 1),
(14, '2025_04_23_023300_add_columns_to_ouvrages_table', 1),
(15, '2025_04_23_023500_add_statut_to_commentaires_table', 1),
(16, '2025_04_23_023600_add_utilisateur_id_to_ventes_table', 1),
(17, '2025_04_23_023700_add_date_vente_to_ventes_table', 1),
(18, '2025_04_24_085644_add_columns_to_stocks_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `ouvrages`
--

DROP TABLE IF EXISTS `ouvrages`;
CREATE TABLE IF NOT EXISTS `ouvrages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `auteur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `editeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isbn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prix` decimal(8,2) NOT NULL,
  `date_publication` date NOT NULL,
  `niveau` enum('amateur','chef','debutant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categorie_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ouvrages_isbn_unique` (`isbn`),
  KEY `ouvrages_categorie_id_foreign` (`categorie_id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ouvrages`
--

INSERT INTO `ouvrages` (`id`, `titre`, `description`, `auteur`, `editeur`, `isbn`, `prix`, `date_publication`, `niveau`, `photo`, `categorie_id`, `created_at`, `updated_at`) VALUES
(1, 'La Cuisine Française Facile', 'Découvrez les secrets de la cuisine française', 'Jean Dupont', 'Editions Culinaires', '978-2-1234-5680-1', '29.99', '2024-01-15', 'amateur', 'livre1.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(2, 'Le Seigneur des Anneaux : La Communauté de l\'Anneau', 'Le premier tome de la célèbre trilogie de Tolkien', 'J.R.R. Tolkien', 'Christian Bourgois', '978-2-2670-1183-7', '24.90', '1954-07-29', 'chef', 'livre2.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(3, 'L\'Art de la Programmation en Python', 'Guide complet pour maîtriser Python', 'Sarah Johnson', 'Editions Tech', '978-2-8765-4321-0', '45.00', '2023-06-15', 'amateur', 'livre3.png', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(4, 'One Piece Tome 1', 'Le début de l\'aventure de Luffy', 'Eiichiro Oda', 'Glénat', '978-2-7234-4757-9', '6.90', '1997-07-22', 'chef', 'livre4.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(5, 'Les Fleurs du Mal', 'Recueil de poèmes de Charles Baudelaire', 'Charles Baudelaire', 'Gallimard', '978-2-0701-2947-8', '19.90', '1857-06-25', 'chef', 'livre5.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(6, 'Le Guide du Voyageur Galactique', 'Un roman de science-fiction humoristique', 'Douglas Adams', 'Denoël', '978-2-2070-3674-1', '22.90', '1979-10-12', 'amateur', 'livre6.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(7, 'Histoire de l\'Art', 'Panorama complet de l\'histoire de l\'art', 'Ernst Gombrich', 'Phaidon', '978-2-8766-5432-1', '49.95', '2023-01-10', 'debutant', 'livre7.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(8, 'Le Sport pour les Nuls', 'Guide complet pour débuter en sport', 'Marc Sportif', 'First', '978-2-7654-3210-9', '22.95', '2024-01-05', 'debutant', 'livre8.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(9, 'Méditer Jour Après Jour', 'Guide pratique de méditation', 'Christophe André', 'L\'Iconoclaste', '978-2-3456-7890-1', '18.90', '2023-09-15', 'debutant', 'livre9.png', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(10, 'Les Secrets de l\'Économie', 'Comprendre l\'économie moderne', 'Thomas Piketty', 'Seuil', '978-2-0123-4567-8', '25.00', '2023-11-30', 'chef', 'livre10.WEBP', 6, '2025-04-24 17:08:00', '2025-04-24 17:08:00'),
(13, 'Naruto Tome 1', 'Suivez l\'histoire de Naruto Uzumaki, un jeune ninja qui cherche à obtenir la reconnaissance de ses pairs et rêve de devenir Hokage, le chef de son village.', 'Masashi Kishimoto', 'Kana', '978-2-8712-9240-8', '6.90', '2002-03-13', 'debutant', 'manga1.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(14, 'Demon Slayer Tome 1', 'Tanjirō Kamado, un jeune marchand de charbon, mène une vie paisible dans les montagnes jusqu\'à ce que sa famille soit attaquée par un démon.', 'Koyoharu Gotouge', 'Panini Manga', '978-2-8094-7654-1', '6.99', '2018-06-06', 'debutant', 'manga3.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(15, 'My Hero Academia Tome 1', 'Dans un monde où 80% de la population possède un super-pouvoir appelé \"Alter\", Izuku Midoriya en est dépourvu. Pourtant, il rêve de rejoindre la filière super-héroïque de la grande académie.', 'Kōhei Horikoshi', 'Ki-oon', '978-2-3550-7453-9', '6.60', '2014-07-07', 'debutant', 'manga4.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(16, 'Dragon Ball Tome 1', 'L\'histoire de Son Goku, un jeune garçon à la queue de singe et à la force surhumaine, qui part à l\'aventure pour rechercher les sept boules de cristal légendaires.', 'Akira Toriyama', 'Glénat', '978-2-7234-5620-5', '6.90', '1984-11-20', 'debutant', 'manga5.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(17, 'Attack on Titan Tome 1', 'Dans un monde où l\'humanité vit entourée d\'immenses murs pour se protéger de créatures gigantesques, les Titans, Eren Jäger jure de se venger après que sa ville natale ait été détruite.', 'Hajime Isayama', 'Pika', '978-2-8116-1301-2', '6.95', '2009-09-09', 'amateur', 'manga6.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(18, 'Death Note Tome 1', 'Light Yagami, un étudiant surdoué, trouve un carnet qui permet de tuer quiconque dont on y inscrit le nom. Il décide de l\'utiliser pour éliminer les criminels.', 'Tsugumi Ōba', 'Kana', '978-2-5050-1230-9', '7.50', '2003-12-01', 'amateur', 'manga7.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(19, 'Jujutsu Kaisen Tome 1', 'Yuji Itadori, un lycéen doté d\'une force surhumaine, rejoint une organisation secrète d\'exorcistes après avoir ingurgité le doigt d\'une créature maléfique.', 'Gege Akutami', 'Ki-oon', '978-2-3550-4317-7', '6.90', '2018-03-05', 'debutant', 'manga8.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(20, 'Hunter × Hunter Tome 1', 'Gon Freecss découvre que son père, qu\'il croyait mort, est en fait un Hunter d\'élite. Il décide alors de partir à sa recherche et de devenir lui-même un Hunter.', 'Yoshihiro Togashi', 'Kana', '978-2-8712-9540-9', '6.85', '1998-03-03', 'debutant', 'manga9.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(21, 'The Seven Deadly Sins Tome 1', 'Dans un monde médiéval, la princesse Elizabeth part à la recherche des légendaires Seven Deadly Sins, un groupe de chevaliers bannis accusés de trahison.', 'Nakaba Suzuki', 'Pika', '978-2-8116-1749-2', '6.95', '2012-10-10', 'debutant', 'manga10.jpeg', 1, '2025-06-06 16:34:48', '2025-06-06 16:34:48'),
(22, 'Le Capital au XXIe siècle', 'Une analyse majeure sur l\'inégalité, la répartition des richesses et la dynamique de l\'économie mondiale à travers les siècles.', 'Thomas Piketty', 'Seuil', '978-2-0212-3026-9889', '25.00', '2013-09-30', 'amateur', 'economie1.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(23, 'Freakonomics', 'Une exploration non conventionnelle des mécanismes cachés de l\'économie quotidienne, mêlant économie comportementale et analyses statistiques.', 'Steven D. Levitt et Stephen J. Dubner', 'Denoël', '978-2-78979-7639-7', '22.50', '2005-04-12', 'debutant', 'economie2.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(24, 'La Richesse des Nations', 'Œuvre fondatrice de l\'économie moderne expliquant les principes de la division du travail, des marchés et du libre-échange.', 'Adam Smith', 'Flammarion', '978-2-67878-1156-6', '29.00', '1776-03-09', 'amateur', 'economie3.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(25, 'La Théorie générale de l\'emploi, de l\'intérêt et de la monnaie', 'Ouvrage révolutionnaire qui a redéfini la macroéconomie moderne, proposant des solutions aux crises économiques.', 'John Maynard Keynes', 'Payot', '978-2-2289-0295-1', '26.50', '1936-02-04', 'chef', 'economie4.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(26, 'Le Choc des Civilisations', 'Une analyse de l\'ordre mondial post-guerre froide et des dynamiques géopolitiques et économiques façonnant le monde moderne.', 'Samuel P. Huntington', 'Odile Jacob', '978-2-8090-0507-0', '23.90', '1996-08-20', 'amateur', 'economie5.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(27, 'Nudge: La méthode douce pour inspirer la bonne décision', 'Comment les choix sont présentés influence nos décisions économiques et comment cette connaissance peut être utilisée pour encourager des comportements bénéfiques.', 'Richard H. Thaler et Cass R. Sunstein', 'Vuibert', '978-2-9080-4346-8', '20.00', '2008-04-08', 'debutant', 'economie6.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(28, 'L\'Économie est un jeu d\'enfant', 'Une introduction accessible aux concepts économiques fondamentaux, présentée de manière simple et ludique.', 'Ha-Joon Chang', 'Flammarion', '978-2-0810-2835-9', '19.90', '2014-08-27', 'debutant', 'economie7.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(29, 'L\'Économie Bleue 3.0', 'Présentation d\'un modèle économique durable inspiré par les écosystèmes naturels, offrant des solutions innovantes aux défis environnementaux et sociaux.', 'Gunter Pauli', 'L\'Observatoire', '789-2-0726-3352-6', '22.00', '2019-02-13', 'amateur', 'economie8.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(30, 'Le Prix de l\'inégalité', 'Une analyse des causes et conséquences des inégalités croissantes dans l\'économie mondiale et comment elles affectent les sociétés.', 'Joseph E. Stiglitz', 'Les Liens qui Libèrent', '978-2-090-3433-2', '24.50', '2012-06-11', 'amateur', 'economie9.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54'),
(31, 'Économie du bien commun', 'Une vision renouvelée de l\'économie qui met l\'accent sur l\'intérêt général plutôt que sur les intérêts particuliers.', 'Jean Tirole', 'PUF', '978-2-1307-2952-99890', '26.00', '2016-05-11', 'amateur', 'economie10.jpeg', 19, '2025-06-06 17:07:54', '2025-06-06 17:07:54');

-- --------------------------------------------------------

--
-- Structure de la table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
CREATE TABLE IF NOT EXISTS `stocks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `ouvrage_id` bigint UNSIGNED NOT NULL,
  `quantite` int NOT NULL,
  `prix_achat` decimal(8,2) NOT NULL,
  `prix_vente` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `seuil_alerte` int NOT NULL DEFAULT '5',
  `emplacement` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `derniere_entree` timestamp NULL DEFAULT NULL,
  `derniere_sortie` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stocks_ouvrage_id_foreign` (`ouvrage_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stocks`
--

INSERT INTO `stocks` (`id`, `ouvrage_id`, `quantite`, `prix_achat`, `prix_vente`, `created_at`, `updated_at`, `seuil_alerte`, `emplacement`, `derniere_entree`, `derniere_sortie`) VALUES
(1, 1, 30, '17.99', '29.99', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 7, 'A-2-10', '2025-03-21 17:08:00', '2025-02-24 20:40:49'),
(2, 2, 44, '14.94', '24.90', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 9, 'E-4-03', '2025-03-31 17:08:00', '2024-12-07 13:16:30'),
(3, 3, 7, '27.00', '45.00', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 5, 'D-3-05', '2025-03-26 17:08:00', '2025-03-09 01:16:43'),
(4, 4, 44, '4.14', '6.90', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 8, 'B-4-13', '2025-03-07 18:08:00', '2025-04-01 17:08:00'),
(5, 5, 0, '11.94', '19.90', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 5, 'B-3-01', '2025-03-16 17:08:00', '2025-04-01 17:08:00'),
(6, 6, 38, '13.74', '22.90', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 8, 'C-1-08', '2025-04-23 17:08:00', '2025-02-24 20:40:49'),
(7, 7, 31, '29.97', '49.95', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 6, 'C-2-01', '2025-03-19 17:08:00', '2025-04-10 17:08:00'),
(8, 8, 38, '13.77', '22.95', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 7, 'D-2-17', '2025-03-10 17:08:00', '2025-04-08 17:08:00'),
(9, 9, 45, '11.34', '18.90', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 9, 'B-2-20', '2025-03-06 18:08:00', '2024-12-18 02:15:16'),
(10, 10, 28, '15.00', '25.00', '2025-04-24 17:08:00', '2025-04-24 17:08:00', 5, 'E-1-05', '2025-04-15 17:08:00', '2025-04-15 13:05:37');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('client','editeur','gestionnaire','administrateur') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateurs_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `adresse`, `telephone`, `photo`, `role`, `email`, `password`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'kamgain', 'alex\r\n', '123 Admin Street', '987654321', NULL, 'administrateur', 'admin@admin.com', '$2y$10$m6YEQ4r1RLBU.kZgJi//Mea4NHo.yXF2GCrcSj7maa9inkmIJpNi2', 'actif', '2025-04-24 17:08:25', '2025-04-24 17:08:25'),
(2, 'youssouf', 'Gning', '456 Manager Street', '123456789', NULL, 'gestionnaire', 'manager@test.com', '$2y$10$ZgnX.BVI45i5mCgtsJE8E.14jbRnkEgHeWey5Ifp4Ss15/sgmkRUS', 'actif', '2025-04-24 17:08:25', '2025-04-24 17:08:25'),
(3, 'abdoulaye', 'coulibaly', '789 Editor Street', '456789123', NULL, 'editeur', 'editor@test.com', '$2y$10$53NM8HYIoYO2EYy.bF21Ju4W1retxU8AjVeonp3JbqQ1tx3rihjzG', 'actif', '2025-04-24 17:08:25', '2025-04-24 17:08:25'),
(5, 'alex', 'kamgain', '1922 rue sabatier', '314324', '', '', 'abdoulcoulibaly168@gmail.com', '$2b$12$wPfTk/umb01LbWsx6KXhEumx2shpfemGUoYLLKn433HmVVwZqwa0S', '', '2025-05-26 21:58:27', '2025-05-26 21:58:27'),
(6, 'alex', 'kevin', 'szdfghj', '45667766', NULL, 'client', 'alexkamgain16@gmail.com', '$2b$12$eRG49TSkXntBUpZwLqcfx.M4BZhXmao8pV4wxezyXMzerWslETgNu', 'actif', '2025-07-17 11:39:06', '2025-07-17 11:39:06');

-- --------------------------------------------------------

--
-- Structure de la table `ventes`
--

DROP TABLE IF EXISTS `ventes`;
CREATE TABLE IF NOT EXISTS `ventes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `utilisateur_id` bigint UNSIGNED NOT NULL,
  `date_vente` datetime NOT NULL,
  `montant_total` decimal(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ventes_utilisateur_id_foreign` (`utilisateur_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ventes`
--

INSERT INTO `ventes` (`id`, `utilisateur_id`, `date_vente`, `montant_total`, `created_at`, `updated_at`) VALUES
(1, 2, '2024-11-14 15:48:35', '127.80', '2024-11-14 20:48:35', '2024-11-14 20:48:35'),
(2, 2, '2024-12-17 21:15:16', '37.80', '2024-12-18 02:15:16', '2024-12-18 02:15:16'),
(3, 2, '2025-04-15 09:05:37', '153.68', '2025-04-15 13:05:37', '2025-04-15 13:05:37'),
(4, 2, '2025-03-08 20:16:43', '149.98', '2025-03-09 01:16:43', '2025-03-09 01:16:43'),
(5, 2, '2024-12-07 08:16:30', '74.70', '2024-12-07 13:16:30', '2024-12-07 13:16:30'),
(6, 3, '2025-02-24 15:40:49', '52.89', '2025-02-24 20:40:49', '2025-02-24 20:40:49');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
