document.getElementById("sipForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const amount = document.getElementById("sipAmount").value;
    const rate = document.getElementById("sipRate").value;
    const years = document.getElementById("sipYears").value;

    const response = await fetch("/api/investment/calculateSIP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, rate, years })
    });

    const data = await response.json();
    
    document.getElementById("sipResult").innerHTML = `
        <h3>Results:</h3>
        <p>Total Investment: ₹${data.totalInvestment.toFixed(2)}</p>
        <p>Estimated Returns: ₹${data.estimatedReturns.toFixed(2)}</p>
        <p>Total Value: ₹${data.totalValue.toFixed(2)}</p>
    `;
});
