import express, { Router, Request, Response } from 'express';
import GeneralError from '../model/error';
import GarbageService from '../service/garbage-service';

class GarbageController {
    garbageService: GarbageService;
    router: Router;

    constructor(garbageService: GarbageService, router?: Router) {
        this.garbageService = garbageService;
        const r = router ?? express.Router();
        this.router = r;

        r.post('/api/garbage', this.create);
        r.get('/api/garbages', this.fetch);
    }

    create = async (
        req: Request<{}, { name: string; price: number; image: string }>,
        res: Response
    ) => {
        try {
            const garbage = await this.garbageService.create(req.body);
            res.json({
                success: true,
                data: garbage,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };

    fetch = async (_req: Request, res: Response) => {
        try {
            const garbages = await this.garbageService.fetch();
            res.json({
                success: true,
                data: garbages,
            });
        } catch (error) {
            GeneralError.handle(error, res);
        }
    };
}

export default GarbageController;
