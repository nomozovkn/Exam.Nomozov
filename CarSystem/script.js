// Show/hide forms
function showLogin() {
  document.getElementById('signupBox').style.display = 'none';
  document.getElementById('loginBox').style.display = '';
  document.getElementById('alertBox').innerHTML = '';
}
function showSignup() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('signupBox').style.display = '';
  document.getElementById('alertBox').innerHTML = '';
}
document.getElementById('showLogin').onclick = showLogin;
document.getElementById('showSignup').onclick = showSignup;

// Sign up

document.getElementById('signupForm').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  if (password !== confirm) {
    showAlert('Passwords do not match!', 'danger');
    return;
  }
  let users = JSON.parse(localStorage.getItem('carUsers') || '[]');
  if (users.find(u => u.username === username)) {
    showAlert('Username already exists!', 'danger');
    return;
  }
  if (users.find(u => u.email === email)) {
    showAlert('Email already registered!', 'danger');
    return;
  }
  users.push({ username, email, password });
  localStorage.setItem('carUsers', JSON.stringify(users));
  showAlert('Account created! Please login.', 'success');
  document.getElementById('signupForm').reset();
  setTimeout(() => {
    showLogin();
    document.getElementById('alertBox').innerHTML = '';
  }, 1200);
};

// Login

document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const userOrEmail = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPassword').value;
  let users = JSON.parse(localStorage.getItem('carUsers') || '[]');
  const user = users.find(u => (u.username === userOrEmail || u.email === userOrEmail) && u.password === password);
  if (!user) {
    showAlert('Invalid credentials!', 'danger');
    return;
  }
  localStorage.setItem('carCurrentUser', JSON.stringify(user));
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('dashboard').style.display = '';
  document.getElementById('alertBox').innerHTML = '';
  renderCars();
};

// Logout

document.getElementById('logoutBtn').onclick = function() {
  localStorage.removeItem('carCurrentUser');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginBox').style.display = '';
  showAlert('Logged out successfully.', 'info');
};

// Render cars on dashboard show
function showDashboard() {
  const user = JSON.parse(localStorage.getItem('carCurrentUser'));
  if (!user) return;
  document.getElementById('signupBox').style.display = 'none';
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('dashboard').style.display = '';
  document.getElementById('alertBox').innerHTML = '';
  hideCarsTable(); // Hide table on dashboard show
}
// Helper
function showAlert(msg, type) {
  document.getElementById('alertBox').innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}
// Auto-login if already logged in
window.onload = function() {
  const user = localStorage.getItem('carCurrentUser');
  if (user) {
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('dashboard').style.display = '';
    hideCarsTable(); // Hide table on auto-login
  }
};
document.getElementById('getAllBtn').onclick = function() {
  renderCars();
  showCarsTable(); // Show table only when Get All is clicked
  showAlert('All cars loaded!', 'info');
};

// Car CRUD logic
function getCars() {
  const user = JSON.parse(localStorage.getItem('carCurrentUser'));
  if (!user) return [];
  return JSON.parse(localStorage.getItem('cars_' + user.username) || '[]');
}
function saveCars(cars) {
  const user = JSON.parse(localStorage.getItem('carCurrentUser'));
  if (!user) return;
  localStorage.setItem('cars_' + user.username, JSON.stringify(cars));
}
function renderCars() {
  const cars = getCars();
  const tbody = document.getElementById('carsTbody');
  tbody.innerHTML = '';
  cars.forEach((car, i) => {
    tbody.innerHTML += `<tr>
      <td>${i+1}</td>
      <td>${car.name}</td>
      <td>${car.brand}</td>
      <td>${car.year}</td>
      <td>${car.color}</td>
      <td>${car.price ? '$'+car.price : ''}</td>
      <td>${car.engine || ''}</td>
      <td>${car.number || ''}</td>
      <td>
        <button class='btn btn-warning btn-sm me-1' onclick='editCar(${i})'>Edit</button>
        <button class='btn btn-danger btn-sm' onclick='deleteCar(${i})' title='Delete'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm3 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-11-1a.5.5 0 0 0-.5.5V4h11V2.5a.5.5 0 0 0-.5-.5h-10zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
          </svg>
        </button>
      </td>
    </tr>`;
  });
}
// Hide car table container
function hideCarsTable() {
  document.getElementById('carsTableContainer').style.display = 'none';
}
// Show car table container
function showCarsTable() {
  document.getElementById('carsTableContainer').style.display = '';
}
function resetCarForm() {
  document.getElementById('carForm').reset();
  editingIndex = null;
  document.getElementById('carForm').querySelector('button[type=submit]').textContent = 'Add Car';
}
let editingIndex = null;
document.getElementById('carForm').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('carName').value.trim();
  const brand = document.getElementById('carBrand').value.trim();
  const year = parseInt(document.getElementById('carYear').value);
  const color = document.getElementById('carColor').value.trim();
  const price = parseFloat(document.getElementById('carPrice').value) || 0;
  const engine = document.getElementById('carEngine').value.trim();
  const number = document.getElementById('carNumber').value.trim();
  let cars = getCars();
  let addedIndex = null;
  if (editingIndex !== null) {
    cars[editingIndex] = { name, brand, year, color, price, engine, number };
    showAlert('Car updated!', 'success');
    saveCars(cars);
    resetCarForm();
    showCarsTable();
    renderCars();
  } else {
    cars.push({ name, brand, year, color, price, engine, number });
    addedIndex = cars.length - 1;
    showAlert('Car added!', 'success');
    saveCars(cars);
    resetCarForm();
    // Show only the last added car
    const tbody = document.getElementById('carsTbody');
    document.getElementById('carsTableContainer').style.display = '';
    tbody.innerHTML = '';
    const car = cars[addedIndex];
    tbody.innerHTML = `<tr class="table-success">
      <td>${addedIndex+1}</td>
      <td>${car.name}</td>
      <td>${car.brand}</td>
      <td>${car.year}</td>
      <td>${car.color}</td>
      <td>${car.price ? '$'+car.price : ''}</td>
      <td>${car.engine || ''}</td>
      <td>${car.number || ''}</td>
      <td>
        <button class='btn btn-warning btn-sm me-1' onclick='editCar(${addedIndex})'>Edit</button>
        <button class='btn btn-danger btn-sm' onclick='deleteCar(${addedIndex})' title='Delete'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm3 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-11-1a.5.5 0 0 0-.5.5V4h11V2.5a.5.5 0 0 0-.5-.5h-10zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
          </svg>
        </button>
      </td>
    </tr>`;
    setTimeout(() => {
      const row = document.querySelector('#carsTable tbody tr');
      if (row) {
        row.scrollIntoView({behavior: 'smooth', block: 'center'});
        setTimeout(() => row.classList.remove('table-success'), 2000);
      }
    }, 100);
  }
  // Hide the form after add
  document.getElementById('carForm').style.display = 'none';
};
function editCar(i) {
  let cars = getCars();
  // If only one row is shown and there are multiple cars, find the correct car
  const tbody = document.getElementById('carsTbody');
  let carIndex = i;
  if (tbody.rows.length === 1 && cars.length > 1) {
    const tds = tbody.rows[0].querySelectorAll('td');
    const name = tds[1].textContent;
    const brand = tds[2].textContent;
    const year = parseInt(tds[3].textContent);
    const number = tds[7].textContent;
    carIndex = cars.findIndex(c => c.name === name && c.brand === brand && c.year === year && c.number === number);
    if (carIndex === -1) {
      showAlert("Car not found!", "danger");
      return;
    }
  }
  const car = cars[carIndex];
  document.getElementById('carName').value = car.name;
  document.getElementById('carBrand').value = car.brand;
  document.getElementById('carYear').value = car.year;
  document.getElementById('carColor').value = car.color;
  document.getElementById('carPrice').value = car.price;
  document.getElementById('carEngine').value = car.engine || '';
  document.getElementById('carNumber').value = car.number || '';
  editingIndex = carIndex;
  document.getElementById('carForm').querySelector('button[type=submit]').textContent = 'Update Car';
  document.getElementById('carForm').style.display = '';
  document.getElementById('carForm').scrollIntoView({behavior: 'smooth', block: 'center'});
  // Hide Add Car and Get All buttons, show back button
  document.getElementById('showAddCarFormBtn').style.display = 'none';
  document.getElementById('getAllBtn').style.display = 'none';
  // Add back button if not exists
  if (!document.getElementById('cancelEditBtn')) {
    const backBtn = document.createElement('button');
    backBtn.id = 'cancelEditBtn';
    backBtn.className = 'btn btn-secondary btn-sm mb-2';
    backBtn.innerText = 'Back';
    backBtn.onclick = function() {
      resetCarForm();
      document.getElementById('carForm').style.display = 'none';
      document.getElementById('showAddCarFormBtn').style.display = '';
      document.getElementById('getAllBtn').style.display = '';
      showAlert('Edit cancelled.', 'info');
    };
    document.getElementById('carForm').parentNode.insertBefore(backBtn, document.getElementById('carForm'));
  }
}
window.editCar = editCar;

function deleteCar(i) {
  let cars = getCars();
  const tbody = document.getElementById('carsTbody');
  let carIndex = i;
  // Fix: Always use strict equality for year and number, and handle single row correctly
  if (tbody.rows.length === 1 && cars.length > 1) {
    const tds = tbody.rows[0].querySelectorAll('td');
    const name = tds[1].textContent.trim();
    const brand = tds[2].textContent.trim();
    const year = parseInt(tds[3].textContent);
    const number = tds[7].textContent.trim();
    carIndex = cars.findIndex(c =>
      c.name === name &&
      c.brand === brand &&
      String(c.year) === String(year) &&
      c.number === number
    );
    if (carIndex === -1) {
      showAlert("Car not found!", "danger");
      return;
    }
  }
  if (!confirm('Delete this car?')) return;
  cars.splice(carIndex, 1);
  saveCars(cars);
  editingIndex = null;
  resetCarForm();
  if (cars.length > 0) {
    showCarsTable();
    renderCars();
  } else {
    hideCarsTable();
  }
  showAlert('Car deleted!', 'info');
}
window.deleteCar = deleteCar;
document.getElementById('showAddCarFormBtn').onclick = function() {
  document.getElementById('carForm').style.display = '';
  document.getElementById('carForm').scrollIntoView({behavior: 'smooth', block: 'center'});
};
