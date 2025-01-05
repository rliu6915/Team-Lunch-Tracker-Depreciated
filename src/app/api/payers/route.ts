import { NextResponse } from 'next/server';
import { Payer } from '../../../models/payer';
import { connectToDatabase, sequelize } from '../../../lib/db';
import { Op } from 'sequelize'; 

// Handler for GET requests (Fetch all payers)
export async function GET() {
  try {
    await connectToDatabase();

    const payers = await Payer.findAll({
      order: [['orderNumber', 'ASC']],
    });
    console.log("payers: ", payers);

    return NextResponse.json({ success: true, payers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch payers' }, { status: 500 });
  }
}

// Handler for POST requests (Create new payer)
export async function POST(req: Request) {
  const { payerName } = await req.json();

  try {
    await connectToDatabase();

    const lastPayer = await Payer.findOne({
      order: [['orderNumber', 'DESC']],
    });

    const newOrder = lastPayer ? lastPayer.orderNumber + 1 : 1;

    const newPayer = await Payer.create({
      payerName,
      orderNumber: newOrder,
    });

    return NextResponse.json({ success: true, payer: newPayer }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create new payer' }, { status: 500 });
  }
}

// Handler for PUT requests (Update payer's order)
export async function PUT(req: Request) {
  const { id, newOrder } = await req.json();

  try {
    await connectToDatabase();

    const payer = await Payer.findByPk(id);

    if (!payer) {
      return NextResponse.json({ error: 'Payer not found' }, { status: 404 });
    }

    const currentOrder = payer.order;

    if (currentOrder === newOrder) {
      return NextResponse.json({ error: 'New order is the same as the current order' }, { status: 400 });
    }

    // Update orders of other payers
    if (newOrder > currentOrder) {
      await Payer.update(
        { order: sequelize.literal('order - 1') },
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
        { order: sequelize.literal('order + 1') },
        {
          where: {
            order: {
              [Op.between]: [newOrder, currentOrder - 1],
            },
          },
        }
      );
    }

    payer.order = newOrder;
    await payer.save();

    return NextResponse.json({ success: true, payer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update payer' }, { status: 500 });
  }
}

// Handler for DELETE requests (Delete a payer)
export async function DELETE(req: Request) {
  const { id } = await req.json();

  try {
    await connectToDatabase();

    const payer = await Payer.findByPk(id);

    if (!payer) {
      return NextResponse.json({ error: 'Payer not found' }, { status: 404 });
    }

    const deletedOrder = payer.order;

    await payer.destroy();

    await Payer.update(
      { order: sequelize.literal('order - 1') },
      {
        where: {
          order: {
            [Op.gt]: deletedOrder,
          },
        },
      }
    );

    return NextResponse.json({ success: true, message: 'Payer deleted and orders updated' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete payer' }, { status: 500 });
  }
}