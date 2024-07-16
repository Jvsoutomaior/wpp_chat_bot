import OpenAI from "openai";

const openai = new OpenAI();

  function initializeMessage(systemprompt){
    return [
      {
        role: "system",
        content: systemprompt,
      },
    ];
  }
  
  function appendChatMessage(chatHistory, role, phoneNumber, text){
    const newMessage = { 
      role: role, 
      content: text 
    };
    chatHistory[phoneNumber].push(newMessage);
    return chatHistory;
  }
  
  function appendChatUser(chatHistory, phoneNumber,  text){
    return appendChatMessage(chatHistory, "user", phoneNumber, text);
  }
  
  function appendChatAssistant(chatHistory, phoneNumber, text){
    return appendChatMessage(chatHistory, "assistant", phoneNumber, text);
  }
  
  async function response(chatMessage, modelName) {
    const completion = await openai.chat.completions.create({
      messages: chatMessage,
      model: modelName,
    });
  
    return completion.choices[0].message.content;
  }

  export {initializeMessage, appendChatMessage, appendChatUser, appendChatAssistant, response}