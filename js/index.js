let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;

$(document).ready(() => {
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(300);
        $("body").css("overflow", "visible");
    });
});

// Function to open the side navigation menu
function openSideNav() {
    $(".side-nav-menu").animate({ left: 0 }, 400);
    $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
    $(".links li").each((index, element) => {
        $(element).animate({ top: 0 }, (index + 5) * 100);
    });
}

// Function to close the side navigation menu
function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
    $(".links li").animate({ top: 300 }, 400);
}

// Initialize the side navigation menu as closed
closeSideNav();
$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

// Function to display meals
function displayMeals(arr) {
    let cartoona = "";
    arr.forEach(meal => {
        cartoona += `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>`;
    });
    rowData.innerHTML = cartoona;
}

// Function to fetch and display data with error handling
async function fetchAndDisplay(url, displayFunction) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    try {
        let response = await fetch(url);
        let data = await response.json();
        displayFunction(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

// Fetch and display meal categories
async function getCategories() {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/categories.php`, 
        data => displayCategories(data.categories));
}

// Function to display meal categories
function displayCategories(arr) {
    let cartoona = arr.map(category => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

// Fetch and display meal areas
async function getArea() {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`, data => displayArea(data.meals));
}

// Function to display meal areas
function displayArea(arr) {
    let cartoona = arr.map(area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

// Fetch and display meal ingredients
async function getIngredients() {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
         data => displayIngredients(data.meals.slice(0, 20)));
}

// Function to display meal ingredients
function displayIngredients(arr) {
    let cartoona = arr.map(ingredient => `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`).join("");
    rowData.innerHTML = cartoona;
}

// Fetch and display meals by category
async function getCategoryMeals(category) {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
         data => displayMeals(data.meals.slice(0, 20)));
}

// Fetch and display meals by area
async function getAreaMeals(area) {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`,
         data => displayMeals(data.meals.slice(0, 20)));
}

// Fetch and display meals by ingredient
async function getIngredientsMeals(ingredient) {
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`, data => displayMeals(data.meals.slice(0, 20)));
}

// Fetch and display meal details
async function getMealDetails(mealID) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        let data = await response.json();
        displayMealDetails(data.meals[0]);
    } catch (error) {
        console.error("Error fetching meal details:", error);
    } finally {
        $(".inner-loading-screen").fadeOut(300);
    }
}

// Function to display meal details
function displayMealDetails(meal) {
    searchContainer.innerHTML = "";

    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`);
        }
    }

    let tags = meal.strTags ? meal.strTags.split(",") : [];
    let tagsStr = tags.map(tag => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("");

    let cartoona = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
        <h3>Recipes:</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients.join("")}
        </ul>
        <h3>Tags:</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

    rowData.innerHTML = cartoona;
}

// Function to show search inputs
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4">
        <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;
    rowData.innerHTML = "";
}

// Fetch and display meals by name
async function searchByName(term) {
    closeSideNav();
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`,
       data => data.meals ? displayMeals(data.meals) : displayMeals([]));
}

// Fetch and display meals by first letter
async function searchByFLetter(term) {
    closeSideNav();
    if (term === "") term = "a";
    await fetchAndDisplay(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`, data => 
        data.meals ? displayMeals(data.meals) : displayMeals([]));
}

// Function to show contact form and validate inputs
function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div>`;
    submitBtn = document.getElementById("submitBtn");

    // Add event listeners for input focus to enable validation
    document.getElementById("nameInput").addEventListener("focus", () => nameInputTouched = true);
    document.getElementById("emailInput").addEventListener("focus", () => emailInputTouched = true);
    document.getElementById("phoneInput").addEventListener("focus", () => phoneInputTouched = true);
    document.getElementById("ageInput").addEventListener("focus", () => ageInputTouched = true);
    document.getElementById("passwordInput").addEventListener("focus", () => passwordInputTouched = true);
    document.getElementById("repasswordInput").addEventListener("focus", () => repasswordInputTouched = true);
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

// Function to validate inputs and toggle alerts
function inputsValidation() {
    if (nameInputTouched) {
        document.getElementById("nameAlert").classList.toggle("d-block", !nameValidation());
        document.getElementById("nameAlert").classList.toggle("d-none", nameValidation());
    }
    if (emailInputTouched) {
        document.getElementById("emailAlert").classList.toggle("d-block", !emailValidation());
        document.getElementById("emailAlert").classList.toggle("d-none", emailValidation());
    }
    if (phoneInputTouched) {
        document.getElementById("phoneAlert").classList.toggle("d-block", !phoneValidation());
        document.getElementById("phoneAlert").classList.toggle("d-none", phoneValidation());
    }
    if (ageInputTouched) {
        document.getElementById("ageAlert").classList.toggle("d-block", !ageValidation());
        document.getElementById("ageAlert").classList.toggle("d-none", ageValidation());
    }
    if (passwordInputTouched) {
        document.getElementById("passwordAlert").classList.toggle("d-block", !passwordValidation());
        document.getElementById("passwordAlert").classList.toggle("d-none", passwordValidation());
    }
    if (repasswordInputTouched) {
        document.getElementById("repasswordAlert").classList.toggle("d-block", !repasswordValidation());
        document.getElementById("repasswordAlert").classList.toggle("d-none", repasswordValidation());
    }

    submitBtn.disabled = !(nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation());
}

// Input validation functions
function nameValidation() {
    return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}

function emailValidation() {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value);
}

function phoneValidation() {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
}

function ageValidation() {
    return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
}

function passwordValidation() {
    return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value === document.getElementById("passwordInput").value;
}
