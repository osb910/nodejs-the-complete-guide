const usersList = document.querySelector('.main-header__item-list');
console.log(usersList);

fetch('../../users.txt')
  .then(res => res.text())
  .then(data => {
    const users = data.split('\n');
    console.log(users);
  });
