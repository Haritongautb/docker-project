import ReceiptModel from "../models/Receipt.js";

export const handleReceipts = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const receipts = await ReceiptModel.find().sort({ createdAt: -1 });
            return res.json(receipts);
        } else if (req.method === 'DELETE') {
            await ReceiptModel.deleteMany({});
            return res.json({
                message: "All receipts have been deleted"
            });
        } else {
            return res.status(405).json({
                message: "Method Not Allowed"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Could not handle receipts data"
        });
    }
}