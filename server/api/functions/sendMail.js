import axios from 'axios'

async function sendMail (receiver, mailSubject, mailContent) {
  const options = {
    method: 'POST',
    url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
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
              email: receiver
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
