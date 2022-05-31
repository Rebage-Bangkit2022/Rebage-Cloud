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
}

export default GarbageService;
