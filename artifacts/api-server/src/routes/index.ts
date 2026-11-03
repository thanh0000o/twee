import { Router, type IRouter } from "express";
import healthRouter from "./health";
import guestbookRouter from "./guestbook";
import visitorsRouter from "./visitors";
import musicRouter from "./music";
import radioRouter from "./radio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(guestbookRouter);
router.use(visitorsRouter);
router.use(musicRouter);
router.use(radioRouter);

export default router;
