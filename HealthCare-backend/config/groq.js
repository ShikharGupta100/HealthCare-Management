// require Groq from groq-sdk
// create new Groq instance with:
//   apiKey from process.env.GROQ_API_KEY
// export the instance

const Groq = require("groq-sdk")

const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY
})
module.exports = groq