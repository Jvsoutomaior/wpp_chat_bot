import axios from "axios";
import dotenv from 'dotenv';
import express from 'express';
import { ChatCompletionStreamingRunner } from "openai/lib/ChatCompletionStreamingRunner.mjs";
import {initializeMessage, appendChatMessage, appendChatUser, appendChatAssistant, response} from "./APIopenAi.mjs";


dotenv.config();
const { GRAPH_API_TOKEN } = process.env;



let chatHistory = {};

function receiveMessage(phoneNumber, message, systemprompt) {
  
  if (!chatHistory[phoneNumber]) {
    chatHistory[phoneNumber] = initializeMessage(systemprompt);
  }

  chatHistory = appendChatUser(chatHistory,phoneNumber, message);
}


function getChatHistory(phoneNumber) {
  return chatHistory[phoneNumber] || [];
}


const router = express.Router();

router.post("/webhook", async (req, res) => {
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
  
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    
    if (message?.type === "text") {
      const business_phone_number_id = req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      let phoneNumber = message.from;

      receiveMessage(phoneNumber, message.text.body, "Voce atuara como um assistente virtual");
      
      let result = await response(chatHistory[phoneNumber], "gpt-3.5-turbo-16k");

      chatHistory = appendChatAssistant(chatHistory, phoneNumber, result);
  
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: phoneNumber,
          text: { body: result },
          context: {
            message_id: message.id,
          },
        },
      });
  
      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    }
  
    res.sendStatus(200);
  });

export default router;