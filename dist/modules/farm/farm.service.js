"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const typeorm_transactional_1 = require("typeorm-transactional");
const utils_1 = require("../../common/utils");
const user_entity_1 = require("../user/user.entity");
const farm_create_dto_1 = require("./dtos/farm-create.dto");
const farm_entity_1 = require("./farm.entity");
let FarmService = class FarmService {
    farmRepository;
    userRepository;
    constructor(farmRepository, userRepository) {
        this.farmRepository = farmRepository;
        this.userRepository = userRepository;
    }
    async createFarm(farmCreateDto) {
        const farm = this.farmRepository.create(farmCreateDto);
        if (farmCreateDto.farmManagerId) {
            const manager = await this.userRepository.findOne({
                where: { id: farmCreateDto.farmManagerId },
            });
            if (manager) {
                farm.farmManager = manager;
            }
            else {
                throw new Error('Manager not found');
            }
        }
        await this.farmRepository.save(farm);
        return farm;
    }
    async getFarms(pageOptionsDto) {
        const queryBuilder = this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.farmManager', 'farmManager');
        const allowedSortColumns = ['farmName'];
        (0, utils_1.applySorting)(queryBuilder, pageOptionsDto, 'farm', allowedSortColumns);
        if (pageOptionsDto.q) {
            queryBuilder.andWhere('LOWER(farm.name) LIKE :name', {
                name: `%${pageOptionsDto.q.toLowerCase().trim()}%`,
            });
        }
        const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
        return items.toPageDto(pageMetaDto);
    }
    async getAllFarms() {
        const queryBuilder = this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.farmManager', 'farmManager')
            .orderBy('farm.name', 'ASC');
        const farms = await queryBuilder.getMany();
        return farms.map((farm) => farm.toDto());
    }
    async getFarm(farmId) {
        const queryBuilder = this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.farmManager', 'farmManager');
        queryBuilder.where('farm.id = :farmId', {
            farmId,
        });
        const farmEntity = await queryBuilder.getOne();
        if (!farmEntity) {
            throw new common_1.NotFoundException('Farm not found!');
        }
        return farmEntity.toDto();
    }
    async deleteFarm(id) {
        const queryBuilder = this.farmRepository
            .createQueryBuilder('farm')
            .where('farm.id = :id', { id });
        const farmEntity = await queryBuilder.getOne();
        if (!farmEntity) {
            throw new common_1.NotFoundException('Farm not found!');
        }
        await this.farmRepository.remove(farmEntity);
    }
    async updateFarm(id, farmDto) {
        const queryBuilder = this.farmRepository
            .createQueryBuilder('farm')
            .leftJoinAndSelect('farm.farmManager', 'farmManager')
            .where('farm.id = :id', { id });
        const farmEntity = await queryBuilder.getOne();
        if (!farmEntity) {
            throw new common_1.NotFoundException('Farm not found!');
        }
        this.farmRepository.merge(farmEntity, farmDto);
        if (!farmDto.farmManagerId) {
            farmEntity.farmManager = null;
        }
        if (farmDto.farmManagerId &&
            farmDto.farmManagerId !== farmEntity.farmManager?.id) {
            const manager = await this.userRepository.findOne({
                where: { id: farmDto.farmManagerId },
            });
            if (manager) {
                farmEntity.farmManager = manager;
            }
            else {
                throw new Error('Manager not found');
            }
        }
        await this.farmRepository.save(farmEntity);
    }
};
exports.FarmService = FarmService;
tslib_1.__decorate([
    (0, typeorm_transactional_1.Transactional)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [farm_create_dto_1.FarmCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], FarmService.prototype, "createFarm", null);
exports.FarmService = FarmService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(farm_entity_1.FarmEntity)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FarmService);
//# sourceMappingURL=farm.service.js.map