const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());


// Routes
app.get("/", (req, res) => {
    res.json({
        message: "CodeVector Backend Running"
    });
});

app.get("/products", async (req, res) => {
    try {
        const category = req.query.category;

        const cursorUpdatedAt = req.query.cursorUpdatedAt;
        const cursorId = req.query.cursorId;

        const snapshotTime = req.query.snapshotTime || new Date().toISOString();// browsing wala time

        const products = await prisma.product.findMany({
            take: 20,

            where: {
                ...(category ? { category } : {}),
                updatedAt: {
                    lte: new Date(snapshotTime)//lte ====== less than or equal to(updatedTime <= snapshotTime) for new products
                }
            },

            orderBy: [
                { updatedAt: "desc" },
                { id: "desc" }
            ],

            ...(cursorUpdatedAt && cursorId
                ? {
                    cursor: {
                        updatedAt_id: {
                            updatedAt: new Date(cursorUpdatedAt),
                            id: cursorId
                        }
                    },
                    skip: 1
                }
                : {})
        });

        const lastProduct =
            products.length > 0
                ? products[products.length - 1]
                : null;

        res.json({
            data: products,

            snapshotTime,

            nextCursor: lastProduct
                ? {
                    updatedAt: lastProduct.updatedAt,
                    id: lastProduct.id
                }
                : null
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});