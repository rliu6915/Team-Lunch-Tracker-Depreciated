// import { NextResponse } from 'next/server';
// import { v4 as uuidv4 } from 'uuid';
// import { Payer } from '../../../lib/paymentTracker'

// // interface Payer {
// //   id: string;
// //   // Add any other properties that a payer might have
// //   payerName: string;
// //   order: number
// // }

// // Simulate a database
// const payers: Payer[] = [];

// // GET request handler (fetch all payers)
// export async function GET() {
//   return NextResponse.json({ payers });
// }

// // POST request handler (add a new payer)
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { payerName } = body;

//   // Simple validation
//   if (!payerName) {
//     return NextResponse.json({ error: "Payer and time are required" }, { status: 400 });
//   }

//   const newPayer = {
//     id: uuidv4(),
//     payerName,
//     order: payers.length + 1,
//   };

//   payers.push(newPayer);
//   return NextResponse.json(newPayer, { status: 201 });
// }

// pages/api/payer.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Payer } from '../../../models/payer';
import sequelize, { connectToDatabase } from '../../../lib/db';
import { Op } from 'sequelize'; 

// Handler for GET requests (Fetch all payers)
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectToDatabase();

    const payers = await Payer.findAll({
      order: [['order', 'ASC']], // Order by 'order' field to maintain sequence
    });

    res.status(200).json({ success: true, payers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payers' });
  }
};

// Handler for POST requests (Create new payer)
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { payerName } = req.body;

  try {
    await connectToDatabase();

    // Find the last order number
    const lastPayer = await Payer.findOne({
      order: [['order', 'DESC']],
    });

    const newOrder = lastPayer ? lastPayer.order + 1 : 1; // Set order to last+1 or 1 if first entry

    const newPayer = await Payer.create({
      payerName,
      order: newOrder,
    });

    res.status(201).json({ success: true, payer: newPayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create new payer' });
  }
};

// Handler for PUT requests (Update payer's order)
const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, newOrder } = req.body;

  try {
    await connectToDatabase();

    const payer = await Payer.findByPk(id);

    if (!payer) {
      return res.status(404).json({ error: 'Payer not found' });
    }

    const currentOrder = payer.order;

    if (currentOrder === newOrder) {
      return res.status(400).json({ error: 'New order is the same as the current order' });
    }

    // Update orders of other payers
    if (newOrder > currentOrder) {
      await Payer.update(
        { order: sequelize.literal('order - 1') }, // Shift others up
        {
          where: {
            order: {
              [Op.between]: [currentOrder + 1, newOrder],
            },
          },
        }
      );
    } else if (newOrder < currentOrder) {
      await Payer.update(
        { order: sequelize.literal('order + 1') }, // Shift others down
        {
          where: {
            order: {
              [Op.between]: [newOrder, currentOrder - 1],
            },
          },
        }
      );
    }

    // Finally update the order of the selected payer
    payer.order = newOrder;
    await payer.save();

    res.status(200).json({ success: true, payer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update payer' });
  }
};

// Handler for DELETE requests (Delete a payer)
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  try {
    await connectToDatabase();

    const payer = await Payer.findByPk(id);

    if (!payer) {
      return res.status(404).json({ error: 'Payer not found' });
    }

    const deletedOrder = payer.order;

    await payer.destroy();

    // Update orders of the remaining payers
    await Payer.update(
      { order: sequelize.literal('order - 1') }, // Shift orders up
      {
        where: {
          order: {
            [Op.gt]: deletedOrder,
          },
        },
      }
    );

    res.status(200).json({ success: true, message: 'Payer deleted and orders updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete payer' });
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
    case 'PUT':
      await handlePut(req, res);
      break;
    case 'DELETE':
      await handleDelete(req, res);
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
