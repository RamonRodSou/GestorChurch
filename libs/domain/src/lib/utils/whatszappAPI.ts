// export async function whatzapp(name: string, phone: string) {
//     messageFormated(name)

//     const formattedName = name.split(" ")[0].toLowerCase();
//     const capitalizedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
//     const message = `Olá ${capitalizedName}! ${greeting}, como você está? Venha nos fazer uma visita, temos cultos: Domingo de manhã às 10:00, e a noite às 18:30, nas quartas-feiras às 19:30. Que Deus abençoe sua vida!`;

//     const encodedMessage = encodeURIComponent(message);
//     return await window.open(`https://api.whatsapp.com/send/?phone=+55${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`);
// }


// export async function whatzappHelp(name: string, phone: string) {
//     messageFormated(name)

//     const formattedName = name.split(" ")[0].toLowerCase();
//     const capitalizedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
//     const message = `Olá ${capitalizedName}! ${greeting}, poderia me ajudar? Estou com problemas no Admin Church.`;

//     const encodedMessage = encodeURIComponent(message);
//     return await window.open(`https://api.whatsapp.com/send/?phone=+55${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`);
// }


// function messageFormated(name: string) {

//     const brTime = new Date().toLocaleString("en-US", {
//         timeZone: "America/Sao_Paulo",
//         hour: "numeric",
//         hour12: false,
//     });

//     const hour = parseInt(brTime, 10);

//     let greeting = "Boa tarde";
//         if (hour >= 0 && hour < 12) {
//             greeting = "Bom dia";
//         } else if (hour >= 18) {
//             greeting = "Boa noite";
//         }


// }

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
