const create_password = document.querySelector("#create_password");
const confirm_password = document.querySelector("#confirm_password");
const login = document.querySelector("#login");
const signup = document.querySelector("#signup");
const signup_btn = document.querySelector("#signup_btn");
const login_btn = document.querySelector("#login_btn");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const next = document.querySelector(".next");
const showres = document.querySelector(".showres");
const question = document.querySelector(".question");
const option1 = document.querySelector(".option1");
const option2 = document.querySelector(".option2");
const option3 = document.querySelector(".option3");
const option4 = document.querySelector(".option4");

if (confirm_password) {
    confirm_password.addEventListener("input", () => {
        if (create_password.value !== confirm_password.value) {
            confirm_password.style.border = "red 2.8px solid";
        } else {
            confirm_password.style.border = "none";
        }
    });
}

if (signup_btn) {
    signup_btn.addEventListener("click", () => {
        console.log('Sign up button clicked');
        window.location.href = "index.html";
    });
}

if (login_btn) {
    login_btn.addEventListener("click", () => {
        console.log('Login button clicked');
        window.location.href = "login.html";
    });
}

if (login) {
    login.addEventListener("click", () => {
        console.log('Login button clicked');
        let loginfetchurl = `http://localhost:3333/user/findUser/${username.value}`;
        fetch(loginfetchurl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((user) => {
            console.log(user);
            if (username.value === user.username && email.value === user.email && password.value === user.password) {
                window.location.href = "home.html";
            } else {
                alert("Invalid credentials");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("An error occurred during login");
        });
    });
}

if (signup) {
    signup.addEventListener("click", () => {
        console.log('Sign up button clicked');
        fetch("http://localhost:3333/user/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: confirm_password.value
            })
        })
        .then(() => {
            console.log("Signup successful");
            window.location.href = "home.html";
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("An error occurred during signup");
        });
    });
}

let questions = []; // To store fetched questions
let question_no = 0; // Current question index
let total_questions = 0;
let selectedOption = null;

// Fetch and display profile name
const profileName = document.querySelector(".profilename");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Fetch from localStorage
if (loggedInUser) {
    profileName.textContent = loggedInUser.username; // Update profile name
}

// Update progress bar
const progressBar = document.querySelector(".progress-bar");
const progressLabel = document.querySelector(".progress-label");

function updateProgressBar() {
    const progress = ((question_no + 1) / total_questions) * 100; // +1 because question_no is 0-indexed
    progressBar.style.width = `${progress}%`;
    progressLabel.textContent = `${Math.round(progress)}%`; // Update progress label
}

// Reset option colors
function resetOptions() {
    const options = document.querySelectorAll(".options span");
    options.forEach((option) => {
        option.classList.remove("selected", "correct", "incorrect");
    });
}

// Load and display the current question
function loadQuestion() {
    const currentQuestion = questions[question_no];
    document.querySelector(".question").textContent = currentQuestion.question;
    document.querySelector(".option1").textContent = currentQuestion.options[0];
    document.querySelector(".option2").textContent = currentQuestion.options[1];
    document.querySelector(".option3").textContent = currentQuestion.options[2];
    document.querySelector(".option4").textContent = currentQuestion.options[3];

    resetOptions(); // Reset option colors for the new question
    updateProgressBar(); // Update progress bar
}

// Select Option functionality
const options = document.querySelectorAll(".options span");
options.forEach((option) => {
    option.addEventListener("click", () => {
        if (selectedOption) {
            selectedOption.classList.remove("selected"); // Deselect the previously selected option
        }
        option.classList.add("selected"); // Select the clicked option
        selectedOption = option;
    });
});

// Show Results functionality
document.querySelector(".showres").addEventListener("click", () => {
    if (!selectedOption) {
        alert("Please select an option first!");
        return;
    }

    const correctOption = questions[question_no].correct_option;
    const options = document.querySelectorAll(".options span");

    options.forEach((option) => {
        if (option.textContent === correctOption) {
            option.classList.add("correct"); // Highlight correct answer
        } else if (option === selectedOption && option.textContent !== correctOption) {
            option.classList.add("incorrect"); // Highlight incorrect selected answer
        }
    });
});

// Next Question functionality
document.querySelector(".next").addEventListener("click", () => {
    if (question_no < total_questions - 1) {
        question_no++;
        selectedOption = null; // Reset selected option
        loadQuestion();
    } else {
        alert("Quiz completed!");
    }
});

// Fetch questions from JSON file
async function fetchQuestions() {
    try {
        const response = await fetch("questions.json"); // Fetch from the JSON file
        questions = await response.json(); // Parse the JSON data
        total_questions = questions.length; // Set total number of questions
        loadQuestion(); // Load the first question
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Initial fetch
document.addEventListener("DOMContentLoaded", fetchQuestions);