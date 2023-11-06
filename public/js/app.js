// Button Animation
const bar = document.querySelector(".fa-bars");
const menu = document.querySelector(".menu");

bar.addEventListener("click", () => {
  menu.classList.toggle("show-menu");
});

const btnEl = document.querySelector(".btn");

btnEl.addEventListener("mouseover", (event) => {
  const x = event.pageX - btnEl.offsetLeft;
  const y = event.pageY - btnEl.offsetTop;

  btnEl.style.setProperty("--xPos", x + "px");
  btnEl.style.setProperty("--yPos", y + "px");
});

//API
document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20&page=1"
  )
    .then((response) => response.json())
    .then((data) => {
      const cryptoList = document.getElementById("crypto-list");
      data.forEach((crypto) => {
        const cryptoCard = document.createElement("div");
        cryptoCard.classList.add("crypto-card");

        const cryptoLogo = document.createElement("img");
        cryptoLogo.classList.add("crypto-logo");
        cryptoLogo.src = crypto.image;
        cryptoLogo.alt = crypto.name;

        const cryptoName = document.createElement("div");
        cryptoName.classList.add("crypto-name");
        cryptoName.innerText = crypto.name;

        const cryptoPrice = document.createElement("div");
        cryptoPrice.classList.add("crypto-price");
        cryptoPrice.innerText = `$${crypto.current_price.toFixed(2)}`;

        const cryptoChange = document.createElement("div");
        cryptoChange.classList.add("crypto-change");
        cryptoChange.innerText = `${crypto.price_change_percentage_24h.toFixed(
          2
        )}%`;

        cryptoCard.appendChild(cryptoLogo);
        cryptoCard.appendChild(cryptoName);
        cryptoCard.appendChild(cryptoPrice);
        cryptoCard.appendChild(cryptoChange);

        cryptoList.appendChild(cryptoCard);
      });
    })
    .catch((error) => console.error("Error fetching crypto data: ", error));
});
