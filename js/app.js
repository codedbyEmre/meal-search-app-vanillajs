const form = document.getElementById('form');
const search = document.getElementById('search');
const heading = document.getElementById('heading');
const mealsEl = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');
const modal = document.getElementById('modal');
const close = document.getElementById('close');

// Event listeners
form.addEventListener('keyup', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if(!searchTerm){
        heading.innerHTML = `Please type in a search term...`;
        mealsEl.innerHTML = '';
        singleMeal.innerHTML = '';
    }else{
        heading.innerHTML = '';
        singleMeal.innerHTML = '';
        searchMeals(searchTerm);
    }
})

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if(item.classList){
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    });

    if(mealInfo){
        const mealId = mealInfo.getAttribute('data-mealID');
        getMealById(mealId);
    }

    modal.style.display = 'block';
})


// Close modal
close.addEventListener('click', () => {
  modal.style.display = 'none';
})

// Show sea foods on home page
const showMealsOnHome = async () => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood`);
    const data = await res.json();

    showMeals(data);
}

showMealsOnHome();

// Search for any meals
const searchMeals = async (term) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await res.json();

    console.log(data);
    showMeals(data);
}

// Show meals on screen
const showMeals = (data) => {

    if(data.meals === null){
        heading.innerHTML = `Meals not found`;
        mealsEl.innerHTML = '';
        singleMeal.innerHTML = '';
    }else{
        heading.innerHTML = `${data.meals.length} meals found`;

        mealsEl.innerHTML = data.meals.map(item => `
        
            <div class = 'meal'>
            
                <img src = '${item.strMealThumb}' alt = '${item.strMeal}' />
    
                <div class = 'meal-info' data-mealID = ${item.idMeal}>
                
                    <h3>${item.strMeal}</h3>
                
                </div>
            
            </div>
        
        `).join('');
    }
}

// Getting meals by their Ids
const getMealById = async meal => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    const data = await res.json();

    addMealToDOM(data.meals[0]);
}

// Adding meals to DOM
const addMealToDOM = (meal) => {
    const ingredients = [];
  
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  
    singleMeal.innerHTML = `
      <div class="single-meal">
        <div class = 'modal-left'>
          <h1>${meal.strMeal}</h1>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
          <div class="single-meal-info">
            <div>
              <h4>Category: </h4>
              ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            </div>
            <div>
              <h4>Area: </h4>
              ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
          </div>
        </div>
        <div class = 'modal-right'>
          <div class="main">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>
          <div class = 'video'>
            <h2>Recipe Video</h2>
            <iframe width="500" height="300" allowfullscreen = 'true'
            src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}">
            </iframe>
          </div>
        </div>
      </div>
    `;
}
