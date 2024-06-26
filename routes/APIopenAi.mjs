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
    console.log("Chat history: ", chatHistory[phoneNumber]);
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
      // messages: [{ role: "system", content: "You are a helpful assistant." }],
      // model: "gpt-3.5-turbo-16k",
      messages: chatMessage,
      model: modelName,
    });
  
    console.log(JSON.stringify(completion.choices[0]));
    return completion.choices[0].message.content;
  }

  export {initializeMessage, appendChatMessage, appendChatUser, appendChatAssistant, response}