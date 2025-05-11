export function whatzapp(name: string, phone: string) {
    const brTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        hour12: false,
    });
    
    const hour = parseInt(brTime, 10);

    let greeting = "Boa tarde";
    if (hour >= 0 && hour < 12) {
        greeting = "Bom dia";
    } else if (hour >= 18) {
        greeting = "Boa noite";
    }

    const message = `Oi, ${name}, ${greeting}, como você está? Venha nos fazer uma visita, temos cultos: Domingo de manhã às 10:00, Domingo à noite às 18:30 e quartas-feiras às 19:30. Que Deus abençoe sua vida`;
    const encodedMessage = encodeURIComponent(message);
    return window.location.href = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
}
