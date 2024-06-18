let szabad = true;

function oldalKialakitasa(player) {
  document.getElementById('content').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  document.getElementById('playerNickname').textContent = player.nickname;
  document.getElementById('playerMoney').textContent = player.money;
  document.getElementById('playerCurrency').textContent = player.currency;
}

function helyreallitKepek() {
  document.getElementById('card1').style.backgroundImage = "url('images/manchester_city.png')";
  document.getElementById('card2').style.backgroundImage = "url('images/liverpool.png')";
  document.getElementById('card3').style.backgroundImage = "url('images/tottenham.png')";
}

function pirosKartya(card) {
  console.log('piros');

  let money = document.getElementById('playerMoney').textContent;
  money = parseInt(money, 10);
  const currency = document.getElementById('playerCurrency').textContent;
  console.log(money, currency);
  switch (currency) {
    case 'HUF':
      console.log('HUF');
      money += 10000;
      break;
    case 'EUR':
      console.log('EUR');
      money += 25;
      break;
    case 'USD':
      console.log('USD');
      money += 30;
      break;
    default:
      console.log('RON');
      money += 1250;
      break;
  }
  console.log(money, currency);
  document.getElementById('playerMoney').textContent = money;

  // change the div background image
  document.getElementById(card).style.backgroundImage = "url('images/piros.jpeg')";

  // wait 3 seconds
  setTimeout(() => {
    // change the div background image
    helyreallitKepek();
    szabad = true;
  }, 3000);
}

function zoldKartya(card) {
  console.log('zold');

  let money = document.getElementById('playerMoney').textContent;
  money = parseInt(money, 10);
  const currency = document.getElementById('playerCurrency').textContent;
  console.log(money, currency);

  switch (currency) {
    case 'HUF':
      money -= 2 * 10000;
      break;
    case 'EUR':
      money -= 2 * 25;
      break;
    case 'USD':
      money -= 2 * 30;
      break;
    default:
      money -= 2 * 1250;
      break;
  }
  console.log(money, currency);
  document.getElementById('playerMoney').textContent = money;

  if (money < 0) {
    document.getElementById('game').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }

  // change the div background image
  document.getElementById(card).style.backgroundImage = "url('images/kek.jpeg')";

  // wait 3 seconds
  setTimeout(() => {
    // change the div background image
    helyreallitKepek();
    szabad = true;
  }, 3000);
}

window.onload = () => {
  console.log('window.onload');
  // start button
  document.getElementById('start').addEventListener('click', (event) => {
    event.preventDefault();
    console.log('elmentAdatok');
    const nickname = document.getElementById('nickname').value;
    const money = document.getElementById('money').value;
    const currency = document.getElementById('currency').value;
    console.log(nickname, money, currency);
    const player = { nickname, money, currency };
    oldalKialakitasa(player);
  });

  // click on cards in the images div

  document.getElementById('cards').childNodes.forEach((card) =>
    card.addEventListener('click', (event) => {
      if (szabad) {
        szabad = false;
        // we can get the id of the clicked card
        const { id } = event.target;

        // random number between 1-3
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        // card last character is the number of the card
        let cardNumber = id.charAt(id.length - 1);

        cardNumber = parseInt(cardNumber, 10);

        if (randomNumber === cardNumber) {
          pirosKartya(id);
        } else {
          zoldKartya(id);
        }
      }
    }),
  );

  // 'meguntam' button
  document.getElementById('vege').addEventListener('click', () => {
    document.getElementById('content').style.display = 'block';
    document.getElementById('game').style.display = 'none';
  });
};
