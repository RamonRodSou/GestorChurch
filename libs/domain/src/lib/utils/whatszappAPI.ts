function getGreeting(): string {
    const brTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        hour12: false,
    });

    const hour = parseInt(brTime, 10);

    if (hour >= 0 && hour < 12) return "Bom dia";
    if (hour >= 18) return "Boa noite";
    return "Boa tarde";
}

function formatName(name: string): string {
    const firstName = name.split(" ")[0].toLowerCase();
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

export async function sendWhatsappMessage(name: string, phone: string, customMessage: string) {
    const formattedName = formatName(name);
    const greeting = getGreeting();

    const message = `Olá ${formattedName}! ${greeting}, ${customMessage}`;
    const encodedMessage = encodeURIComponent(message);

    return await window.open(
        `https://api.whatsapp.com/send/?phone=+55${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`
    );
}
