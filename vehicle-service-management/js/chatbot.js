/**
 * Vehicle Service Management System (VSMS) - AI Service Assistant / Chatbot
 */

const BOT_RESPONSES = [
  {
    keywords: ['noise', 'sound', 'squeak', 'rattle', 'clunk'],
    reply: "Strange noises usually indicate worn brake pads, dried suspension bushings, or loose drive belts. We recommend a <b>Comprehensive Periodic Checkup</b> or <b>Brake Inspection</b> to pinpoint the issue.",
    actionLink: "booking.html?serviceId=SRV-006",
    actionText: "Book Brake Inspection"
  },
  {
    keywords: ['ac', 'cooling', 'chill', 'hot air', 'smell', 'odor'],
    reply: "If your AC is blowing warm air or has a foul smell, your system might have low R134a refrigerant gas or a clogged cabin filter. Our <b>Complete AC Inspection & Refrigerant Gas Refill</b> restores ice-cold cabin cooling in under 2 hours.",
    actionLink: "service-details.html?id=SRV-008",
    actionText: "View AC Service Details"
  },
  {
    keywords: ['brake', 'stopping', 'pedal', 'vibration', 'judder'],
    reply: "Soft brake pedals or high-pitched squealing usually indicate ceramic pad wear or disc rotor scoring. Never compromise on brake safety! Our certified technicians inspect calipers, fluid, and rotors.",
    actionLink: "service-details.html?id=SRV-006",
    actionText: "Check Brake Packages"
  },
  {
    keywords: ['bike', 'motorcycle', 'starting', 'kick', 'scooter', 'royal enfield'],
    reply: "If your 2-wheeler is struggling to start, check the spark plug gap (standard 0.75mm) and battery terminal voltage. We offer complete 30-point bike tune-ups and chain lubrication.",
    actionLink: "service-details.html?id=SRV-016",
    actionText: "Motorcycle Tune-up"
  },
  {
    keywords: ['cost', 'price', 'pricing', 'rate', 'how much', 'charge'],
    reply: "Our transparent pricing starts from: <br>• <b>Basic Periodic Service:</b> ₹1,499<br>• <b>Standard Full Service:</b> ₹3,499<br>• <b>Bike Periodic Service:</b> ₹799<br>• <b>AC Overhaul:</b> ₹2,499<br>All services include warranty and complimentary wash!",
    actionLink: "services.html",
    actionText: "View Full Price Catalogue"
  },
  {
    keywords: ['book', 'appointment', 'schedule', 'slot', 'time'],
    reply: "You can book a service appointment online in 3 easy steps: select your vehicle, choose your required services, and pick an available time slot.",
    actionLink: "booking.html",
    actionText: "Book Appointment Now"
  },
  {
    keywords: ['track', 'status', 'where is my car', 'job card'],
    reply: "You can track your live service status anytime using your Booking ID or Vehicle Number in our 9-step tracking portal.",
    actionLink: "track-service.html",
    actionText: "Track Service Status"
  }
];

function initChatbot() {
  const toggler = document.getElementById('vsms-chat-toggler');
  const popup = document.getElementById('vsms-chat-popup');
  const closeBtn = document.getElementById('vsms-chat-close');
  const sendBtn = document.getElementById('vsms-chat-send');
  const input = document.getElementById('vsms-chat-input');
  const messagesContainer = document.getElementById('vsms-chat-messages');

  if (!toggler || !popup) return;

  toggler.addEventListener('click', () => {
    popup.classList.toggle('active');
    if (popup.classList.contains('active') && input) {
      input.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
    });
  }

  function handleSend(text = null) {
    const query = text || (input ? input.value.trim() : '');
    if (!query) return;

    if (input) input.value = '';

    // Append User Message
    appendMessage(query, 'user');

    // Generate Bot Reply
    setTimeout(() => {
      generateBotResponse(query);
    }, 450);
  }

  if (sendBtn) sendBtn.addEventListener('click', () => handleSend());
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Quick chips
  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      handleSend(chip.textContent);
    });
  });

  function appendMessage(htmlContent, sender = 'bot') {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = htmlContent;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function generateBotResponse(userText) {
    const lower = userText.toLowerCase();
    let matched = BOT_RESPONSES.find(res => res.keywords.some(kw => lower.includes(kw)));

    let botHtml = '';
    if (matched) {
      botHtml = `
        ${matched.reply}
        ${matched.actionLink ? `
          <div style="margin-top: 0.6rem;">
            <a href="${matched.actionLink}" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">
              ${matched.actionText} <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        ` : ''}
      `;
    } else {
      botHtml = `
        I understand you have an automotive query. Our expert service advisors are available 24/7 to diagnose mechanical, electrical, and AC issues.<br><br>
        <div style="margin-top: 0.4rem;">
          <a href="booking.html" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;">
            Book General Diagnosis
          </a>
        </div>
      `;
    }

    appendMessage(botHtml, 'bot');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChatbot();
});
