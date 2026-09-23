  // Initialize usersDB with predefined users
  let usersDB = {
    "ravi": { password: "10364", balance: 5000, history: [] },
    "chandu": { password: "100", balance: 3000, history: [] },
    "alice": { password: "alice123", balance: 7000, history: [] },
    "bob": { password: "bobpass", balance: 2500, history: [] }
  };
  
  // Load usersDB from localStorage if available
  if (localStorage.getItem('usersDB')) {
    usersDB = JSON.parse(localStorage.getItem('usersDB'));
  } else {
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
  }
  
  let currentUser = null;
  
  // Function to display messages
  function displayMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    element.innerText = message;
    element.classList.remove('hidden', 'success', 'error');
    element.classList.add(type);
    setTimeout(() => {
      element.classList.add('hidden');
    }, 3000);
  }
  
  // Function to update localStorage
  function updateLocalStorage() {
    localStorage.setItem('usersDB', JSON.stringify(usersDB));
  }
  
  // Function to show Login Page
  function showLogin() {
    document.getElementById('welcomePage').classList.add('hidden');
    document.getElementById('signUpPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    clearAllMessages();
  }
  
  // Function to show Sign Up Page
  function showSignUp() {
    document.getElementById('welcomePage').classList.add('hidden');
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signUpPage').classList.remove('hidden');
    clearAllMessages();
  }
  
  // Function to show Welcome Page
  function showWelcome() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signUpPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('welcomePage').classList.remove('hidden');
    clearAllMessages();
  }
  
  // Function to clear all messages
  function clearAllMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => msg.classList.add('hidden'));
  }
  
  // Function to handle Login
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
  
    if (usersDB[username] && usersDB[username].password === password) {
      currentUser = username;
      displayMessage('loginMessage', 'Login successful!', 'success');
      setTimeout(() => {
        showDashboard();
      }, 1000);
    } else {
      displayMessage('loginMessage', 'Invalid username or password!', 'error');
    }
  });
  
  // Function to handle Sign Up
  document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signUpUsername').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
  
    if (username && password) {
      if (usersDB[username]) {
        displayMessage('signUpMessage', 'Username already exists! Try a different one.', 'error');
      } else {
        usersDB[username] = { password: password, balance: 0, history: [] };
        updateLocalStorage();
        displayMessage('signUpMessage', 'Account created successfully! Redirecting to login...', 'success');
        setTimeout(showLogin, 2000);
      }
    } else {
      displayMessage('signUpMessage', 'Please enter both username and password.', 'error');
    }
  });
  
  // Function to show Dashboard
  function showDashboard() {
    document.getElementById('welcomePage').classList.add('hidden');
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signUpPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('userWelcome').innerText = currentUser;
    updateDashboard();
  }
  
  // Function to update Dashboard
  function updateDashboard() {
    const userData = usersDB[currentUser];
    document.getElementById('balance').innerText = userData.balance.toFixed(2);
    displayTransactionHistory(userData.history);
  }
  
  // Function to display Transaction History
  function displayTransactionHistory(history) {
    const historyDiv = document.getElementById('transactionHistory');
    historyDiv.innerHTML = '';
    if (history.length === 0) {
      historyDiv.innerHTML = '<p>No transactions yet.</p>';
      return;
    }
    history.forEach((tx, index) => {
      const txType = tx.type;
      const amount = tx.amount.toFixed(2);
      const detail = tx.detail ? ` - ${tx.detail}` : '';
      historyDiv.innerHTML += `<p>${index + 1}. ${txType}: $${amount}${detail}</p>`;
    });
  }
  
  // Function to handle Deposit
  document.getElementById('creditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('creditAmount').value);
    if (isNaN(amount) || amount <= 0) {
      displayMessage('transactionMessage', 'Please enter a valid amount to deposit.', 'error');
      return;
    }
    usersDB[currentUser].balance += amount;
    usersDB[currentUser].history.push({ type: 'Deposit', amount: amount, detail: null });
    updateLocalStorage();
    updateDashboard();
    displayMessage('transactionMessage', `Successfully deposited $${amount.toFixed(2)}.`, 'success');
    document.getElementById('creditAmount').value = '';
  });
  
  // Function to handle Withdraw
  document.getElementById('debitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('debitAmount').value);
    if (isNaN(amount) || amount <= 0) {
      displayMessage('transactionMessage', 'Please enter a valid amount to withdraw.', 'error');
      return;
    }
    if (usersDB[currentUser].balance < amount) {
      displayMessage('transactionMessage', 'Insufficient balance.', 'error');
      return;
    }
    usersDB[currentUser].balance -= amount;
    usersDB[currentUser].history.push({ type: 'Withdraw', amount: amount, detail: null });
    updateLocalStorage();
    updateDashboard();
    displayMessage('transactionMessage', `Successfully withdrew $${amount.toFixed(2)}.`, 'success');
    document.getElementById('debitAmount').value = '';
  });
  
  // Function to handle Send Money
  document.getElementById('sendMoneyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const recipient = document.getElementById('recipientUsername').value.trim();
    const amount = parseFloat(document.getElementById('sendAmount').value);
  
    if (!usersDB[recipient]) {
      displayMessage('transactionMessage', 'Recipient does not exist.', 'error');
      return;
    }
  
    if (recipient === currentUser) {
      displayMessage('transactionMessage', 'You cannot send money to yourself.', 'error');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      displayMessage('transactionMessage', 'Please enter a valid amount to send.', 'error');
      return;
    }
  
    if (usersDB[currentUser].balance < amount) {
      displayMessage('transactionMessage', 'Insufficient balance.', 'error');
      return;
    }
  
    // Perform the transaction
    usersDB[currentUser].balance -= amount;
    usersDB[recipient].balance += amount;
  
    // Record transaction for sender
    usersDB[currentUser].history.push({
      type: 'Sent',
      amount: amount,
      detail: `to ${recipient}`
    });
  
    // Record transaction for recipient
    usersDB[recipient].history.push({
      type: 'Received',
      amount: amount,
      detail: `from ${currentUser}`
    });
  
    updateLocalStorage();
    updateDashboard();
    displayMessage('transactionMessage', `Successfully sent $${amount.toFixed(2)} to ${recipient}.`, 'success');
    document.getElementById('recipientUsername').value = '';
    document.getElementById('sendAmount').value = '';
  });
  
  // Function to handle Logout
  function logout() {
    currentUser = null;
    document.getElementById('dashboardPage').classList.add('hidden');
    showWelcome();
    displayMessage('welcomeMessage', 'Logged out successfully!', 'success');
  }
  
  // Function to open Modal
  function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
  }
  
  // Function to close Modal
  function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  }
  
  // Function to close all modals
  function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.add('hidden'));
    document.getElementById('overlay').classList.add('hidden');
  }

  // Function to view all accounts
function viewAccounts() {
    const accountsList = document.getElementById('accountsList');
    accountsList.innerHTML = ''; // Clear previous list
  
    // Loop through usersDB and list all accounts with username and balance
    for (const [username, data] of Object.entries(usersDB)) {
      const accountDiv = document.createElement('div');
      accountDiv.classList.add('account-item');
      accountDiv.innerHTML = `<strong>Username:</strong> ${username} | <strong>Balance:</strong> $${data.balance.toFixed(2)}`;
      accountsList.appendChild(accountDiv);
    }
  
    // Show the accounts modal
    openModal('accountsModal');
  }
  
  // Function to open any modal by ID
  function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById('overlay').classList.remove('hidden');
  }
  
  // Function to close any modal by ID
  function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById('overlay').classList.add('hidden');
  }
  
  // Function to close all modals
  function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.add('hidden'));
    document.getElementById('overlay').classList.add('hidden');
  }
  