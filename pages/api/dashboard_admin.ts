import { NextApiRequest, NextApiResponse } from "next";
import { VerifyAdminToken } from "../verify/veriify_admin";
import ConnectMongoDB from "../db/db";
import cors from "cors";
import PesananModel from "../models/pesanan";
const corsMiddleware = cors();


ConnectMongoDB();
export default async function DashboardAdmin(req: NextApiRequest, res: NextApiResponse) {

    corsMiddleware(req, res, async () => {
        if (req.method == 'GET') { // mendapatkan list semua admin
            VerifyAdminToken(req, res, async () => {
                try {

                    //jumlah pesanan
                    const totalCount = await PesananModel.countDocuments();

                    // total seluruh penjualan
                    const totalHargaSum = await PesananModel.aggregate([
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$total_harga' },
                            },
                        },
                    ]);

                    // pesanan bulan ini
                    const currentMonthCount = await PesananModel.countDocuments({
                        tanggal: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        },
                    });

                    // pendapatan bulan ini
                    const currentMonthSum = await PesananModel.aggregate([
                        {
                            $match: {
                                tanggal: {
                                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                total: { $sum: '$total_harga' },
                            },
                        },
                    ]);

                    res.status(200).json({
                        totalCountData: totalCount,
                        totalHargaSum: totalHargaSum[0]?.total || 0,
                        currentMonthCount,
                        currentMonthSum: currentMonthSum[0]?.total || 0,
                    });
                } catch (error) {
                    res.status(500).json({ message: 'Internal server error' });
                }
            });
        } else {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

    });

}