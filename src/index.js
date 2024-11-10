let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toyCollectionDiv = document.getElementById('toy-collection');
  const toyForm = document.getElementById('add-toy-form');

  // Fetch toys when the page loads
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => toys.forEach(toy => createToyCard(toy, toyCollectionDiv)))
    .catch(error => console.error('Error fetching toys:', error));

  // Handle form submission to add a new toy
  if (toyForm) {
    toyForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const newToy = {
        name: document.getElementById('toy-name').value,
        image: document.getElementById('toy-image').value,
        likes: 0
      };

      // Send POST request to add a new toy
      fetch('http://localhost:3000/toys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newToy)
      })
        .then(response => response.json())
        .then(toy => {
          createToyCard(toy, toyCollectionDiv);
          document.getElementById('toy-name').value = '';
          document.getElementById('toy-image').value = '';
        })
        .catch(console.error);
    });
  } else {
    console.error('Toy form not found!');
  }
});

// Function to create and append the toy card
function createToyCard(toy, container) {
  const card = document.createElement('div');
  card.classList.add('card');

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  container.appendChild(card);

  card.querySelector('.like-btn').addEventListener('click', () => {
    const newLikes = toy.likes + 1;

    // Send PATCH request to update the toy's likes
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes;
      })
      .catch(console.error);
  });
}