import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

    const genAI = new GoogleGenerativeAI("AIzaSyBB-RSNnjHC0_g3FQdWGQV-j7kLZM9Q_ng");
    const chatHistory = [];

    function buildSystemInstruction(userName, crushName, relationType) {
      const base = `You are ${crushName}, chatting with ${userName}. Respond in Hinglish + emoji.`;

      const tones = {
        crush: `Flirty, playful, and a little shy 💖☺️`,
        closefriend : `Supportive, caring, and always there for you like a true buddy 🫂😊`,
        "best friend": `Talkative, teasing, always fun 😂💬`,
        ex: `A bit emotional, nostalgic, and dramatic 💔😶‍🌫️`,
        partner: `Romantic, cute, and possessive 😍❤️😘`,
        girlfriend: `Romantic, caring, playful, and sometimes teasing 😘💕😜`,
        boyfriend: `Romantic, caring, playful, and sometimes teasing 😘💕😜`,
        "crush on you": `Sweet, a bit nervous, and dropping subtle hints 😳💌`,
      };

      return `${base} You remember past chats. ${tones[relationType] || tones.crush}`;
    }

    async function chatWithAI(promptText) {
      chatHistory.push({ role: "user", parts: [{ text: promptText }] });

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: chatHistory,
        generationConfig: { temperature: 0.9 },
        systemInstruction: buildSystemInstruction(
          document.getElementById("your-name").value,
          document.getElementById("crush-name").value,
          document.getElementById("relationship-type").value
        )
      });

      const response = result.response.text();
      chatHistory.push({ role: "model", parts: [{ text: response }] });
      appendMessage("ai", response);
    }

    function appendMessage(sender, message) {
      const chatBox = document.getElementById("chat-box");
      const msg = document.createElement("div");
      msg.className = `message ${sender}`;
      msg.innerHTML = `<div class="text">${message}</div>`;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    window.startChat = () => {
      const yourName = document.getElementById("your-name").value.trim();
      const crushName = document.getElementById("crush-name").value.trim();
      const relation = document.getElementById("relationship-type").value;
      if (!yourName || !crushName || !relation) return alert("Please enter all details 💕");
      document.getElementById("setup").style.display = "none";
      document.getElementById("chat").style.display = "flex";
      document.getElementById("chat-header-name").textContent = crushName;
    }

    window.sendMessage = async () => {
      const input = document.getElementById("user-input");
      const message = input.value.trim();
      if (!message) return;
      appendMessage("user", message);
      input.value = "";
      await chatWithAI(message);
    }