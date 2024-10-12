const express = require("express");
const Together = require('together-ai');
const cors = require('cors');

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json())
app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});


// Define the new API endpoint
app.post('/api/culinary-craft', async (req, res) => {
    try {
        const input1 = req.body.ingredient1
        const input2 = req.body.ingredient2
        console.log(input1)
        console.log(input2)

        // Together API request
        const response = await together.chat.completions.create({
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text":
                                `# Culinary Craft: A Cooking-Themed Infinite Craft Prompt\n\nYou are a creative culinary combination system for a game called Culinary Craft. In this game, players combine two ingredients or dishes to create a new ingredient, dish, or culinary concept. Your task is to generate a new, logical, and often innovative result based on the two input ingredients or dishes.\n\nInput ingredients: [INGREDIENT1], [INGREDIENT2]\n\nRules:\n1. The result should be a single 
                                ingredient, dish name, or short culinary phrase (maximum 3 words) with one emoji best representing the result. Just give the result.\n2. The result should have a logical connection to both input ingredients.\n3. Be creative and playful - unexpected but logical combinations are encouraged.\n4. Consider various cooking techniques, cultural fusion, and modern gastronomy trends.\n5. If the combination doesn't make culinary sense, output \"Inedible Mixture🤢\" or reuse one of the input ingredients.\n6. Avoid non-food items or unsafe combinations.\n7. Do take note of dishes from different cultures/all over the world. Prefer specific dishes or ingredients over general categories when possible.\n8. 
                                If the two ingredients are identical, consider outputting a concentrated or refined version of that ingredient.\n9. If the either of the two ingredients contains profanity, you can't figure out an answer, or the inputs do not make sense or the inputs do not mix well, output \"Inedible Mixture🤢\".\n\nExamples:\n- Tomato + Cheese = Pizza🍕\n- Flour + Water = Dough 🌾\n- Chicken + Waffle = Chicken and Waffles🧇\n- Soy Sauce + Wasabi = Sushi Condiment🍣\n- Milk + Culture = Yogurt🍶\n- Potato + Deep Fryer = French Fries🍟\n- Egg + Whisk = Meringue🧁\n- Cocoa + Milk = Hot Chocolate🍫
                                \n- Rice + Seaweed = Sushi Roll🍣\n- Strawberry + Ice = Strawberry Sorbet🍧\n- Mango + Rice = Mango Sticky Rice🍚\n- Zucchini + Tomato = Ratatouille🥘
                                \nNow, based on these rules and examples, what would be the result of combining ${input1} and ${input2}?\n\nRemember to never explain your answer. Just give the result (maximum 3 words). Result:`
                        }
                    ]
                }
            ],
            model: 'meta-llama/Llama-Vision-Free',
            max_tokens: 512,
            temperature: 1.5,
            top_p: 0.7,
            top_k: 50,
            repetition_penalty: 1,
            stop: ['<|eot_id|>', '<|eom_id|>'],
            truncate: 130560,
        });

        console.log(response)

        // Send the AI response back to the client
        res.json({
            status: 'success',
            result: response.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your request.',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
