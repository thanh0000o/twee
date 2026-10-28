import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guestbookRouter from "./guestbook";
import visitorsRouter from "./visitors";
import musicRouter from "./music";

const router: IRouter = Router();

router.use(healthRouter);
router.use(guestbookRouter);
router.use(visitorsRouter);
router.use(musicRouter);

export default router;
