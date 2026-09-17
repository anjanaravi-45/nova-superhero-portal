/* =========================================
   NOVA CHATBOT
========================================= */

/*
   This project is now a pure front-end app.
   Update the email below to your real FormSubmit address
   before you publish the site.
*/

const FORMSUBMIT_EMAIL = "anjanaanju.4404@gmail.com";


/* =========================================
   CHAT STATE
========================================= */

let currentStep = 0;

let visitor = {
    name: "",
    age: "",
    location: "",
    email: "",
    grievance: ""
};


/* =========================================
   DOM ELEMENTS
========================================= */

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");


/* =========================================
   QUESTIONS
========================================= */

const questions = [
    "Nice to meet you! ⚡ How old are you?",
    "Got it. 📍 Where are you currently located?",
    "Thanks! 📧 What is your email address?",
    "So... tell me. How can I help you?"
];


/* =========================================
   ADD NOVA MESSAGE
========================================= */

function addNovaMessage(text) {

    const message = document.createElement("div");

    message.className = "message nova-message";

    message.innerHTML = `
        <div class="message-avatar">
            ⚡
        </div>

        <div class="message-bubble">
            ${escapeHTML(text)}
        </div>
    `;

    chatMessages.appendChild(message);

    scrollChat();
}


/* =========================================
   ADD USER MESSAGE
========================================= */

function addUserMessage(text) {

    const message = document.createElement("div");

    message.className =
        "message user-message";

    message.innerHTML = `
        <div class="message-bubble">
            ${escapeHTML(text)}
        </div>
    `;

    chatMessages.appendChild(message);

    scrollChat();
}


/* =========================================
   SCROLL CHAT
========================================= */

function scrollChat() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* =========================================
   TYPING INDICATOR
========================================= */

function showTyping() {

    const typing = document.createElement("div");

    typing.className =
        "message nova-message";

    typing.id = "typingMessage";

    typing.innerHTML = `
        <div class="message-avatar">
            ⚡
        </div>

        <div class="message-bubble typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatMessages.appendChild(typing);

    scrollChat();
}


function hideTyping() {

    const typing =
        document.getElementById("typingMessage");

    if (typing) {
        typing.remove();
    }
}


/* =========================================
   DELAYED NOVA MESSAGE
========================================= */

function delayedNovaMessage(
    text,
    delay = 700
) {

    showTyping();

    setTimeout(() => {

        hideTyping();

        addNovaMessage(text);

    }, delay);
}


/* =========================================
   EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);
}


/* =========================================
   AGE VALIDATION
========================================= */

function isValidAge(age) {

    const number =
        Number(age);

    return (
        Number.isInteger(number) &&
        number >= 1 &&
        number <= 120
    );
}


/* =========================================
   PROCESS ANSWER
========================================= */

async function processAnswer(answer) {

    const cleanAnswer =
        answer.trim();

    if (!cleanAnswer) {
        return;
    }


    /* STEP 0 - NAME */

    if (currentStep === 0) {

        if (cleanAnswer.length < 2) {

            delayedNovaMessage(
                "Please tell me your name so I know what to call you. ⚡"
            );

            return;
        }

        visitor.name =
            cleanAnswer;

        addUserMessage(cleanAnswer);

        currentStep = 1;

        delayedNovaMessage(
            questions[0]
        );

        return;
    }


    /* STEP 1 - AGE */

    if (currentStep === 1) {

        if (!isValidAge(cleanAnswer)) {

            delayedNovaMessage(
                "Please enter a valid age between 1 and 120. 🦸"
            );

            return;
        }

        visitor.age =
            cleanAnswer;

        addUserMessage(cleanAnswer);

        currentStep = 2;

        delayedNovaMessage(
            questions[1]
        );

        return;
    }


    /* STEP 2 - LOCATION */

    if (currentStep === 2) {

        if (cleanAnswer.length < 2) {

            delayedNovaMessage(
                "Please tell me your location. 📍"
            );

            return;
        }

        visitor.location =
            cleanAnswer;

        addUserMessage(cleanAnswer);

        currentStep = 3;

        delayedNovaMessage(
            questions[2]
        );

        return;
    }


    /* STEP 3 - EMAIL */

    if (currentStep === 3) {

        if (!isValidEmail(cleanAnswer)) {

            delayedNovaMessage(
                "Hmm... that email doesn't look right. Please enter a valid email address. 📧"
            );

            return;
        }

        visitor.email =
            cleanAnswer;

        addUserMessage(cleanAnswer);

        currentStep = 4;

        delayedNovaMessage(
            questions[3]
        );

        return;
    }


    /* STEP 4 - GRIEVANCE */

    if (currentStep === 4) {

        if (cleanAnswer.length < 5) {

            delayedNovaMessage(
                "Please tell me a little more about the problem so I can understand your signal. 💙"
            );

            return;
        }

        visitor.grievance =
            cleanAnswer;

        addUserMessage(cleanAnswer);

        currentStep = 5;

        await submitRequest();

        return;
    }


    /* AFTER SUBMISSION */

    if (currentStep === 5) {

        delayedNovaMessage(
            "Your previous request has already been received. ⚡ If you have another issue, please refresh the page to start a new conversation."
        );

    }
}


/* =========================================
   SUBMIT REQUEST
========================================= */

async function submitRequest() {

    delayedNovaMessage(
        "I understand, " +
        visitor.name +
        ". I'm sending your request to the command center..."
    );


    /*
       Wait for Nova message animation.
    */

    await new Promise(resolve =>
        setTimeout(resolve, 1200)
    );


    try {

        const response =
            await fetch(
                `https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: visitor.name,
                        age: visitor.age,
                        location: visitor.location,
                        email: visitor.email,
                        grievance: visitor.grievance
                    })
                }
            );


        let data = {};

        try {
            data = await response.json();
        } catch (error) {
            data = {};
        }


        if (!response.ok || data.error) {
            throw new Error(
                data.message ||
                "Request submission failed."
            );
        }


        delayedNovaMessage(
            "✅ Mission accomplished!\n\nYour request has been successfully submitted.\n\nThe Nova command center has received your signal by email. ⚡",
            500
        );


        messageInput.disabled = true;

        sendButton.disabled = true;

    }

    catch (error) {

        console.error(
            "Submission error:",
            error
        );

        currentStep = 4;

        delayedNovaMessage(
            "⚠️ I couldn't send your signal through FormSubmit. Please update the email address in script.js with your real FormSubmit email and try again."
        );

    }
}


/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    messageInput.value = "";

    sendButton.disabled = true;

    await processAnswer(text);

    sendButton.disabled =
        currentStep === 5;
}


/* =========================================
   BUTTON CLICK
========================================= */

sendButton.addEventListener(
    "click",
    sendMessage
);


/* =========================================
   ENTER KEY
========================================= */

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }

    }
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}