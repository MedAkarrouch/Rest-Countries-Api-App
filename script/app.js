"use strict";
const modeBtn = document.getElementById("mode");
const form = document.querySelector(".form");
const formSelect = document.querySelector(".form__select");
const formContent = document.querySelector(".form__content");
const filtercontinent = document.querySelector(".form__select-main");
const input = document.querySelector("input");
const filter = document.getElementById("filter");
const filterList = document.querySelector(".form__select-list");
const countries = document.querySelector(".countries");
const deleteInputBtn = document.querySelector(".form__select-close");
const filterHeight = filter.getBoundingClientRect().height;
const h1 = document.querySelector("h1");
const header = document.getElementById("header");
const inputBox = document.querySelector(".form__input-box");

class App {
  #data;
  #dataFiltered;
  constructor() {
    this._renderLazyLoadingCard();
    this._getCountries();
    this._makeNavSticky();
    // Event handlers
    filter.addEventListener("click", this._toggleDropdown);
    deleteInputBtn.addEventListener("click", this._clearInput.bind(this));
    input.addEventListener("input", this._updateCountries.bind(this));
    filterList.addEventListener(
      "click",
      this._renderContinentClicked.bind(this)
    );
    modeBtn.addEventListener("click", this._changeMode);
    window.addEventListener("resize", this._resizeContinents);
    h1.addEventListener("click", this._scrollToTop);
  }

  _toggleDropdown() {
    formSelect.style.height = "50px";
    formSelect.classList.toggle("showDropdown");
    const filterHeight = filter.getBoundingClientRect().height;

    const height = filterList.getBoundingClientRect().height;
    if (formSelect.classList.contains("showDropdown")) {
      // formSelect.classList.remove("showDropdown");
      filterList.style.height = `${height}px`;
      formSelect.style.height = `${height + filterHeight}px`;
      return;
    }
    formSelect.style.height = `${filterHeight}px`;
    filterList.style.height = "0";
    // formSelect.classList.add("showDropdown");
  }
  _renderContinentClicked(e) {
    const continent = e.target.id;
    let newDataArr = this.#data;
    if (continent === "All Continent") {
      document.getElementById(continent).remove();
      this._insertContinent(filtercontinent.textContent);
      this.#dataFiltered = this.#data;
    } else {
      newDataArr = this.#data.filter((data) =>
        data.continents[0].includes(continent)
      );
      this.#dataFiltered = newDataArr;
      // set Filter
      filterList
        .querySelectorAll("li")
        .forEach((li) => li.classList.toggle("hidden", li.id === continent));
      document.getElementById(continent).classList.add("hidden");
      if (!document.getElementById("All Continent")) this._insertContinent();
    }
    input.value = "";

    filtercontinent.textContent = continent;
    this._toggleDropdown();
    countries.innerHTML = "";
    this._renderLazyLoadingCard(newDataArr.length);
    setTimeout(() => {
      this._renderCountries(newDataArr);
    }, 500);
  }
  _insertContinent(con = "All Continent") {
    const continent = `<li id ="${con}" class="form__select-item">${con}</li>`;
    filterList.insertAdjacentHTML("afterbegin", continent);
  }
  _renderLazyLoadingCard(n = 250) {
    const html = `<div class="country">

        <div class="country__img-box">
          <div id="img" class="country__img skeleton " src="" alt=" "></div>
        </div>

        <div class="country__info">
          <div id="name" class="country__name skeleton-txt skeleton"></div>
          <div class="country__population-box skeleton-txt skeleton">
          </div>
          <div class="country__region-box skeleton-txt skeleton">
          </div>
          <div class="country__capital-box skeleton-txt skeleton">
          </div>
        </div>
      </div>`;
    for (let i = 0; i < n; i++) {
      countries.insertAdjacentHTML("beforeend", html);
    }
  }
  _renderCountries(countriesArr) {
    countries.innerHTML = "";
    for (let country of countriesArr) {
      const html = `<div class="country">
      <div class="country__img-box">
            <img id="img" class="country__img skeleton" src="${
              country.flags.png
            }" alt="">
          </div>
  
          <div class="country__info">
            <div id="name" class="country__name">${country.name.common}</div>
            <div class="country__population-box ">
              <span class="country__key">Population :</span>
              <span id="population" class="country__population">${country.population.toLocaleString()}</span>
            </div>
            <div class="country__region-box">
              <span class="country__key">Region :</span>
              <span id="region" class="country__region">${country.region}</span>
            </div>
            <div class="country__capital-box">
            <span class="country__key">Capital :</span>
            <span id="capital" class="country__capital">${
              country.capital
            }</span>
            </div>
            </div>
        </div>`;
      countries.insertAdjacentHTML("beforeend", html);
    }
  }
  async _getCountries() {
    try {
      const responses = await fetch("https://restcountries.com/v3.1/all");
      this.#data = await responses.json();
      this.#dataFiltered = this.#data;
      // countries.innerHTML = "";
      this._renderCountries(this.#data);
      inputBox.style.opacity = 1;
      inputBox.style.visibility = "visible";
      formSelect.style.opacity = 1;
      formSelect.style.visibility = "visible";
    } catch (err) {
      console.error(err);
    }
  }
  _updateCountries(e) {
    let newDataArr = this.#dataFiltered;
    if (input.value) {
      const val = input.value.toLowerCase();
      newDataArr = this.#dataFiltered.filter((data) =>
        data.name.common.toLowerCase().startsWith(val)
      );
    }
    countries.innerHTML = "";
    if (!newDataArr.length) return;
    this._renderLazyLoadingCard(newDataArr.length);
    setTimeout(() => {
      this._renderCountries(newDataArr);
    }, 500);
  }
  _clearInput() {
    input.value = input.dataset.val = "";
    this._renderCountries(this.#data);
  }
  _changeMode() {
    document.documentElement.classList.toggle("dark");
  }
  _resizeContinents() {
    const filterHeight = filter.getBoundingClientRect().height;

    formSelect.style.height = `${filterHeight}px`;
  }
  _scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  _makeNavSticky() {
    const observeForm = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;

        const headerHeight = header.getBoundingClientRect().height;
        if (entry.isIntersecting) {
          document.body.classList.remove("sticky");
          form.style.removeProperty("margin-top");
          // header.style.removeProperty("position");
        }
        if (!entry.isIntersecting) {
          form.style.marginTop = `${headerHeight}px`;
          document.body.classList.add("sticky");
        }

        // header.classList.toggle('sticky', !entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "150px 0px 0px 0px",
      }
    );
    observeForm.observe(form);
  }
}
const app = new App();
