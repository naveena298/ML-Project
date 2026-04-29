let selectedScheme = "";
const API_BASE = "http://127.0.0.1:5000";

// ============ LOGIN ============
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const errorBox = document.getElementById("error");
    const errorText = document.getElementById("errorText");

    // Validation
    if (!username || !password) {
        errorText.textContent = "Please enter username and password";
        errorBox.classList.remove("hidden");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            // Hide login, show dashboard
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("dashboard").classList.remove("hidden");
            errorBox.classList.add("hidden");
        } else {
            errorText.textContent = data.message || "Invalid credentials";
            errorBox.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Login error:", error);
        errorText.textContent = "Connection error. Please try again.";
        errorBox.classList.remove("hidden");
    }
}

// ============ LOGOUT ============
function logout() {
    selectedScheme = "";
    document.getElementById("dashboard").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("error").classList.add("hidden");
    document.getElementById("result").classList.add("hidden");
    
    // Clear selected schemes
    document.querySelectorAll(".scheme-card").forEach(c => {
        c.classList.remove("selected");
    });
}

// ============ SELECT SCHEME ============
function selectScheme(name, element) {
    selectedScheme = name;

    // Remove selection from all cards
    document.querySelectorAll(".scheme-card").forEach(card => {
        card.classList.remove("selected");
    });

    // Add selection to clicked card
    element.classList.add("selected");
    
    // Hide previous results
    document.getElementById("result").classList.add("hidden");
    document.getElementById("allResults").classList.add("hidden");
    document.getElementById("demandAsOf").classList.add("hidden");
}

// ============ FORECAST ============
async function forecast() {
    if (!selectedScheme) {
        alert("⚠️ Please select a scheme first");
        return;
    }

    const resultBox = document.getElementById("result");
    const allResultsBox = document.getElementById("allResults");
    const loadingBox = document.getElementById("loading");
    const forecastBtns = document.querySelectorAll(".forecast-btn");

    try {
        // Show loading state
        loadingBox.classList.remove("hidden");
        resultBox.classList.add("hidden");
        allResultsBox.classList.add("hidden");
        forecastBtns.forEach(btn => btn.disabled = true);

        const response = await fetch(`${API_BASE}/api/forecast`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                scheme: selectedScheme
            })
        });

        const data = await response.json();

        loadingBox.classList.add("hidden");

        if (data.success) {
            // Display results
            displayResults(data);
            resultBox.classList.remove("hidden");
        } else {
            alert(`❌ Error: ${data.error || "Failed to get prediction"}`);
        }
    } catch (error) {
        console.error("Forecast error:", error);
        loadingBox.classList.add("hidden");
        alert("❌ Connection error. Make sure the server is running.");
    } finally {
        forecastBtns.forEach(btn => btn.disabled = false);
    }
}

// ============ FORECAST ALL ============
async function forecastAll() {
    const resultBox = document.getElementById("result");
    const allResultsBox = document.getElementById("allResults");
    const demandAsOf = document.getElementById("demandAsOf");
    const loadingBox = document.getElementById("loading");
    const forecastBtns = document.querySelectorAll(".forecast-btn");

    try {
        loadingBox.classList.remove("hidden");
        resultBox.classList.add("hidden");
        allResultsBox.classList.add("hidden");
        demandAsOf.classList.add("hidden");
        forecastBtns.forEach(btn => btn.disabled = true);

        const response = await fetch(`${API_BASE}/api/forecast_all`);
        const data = await response.json();

        loadingBox.classList.add("hidden");

        if (data.success) {
            displayAllResults(data);
            demandAsOf.classList.remove("hidden");
            allResultsBox.classList.remove("hidden");
        } else {
            alert(`❌ Error: ${data.error || "Failed to get all predictions"}`);
        }
    } catch (error) {
        console.error("Forecast all error:", error);
        loadingBox.classList.add("hidden");
        alert("❌ Connection error. Make sure the server is running.");
    } finally {
        forecastBtns.forEach(btn => btn.disabled = false);
    }
}

// ============ DISPLAY ALL RESULTS ============
function displayAllResults(data) {
    const tbody = document.getElementById("allResultsBody");
    const demandDate = document.getElementById("demandDate");
    const totalSchemes = document.getElementById("totalSchemes");

    tbody.innerHTML = "";
    demandDate.textContent = data.demand_as_of;
    totalSchemes.textContent = data.results.length;

    data.results.forEach(item => {
        const row = document.createElement("tr");

        // Scheme Name
        const schemeCell = document.createElement("td");
        schemeCell.className = "px-6 py-4 font-medium text-gray-900";
        schemeCell.textContent = item.scheme;

        // Predicted Demand
        const demandCell = document.createElement("td");
        demandCell.className = "px-6 py-4 text-gray-700 font-semibold";
        demandCell.textContent = Number(item.predicted_demand).toFixed(2) + "%";

        // Status Badge
        const statusCell = document.createElement("td");
        statusCell.className = "px-6 py-4";
        const statusBadge = document.createElement("span");
        statusBadge.className = `status-${item.status}`;
        statusBadge.textContent = item.status.replace('-', ' ').toUpperCase();
        statusCell.appendChild(statusBadge);

        // Insight
        const insightCell = document.createElement("td");
        insightCell.className = "px-6 py-4 text-gray-600";
        insightCell.textContent = item.insight;

        row.appendChild(schemeCell);
        row.appendChild(demandCell);
        row.appendChild(statusCell);
        row.appendChild(insightCell);
        tbody.appendChild(row);
    });
}

// ============ DISPLAY RESULTS ============
function displayResults(data) {
    const resultBox = document.getElementById("result");
    
    // Update text
    document.getElementById("schemeName").textContent = data.scheme;
    document.getElementById("demandLevel").textContent = data.insight;
    document.getElementById("prev").textContent = Number(data.previous_demand).toFixed(2);
    document.getElementById("pred").textContent = Number(data.predicted_demand).toFixed(2);
    document.getElementById("rec").textContent = data.recommendation;
    document.getElementById("conf").textContent = data.confidence;

    // Update recommendation box styling
    const recBox = document.getElementById("recBox");
    recBox.className = "rounded-lg p-6 h-full flex flex-col justify-between";
    
    if (data.status === "high") {
        recBox.classList.add("high");
    } else if (data.status === "moderate-high") {
        recBox.classList.add("moderate-high");
    } else if (data.status === "moderate") {
        recBox.classList.add("moderate");
    } else {
        recBox.classList.add("low");
    }

    // Update demand bar
    const demandValue = Math.max(0, Math.min(100, Number(data.predicted_demand)));
    const barColor = getBarColor(demandValue);
    const demandBar = document.getElementById("demandBar");
    demandBar.style.width = demandValue + "%";
    demandBar.style.background = barColor;

    // Show with animation
    resultBox.classList.remove("hidden");
}

// ============ GET BAR COLOR ============
function getBarColor(demand) {
    if (demand > 80) return "linear-gradient(to right, #34d399, #10b981)";      // Green
    if (demand > 60) return "linear-gradient(to right, #fbbf24, #f59e0b)";      // Yellow-Orange
    if (demand > 40) return "linear-gradient(to right, #fb923c, #f97316)";      // Orange
    return "linear-gradient(to right, #f87171, #ef4444)";                        // Red
}

// ============ ENTER KEY SUPPORT ============
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
        passwordInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                login();
            }
        });
    }
});
