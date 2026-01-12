import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Livre3D.css';

const Livre3D = ({ book }) => {
  return (
    <HTMLFlipBook width={250} height={300} className="my-book">
      <div className="book-image-container" style={{ backgroundImage: `url(/img/${book.photo})` }}>
  <img
    src={`/img/${book.photo}`}
    alt={book.titre}
    className="book-image-centered"
  />
</div>

      <div className="page">
        <h4>{book.titre}</h4>
        <p><strong>Auteur :</strong> {book.auteur}</p>
        <p><strong>Éditeur :</strong> {book.editeur}</p>
        <p><strong>Prix :</strong> {book.prix} €</p>
      </div>
      <div className="page page-cover" data-density="hard">
        <p>Fin du livre</p>
      </div>
    </HTMLFlipBook>
  );
};

export default Livre3D;
