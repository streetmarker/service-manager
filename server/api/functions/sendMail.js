import axios from 'axios'

async function sendMail (receiverMail, mailSubject, mailContent) {
  const options = {
    method: 'POST',
    url: process.env.NUXT_ENV_SEND_GRID_URL,
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.NUXT_ENV_RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.NUXT_ENV_SEND_GRID_HOST
    },
    data: {
      personalizations: [
        {
          to: [
            {
              email: receiverMail
            }
          ],
          subject: mailSubject
        }
      ],
      from: {
        email: 'powiadomienia@sm.com'
      },
      content: [
        {
          type: 'text/html',
          value: mailContent
        }
      ]
    }
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

export default sendMail
