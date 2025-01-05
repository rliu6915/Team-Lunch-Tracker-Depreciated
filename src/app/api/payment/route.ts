// // /src/app/api/payment/route.ts

// import { getCurrentPayer, getNextPayer, shiftToNextPayer } from '../../../lib/paymentTracker';
// import { v4 as uuidv4 } from 'uuid';

// let payerHistory: Array<{
//   id: string;
//   payer: string;
//   time: string;
//   restaurantName: string;
//   paymentAmount: number;
// }> = [];

// // Handle GET requests (fetch current and next payers)
// export async function GET() {
//   try {
//     const currentPayer = getCurrentPayer();
//     const nextPayer = getNextPayer();
    
//     return new Response(JSON.stringify({
//       currentPayer,
//       nextPayer,
//       payerHistory,
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
//       status: 500,
//     });
//   }
// }

// // Handle POST requests (shift to the next payer and record the time)
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { restaurantName, paymentAmount } = body;
//     const currentPayer = getCurrentPayer();
//     getNextPayer();
    
//     // Record the current payer and the current timestamp
//     const timestamp = new Date().toLocaleString();
//     const id = uuidv4();
//     payerHistory.push({ id: id, payer: currentPayer, time: timestamp, restaurantName: restaurantName, paymentAmount: paymentAmount });
    
//     // Shift to the next payer
//     shiftToNextPayer();
    
//     return new Response(JSON.stringify({
//       message: 'Shifted to the next payer.',
//       currentPayer: getCurrentPayer(),
//       nextPayer: getNextPayer(),
//       payerHistory,
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
//       status: 500,
//     });
//   }
// }

// // DELETE handler
// export async function DELETE(request: Request) {
//   try {
//     // Parse the request body to get the ID of the entry to delete
//     const { id } = await request.json();

//     // Check if the ID exists in the payerHistory array
//     const index = payerHistory.findIndex((entry) => entry.id === id);
    
//     if (index === -1) {
//       // If the entry does not exist, return a 404 (Not Found)
//       return new Response(JSON.stringify({ message: "History entry not found" }), {
//         status: 404,
//       });
//     }

//     // Remove the entry from the payerHistory array
//     payerHistory = payerHistory.filter((entry) => entry.id !== id);

//     // Return a success response
//     return new Response(JSON.stringify({ message: "Entry deleted successfully" }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error: unknown) {
//     // Handle any errors and return a 500 response
//     let errorMessage = 'Something went wrong: '
//     if (error instanceof Error) {
//       errorMessage += error.message
//       return new Response(
//         JSON.stringify({
//           message: "Internal Server Error",
//           error: errorMessage,
//         }),
//         {
//           status: 500,
//         }
//       );
//     }
//   }
// }

// pages/api/payer-history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Payment } from '../../../models/payment';
import { Payer } from '../../../models/payer';
import { connectToDatabase } from '../../../lib/db';

// Handler for GET requests
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase();

    const payments = await Payment.findAll({
      include: [Payer],
    });

    const payerHistory = payments.map(payment => ({
      id: payment.id,
      payer: payment.payer.payerName,
      time: payment.time.toISOString(),
      restaurantName: payment.restaurantName,
      paymentAmount: payment.paymentAmount,
    }));

    res.status(200).json({ success: true, history: payerHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payer history' });
  }
};

// Handler for POST requests
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payerId, time, restaurantName, paymentAmount } = req.body;

  try {
    await connectToDatabase();

    const newPayment = await Payment.create({
      payerId,
      time,
      restaurantName,
      paymentAmount,
    });

    res.status(201).json({ success: true, payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create new payment' });
  }
};

// Handler for DELETE requests
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  try {
    await connectToDatabase();

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    await payment.destroy();

    res.status(200).json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

// Main handler that routes based on HTTP method
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
