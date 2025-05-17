import { Router } from "express";

const router = new Router();

router.get('/', (req, res) => {
    res.send('Hello world!')
});

export default router;