import { NotFound } from '../model/error';
import { Repository } from 'typeorm';
import Garbage from '../entity/garbage';

class GarbageService {
    garbageRepository: Repository<Garbage>;

    constructor(garbageRepository: Repository<Garbage>) {
        this.garbageRepository = garbageRepository;
    }

    create = async (req: { name: string; price: number; image: string }) => {
        const garbage = this.garbageRepository.create(req);

        return await this.garbageRepository.save(garbage);
    };

    fetch = async () => {
        const garbages = await this.garbageRepository.find();
        return garbages;
    };

    fetchOneId = async (garbageId: number) => {
        const garbage = await this.garbageRepository.findOne({
            where: { id: garbageId },
        });

        if (!garbage) throw new NotFound('Garbage not found');

        return garbage;
    };

    fetchOneName = async (garbageName: string) => {
        const garbage = await this.garbageRepository.findOne({
            where: { name: garbageName },
        });

        if (!garbage) throw new NotFound('Garbage not found');

        return garbage;
    };
}

export default GarbageService;
