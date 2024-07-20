import axios from 'axios';
import 'dotenv/config';

interface User {
  email: string;
  paymentStatus: string;
  cfReferenceNumber?: number; 
  ticketType?: string; 
}

const users: User[] = [
  { email: 'USER MAIL', paymentStatus: 'initiated', cfReferenceNumber: 12345, ticketType: 'Others' },
  { email: 'USER MAIL', paymentStatus: 'initiated', cfReferenceNumber: 16785, ticketType: 'Others' },
  
];

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN || 'YOUR DOMAIN';
const FRESHDESK_API_URL = `YOUR API URL`;

const API_KEY = process.env.FRESHDESK_API_KEY || 'YOUR API'; 

async function createTicket(user: User) {
  const { email, cfReferenceNumber, ticketType } = user;

  const ticketData = {
    description: `Dear User,\n\nWe have noticed that your payment is initiated, but we haven't received any payment details as mentioned by you from our bank statement. Kindly create another order with correct details within 6 days.\n\nThank you.`,
    subject: 'Payment Follow-Up',
    email: email,
    priority: 1,
    status: 2,
    custom_fields: {
      cf_reference_number: cfReferenceNumber, 
    },
    type: ticketType,
  };

  try {
    const response = await axios.post(FRESHDESK_API_URL, ticketData, {
      auth: {
        username: API_KEY,
        password: 'X', 
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Ticket created for ${email}:`, response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Failed to create ticket for ${email}:`, error.response?.data || error.message);
    } else {
      console.error(`Unexpected error for ${email}:`, error);
    }
  }
}

function processUsers(users: User[]) {
  users
    .filter(user => user.paymentStatus === 'initiated')
    .forEach(user => createTicket(user));
}

processUsers(users);

